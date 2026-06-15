import { STATUS_STYLES } from "@/lib/constants";

export function Badge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] || "bg-gray-50 text-gray-500 border-gray-200";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style}`}
    >
      <span className="w-1 h-1 rounded-full bg-current" />
      {status}
    </span>
  );
}

