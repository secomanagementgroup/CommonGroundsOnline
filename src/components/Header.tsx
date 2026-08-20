import { ShoppingBag } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface HeaderProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
}

export function Header({ cartCount, cartTotal, onOpenCart }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-cream-200/60 bg-espresso-950/95 backdrop-blur supports-[backdrop-filter]:bg-espresso-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <a href="#top" className="flex items-center gap-3">
          <img
            src="images/4913498224090352720_121.jpg"
            alt="Common Grounds Coffee"
            className="h-11 w-11 rounded-full object-cover ring-2 ring-cream-300/70 sm:h-12 sm:w-12"
          />
          <div className="leading-none">
            <span className="block font-serif text-lg font-bold tracking-tight text-cream-100 sm:text-2xl">
              Common Grounds
            </span>
            <span className="mt-0.5 hidden text-[11px] uppercase tracking-[0.25em] text-cream-400 sm:block">
              Coffee Co.
            </span>
          </div>
        </a>

        <nav className="hidden items-center gap-8 text-sm font-medium text-cream-200 md:flex">
          <a href="#menu" className="transition hover:text-cream-50">
            Menu
          </a>
          <a href="#about" className="transition hover:text-cream-50">
            Our Story
          </a>
          <a href="#visit" className="transition hover:text-cream-50">
            Visit
          </a>
        </nav>

        <button
          onClick={onOpenCart}
          className="group relative flex items-center gap-2 rounded-full bg-cream-100 px-4 py-2 text-sm font-semibold text-espresso-950 shadow-sm transition hover:bg-cream-50 active:scale-95"
          aria-label={`View order, ${cartCount} items, ${formatPrice(cartTotal)}`}
        >
          <ShoppingBag className="h-4 w-4" />
          <span className="hidden sm:inline">Order</span>
          {cartCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-caramel-500 px-1 text-[11px] font-bold text-espresso-950">
              {cartCount}
            </span>
          )}
          <span className="ml-1 hidden font-bold sm:inline">
            {formatPrice(cartTotal)}
          </span>
        </button>
      </div>
    </header>
  );
}
