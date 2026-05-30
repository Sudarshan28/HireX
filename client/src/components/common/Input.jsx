import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-sm text-text-muted font-medium">{label}</label>}
      <input
        ref={ref}
        className={`w-full bg-bg-surface border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all duration-200 ${error ? 'border-danger focus:border-danger focus:ring-danger' : ''} ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-danger mt-1">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
