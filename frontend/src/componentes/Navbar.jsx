import { Link, useLocation } from 'react-router-dom'
import { Home, Grid3X3, Mic, Bell } from 'lucide-react'

const links = [
  { to: '/',        label: 'Inicio',  Icon: Home },
  { to: '/mallas',  label: 'Mallas',  Icon: Grid3X3 },
  { to: '/conteo',  label: 'Conteo',  Icon: Mic },
  { to: '/alertas', label: 'Alertas', Icon: Bell },
]

function Navbar() {
  const location = useLocation()

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      height: 'var(--nav-height)',
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-xs)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 var(--space-6)',
    }}>
      <div style={{
        maxWidth: 'var(--content-max-width)',
        width: '100%',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{
            width: 34,
            height: 34,
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--color-brand) 0%, #1e8449 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-brand)',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20z"/>
              <path d="M12 6v6l4 2"/>
            </svg>
          </div>
          <span style={{
            fontWeight: 'var(--font-weight-bold)',
            fontSize: 'var(--font-size-lg)',
            color: 'var(--color-gray-900)',
            letterSpacing: '-0.02em',
          }}>
            Flora<span style={{ color: 'var(--color-brand)' }}>Count</span>
          </span>
        </Link>

        {/* Navigation links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
          {links.map(({ to, label, Icon }) => {
            const isActive = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: '0.45rem var(--space-3)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: isActive ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
                  color: isActive ? 'var(--color-brand)' : 'var(--color-gray-600)',
                  background: isActive ? 'var(--color-brand-light)' : 'transparent',
                  transition: 'background var(--transition-fast), color var(--transition-fast)',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--color-gray-100)'
                    e.currentTarget.style.color = 'var(--color-gray-800)'
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'var(--color-gray-600)'
                  }
                }}
              >
                <Icon size={15} strokeWidth={isActive ? 2.5 : 2} />
                <span className="nav-label">{label}</span>
              </Link>
            )
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 480px) {
          .nav-label { display: none; }
        }
      `}</style>
    </nav>
  )
}

export default Navbar