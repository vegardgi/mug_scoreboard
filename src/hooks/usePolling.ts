"use client";
import { useEffect, useCallback } from "react";

export function usePolling(fetchFn: () => Promise<void>, intervalMs: number) {
  const stableFetch = useCallback(fetchFn, [fetchFn]);

  useEffect(() => {
    const id = setInterval(stableFetch, intervalMs);
    return () => clearInterval(id);
  }, [stableFetch, intervalMs]);
}
