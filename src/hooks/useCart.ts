import { useCallback, useMemo, useState } from 'react';
import type { CartItem, MilkChoice, Product, Variation } from '@/types';

const lineId = (variation: Variation, milk: MilkChoice) =>
  `${variation.id}-${milk}`;

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback(
    (product: Product, variation: Variation, milk: MilkChoice, quantity: number) => {
      setItems((prev) => {
        const id = lineId(variation, milk);
        const existing = prev.find((i) => i.id === id);
        if (existing) {
          return prev.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity + quantity } : i,
          );
        }
        return [
          ...prev,
          {
            id,
            productId: product.id,
            name: product.name,
            sizeLabel: variation.label,
            flavor: variation.flavor,
            milk,
            quantity,
            priceCents: variation.priceCents,
            squareVariationId: variation.squareVariationId,
            squareItemId: product.squareItemId,
            squareModifierListId: product.squareModifierListId,
          },
        ];
      });
    },
    [],
  );

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity } : i))
        .filter((i) => i.quantity > 0),
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const totalCents = useMemo(
    () => items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0),
    [items],
  );

  const count = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  );

  return {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clear,
    totalCents,
    count,
  };
}
