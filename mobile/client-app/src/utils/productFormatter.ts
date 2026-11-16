import { Product } from '../services/ProductsService';

export interface FormattedProduct {
  id: string;
  variantId: string;
  name: string;
  brand: string;
  weight: string;
  imageUrl: string | null;
  price: number;
  mrp: number;
  discount: number;
  stock: number;
  isOutOfStock: boolean;
}

export function formatProductForDisplay(product: Product): FormattedProduct | null {
  if (!product.variants || product.variants.length === 0) {
    return null;
  }

  const variant = product.variants[0];
  // If inventoryBalances is missing/empty, assume stock is available (999)
  // Otherwise use the actual available quantity
  const stock = product.inventoryBalances && product.inventoryBalances.length > 0
    ? product.inventoryBalances[0].available
    : 999; // Default to high number if no inventory data

  const discount = Math.round(
    ((variant.mrp - variant.sellingPrice) / variant.mrp) * 100
  );

  const weight = `${variant.unitValue} ${variant.unitLabel}`;

  return {
    id: product.id,
    variantId: variant.id,
    name: product.name,
    brand: product.brand,
    weight,
    imageUrl: product.imageUrl,
    price: variant.sellingPrice,
    mrp: variant.mrp,
    discount,
    stock,
    isOutOfStock: stock === 0,
  };
}
