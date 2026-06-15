export function TableSkeleton({ rows = 5, cols = 7 }: { rows?: number; cols?: number }) {
  return (
    <tbody className="divide-y divide-[#dadce0]">
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i}>
          {Array.from({ length: cols }).map((__, j) => (
            <td key={j} className="px-5 py-4"><div className="h-3 bg-[#f1f3f4] rounded w-24 animate-pulse" /></td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
