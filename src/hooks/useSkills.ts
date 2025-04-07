import { useQuery } from '@tanstack/react-query';
import { fetchSkills, NormalizedSkill } from '../services/api';

export const skillKeys = {
  all: ['skills'] as const,
  byCategory: (category: string) => [...skillKeys.all, { category }] as const,
};

export function useSkills(category?: string) {
  return useQuery({
    queryKey: category ? skillKeys.byCategory(category) : skillKeys.all,
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
