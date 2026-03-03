from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MallaCrear(BaseModel):
    proveedor_codigo: str
    variedad_id: int
    cantidad_mallas: int

class MallaRespuesta(BaseModel):
    id: int
    proveedor_id: int
    variedad_id: int
    cantidad_mallas: int
    tallos_por_malla: int
    total_tallos: int
    fecha_ingreso: datetime

    class Config:
        from_attributes = True