import { useEffect, useState } from 'react'
import { Package, Hash, Layers } from 'lucide-react'
import { proveedores, variedades, mallas } from '../servicios/api'
import PageHeader from '../ui/PageHeader'
import Button from '../ui/Button'
import { Card } from '../ui/Card'

function Mallas() {
  const [listaProveedores, setListaProveedores] = useState([])
  const [listaVariedades, setListaVariedades]   = useState([])
  const [form, setForm] = useState({ proveedor_codigo: '', variedad_id: '', cantidad_mallas: '' })
  const [mensaje, setMensaje] = useState(null)
  const [error,   setError]   = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    proveedores.listar().then(r => setListaProveedores(r.data))
    variedades.listar().then(r => setListaVariedades(r.data))
  }, [])

  const handleSubmit = async () => {
    setMensaje(null)
    setError(null)
    setLoading(true)
    try {
      const res = await mallas.registrar({
        proveedor_codigo: form.proveedor_codigo,
        variedad_id:      parseInt(form.variedad_id),
        cantidad_mallas:  parseInt(form.cantidad_mallas),
      })
      setMensaje(`Malla registrada correctamente — ${res.data.total_tallos} tallos ingresados`)
      setForm({ proveedor_codigo: '', variedad_id: '', cantidad_mallas: '' })
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al registrar la malla')
    } finally {
      setLoading(false)
    }
  }

  const totalTallos = form.cantidad_mallas ? parseInt(form.cantidad_mallas) * 50 : 0

  return (
    <div className="animate-slide-up">
      <PageHeader
        title="Registrar Mallas"
        subtitle="Ingresa la información de mallas por proveedor y variedad"
        icon={Layers}
      />

      <div style={{ maxWidth: 560 }}>
        <Card>
          <div className="form-group">
            <label className="form-label">Proveedor</label>
            <select
              className="form-select"
              value={form.proveedor_codigo}
              onChange={e => setForm({ ...form, proveedor_codigo: e.target.value })}
            >
              <option value="">Seleccionar proveedor</option>
              {listaProveedores.map(p => (
                <option key={p.id} value={p.codigo}>{p.codigo} — {p.nombre}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Variedad</label>
            <select
              className="form-select"
              value={form.variedad_id}
              onChange={e => setForm({ ...form, variedad_id: e.target.value })}
            >
              <option value="">Seleccionar variedad</option>
              {listaVariedades.map(v => (
                <option key={v.id} value={v.id}>{v.nombre}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Cantidad de Mallas</label>
            <input
              className="form-input"
              type="number"
              value={form.cantidad_mallas}
              onChange={e => setForm({ ...form, cantidad_mallas: e.target.value })}
              placeholder="Ej: 10"
              min="1"
            />
          </div>

          {/* Preview card */}
          {form.cantidad_mallas && parseInt(form.cantidad_mallas) > 0 && (
            <div
              className="animate-slide-down"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                padding: 'var(--space-4)',
                background: 'var(--color-brand-light)',
                border: '1px solid var(--color-primary-200)',
                borderRadius: 'var(--radius-md)',
                marginBottom: 'var(--space-5)',
              }}
            >
              <div style={{
                width: 36, height: 36,
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-brand)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Hash size={18} color="white" strokeWidth={2.5} />
              </div>
              <div>
                <div style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-brand-dark)', fontSize: 'var(--font-size-lg)' }}>
                  {totalTallos.toLocaleString()} tallos
                </div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-600)' }}>
                  {form.cantidad_mallas} mallas × 50 tallos por malla
                </div>
              </div>
            </div>
          )}

          {mensaje && (
            <div className="msg-success" style={{ marginBottom: 'var(--space-4)' }}>
              <Package size={15} />
              {mensaje}
            </div>
          )}
          {error && (
            <div className="msg-error" style={{ marginBottom: 'var(--space-4)' }}>
              {error}
            </div>
          )}

          <Button
            fullWidth
            loading={loading}
            onClick={handleSubmit}
            icon={Package}
          >
            Registrar Malla
          </Button>
        </Card>
      </div>
    </div>
  )
}

export default Mallas