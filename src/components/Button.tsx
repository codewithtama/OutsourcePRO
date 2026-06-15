"use client";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  loading?: boolean;
  size?: "sm" | "md" | "lg";
}

const VARIANTS = {
  primary: "bg-[#1a73e8] hover:bg-[#1557b0] active:bg-[#174ea6] text-white",
  secondary: "bg-white hover:bg-[#f1f3f4] text-[#3c4043] border border-[#dadce0]",
  danger: "bg-[#d93025] hover:bg-[#b3261e] active:bg-[#a50e0e] text-white",
  ghost: "text-[#5f6368] hover:bg-[#f1f3f4] hover:text-[#202124]",
};

const SIZES = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export function Button({
  variant = "primary", size = "md", loading = false, disabled, children, className = "", ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-[#1a73e8]/40 focus:outline-none ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
