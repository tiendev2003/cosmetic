import { FC } from "react";
import { Pagination as PG } from "../../types/pagination.types";
import twFocusClass from "../../utils/twFocusClass";

export interface PaginationProps {
  pagination?:  PG;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: FC<PaginationProps> = ({ pagination, onPageChange, className = "" }) => {
  const currentPage = pagination?.currentPage ?? 1;
  const totalPages = pagination?.totalPages ?? 1;

  // Tạo danh sách các trang
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className={`nc-Pagination flex space-x-1 text-base font-medium ${className}`}>
      {/* Nút Previous */}
      <button
        className={`w-11 h-11 flex items-center justify-center rounded-full 
        border ${currentPage === 1 ? "cursor-not-allowed opacity-50" : "hover:bg-neutral-100"} 
        ${twFocusClass()}`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &laquo;
      </button>

      {/* Danh sách các trang */}
      {pages.map((page) => (
        <button
          key={page}
          className={`w-11 h-11 flex items-center justify-center rounded-full border 
          ${page === currentPage ? "bg-primary-6000 text-white" : "hover:bg-neutral-100"} 
          ${twFocusClass()}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      {/* Nút Next */}
      <button
        className={`w-11 h-11 flex items-center justify-center rounded-full 
        border ${currentPage === totalPages ? "cursor-not-allowed opacity-50" : "hover:bg-neutral-100"} 
        ${twFocusClass()}`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &raquo;
      </button>
    </nav>
  );
};

export default Pagination;
