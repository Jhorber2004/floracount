from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.modelos.modelos import Malla, Proveedor, Variedad, ProveedorVariedad
from app.esquemas.malla import MallaCrear, MallaRespuesta
from typing import List

router = APIRouter(
    prefix="/mallas",
    tags=["Mallas"]
)

# Registrar ingreso de mallas
@router.post("/", response_model=MallaRespuesta)
def registrar_malla(datos: MallaCrear, db: Session = Depends(get_db)):
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

    # ✅ VALIDACIÓN CLAVE: verificar que la variedad está asignada al proveedor
    asignacion = db.query(ProveedorVariedad).filter(
        ProveedorVariedad.proveedor_id == proveedor.id,
        ProveedorVariedad.variedad_id == variedad.id
    ).first()
    if not asignacion:
        raise HTTPException(
            status_code=400,
            detail=f"La variedad {variedad.nombre} no está asignada al proveedor {datos.proveedor_codigo}"
        )

    # Registrar la malla
    malla = Malla(
        proveedor_id=proveedor.id,
        variedad_id=variedad.id,
        cantidad_mallas=datos.cantidad_mallas,
        tallos_por_malla=50,
        total_tallos=datos.cantidad_mallas * 50
    )
    db.add(malla)
    db.commit()
    db.refresh(malla)
    return malla

# Listar mallas del día por proveedor
@router.get("/{proveedor_codigo}", response_model=List[MallaRespuesta])
def listar_mallas_proveedor(proveedor_codigo: str, db: Session = Depends(get_db)):
    proveedor = db.query(Proveedor).filter(
        Proveedor.codigo == proveedor_codigo
    ).first()
    if not proveedor:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")

    mallas = db.query(Malla).filter(
        Malla.proveedor_id == proveedor.id
    ).all()

    return mallas

# Listar todas las mallas
@router.get("/", response_model=List[MallaRespuesta])
def listar_todas_mallas(db: Session = Depends(get_db)):
    return db.query(Malla).all()