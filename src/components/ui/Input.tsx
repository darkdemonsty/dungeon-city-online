import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm mb-1 glow-text-secondary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-3 py-2 bg-black border border-primary rounded glow-border focus:glow-border-focus transition-shadow ${className}`}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = 'Input'