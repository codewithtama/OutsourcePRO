"use client";

interface PaginationProps {
  currentPage: number; lastPage: number; total: number;
  from: number | null; to: number | null;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, lastPage, total, from, to, onPageChange }: PaginationProps) {
  if (lastPage <= 1) return null;

  return (
    <div className="flex items-center justify-between px-5 py-4 border-t border-[#dadce0]">
      <p className="text-xs text-[#5f6368]">Showing {from ?? 0}–{to ?? 0} of {total}</p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-3 py-1.5 text-xs font-medium text-[#5f6368] bg-white border border-[#dadce0] rounded-lg hover:bg-[#f1f3f4] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        {Array.from({ length: Math.min(lastPage, 5) }).map((_, i) => {
          const page = i + 1;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                page === currentPage
                  ? "bg-[#1a73e8] text-white"
                  : "text-[#5f6368] bg-white border border-[#dadce0] hover:bg-[#f1f3f4]"
              }`}
            >
              {page}
            </button>
          );
        })}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= lastPage}
          className="px-3 py-1.5 text-xs font-medium text-[#5f6368] bg-white border border-[#dadce0] rounded-lg hover:bg-[#f1f3f4] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
