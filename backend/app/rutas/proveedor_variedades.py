from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.modelos.modelos import Proveedor, Variedad, ProveedorVariedad
from app.esquemas.proveedor_variedad import AsignarVariedad, AsignacionRespuesta, VariedadesDeProveedor

router = APIRouter(
    prefix="/proveedor-variedades",
    tags=["Asignación Proveedor-Variedad"]
)

# Asignar variedad a proveedor
@router.post("/", response_model=AsignacionRespuesta)
def asignar_variedad(datos: AsignarVariedad, db: Session = Depends(get_db)):
    # Verificar que existe el proveedor
    proveedor = db.query(Proveedor).filter(
        Proveedor.codigo == datos.proveedor_codigo
    ).first()
    if not proveedor:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")

    # Verificar que existe la variedad
    variedad = db.query(Variedad).filter(
        Variedad.id == datos.variedad_id
    ).first()
    if not variedad:
        raise HTTPException(status_code=404, detail="Variedad no encontrada")

    # Verificar que no está ya asignada
    existe = db.query(ProveedorVariedad).filter(
        ProveedorVariedad.proveedor_id == proveedor.id,
        ProveedorVariedad.variedad_id == variedad.id
    ).first()
    if existe:
        raise HTTPException(status_code=400, detail="Esta variedad ya está asignada a este proveedor")

    # Crear la asignación
    asignacion = ProveedorVariedad(
        proveedor_id=proveedor.id,
        variedad_id=variedad.id
    )
    db.add(asignacion)
    db.commit()

    return AsignacionRespuesta(
        mensaje="Variedad asignada correctamente",
        proveedor=f"{proveedor.codigo} - {proveedor.nombre}",
        variedad=variedad.nombre
    )

# Ver variedades de un proveedor
@router.get("/{codigo}", response_model=VariedadesDeProveedor)
def variedades_de_proveedor(codigo: str, db: Session = Depends(get_db)):
    proveedor = db.query(Proveedor).filter(
        Proveedor.codigo == codigo
    ).first()
    if not proveedor:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")

    asignaciones = db.query(ProveedorVariedad).filter(
        ProveedorVariedad.proveedor_id == proveedor.id
    ).all()

    variedades = []
    for a in asignaciones:
        variedad = db.query(Variedad).filter(Variedad.id == a.variedad_id).first()
        if variedad:
            variedades.append(variedad.nombre)

    return VariedadesDeProveedor(
        proveedor_codigo=proveedor.codigo,
        proveedor_nombre=proveedor.nombre,
        variedades=variedades
    )

# Eliminar asignación
@router.delete("/")
def eliminar_asignacion(datos: AsignarVariedad, db: Session = Depends(get_db)):
    proveedor = db.query(Proveedor).filter(
        Proveedor.codigo == datos.proveedor_codigo
    ).first()
    if not proveedor:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")

    asignacion = db.query(ProveedorVariedad).filter(
        ProveedorVariedad.proveedor_id == proveedor.id,
        ProveedorVariedad.variedad_id == datos.variedad_id
    ).first()
    if not asignacion:
        raise HTTPException(status_code=404, detail="Asignación no encontrada")

    db.delete(asignacion)
    db.commit()
    return {"mensaje": "Asignación eliminada correctamente"}