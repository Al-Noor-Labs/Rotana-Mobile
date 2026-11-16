// Category image imports - Metro requires literal paths
const CAT_IMGS = {
  attaRice: require('../../assets/Categories Images/Atta, Rice and Dal.png'),
  dryFruits: require('../../assets/Categories Images/Dryfruit and Cerels.png'),
  dairy: require('../../assets/Categories Images/Dairy, Bread and Eggs.png'),
  bakery: require('../../assets/Categories Images/Bakery.png'),
  oilMasala: require('../../assets/Categories Images/Oil and Masala.png'),
  kitchenware: require('../../assets/Categories Images/Home and Life Style.png'),
  fruitsVeg: require('../../assets/Categories Images/Fruits and Vegetables.png'),
  chicken: require('../../assets/Categories Images/Chicken, Meath and Fish.png'),
  teaCoffee: require('../../assets/Categories Images/Tea and Coffee.png'),
  sweets: require('../../assets/Categories Images/Sweets and Chocolates.png'),
  drinks: require('../../assets/Categories Images/Beverages.png'),
  chips: require('../../assets/Categories Images/Chips and Namkeens.png'),
  sauces: require('../../assets/Categories Images/Sauces and Spreads.png'),
  panCorner: require('../../assets/Categories Images/Pan Corner.png'),
  instantFood: require('../../assets/Categories Images/Instant Food.png'),
  iceCreams: require('../../assets/Categories Images/Ice Creams and More Ctg.png'),
  skinFace: require('../../assets/Categories Images/Skin and Face Care.png'),
  hairCare: require('../../assets/Categories Images/Hair Care.png'),
  femHygiene: require('../../assets/Categories Images/Feminine Hydene.png'),
  bathBody: require('../../assets/Categories Images/Bath and Body.png'),
  stationary: require('../../assets/Categories Images/Stationary and Games.png'),
  electronics: require('../../assets/Categories Images/Electronics.png'),
  cleaners: require('../../assets/Categories Images/Cleaner and Repelleant.png'),
  toys: require('../../assets/Categories Images/Toystore.png'),
  adultDiapers: require('../../assets/Categories Images/Adult Diapers.png'),
  ayurvedicCare: require('../../assets/Categories Images/Ayurvedic Care.png'),
  babyCare: require('../../assets/Categories Images/Baby Care.png'),
  bandaid: require('../../assets/Categories Images/Bandaid and wound.png'),
  bookstore: require('../../assets/Categories Images/Bookstore.png'),
  drinkEssentials: require('../../assets/Categories Images/Drink Essentials.png'),
  healthcareEquip: require('../../assets/Categories Images/Healthcare Equipment.png'),
  importedItems1: require('../../assets/Categories Images/Imported Items-1.png'),
  maskSanitizers: require('../../assets/Categories Images/Mask and Sanitizers.png'),
  petStore: require('../../assets/Categories Images/Pet Store.png'),
  pharma: require('../../assets/Categories Images/Pharma.png'),
  pujaStore: require('../../assets/Categories Images/Puja Store.png'),
  sexualWellness: require('../../assets/Categories Images/Sexual Wellness.png'),
  sportsStore: require('../../assets/Categories Images/Sports Store.png'),
  wearables: require('../../assets/Categories Images/Wearables.png'),
  vitamins: require('../../assets/Categories Images/Vitamins and Supplements.png'),
  fashion: require('../../assets/Categories Images/Fashion.png'),
};

// Background colors for categories
const BG_COLORS = ['#FFF3E0', '#E3F2FD', '#E8F5E9', '#FFEBEE', '#FFF9C4', '#F3E5F5'];

// Map API category names to local images and colors - CORRECTED
export const categoryImageMap: Record<string, { image: any; bgColor: string }> = {
  // Beverages & Drinks
  'Beverages': { image: CAT_IMGS.teaCoffee, bgColor: '#FFF3E0' },
  'Juices': { image: CAT_IMGS.drinks, bgColor: '#E3F2FD' },
  'Tea and Coffee': { image: CAT_IMGS.teaCoffee, bgColor: '#FFF3E0' },
  'Drinks and Juices': { image: CAT_IMGS.drinks, bgColor: '#E3F2FD' },

  // Dairy & Eggs
  'Dairy & Eggs': { image: CAT_IMGS.dairy, bgColor: '#E3F2FD' },
  'Eggs': { image: CAT_IMGS.dairy, bgColor: '#E3F2FD' },
  'Milk': { image: CAT_IMGS.dairy, bgColor: '#E3F2FD' },
  'Paneer & Cheese': { image: CAT_IMGS.dairy, bgColor: '#E3F2FD' },
  'Ghee & Butter': { image: CAT_IMGS.dairy, bgColor: '#E3F2FD' },

  // Fruits & Vegetables
  'Fresh Fruits & Vegetables': { image: CAT_IMGS.fruitsVeg, bgColor: '#E8F5E9' },
  'Fruits': { image: CAT_IMGS.fruitsVeg, bgColor: '#E8F5E9' },

  // Staples & Grains
  'Lentils & Dal': { image: CAT_IMGS.attaRice, bgColor: '#FFF3E0' },
  'Rice': { image: CAT_IMGS.attaRice, bgColor: '#FFF3E0' },
  'Staples & Grains': { image: CAT_IMGS.attaRice, bgColor: '#FFF3E0' },

  // Snacks & Namkeen
  'Chips': { image: CAT_IMGS.chips, bgColor: '#FFEBEE' },
  'Namkeen': { image: CAT_IMGS.chips, bgColor: '#FFEBEE' },
  'Snacks & Namkeen': { image: CAT_IMGS.chips, bgColor: '#FFEBEE' },
  'Biscuits & Cookies': { image: CAT_IMGS.bakery, bgColor: '#FFF9C4' },

  // Cooking Essentials
  'Cooking Oils': { image: CAT_IMGS.oilMasala, bgColor: '#FFEBEE' },

  // Cleaning & Household
  'Cleaning & Household': { image: CAT_IMGS.cleaners, bgColor: '#E8F5E9' },
  'Floor & Surface': { image: CAT_IMGS.cleaners, bgColor: '#E8F5E9' },
  'Kitchen Cleaners': { image: CAT_IMGS.cleaners, bgColor: '#E8F5E9' },
  'Laundry': { image: CAT_IMGS.cleaners, bgColor: '#E8F5E9' },
};

// Map API category names to display names (most are already good, minimal changes)
export const categoryNameMap: Record<string, string> = {
  'Staples & Grains': 'Grains',
  'Beverages': 'Beverages',
  'Dairy & Eggs': 'Dairy',
  'Fresh Fruits & Vegetables': 'Produce',
  'Fruits': 'Fruits',
  'Snacks & Namkeen': 'Snacks',
  'Cleaning & Household': 'Cleaning',
  // Most other categories use their name as-is
};

// Get image and color for category, with fallback
export function getCategoryImage(categoryName: string, index: number) {
  const mapData = categoryImageMap[categoryName];
  if (mapData) return mapData;

  // Fallback to a random image and color
  const imageKeys = Object.keys(CAT_IMGS) as Array<keyof typeof CAT_IMGS>;
  const randomImage = CAT_IMGS[imageKeys[index % imageKeys.length]];
  const bgColor = BG_COLORS[index % BG_COLORS.length];

  return { image: randomImage, bgColor };
}

function insertLineBreaks(name: string): string {
  if (name.includes('\n')) return name;

  const patterns: Array<[RegExp, string]> = [
    [/\s&\s/, '\n& '],
    [/\sand\s/i, '\nand '],
  ];

  for (const [pattern, replacement] of patterns) {
    if (pattern.test(name)) {
      return name.replace(pattern, replacement);
    }
  }

  const words = name.split(' ');
  if (words.length >= 3) {
    const splitIndex = Math.ceil(words.length / 2);
    return `${words.slice(0, splitIndex).join(' ')}\n${words.slice(splitIndex).join(' ')}`;
  }

  return name;
}

// Get display name for category
export function getCategoryDisplayName(categoryName: string): string {
  const displayName = categoryNameMap[categoryName] || categoryName;
  return insertLineBreaks(displayName);
}
