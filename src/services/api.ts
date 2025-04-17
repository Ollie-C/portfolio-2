import { client, urlFor } from '../lib/sanity';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

export interface ProjectImage {
  _key: string;
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
  caption?: string;
}

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
  active: boolean;
  legacy?: boolean;
  demoUrl?: string;
  sourceUrl?: string;
  image?: SanityImageSource;
  projectImages?: ProjectImage[];
  desktopImages?: ProjectImage[];
  mobileImages?: ProjectImage[];
  techStack?: string[];
  features?: string[];
  summary?: string;
  note?: string;
  _createdAt: string;
  _updatedAt: string;
}

export interface NormalizedProjectImage {
  url: string;
  alt?: string;
  caption?: string;
}

export interface NormalizedProject {
  id: string;
  title: string;
  description: string;
  slug: string;
  category: string;
  tags: string[];
  featured: boolean;
  active: boolean;
  legacy?: boolean;
  demoUrl?: string;
  sourceUrl?: string;
  imageUrl?: string;
  images: NormalizedProjectImage[];
  desktopImages: NormalizedProjectImage[];
  mobileImages: NormalizedProjectImage[];
  techStack?: string[];
  features?: string[];
  summary?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  _id: string;
  name: string;
  category: string;
  level: number;
  icon?: any; // Sanity image reference
}

export interface NormalizedSkill {
  id: string;
  name: string;
  category: string;
  level: number;
  icon?: any; // Keep the Sanity image reference intact
}

export interface CMSContent {
  heroTitle: string;
  heroSubtitle: string;
  aboutText?: string;
  contactEmail?: string;
}

const normalizeProject = (project: Project): NormalizedProject => {
  // First try to use the main image, then try the first project image,
  // then try the first desktop image, then use empty string to trigger fallback
  let mainImageUrl = '';

  if (project.image) {
    mainImageUrl = urlFor(project.image).url();
  } else if (project.projectImages && project.projectImages.length > 0) {
    mainImageUrl = urlFor(project.projectImages[0]).url();
  } else if (project.desktopImages && project.desktopImages.length > 0) {
    mainImageUrl = urlFor(project.desktopImages[0]).url();
  }

  return {
    id: project._id,
    title: project.title,
    description: project.description,
    slug: project.slug.current,
    category: project.category,
    tags: project.tags || [],
    featured: project.featured || false,
    active: project.active !== undefined ? project.active : true,
    legacy: project.legacy || false,
    demoUrl: project.demoUrl,
    sourceUrl: project.sourceUrl,
    imageUrl: mainImageUrl,
    techStack: project.techStack || [],
    features: project.features || [],
    summary: project.summary,
    note: project.note,
    images: project.projectImages
      ? project.projectImages.map((image) => ({
          url: urlFor(image).url(),
          alt: image.alt,
          caption: image.caption,
        }))
      : [],
    desktopImages: project.desktopImages
      ? project.desktopImages.map((image) => ({
          url: urlFor(image).url(),
          alt: image.alt,
          caption: image.caption,
        }))
      : [],
    mobileImages: project.mobileImages
      ? project.mobileImages.map((image) => ({
          url: urlFor(image).url(),
          alt: image.alt,
          caption: image.caption,
        }))
      : [],
    createdAt: project._createdAt,
    updatedAt: project._updatedAt,
  };
};

const normalizeSkill = (skill: Skill): NormalizedSkill => ({
  id: skill._id,
  name: skill.name,
  category: skill.category,
  level: skill.level,
  icon: skill.icon, // Pass through the icon object as is
});

// Fetch all projects
export async function fetchProjects(): Promise<NormalizedProject[]> {
  try {
    const projects = await client.fetch<Project[]>(`
      *[_type == "project" && (active == true || !defined(active))] | order(featured desc, _createdAt desc) {
        _id,
        title,
        slug,
        description,
        summary,
        note,
        category,
        tags,
        featured,
        active,
        legacy,
        demoUrl,
        sourceUrl,
        techStack,
        features,
        image,
        projectImages[] {
          _key,
          _type,
          asset,
          alt,
          caption
        },
        desktopImages[] {
          _key,
          _type,
          asset,
          alt,
          caption
        },
        mobileImages[] {
          _key,
          _type,
          asset,
          alt,
          caption
        },
        _createdAt,
        _updatedAt
      }
    `);

    return projects.map(normalizeProject);
  } catch (error) {
    console.error('Error fetching projects:', error);

    return [];
  }
}

export async function fetchProjectBySlug(
  slug: string
): Promise<NormalizedProject | null> {
  try {
    const projects = await client.fetch<Project[]>(`
      *[_type == "project" && slug.current == "${slug}" && (active == true || !defined(active))] {
        _id,
        title,
        slug,
        description,
        summary,
        note,
        category,
        tags,
        techStack,
        features,
        featured,
        active,
        legacy,
        demoUrl,
        sourceUrl,
        image,
        projectImages[] {
          _key,
          _type,
          asset,
          alt,
          caption
        },
        desktopImages[] {
          _key,
          _type,
          asset,
          alt,
          caption
        },
        mobileImages[] {
          _key,
          _type,
          asset,
          alt,
          caption
        },
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
        "icon": icon
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
