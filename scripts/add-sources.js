/**
 * Adds a "Sources & References" section to every markdown article that doesn't already have one.
 * Sources are chosen based on category + title keywords.
 */

const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, '../content/posts');

// Category-level authoritative sources (always relevant)
const CATEGORY_SOURCES = {
  health: [
    { label: 'NIH National Library of Medicine', url: 'https://www.ncbi.nlm.nih.gov/' },
    { label: 'Mayo Clinic', url: 'https://www.mayoclinic.org/' },
    { label: 'Harvard Health Publishing', url: 'https://www.health.harvard.edu/' },
    { label: 'Centers for Disease Control and Prevention (CDC)', url: 'https://www.cdc.gov/' },
    { label: 'World Health Organization (WHO)', url: 'https://www.who.int/' },
  ],
  finance: [
    { label: 'Investopedia', url: 'https://www.investopedia.com/' },
    { label: 'Consumer Financial Protection Bureau (CFPB)', url: 'https://www.consumerfinance.gov/' },
    { label: 'U.S. Federal Reserve', url: 'https://www.federalreserve.gov/' },
    { label: 'IRS – Tax Information', url: 'https://www.irs.gov/' },
    { label: 'FINRA – Investor Education', url: 'https://www.finra.org/investors' },
    { label: 'NerdWallet', url: 'https://www.nerdwallet.com/' },
  ],
  technology: [
    { label: 'MIT Technology Review', url: 'https://www.technologyreview.com/' },
    { label: 'IEEE Spectrum', url: 'https://spectrum.ieee.org/' },
    { label: 'Pew Research Center – Internet & Technology', url: 'https://www.pewresearch.org/internet/' },
    { label: 'Electronic Frontier Foundation (EFF)', url: 'https://www.eff.org/' },
    { label: 'NIST Cybersecurity Resources', url: 'https://www.nist.gov/cybersecurity' },
  ],
  science: [
    { label: 'Nature', url: 'https://www.nature.com/' },
    { label: 'Science (AAAS)', url: 'https://www.science.org/' },
    { label: 'NASA', url: 'https://www.nasa.gov/' },
    { label: 'National Geographic – Science', url: 'https://www.nationalgeographic.com/science/' },
    { label: 'Smithsonian Magazine – Science', url: 'https://www.smithsonianmag.com/science-nature/' },
  ],
  travel: [
    { label: "CDC Traveler's Health", url: 'https://wwwnc.cdc.gov/travel' },
    { label: 'U.S. Department of State – Travel', url: 'https://travel.state.gov/' },
    { label: 'World Tourism Organization (UNWTO)', url: 'https://www.unwto.org/' },
    { label: 'Lonely Planet', url: 'https://www.lonelyplanet.com/' },
  ],
  food: [
    { label: 'Harvard T.H. Chan School of Public Health – The Nutrition Source', url: 'https://www.hsph.harvard.edu/nutritionsource/' },
    { label: 'USDA FoodData Central', url: 'https://fdc.nal.usda.gov/' },
    { label: 'Academy of Nutrition and Dietetics', url: 'https://www.eatright.org/' },
    { label: 'NIH Office of Dietary Supplements', url: 'https://ods.od.nih.gov/' },
  ],
  business: [
    { label: 'Harvard Business Review', url: 'https://hbr.org/' },
    { label: 'U.S. Small Business Administration (SBA)', url: 'https://www.sba.gov/' },
    { label: 'Bureau of Labor Statistics', url: 'https://www.bls.gov/' },
    { label: 'McKinsey & Company – Insights', url: 'https://www.mckinsey.com/insights' },
  ],
  relationships: [
    { label: 'American Psychological Association (APA)', url: 'https://www.apa.org/' },
    { label: 'Psychology Today', url: 'https://www.psychologytoday.com/' },
    { label: 'National Alliance on Mental Illness (NAMI)', url: 'https://www.nami.org/' },
    { label: 'Greater Good Science Center – UC Berkeley', url: 'https://greatergood.berkeley.edu/' },
  ],
  'life-hacks': [
    { label: 'Harvard Business Review', url: 'https://hbr.org/' },
    { label: 'Psychology Today', url: 'https://www.psychologytoday.com/' },
    { label: 'American Psychological Association (APA)', url: 'https://www.apa.org/' },
    { label: 'Greater Good Science Center – UC Berkeley', url: 'https://greatergood.berkeley.edu/' },
  ],
  entertainment: [
    { label: 'Variety', url: 'https://variety.com/' },
    { label: 'The Hollywood Reporter', url: 'https://www.hollywoodreporter.com/' },
    { label: 'Billboard', url: 'https://www.billboard.com/' },
    { label: 'Rotten Tomatoes', url: 'https://www.rottentomatoes.com/' },
    { label: 'Deadline Hollywood', url: 'https://deadline.com/' },
  ],
};

// Keyword → extra sources (matched against slug + title, lowercase)
const KEYWORD_SOURCES = [
  { keywords: ['sleep', 'insomnia', 'circadian'], sources: [
    { label: 'NIH – Sleep Deprivation and Deficiency', url: 'https://www.nhlbi.nih.gov/health-topics/sleep-deprivation-and-deficiency' },
    { label: 'American Academy of Sleep Medicine', url: 'https://aasm.org/' },
    { label: 'Sleep Foundation', url: 'https://www.sleepfoundation.org/' },
  ]},
  { keywords: ['exercise', 'workout', 'fitness', 'weight-loss', 'muscle', 'strength'], sources: [
    { label: 'American College of Sports Medicine', url: 'https://www.acsm.org/' },
    { label: 'NIH – Physical Activity Guidelines', url: 'https://www.ncbi.nlm.nih.gov/books/NBK179847/' },
    { label: 'Journal of Strength and Conditioning Research (NSCA)', url: 'https://journals.lww.com/nsca-jscr' },
  ]},
  { keywords: ['invest', 'stock', 'etf', 'index-fund', 'portfolio', 'retirement', '401k', 'roth'], sources: [
    { label: 'SEC – Investor Education', url: 'https://www.investor.gov/' },
    { label: 'Vanguard – Investment Research', url: 'https://institutional.vanguard.com/insights/research' },
    { label: 'Morningstar', url: 'https://www.morningstar.com/' },
  ]},
  { keywords: ['credit-score', 'credit', 'debt', 'loan', 'mortgage'], sources: [
    { label: 'Consumer Financial Protection Bureau – Credit Reports', url: 'https://www.consumerfinance.gov/consumer-tools/credit-reports-and-scores/' },
    { label: 'Experian – Credit Education', url: 'https://www.experian.com/blogs/ask-experian/' },
    { label: 'AnnualCreditReport.com', url: 'https://www.annualcreditreport.com/' },
  ]},
  { keywords: ['tax', 'deduction', 'irs', 'salary', 'income'], sources: [
    { label: 'IRS – Filing Information', url: 'https://www.irs.gov/filing' },
    { label: 'Tax Policy Center', url: 'https://www.taxpolicycenter.org/' },
  ]},
  { keywords: ['nutrition', 'protein', 'fiber', 'vitamin', 'diet', 'food', 'meal', 'breakfast', 'snack', 'superfood', 'brain-health'], sources: [
    { label: 'NIH – Dietary Guidelines', url: 'https://www.dietaryguidelines.gov/' },
    { label: 'Harvard T.H. Chan – The Nutrition Source', url: 'https://www.hsph.harvard.edu/nutritionsource/' },
  ]},
  { keywords: ['immune', 'immunity', 'virus', 'flu', 'vaccine'], sources: [
    { label: 'CDC – Immune Health', url: 'https://www.cdc.gov/niosh/topics/immune/default.html' },
    { label: 'NIH – Immune System', url: 'https://www.niaid.nih.gov/research/immune-system' },
  ]},
  { keywords: ['brain', 'memory', 'cognitive', 'mental', 'alzheimer', 'neuroscience'], sources: [
    { label: 'NIH National Institute of Neurological Disorders', url: 'https://www.ninds.nih.gov/' },
    { label: 'Harvard Brain Science Initiative', url: 'https://brain.harvard.edu/' },
  ]},
  { keywords: ['ai', 'artificial-intelligence', 'chatgpt', 'machine-learning', 'automation'], sources: [
    { label: 'Stanford AI Index Report', url: 'https://aiindex.stanford.edu/report/' },
    { label: 'MIT AI Policy', url: 'https://computing.mit.edu/artificial-intelligence/' },
    { label: 'OpenAI Research', url: 'https://openai.com/research' },
  ]},
  { keywords: ['vpn', 'cybersecurity', 'privacy', 'hacker', 'password', 'backup', 'data'], sources: [
    { label: 'CISA – Cybersecurity Resources', url: 'https://www.cisa.gov/topics/cybersecurity-best-practices' },
    { label: 'NIST Cybersecurity Framework', url: 'https://www.nist.gov/cyberframework' },
    { label: 'Electronic Frontier Foundation – Surveillance Self-Defense', url: 'https://ssd.eff.org/' },
  ]},
  { keywords: ['wifi', 'wi-fi', 'router', 'internet', 'network', 'smartphone', 'battery'], sources: [
    { label: 'FCC – Broadband Resources', url: 'https://www.fcc.gov/consumers/guides/broadband-speed-guide' },
    { label: 'IEEE – Wireless Standards', url: 'https://standards.ieee.org/featured/802-11/' },
  ]},
  { keywords: ['solar', 'climate', 'renewable', 'energy', 'electricity', 'environment'], sources: [
    { label: 'U.S. Department of Energy', url: 'https://www.energy.gov/' },
    { label: 'NREL – National Renewable Energy Laboratory', url: 'https://www.nrel.gov/' },
    { label: 'IPCC – Climate Change Reports', url: 'https://www.ipcc.ch/reports/' },
  ]},
  { keywords: ['mars', 'space', 'nasa', 'planet', 'asteroid', 'galaxy'], sources: [
    { label: 'NASA Science', url: 'https://science.nasa.gov/' },
    { label: 'ESA – European Space Agency', url: 'https://www.esa.int/' },
    { label: 'SETI Institute', url: 'https://www.seti.org/' },
  ]},
  { keywords: ['cancer', 'diabetes', 'heart', 'blood-pressure', 'cholesterol', 'ozempic', 'glp-1', 'medication'], sources: [
    { label: 'NIH National Cancer Institute', url: 'https://www.cancer.gov/' },
    { label: 'American Heart Association', url: 'https://www.heart.org/' },
    { label: 'U.S. Food & Drug Administration (FDA)', url: 'https://www.fda.gov/' },
    { label: 'American Diabetes Association', url: 'https://diabetes.org/' },
  ]},
  { keywords: ['healthcare', 'insurance', 'hospital', 'doctor', 'medical', 'health-cost'], sources: [
    { label: 'Kaiser Family Foundation – Health Policy', url: 'https://www.kff.org/' },
    { label: 'Agency for Healthcare Research and Quality (AHRQ)', url: 'https://www.ahrq.gov/' },
  ]},
  { keywords: ['travel', 'flight', 'hotel', 'visa', 'passport', 'solo', 'budget', 'europe', 'japan', 'nomad'], sources: [
    { label: "CDC Traveler's Health", url: 'https://wwwnc.cdc.gov/travel' },
    { label: 'U.S. Department of State – Travel Advisories', url: 'https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories.html' },
  ]},
  { keywords: ['relationship', 'dating', 'attachment', 'boundary', 'communication', 'intimacy', 'love', 'marriage', 'long-distance'], sources: [
    { label: 'APA – Relationships', url: 'https://www.apa.org/topics/relationships' },
    { label: 'Greater Good Science Center', url: 'https://greatergood.berkeley.edu/topic/relationships' },
    { label: 'John Gottman Institute', url: 'https://www.gottman.com/about/research/' },
  ]},
  { keywords: ['procrastinat', 'habit', 'productiv', 'focus', 'motivation', 'goal', 'morning-routine', 'time-management'], sources: [
    { label: 'APA – Procrastination', url: 'https://www.apa.org/news/press/releases/2010/04/procrastination' },
    { label: 'James Clear – Atomic Habits Research', url: 'https://jamesclear.com/habits' },
    { label: 'Harvard Business Review – Productivity', url: 'https://hbr.org/topic/subject/productivity' },
  ]},
  { keywords: ['declutter', 'organize', 'minimalist', 'home', 'clean'], sources: [
    { label: 'Psychology Today – Clutter and Well-Being', url: 'https://www.psychologytoday.com/us/basics/clutter' },
  ]},
  { keywords: ['freelanc', 'side-hustle', 'entrepreneur', 'startup', 'business-plan', 'personal-brand', 'network', 'career', 'promotion', 'raise', 'job'], sources: [
    { label: 'U.S. Small Business Administration', url: 'https://www.sba.gov/' },
    { label: 'Bureau of Labor Statistics – Occupational Outlook', url: 'https://www.bls.gov/ooh/' },
    { label: 'Harvard Business Review – Career', url: 'https://hbr.org/topic/subject/career-planning' },
  ]},
  { keywords: ['remote-work', '4-day', 'workplace', 'office', 'management', 'leadership', 'team'], sources: [
    { label: 'Harvard Business Review – Future of Work', url: 'https://hbr.org/topic/subject/remote-work' },
    { label: 'Gallup – State of the American Workplace', url: 'https://www.gallup.com/workplace/285818/state-american-workplace-report.aspx' },
  ]},
  { keywords: ['read', 'book', 'learn', 'education', 'skill', 'digital-life', 'screen-time', 'phone'], sources: [
    { label: 'Pew Research Center – Reading Habits', url: 'https://www.pewresearch.org/internet/2021/01/09/who-doesnt-read-books-in-america/' },
    { label: 'American Library Association', url: 'https://www.ala.org/' },
  ]},
  { keywords: ['neanderthal', 'fossil', 'evolution', 'ancient', 'archaeology', 'anthropology'], sources: [
    { label: 'Smithsonian National Museum of Natural History – Human Origins', url: 'https://humanorigins.si.edu/' },
    { label: 'Max Planck Institute for Evolutionary Anthropology', url: 'https://www.eva.mpg.de/' },
  ]},
  { keywords: ['pope', 'conclave', 'vatican', 'religion', 'church'], sources: [
    { label: 'Vatican News', url: 'https://www.vaticannews.va/en.html' },
    { label: 'Pew Research Center – Religion', url: 'https://www.pewresearch.org/religion/' },
  ]},
  { keywords: ['passive-income', 'dividend', 'real-estate', 'rental', 'income-stream'], sources: [
    { label: 'Investopedia – Passive Income', url: 'https://www.investopedia.com/terms/p/passiveincome.asp' },
    { label: 'IRS – Passive Activity', url: 'https://www.irs.gov/publications/p925' },
  ]},
  { keywords: ['home-buying', 'mortgage', 'real-estate', 'housing', 'house', 'property'], sources: [
    { label: 'Consumer Financial Protection Bureau – Buying a Home', url: 'https://www.consumerfinance.gov/owning-a-home/' },
    { label: 'U.S. Department of Housing and Urban Development (HUD)', url: 'https://www.hud.gov/' },
    { label: 'National Association of Realtors – Research', url: 'https://www.nar.realtor/research-and-statistics' },
  ]},
  { keywords: ['grocery', 'budget', 'save-money', 'cost', 'frugal', 'coupon'], sources: [
    { label: 'USDA – Food Plans and Costs', url: 'https://www.ers.usda.gov/topics/food-choices-health/food-consumption-demand/food-expenditures/' },
    { label: 'Bureau of Labor Statistics – Consumer Expenditures', url: 'https://www.bls.gov/cex/' },
  ]},
  { keywords: ['film', 'movie', 'tv', 'series', 'show', 'entertainment', 'music', 'album', 'nfl', 'sports', 'coachella', 'festival'], sources: [
    { label: 'IMDb', url: 'https://www.imdb.com/' },
    { label: 'Metacritic', url: 'https://www.metacritic.com/' },
    { label: 'Rotten Tomatoes', url: 'https://www.rottentomatoes.com/' },
  ]},
];

function getSources(category, slug, title) {
  const text = `${slug} ${title}`.toLowerCase();
  const base = (CATEGORY_SOURCES[category] || []).slice(0, 3);
  const extra = [];

  for (const { keywords, sources } of KEYWORD_SOURCES) {
    if (keywords.some(kw => text.includes(kw))) {
      for (const s of sources) {
        if (!base.some(b => b.url === s.url) && !extra.some(e => e.url === s.url)) {
          extra.push(s);
        }
      }
      if (extra.length >= 3) break;
    }
  }

  return [...base, ...extra.slice(0, 3)];
}

function buildSourcesSection(sources) {
  const lines = sources.map(s => `- [${s.label}](${s.url})`).join('\n');
  return `\n\n## Sources & References\n\n${lines}\n`;
}

function processFile(filePath, category) {
  const content = fs.readFileSync(filePath, 'utf8');

  // Skip if already has a sources section
  if (/##\s*(sources|references)/i.test(content)) {
    return false;
  }

  // Extract slug from filename and title from frontmatter
  const slug = path.basename(filePath, '.md');
  const titleMatch = content.match(/^title:\s*["']?(.+?)["']?\s*$/m);
  const title = titleMatch ? titleMatch[1] : slug;

  const sources = getSources(category, slug, title);
  const section = buildSourcesSection(sources);

  fs.writeFileSync(filePath, content.trimEnd() + section, 'utf8');
  return true;
}

// Walk all category dirs
let updated = 0;
let skipped = 0;

const categories = fs.readdirSync(POSTS_DIR).filter(f =>
  fs.statSync(path.join(POSTS_DIR, f)).isDirectory()
);

for (const category of categories) {
  const catDir = path.join(POSTS_DIR, category);
  const files = fs.readdirSync(catDir).filter(f => f.endsWith('.md'));

  for (const file of files) {
    const filePath = path.join(catDir, file);
    const wasUpdated = processFile(filePath, category);
    if (wasUpdated) {
      updated++;
      console.log(`✓ ${category}/${file}`);
    } else {
      skipped++;
      console.log(`— skipped (already has sources): ${category}/${file}`);
    }
  }
}

console.log(`\nDone. Updated: ${updated}, Skipped: ${skipped}`);
