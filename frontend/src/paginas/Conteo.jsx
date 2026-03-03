import { useEffect, useState } from 'react'
import { Mic, MicOff, Save, AlertCircle } from 'lucide-react'
import { proveedores, variedades, conteos } from '../servicios/api'
import PageHeader from '../ui/PageHeader'
import Button from '../ui/Button'
import { Card } from '../ui/Card'
import Badge from '../ui/Badge'

const ESTADOS_INICIALES = [
  { estado_flor_id: 1, nombre: 'Botrytis',    resta: false },
  { estado_flor_id: 2, nombre: 'Oídio',        resta: false },
  { estado_flor_id: 3, nombre: 'Maltrato',     resta: false },
  { estado_flor_id: 4, nombre: 'Deforme',      resta: false },
  { estado_flor_id: 5, nombre: 'Descabezada',  resta: true  },
]

function Conteo() {
  const [listaProveedores, setListaProveedores] = useState([])
  const [listaVariedades,  setListaVariedades]  = useState([])
  const [form,    setForm]    = useState({ proveedor_codigo: '', variedad_id: '' })
  const [detalles, setDetalles] = useState(ESTADOS_INICIALES.map(e => ({ ...e, cantidad: 0 })))
  const [mensaje,  setMensaje] = useState(null)
  const [error,    setError]   = useState(null)
  const [escuchando, setEscuchando] = useState(false)
  const [loading,  setLoading]  = useState(false)

  useEffect(() => {
    proveedores.listar().then(r => setListaProveedores(r.data))
    variedades.listar().then(r => setListaVariedades(r.data))
  }, [])

  const totalContado  = detalles.reduce((a, d) => a + d.cantidad, 0)
  const totalNacional = detalles.reduce((a, d) => d.resta ? a - d.cantidad : a + d.cantidad, 0)

  const actualizarCantidad = (index, valor) => {
    const nuevos = [...detalles]
    nuevos[index].cantidad = Math.max(0, parseInt(valor) || 0)
    setDetalles(nuevos)
  }

  const iniciarVoz = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setError('Tu navegador no soporta reconocimiento de voz. Usa Chrome.')
      return
    }
    const recognition = new SpeechRecognition()
    recognition.lang = 'es-ES'
    recognition.continuous = false
    recognition.interimResults = false
    recognition.onstart = () => setEscuchando(true)
    recognition.onend   = () => setEscuchando(false)
    recognition.onresult = (event) => {
      const texto = event.results[0][0].transcript.toLowerCase()
      parsearVoz(texto)
    }
    recognition.onerror = (e) => {
      setEscuchando(false)
      setError('Error en reconocimiento de voz: ' + e.error)
    }
    recognition.start()
  }

  const parsearVoz = (texto) => {
    const nuevos = [...detalles]
    const patrones = [
      { nombre: 'Botrytis',    regex: /botr[iy]tis[:\s]+(\d+)/i },
      { nombre: 'Oídio',       regex: /o[ií]dio[:\s]+(\d+)/i },
      { nombre: 'Maltrato',    regex: /maltrato[:\s]+(\d+)/i },
      { nombre: 'Deforme',     regex: /deform[e]?[:\s]+(\d+)/i },
      { nombre: 'Descabezada', regex: /descabezad[ao]s?[:\s]+(\d+)/i },
    ]
    let encontrado = false
    patrones.forEach(patron => {
      const match = texto.match(patron.regex)
      if (match) {
        const idx = nuevos.findIndex(d => d.nombre === patron.nombre)
        if (idx !== -1) { nuevos[idx].cantidad = parseInt(match[1]); encontrado = true }
      }
    })
    if (encontrado) { setDetalles(nuevos); setMensaje('Voz procesada correctamente') }
    else setError('No se pudo interpretar la voz. Intenta de nuevo.')
  }

  const handleSubmit = async () => {
    setMensaje(null); setError(null)
    if (!form.proveedor_codigo || !form.variedad_id) {
      setError('Selecciona proveedor y variedad antes de registrar')
      return
    }
    const detallesFiltrados = detalles.filter(d => d.cantidad > 0)
    if (detallesFiltrados.length === 0) {
      setError('Ingresa al menos un estado de flor con cantidad mayor a cero')
      return
    }
    setLoading(true)
    try {
      await conteos.registrar({
        proveedor_codigo: form.proveedor_codigo,
        variedad_id:      parseInt(form.variedad_id),
        transcripcion:    detalles.map(d => `${d.nombre}: ${d.cantidad}`).join(', '),
        metodo: 'voz',
        detalles: detallesFiltrados.map(d => ({ estado_flor_id: d.estado_flor_id, cantidad: d.cantidad })),
      })
      setMensaje('Conteo registrado correctamente')
      setDetalles(detalles.map(d => ({ ...d, cantidad: 0 })))
      setForm({ proveedor_codigo: '', variedad_id: '' })
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al registrar el conteo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-slide-up">
      <PageHeader
        title="Conteo de Flor Nacional"
        subtitle="Registra el conteo por voz o ingreso manual por estado de flor"
        icon={Mic}
      />

      <div style={{ maxWidth: 600 }}>
        {/* Form selects */}
        <Card style={{ marginBottom: 'var(--space-5)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Proveedor</label>
              <select
                className="form-select"
                value={form.proveedor_codigo}
                onChange={e => setForm({ ...form, proveedor_codigo: e.target.value })}
              >
                <option value="">Seleccionar</option>
                {listaProveedores.map(p => (
                  <option key={p.id} value={p.codigo}>{p.codigo} — {p.nombre}</option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Variedad</label>
              <select
                className="form-select"
                value={form.variedad_id}
                onChange={e => setForm({ ...form, variedad_id: e.target.value })}
              >
                <option value="">Seleccionar</option>
                {listaVariedades.map(v => (
                  <option key={v.id} value={v.id}>{v.nombre}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Voice button */}
        <Card style={{ marginBottom: 'var(--space-5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <div>
              <div style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-gray-800)', marginBottom: 4 }}>
                Entrada por voz
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>
                Di el nombre del estado seguido de la cantidad. Ej: "Botrytis 15"
              </div>
            </div>
            <Button
              variant={escuchando ? 'danger' : 'primary'}
              icon={escuchando ? MicOff : Mic}
              onClick={iniciarVoz}
            >
              {escuchando ? 'Escuchando...' : 'Activar voz'}
            </Button>
          </div>

          {escuchando && (
            <div className="animate-slide-down" style={{
              marginTop: 'var(--space-4)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              padding: 'var(--space-3) var(--space-4)',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 'var(--radius-md)',
            }}>
              <div style={{
                width: 10, height: 10,
                borderRadius: '50%',
                background: 'var(--color-danger)',
                animation: 'pulse 1s infinite',
                flexShrink: 0,
              }} />
              <span style={{ fontSize: 'var(--font-size-sm)', color: '#991b1b', fontWeight: 500 }}>
                Micrófono activo — habla ahora
              </span>
            </div>
          )}
        </Card>

        {/* Detail table */}
        <Card style={{ marginBottom: 'var(--space-5)' }}>
          <div style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-gray-800)' }}>
              Detalle por estado
            </span>
            <Badge variant="brand">5 estados</Badge>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {detalles.map((d, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--space-3) var(--space-4)',
                  background: d.resta ? '#fffbeb' : 'var(--color-gray-50)',
                  border: `1px solid ${d.resta ? '#fde68a' : 'var(--border-color)'}`,
                  borderRadius: 'var(--radius-md)',
                  transition: 'background var(--transition-fast)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <span style={{
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-gray-700)',
                    fontSize: 'var(--font-size-sm)',
                  }}>
                    {d.nombre}
                  </span>
                  {d.resta && <Badge variant="warning" dot>Resta del total</Badge>}
                </div>
                <input
                  type="number"
                  value={d.cantidad}
                  onChange={e => actualizarCantidad(i, e.target.value)}
                  className="form-input form-input-sm"
                  style={{ width: 80, textAlign: 'center' }}
                  min="0"
                />
              </div>
            ))}
          </div>

          {/* Totals */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--space-3)',
            marginTop: 'var(--space-5)',
            paddingTop: 'var(--space-5)',
            borderTop: '1px solid var(--border-color)',
          }}>
            {[
              { label: 'Total contado', value: totalContado },
              { label: 'Total nacional', value: totalNacional, highlight: true },
            ].map(({ label, value, highlight }) => (
              <div
                key={label}
                style={{
                  padding: 'var(--space-4)',
                  background: highlight ? 'var(--color-brand-light)' : 'var(--color-gray-50)',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${highlight ? 'var(--color-primary-200)' : 'var(--border-color)'}`,
                  textAlign: 'center',
                }}
              >
                <div style={{
                  fontSize: 'var(--font-size-2xl)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: highlight ? 'var(--color-brand)' : 'var(--color-gray-700)',
                  lineHeight: 1,
                }}>
                  {value}
                </div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', marginTop: 4 }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {mensaje && <div className="msg-success" style={{ marginBottom: 'var(--space-4)' }}>{mensaje}</div>}
        {error   && (
          <div className="msg-error" style={{ marginBottom: 'var(--space-4)' }}>
            <AlertCircle size={15} />
            {error}
          </div>
        )}

        <Button fullWidth loading={loading} onClick={handleSubmit} icon={Save} size="lg">
          Registrar Conteo
        </Button>
      </div>
    </div>
  )
}

export default Conteo