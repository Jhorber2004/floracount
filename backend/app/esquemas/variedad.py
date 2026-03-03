from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class VariedadCrear(BaseModel):
    nombre: str
    color: Optional[str] = None

class VariedadRespuesta(BaseModel):
    id: int
    nombre: str
    color: Optional[str]
    activo: bool

    class Config:
        from_attributes = True