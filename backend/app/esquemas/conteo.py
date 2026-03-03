from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class DetalleConteoCrear(BaseModel):
    estado_flor_id: int
    cantidad: int

class ConteoCrear(BaseModel):
    proveedor_codigo: str
    variedad_id: int
    detalles: List[DetalleConteoCrear]
    transcripcion: Optional[str] = None
    metodo: Optional[str] = "voz"

class DetalleConteoRespuesta(BaseModel):
    id: int
    estado_flor_id: int
    cantidad: int

    class Config:
        from_attributes = True

class ConteoRespuesta(BaseModel):
    id: int
    proveedor_id: int
    variedad_id: int
    total_nacional: int
    fecha_conteo: datetime
    metodo: str
    estado: str
    transcripcion: Optional[str]
    detalles: List[DetalleConteoRespuesta]

    class Config:
        from_attributes = True