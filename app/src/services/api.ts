import { client, urlFor, SanityImageSource } from '../lib/sanity';

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
  titleJa?: string;
  description: string;
  descriptionJa?: string;
  slug?: {
    current: string;
  } | null;
  category: string;
  tags: string[];
  featured: boolean;
  active: boolean;
  legacy?: boolean;
  inProgress?: boolean;
  demoUrl?: string;
  sourceUrl?: string;
  image?: SanityImageSource;
  projectImages?: ProjectImage[];
  desktopImages?: ProjectImage[];
  mobileImages?: ProjectImage[];
  techStack?: string[];
  features?: string[];
  featuresJa?: string[];
  summary?: string;
  summaryJa?: string;
  note?: string;
  noteJa?: string;
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
  titleJa: string;
  description: string;
  descriptionJa: string;
  slug: string;
  category: string;
  tags: string[];
  featured: boolean;
  active: boolean;
  legacy?: boolean;
  inProgress?: boolean;
  demoUrl?: string;
  sourceUrl?: string;
  imageUrl?: string;
  images: NormalizedProjectImage[];
  desktopImages: NormalizedProjectImage[];
  mobileImages: NormalizedProjectImage[];
  techStack?: string[];
  features?: string[];
  featuresJa?: string[];
  summary?: string;
  summaryJa?: string;
  note?: string;
  noteJa?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  _id: string;
  name: string;
  category: string;
  level: number;
  icon?: SanityImageSource;
}

export interface NormalizedSkill {
  id: string;
  name: string;
  category: string;
  level: number;
  icon?: SanityImageSource;
}

export interface HeroUpdate {
  enabled: boolean;
  message?: string;
  messageJa?: string;
  link?: string;
  linkText?: string;
}

export interface SiteSettings {
  title?: string;
  description?: string;
  keywords?: string[];
  author?: string;
  heroUpdate?: HeroUpdate;
  contactEmail?: string;
  googleAnalyticsId?: string;
}

export interface CMSContent {
  heroTitle: string;
  heroSubtitle: string;
  aboutText?: string;
  contactEmail?: string;
}

const normalizeProject = (project: Project): NormalizedProject => {
  const slug = project.slug?.current ?? '';
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
    titleJa: project.titleJa || project.title, // Fallback to English if Japanese not available
    description: project.description,
    descriptionJa: project.descriptionJa || project.description, // Fallback to English if Japanese not available
    slug,
    category: project.category,
    tags: project.tags || [],
    featured: project.featured || false,
    active: project.active !== undefined ? project.active : true,
    legacy: project.legacy || false,
    inProgress: project.inProgress || false,
    demoUrl: project.demoUrl,
    sourceUrl: project.sourceUrl,
    imageUrl: mainImageUrl,
    techStack: project.techStack || [],
    features: project.features || [],
    featuresJa: project.featuresJa || project.features || [], // Fallback to English features
    summary: project.summary,
    summaryJa: project.summaryJa || project.summary, // Fallback to English if Japanese not available
    note: project.note,
    noteJa: project.noteJa || project.note, // Fallback to English if Japanese not available
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
        titleJa,
        slug,
        description,
        descriptionJa,
        summary,
        summaryJa,
        note,
        noteJa,
        category,
        tags,
        featured,
        active,
        legacy,
        inProgress,
        demoUrl,
        sourceUrl,
        techStack,
        features,
        featuresJa,
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

    return projects
      .filter((p): p is Project => p != null && p.slug?.current != null)
      .map(normalizeProject);
  } catch (error) {
    console.error('Error fetching projects:', error);

    return [];
  }
}

export async function fetchProjectBySlug(
  slug: string
): Promise<NormalizedProject | null> {
  if (!slug) {
    console.warn('Attempted to fetch project with empty slug');
    return null;
  }

  try {
    const project = await client.fetch<Project | null>(
      `*[_type == "project" && slug.current == $slug][0]`,
      { slug }
    );

    if (!project) {
      console.warn(`Project with slug "${slug}" not found`);
      return null;
    }

    return normalizeProject(project);
  } catch (error) {
    console.error('Error fetching project by slug:', error);
    throw error;
  }
}

// Fetch site content
export async function fetchContent(): Promise<CMSContent> {
  try {
    // Define a type for the CMS home page data
    interface HomePageData {
      heroTitle: string;
      heroSubtitle: string;
      aboutText?: string;
      contactEmail?: string;
    }

    const homePageData = await client.fetch<HomePageData>(`
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
      *[_type == "skill"] | order(category asc, proficiency desc, name asc) {
        _id,
        name,
        category,
        "level": proficiency,
        "icon": icon
      }
    `);

    return skills.map(normalizeSkill);
  } catch (error) {
    console.error('Error fetching skills:', error);

    // Return mock data if the API is not available
    return [
      { id: '1', name: 'React', category: 'core', level: 5 },
      { id: '2', name: 'TypeScript', category: 'core', level: 5 },
      { id: '3', name: 'Node.js', category: 'strong_working_experience', level: 4 },
      { id: '4', name: 'Tailwind CSS', category: 'core', level: 5 },
      { id: '5', name: 'Next.js', category: 'strong_working_experience', level: 4 },
      { id: '6', name: 'Astro', category: 'familiar_with', level: 3 },
    ];
  }
}
