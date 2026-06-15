"use client";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  error?: string;
  onChange?: (value: string) => void;
}

export function Input({ label, error, id, className = "", onChange, ...props }: InputProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-1.5">{label}</label>
      <input
        id={id}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className={`w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none transition-all placeholder-brand-muted/60 focus:ring-4 ${
          error
            ? "border-google-red text-google-red focus:border-google-red focus:ring-google-red/10"
            : "border-brand-border text-brand-dark focus:border-brand-primary focus:ring-brand-primary/10"
        }`}
        {...props}
      />
      {error && <p className="text-xs text-google-red mt-1">{error}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, id, options, className = "", ...props }: SelectProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-1.5">{label}</label>
      <select
        id={id}
        className={`w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none transition-all focus:ring-4 bg-white ${
          error
            ? "border-google-red text-google-red focus:border-google-red focus:ring-google-red/10"
            : "border-brand-border text-brand-dark focus:border-brand-primary focus:ring-brand-primary/10"
        }`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-google-red mt-1">{error}</p>}
    </div>
  );
}

