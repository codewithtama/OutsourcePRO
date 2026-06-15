import { STATUS_STYLES } from "@/lib/constants";

export function Badge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
        STATUS_STYLES[status] || "bg-slate-500/15 text-slate-400 border border-slate-500/30"
      }`}
    >
      {status}
    </span>
  );
}
