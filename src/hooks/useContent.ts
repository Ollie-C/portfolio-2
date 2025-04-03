import { useQuery } from '@tanstack/react-query';
import { fetchContent } from '../services/api';
import type { CMSContent } from '../services/api';

// Query keys
export const contentKeys = {
  all: ['content'] as const,
};

// Hook to fetch site content
export function useContent() {
  return useQuery({
    queryKey: contentKeys.all,
    queryFn: () => fetchContent(),
  });
}
