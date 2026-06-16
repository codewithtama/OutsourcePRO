"use client";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  loading?: boolean;
  size?: "sm" | "md" | "lg";
}

const VARIANTS = {
  primary: "bg-brand-primary hover:bg-[#1a54dc] active:bg-[#1546bd] text-white shadow-sm",
  secondary: "bg-white hover:bg-brand-primary-light text-brand-dark border border-brand-border hover:border-brand-primary/30 transition-all",
  danger: "bg-google-red hover:bg-[#c52d27] active:bg-[#a8221c] text-white shadow-sm",
  ghost: "text-brand-muted hover:bg-[#f1f3f5] hover:text-brand-dark",
};

const SIZES = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export function Button({
  variant = "primary", size = "md", loading = false, disabled, children, className = "", type = "button", ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand-primary/30 focus:outline-none ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-1.5 px-2">
          <span className="w-1.5 h-1.5 rounded-full bg-current pulse-dot-1" />
          <span className="w-1.5 h-1.5 rounded-full bg-current pulse-dot-2" />
          <span className="w-1.5 h-1.5 rounded-full bg-current pulse-dot-3" />
        </span>
      ) : children}
    </button>
  );
}
