export function Card({ children, style, hover = false, padding = 'md', ...props }) {
  const paddingMap = { sm: 'var(--space-4)', md: 'var(--space-6)', lg: 'var(--space-8)' }

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: paddingMap[padding] || padding,
        boxShadow: 'var(--shadow-sm)',
        transition: hover ? 'transform var(--transition-base), box-shadow var(--transition-base)' : undefined,
        cursor: hover ? 'pointer' : undefined,
        ...style,
      }}
      onMouseEnter={hover ? e => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = 'var(--shadow-md)'
      } : undefined}
      onMouseLeave={hover ? e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
      } : undefined}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, style }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 'var(--space-5)',
      ...style,
    }}>
      {children}
    </div>
  )
}

export function StatCard({ label, value, icon: Icon, color = 'var(--color-brand)', trend, style }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-5)',
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)',
      ...style,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          fontSize: 'var(--font-size-sm)',
          fontWeight: 'var(--font-weight-medium)',
          color: 'var(--color-gray-500)',
          letterSpacing: '0.02em',
          textTransform: 'uppercase',
        }}>
          {label}
        </span>
        {Icon && (
          <span style={{
            width: 36,
            height: 36,
            borderRadius: 'var(--radius-md)',
            background: `${color}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Icon size={18} color={color} strokeWidth={2} />
          </span>
        )}
      </div>
      <div style={{
        fontSize: 'var(--font-size-3xl)',
        fontWeight: 'var(--font-weight-bold)',
        color: 'var(--color-gray-900)',
        lineHeight: 1,
      }}>
        {value}
      </div>
      {trend && (
        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)' }}>
          {trend}
        </div>
      )}
    </div>
  )
}