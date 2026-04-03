// ─────────────────────────────────────────────────────────────────────────────
// Master data: subcategories + products  (all 8 main home-screen categories)
// iconLib: 'mci' = MaterialCommunityIcons  'ion' = Ionicons
// ─────────────────────────────────────────────────────────────────────────────

export interface SubCat {
  id: number;
  name: string;
  icon: string;          // icon name
  iconLib: 'mci' | 'ion';
}

export interface Product {
  id: number;
  subCatId: number;
  name: string;
  brand: string;
  weight: string;
  price: number;
  mrp: number;
  discount: number;
  rating: number;
  reviews: string;
  delivery: string;
  stock: number;
  unit: string;
}

// ─── 1. Atta, Rice & Dal ────────────────────────────────────────────────────
export const atRiceDalSubs: SubCat[] = [
  { id: 101, name: 'Atta &\nFlour',      icon: 'sack',              iconLib: 'mci' },
  { id: 102, name: 'Rice',               icon: 'bowl-mix-outline',  iconLib: 'mci' },
  { id: 103, name: 'Dal &\nPulses',      icon: 'seed-outline',      iconLib: 'mci' },
  { id: 104, name: 'Poha &\nSuji',       icon: 'grain',             iconLib: 'mci' },
  { id: 105, name: 'Noodles &\nPasta',   icon: 'food-outline',      iconLib: 'mci' },
  { id: 106, name: 'Papad &\nPickle',    icon: 'food-croissant',    iconLib: 'mci' },
];

export const atRiceDalProducts: Product[] = [
  // Atta
  { id: 1001, subCatId: 101, name: 'Aashirvaad Whole Wheat Atta',    brand: 'Aashirvaad', weight: '5 kg',  price: 269, mrp: 310, discount: 13, rating: 4.7, reviews: '18,432', delivery: '11 MINS', stock: 4, unit: '₹53.8/kg' },
  { id: 1002, subCatId: 101, name: 'Pillsbury Chakki Fresh Atta',    brand: 'Pillsbury',  weight: '5 kg',  price: 249, mrp: 290, discount: 14, rating: 4.5, reviews: '9,210',  delivery: '11 MINS', stock: 3, unit: '₹49.8/kg' },
  { id: 1003, subCatId: 101, name: 'Patanjali Whole Wheat Atta',     brand: 'Patanjali',  weight: '5 kg',  price: 215, mrp: 260, discount: 17, rating: 4.4, reviews: '6,800',  delivery: '11 MINS', stock: 5, unit: '₹43/kg'   },
  { id: 1004, subCatId: 101, name: 'Fortune Chakki Atta',            brand: 'Fortune',   weight: '10 kg', price: 489, mrp: 570, discount: 14, rating: 4.6, reviews: '11,200', delivery: '11 MINS', stock: 2, unit: '₹48.9/kg' },
  // Rice
  { id: 1005, subCatId: 102, name: 'India Gate Basmati Rice Classic', brand: 'India Gate', weight: '5 kg',  price: 560, mrp: 650, discount: 14, rating: 4.8, reviews: '24,100', delivery: '11 MINS', stock: 3, unit: '₹112/kg'  },
  { id: 1006, subCatId: 102, name: 'Daawat Super Basmati Rice',       brand: 'Daawat',    weight: '5 kg',  price: 520, mrp: 610, discount: 15, rating: 4.6, reviews: '12,300', delivery: '11 MINS', stock: 2, unit: '₹104/kg'  },
  { id: 1007, subCatId: 102, name: 'Kohinoor Platinum Basmati',       brand: 'Kohinoor',  weight: '5 kg',  price: 590, mrp: 680, discount: 13, rating: 4.7, reviews: '8,900',  delivery: '11 MINS', stock: 4, unit: '₹118/kg'  },
  { id: 1008, subCatId: 102, name: 'Sona Masoori Raw Rice',           brand: 'Local',     weight: '5 kg',  price: 280, mrp: 330, discount: 15, rating: 4.4, reviews: '5,600',  delivery: '11 MINS', stock: 6, unit: '₹56/kg'   },
  // Dal
  { id: 1009, subCatId: 103, name: 'Tata Sampann Toor Dal',          brand: 'Tata',      weight: '1 kg',  price: 168, mrp: 195, discount: 14, rating: 4.6, reviews: '7,400',  delivery: '11 MINS', stock: 5, unit: '₹168/kg'  },
  { id: 1010, subCatId: 103, name: 'Patanjali Chana Dal',            brand: 'Patanjali', weight: '1 kg',  price: 112, mrp: 135, discount: 17, rating: 4.3, reviews: '3,200',  delivery: '11 MINS', stock: 7, unit: '₹112/kg'  },
  { id: 1011, subCatId: 103, name: 'Haldiram Moong Dal Whole',       brand: 'Haldiram',  weight: '500 g', price:  85, mrp: 100, discount: 15, rating: 4.4, reviews: '2,800',  delivery: '11 MINS', stock: 4, unit: '₹170/kg'  },
  { id: 1012, subCatId: 103, name: 'Tata Sampann Masoor Dal',        brand: 'Tata',      weight: '1 kg',  price: 145, mrp: 168, discount: 14, rating: 4.5, reviews: '4,100',  delivery: '11 MINS', stock: 3, unit: '₹145/kg'  },
  // Poha & Suji
  { id: 1013, subCatId: 104, name: 'MTR Poha (Thick)',               brand: 'MTR',       weight: '500 g', price:  48, mrp:  58, discount: 17, rating: 4.5, reviews: '3,600',  delivery: '11 MINS', stock: 6, unit: '₹96/kg'   },
  { id: 1014, subCatId: 104, name: 'Aashirvaad Suji (Rava)',         brand: 'Aashirvaad',weight: '1 kg',  price:  52, mrp:  62, discount: 16, rating: 4.4, reviews: '2,100',  delivery: '11 MINS', stock: 5, unit: '₹52/kg'   },
  { id: 1015, subCatId: 104, name: 'Patanjali Corn Flakes',          brand: 'Patanjali', weight: '500 g', price:  72, mrp:  88, discount: 18, rating: 4.2, reviews: '1,400',  delivery: '11 MINS', stock: 4, unit: '₹144/kg'  },
  { id: 1016, subCatId: 104, name: 'Quaker Oats Original',           brand: 'Quaker',    weight: '1 kg',  price: 185, mrp: 220, discount: 16, rating: 4.6, reviews: '9,800',  delivery: '11 MINS', stock: 3, unit: '₹185/kg'  },
  // Noodles
  { id: 1017, subCatId: 105, name: 'Maggi 2-Minute Noodles',         brand: 'Maggi',     weight: '560 g', price:  88, mrp: 105, discount: 16, rating: 4.7, reviews: '31,200', delivery: '11 MINS', stock: 8, unit: '₹157/kg'  },
  { id: 1018, subCatId: 105, name: 'Yippee Magic Masala Noodles',    brand: 'Yippee',    weight: '480 g', price:  75, mrp:  92, discount: 18, rating: 4.5, reviews: '14,600', delivery: '11 MINS', stock: 6, unit: '₹156/kg'  },
  { id: 1019, subCatId: 105, name: 'Barilla Penne Pasta',            brand: 'Barilla',   weight: '500 g', price: 165, mrp: 200, discount: 18, rating: 4.6, reviews: '4,300',  delivery: '11 MINS', stock: 4, unit: '₹330/kg'  },
  { id: 1020, subCatId: 105, name: 'Ching\'s Schezwan Noodles',      brand: 'Ching\'s',  weight: '240 g', price:  55, mrp:  68, discount: 19, rating: 4.4, reviews: '6,700',  delivery: '11 MINS', stock: 5, unit: '₹229/kg'  },
  // Papad & Pickle
  { id: 1021, subCatId: 106, name: 'Lijjat Urad Papad',             brand: 'Lijjat',    weight: '200 g', price:  48, mrp:  58, discount: 17, rating: 4.6, reviews: '5,200',  delivery: '11 MINS', stock: 7, unit: '₹240/kg'  },
  { id: 1022, subCatId: 106, name: 'Priya Mango Pickle',            brand: 'Priya',     weight: '500 g', price:  95, mrp: 115, discount: 17, rating: 4.5, reviews: '3,800',  delivery: '11 MINS', stock: 5, unit: '₹190/kg'  },
  { id: 1023, subCatId: 106, name: 'Mother\'s Methi Mango Pickle',  brand: 'Mother\'s', weight: '500 g', price: 125, mrp: 150, discount: 17, rating: 4.7, reviews: '7,100',  delivery: '11 MINS', stock: 3, unit: '₹250/kg'  },
  { id: 1024, subCatId: 106, name: 'Appachi Plain Papad',           brand: 'Appachi',   weight: '400 g', price:  65, mrp:  78, discount: 17, rating: 4.3, reviews: '1,900',  delivery: '11 MINS', stock: 6, unit: '₹163/kg'  },
];

// ─── 2. Dry Fruits & Cereals ────────────────────────────────────────────────
export const dryFruitSubs: SubCat[] = [
  { id: 201, name: 'Almonds',           icon: 'nut',                iconLib: 'mci' },
  { id: 202, name: 'Cashews',           icon: 'food-apple-outline', iconLib: 'mci' },
  { id: 203, name: 'Raisins &\nDates',  icon: 'fruit-grapes-outline', iconLib: 'mci' },
  { id: 204, name: 'Walnuts &\nPistachio', icon: 'leaf-circle-outline', iconLib: 'mci' },
  { id: 205, name: 'Seeds &\nMix',      icon: 'sprout-outline',    iconLib: 'mci' },
  { id: 206, name: 'Breakfast\nCereals', icon: 'bowl-outline',     iconLib: 'mci' },
];

export const dryFruitProducts: Product[] = [
  { id: 2001, subCatId: 201, name: 'Happilo Premium Almonds',        brand: 'Happilo',   weight: '500 g', price: 399, mrp: 480, discount: 17, rating: 4.7, reviews: '12,400', delivery: '11 MINS', stock: 3, unit: '₹798/kg'  },
  { id: 2002, subCatId: 201, name: 'Miltop California Almonds',      brand: 'Miltop',    weight: '500 g', price: 380, mrp: 459, discount: 17, rating: 4.6, reviews: '8,100',  delivery: '11 MINS', stock: 4, unit: '₹760/kg'  },
  { id: 2003, subCatId: 201, name: 'Vedaka Popular Almonds',         brand: 'Vedaka',    weight: '200 g', price: 165, mrp: 199, discount: 17, rating: 4.5, reviews: '5,600',  delivery: '11 MINS', stock: 5, unit: '₹825/kg'  },
  { id: 2004, subCatId: 202, name: 'Happilo W320 Premium Cashews',   brand: 'Happilo',   weight: '500 g', price: 429, mrp: 520, discount: 17, rating: 4.8, reviews: '9,300',  delivery: '11 MINS', stock: 2, unit: '₹858/kg'  },
  { id: 2005, subCatId: 202, name: 'Nutraj Classic Cashews W240',    brand: 'Nutraj',    weight: '500 g', price: 469, mrp: 560, discount: 16, rating: 4.6, reviews: '4,200',  delivery: '11 MINS', stock: 3, unit: '₹938/kg'  },
  { id: 2006, subCatId: 202, name: 'Vedaka Cashews W180',            brand: 'Vedaka',    weight: '200 g', price: 195, mrp: 235, discount: 17, rating: 4.5, reviews: '3,100',  delivery: '11 MINS', stock: 6, unit: '₹975/kg'  },
  { id: 2007, subCatId: 203, name: 'Happilo Premium Seedless Raisins', brand: 'Happilo', weight: '500 g', price: 189, mrp: 230, discount: 18, rating: 4.6, reviews: '6,800',  delivery: '11 MINS', stock: 5, unit: '₹378/kg'  },
  { id: 2008, subCatId: 203, name: 'Medjool Premium Dates',           brand: 'Al Barakah', weight: '500 g', price: 349, mrp: 420, discount: 17, rating: 4.7, reviews: '3,200',  delivery: '11 MINS', stock: 3, unit: '₹698/kg'  },
  { id: 2009, subCatId: 204, name: 'Happilo Afghani Walnuts',        brand: 'Happilo',   weight: '500 g', price: 449, mrp: 540, discount: 17, rating: 4.7, reviews: '7,600',  delivery: '11 MINS', stock: 2, unit: '₹898/kg'  },
  { id: 2010, subCatId: 204, name: 'Nutraj Pistachios Roasted',      brand: 'Nutraj',    weight: '200 g', price: 229, mrp: 280, discount: 18, rating: 4.5, reviews: '2,900',  delivery: '11 MINS', stock: 4, unit: '₹1145/kg' },
  { id: 2011, subCatId: 205, name: 'Organic Pumpkin Seeds',          brand: 'Organic',   weight: '250 g', price: 199, mrp: 249, discount: 20, rating: 4.5, reviews: '3,400',  delivery: '11 MINS', stock: 5, unit: '₹796/kg'  },
  { id: 2012, subCatId: 205, name: 'Happilo Dry Fruit Mix',          brand: 'Happilo',   weight: '500 g', price: 329, mrp: 399, discount: 18, rating: 4.6, reviews: '5,100',  delivery: '11 MINS', stock: 3, unit: '₹658/kg'  },
  { id: 2013, subCatId: 206, name: 'Kellogg\'s Corn Flakes Original', brand: 'Kellogg\'s', weight: '875 g', price: 265, mrp: 315, discount: 16, rating: 4.6, reviews: '14,200', delivery: '11 MINS', stock: 4, unit: '₹303/kg'  },
  { id: 2014, subCatId: 206, name: 'Quaker Oats',                    brand: 'Quaker',    weight: '1 kg',  price: 185, mrp: 220, discount: 16, rating: 4.7, reviews: '19,800', delivery: '11 MINS', stock: 5, unit: '₹185/kg'  },
  { id: 2015, subCatId: 206, name: 'Muesli No Added Sugar',          brand: 'Saffola',   weight: '750 g', price: 299, mrp: 360, discount: 17, rating: 4.5, reviews: '6,400',  delivery: '11 MINS', stock: 3, unit: '₹399/kg'  },
];

// ─── 3. Dairy, Bread & Eggs ─────────────────────────────────────────────────
export const dairyBreadSubs: SubCat[] = [
  { id: 301, name: 'Milk',              icon: 'cup-outline',        iconLib: 'mci' },
  { id: 302, name: 'Curd &\nYogurt',   icon: 'bowl-mix',           iconLib: 'mci' },
  { id: 303, name: 'Paneer &\nTofu',   icon: 'cube-outline',       iconLib: 'mci' },
  { id: 304, name: 'Butter &\nCheese', icon: 'cheese',             iconLib: 'mci' },
  { id: 305, name: 'Bread &\nPav',     icon: 'bread-slice-outline',iconLib: 'mci' },
  { id: 306, name: 'Eggs',             icon: 'egg-outline',        iconLib: 'mci' },
];

export const dairyBreadProducts: Product[] = [
  { id: 3001, subCatId: 301, name: 'Amul Taaza Toned Milk',          brand: 'Amul',      weight: '500 ml', price:  28, mrp:  32, discount: 12, rating: 4.7, reviews: '22,100', delivery: '11 MINS', stock: 10, unit: '₹56/ltr'   },
  { id: 3002, subCatId: 301, name: 'Mother Dairy Full Cream Milk',   brand: 'Mother D',  weight: '1 ltr',  price:  68, mrp:  76, discount: 11, rating: 4.6, reviews: '14,300', delivery: '11 MINS', stock: 6,  unit: '₹68/ltr'   },
  { id: 3003, subCatId: 301, name: 'Nandini Homogenised Milk',       brand: 'Nandini',   weight: '500 ml', price:  26, mrp:  30, discount: 13, rating: 4.5, reviews: '8,600',  delivery: '11 MINS', stock: 8,  unit: '₹52/ltr'   },
  { id: 3004, subCatId: 302, name: 'Amul Masti Dahi',                brand: 'Amul',      weight: '400 g',  price:  38, mrp:  44, discount: 14, rating: 4.6, reviews: '16,500', delivery: '11 MINS', stock: 5,  unit: '₹95/kg'    },
  { id: 3005, subCatId: 302, name: 'Mother Dairy Mishti Doi',        brand: 'Mother D',  weight: '400 g',  price:  52, mrp:  62, discount: 16, rating: 4.5, reviews: '4,300',  delivery: '11 MINS', stock: 4,  unit: '₹130/kg'   },
  { id: 3006, subCatId: 303, name: 'Amul Fresh Paneer',              brand: 'Amul',      weight: '200 g',  price:  78, mrp:  92, discount: 15, rating: 4.7, reviews: '11,200', delivery: '11 MINS', stock: 3,  unit: '₹390/kg'   },
  { id: 3007, subCatId: 303, name: 'Mother Dairy Paneer',            brand: 'Mother D',  weight: '200 g',  price:  80, mrp:  95, discount: 16, rating: 4.5, reviews: '7,800',  delivery: '11 MINS', stock: 4,  unit: '₹400/kg'   },
  { id: 3008, subCatId: 304, name: 'Amul Butter Salted',             brand: 'Amul',      weight: '500 g',  price: 268, mrp: 305, discount: 12, rating: 4.8, reviews: '19,400', delivery: '11 MINS', stock: 5,  unit: '₹536/kg'   },
  { id: 3009, subCatId: 304, name: 'Amul Processed Cheese Slice',    brand: 'Amul',      weight: '200 g',  price: 110, mrp: 130, discount: 15, rating: 4.6, reviews: '8,900',  delivery: '11 MINS', stock: 3,  unit: '₹550/kg'   },
  { id: 3010, subCatId: 305, name: 'Britannia 100% Whole Wheat',     brand: 'Britannia', weight: '400 g',  price:  42, mrp:  50, discount: 16, rating: 4.5, reviews: '12,300', delivery: '11 MINS', stock: 6,  unit: '₹105/kg'   },
  { id: 3011, subCatId: 305, name: 'Modern White Sandwich Bread',    brand: 'Modern',    weight: '400 g',  price:  38, mrp:  44, discount: 14, rating: 4.4, reviews: '8,100',  delivery: '11 MINS', stock: 5,  unit: '₹95/kg'    },
  { id: 3012, subCatId: 306, name: 'Farm Fresh White Eggs',          brand: 'Country E', weight: '12 pcs', price:  90, mrp: 108, discount: 17, rating: 4.7, reviews: '21,600', delivery: '11 MINS', stock: 8,  unit: '₹7.5/egg'  },
  { id: 3013, subCatId: 306, name: 'Organic Brown Eggs',             brand: 'Organic',   weight: '6 pcs',  price:  75, mrp:  90, discount: 17, rating: 4.6, reviews: '6,400',  delivery: '11 MINS', stock: 4,  unit: '₹12.5/egg' },
];

// ─── 4. Bakery & Biscuits ────────────────────────────────────────────────────
export const bakerySubs: SubCat[] = [
  { id: 401, name: 'Biscuits &\nCookies', icon: 'cookie-outline',   iconLib: 'mci' },
  { id: 402, name: 'Cakes &\nPastries',  icon: 'cake-variant-outline', iconLib: 'mci' },
  { id: 403, name: 'Rusk &\nKhakra',     icon: 'toaster-oven',      iconLib: 'mci' },
  { id: 404, name: 'Muffins &\nDonuts',  icon: 'cupcake',           iconLib: 'mci' },
  { id: 405, name: 'Puff &\nPastry',     icon: 'food-croissant',    iconLib: 'mci' },
];

export const bakeryProducts: Product[] = [
  { id: 4001, subCatId: 401, name: 'Parle-G Original Glucose',      brand: 'Parle',     weight: '799 g',  price: 80,  mrp:  95, discount: 16, rating: 4.7, reviews: '28,400', delivery: '11 MINS', stock: 8,  unit: '₹100/kg'   },
  { id: 4002, subCatId: 401, name: 'Britannia Good Day Cashew',     brand: 'Britannia', weight: '600 g',  price: 98,  mrp: 118, discount: 17, rating: 4.6, reviews: '14,700', delivery: '11 MINS', stock: 6,  unit: '₹163/kg'   },
  { id: 4003, subCatId: 401, name: 'Hide & Seek Chocolate Chip',    brand: 'Parle',     weight: '300 g',  price: 72,  mrp:  88, discount: 18, rating: 4.5, reviews: '9,100',  delivery: '11 MINS', stock: 5,  unit: '₹240/kg'   },
  { id: 4004, subCatId: 401, name: 'Oreo Original Cream',           brand: 'Mondelez',  weight: '300 g',  price: 78,  mrp:  92, discount: 15, rating: 4.8, reviews: '22,300', delivery: '11 MINS', stock: 7,  unit: '₹260/kg'   },
  { id: 4005, subCatId: 402, name: 'Britannia Nutri Choice Cake',   brand: 'Britannia', weight: '250 g',  price: 65,  mrp:  80, discount: 19, rating: 4.4, reviews: '4,200',  delivery: '11 MINS', stock: 4,  unit: '₹260/kg'   },
  { id: 4006, subCatId: 402, name: 'Bisk Farm Choco Cake',          brand: 'Bisk Farm', weight: '150 g',  price: 45,  mrp:  55, discount: 18, rating: 4.3, reviews: '2,800',  delivery: '11 MINS', stock: 6,  unit: '₹300/kg'   },
  { id: 4007, subCatId: 403, name: 'Britannia Toast Rusk',          brand: 'Britannia', weight: '640 g',  price: 98,  mrp: 120, discount: 18, rating: 4.5, reviews: '6,300',  delivery: '11 MINS', stock: 5,  unit: '₹153/kg'   },
  { id: 4008, subCatId: 403, name: 'Modi Khakra Methi',             brand: 'Modi',      weight: '200 g',  price: 55,  mrp:  68, discount: 19, rating: 4.4, reviews: '1,900',  delivery: '11 MINS', stock: 4,  unit: '₹275/kg'   },
  { id: 4009, subCatId: 404, name: 'Entenmann\'s Blueberry Muffins', brand: 'Ent.',     weight: '4 pcs',  price: 85,  mrp: 100, discount: 15, rating: 4.4, reviews: '1,400',  delivery: '11 MINS', stock: 3,  unit: '₹21/pc'    },
  { id: 4010, subCatId: 404, name: 'Mr Donut Glazed Donuts',        brand: 'Mr Donut',  weight: '4 pcs',  price: 120, mrp: 145, discount: 17, rating: 4.3, reviews: '980',    delivery: '11 MINS', stock: 2,  unit: '₹30/pc'    },
  { id: 4011, subCatId: 405, name: 'Monginis Veg Puff',             brand: 'Monginis',  weight: '2 pcs',  price:  50, mrp:  60, discount: 17, rating: 4.3, reviews: '2,100',  delivery: '11 MINS', stock: 5,  unit: '₹25/pc'    },
  { id: 4012, subCatId: 405, name: 'Peppy Cheese Croissant',        brand: 'Peppy',     weight: '1 pcs',  price:  35, mrp:  42, discount: 17, rating: 4.2, reviews: '1,300',  delivery: '11 MINS', stock: 4,  unit: '₹35/pc'    },
];

// ─── 5. Oil & Masala ────────────────────────────────────────────────────────
export const oilMasalaSubs: SubCat[] = [
  { id: 501, name: 'Oil',               icon: 'bottle-tonic-outline', iconLib: 'mci' },
  { id: 502, name: 'Desi Ghee',         icon: 'pot-outline',           iconLib: 'mci' },
  { id: 503, name: 'Powdered\nSpices',  icon: 'shaker-outline',        iconLib: 'mci' },
  { id: 504, name: 'Whole\nSpices',     icon: 'star-circle-outline',   iconLib: 'mci' },
  { id: 505, name: 'Salt, Sugar\n& Jaggery', icon: 'cube-scan',        iconLib: 'mci' },
  { id: 506, name: 'Herbs &\nSeasoning', icon: 'leaf-outline',         iconLib: 'mci' },
];

export const oilMasalaProducts: Product[] = [
  { id: 5001, subCatId: 501, name: 'Fortune Sunlite Sunflower Oil',  brand: 'Fortune',   weight: '1 ltr',  price: 188, mrp: 230, discount: 18, rating: 4.5, reviews: '11,667', delivery: '11 MINS', stock: 3, unit: '₹18.8/100ml' },
  { id: 5002, subCatId: 501, name: 'Freedom Rice Bran Oil',          brand: 'Freedom',   weight: '1 ltr',  price: 159, mrp: 194, discount: 18, rating: 4.5, reviews: '5,919',  delivery: '11 MINS', stock: 2, unit: '₹15.9/100ml' },
  { id: 5003, subCatId: 501, name: 'Saffola Gold Refined Oil',       brand: 'Saffola',   weight: '1 ltr',  price: 210, mrp: 260, discount: 19, rating: 4.6, reviews: '8,400',  delivery: '11 MINS', stock: 4, unit: '₹21/100ml'   },
  { id: 5004, subCatId: 501, name: 'Dharani Groundnut Oil',          brand: 'Dharani',   weight: '1 ltr',  price: 195, mrp: 240, discount: 19, rating: 4.4, reviews: '3,200',  delivery: '11 MINS', stock: 5, unit: '₹19.5/100ml' },
  { id: 5005, subCatId: 502, name: 'Amul Pure Ghee',                 brand: 'Amul',      weight: '1 ltr',  price: 580, mrp: 680, discount: 15, rating: 4.7, reviews: '14,200', delivery: '11 MINS', stock: 2, unit: '₹58/100ml'   },
  { id: 5006, subCatId: 502, name: 'Patanjali Desi Ghee',            brand: 'Patanjali', weight: '1 kg',   price: 499, mrp: 580, discount: 14, rating: 4.4, reviews: '6,700',  delivery: '11 MINS', stock: 5, unit: '₹49.9/100g'  },
  { id: 5007, subCatId: 503, name: 'Everest Red Chilli Powder',      brand: 'Everest',   weight: '200 g',  price:  89, mrp: 110, discount: 19, rating: 4.4, reviews: '4,500',  delivery: '11 MINS', stock: 6, unit: '₹44.5/100g'  },
  { id: 5008, subCatId: 503, name: 'MDH Garam Masala',               brand: 'MDH',       weight: '100 g',  price:  68, mrp:  80, discount: 15, rating: 4.5, reviews: '7,800',  delivery: '11 MINS', stock: 4, unit: '₹68/100g'    },
  { id: 5009, subCatId: 504, name: 'Cumin Seeds (Jeera) Everest',    brand: 'Everest',   weight: '100 g',  price:  55, mrp:  70, discount: 21, rating: 4.5, reviews: '3,400',  delivery: '11 MINS', stock: 5, unit: '₹55/100g'    },
  { id: 5010, subCatId: 504, name: 'Green Cardamom Elaichi',         brand: 'Jawala',    weight: '50 g',   price:  95, mrp: 120, discount: 21, rating: 4.6, reviews: '2,700',  delivery: '11 MINS', stock: 3, unit: '₹190/100g'   },
  { id: 5011, subCatId: 505, name: 'Tata Salt (Iodized)',            brand: 'Tata',      weight: '1 kg',   price:  22, mrp:  26, discount: 15, rating: 4.7, reviews: '12,500', delivery: '11 MINS', stock: 10,unit: '₹22/kg'      },
  { id: 5012, subCatId: 505, name: 'Patanjali Jaggery Powder',       brand: 'Patanjali', weight: '1 kg',   price:  72, mrp:  88, discount: 18, rating: 4.4, reviews: '3,100',  delivery: '11 MINS', stock: 5, unit: '₹72/kg'      },
  { id: 5013, subCatId: 506, name: 'Keya Mixed Herbs',               brand: 'Keya',      weight: '30 g',   price:  85, mrp: 100, discount: 15, rating: 4.5, reviews: '1,900',  delivery: '11 MINS', stock: 5, unit: '₹283/100g'   },
  { id: 5014, subCatId: 506, name: 'Oregano Seasoning',              brand: 'Urban Platter', weight: '25 g', price: 55, mrp: 65, discount: 15, rating: 4.3, reviews: '1,200', delivery: '11 MINS', stock: 7, unit: '₹220/100g'  },
];

// ─── 6. Kitchenware & Appliances ────────────────────────────────────────────
export const kitchenwareSubs: SubCat[] = [
  { id: 601, name: 'Cookware',           icon: 'pot-steam-outline',  iconLib: 'mci' },
  { id: 602, name: 'Storage &\nContainers', icon: 'archive-outline', iconLib: 'mci' },
  { id: 603, name: 'Cutlery &\nServing', icon: 'silverware-fork-knife', iconLib: 'mci' },
  { id: 604, name: 'Small\nAppliances',  icon: 'blender-outline',    iconLib: 'mci' },
  { id: 605, name: 'Cleaning\nTools',    icon: 'broom',              iconLib: 'mci' },
];

export const kitchenwateProducts: Product[] = [
  { id: 6001, subCatId: 601, name: 'Hawkins Futura Non-Stick Kadai', brand: 'Hawkins',   weight: '28 cm',  price: 890, mrp:1100, discount: 19, rating: 4.7, reviews: '4,200',  delivery: '11 MINS', stock: 2, unit: '₹890/pc'    },
  { id: 6002, subCatId: 601, name: 'Prestige Deluxe Pressure Cooker',brand: 'Prestige',  weight: '3 ltr',  price: 799, mrp:1000, discount: 20, rating: 4.6, reviews: '6,800',  delivery: '11 MINS', stock: 3, unit: '₹799/pc'    },
  { id: 6003, subCatId: 601, name: 'Vinod Stainless Steel Tawa',     brand: 'Vinod',     weight: '26 cm',  price: 380, mrp: 480, discount: 21, rating: 4.5, reviews: '3,100',  delivery: '11 MINS', stock: 4, unit: '₹380/pc'    },
  { id: 6004, subCatId: 602, name: 'Milton Steel Lunch Box (3 tier)', brand: 'Milton',   weight: '3 pcs',  price: 349, mrp: 450, discount: 22, rating: 4.6, reviews: '5,700',  delivery: '11 MINS', stock: 5, unit: '₹349/set'   },
  { id: 6005, subCatId: 602, name: 'Cello Plastic Container Set',    brand: 'Cello',     weight: '6 pcs',  price: 299, mrp: 380, discount: 21, rating: 4.4, reviews: '3,900',  delivery: '11 MINS', stock: 6, unit: '₹299/set'   },
  { id: 6006, subCatId: 603, name: 'Stainless Steel Spoon Set',      brand: 'Jindal',    weight: '6 pcs',  price: 180, mrp: 240, discount: 25, rating: 4.5, reviews: '2,800',  delivery: '11 MINS', stock: 7, unit: '₹180/set'   },
  { id: 6007, subCatId: 603, name: 'Cutting Board Bamboo',           brand: 'Eco Life',  weight: '1 pc',   price: 249, mrp: 320, discount: 22, rating: 4.4, reviews: '1,600',  delivery: '11 MINS', stock: 4, unit: '₹249/pc'    },
  { id: 6008, subCatId: 604, name: 'Philips Hand Mixer',             brand: 'Philips',   weight: '1 unit', price:1250, mrp:1600, discount: 22, rating: 4.5, reviews: '2,300',  delivery: '11 MINS', stock: 2, unit: '₹1250/pc'   },
  { id: 6009, subCatId: 604, name: 'Inalsa Electric Kettle Inox',    brand: 'Inalsa',    weight: '1.5 ltr',price: 699, mrp: 950, discount: 26, rating: 4.4, reviews: '4,100',  delivery: '11 MINS', stock: 3, unit: '₹699/pc'    },
  { id: 6010, subCatId: 605, name: 'Scotch-Brite Scrub Pad 6 pcs',  brand: '3M',        weight: '6 pcs',  price:  78, mrp: 100, discount: 22, rating: 4.6, reviews: '8,900',  delivery: '11 MINS', stock: 10,unit: '₹13/pc'     },
  { id: 6011, subCatId: 605, name: 'Vim Dishwash Liquid',            brand: 'Vim',       weight: '750 ml', price: 109, mrp: 130, discount: 16, rating: 4.5, reviews: '6,400',  delivery: '11 MINS', stock: 8, unit: '₹14.5/100ml'},
];

// ─── 7. Fruits & Vegetables ──────────────────────────────────────────────────
export const fruitVegSubs: SubCat[] = [
  { id: 701, name: 'Fresh\nVegetables', icon: 'carrot',              iconLib: 'mci' },
  { id: 702, name: 'Fresh\nFruits',    icon: 'fruit-watermelon',     iconLib: 'mci' },
  { id: 703, name: 'Leafy\nGreens',    icon: 'leaf',                 iconLib: 'mci' },
  { id: 704, name: 'Herbs &\nPlants',  icon: 'flower-outline',       iconLib: 'mci' },
  { id: 705, name: 'Exotics &\nOrganic', icon: 'sprout',             iconLib: 'mci' },
];

export const fruitVegProducts: Product[] = [
  { id: 7001, subCatId: 701, name: 'Fresh Tomatoes',                 brand: 'Farm',      weight: '500 g',  price:  22, mrp:  30, discount: 27, rating: 4.4, reviews: '9,800',  delivery: '11 MINS', stock: 10, unit: '₹44/kg'    },
  { id: 7002, subCatId: 701, name: 'Onion',                          brand: 'Farm',      weight: '1 kg',   price:  35, mrp:  45, discount: 22, rating: 4.3, reviews: '8,100',  delivery: '11 MINS', stock: 10, unit: '₹35/kg'    },
  { id: 7003, subCatId: 701, name: 'Potato',                         brand: 'Farm',      weight: '1 kg',   price:  28, mrp:  36, discount: 22, rating: 4.4, reviews: '10,200', delivery: '11 MINS', stock: 10, unit: '₹28/kg'    },
  { id: 7004, subCatId: 701, name: 'Capsicum Green',                 brand: 'Farm',      weight: '500 g',  price:  35, mrp:  48, discount: 27, rating: 4.3, reviews: '3,400',  delivery: '11 MINS', stock: 6,  unit: '₹70/kg'    },
  { id: 7005, subCatId: 702, name: 'Banana (Yelakki)',               brand: 'Farm',      weight: '500 g',  price:  35, mrp:  44, discount: 20, rating: 4.6, reviews: '12,400', delivery: '11 MINS', stock: 8,  unit: '₹70/kg'    },
  { id: 7006, subCatId: 702, name: 'Apple (Himachal)',               brand: 'Farm',      weight: '4 pcs',  price:  89, mrp: 110, discount: 19, rating: 4.5, reviews: '8,300',  delivery: '11 MINS', stock: 6,  unit: '₹22/pc'    },
  { id: 7007, subCatId: 702, name: 'Watermelon',                     brand: 'Farm',      weight: '1 pc',   price: 149, mrp: 180, discount: 17, rating: 4.4, reviews: '5,100',  delivery: '11 MINS', stock: 3,  unit: '₹149/pc'   },
  { id: 7008, subCatId: 702, name: 'Grapes (Green)',                 brand: 'Farm',      weight: '500 g',  price:  75, mrp:  95, discount: 21, rating: 4.5, reviews: '4,600',  delivery: '11 MINS', stock: 5,  unit: '₹150/kg'   },
  { id: 7009, subCatId: 703, name: 'Spinach (Palak)',                brand: 'Farm',      weight: '250 g',  price:  20, mrp:  28, discount: 29, rating: 4.4, reviews: '5,200',  delivery: '11 MINS', stock: 8,  unit: '₹80/kg'    },
  { id: 7010, subCatId: 703, name: 'Methi (Fenugreek Leaves)',       brand: 'Farm',      weight: '250 g',  price:  18, mrp:  25, discount: 28, rating: 4.3, reviews: '3,100',  delivery: '11 MINS', stock: 7,  unit: '₹72/kg'    },
  { id: 7011, subCatId: 704, name: 'Fresh Coriander',                brand: 'Farm',      weight: '100 g',  price:  10, mrp:  15, discount: 33, rating: 4.5, reviews: '6,800',  delivery: '11 MINS', stock: 10, unit: '₹100/kg'   },
  { id: 7012, subCatId: 704, name: 'Curry Leaves (Kadi Patta)',      brand: 'Farm',      weight: '50 g',   price:   8, mrp:  12, discount: 33, rating: 4.4, reviews: '3,900',  delivery: '11 MINS', stock: 8,  unit: '₹160/kg'   },
  { id: 7013, subCatId: 705, name: 'Organic Baby Spinach',           brand: 'Organic',   weight: '150 g',  price:  55, mrp:  70, discount: 21, rating: 4.6, reviews: '1,800',  delivery: '11 MINS', stock: 4,  unit: '₹367/kg'   },
  { id: 7014, subCatId: 705, name: 'Avocado (imported)',             brand: 'Farm',      weight: '2 pcs',  price: 149, mrp: 180, discount: 17, rating: 4.5, reviews: '2,300',  delivery: '11 MINS', stock: 3,  unit: '₹75/pc'    },
];

// ─── 8. Chicken, Meat & Fish ────────────────────────────────────────────────
export const meatFishSubs: SubCat[] = [
  { id: 801, name: 'Chicken',           icon: 'food-drumstick-outline', iconLib: 'mci' },
  { id: 802, name: 'Mutton &\nLamb',   icon: 'cow',                  iconLib: 'mci' },
  { id: 803, name: 'Fish',              icon: 'fish',                 iconLib: 'mci' },
  { id: 804, name: 'Prawns &\nSeafood', icon: 'shrimp-outline',       iconLib: 'mci' },
  { id: 805, name: 'Eggs',              icon: 'egg-outline',          iconLib: 'mci' },
  { id: 806, name: 'Marinades\n& Ready', icon: 'bowl-mix-outline',    iconLib: 'mci' },
];

export const meatFishProducts: Product[] = [
  { id: 8001, subCatId: 801, name: 'Chicken Curry Cut',              brand: 'Fresh',     weight: '500 g',  price: 178, mrp: 210, discount: 15, rating: 4.5, reviews: '6,400',  delivery: '11 MINS', stock: 5, unit: '₹356/kg'    },
  { id: 8002, subCatId: 801, name: 'Chicken Breast Boneless',        brand: 'Fresh',     weight: '500 g',  price: 218, mrp: 260, discount: 16, rating: 4.6, reviews: '4,200',  delivery: '11 MINS', stock: 4, unit: '₹436/kg'    },
  { id: 8003, subCatId: 801, name: 'Whole Chicken (Cleaned)',        brand: 'Fresh',     weight: '1 kg',   price: 320, mrp: 380, discount: 16, rating: 4.4, reviews: '3,600',  delivery: '11 MINS', stock: 3, unit: '₹320/kg'    },
  { id: 8004, subCatId: 801, name: 'Chicken Keema (Minced)',         brand: 'Fresh',     weight: '500 g',  price: 195, mrp: 235, discount: 17, rating: 4.5, reviews: '2,900',  delivery: '11 MINS', stock: 4, unit: '₹390/kg'    },
  { id: 8005, subCatId: 802, name: 'Mutton Curry Cut',               brand: 'Fresh',     weight: '500 g',  price: 399, mrp: 480, discount: 17, rating: 4.5, reviews: '3,800',  delivery: '11 MINS', stock: 3, unit: '₹798/kg'    },
  { id: 8006, subCatId: 802, name: 'Mutton Keema',                   brand: 'Fresh',     weight: '500 g',  price: 419, mrp: 500, discount: 16, rating: 4.4, reviews: '2,100',  delivery: '11 MINS', stock: 2, unit: '₹838/kg'    },
  { id: 8007, subCatId: 803, name: 'Rohu Fish (Cleaned)',            brand: 'Fresh',     weight: '500 g',  price: 199, mrp: 240, discount: 17, rating: 4.4, reviews: '3,100',  delivery: '11 MINS', stock: 4, unit: '₹398/kg'    },
  { id: 8008, subCatId: 803, name: 'Katla Fish Curry Cut',           brand: 'Fresh',     weight: '500 g',  price: 210, mrp: 255, discount: 18, rating: 4.3, reviews: '2,400',  delivery: '11 MINS', stock: 3, unit: '₹420/kg'    },
  { id: 8009, subCatId: 804, name: 'Prawns Medium (Cleaned)',        brand: 'Fresh',     weight: '500 g',  price: 349, mrp: 420, discount: 17, rating: 4.6, reviews: '2,800',  delivery: '11 MINS', stock: 3, unit: '₹698/kg'    },
  { id: 8010, subCatId: 804, name: 'Tiger Prawns Large',             brand: 'Fresh',     weight: '500 g',  price: 449, mrp: 540, discount: 17, rating: 4.7, reviews: '1,600',  delivery: '11 MINS', stock: 2, unit: '₹898/kg'    },
  { id: 8011, subCatId: 805, name: 'Farm Fresh Eggs (White)',        brand: 'Country',   weight: '12 pcs', price:  90, mrp: 108, discount: 17, rating: 4.7, reviews: '21,600', delivery: '11 MINS', stock: 8, unit: '₹7.5/egg'   },
  { id: 8012, subCatId: 805, name: 'Brown Organic Eggs',             brand: 'Organic',   weight: '6 pcs',  price:  75, mrp:  90, discount: 17, rating: 4.6, reviews: '6,400',  delivery: '11 MINS', stock: 4, unit: '₹12.5/egg'  },
  { id: 8013, subCatId: 806, name: 'Chicken Seekh Kebab (Ready)',    brand: 'ITC',       weight: '250 g',  price: 145, mrp: 175, discount: 17, rating: 4.5, reviews: '3,200',  delivery: '11 MINS', stock: 5, unit: '₹580/kg'    },
  { id: 8014, subCatId: 806, name: 'Tandoori Marinade Chicken',      brand: 'Kohinoor',  weight: '250 g',  price: 165, mrp: 199, discount: 17, rating: 4.4, reviews: '1,800',  delivery: '11 MINS', stock: 4, unit: '₹660/kg'    },
];

// ─── 9. Tea & Coffee (Snacks section) ───────────────────────────────────────
export const teaCoffeeSubs: SubCat[] = [
  { id: 901, name: 'Tea Bags',          icon: 'tea-outline',         iconLib: 'mci' },
  { id: 902, name: 'Loose Tea',         icon: 'cup-water',           iconLib: 'mci' },
  { id: 903, name: 'Instant\nCoffee',   icon: 'coffee',              iconLib: 'mci' },
  { id: 904, name: 'Filter\nCoffee',    icon: 'coffee-maker-outline',iconLib: 'mci' },
  { id: 905, name: 'Flavoured\nDrinks', icon: 'cup-outline',         iconLib: 'mci' },
];

export const teaCoffeeProducts: Product[] = [
  { id: 9001, subCatId: 901, name: 'Twinings English Breakfast',     brand: 'Twinings',  weight: '25 bags', price: 180, mrp: 220, discount: 18, rating: 4.7, reviews: '8,100',  delivery: '11 MINS', stock: 5,  unit: '₹7.2/bag'  },
  { id: 9002, subCatId: 901, name: 'Tetley Green Tea',               brand: 'Tetley',    weight: '25 bags', price: 145, mrp: 175, discount: 17, rating: 4.5, reviews: '6,400',  delivery: '11 MINS', stock: 6,  unit: '₹5.8/bag'  },
  { id: 9003, subCatId: 902, name: 'Tata Tea Premium',               brand: 'Tata',      weight: '500 g',   price: 210, mrp: 255, discount: 18, rating: 4.7, reviews: '14,200', delivery: '11 MINS', stock: 4,  unit: '₹420/kg'   },
  { id: 9004, subCatId: 902, name: 'Wagh Bakri Masala Chai',         brand: 'Wagh Bakri',weight: '500 g',   price: 225, mrp: 270, discount: 17, rating: 4.6, reviews: '9,800',  delivery: '11 MINS', stock: 5,  unit: '₹450/kg'   },
  { id: 9005, subCatId: 903, name: 'Nescafé Classic Instant Coffee', brand: 'Nescafé',   weight: '100 g',   price: 150, mrp: 185, discount: 19, rating: 4.7, reviews: '18,400', delivery: '11 MINS', stock: 6,  unit: '₹150/100g' },
  { id: 9006, subCatId: 903, name: 'BRU Gold Instant Coffee',        brand: 'BRU',       weight: '100 g',   price: 145, mrp: 175, discount: 17, rating: 4.6, reviews: '11,200', delivery: '11 MINS', stock: 5,  unit: '₹145/100g' },
  { id: 9007, subCatId: 904, name: 'Cothas Filter Coffee Powder',    brand: 'Cothas',    weight: '500 g',   price: 225, mrp: 275, discount: 18, rating: 4.8, reviews: '6,700',  delivery: '11 MINS', stock: 4,  unit: '₹450/kg'   },
  { id: 9008, subCatId: 904, name: 'Leo Coffee Filter',              brand: 'Leo',       weight: '500 g',   price: 215, mrp: 260, discount: 17, rating: 4.7, reviews: '4,300',  delivery: '11 MINS', stock: 3,  unit: '₹430/kg'   },
  { id: 9009, subCatId: 905, name: 'Horlicks Classic Malt',          brand: 'Horlicks',  weight: '500 g',   price: 249, mrp: 300, discount: 17, rating: 4.6, reviews: '9,100',  delivery: '11 MINS', stock: 5,  unit: '₹498/kg'   },
  { id: 9010, subCatId: 905, name: 'Bournvita Cadbury',              brand: 'Cadbury',   weight: '500 g',   price: 259, mrp: 310, discount: 16, rating: 4.7, reviews: '12,400', delivery: '11 MINS', stock: 4,  unit: '₹518/kg'   },
];

// ─── 10. Snacks (Chips, Sweets, Instant, Ice Cream) ───────────────────────
export const snacksSubs: SubCat[] = [
  { id: 1001, name: 'Chips &\nNamkeen',   icon: 'food-variant',       iconLib: 'mci' },
  { id: 1002, name: 'Sweets &\nChocolates', icon: 'candy-outline',    iconLib: 'mci' },
  { id: 1003, name: 'Biscuits',          icon: 'cookie-outline',      iconLib: 'mci' },
  { id: 1004, name: 'Drinks &\nJuices',  icon: 'cup-water',           iconLib: 'mci' },
  { id: 1005, name: 'Instant\nFood',     icon: 'noodles',             iconLib: 'mci' },
  { id: 1006, name: 'Ice Creams',        icon: 'ice-cream',           iconLib: 'mci' },
  { id: 1007, name: 'Pan\nCorner',       icon: 'leaf',                iconLib: 'mci' },
  { id: 1008, name: 'Sauces &\nSpreads', icon: 'sauce-round-bold',   iconLib: 'ion' },
];

export const snacksProducts: Product[] = [
  { id: 10001, subCatId: 1001, name: 'Lay\'s Classic Salted Chips',   brand: 'Lay\'s',    weight: '26 g',   price:  20, mrp:  25, discount: 20, rating: 4.5, reviews: '18,300', delivery: '11 MINS', stock: 10, unit: '₹20/pack'  },
  { id: 10002, subCatId: 1001, name: 'Haldiram Aloo Bhujia',          brand: 'Haldiram',  weight: '400 g',  price: 105, mrp: 130, discount: 19, rating: 4.6, reviews: '11,400', delivery: '11 MINS', stock: 7,  unit: '₹263/kg'   },
  { id: 10003, subCatId: 1001, name: 'Bingo Mad Angles',              brand: 'ITC',       weight: '50 g',   price:  20, mrp:  25, discount: 20, rating: 4.4, reviews: '8,200',  delivery: '11 MINS', stock: 8,  unit: '₹400/kg'   },
  { id: 10004, subCatId: 1002, name: 'Dairy Milk Silk',               brand: 'Cadbury',   weight: '150 g',  price: 145, mrp: 175, discount: 17, rating: 4.8, reviews: '22,800', delivery: '11 MINS', stock: 6,  unit: '₹967/kg'   },
  { id: 10005, subCatId: 1002, name: 'KitKat 4 Finger',               brand: 'Nestlé',    weight: '41.5 g', price:  42, mrp:  50, discount: 16, rating: 4.7, reviews: '14,600', delivery: '11 MINS', stock: 8,  unit: '₹1012/kg'  },
  { id: 10006, subCatId: 1003, name: 'Parle-G Original Glucose',      brand: 'Parle',     weight: '799 g',  price:  80, mrp:  95, discount: 16, rating: 4.7, reviews: '28,400', delivery: '11 MINS', stock: 8,  unit: '₹100/kg'   },
  { id: 10007, subCatId: 1004, name: 'Tropicana Mixed Fruit 100%',    brand: 'Tropicana', weight: '1 ltr',  price: 115, mrp: 140, discount: 18, rating: 4.6, reviews: '7,200',  delivery: '11 MINS', stock: 5,  unit: '₹115/ltr'  },
  { id: 10008, subCatId: 1004, name: 'Coca-Cola 750 ml',              brand: 'Coca-Cola', weight: '750 ml', price:  40, mrp:  48, discount: 17, rating: 4.5, reviews: '9,800',  delivery: '11 MINS', stock: 10, unit: '₹53/ltr'   },
  { id: 10009, subCatId: 1005, name: 'Maggi 2-Minute Noodles',        brand: 'Maggi',     weight: '70 g',   price:  15, mrp:  18, discount: 17, rating: 4.7, reviews: '31,200', delivery: '11 MINS', stock: 10, unit: '₹214/kg'   },
  { id: 10010, subCatId: 1005, name: 'MTR Rava Idli Mix',             brand: 'MTR',       weight: '500 g',  price:  95, mrp: 115, discount: 17, rating: 4.6, reviews: '8,300',  delivery: '11 MINS', stock: 6,  unit: '₹190/kg'   },
  { id: 10011, subCatId: 1006, name: 'Amul Vanilla Ice Cream',        brand: 'Amul',      weight: '500 ml', price: 110, mrp: 135, discount: 19, rating: 4.7, reviews: '8,600',  delivery: '11 MINS', stock: 3,  unit: '₹220/ltr'  },
  { id: 10012, subCatId: 1006, name: 'Kwality Walls Cornetto',        brand: 'HUL',       weight: '1 pc',   price:  50, mrp:  60, discount: 17, rating: 4.6, reviews: '6,400',  delivery: '11 MINS', stock: 5,  unit: '₹50/pc'    },
  { id: 10013, subCatId: 1007, name: 'Meetha Paan Shot',              brand: 'Pass Pass',  weight: '4 pcs',  price:  20, mrp:  25, discount: 20, rating: 4.2, reviews: '2,100',  delivery: '11 MINS', stock: 8,  unit: '₹5/pc'     },
  { id: 10014, subCatId: 1008, name: 'Maggi Hot & Sweet Tomato Sauce',brand: 'Maggi',     weight: '400 g',  price:  68, mrp:  80, discount: 15, rating: 4.5, reviews: '6,700',  delivery: '11 MINS', stock: 6,  unit: '₹17/100g'  },
  { id: 10015, subCatId: 1008, name: 'Kissan Mixed Fruit Jam',        brand: 'Kissan',    weight: '500 g',  price: 128, mrp: 155, discount: 17, rating: 4.6, reviews: '5,200',  delivery: '11 MINS', stock: 5,  unit: '₹256/kg'   },
];

// ─── 11. Beauty & Personal Care ─────────────────────────────────────────────
export const beautySubs: SubCat[] = [
  { id: 1101, name: 'Skin &\nFace',    icon: 'face-woman-shimmer-outline', iconLib: 'mci' },
  { id: 1102, name: 'Hair Care',       icon: 'hair-dryer-outline',         iconLib: 'mci' },
  { id: 1103, name: 'Bath\n& Body',    icon: 'shower-head',                iconLib: 'mci' },
  { id: 1104, name: 'Feminine\nHygiene', icon: 'flower-tulip-outline',     iconLib: 'mci' },
  { id: 1105, name: 'Oral Care',       icon: 'tooth-outline',              iconLib: 'mci' },
  { id: 1106, name: 'Deodorants',      icon: 'spray-bottle',               iconLib: 'mci' },
];

export const beautyProducts: Product[] = [
  { id: 11001, subCatId: 1101, name: 'Nivea Daily Essentials Face Wash', brand: 'Nivea',   weight: '150 ml', price: 180, mrp: 220, discount: 18, rating: 4.5, reviews: '8,400',  delivery: '11 MINS', stock: 5, unit: '₹120/100ml' },
  { id: 11002, subCatId: 1101, name: 'Lotus Herbals White Glow SPF40',  brand: 'Lotus',   weight: '60 g',   price: 249, mrp: 310, discount: 20, rating: 4.4, reviews: '4,200',  delivery: '11 MINS', stock: 4, unit: '₹415/100g'  },
  { id: 11003, subCatId: 1101, name: 'Neutrogena Hydro Boost Gel',      brand: 'Neutrogena', weight: '50 ml', price: 449, mrp: 560, discount: 20, rating: 4.6, reviews: '6,100',  delivery: '11 MINS', stock: 3, unit: '₹898/100ml' },
  { id: 11004, subCatId: 1102, name: 'Dove Shampoo Oxygen Moisture',    brand: 'Dove',    weight: '340 ml', price: 265, mrp: 320, discount: 17, rating: 4.6, reviews: '9,800',  delivery: '11 MINS', stock: 4, unit: '₹78/100ml'  },
  { id: 11005, subCatId: 1102, name: 'Tresemmé Keratin Smooth',         brand: 'Tresemmé',weight: '340 ml', price: 285, mrp: 345, discount: 17, rating: 4.5, reviews: '6,300',  delivery: '11 MINS', stock: 5, unit: '₹84/100ml'  },
  { id: 11006, subCatId: 1102, name: 'Parachute Coconut Hair Oil',      brand: 'Parachute',weight: '500 ml', price: 165, mrp: 200, discount: 18, rating: 4.7, reviews: '14,200', delivery: '11 MINS', stock: 6, unit: '₹33/100ml'  },
  { id: 11007, subCatId: 1103, name: 'Dove Beauty Bar Soap',            brand: 'Dove',    weight: '75 g x3',price: 148, mrp: 180, discount: 18, rating: 4.7, reviews: '12,800', delivery: '11 MINS', stock: 7, unit: '₹66/100g'   },
  { id: 11008, subCatId: 1103, name: 'Vaseline Intensive Care Lotion',  brand: 'Vaseline',weight: '400 ml', price: 295, mrp: 360, discount: 18, rating: 4.6, reviews: '7,600',  delivery: '11 MINS', stock: 5, unit: '₹74/100ml'  },
  { id: 11009, subCatId: 1104, name: 'Whisper Ultra Soft Pads XL',      brand: 'Whisper', weight: '30 pcs', price: 249, mrp: 300, discount: 17, rating: 4.7, reviews: '9,200',  delivery: '11 MINS', stock: 5, unit: '₹8.3/pc'    },
  { id: 11010, subCatId: 1104, name: 'Stayfree Secure Cotton Anion',    brand: 'Stayfree',weight: '7 pcs',  price:  55, mrp:  68, discount: 19, rating: 4.5, reviews: '5,100',  delivery: '11 MINS', stock: 7, unit: '₹7.9/pc'    },
  { id: 11011, subCatId: 1105, name: 'Colgate Strong Teeth Toothpaste', brand: 'Colgate', weight: '300 g',  price:  99, mrp: 120, discount: 18, rating: 4.6, reviews: '16,400', delivery: '11 MINS', stock: 8, unit: '₹33/100g'   },
  { id: 11012, subCatId: 1105, name: 'Oral-B Pro-Health Toothbrush',    brand: 'Oral-B',  weight: '3 pcs',  price: 145, mrp: 180, discount: 19, rating: 4.5, reviews: '8,200',  delivery: '11 MINS', stock: 6, unit: '₹48/pc'     },
  { id: 11013, subCatId: 1106, name: 'Dove Original Antiperspirant',    brand: 'Dove',    weight: '150 ml', price: 175, mrp: 215, discount: 19, rating: 4.6, reviews: '7,100',  delivery: '11 MINS', stock: 4, unit: '₹117/100ml' },
  { id: 11014, subCatId: 1106, name: 'Fogg Fresh Deodorant',            brand: 'Fogg',    weight: '150 ml', price: 165, mrp: 200, discount: 18, rating: 4.5, reviews: '9,800',  delivery: '11 MINS', stock: 5, unit: '₹110/100ml' },
];

// ─── 12. Household ───────────────────────────────────────────────────────────
export const householdSubs: SubCat[] = [
  { id: 1201, name: 'Detergents\n& Cleaners', icon: 'water-pump',     iconLib: 'mci' },
  { id: 1202, name: 'Repellents\n& Fresheners', icon: 'spray',        iconLib: 'mci' },
  { id: 1203, name: 'Stationery\n& Office',  icon: 'pencil-outline',  iconLib: 'mci' },
  { id: 1204, name: 'Electronics\n& Bulbs',  icon: 'lightbulb-outline', iconLib: 'mci' },
  { id: 1205, name: 'Toys &\nGames',         icon: 'dice-multiple-outline', iconLib: 'mci' },
  { id: 1206, name: 'Pooja &\nFestive',      icon: 'candle',          iconLib: 'mci' },
];

export const householdProducts: Product[] = [
  { id: 12001, subCatId: 1201, name: 'Ariel Matic Front Load Powder',brand: 'Ariel',    weight: '2 kg',   price: 380, mrp: 460, discount: 17, rating: 4.7, reviews: '8,900',  delivery: '11 MINS', stock: 4, unit: '₹190/kg'    },
  { id: 12002, subCatId: 1201, name: 'Surf Excel Easy Wash',          brand: 'Surf',     weight: '3 kg',   price: 320, mrp: 395, discount: 19, rating: 4.6, reviews: '11,200', delivery: '11 MINS', stock: 5, unit: '₹107/kg'    },
  { id: 12003, subCatId: 1201, name: 'Colin Glass Cleaner',           brand: 'Colin',    weight: '500 ml', price:  88, mrp: 110, discount: 20, rating: 4.5, reviews: '5,400',  delivery: '11 MINS', stock: 6, unit: '₹17.6/100ml'},
  { id: 12004, subCatId: 1202, name: 'Good Knight Liquid Refill',     brand: 'Good K.',  weight: '45 ml',  price:  68, mrp:  82, discount: 17, rating: 4.6, reviews: '7,800',  delivery: '11 MINS', stock: 8, unit: '₹151/100ml' },
  { id: 12005, subCatId: 1202, name: 'Ambi Pur Air Freshener',        brand: 'Ambi Pur', weight: '275 ml', price: 195, mrp: 245, discount: 20, rating: 4.5, reviews: '3,200',  delivery: '11 MINS', stock: 5, unit: '₹71/100ml'  },
  { id: 12006, subCatId: 1203, name: 'Camlin Classsmate Notebook',    brand: 'Camlin',   weight: '6 pcs',  price:  98, mrp: 120, discount: 18, rating: 4.5, reviews: '4,100',  delivery: '11 MINS', stock: 7, unit: '₹16/pc'     },
  { id: 12007, subCatId: 1203, name: 'Cello Gripper Ball Pen (5 pcs)',brand: 'Cello',    weight: '5 pcs',  price:  45, mrp:  58, discount: 22, rating: 4.4, reviews: '6,200',  delivery: '11 MINS', stock: 10,unit: '₹9/pc'      },
  { id: 12008, subCatId: 1204, name: 'Philips LED Bulb 9W',           brand: 'Philips',  weight: '1 pc',   price:  85, mrp: 110, discount: 23, rating: 4.7, reviews: '12,400', delivery: '11 MINS', stock: 8, unit: '₹85/pc'     },
  { id: 12009, subCatId: 1204, name: 'Syska LED Strip Light 5M',      brand: 'Syska',    weight: '1 roll', price: 549, mrp: 699, discount: 21, rating: 4.4, reviews: '3,100',  delivery: '11 MINS', stock: 3, unit: '₹549/roll'  },
  { id: 12010, subCatId: 1205, name: 'Funskool Snakes & Ladders',     brand: 'Funskool', weight: '1 pc',   price: 145, mrp: 180, discount: 19, rating: 4.5, reviews: '2,800',  delivery: '11 MINS', stock: 5, unit: '₹145/pc'    },
  { id: 12011, subCatId: 1205, name: 'Lego Duplo Starter Bricks',     brand: 'Lego',     weight: '65 pcs', price:1299, mrp:1600, discount: 19, rating: 4.8, reviews: '1,600',  delivery: '11 MINS', stock: 2, unit: '₹20/pc'     },
  { id: 12012, subCatId: 1206, name: 'Cycle 3-in-1 Premium Agarbatti',brand: 'Cycle',    weight: '18 pcs', price:  52, mrp:  65, discount: 20, rating: 4.6, reviews: '6,800',  delivery: '11 MINS', stock: 8, unit: '₹2.9/pc'    },
  { id: 12013, subCatId: 1206, name: 'Puja Ghee Diya Set',            brand: 'Patanjali',weight: '20 pcs', price:  75, mrp:  95, discount: 21, rating: 4.4, reviews: '2,300',  delivery: '11 MINS', stock: 6, unit: '₹3.8/pc'    },
];

// ─── Category → (subs, products) lookup ─────────────────────────────────────
export const CATEGORY_DATA: Record<string, { subs: SubCat[]; products: Product[] }> = {
  'Atta, Rice & Dal':        { subs: atRiceDalSubs,  products: atRiceDalProducts  },
  'Dry Fruits & Cereals':    { subs: dryFruitSubs,   products: dryFruitProducts   },
  'Dairy, Bread & Eggs':     { subs: dairyBreadSubs, products: dairyBreadProducts },
  'Bakery & Biscuits':       { subs: bakerySubs,      products: bakeryProducts     },
  'Oil & Masala':            { subs: oilMasalaSubs,  products: oilMasalaProducts  },
  'Kitchenware & Appliances':{ subs: kitchenwareSubs,products: kitchenwateProducts},
  'Fruits and Vegetables':   { subs: fruitVegSubs,   products: fruitVegProducts   },
  'Chicken, Meat & Fish':    { subs: meatFishSubs,   products: meatFishProducts   },
  'Tea & Coffee':            { subs: teaCoffeeSubs,  products: teaCoffeeProducts  },
  'Snacks & Drinks':         { subs: snacksSubs,      products: snacksProducts     },
  'Beauty & Personal Care':  { subs: beautySubs,      products: beautyProducts     },
  'Household':               { subs: householdSubs,  products: householdProducts  },
  // catch-all fallbacks for sub-category names too
  'Skin & Face':             { subs: beautySubs,      products: beautyProducts     },
  'Hair Care':               { subs: beautySubs,      products: beautyProducts     },
  'Feminine Hygiene':        { subs: beautySubs,      products: beautyProducts     },
  'Bath & Body':             { subs: beautySubs,      products: beautyProducts     },
  'Stationary & Games':      { subs: householdSubs,  products: householdProducts  },
  'Electronics':             { subs: householdSubs,  products: householdProducts  },
  'Cleaners & Repellents':   { subs: householdSubs,  products: householdProducts  },
  'Toys':                    { subs: householdSubs,  products: householdProducts  },
};

// ─── Product image helper ────────────────────────────────────────────────────
// Maps subCatId → a loremflickr keyword. The product's own id is used as the
// "lock" seed so every product gets a unique but stable photo.
const SUB_KEYWORDS: Record<number, string> = {
  // Atta, Rice & Dal
  101: 'wheat,flour',   102: 'rice,grain',    103: 'lentils',
  104: 'oats,cereal',   105: 'noodles,pasta', 106: 'pickle',
  // Dry Fruits & Cereals
  201: 'almonds',       202: 'cashews',       203: 'raisins,dates',
  204: 'walnuts',       205: 'seeds',         206: 'cereal,breakfast',
  // Dairy, Bread & Eggs
  301: 'milk',          302: 'yogurt',        303: 'paneer,cheese',
  304: 'butter',        305: 'bread',         306: 'eggs',
  // Bakery & Biscuits
  401: 'biscuit,cookie', 402: 'cake',         403: 'toast',
  404: 'donut,muffin',  405: 'pastry,croissant',
  // Oil & Masala
  501: 'cooking,oil',   502: 'ghee',          503: 'spices,masala',
  504: 'spices,seeds',  505: 'salt,sugar',    506: 'herbs,seasoning',
  // Kitchenware
  601: 'cookware,pan',  602: 'containers,storage', 603: 'cutlery,spoon',
  604: 'blender,appliance', 605: 'cleaning,sponge',
  // Fruits & Vegetables
  701: 'vegetables',    702: 'fruits',        703: 'leafy,greens',
  704: 'herbs,plant',   705: 'organic,salad',
  // Meat & Fish
  801: 'chicken,raw',   802: 'mutton,meat',   803: 'fish',
  804: 'prawns,shrimp', 805: 'eggs',          806: 'kebab',
  // Tea & Coffee
  901: 'teabag',        902: 'tea,cup',       903: 'coffee,instant',
  904: 'coffee,filter', 905: 'chocolate,malt',
  // Snacks & Drinks
  1001: 'chips,snacks', 1002: 'chocolate,sweet', 1003: 'biscuit,cookie',
  1004: 'juice,drinks', 1005: 'noodles,instant',  1006: 'icecream',
  1007: 'paan,betel',   1008: 'sauce,jam',
  // Beauty & Personal Care
  1101: 'skincare,cream',    1102: 'shampoo,haircare', 1103: 'soap,lotion',
  1104: 'sanitary,pads',     1105: 'toothpaste,dental', 1106: 'deodorant,spray',
  // Household
  1201: 'detergent,cleaner', 1202: 'freshener,spray',  1203: 'notebook,stationery',
  1204: 'bulb,light',        1205: 'toys,game',         1206: 'incense,festival',
};

export function getProductImage(product: Product): string {
  const keyword = SUB_KEYWORDS[product.subCatId] ?? 'food,grocery';
  return `https://loremflickr.com/320/320/${keyword}?lock=${product.id}`;
}

export function getDataForCategory(name: string): { subs: SubCat[]; products: Product[] } {
  // exact match
  if (CATEGORY_DATA[name]) return CATEGORY_DATA[name];
  // partial match
  const key = Object.keys(CATEGORY_DATA).find(k =>
    name.toLowerCase().includes(k.toLowerCase()) ||
    k.toLowerCase().includes(name.toLowerCase())
  );
  return key ? CATEGORY_DATA[key] : { subs: oilMasalaSubs, products: oilMasalaProducts };
}
