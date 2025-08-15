import React from 'react'

type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export function Input(props: InputProps) {
  return (
    <input
      {...props}
      className={`w-full pl-10 pr-3 py-2 rounded-md border focus:outline-none focus:ring-2 ${props.className ?? ''}`}
      style={{ background: 'var(--input-bg)', color: 'var(--input-text)', borderColor: 'var(--input-border)', placeholderColor: 'var(--input-placeholder)' }}
    />
  )
}

export default Input
