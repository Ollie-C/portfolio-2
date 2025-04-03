import { useQuery } from '@tanstack/react-query';
import { fetchProjects, fetchProjectBySlug } from '../services/api';
import type { NormalizedProject } from '../services/api';

// Query keys
export const projectKeys = {
  all: ['projects'] as const,
  details: (slug: string) => [...projectKeys.all, slug] as const,
  filtered: (category: string) => [...projectKeys.all, { category }] as const,
};

// Hook to fetch all projects
export function useProjects(category?: string) {
  return useQuery({
    queryKey: category ? projectKeys.filtered(category) : projectKeys.all,
    queryFn: async () => {
      const projects = await fetchProjects();

      if (category && category.toLowerCase() !== 'all') {
        return projects.filter(
          (project) => project.category.toLowerCase() === category.toLowerCase()
        );
      }

      return projects;
    },
  });
}

// Hook to fetch a single project by slug
export function useProject(slug: string) {
  return useQuery({
    queryKey: projectKeys.details(slug),
    queryFn: () => fetchProjectBySlug(slug),
    enabled: !!slug, // Only run if slug is provided
  });
}

// Hook to fetch featured projects
export function useFeaturedProjects() {
  return useQuery({
    queryKey: [...projectKeys.all, 'featured'],
    queryFn: async () => {
      const projects = await fetchProjects();
      return projects.filter((project) => project.featured);
    },
  });
}
