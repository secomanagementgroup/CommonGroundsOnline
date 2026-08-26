import type { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Plus } from 'lucide-react';

interface MenuSectionProps {
  products: Product[];
  onSelect: (product: Product) => void;
}

export function MenuSection({ products, onSelect }: MenuSectionProps) {
  return (
    <section id="menu" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-8 flex flex-col gap-2 sm:mb-10">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-caramel-600" />
        <h2 className="font-serif text-3xl font-bold text-espresso-950 sm:text-4xl">
          Our Menu
        </h2>
        <p className="max-w-xl text-espresso-700/80">
          Tap any drink to pick your size, flavor, and milk. Your order
          updates as you go.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const prices = product.variations.map((v) => v.priceCents);
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          const priceLabel =
            minPrice === maxPrice
              ? formatPrice(minPrice)
              : `${formatPrice(minPrice)} – ${formatPrice(maxPrice)}`;

          return (
            <button
              key={product.id}
              onClick={() => onSelect(product)}
              className="group flex flex-col overflow-hidden rounded-2xl border border-cream-200 bg-cream-50 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-caramel-300 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-caramel-500 focus-visible:ring-offset-2"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute right-3 top-3 rounded-full bg-espresso-950/85 px-3 py-1 text-sm font-bold text-cream-100 backdrop-blur">
                  {priceLabel}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-serif text-xl font-bold text-espresso-950">
                  {product.name}
                </h3>
                <p className="mt-1 flex-1 text-sm text-espresso-700/80">
                  {product.description}
                </p>
                {product.hasFlavors && (
                  <span className="mt-2 inline-block rounded-full bg-caramel-50 px-2.5 py-0.5 text-xs font-semibold text-caramel-700">
                    Multiple flavors
                  </span>
                )}
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-caramel-700 transition group-hover:gap-2">
                  <Plus className="h-4 w-4" />
                  Add to order
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
