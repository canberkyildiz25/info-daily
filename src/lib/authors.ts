export interface Author {
  name: string;
  slug: string;
  title: string;
  bio: string;
  specialty: string;
  avatarColor: string;
}

export const AUTHORS: Author[] = [
  {
    name: 'Dr. Sarah Collins',
    slug: 'dr-sarah-collins',
    title: 'Health & Wellness Editor',
    bio: 'Dr. Sarah Collins is a medical writer with over a decade of experience translating complex health research into practical advice. She focuses on nutrition, preventive care, and evidence-based wellness strategies.',
    specialty: 'Health & Wellness',
    avatarColor: 'bg-emerald-600',
  },
  {
    name: 'James Park, CFP',
    slug: 'james-park-cfp',
    title: 'Personal Finance Expert',
    bio: 'James Park is a Certified Financial Planner with 15 years of experience in wealth management. He specializes in personal budgeting, investing, and building long-term financial security.',
    specialty: 'Personal Finance',
    avatarColor: 'bg-amber-600',
  },
  {
    name: 'Alex Rivera',
    slug: 'alex-rivera',
    title: 'Technology & Productivity Writer',
    bio: 'Alex Rivera covers the intersection of technology and everyday life — from AI tools and gadgets to productivity systems that actually work. Based in San Francisco.',
    specialty: 'Technology & Life Hacks',
    avatarColor: 'bg-blue-600',
  },
  {
    name: 'Sophie Martinez',
    slug: 'sophie-martinez',
    title: 'Travel & Food Editor',
    bio: 'Sophie Martinez has visited over 60 countries and written about food, culture, and travel for a decade. She believes the best way to understand a place is through its cuisine.',
    specialty: 'Travel & Food',
    avatarColor: 'bg-sky-600',
  },
  {
    name: 'Maria Chen',
    slug: 'maria-chen',
    title: 'Relationships & Psychology Writer',
    bio: 'Maria Chen writes about human connection, communication, and emotional intelligence. Her work draws on psychology research to offer grounded, compassionate advice for modern relationships.',
    specialty: 'Relationships',
    avatarColor: 'bg-rose-600',
  },
  {
    name: 'Emma Johnson',
    slug: 'emma-johnson',
    title: 'Life Hacks & Business Contributor',
    bio: 'Emma Johnson is a productivity coach and business writer. She specializes in career development, habits, and the small daily changes that lead to big results.',
    specialty: 'Life Hacks & Business',
    avatarColor: 'bg-violet-600',
  },
  {
    name: 'David Kim',
    slug: 'david-kim',
    title: 'Science & Technology Writer',
    bio: 'David Kim holds a degree in physics and writes about science, emerging technologies, and how discoveries shape our future. He is passionate about making science accessible to everyone.',
    specialty: 'Science & Technology',
    avatarColor: 'bg-indigo-600',
  },
  {
    name: 'Jessica Morgan',
    slug: 'jessica-morgan',
    title: 'Food & Health Writer',
    bio: 'Jessica Morgan is a nutritionist and food writer who explores the connection between what we eat and how we feel. She creates practical, delicious recipes grounded in nutritional science.',
    specialty: 'Food & Health',
    avatarColor: 'bg-orange-600',
  },
  {
    name: 'Dr. Lena Fischer',
    slug: 'dr-lena-fischer',
    title: 'Science Correspondent',
    bio: 'Dr. Lena Fischer is a biologist turned science communicator. She covers topics from genetics and aging to environmental science, always seeking to connect research to real-world impact.',
    specialty: 'Science & Nature',
    avatarColor: 'bg-teal-600',
  },
  {
    name: 'Tom Bradley',
    slug: 'tom-bradley',
    title: 'Business & Career Writer',
    bio: 'Tom Bradley covers entrepreneurship, workplace dynamics, and career strategy. He interviews executives and founders to surface lessons that help professionals at every level.',
    specialty: 'Business & Career',
    avatarColor: 'bg-slate-600',
  },
  {
    name: 'Ryan Cooper',
    slug: 'ryan-cooper',
    title: 'Travel Writer',
    bio: 'Ryan Cooper is a full-time traveler and writer who specializes in budget travel, hidden destinations, and adventure experiences. He has explored every continent.',
    specialty: 'Travel',
    avatarColor: 'bg-cyan-600',
  },
  {
    name: 'Mark Stevens, CSCS',
    slug: 'mark-stevens-cscs',
    title: 'Fitness & Health Expert',
    bio: 'Mark Stevens is a Certified Strength and Conditioning Specialist with expertise in evidence-based fitness training, muscle building, and athletic performance.',
    specialty: 'Health & Fitness',
    avatarColor: 'bg-green-600',
  },
  {
    name: 'Lisa Chen',
    slug: 'lisa-chen',
    title: 'Staff Writer',
    bio: 'Lisa Chen is a versatile writer covering a broad range of lifestyle topics including wellness, technology, and personal development.',
    specialty: 'Lifestyle',
    avatarColor: 'bg-pink-600',
  },
  {
    name: 'Canberk Yildiz',
    slug: 'canberk-yildiz',
    title: 'Entertainment & Culture Writer',
    bio: 'Canberk Yildiz is a writer and editor focused on entertainment, pop culture, and lifestyle trends. He covers the stories behind what people watch, listen to, and talk about.',
    specialty: 'Entertainment & Culture',
    avatarColor: 'bg-purple-600',
  },
];

export function getAuthorByName(name: string): Author | undefined {
  return AUTHORS.find(a => a.name === name);
}

export function getAuthorBySlug(slug: string): Author | undefined {
  return AUTHORS.find(a => a.slug === slug);
}

export function authorNameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}
