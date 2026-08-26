import { useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface HeaderProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
}

export function Header({ cartCount, cartTotal, onOpenCart }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-cream-200/60 bg-espresso-950/95 backdrop-blur supports-[backdrop-filter]:bg-espresso-950/80">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
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
          type="button"
          onClick={onOpenCart}
          className="group relative hidden items-center gap-2 rounded-full bg-cream-100 px-4 py-2 text-sm font-semibold text-espresso-950 shadow-sm transition hover:bg-cream-50 active:scale-95 md:flex"
          aria-label={`View order, ${cartCount} items, ${formatPrice(cartTotal)}`}
        >
          <ShoppingBag className="h-4 w-4" />
          <span>Order</span>
          {cartCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-caramel-500 px-1 text-[11px] font-bold text-espresso-950">
              {cartCount}
            </span>
          )}
          <span className="ml-1 font-bold">{formatPrice(cartTotal)}</span>
        </button>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          className="flex items-center gap-2 rounded-full bg-cream-100 px-4 py-2 text-sm font-semibold text-espresso-950 shadow-sm transition hover:bg-cream-50 active:scale-95 md:hidden"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          <span>Menu</span>
        </button>

        {isMobileMenuOpen && (
          <div
            id="mobile-navigation"
            className="absolute right-4 top-full mt-2 w-56 rounded-2xl border border-cream-200 bg-cream-50 p-2 text-espresso-950 shadow-xl md:hidden"
          >
            <a
              href="#menu"
              onClick={closeMobileMenu}
              className="block rounded-xl px-4 py-3 text-sm font-semibold transition hover:bg-cream-100"
            >
              Menu
            </a>
            <a
              href="#about"
              onClick={closeMobileMenu}
              className="block rounded-xl px-4 py-3 text-sm font-semibold transition hover:bg-cream-100"
            >
              Our Story
            </a>
            <a
              href="#visit"
              onClick={closeMobileMenu}
              className="block rounded-xl px-4 py-3 text-sm font-semibold transition hover:bg-cream-100"
            >
              Visit
            </a>
            <button
              type="button"
              onClick={() => {
                closeMobileMenu();
                onOpenCart();
              }}
              className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold transition hover:bg-cream-100"
            >
              <span>View order</span>
              <span>{formatPrice(cartTotal)}</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
