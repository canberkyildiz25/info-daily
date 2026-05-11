export interface Author {
  name: string;
  slug: string;
  title: string;
  bio: string;
  longBio: string;
  specialty: string;
  avatarColor: string;
  expertise: string[];
  joinedYear: number;
}

export const AUTHORS: Author[] = [
  {
    name: 'Dr. Sarah Collins',
    slug: 'dr-sarah-collins',
    title: 'Health & Wellness Editor',
    bio: 'Dr. Sarah Collins is a medical writer with over a decade of experience translating complex health research into practical advice. She focuses on nutrition, preventive care, and evidence-based wellness strategies.',
    longBio: 'Dr. Sarah Collins earned her doctorate in biomedical sciences before pivoting to science communication, where she found her true calling: making rigorous research legible to everyday readers. Over more than a decade, she has written for leading health publications, reviewed clinical studies, and collaborated with physicians to produce content that is both accurate and genuinely useful. At InfoDaily, she oversees health and wellness coverage, ensuring every article meets the highest standards of scientific integrity. Outside of writing, Sarah is a certified yoga instructor and advocates for mental health awareness.',
    specialty: 'Health & Wellness',
    avatarColor: 'bg-emerald-600',
    expertise: ['Nutrition', 'Preventive Care', 'Mental Health', 'Evidence-Based Medicine'],
    joinedYear: 2022,
  },
  {
    name: 'James Park, CFP',
    slug: 'james-park-cfp',
    title: 'Personal Finance Expert',
    bio: 'James Park is a Certified Financial Planner with 15 years of experience in wealth management. He specializes in personal budgeting, investing, and building long-term financial security.',
    longBio: 'James Park spent the first decade of his career working at top-tier financial advisory firms, guiding high-net-worth clients through volatile markets and complex estate planning. After earning his CFP designation, he shifted focus toward helping everyday people build wealth from the ground up — a mission he now pursues through writing. His columns demystify investment vehicles, tax strategies, and financial planning in plain language. James believes financial literacy is a fundamental life skill that no one should have to learn the hard way. He lives in New York City and is an avid chess player.',
    specialty: 'Personal Finance',
    avatarColor: 'bg-amber-600',
    expertise: ['Investing', 'Budgeting', 'Retirement Planning', 'Tax Strategy'],
    joinedYear: 2022,
  },
  {
    name: 'Alex Rivera',
    slug: 'alex-rivera',
    title: 'Technology & Productivity Writer',
    bio: 'Alex Rivera covers the intersection of technology and everyday life — from AI tools and gadgets to productivity systems that actually work. Based in San Francisco.',
    longBio: 'Alex Rivera has been writing about technology since the early days of the smartphone revolution, and has watched nearly every major platform emerge, peak, and pivot. Based in San Francisco, he is embedded in the tech ecosystem — attending launches, testing unreleased software, and interviewing engineers and founders to understand not just what technology does, but why it was built. His writing cuts through hype to focus on practical impact: which tools actually save time, which trends are worth following, and which are noise. When he is not at a keyboard, Alex is experimenting with analog productivity systems to balance his screen time.',
    specialty: 'Technology & Life Hacks',
    avatarColor: 'bg-blue-600',
    expertise: ['Artificial Intelligence', 'Productivity Tools', 'Consumer Tech', 'Digital Wellness'],
    joinedYear: 2022,
  },
  {
    name: 'Sophie Martinez',
    slug: 'sophie-martinez',
    title: 'Travel & Food Editor',
    bio: 'Sophie Martinez has visited over 60 countries and written about food, culture, and travel for a decade. She believes the best way to understand a place is through its cuisine.',
    longBio: 'Sophie Martinez grew up in a bilingual household that treated dinner as a cultural ritual, and she has spent her adult life chasing that same feeling across six continents and more than 60 countries. Her travel writing goes beyond itineraries — she writes about the people, histories, and food systems that make each destination singular. Sophie has contributed to major travel magazines and runs a popular recipe column inspired by dishes she has encountered on the road. She holds a degree in cultural anthropology and brings that lens to every destination she covers. She is currently based between Barcelona and Mexico City.',
    specialty: 'Travel & Food',
    avatarColor: 'bg-sky-600',
    expertise: ['World Cuisine', 'Budget Travel', 'Cultural Immersion', 'Food History'],
    joinedYear: 2023,
  },
  {
    name: 'Maria Chen',
    slug: 'maria-chen',
    title: 'Relationships & Psychology Writer',
    bio: 'Maria Chen writes about human connection, communication, and emotional intelligence. Her work draws on psychology research to offer grounded, compassionate advice for modern relationships.',
    longBio: 'Maria Chen holds a master\'s degree in counseling psychology and spent several years working as a therapist before discovering she could help more people through writing. Her articles synthesize peer-reviewed research with real-world insight to address the challenges that quietly define modern life: communication breakdowns, loneliness, grief, boundary-setting, and the search for meaningful connection. Maria writes with empathy and precision, never reducing complex emotional experiences to listicles. She is a firm believer that understanding yourself is the foundation of every healthy relationship. She practices mindfulness daily and volunteers at a crisis support hotline.',
    specialty: 'Relationships',
    avatarColor: 'bg-rose-600',
    expertise: ['Communication', 'Emotional Intelligence', 'Conflict Resolution', 'Self-Development'],
    joinedYear: 2022,
  },
  {
    name: 'Emma Johnson',
    slug: 'emma-johnson',
    title: 'Life Hacks & Business Contributor',
    bio: 'Emma Johnson is a productivity coach and business writer. She specializes in career development, habits, and the small daily changes that lead to big results.',
    longBio: 'Emma Johnson started her career in management consulting before realizing she was more interested in helping individuals than organizations. She trained as a certified coach and began writing about the behavioral science behind productivity, habit formation, and career growth. Her work is informed by research from psychology, neuroscience, and organizational behavior — but delivered with the candor of someone who has made every productivity mistake in the book and recovered from all of them. Emma\'s writing has helped thousands of readers redesign their workdays, break self-defeating patterns, and build careers they are proud of. She hosts a podcast on intentional living.',
    specialty: 'Life Hacks & Business',
    avatarColor: 'bg-violet-600',
    expertise: ['Habit Formation', 'Career Development', 'Time Management', 'Personal Branding'],
    joinedYear: 2023,
  },
  {
    name: 'David Kim',
    slug: 'david-kim',
    title: 'Science & Technology Writer',
    bio: 'David Kim holds a degree in physics and writes about science, emerging technologies, and how discoveries shape our future. He is passionate about making science accessible to everyone.',
    longBio: 'David Kim studied physics at university with the intention of pursuing research, but an internship at a science magazine redirected his path toward communication. He realized that the gap between what scientists know and what the public understands is one of the most consequential problems of our time — and that clear writing can close it. At InfoDaily, David covers the full breadth of science and technology: from quantum computing and space exploration to climate science and biotechnology. He writes with rigor and curiosity, never dumbing down the subject matter but always finding the human story at its core. He is an amateur astronomer and telescope builder.',
    specialty: 'Science & Technology',
    avatarColor: 'bg-indigo-600',
    expertise: ['Physics', 'Emerging Tech', 'Space Exploration', 'Climate Science'],
    joinedYear: 2022,
  },
  {
    name: 'Jessica Morgan',
    slug: 'jessica-morgan',
    title: 'Food & Health Writer',
    bio: 'Jessica Morgan is a nutritionist and food writer who explores the connection between what we eat and how we feel. She creates practical, delicious recipes grounded in nutritional science.',
    longBio: 'Jessica Morgan trained as a registered nutritionist after spending years frustrated by the gap between nutrition science and the advice reaching most people. Her writing aims to correct that — translating evidence-based findings into practical guidance that fits real lives, not hypothetical ideal conditions. Jessica is particularly interested in the gut-brain connection, sustainable eating patterns, and how food culture shapes health outcomes across different communities. Beyond articles, she develops recipes tested in her home kitchen that are both nutritionally sound and genuinely appealing. She is a farmers\' market devotee and hosts seasonal cooking workshops in her local community.',
    specialty: 'Food & Health',
    avatarColor: 'bg-orange-600',
    expertise: ['Nutrition Science', 'Gut Health', 'Sustainable Eating', 'Recipe Development'],
    joinedYear: 2023,
  },
  {
    name: 'Dr. Lena Fischer',
    slug: 'dr-lena-fischer',
    title: 'Science Correspondent',
    bio: 'Dr. Lena Fischer is a biologist turned science communicator. She covers topics from genetics and aging to environmental science, always seeking to connect research to real-world impact.',
    longBio: 'Dr. Lena Fischer earned her doctorate in molecular biology at a leading European research institution, where her work focused on cellular aging mechanisms. After publishing in peer-reviewed journals, she grew increasingly motivated to bring scientific findings beyond the academic community. She transitioned to science communication and has since built a reputation for translating dense, technical research into writing that is both accurate and absorbing. At InfoDaily, Lena covers biology, environmental science, longevity research, and the human implications of genetic discovery. She is a strong advocate for open science and public access to research. She speaks four languages and writes a popular science newsletter.',
    specialty: 'Science & Nature',
    avatarColor: 'bg-teal-600',
    expertise: ['Molecular Biology', 'Aging & Longevity', 'Environmental Science', 'Genetics'],
    joinedYear: 2022,
  },
  {
    name: 'Tom Bradley',
    slug: 'tom-bradley',
    title: 'Business & Career Writer',
    bio: 'Tom Bradley covers entrepreneurship, workplace dynamics, and career strategy. He interviews executives and founders to surface lessons that help professionals at every level.',
    longBio: 'Tom Bradley spent a decade working in corporate strategy and business development before leaving to write full-time. His insider perspective informs everything he writes — he knows what boardroom conversations actually sound like, what founders lose sleep over, and which management strategies look good in press releases but fail in practice. Tom\'s interviews with executives and entrepreneurs are known for going beyond the polished talking points to find honest lessons about leadership, failure, and growth. He is particularly interested in the future of work and how companies can build cultures that bring out the best in people. He mentors early-stage startup founders in his spare time.',
    specialty: 'Business & Career',
    avatarColor: 'bg-slate-600',
    expertise: ['Entrepreneurship', 'Leadership', 'Workplace Culture', 'Career Strategy'],
    joinedYear: 2023,
  },
  {
    name: 'Ryan Cooper',
    slug: 'ryan-cooper',
    title: 'Travel Writer',
    bio: 'Ryan Cooper is a full-time traveler and writer who specializes in budget travel, hidden destinations, and adventure experiences. He has explored every continent.',
    longBio: 'Ryan Cooper quit a stable marketing job at 28 to travel the world with a one-way ticket and a tight budget, and he has not looked back since. Having now set foot on every continent — including a research station stint in Antarctica — he writes from genuine experience rather than press-trip itineraries. Ryan specializes in budget travel, off-the-beaten-path destinations, and the kind of practical advice that only comes from actually making the mistakes. His writing is direct, funny, and deeply useful. He believes travel does not require wealth — just planning, flexibility, and the willingness to be occasionally uncomfortable. He currently lives out of a single backpack.',
    specialty: 'Travel',
    avatarColor: 'bg-cyan-600',
    expertise: ['Budget Travel', 'Adventure Travel', 'Solo Travel', 'Destination Guides'],
    joinedYear: 2023,
  },
  {
    name: 'Mark Stevens, CSCS',
    slug: 'mark-stevens-cscs',
    title: 'Fitness & Health Expert',
    bio: 'Mark Stevens is a Certified Strength and Conditioning Specialist with expertise in evidence-based fitness training, muscle building, and athletic performance.',
    longBio: 'Mark Stevens has spent over 15 years in the fitness industry — first as a competitive athlete, then as a coach working with everyone from weekend warriors to professional sports teams. He earned his CSCS credential after years of field experience and has since made it his mission to cut through the noise in an industry full of pseudoscience and fads. Mark\'s writing is grounded in exercise physiology and real training data, and he has a particular talent for explaining why programs work — not just what to do. He is especially passionate about strength training for longevity and helping people train intelligently as they age. He competes in masters powerlifting.',
    specialty: 'Health & Fitness',
    avatarColor: 'bg-green-600',
    expertise: ['Strength Training', 'Athletic Performance', 'Exercise Science', 'Injury Prevention'],
    joinedYear: 2023,
  },
  {
    name: 'Lisa Chen',
    slug: 'lisa-chen',
    title: 'Lifestyle & Wellness Writer',
    bio: 'Lisa Chen is a versatile lifestyle writer covering wellness, personal growth, and everyday living. She brings warmth and practicality to topics that matter in daily life.',
    longBio: 'Lisa Chen has always been drawn to the intersection of everyday life and the search for meaning — a thread that runs through everything she writes. Her background in journalism and her personal practice of mindfulness give her work a grounded, reflective quality that readers consistently respond to. At InfoDaily, Lisa covers the full spectrum of lifestyle topics: home, wellness, relationships, sustainability, and the small decisions that shape how we live. She is a skilled interviewer who draws out candid perspectives from experts and everyday people alike. Lisa is also a committed community volunteer and writes occasionally about urban farming and local food systems.',
    specialty: 'Lifestyle & Wellness',
    avatarColor: 'bg-pink-600',
    expertise: ['Mindfulness', 'Home & Living', 'Sustainability', 'Personal Growth'],
    joinedYear: 2023,
  },
  {
    name: 'Canberk Yildiz',
    slug: 'canberk-yildiz',
    title: 'Entertainment & Culture Writer',
    bio: 'Canberk Yildiz is a writer and editor focused on entertainment, pop culture, and lifestyle trends. He covers the stories behind what people watch, listen to, and talk about.',
    longBio: 'Canberk Yildiz has been writing about culture since his college days running an independent arts publication, and his enthusiasm for the subject has only deepened over time. He covers the full landscape of entertainment and pop culture — film, television, music, gaming, and the social phenomena that emerge around them — with a critical eye and genuine curiosity. At InfoDaily, he is particularly focused on the stories behind the stories: the industry forces shaping what gets made, the cultural moments that define a generation, and the overlooked works that deserve a wider audience. Canberk believes entertainment writing at its best is a form of cultural history in real time.',
    specialty: 'Entertainment & Culture',
    avatarColor: 'bg-purple-600',
    expertise: ['Film & TV', 'Music', 'Gaming', 'Pop Culture Trends'],
    joinedYear: 2022,
  },
  {
    name: 'James Mercer',
    slug: 'james-mercer',
    title: 'Finance & Economy Writer',
    bio: 'James Mercer is a financial journalist covering markets, economic policy, and the forces shaping personal and global finance.',
    longBio: 'James Mercer began his career covering financial markets for a wire service, developing the habit of writing fast and accurately under deadline pressure. Over the years he has broadened his coverage to include macroeconomic policy, central bank decisions, and the ways global financial trends filter down into everyday life. James is particularly skilled at connecting abstract economic forces to concrete human consequences — whether that is inflation eating into household budgets or interest rate shifts reshaping the housing market. His writing is clear, data-driven, and free of unnecessary jargon. He holds a degree in economics and a postgraduate qualification in financial journalism. He is an avid reader of economic history.',
    specialty: 'Finance & Economy',
    avatarColor: 'bg-yellow-700',
    expertise: ['Financial Markets', 'Economic Policy', 'Personal Finance', 'Global Economy'],
    joinedYear: 2024,
  },
  {
    name: 'Priya Nair',
    slug: 'priya-nair',
    title: 'Health & Science Writer',
    bio: 'Priya Nair writes at the intersection of health, science, and society, with a focus on making complex medical research accessible to general audiences.',
    longBio: 'Priya Nair studied biochemistry before realizing her greatest skill was not in the lab but in explaining what the lab produces. She spent several years as a science editor at a major health publication before joining InfoDaily, where she covers the latest in medical research, public health, and the social determinants of wellness. Priya brings a global perspective to health journalism, informed by her interest in how different cultures approach medicine and healing. She is known for her careful sourcing and her refusal to overstate what evidence actually shows. Outside of work, Priya is a trained classical dancer and an advocate for science education in underserved communities.',
    specialty: 'Health & Science',
    avatarColor: 'bg-fuchsia-600',
    expertise: ['Medical Research', 'Public Health', 'Biochemistry', 'Health Policy'],
    joinedYear: 2024,
  },
  {
    name: 'Olivia Chen',
    slug: 'olivia-chen',
    title: 'Lifestyle & Culture Writer',
    bio: 'Olivia Chen explores the cultural and social dimensions of everyday life, from wellness trends and fashion to the evolving ways we work, connect, and find meaning.',
    longBio: 'Olivia Chen writes about the texture of contemporary life — the trends, rituals, anxieties, and aspirations that define how people live now. Her work spans lifestyle, culture, and the overlapping space between them, examining everything from the wellness industry\'s promises to the way social media reshapes identity. Olivia has a background in sociology that sharpens her analysis without making it academic — she writes for curious, intelligent readers who want to think more clearly about the world they inhabit. At InfoDaily, she is one of the publication\'s most versatile contributors, equally comfortable writing a deep-dive essay or a practical how-to guide. She is based in London.',
    specialty: 'Lifestyle & Culture',
    avatarColor: 'bg-lime-600',
    expertise: ['Wellness Trends', 'Social Media & Culture', 'Fashion', 'Modern Living'],
    joinedYear: 2024,
  },
  {
    name: 'Dr. Elena Russo',
    slug: 'dr-elena-russo',
    title: 'Psychology & Behavior Writer',
    bio: 'Dr. Elena Russo is a clinical psychologist and writer who translates behavioral science research into insights that readers can apply to their everyday lives.',
    longBio: 'Dr. Elena Russo practiced as a clinical psychologist for nearly a decade before the appeal of reaching a broader audience drew her to writing. Her clinical background gives her work a depth and specificity that is rare in popular psychology writing — she can distinguish between what research actually supports and what has merely become conventional wisdom. At InfoDaily, Elena covers topics ranging from cognitive biases and decision-making to anxiety, habit formation, and the science of happiness. Her writing is rigorous but warm, and always oriented toward practical application. She is particularly passionate about reducing stigma around mental health. She continues to see a small number of clients alongside her writing work.',
    specialty: 'Psychology & Behavior',
    avatarColor: 'bg-red-600',
    expertise: ['Clinical Psychology', 'Cognitive Behavioral Science', 'Decision-Making', 'Mental Health'],
    joinedYear: 2024,
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
