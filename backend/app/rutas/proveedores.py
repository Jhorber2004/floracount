from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.modelos.modelos import Proveedor
from app.esquemas.proveedor import ProveedorCrear, ProveedorRespuesta
from typing import List

router = APIRouter(
    prefix="/proveedores",
    tags=["Proveedores"]
)

# Obtener todos los proveedores
@router.get("/", response_model=List[ProveedorRespuesta])
def listar_proveedores(db: Session = Depends(get_db)):
    return db.query(Proveedor).filter(Proveedor.activo == True).all()

# Obtener un proveedor por código
@router.get("/{codigo}", response_model=ProveedorRespuesta)
def obtener_proveedor(codigo: str, db: Session = Depends(get_db)):
    proveedor = db.query(Proveedor).filter(Proveedor.codigo == codigo).first()
    if not proveedor:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    return proveedor

# Crear un proveedor
@router.post("/", response_model=ProveedorRespuesta)
def crear_proveedor(datos: ProveedorCrear, db: Session = Depends(get_db)):
    # Verificar si el código ya existe
    existe = db.query(Proveedor).filter(Proveedor.codigo == datos.codigo).first()
    if existe:
        raise HTTPException(status_code=400, detail="El código de proveedor ya existe")
    
    proveedor = Proveedor(
        codigo=datos.codigo,
        nombre=datos.nombre,
        telefono=datos.telefono
    )
    db.add(proveedor)
    db.commit()
    db.refresh(proveedor)
    return proveedor

# Desactivar un proveedor
@router.delete("/{codigo}")
def desactivar_proveedor(codigo: str, db: Session = Depends(get_db)):
    proveedor = db.query(Proveedor).filter(Proveedor.codigo == codigo).first()
    if not proveedor:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    proveedor.activo = False
    db.commit()
    return {"mensaje": f"Proveedor {codigo} desactivado correctamente"}