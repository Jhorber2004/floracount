from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.modelos.modelos import Variedad
from app.esquemas.variedad import VariedadCrear, VariedadRespuesta
from typing import List

router = APIRouter(
    prefix="/variedades",
    tags=["Variedades"]
)

# Listar todas las variedades
@router.get("/", response_model=List[VariedadRespuesta])
def listar_variedades(db: Session = Depends(get_db)):
    return db.query(Variedad).filter(Variedad.activo == True).all()

# Obtener una variedad por ID
@router.get("/{variedad_id}", response_model=VariedadRespuesta)
def obtener_variedad(variedad_id: int, db: Session = Depends(get_db)):
    variedad = db.query(Variedad).filter(Variedad.id == variedad_id).first()
    if not variedad:
        raise HTTPException(status_code=404, detail="Variedad no encontrada")
    return variedad

# Crear una variedad
@router.post("/", response_model=VariedadRespuesta)
def crear_variedad(datos: VariedadCrear, db: Session = Depends(get_db)):
    existe = db.query(Variedad).filter(Variedad.nombre == datos.nombre).first()
    if existe:
        raise HTTPException(status_code=400, detail="La variedad ya existe")
    
    variedad = Variedad(
        nombre=datos.nombre,
        color=datos.color
    )
    db.add(variedad)
    db.commit()
    db.refresh(variedad)
    return variedad

# Desactivar una variedad
@router.delete("/{variedad_id}")
def desactivar_variedad(variedad_id: int, db: Session = Depends(get_db)):
    variedad = db.query(Variedad).filter(Variedad.id == variedad_id).first()
    if not variedad:
        raise HTTPException(status_code=404, detail="Variedad no encontrada")
    variedad.activo = False
    db.commit()
    return {"mensaje": f"Variedad {variedad.nombre} desactivada correctamente"}