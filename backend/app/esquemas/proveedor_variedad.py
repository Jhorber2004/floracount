from pydantic import BaseModel
from typing import List

class AsignarVariedad(BaseModel):
    proveedor_codigo: str
    variedad_id: int

class AsignacionRespuesta(BaseModel):
    mensaje: str
    proveedor: str
    variedad: str

class VariedadesDeProveedor(BaseModel):
    proveedor_codigo: str
    proveedor_nombre: str
    variedades: List[str]