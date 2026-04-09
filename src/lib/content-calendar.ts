export interface ScheduledArticle {
  title: string;
  category: string;
}

// Articles will be generated in order — already-existing ones are skipped automatically.
// Add more rows to grow the site indefinitely.
export const CONTENT_CALENDAR: ScheduledArticle[] = [
  // Health
  { title: 'How to Lower Cortisol Naturally', category: 'health' },
  { title: '10 Signs You Need More Sleep', category: 'health' },
  { title: 'Best Vitamins for Energy and Fatigue', category: 'health' },
  { title: 'How to Improve Your Gut Health', category: 'health' },
  { title: 'The Best Anti-Inflammatory Foods', category: 'health' },
  { title: 'How to Stop Headaches Naturally', category: 'health' },
  { title: 'Benefits of Walking 30 Minutes a Day', category: 'health' },
  { title: 'How to Boost Your Metabolism After 40', category: 'health' },

  // Finance
  { title: 'How to Build an Emergency Fund from Scratch', category: 'finance' },
  { title: '7 Money Habits of Millionaires', category: 'finance' },
  { title: 'Best High-Yield Savings Accounts in 2025', category: 'finance' },
  { title: 'How to Pay Off Debt Fast', category: 'finance' },
  { title: 'How to Create a Monthly Budget That Actually Works', category: 'finance' },
  { title: 'Passive Income Ideas That Actually Work in 2025', category: 'finance' },
  { title: 'How to Improve Your Credit Score Fast', category: 'finance' },
  { title: 'Index Funds vs ETFs: Which Is Better for Beginners', category: 'finance' },

  // Technology
  { title: 'How to Use AI to Boost Your Productivity', category: 'technology' },
  { title: 'Best Password Managers in 2025', category: 'technology' },
  { title: 'How to Speed Up Your Wi-Fi at Home', category: 'technology' },
  { title: 'Is Your Phone Listening to You? The Truth', category: 'technology' },
  { title: 'Best Free Tools for Remote Work in 2025', category: 'technology' },
  { title: 'How to Protect Your Privacy Online', category: 'technology' },
  { title: 'What Is VPN and Do You Really Need One', category: 'technology' },
  { title: 'How to Back Up Your Data Like a Pro', category: 'technology' },

  // Life Hacks
  { title: 'How to Stop Procrastinating for Good', category: 'life-hacks' },
  { title: '10 Morning Habits That Change Everything', category: 'life-hacks' },
  { title: 'How to Learn Any Skill Twice as Fast', category: 'life-hacks' },
  { title: 'How to Wake Up Early Without Feeling Terrible', category: 'life-hacks' },
  { title: 'The Best Habit Tracking Apps in 2025', category: 'life-hacks' },
  { title: 'How to Declutter Your Home in One Weekend', category: 'life-hacks' },
  { title: 'How to Read More Books Every Year', category: 'life-hacks' },
  { title: 'Simple Ways to Reduce Phone Screen Time', category: 'life-hacks' },

  // Travel
  { title: 'How to Travel Cheap in Europe', category: 'travel' },
  { title: 'Best Travel Credit Cards in 2025', category: 'travel' },
  { title: '10 Things to Know Before Visiting Japan', category: 'travel' },
  { title: 'How to Pack Light for Any Trip', category: 'travel' },
  { title: 'Best Countries for Digital Nomads in 2025', category: 'travel' },
  { title: 'How to Find Cheap Flights Every Time', category: 'travel' },
  { title: 'The Safest Countries to Travel Solo', category: 'travel' },
  { title: 'How to Travel More on a Regular Salary', category: 'travel' },

  // Food
  { title: 'How to Meal Prep for the Entire Week', category: 'food' },
  { title: '10 Quick Breakfast Ideas for Busy Mornings', category: 'food' },
  { title: 'Best High-Protein Snacks to Keep at Home', category: 'food' },
  { title: 'How to Cook Chicken Breast So It Is Not Dry', category: 'food' },
  { title: 'The Best Foods for Brain Health', category: 'food' },
  { title: 'Easy One-Pan Dinners for Weeknights', category: 'food' },
  { title: 'How to Eat Healthy on a Tight Budget', category: 'food' },
  { title: 'Best Superfoods You Should Eat Every Week', category: 'food' },

  // Business
  { title: 'How to Write a Business Plan in One Day', category: 'business' },
  { title: 'Best Side Hustles for Busy Professionals', category: 'business' },
  { title: 'How to Network Without Feeling Fake', category: 'business' },
  { title: 'How to Ask for a Raise and Actually Get It', category: 'business' },
  { title: 'Best Productivity Apps for Entrepreneurs in 2025', category: 'business' },
  { title: 'How to Build a Personal Brand from Zero', category: 'business' },
  { title: 'Remote Work Tips That Make You More Productive', category: 'business' },
  { title: 'How to Turn Your Hobby into a Business', category: 'business' },

  // Science
  { title: 'Why Cold Showers Are Good for You', category: 'science' },
  { title: 'How Intermittent Fasting Affects Your Body', category: 'science' },
  { title: 'The Science of Habit Formation Explained', category: 'science' },
  { title: 'Why Your Gut Is Called the Second Brain', category: 'science' },
  { title: 'How Stress Physically Damages Your Body', category: 'science' },
  { title: 'The Science Behind Why Music Affects Your Mood', category: 'science' },
  { title: '10 Fascinating Facts About the Human Body', category: 'science' },
  { title: 'Why Time Feels Like It Speeds Up as You Age', category: 'science' },

  // Relationships
  { title: 'How to Communicate Better in Any Relationship', category: 'relationships' },
  { title: 'Signs You Are in a Toxic Friendship', category: 'relationships' },
  { title: 'How to Rebuild Trust After a Betrayal', category: 'relationships' },
  { title: 'The Science of What Makes Relationships Last', category: 'relationships' },
  { title: 'How to Deal with Difficult Family Members', category: 'relationships' },
  { title: 'How to Stop People Pleasing', category: 'relationships' },
  { title: 'How to Support Someone with Anxiety or Depression', category: 'relationships' },
  { title: 'How to Have Hard Conversations Without Fighting', category: 'relationships' },
];
