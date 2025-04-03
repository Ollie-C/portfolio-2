import { useQuery } from '@tanstack/react-query';
import { fetchSkills } from '../services/api';
import type { NormalizedSkill } from '../services/api';

// Query keys
export const skillKeys = {
  all: ['skills'] as const,
  filtered: (category: string) => [...skillKeys.all, { category }] as const,
};

// Hook to fetch all skills or filter by category
export function useSkills(category?: string) {
  return useQuery({
    queryKey: category ? skillKeys.filtered(category) : skillKeys.all,
    queryFn: async () => {
      const skills = await fetchSkills();

      if (category) {
        return skills.filter(
          (skill) => skill.category.toLowerCase() === category.toLowerCase()
        );
      }

      return skills;
    },
  });
}
