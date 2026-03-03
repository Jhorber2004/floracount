from app.database import SessionLocal
from app.modelos.modelos import EstadoFlor, ConfiguracionSistema

def insertar_datos_iniciales():
    db = SessionLocal()
    
    try:
        # Verificar si ya existen datos
        if db.query(EstadoFlor).first():
            print("✅ Datos iniciales ya existen")
            return

        # Estados de flor
        estados = [
            EstadoFlor(nombre="Botrytis",     tipo="enfermedad"),
            EstadoFlor(nombre="Oídio",         tipo="enfermedad"),
            EstadoFlor(nombre="Maltrato",      tipo="daño_fisico"),
            EstadoFlor(nombre="Deforme",       tipo="daño_fisico"),
            EstadoFlor(nombre="Descabezada",   tipo="daño_fisico"),
        ]
        db.add_all(estados)

        # Configuración inicial del sistema
        configuraciones = [
            ConfiguracionSistema(
                clave="umbral_nacional_pct",
                valor="25",
                descripcion="Porcentaje máximo de flor nacional permitido antes de generar alerta"
            ),
            ConfiguracionSistema(
                clave="alerta_nacional_cero",
                valor="true",
                descripcion="Generar alerta si el conteo de nacional es 0"
            ),
        ]
        db.add_all(configuraciones)

        db.commit()
        print("✅ Datos iniciales insertados correctamente")

    except Exception as e:
        db.rollback()
        print(f"❌ Error insertando datos iniciales: {e}")
    finally:
        db.close()