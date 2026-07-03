import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'destructive'
  loading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', loading, disabled, children, ...props }, ref) => {
    const baseClasses = 'px-4 py-2 rounded font-orbitron transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
    const variantClasses = {
      primary: 'bg-primary text-black hover:bg-opacity-80 glow-border',
      secondary: 'bg-secondary text-black hover:bg-opacity-80 glow-border-secondary',
      accent: 'bg-accent text-white hover:bg-opacity-80 glow-border-accent',
      destructive: 'bg-destructive text-white hover:bg-opacity-80 glow-text-accent glow-border-accent'
    }
    
    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? <span className="animate-pulse">LOADING...</span> : children}
      </button>
    )
  }
)
Button.displayName = 'Button'