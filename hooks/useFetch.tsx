import { getIdToken } from '@/services/auth';
import config from '@/utils/config';
import { useEffect, useState } from 'react';

interface FetchState<S> {
  data: S | null;
  loading: boolean;
  error: string | null;
}

const useFetch = function <S>(
  url: string,
  dependencies: any[] = [],
  options?: RequestInit
): FetchState<S> {
  const [data, setData] = useState<S | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setLoading(true);
      try {
        const idToken = await getIdToken();
        const headers: any = {
          'Content-Type': 'application/json'
        };
        if (idToken) {
          headers.Authorization = `Bearer ${idToken}`;
        }
        const response = await fetch(`${config.API_URL}${url}`, {
          ...options,
          headers,
          signal
        });
        const result = await response.json();
        if (isMounted) {
          setData(result);
        }
      } catch (error) {
        if (isMounted) {
          setError((error as Error).message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, dependencies);

  return { data, loading, error };
};

export default useFetch;
