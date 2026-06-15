"use client";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  error?: string;
  onChange?: (value: string) => void;
}

export function Input({ label, error, id, className = "", onChange, ...props }: InputProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
        {label}
      </label>
      <input
        id={id}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className={`w-full px-3 py-2.5 bg-slate-800 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder-slate-600 ${
          error ? "border-red-500 text-red-400" : "border-slate-700 text-slate-100"
        }`}
        {...props}
      />
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
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
      <label htmlFor={id} className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
        {label}
      </label>
      <select
        id={id}
        className={`w-full px-3 py-2.5 bg-slate-800 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
          error ? "border-red-500 text-red-400" : "border-slate-700 text-slate-100"
        }`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}
