import { client, urlFor } from '../lib/sanity';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

export interface Project {
  _id: string;
  title: string;
  description: string;
  slug: {
    current: string;
  };
  category: string;
  tags: string[];
  featured: boolean;
  demoUrl?: string;
  sourceUrl?: string;
  image?: SanityImageSource;
  _createdAt: string;
  _updatedAt: string;
}

export interface NormalizedProject {
  id: string;
  title: string;
  description: string;
  slug: string;
  category: string;
  tags: string[];
  featured: boolean;
  demoUrl?: string;
  sourceUrl?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  _id: string;
  name: string;
  category: string;
  level: number;
  icon?: string;
}

export interface NormalizedSkill {
  id: string;
  name: string;
  category: string;
  level: number;
  icon?: string;
}

export interface CMSContent {
  heroTitle: string;
  heroSubtitle: string;
  aboutText?: string;
  contactEmail?: string;
}

const normalizeProject = (project: Project): NormalizedProject => ({
  id: project._id,
  title: project.title,
  description: project.description,
  slug: project.slug.current,
  category: project.category,
  tags: project.tags || [],
  featured: project.featured || false,
  demoUrl: project.demoUrl,
  sourceUrl: project.sourceUrl,
  imageUrl: project.image ? urlFor(project.image).url() : undefined,
  createdAt: project._createdAt,
  updatedAt: project._updatedAt,
});

const normalizeSkill = (skill: Skill): NormalizedSkill => ({
  id: skill._id,
  name: skill.name,
  category: skill.category,
  level: skill.level,
  icon: skill.icon,
});

// Fetch all projects
export async function fetchProjects(): Promise<NormalizedProject[]> {
  try {
    const projects = await client.fetch<Project[]>(`
      *[_type == "project"] {
        _id,
        title,
        slug,
        description,
        category,
        tags,
        featured,
        demoUrl,
        sourceUrl,
        image,
        _createdAt,
        _updatedAt
      }
    `);

    return projects.map(normalizeProject);
  } catch (error) {
    console.error('Error fetching projects:', error);

    // Return mock data if the API is not available
    return [
      {
        id: '1',
        title: 'Sushi Murasaki',
        description:
          'Web design project for a local Japanese restaurant. An early project, but a lot of fun.',
        imageUrl:
          'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8c3VzaGl8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
        category: 'OTHER',
        tags: ['Other', 'Photoshop', 'SASS', 'UI/UX'],
        slug: 'sushi-murasaki',
        featured: true,
        createdAt: '2023-01-15T00:00:00Z',
        updatedAt: '2023-01-20T00:00:00Z',
      },
      {
        id: '2',
        title: 'myyu',
        description:
          '[Under construction] A social movie ranker for list and movie enthusiasts',
        imageUrl:
          'https://images.unsplash.com/photo-1616530940355-351fabd9524b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
        category: 'FULL-STACK',
        tags: ['Full-stack', 'Next', 'TypeScript', 'GraphQL', 'Apollo', 'Jest'],
        slug: 'myyu',
        featured: true,
        demoUrl: '#',
        sourceUrl: 'https://github.com/example/myyu',
        createdAt: '2023-03-10T00:00:00Z',
        updatedAt: '2023-04-05T00:00:00Z',
      },
      {
        id: '3',
        title: 'FLix',
        description:
          "Youtube's better looking younger sibling. Home-grown API using Express and heavy focus on validation",
        imageUrl:
          'https://images.unsplash.com/photo-1611162616475-46b635cb6868?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
        category: 'FULL-STACK',
        tags: ['Full-stack', 'React', 'Express'],
        slug: 'flix',
        featured: true,
        demoUrl: '#',
        createdAt: '2023-02-01T00:00:00Z',
        updatedAt: '2023-02-15T00:00:00Z',
      },
    ];
  }
}

export async function fetchProjectBySlug(
  slug: string
): Promise<NormalizedProject | null> {
  try {
    const projects = await client.fetch<Project[]>(`
      *[_type == "project" && slug.current == "${slug}"] {
        _id,
        title,
        slug,
        description,
        category,
        tags,
        featured,
        demoUrl,
        sourceUrl,
        image,
        _createdAt,
        _updatedAt
      }
    `);

    if (!projects.length) {
      return null;
    }

    return normalizeProject(projects[0]);
  } catch (error) {
    console.error(`Error fetching project with slug ${slug}:`, error);

    // Return mock data if the API is not available
    const projects = await fetchProjects();
    return projects.find((project) => project.slug === slug) || null;
  }
}

// Fetch site content
export async function fetchContent(): Promise<CMSContent> {
  try {
    const homePageData = await client.fetch<any>(`
      *[_type == "homePage"][0] {
        heroTitle,
        heroSubtitle,
        aboutText,
        contactEmail
      }
    `);

    return homePageData;
  } catch (error) {
    console.error('Error fetching content:', error);

    // Return mock data if the API is not available
    return {
      heroTitle: 'Making A Difference',
      heroSubtitle: 'With Creative Development',
      aboutText:
        'Creative developer with a passion for clean code and beautiful designs.',
      contactEmail: 'hello@olliec.com',
    };
  }
}

// Fetch skills
export async function fetchSkills(): Promise<NormalizedSkill[]> {
  try {
    const skills = await client.fetch<Skill[]>(`
      *[_type == "skill"] {
        _id,
        name,
        category,
        level,
        icon
      }
    `);

    return skills.map(normalizeSkill);
  } catch (error) {
    console.error('Error fetching skills:', error);

    // Return mock data if the API is not available
    return [
      { id: '1', name: 'React', category: 'Frontend', level: 5 },
      { id: '2', name: 'TypeScript', category: 'Languages', level: 5 },
      { id: '3', name: 'Node.js', category: 'Backend', level: 4 },
      { id: '4', name: 'Express', category: 'Backend', level: 4 },
      { id: '5', name: 'GraphQL', category: 'Backend', level: 3 },
      { id: '6', name: 'MongoDB', category: 'Database', level: 4 },
      { id: '7', name: 'PostgreSQL', category: 'Database', level: 3 },
      { id: '8', name: 'Tailwind CSS', category: 'Frontend', level: 5 },
      { id: '9', name: 'Next.js', category: 'Frontend', level: 4 },
      { id: '10', name: 'Astro', category: 'Frontend', level: 3 },
    ];
  }
}
