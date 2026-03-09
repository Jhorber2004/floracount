from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

from app.database import engine, Base
from app.modelos.modelos import Base as ModelosBase
import app.modelos.modelos

from app.utilidades.seed import insertar_datos_iniciales

from app.rutas import proveedores
from app.rutas import variedades
from app.rutas import proveedor_variedades
from app.rutas import mallas
from app.rutas import conteos

# Crear todas las tablas
Base.metadata.create_all(bind=engine)

# Insertar datos iniciales
insertar_datos_iniciales()

# Inicializar la aplicación
app = FastAPI(
    title="FloraCount API",
    description="Sistema de conteo de flor nacional para floricultora",
    version="1.0.0"
)

# Permitir hosts detrás del proxy (Railway)
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]
)

# Configuración CORS
origins = [
    "https://floracount-ih9j.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar rutas
app.include_router(proveedores.router)
app.include_router(variedades.router)
app.include_router(proveedor_variedades.router)
app.include_router(mallas.router)
app.include_router(conteos.router)

# Ruta base
@app.get("/")
def inicio():
    return {
        "sistema": "FloraCount",
        "estado": "activo",
        "version": "1.0.0"
    }

# Health check
@app.get("/health")
def health_check():
    return {"status": "ok"}