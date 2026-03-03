const variants = {
  default:  { bg: 'var(--color-gray-100)',    color: 'var(--color-gray-700)' },
  success:  { bg: 'var(--color-success-bg)',  color: '#065f46' },
  warning:  { bg: 'var(--color-warning-bg)',  color: '#92400e' },
  danger:   { bg: 'var(--color-danger-bg)',   color: '#991b1b' },
  brand:    { bg: 'var(--color-brand-light)', color: 'var(--color-brand-dark)' },
  info:     { bg: 'var(--color-info-bg)',     color: '#1d4ed8' },
}

export default function Badge({ children, variant = 'default', dot = false, style }) {
  const v = variants[variant] || variants.default
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.3rem',
      padding: '0.2rem 0.6rem',
      borderRadius: 'var(--radius-full)',
      fontSize: 'var(--font-size-xs)',
      fontWeight: 'var(--font-weight-semibold)',
      letterSpacing: '0.02em',
      background: v.bg,
      color: v.color,
      ...style,
    }}>
      {dot && (
        <span style={{
          width: 6, height: 6,
          borderRadius: '50%',
          background: 'currentColor',
          display: 'inline-block',
        }} />
      )}
      {children}
    </span>
  )
}