import { Link } from 'react-router-dom'
import { Grid3X3, Mic, Bell, ArrowRight, Activity, TrendingUp, CheckCircle } from 'lucide-react'
import { Card } from '../ui/Card'

const menuItems = [
  {
    icon: Grid3X3,
    title: 'Registrar Mallas',
    description: 'Ingresa y gestiona las mallas de proveedores',
    href: '/mallas',
    color: 'var(--color-brand)',
    colorLight: 'var(--color-brand-light)',
  },
  {
    icon: Mic,
    title: 'Conteo por Voz',
    description: 'Registra el conteo de flor nacional con voz o manual',
    href: '/conteo',
    color: '#7c3aed',
    colorLight: '#ede9fe',
  },
  {
    icon: Bell,
    title: 'Alertas del Sistema',
    description: 'Revisa y gestiona las alertas generadas',
    href: '/alertas',
    color: '#d97706',
    colorLight: '#fef3c7',
  },
]

const stats = [
  { label: 'Módulos activos',   value: '3',    icon: Activity,    color: 'var(--color-brand)' },
  { label: 'Conectado al API',  value: 'Live',  icon: CheckCircle, color: '#10b981' },
  { label: 'Tipos de estado',   value: '5',    icon: TrendingUp,  color: '#7c3aed' },
]

function Inicio() {
  return (
    <div className="animate-slide-up">
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-brand) 0%, #1a5c35 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-10) var(--space-8)',
        marginBottom: 'var(--space-8)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-xl)',
      }}>
        {/* Background texture */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(255,255,255,0.05) 0%, transparent 40%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 'var(--radius-full)',
            padding: '0.3rem 0.875rem',
            marginBottom: 'var(--space-4)',
          }}>
            <span style={{
              width: 7, height: 7,
              borderRadius: '50%',
              background: '#4ade80',
              display: 'inline-block',
            }} />
            <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 'var(--font-size-xs)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Sistema activo
            </span>
          </div>

          <h1 style={{
            color: 'white',
            fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 'var(--line-height-tight)',
            marginBottom: 'var(--space-3)',
          }}>
            Sistema de Conteo<br />
            <span style={{ color: '#86efac' }}>Flor Nacional</span>
          </h1>

          <p style={{
            color: 'rgba(255,255,255,0.75)',
            fontSize: 'var(--font-size-base)',
            maxWidth: 460,
            lineHeight: 'var(--line-height-relaxed)',
          }}>
            Plataforma de gestión, conteo inteligente y alertas para el control de calidad floral.
          </p>
        </div>
      </div>

      {/* Stats strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 'var(--space-4)',
        marginBottom: 'var(--space-8)',
      }}>
        {stats.map(({ label, value, icon: Icon, color }, i) => (
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
              gap: 'var(--space-4)',
            }}
          >
            <div style={{
              width: 40, height: 40,
              borderRadius: 'var(--radius-md)',
              background: `${color}18`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Icon size={20} color={color} strokeWidth={2} />
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-gray-900)', lineHeight: 1 }}>
                {value}
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', marginTop: 2 }}>
                {label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Menu cards */}
      <h2 style={{
        fontSize: 'var(--font-size-lg)',
        fontWeight: 'var(--font-weight-semibold)',
        color: 'var(--color-gray-700)',
        marginBottom: 'var(--space-5)',
        letterSpacing: '-0.01em',
      }}>
        Acceso rápido
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 'var(--space-4)',
      }}>
        {menuItems.map(({ icon: Icon, title, description, href, color, colorLight }, i) => (
          <Link
            key={href}
            to={href}
            className={`animate-slide-up delay-${i + 2}`}
            style={{ display: 'block' }}
          >
            <Card hover style={{ height: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{
                  width: 46, height: 46,
                  borderRadius: 'var(--radius-lg)',
                  background: colorLight,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 'var(--space-4)',
                }}>
                  <Icon size={22} color={color} strokeWidth={2} />
                </div>
                <h3 style={{
                  fontSize: 'var(--font-size-base)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-gray-900)',
                  marginBottom: 'var(--space-2)',
                  letterSpacing: '-0.01em',
                }}>
                  {title}
                </h3>
                <p style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-gray-500)',
                  lineHeight: 'var(--line-height-relaxed)',
                  flex: 1,
                }}>
                  {description}
                </p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-1)',
                  marginTop: 'var(--space-5)',
                  color: color,
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-semibold)',
                }}>
                  Ir al módulo
                  <ArrowRight size={14} strokeWidth={2.5} />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

export default Inicio