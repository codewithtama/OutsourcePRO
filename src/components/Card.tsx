import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = "", hover = false }: CardProps) {
  return (
    <div
      className={`bg-white border border-brand-border rounded-xl shadow-premium transition-all duration-300 ${
        hover ? "hover:-translate-y-0.5 hover:shadow-premium-hover hover:border-brand-primary/20" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function KPICard({
  title, value, sub, trend, trendUp = true, icon, loading = false,
}: {
  title: string; value: string; sub: string; trend?: string; trendUp?: boolean;
  icon: ReactNode; loading?: boolean;
}) {
  return (
    <Card hover className="p-5 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">{title}</p>
          <div className="p-2 rounded-lg bg-brand-primary-light text-brand-primary flex items-center justify-center">
            {icon}
          </div>
        </div>
        <p className="text-3xl font-bold text-brand-dark tracking-tight mb-1">
          {loading ? <span className="inline-block w-16 h-8 bg-brand-primary-light rounded animate-pulse" /> : value}
        </p>
        <p className="text-xs text-brand-muted font-medium">{sub}</p>
      </div>
      {trend && (
        <div className="mt-4 pt-3 border-t border-brand-border flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${trendUp ? "bg-google-green" : "bg-google-red"}`} />
          <p className={`text-xs font-semibold ${trendUp ? "text-google-green" : "text-google-red"}`}>{trend}</p>
        </div>
      )}
    </Card>
  );
}

