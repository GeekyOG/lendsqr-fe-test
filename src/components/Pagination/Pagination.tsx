import chevronRight from "@/assets/icons/chevron-right.svg";
import styles from "./Pagination.module.scss";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

type PageEntry = number | "ellipsis";

function getPageNumbers(current: number, totalPages: number): PageEntry[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages: PageEntry[] = [1];
  if (current > 3) {
    pages.push("ellipsis");
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(totalPages - 1, current + 1);
  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (current < totalPages - 2) {
    pages.push("ellipsis");
  }
  pages.push(totalPages);

  return pages;
}

export default function Pagination({ page, pageSize, total, onPageChange, onPageSizeChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <nav className={styles.pagination} aria-label="Users table pagination">
      <div className={styles.pageSize}>
        <label htmlFor="page-size">Showing</label>
        <select
          id="page-size"
          className={styles.select}
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <span>out of {total}</span>
      </div>

      <div className={styles.pages}>
        <button
          type="button"
          className={styles.navButton}
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          <img src={chevronRight} alt="" className={styles.chevronLeft} />
        </button>

        {pageNumbers.map((entry, index) =>
          entry === "ellipsis" ? (
            <span key={`ellipsis-${index}`} className={styles.ellipsis}>
              &hellip;
            </span>
          ) : (
            <button
              key={entry}
              type="button"
              className={`${styles.pageButton} ${entry === page ? styles.active : ""}`}
              onClick={() => onPageChange(entry)}
              aria-current={entry === page ? "page" : undefined}
            >
              {entry}
            </button>
          ),
        )}

        <button
          type="button"
          className={styles.navButton}
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
        >
          <img src={chevronRight} alt="" />
        </button>
      </div>
    </nav>
  );
}
