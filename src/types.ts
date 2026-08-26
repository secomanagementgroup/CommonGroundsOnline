export type MilkChoice = 'oat' | 'whole';

export type SizeKey = string;

export interface Variation {
  id: string;
  label: string;
  size: SizeKey;
  flavor?: string;
  priceCents: number;
  squareVariationId: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  variations: Variation[];
  hasFlavors: boolean;
  squareItemId: string;
  squareModifierListId: string;
}

export interface SquareCatalogProduct {
  squareItemId: string;
  name: string;
  description: string;
  image: string;
  variations: {
    squareVariationId: string;
    name: string;
    priceCents: number;
  }[];
}

export interface SquareCatalogResponse {
  products: SquareCatalogProduct[];
  cachedAt: number;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  sizeLabel: string;
  flavor?: string;
  milk: MilkChoice;
  quantity: number;
  priceCents: number;
  squareVariationId: string;
  squareItemId: string;
  squareModifierListId: string;
}

export interface OrderSubmission {
  customerName: string;
  customerPhone: string;
  notes: string;
}
