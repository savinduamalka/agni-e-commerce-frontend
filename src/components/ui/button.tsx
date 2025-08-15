import React from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost'
}

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-md font-medium disabled:opacity-60'
  const variants: Record<string, string> = {
    primary: 'px-4 py-2',
    ghost: 'px-4 py-2 bg-transparent border',
  }

  return (
    <button
      {...props}
      className={`${base} ${variants[variant]} ${className}`}
      style={variant === 'primary' ? { background: 'var(--color-accent)', color: 'var(--color-primary)' } : { color: 'var(--color-accent)', borderColor: 'var(--input-border)' }}
    >
      {children}
    </button>
  )
}

export default Button
