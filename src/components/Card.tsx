import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = "", hover = false }: CardProps) {
  return (
    <div
      className={`bg-white border border-[#dadce0] rounded-xl shadow-google-card ${
        hover ? "transition-shadow hover:shadow-google-hover" : ""
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
    <Card hover className="p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-[#5f6368] uppercase tracking-wider">{title}</p>
        <div className="p-1.5 rounded-lg bg-[#f1f3f4]">{icon}</div>
      </div>
      <p className="text-3xl font-normal text-[#202124] mb-1">
        {loading ? <span className="inline-block w-16 h-8 bg-[#f1f3f4] rounded animate-pulse" /> : value}
      </p>
      <p className="text-xs text-[#5f6368]">{sub}</p>
      {trend && (
        <p className={`text-xs font-medium mt-2 ${trendUp ? "text-[#1e8e3e]" : "text-[#d93025]"}`}>{trend}</p>
      )}
    </Card>
  );
}
