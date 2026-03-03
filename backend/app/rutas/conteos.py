from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.modelos.modelos import (
    Conteo, DetalleConteo, Proveedor, Variedad,
    ProveedorVariedad, Malla, EstadoFlor,
    Alerta, ConfiguracionSistema, Usuario
)
from app.esquemas.conteo import ConteoCrear, ConteoRespuesta
from typing import List
from datetime import date
from sqlalchemy import func

router = APIRouter(
    prefix="/conteos",
    tags=["Conteos"]
)

def calcular_total_nacional(detalles, db: Session) -> tuple:
    """
    Calcula el total nacional restando los descabezados.
    Retorna (total_contado, total_nacional)
    """
    total_contado = 0
    total_descabezados = 0

    for detalle in detalles:
        estado = db.query(EstadoFlor).filter(
            EstadoFlor.id == detalle.estado_flor_id
        ).first()
        if not estado:
            raise HTTPException(status_code=404, detail=f"Estado de flor {detalle.estado_flor_id} no encontrado")

        total_contado += detalle.cantidad

        # Solo los descabezados se restan
        if estado.nombre.lower() == "descabezada":
            total_descabezados += detalle.cantidad

    total_nacional = total_contado - total_descabezados
    return total_contado, total_nacional


def verificar_y_generar_alertas(
    conteo: Conteo,
    total_nacional: int,
    proveedor: Proveedor,
    variedad: Variedad,
    db: Session
):
    """
    Motor de comparación y generación de alertas.
    """
    alertas_generadas = []

    # Obtener configuración del umbral
    config_umbral = db.query(ConfiguracionSistema).filter(
        ConfiguracionSistema.clave == "umbral_nacional_pct"
    ).first()
    umbral = float(config_umbral.valor) if config_umbral else 25.0

    # Obtener configuración de alerta nacional cero
    config_cero = db.query(ConfiguracionSistema).filter(
        ConfiguracionSistema.clave == "alerta_nacional_cero"
    ).first()
    alerta_cero = config_cero.valor.lower() == "true" if config_cero else True

    # Obtener total de tallos ingresados en mallas para este proveedor/variedad
    hoy = date.today()
    mallas = db.query(Malla).filter(
        Malla.proveedor_id == proveedor.id,
        Malla.variedad_id == variedad.id,
        func.date(Malla.fecha_ingreso) == hoy
    ).all()

    total_tallos_mallas = sum(m.total_tallos for m in mallas)

    if total_tallos_mallas == 0:
        return alertas_generadas

    # Calcular porcentaje nacional
    porcentaje = (total_nacional / total_tallos_mallas) * 100

    # ALERTA TIPO 1 — Nacional cero
    if alerta_cero and total_nacional == 0:
        alerta = Alerta(
            conteo_id=conteo.id,
            tipo_alerta="nacional_cero",
            descripcion=f"El conteo de flor nacional de {proveedor.codigo} variedad {variedad.nombre} es 0. Verificar.",
            diferencia=0,
            porcentaje_nacional=0,
            umbral_aplicado=umbral
        )
        db.add(alerta)
        alertas_generadas.append("nacional_cero")

    # ALERTA TIPO 2 — Umbral superado
    elif porcentaje > umbral:
        alerta = Alerta(
            conteo_id=conteo.id,
            tipo_alerta="umbral_superado",
            descripcion=f"Nacional de {proveedor.codigo}/{variedad.nombre} supera el {umbral}%. Contado: {total_nacional} tallos ({porcentaje:.1f}% de {total_tallos_mallas})",
            diferencia=total_nacional - int(total_tallos_mallas * umbral / 100),
            porcentaje_nacional=round(porcentaje, 2),
            umbral_aplicado=umbral
        )
        db.add(alerta)
        alertas_generadas.append("umbral_superado")

    return alertas_generadas


@router.post("/", response_model=ConteoRespuesta)
def registrar_conteo(datos: ConteoCrear, db: Session = Depends(get_db)):
    # Verificar proveedor
    proveedor = db.query(Proveedor).filter(
        Proveedor.codigo == datos.proveedor_codigo
    ).first()
    if not proveedor:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")

    # Verificar variedad
    variedad = db.query(Variedad).filter(
        Variedad.id == datos.variedad_id
    ).first()
    if not variedad:
        raise HTTPException(status_code=404, detail="Variedad no encontrada")

    # Validar que la variedad pertenece al proveedor
    asignacion = db.query(ProveedorVariedad).filter(
        ProveedorVariedad.proveedor_id == proveedor.id,
        ProveedorVariedad.variedad_id == variedad.id
    ).first()
    if not asignacion:
        raise HTTPException(
            status_code=400,
            detail=f"La variedad {variedad.nombre} no está asignada al proveedor {datos.proveedor_codigo}"
        )

    # Calcular totales
    total_contado, total_nacional = calcular_total_nacional(datos.detalles, db)

    # Crear el conteo
    conteo = Conteo(
        operario_id=1,  # temporal hasta implementar autenticación
        proveedor_id=proveedor.id,
        variedad_id=variedad.id,
        total_nacional=total_nacional,
        transcripcion=datos.transcripcion,
        metodo=datos.metodo
    )
    db.add(conteo)
    db.flush()  # para obtener el id sin hacer commit aún

    # Guardar detalles
    for detalle in datos.detalles:
        d = DetalleConteo(
            conteo_id=conteo.id,
            estado_flor_id=detalle.estado_flor_id,
            cantidad=detalle.cantidad
        )
        db.add(d)

    # Generar alertas si corresponde
    alertas = verificar_y_generar_alertas(
        conteo, total_nacional, proveedor, variedad, db
    )

    db.commit()
    db.refresh(conteo)

    # Agregar detalles a la respuesta
    conteo.detalles = db.query(DetalleConteo).filter(
        DetalleConteo.conteo_id == conteo.id
    ).all()

    return conteo


# Listar conteos
@router.get("/", response_model=List[ConteoRespuesta])
def listar_conteos(db: Session = Depends(get_db)):
    conteos = db.query(Conteo).all()
    for conteo in conteos:
        conteo.detalles = db.query(DetalleConteo).filter(
            DetalleConteo.conteo_id == conteo.id
        ).all()
    return conteos


# Ver alertas generadas
@router.get("/alertas")
def listar_alertas(db: Session = Depends(get_db)):
    alertas = db.query(Alerta).all()
    resultado = []
    for a in alertas:
        conteo = db.query(Conteo).filter(Conteo.id == a.conteo_id).first()
        proveedor = db.query(Proveedor).filter(Proveedor.id == conteo.proveedor_id).first()
        variedad = db.query(Variedad).filter(Variedad.id == conteo.variedad_id).first()
        resultado.append({
            "id": a.id,
            "tipo": a.tipo_alerta,
            "proveedor": proveedor.codigo,
            "variedad": variedad.nombre,
            "descripcion": a.descripcion,
            "porcentaje_nacional": float(a.porcentaje_nacional) if a.porcentaje_nacional else 0,
            "umbral_aplicado": float(a.umbral_aplicado) if a.umbral_aplicado else 0,
            "resuelta": a.resuelta,
            "fecha": a.creado_en
        })
    return resultado