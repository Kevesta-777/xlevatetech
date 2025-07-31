import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { PostgrestFilterBuilder } from '@supabase/postgrest-js';

interface FallbackData<T> {
  data: T[];
  isFromCache: boolean;
  lastUpdated?: Date;
}

interface SupabaseHookOptions<T> {
  table: string;
  select?: string;
  orderBy?: { column: string; ascending?: boolean };
  filter?: { column: string; value: any; operator?: string };
  cacheKey: string;
  fallbackData?: T[];
  maxRetries?: number;
  retryDelay?: number;
}

interface SupabaseHookResult<T> {
  data: T[];
  isLoading: boolean;
  error: Error | null;
  isConnected: boolean;
  isFromCache: boolean;
  retryCount: number;
  refetch: () => Promise<void>;
  clearCache: () => void;
}

export function useSupabaseWithFallback<T = any>(
  options: SupabaseHookOptions<T>
): SupabaseHookResult<T> {
  const {
    table,
    select = '*',
    orderBy,
    filter,
    cacheKey,
    fallbackData = [],
    maxRetries = 3,
    retryDelay = 1000
  } = options;

  const [data, setData] = useState<T[]>(fallbackData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isFromCache, setIsFromCache] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Cache management
  const getCachedData = useCallback((): FallbackData<T> | null => {
    try {
      const cached = localStorage.getItem(`supabase_cache_${cacheKey}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        // Check if cache is less than 10 minutes old
        const cacheAge = Date.now() - new Date(parsed.timestamp).getTime();
        if (cacheAge < 10 * 60 * 1000) {
          return {
            data: parsed.data,
            isFromCache: true,
            lastUpdated: new Date(parsed.timestamp)
          };
        }
      }
    } catch (err) {
      console.warn('Failed to retrieve cached data:', err);
    }
    return null;
  }, [cacheKey]);

  const setCachedData = useCallback((data: T[]) => {
    try {
      const cacheData = {
        data,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(`supabase_cache_${cacheKey}`, JSON.stringify(cacheData));
    } catch (err) {
      console.warn('Failed to cache data:', err);
    }
  }, [cacheKey]);

  const clearCache = useCallback(() => {
    try {
      localStorage.removeItem(`supabase_cache_${cacheKey}`);
      console.log(`🗑️ Cleared cache for ${cacheKey}`);
    } catch (err) {
      console.warn('Failed to clear cache:', err);
    }
  }, [cacheKey]);

  // Fetch data with retry logic
  const fetchData = useCallback(async (attempt = 0): Promise<void> => {
    try {
      console.log(`🚀 Fetching data from ${table} (attempt ${attempt + 1}/${maxRetries + 1})`);
      
      let query: any = supabase.from(table as any).select(select);
      
      if (orderBy) {
        query = query.order(orderBy.column, { ascending: orderBy.ascending ?? false });
      }
      
      if (filter) {
        const operator = filter.operator || 'eq';
        query = query.filter(filter.column, operator, filter.value);
      }

      const { data: fetchedData, error: fetchError } = await query;

      if (fetchError) {
        throw new Error(`Database error: ${fetchError.message}`);
      }

      if (fetchedData) {
        console.log(`✅ Successfully fetched ${fetchedData.length} records from ${table}`);
        setData(fetchedData as T[]);
        setIsFromCache(false);
        setIsConnected(true);
        setError(null);
        setRetryCount(0);
        
        // Cache the successful result
        setCachedData(fetchedData as T[]);
      }

    } catch (err) {
      console.error(`❌ Fetch attempt ${attempt + 1} failed:`, err);
      setIsConnected(false);
      
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      
      // If we haven't exhausted retries, try again
      if (attempt < maxRetries) {
        const delay = retryDelay * Math.pow(2, attempt); // Exponential backoff
        console.log(`⏱️ Retrying in ${delay}ms...`);
        setRetryCount(attempt + 1);
        
        setTimeout(() => {
          fetchData(attempt + 1);
        }, delay);
        return;
      }

      // All retries exhausted, try to use cached data
      const cachedData = getCachedData();
      if (cachedData) {
        console.log('📦 Using cached data as fallback');
        setData(cachedData.data);
        setIsFromCache(true);
        setError(new Error(`${errorMessage} (showing cached data)`));
      } else {
        // No cache available, use fallback data
        console.log('🔄 Using fallback data');
        setData(fallbackData);
        setIsFromCache(false);
        setError(new Error(errorMessage));
      }
      
      setRetryCount(maxRetries);
    } finally {
      setIsLoading(false);
    }
  }, [table, select, orderBy, filter, maxRetries, retryDelay, getCachedData, setCachedData, fallbackData]);

  // Refetch function
  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setRetryCount(0);
    await fetchData(0);
  }, [fetchData]);

  // Initial load
  useEffect(() => {
    // Try to load cached data first for immediate display
    const cachedData = getCachedData();
    if (cachedData) {
      console.log('📦 Loading cached data while fetching fresh data');
      setData(cachedData.data);
      setIsFromCache(true);
      setIsLoading(false);
    }

    // Always fetch fresh data
    fetchData(0);
  }, [fetchData, getCachedData]);

  return {
    data,
    isLoading,
    error,
    isConnected,
    isFromCache,
    retryCount,
    refetch,
    clearCache
  };
}