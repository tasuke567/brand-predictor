import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./pagination.module.css";

type Props = {
  page: number;
  pageCount: number;
  setPage: (p: number) => void;
};

export const Pagination: React.FC<Props> = ({ page, pageCount, setPage }) => (
  <div className={styles.pagination}>
    <button
      className={styles["btn-ghost-sm"]}
      disabled={page === 1}
      onClick={() => setPage(page - 1)}
    >
      <ChevronLeft size={18} />
    </button>

    <span className={styles["page-info"]}>
      {page} / {pageCount}
    </span>

    <button
      className={styles["btn-ghost-sm"]}
      disabled={page === pageCount}
      onClick={() => setPage(page + 1)}
    >
      <ChevronRight size={18} />
    </button>
  </div>
);
