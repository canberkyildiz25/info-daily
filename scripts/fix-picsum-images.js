/**
 * Replaces picsum.photos placeholder images with curated Unsplash photos.
 * Each category has a pool of relevant high-quality photos.
 * The same article always gets the same photo (hash of slug → pool index).
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const POSTS_DIR = path.join(__dirname, '../content/posts');

// Curated Unsplash photo pools per category — all verified high-quality images
const PHOTO_POOLS = {
  health: [
    'photo-1571019614242-c5c5dee9f50b', // gym/workout
    'photo-1576091160550-2173dba999ef', // medical/doctor
    'photo-1490645935967-10de6ba17061', // healthy food bowl
    'photo-1559757175-5700dde675bc',     // running outdoors
    'photo-1517836357463-d25dfeac3438', // fitness weights
    'photo-1544367567-0f2fcb009e0b',     // yoga/meditation
    'photo-1505576399279-565b52d4ac71', // sleep/rest
    'photo-1498837167922-ddd27525d352', // vegetables/nutrition
    'photo-1512621776951-a57141f2eefd', // salad/healthy plate
    'photo-1476480862126-209bfaa8edc8', // jogging park
    'photo-1506126613408-eca07ce68773', // morning routine
    'photo-1532938911079-1b06ac7ceec7', // spa/wellness
    'photo-1583454110551-21f2fa2afe61', // fresh fruit
    'photo-1547592166-23ac45744acd',     // colorful foods
    'photo-1466637574441-749b8f19452f', // cooking kitchen
  ],
  finance: [
    'photo-1579621970563-ebec7560ff3e', // money/cash
    'photo-1611974789855-9c2a0a7236a3', // stock market screen
    'photo-1554224155-6726b3ff858f',     // calculator/finance
    'photo-1434626881859-194d67b2b86f', // city/financial district
    'photo-1507003211169-0a1dd7228f2d', // professional/business
    'photo-1526304640581-d334cdbbf45e', // piggy bank/savings
    'photo-1565514020179-026b92b2d70b', // growth chart
    'photo-1543286386-2e659306cd6c',     // coins/investment
    'photo-1560472354-b33ff0c44a43',     // banking/ATM
    'photo-1450101499163-c8848c66ca85', // office desk finance
  ],
  technology: [
    'photo-1518770660439-4636190af475', // circuit board
    'photo-1488590528505-98d2b5aba04b', // laptop/code
    'photo-1550751827-4bd374c3f58b',     // AI/robot concept
    'photo-1531297484001-80022131f5a1', // modern laptop
    'photo-1563986768494-4dee2763ff3f', // tech abstract
    'photo-1558494949-ef010cbdcc31',     // servers/data center
    'photo-1526374965328-7f61d4dc18c5', // code/programming
    'photo-1573804633927-bfcbcd909acd', // smartphone
    'photo-1496181133206-80ce9b88a853', // MacBook/desk
    'photo-1544197150-b99a580bb7a8',     // network/wifi
    'photo-1504384308090-c894fdcc538d', // coworking/tech
    'photo-1451187580459-43490279c0fa', // earth/satellite
  ],
  science: [
    'photo-1507413245164-6160d8298b31', // laboratory
    'photo-1446776899648-aa78eefe8ed0', // space/universe
    'photo-1534996858221-380b92700493', // DNA/biology
    'photo-1576319155264-99536e0be1ee', // microscope
    'photo-1541185933-ef5d8ed016c2',     // rocket/space
    'photo-1614728894747-a83421e2b9c9', // moon/space
    'photo-1559757148-5c350d0d3c56',     // brain/neuroscience
    'photo-1628595351029-c2bf17511435', // chemistry lab
    'photo-1454789548928-9efd52dc4031', // galaxy/cosmos
    'photo-1502472584811-0a2f2feb8968', // ocean/marine
  ],
  travel: [
    'photo-1488085061387-422e29b40080', // travel map/planning
    'photo-1436491865332-7a61a109cc05', // airplane window
    'photo-1476514525535-07fb3b4ae5f1', // scenic landscape
    'photo-1503220317375-aaad61436b1b', // backpacker/travel
    'photo-1469854523086-cc02fe5d8800', // road trip
    'photo-1530789253388-582c481c54b0', // beach destination
    'photo-1501426026826-31c667bdf23d', // mountain travel
    'photo-1507525428034-b723cf961d3e', // tropical beach
    'photo-1488646953014-85cb44e25828', // travel adventure
    'photo-1452421822248-d4c2b47f0c81', // sunset travel
  ],
  food: [
    'photo-1504674900247-0877df9cc836', // healthy plate
    'photo-1547592166-23ac45744acd',     // colorful food
    'photo-1466637574441-749b8f19452f', // cooking
    'photo-1512621776951-a57141f2eefd', // salad bowl
    'photo-1498837167922-ddd27525d352', // vegetables
    'photo-1565299624946-b28f40a0ae38', // pizza/comfort food
    'photo-1540189549336-e6e99c3679fe', // dinner plate
    'photo-1567620905732-2d1ec7ab7445', // pancakes/breakfast
    'photo-1495474472287-4d71bcdd2085', // coffee/morning
    'photo-1490474418585-ba9bad8fd0ea', // smoothie/healthy drink
    'photo-1551183053-bf91798d792f',     // sushi/cuisine
    'photo-1432139509613-5c4255815697', // fruit bowl
  ],
  business: [
    'photo-1497366216548-37526070297c', // modern office
    'photo-1521737711867-e3b97375f902', // team meeting
    'photo-1507003211169-0a1dd7228f2d', // businessman
    'photo-1454165804606-c3d57bc86b40', // work desk
    'photo-1556761175-4b46a572b786',     // startup/office
    'photo-1542744173-8e7e53415bb0',     // business strategy
    'photo-1600880292203-757bb62b4baf', // remote work
    'photo-1559136555-9303baea8eae',     // entrepreneur
    'photo-1553877522-43269d4ea984',     // coworking space
    'photo-1516321318423-f06f85e504b3', // business growth
  ],
  relationships: [
    'photo-1529156069898-49953e39b3ac', // friends laughing
    'photo-1516401266446-6432a8a07d41', // couple together
    'photo-1582213782179-e9d977a60de2', // team/community
    'photo-1522202176988-66273c2fd55f', // group of people
    'photo-1491438590914-bc09fcaaf77a', // friends/connection
    'photo-1543269865-cbf427effbad',     // conversation/talking
    'photo-1516585427167-9f4af9627e6c', // therapy/support
    'photo-1573497019940-1c28c88b4f3e', // professional meeting
    'photo-1517048676732-d65bc937f952', // team collaboration
  ],
  'life-hacks': [
    'photo-1483058712412-4245e9b90334', // desk/workspace setup
    'photo-1484480974693-6ca0a78fb36b', // morning/planning
    'photo-1499750310107-5fef28a66643', // notebook/journaling
    'photo-1434030216411-0b793f4b4173', // study/focus
    'photo-1506784983877-45594efa4cbe', // calendar/organization
    'photo-1471107340929-a87cd0f5b5f3', // productivity tools
    'photo-1455390582262-044cdead277a', // writing/note taking
    'photo-1493612276216-ee3925520721', // phone/app
    'photo-1547658719-da2b51169166', // minimalist workspace
    'photo-1586281380349-632531db7ed4', // home office
  ],
  entertainment: [
    'photo-1489599849927-2ee91cede3ba', // cinema/movies
    'photo-1511671782779-c97d3d27a1d4', // music/concert
    'photo-1459749411175-04bf5292ceea', // live concert
    'photo-1598899134739-24c46f58b8c0', // headphones/music
    'photo-1574375927938-d5a98e8ffe85', // gaming
    'photo-1522869635100-9f4c5e86aa37', // streaming/TV
    'photo-1485846234645-a62644f84728', // film/clapperboard
    'photo-1493225457124-a3eb161ffa5f', // concert/festival
    'photo-1536440136628-849c177e76a1', // theater/drama
    'photo-1461151304267-38535e596517', // record/vinyl
  ],
};

function hashSlug(slug) {
  let h = 0;
  for (const c of slug) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

function getUnsplashUrl(category, slug) {
  const pool = PHOTO_POOLS[category] || PHOTO_POOLS['life-hacks'];
  const idx = hashSlug(slug) % pool.length;
  return `https://images.unsplash.com/${pool[idx]}?w=1200&q=80`;
}

let updated = 0;

const categories = fs.readdirSync(POSTS_DIR).filter(f =>
  fs.statSync(path.join(POSTS_DIR, f)).isDirectory()
);

for (const category of categories) {
  const catDir = path.join(POSTS_DIR, category);
  const files = fs.readdirSync(catDir).filter(f => f.endsWith('.md'));

  for (const file of files) {
    const filePath = path.join(catDir, file);
    const raw = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(raw);

    if (!data.coverImage || !data.coverImage.includes('picsum.photos')) continue;

    const slug = file.replace('.md', '');
    const newUrl = getUnsplashUrl(category, slug);

    const updated_content = raw.replace(
      /^coverImage:.*$/m,
      `coverImage: "${newUrl}"`
    );

    fs.writeFileSync(filePath, updated_content, 'utf8');
    updated++;
    console.log(`✓ ${category}/${file}`);
  }
}

console.log(`\nDone. ${updated} images replaced.`);
