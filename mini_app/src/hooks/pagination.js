import { useEffect, useMemo, useState, useCallback } from "react";

export default function usePagination(items, initialPageSize = 12) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = useMemo(() => {
    const n = items?.length ?? 0;
    const size = Math.max(1, pageSize || 1);
    return n > 0 ? Math.ceil(n / size) : 1;
  }, [items, pageSize]);

  const pageItems = useMemo(() => {
    const list = items ?? [];
    if (list.length === 0) return [];
    const size = Math.max(1, pageSize || 1);
    const start = (page - 1) * size;
    return list.slice(start, start + size);
  }, [items, page, pageSize]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
    if (page < 1) setPage(1);
  }, [page, totalPages]);

  const next = useCallback(() => setPage(p => Math.min(totalPages, p + 1)), [totalPages]);
  const prev = useCallback(() => setPage(p => Math.max(1, p - 1)), []);
  const reset = useCallback(() => setPage(1), []);

  return { page, setPage, pageSize, setPageSize, totalPages, pageItems, next, prev, reset };
}