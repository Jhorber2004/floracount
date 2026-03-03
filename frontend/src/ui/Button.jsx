import { forwardRef } from 'react'

const variantStyles = {
  primary: {
    background: 'linear-gradient(135deg, var(--color-brand) 0%, #1e8449 100%)',
    color: 'white',
    border: 'none',
    boxShadow: 'var(--shadow-brand)',
  },
  secondary: {
    background: 'var(--bg-card)',
    color: 'var(--color-gray-700)',
    border: '1.5px solid var(--border-color)',
    boxShadow: 'var(--shadow-xs)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--color-brand)',
    border: '1.5px solid transparent',
    boxShadow: 'none',
  },
  danger: {
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: 'white',
    border: 'none',
    boxShadow: '0 4px 14px rgba(239,68,68,0.25)',
  },
}

const sizeStyles = {
  sm: { padding: '0.375rem 0.875rem', fontSize: 'var(--font-size-sm)', borderRadius: 'var(--radius-sm)' },
  md: { padding: '0.625rem 1.25rem', fontSize: 'var(--font-size-base)', borderRadius: 'var(--radius-md)' },
  lg: { padding: '0.75rem 1.75rem', fontSize: 'var(--font-size-lg)', borderRadius: 'var(--radius-md)' },
}

const Button = forwardRef(function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  icon: Icon,
  iconRight: IconRight,
  disabled,
  style,
  ...props
}, ref) {
  const isDisabled = disabled || loading

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      style={{
        ...variantStyles[variant],
        ...sizeStyles[size],
        width: fullWidth ? '100%' : 'auto',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        fontFamily: 'var(--font-family)',
        fontWeight: 'var(--font-weight-semibold)',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.6 : 1,
        transition: 'transform var(--transition-fast), box-shadow var(--transition-fast), opacity var(--transition-fast)',
        letterSpacing: '0.01em',
        lineHeight: 1,
        userSelect: 'none',
        ...style,
      }}
      onMouseEnter={e => {
        if (!isDisabled) {
          e.currentTarget.style.transform = 'translateY(-1px)'
          if (variant === 'primary') e.currentTarget.style.boxShadow = '0 6px 20px rgba(26,107,60,0.35)'
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = variantStyles[variant].boxShadow || ''
      }}
      onMouseDown={e => { if (!isDisabled) e.currentTarget.style.transform = 'translateY(0) scale(0.98)' }}
      onMouseUp={e => { if (!isDisabled) e.currentTarget.style.transform = 'translateY(-1px)' }}
      {...props}
    >
      {loading ? (
        <span className="spinner" />
      ) : Icon ? (
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} strokeWidth={2.5} />
      ) : null}
      {children}
      {!loading && IconRight && (
        <IconRight size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} strokeWidth={2.5} />
      )}
    </button>
  )
})

export default Button