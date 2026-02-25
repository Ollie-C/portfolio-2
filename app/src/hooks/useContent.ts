import { useQuery } from '@tanstack/react-query';
import { fetchContent } from '../services/api';
import type { CMSContent } from '../services/api';

export const contentKeys = {
  all: ['content'] as const,
};

export function useContent() {
  return useQuery({
    queryKey: contentKeys.all,
    queryFn: () => fetchContent(),
  });
}

export type { CMSContent };
