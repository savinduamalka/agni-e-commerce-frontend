import React from 'react'

type CardProps = React.HTMLAttributes<HTMLDivElement>

export function Card({ className = '', children, ...props }: CardProps) {
  return (
    <div
      {...props}
      className={`rounded-2xl p-8 ${className}`}
      style={{ background: 'var(--color-primary)', color: 'var(--color-accent)', boxShadow: 'var(--shadow-md)' }}
    >
      {children}
    </div>
  )
}

export default Card
