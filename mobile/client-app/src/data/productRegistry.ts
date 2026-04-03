// Central product registry — maps every product ID used across the app to its display details.
// CartScreen uses this to render items from cartState.

import { CATEGORY_DATA } from './categoryData';

export interface RegistryProduct {
  id: string;
  name: string;
  brand: string;
  weight: string;
  price: number;
  emoji: string;
}

const registry: Record<string, RegistryProduct> = {};

// ── HomeScreen's Chicken / Meat / Fish products ────────────────────────────
const homeProducts: RegistryProduct[] = [
  { id: 'home-p1', name: 'Chicken Curry Cut',    brand: 'Local Farm', weight: '400 g',  price: 180, emoji: '🍗' },
  { id: 'home-p2', name: 'Whole Chicken',         brand: 'Local Farm', weight: '1000 g', price: 399, emoji: '🐔' },
  { id: 'home-p3', name: 'Indian Curry Cut Fish', brand: 'Local Farm', weight: '1 kg',   price: 349, emoji: '🐟' },
];
homeProducts.forEach((p) => { registry[p.id] = p; });

// ── CartScreen dummy items ─────────────────────────────────────────────────
const cartDummy: RegistryProduct[] = [
  { id: 'c1', name: 'Amul Butter',       brand: 'Amul',     weight: '500 g', price: 275, emoji: '🧈' },
  { id: 'c2', name: 'Whole Wheat Bread', brand: "Modern's", weight: '400 g', price: 42,  emoji: '🍞' },
  { id: 'c3', name: 'Farm Fresh Milk',   brand: 'Heritage', weight: '1 L',   price: 62,  emoji: '🥛' },
  { id: 'c4', name: 'Sunflower Oil',     brand: 'Saffola',  weight: '1 L',   price: 149, emoji: '🫙' },
];
cartDummy.forEach((p) => { registry[p.id] = p; });

// ── All subcategory products from categoryData ─────────────────────────────
Object.values(CATEGORY_DATA).forEach(({ products }) => {
  products.forEach((p) => {
    registry[String(p.id)] = {
      id: String(p.id),
      name: p.name,
      brand: p.brand,
      weight: p.weight,
      price: p.price,
      emoji: '📦',
    };
  });
});

export function getProduct(id: string): RegistryProduct | undefined {
  return registry[id];
}

export default registry;
