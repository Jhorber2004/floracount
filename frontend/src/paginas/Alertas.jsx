import { useEffect, useState } from 'react'
import { Bell, CheckCircle, AlertTriangle, Clock, XCircle, RefreshCw } from 'lucide-react'
import { conteos } from '../servicios/api'
import PageHeader from '../ui/PageHeader'
import Badge from '../ui/Badge'
import { Card } from '../ui/Card'
import Button from '../ui/Button'

function Alertas() {
  const [alertas,   setAlertas]   = useState([])
  const [cargando,  setCargando]  = useState(true)

  useEffect(() => {
    conteos.alertas()
      .then(res => setAlertas(res.data))
      .catch(err => console.error(err))
      .finally(() => setCargando(false))
  }, [])

  if (cargando) {
    return (
      <div className="animate-fade-in" style={{ maxWidth: 700 }}>
        <PageHeader title="Alertas del Sistema" subtitle="Cargando alertas..." icon={Bell} />
        {[1,2,3].map(i => (
          <div key={i} className="skeleton" style={{ height: 120, marginBottom: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }} />
        ))}
      </div>
    )
  }

  const pendientes = alertas.filter(a => !a.resuelta).length
  const resueltas  = alertas.filter(a =>  a.resuelta).length

  return (
    <div className="animate-slide-up">
      <PageHeader
        title="Alertas del Sistema"
        subtitle={`${alertas.length} alertas en total · ${pendientes} pendientes`}
        icon={Bell}
        action={
          pendientes > 0 && (
            <Badge variant="warning" dot>{pendientes} pendiente{pendientes > 1 ? 's' : ''}</Badge>
          )
        }
      />

      {/* Summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 'var(--space-4)',
        marginBottom: 'var(--space-8)',
      }}>
        {[
          { label: 'Total',      value: alertas.length, Icon: Bell,         color: 'var(--color-gray-500)' },
          { label: 'Pendientes', value: pendientes,     Icon: AlertTriangle, color: 'var(--color-warning)' },
          { label: 'Resueltas',  value: resueltas,      Icon: CheckCircle,   color: 'var(--color-success)' },
        ].map(({ label, value, Icon, color }, i) => (
          <div
            key={label}
            className={`animate-slide-up delay-${i + 1}`}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-5)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
            }}
          >
            <div style={{
              width: 38, height: 38,
              borderRadius: 'var(--radius-md)',
              background: `${color}18`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={19} color={color} strokeWidth={2} />
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--color-gray-900)', lineHeight: 1 }}>
                {value}
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', marginTop: 2 }}>
                {label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {alertas.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
          <div style={{
            width: 56, height: 56,
            borderRadius: 'var(--radius-xl)',
            background: 'var(--color-success-bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto var(--space-4)',
          }}>
            <CheckCircle size={26} color="var(--color-success)" strokeWidth={2} />
          </div>
          <div style={{ fontWeight: 600, color: 'var(--color-gray-800)', marginBottom: 'var(--space-2)' }}>
            Sin alertas pendientes
          </div>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>
            El sistema no ha generado alertas. Todo funciona correctamente.
          </div>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: 700 }}>
          {alertas.map((alerta, i) => (
            <AlertCard key={alerta.id} alerta={alerta} delay={i + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

function AlertCard({ alerta, delay }) {
  const isUmbral   = alerta.tipo === 'umbral_superado'
  const isResuelta = alerta.resuelta

  const colors = {
    border:   isResuelta ? 'var(--color-success-border)' : isUmbral ? 'var(--color-danger-border)' : 'var(--color-warning-border)',
    bg:       isResuelta ? 'var(--color-success-bg)'     : 'var(--bg-card)',
    iconBg:   isResuelta ? 'var(--color-success-bg)'     : isUmbral ? 'var(--color-danger-bg)' : 'var(--color-warning-bg)',
    iconColor:isResuelta ? 'var(--color-success)'        : isUmbral ? 'var(--color-danger)'    : 'var(--color-warning)',
  }

  const StatusIcon = isResuelta ? CheckCircle : isUmbral ? XCircle : AlertTriangle

  return (
    <div
      className={`animate-slide-up delay-${Math.min(delay, 5)}`}
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-5)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
        <div style={{
          width: 40, height: 40,
          borderRadius: 'var(--radius-md)',
          background: colors.iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          marginTop: 2,
        }}>
          <StatusIcon size={20} color={colors.iconColor} strokeWidth={2} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-gray-900)', fontSize: 'var(--font-size-sm)' }}>
                {isUmbral ? 'Umbral Superado' : 'Nacional en Cero'}
              </span>
              <Badge variant={isResuelta ? 'success' : isUmbral ? 'danger' : 'warning'} dot>
                {isResuelta ? 'Resuelta' : 'Pendiente'}
              </Badge>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', color: 'var(--color-gray-400)', fontSize: 'var(--font-size-xs)' }}>
              <Clock size={12} strokeWidth={2} />
              {new Date(alerta.fecha).toLocaleString('es-EC', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', marginBottom: 'var(--space-3)', lineHeight: 'var(--line-height-relaxed)' }}>
            {alerta.descripcion}
          </p>

          <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            {[
              { label: 'Proveedor', value: alerta.proveedor },
              { label: 'Variedad',  value: alerta.variedad },
              { label: 'Nacional',  value: `${alerta.porcentaje_nacional}%` },
              { label: 'Umbral',    value: `${alerta.umbral_aplicado}%` },
            ].map(({ label, value }) => (
              <div key={label}>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-400)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {label}
                </span>
                <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-gray-700)', marginTop: 1 }}>
                  {value}
                </div>
              </div>
            ))}
          </div>

          {!alerta.resuelta && (
            <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-color)' }}>
              <Button variant="secondary" size="sm" icon={RefreshCw}>
                Marcar como resuelta
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Alertas