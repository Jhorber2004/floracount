export default function PageHeader({ title, subtitle, icon: Icon, action, style }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 'var(--space-4)',
      marginBottom: 'var(--space-8)',
      ...style,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        {Icon && (
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, var(--color-brand) 0%, #1e8449 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-brand)',
            flexShrink: 0,
          }}>
            <Icon size={24} color="white" strokeWidth={2} />
          </div>
        )}
        <div>
          <h1 style={{
            fontSize: 'var(--font-size-2xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-gray-900)',
            lineHeight: 'var(--line-height-tight)',
            letterSpacing: '-0.02em',
          }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-gray-500)',
              marginTop: 'var(--space-1)',
              fontWeight: 'var(--font-weight-normal)',
            }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}