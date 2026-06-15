export function TableSkeleton({ rows = 5, cols = 7 }: { rows?: number; cols?: number }) {
  return (
    <tbody className="divide-y divide-slate-800">
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i}>
          {Array.from({ length: cols }).map((__, j) => (
            <td key={j} className="px-5 py-4">
              <div className="h-3 bg-slate-800 rounded animate-pulse w-24" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
