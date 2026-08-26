import { useCallback, useEffect, useState } from 'react';
import type { Product, SquareCatalogProduct, SquareCatalogResponse } from '@/types';
import { fallbackProducts } from '@/data/products';
import { supabase } from '@/lib/supabase';

const CACHE_KEY = 'cg_square_catalog';
const CACHE_TTL = 2 * 60 * 1000;

interface CachedCatalog {
  products: Product[];
  cachedAt: number;
}

const slugify = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const MODIFIER_LIST_ID = 'JG7CFWZAVLG2E5XPGCXG6KBH';

const fallbackBySlug = new Map(
  fallbackProducts.map((p) => [slugify(p.name), p]),
);

function getFallbackImage(name: string): string {
  return fallbackBySlug.get(slugify(name))?.image || '';
}

function getFallbackDescription(name: string): string {
  return fallbackBySlug.get(slugify(name))?.description || '';
}

function mapSquareProduct(sp: SquareCatalogProduct): Product {
  const variations = sp.variations.map((v) => {
    const lowerName = v.name.toLowerCase();
    let size = 'regular';
    if (lowerName.includes('small')) size = 'small';
    else if (lowerName.includes('to go') || lowerName.includes('bottle')) size = 'to_go';
    else if (lowerName.includes('regular') || lowerName.includes('medium')) size = 'regular';

    return {
      id: `${slugify(sp.name)}-${slugify(v.name)}`,
      label: v.name,
      size,
      priceCents: v.priceCents,
      squareVariationId: v.squareVariationId,
    };
  });

  const flavors = [...new Set(variations.map((v) => v.flavor).filter(Boolean))];
  const hasFlavors = flavors.length > 1;

  return {
    id: slugify(sp.name),
    name: sp.name,
    description: sp.description || getFallbackDescription(sp.name),
    image: sp.image || getFallbackImage(sp.name),
    variations,
    hasFlavors,
    squareItemId: sp.squareItemId,
    squareModifierListId: MODIFIER_LIST_ID,
  };
}

function readCache(): CachedCatalog | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedCatalog;
    if (!parsed.products || !parsed.cachedAt) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(products: Product[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ products, cachedAt: Date.now() }));
  } catch {
    // ignore
  }
}

function clearCache() {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
    // ignore
  }
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [loading, setLoading] = useState(true);

  const fetchCatalog = useCallback(async (force: boolean): Promise<boolean> => {
    if (!force) {
      const cached = readCache();
      if (cached && Date.now() - cached.cachedAt < CACHE_TTL) {
        setProducts(cached.products);
        setLoading(false);
        return true;
      }
    }

    try {
      const { data, error } = await supabase.functions.invoke<SquareCatalogResponse>(
        'get-square-catalog',
      );

      if (error || !data?.products) throw error || new Error('No products returned');

      const mapped = data.products.map(mapSquareProduct).filter((p) => p.variations.length > 0);

      if (mapped.length === 0) {
        setLoading(false);
        return false;
      }

      writeCache(mapped);
      setProducts(mapped);
      setLoading(false);
      return true;
    } catch {
      setLoading(false);
      return false;
    }
  }, []);

  useEffect(() => {
    fetchCatalog(false);
  }, [fetchCatalog]);

  const refresh = useCallback(async () => {
    clearCache();
    setLoading(true);
    await fetchCatalog(true);
  }, [fetchCatalog]);

  return { products, loading, refresh };
}
