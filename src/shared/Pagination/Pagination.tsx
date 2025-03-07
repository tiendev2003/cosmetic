import { FC } from "react";
import { Pagination as PG } from "../../types/pagination.types";
import twFocusClass from "../../utils/twFocusClass";

export interface PaginationProps {
  pagination?: PG;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: FC<PaginationProps> = ({ pagination, onPageChange, className = "" }) => {
  const currentPage = pagination?.currentPage ?? 1; // Trang hiện tại (1-based)
  const totalPages = pagination?.totalPages ?? 1; // Tổng số trang

  // Hàm tạo danh sách các trang với dấu "..."
  const renderPageNumbers = () => {
    const maxPagesToShow = 3; // Số lượng trang tối đa hiển thị
    const pages = [];

    if (totalPages <= maxPagesToShow) {
      // Nếu tổng số trang ít hơn hoặc bằng số trang tối đa hiển thị
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Logic hiển thị dấu "..." khi số trang vượt quá maxPagesToShow
      const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2);
      let startPage = Math.max(1, currentPage - halfMaxPagesToShow);
      let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

      // Điều chỉnh nếu endPage gần cuối hoặc startPage gần đầu
      if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = endPage - maxPagesToShow + 1;
      }

      // Nếu không phải trang đầu và trang đầu không nằm trong dải hiển thị
      if (startPage > 1) {
        pages.push(1); // Luôn hiển thị trang đầu
        if (startPage > 2) {
          pages.push("..."); // Thêm dấu "..." nếu cách trang đầu xa
        }
      }

      // Thêm các trang trong dải hiển thị
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Nếu không phải trang cuối và trang cuối không nằm trong dải hiển thị
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push("..."); // Thêm dấu "..." nếu cách trang cuối xa
        }
        pages.push(totalPages); // Luôn hiển thị trang cuối
      }
    }

    return pages;
  };

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
        «
      </button>

      {/* Danh sách các trang */}
      {renderPageNumbers().map((page, index) =>
        typeof page === "string" ? (
          <span
            key={`ellipsis-${index}`}
            className="w-11 h-11 flex items-center justify-center rounded-full border text-gray-500"
          >
            {page}
          </span>
        ) : (
          <button
            key={page}
            className={`w-11 h-11 flex items-center justify-center rounded-full border 
            ${page === currentPage ? "bg-primary-6000 text-white" : "hover:bg-neutral-100"} 
            ${twFocusClass()}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        )
      )}

      {/* Nút Next */}
      <button
        className={`w-11 h-11 flex items-center justify-center rounded-full 
        border ${currentPage === totalPages ? "cursor-not-allowed opacity-50" : "hover:bg-neutral-100"} 
        ${twFocusClass()}`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        »
      </button>
    </nav>
  );
};

export default Pagination;