import { useEffect, useState } from 'react';
import type { MilkChoice, Product, Variation } from '@/types';
import { formatPrice, cn } from '@/lib/utils';
import { Minus, Plus, X } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, variation: Variation, milk: MilkChoice, quantity: number) => void;
}

const MILKS: { value: MilkChoice; label: string }[] = [
  { value: 'oat', label: 'Oat' },
  { value: 'whole', label: 'Whole Milk' },
];

export function ProductModal({ product, onClose, onAddToCart }: ProductModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedFlavor, setSelectedFlavor] = useState<string>('');
  const [milk, setMilk] = useState<MilkChoice>('oat');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      const firstFlavor = product.hasFlavors
        ? (product.variations[0]?.flavor ?? '')
        : '';
      setSelectedFlavor(firstFlavor);

      const firstVar = product.hasFlavors
        ? product.variations.find((v) => v.flavor === firstFlavor)
        : product.variations[0];
      setSelectedSize(firstVar?.size ?? '');
      setMilk('oat');
      setQuantity(1);
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [product, onClose]);

  if (!product) return null;

  const flavors = product.hasFlavors
    ? [...new Set(product.variations.map((v) => v.flavor!).filter(Boolean))]
    : [];

  const availableSizes = product.hasFlavors
    ? product.variations.filter((v) => v.flavor === selectedFlavor)
    : product.variations;

  const sizeKeys = [...new Set(availableSizes.map((v) => v.size))];

  const currentVariation = product.variations.find(
    (v) => v.size === selectedSize && (!product.hasFlavors || v.flavor === selectedFlavor),
  );

  const lineTotal = (currentVariation?.priceCents ?? 0) * quantity;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-espresso-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-t-3xl bg-cream-50 shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-espresso-950/70 text-cream-100 transition hover:bg-espresso-950"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative aspect-[16/10] overflow-hidden bg-cream-200">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-espresso-400">
              <Plus className="h-12 w-12" />
            </div>
          )}
        </div>

        <div className="flex max-h-[60vh] flex-col gap-5 overflow-y-auto p-6">
          <div>
            <h3 className="font-serif text-2xl font-bold text-espresso-950">
              {product.name}
            </h3>
            <p className="mt-1 text-sm text-espresso-700/80">
              {product.description}
            </p>
          </div>

          {product.hasFlavors && (
            <div>
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-espresso-600">
                Flavor
              </span>
              <div className="flex flex-wrap gap-2">
                {flavors.map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      setSelectedFlavor(f);
                      const firstSize = product.variations.find((v) => v.flavor === f);
                      if (firstSize) setSelectedSize(firstSize.size);
                    }}
                    className={cn(
                      'rounded-xl border px-4 py-2.5 text-sm font-semibold transition',
                      selectedFlavor === f
                        ? 'border-caramel-500 bg-caramel-500 text-espresso-950'
                        : 'border-cream-300 bg-cream-100 text-espresso-800 hover:border-caramel-300',
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-espresso-600">
              Size
            </span>
            <div className="grid grid-cols-3 gap-2">
              {sizeKeys.map((size) => {
                const varForSize = availableSizes.find((v) => v.size === size);
                return (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      'flex flex-col items-center rounded-xl border px-2 py-3 text-sm font-semibold transition',
                      selectedSize === size
                        ? 'border-caramel-500 bg-caramel-500 text-espresso-950'
                        : 'border-cream-300 bg-cream-100 text-espresso-800 hover:border-caramel-300',
                    )}
                  >
                    <span>{varForSize?.label}</span>
                    <span className="mt-0.5 text-xs font-normal opacity-80">
                      {varForSize ? formatPrice(varForSize.priceCents) : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-espresso-600">
              Milk
            </span>
            <div className="grid grid-cols-2 gap-2">
              {MILKS.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setMilk(m.value)}
                  className={cn(
                    'rounded-xl border px-4 py-2.5 text-sm font-semibold transition',
                    milk === m.value
                      ? 'border-caramel-500 bg-caramel-500 text-espresso-950'
                      : 'border-cream-300 bg-cream-100 text-espresso-800 hover:border-caramel-300',
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-espresso-600">
              Quantity
            </span>
            <div className="inline-flex items-center rounded-xl border border-cream-300 bg-cream-100">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-11 w-11 items-center justify-center rounded-l-xl text-espresso-800 transition hover:bg-cream-200"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center font-bold text-espresso-950">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                className="flex h-11 w-11 items-center justify-center rounded-r-xl text-espresso-800 transition hover:bg-cream-200"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-cream-200 pt-4">
            <span className="text-sm text-espresso-700">Line total</span>
            <span className="font-serif text-xl font-bold text-espresso-950">
              {formatPrice(lineTotal)}
            </span>
          </div>

          <button
            onClick={() => {
              if (currentVariation) {
                onAddToCart(product, currentVariation, milk, quantity);
                onClose();
              }
            }}
            disabled={!currentVariation}
            className="w-full rounded-xl bg-espresso-900 px-6 py-3.5 font-semibold text-cream-100 transition hover:bg-espresso-950 active:scale-[0.98] disabled:opacity-60"
          >
            Add to order
          </button>
        </div>
      </div>
    </div>
  );
}
