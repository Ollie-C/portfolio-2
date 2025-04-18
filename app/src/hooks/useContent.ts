import { useState, useEffect } from 'react';
import { fetchContent } from '../services/api';
import type { CMSContent } from '../services/api';

export function useContent() {
  const [data, setData] = useState<CMSContent | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadContent() {
      try {
        setIsLoading(true);
        const content = await fetchContent();
        setData(content);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to fetch content')
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadContent();
  }, []);

  return { data, isLoading, error };
}
