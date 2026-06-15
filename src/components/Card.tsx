import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  accent?: string;
  hover?: boolean;
}

export function Card({ children, className = "", accent = "border-slate-800", hover = false }: CardProps) {
  return (
    <div
      className={`bg-slate-900 border rounded-xl ${accent} backdrop-blur-sm ${
        hover ? "transition-all hover:scale-[1.02] duration-200" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function KPICard({
  title,
  value,
  sub,
  trend,
  trendUp = true,
  icon,
  accent = "border-slate-800",
  loading = false,
}: {
  title: string;
  value: string;
  sub: string;
  trend?: string;
  trendUp?: boolean;
  icon: ReactNode;
  accent?: string;
  loading?: boolean;
}) {
  return (
    <Card accent={accent} hover className="p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{title}</p>
        <div className="p-1.5 rounded-lg bg-slate-800/60">{icon}</div>
      </div>
      <p className="text-3xl font-bold text-white mb-1">
        {loading ? <span className="inline-block w-16 h-8 bg-slate-700 rounded animate-pulse" /> : value}
      </p>
      <p className="text-xs text-slate-500">{sub}</p>
      {trend && (
        <p className={`text-xs font-medium mt-2 ${trendUp ? "text-green-400" : "text-amber-400"}`}>
          {trend}
        </p>
      )}
    </Card>
  );
}
