import { useQuery } from '@tanstack/react-query';
import { fetchContent, CMSContent } from '../services/api';

export const contentKeys = {
  all: ['content'] as const,
};

export function useSiteContent() {
  return useQuery({
    queryKey: contentKeys.all,
    queryFn: fetchContent,
  });
}
