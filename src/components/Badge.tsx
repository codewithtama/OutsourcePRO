import { STATUS_STYLES } from "@/lib/constants";

export function Badge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        STATUS_STYLES[status] || "bg-[#f1f3f4] text-[#5f6368]"
      }`}
    >
      {status}
    </span>
  );
}
