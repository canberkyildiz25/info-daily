export interface Author {
  name: string;
  slug: string;
  title: string;
  bio: string;
  longBio: string;
  specialty: string;
  avatarColor: string;
  avatar: string;
  expertise: string[];
  joinedYear: number;
}

export const EDITORIAL_TEAM: Author = {
  name: 'InfoDaily Editorial Team',
  slug: 'infodaily-editorial-team',
  title: 'Editorial Desk',
  bio: 'InfoDaily’s editorial desk publishes practical explainers, source-led guides, and curated news briefs for everyday readers.',
  longBio: 'InfoDaily is published by an editorial desk, not by anonymous or unverifiable individual profiles. We aim to make complex subjects easier to understand, link to useful primary sources where they inform a claim, and update a guide when its underlying information changes. Our content is for general information and is not a substitute for professional medical, legal, financial, or other specialist advice.',
  specialty: 'Editorial standards & practical guides',
  avatarColor: 'bg-blue-700',
  avatar: '/logo.svg',
  expertise: ['Source-led explainers', 'Practical guides', 'Editorial standards'],
  joinedYear: 2025,
};

export const AUTHORS: Author[] = [EDITORIAL_TEAM];

export function normalizeAuthorName(_name?: string): string {
  void _name;
  return EDITORIAL_TEAM.name;
}

export function getAuthorByName(name: string): Author | undefined {
  return name === EDITORIAL_TEAM.name ? EDITORIAL_TEAM : undefined;
}

export function getAuthorBySlug(slug: string): Author | undefined {
  return slug === EDITORIAL_TEAM.slug ? EDITORIAL_TEAM : undefined;
}

export function authorNameToSlug(name: string): string {
  if (name === EDITORIAL_TEAM.name) return EDITORIAL_TEAM.slug;
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}
