from sqlalchemy import Column, Integer, String, Boolean, Text, DateTime, ForeignKey, Numeric, UniqueConstraint, Computed
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Variedad(Base):
    __tablename__ = "variedades"
    id        = Column(Integer, primary_key=True, index=True)
    nombre    = Column(String(100), nullable=False)
    color     = Column(String(50))
    activo    = Column(Boolean, default=True)
    creado_en = Column(DateTime, default=func.now())

class Proveedor(Base):
    __tablename__ = "proveedores"
    id        = Column(Integer, primary_key=True, index=True)
    codigo    = Column(String(20), unique=True, nullable=False)
    nombre    = Column(String(150), nullable=False)
    telefono  = Column(String(20))
    activo    = Column(Boolean, default=True)
    creado_en = Column(DateTime, default=func.now())

class ProveedorVariedad(Base):
    __tablename__ = "proveedor_variedades"
    id           = Column(Integer, primary_key=True, index=True)
    proveedor_id = Column(Integer, ForeignKey("proveedores.id"), nullable=False)
    variedad_id  = Column(Integer, ForeignKey("variedades.id"), nullable=False)
    __table_args__ = (UniqueConstraint("proveedor_id", "variedad_id"),)

class Usuario(Base):
    __tablename__ = "usuarios"
    id            = Column(Integer, primary_key=True, index=True)
    nombre        = Column(String(100), nullable=False)
    email         = Column(String(150), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    rol           = Column(String(20), nullable=False)
    activo        = Column(Boolean, default=True)
    creado_en     = Column(DateTime, default=func.now())

class Malla(Base):
    __tablename__ = "mallas"
    id               = Column(Integer, primary_key=True, index=True)
    proveedor_id     = Column(Integer, ForeignKey("proveedores.id"), nullable=False)
    variedad_id      = Column(Integer, ForeignKey("variedades.id"), nullable=False)
    cantidad_mallas  = Column(Integer, nullable=False)
    tallos_por_malla = Column(Integer, nullable=False, default=50)
    total_tallos     = Column(Integer, nullable=False)
    fecha_ingreso    = Column(DateTime, default=func.now())
    registrado_por   = Column(Integer, ForeignKey("usuarios.id"))

class EstadoFlor(Base):
    __tablename__ = "estados_flor"
    id          = Column(Integer, primary_key=True, index=True)
    nombre      = Column(String(100), nullable=False)
    tipo        = Column(String(50), nullable=False)
    activo      = Column(Boolean, default=True)

class Conteo(Base):
    __tablename__ = "conteos"
    id             = Column(Integer, primary_key=True, index=True)
    operario_id    = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    proveedor_id   = Column(Integer, ForeignKey("proveedores.id"), nullable=False)
    variedad_id    = Column(Integer, ForeignKey("variedades.id"), nullable=False)
    fecha_conteo   = Column(DateTime, default=func.now())
    total_nacional = Column(Integer, nullable=False)
    transcripcion  = Column(Text)
    metodo         = Column(String(20), default="voz")
    estado         = Column(String(20), default="pendiente")

class DetalleConteo(Base):
    __tablename__ = "detalle_conteos"
    id             = Column(Integer, primary_key=True, index=True)
    conteo_id      = Column(Integer, ForeignKey("conteos.id"), nullable=False)
    estado_flor_id = Column(Integer, ForeignKey("estados_flor.id"), nullable=False)
    cantidad       = Column(Integer, nullable=False)

class Alerta(Base):
    __tablename__ = "alertas"
    id                  = Column(Integer, primary_key=True, index=True)
    conteo_id           = Column(Integer, ForeignKey("conteos.id"), nullable=False)
    tipo_alerta         = Column(String(50), nullable=False)
    descripcion         = Column(Text, nullable=False)
    diferencia          = Column(Integer)
    porcentaje_nacional = Column(Numeric(5, 2))
    umbral_aplicado     = Column(Numeric(5, 2))
    resuelta            = Column(Boolean, default=False)
    resuelta_por        = Column(Integer, ForeignKey("usuarios.id"))
    creado_en           = Column(DateTime, default=func.now())

class ConfiguracionSistema(Base):
    __tablename__ = "configuracion_sistema"
    id             = Column(Integer, primary_key=True, index=True)
    clave          = Column(String(100), unique=True, nullable=False)
    valor          = Column(String(255), nullable=False)
    descripcion    = Column(Text)
    modificado_por = Column(Integer, ForeignKey("usuarios.id"))
    modificado_en  = Column(DateTime, default=func.now())