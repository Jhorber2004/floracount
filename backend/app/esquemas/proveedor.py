from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ProveedorCrear(BaseModel):
    codigo: str
    nombre: str
    telefono: Optional[str] = None

class ProveedorRespuesta(BaseModel):
    id: int
    codigo: str
    nombre: str
    telefono: Optional[str]
    activo: bool
    creado_en: datetime

    class Config:
        from_attributes = True