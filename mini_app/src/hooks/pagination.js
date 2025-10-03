import { useEffect, useMemo, useState, useCallback } from "react";

export default function usePagination(items, pageSize = 12) {
  const [page, setPage] = useState(1);


  const safeItems = useMemo(() => {
    return Array.isArray(items) ? items : [];
  }, [items]);

  const totalPages = useMemo(() => {
    const n = safeItems.length;
    const size = Math.max(1, pageSize || 1);
    return n > 0 ? Math.ceil(n / size) : 1;
  }, [safeItems, pageSize]);

  const pageItems = useMemo(() => {
    if (safeItems.length === 0) return [];
    const size = Math.max(1, pageSize || 1);
    const start = (page - 1) * size;
    return safeItems.slice(start, start + size);
  }, [safeItems, page, pageSize]);

  // pag 1 cuando cambia el pageSize
  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  // Ajustar página si excede el total
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
    if (page < 1) setPage(1);
  }, [page, totalPages]);

  const next = useCallback(() => setPage(p => Math.min(totalPages, p + 1)), [totalPages]);
  const prev = useCallback(() => setPage(p => Math.max(1, p - 1)), []);
  const reset = useCallback(() => setPage(1), []);

  return { page, setPage, totalPages, pageItems, next, prev, reset };
}