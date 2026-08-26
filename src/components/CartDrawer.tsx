import { useEffect } from 'react';
import type { CartItem } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Minus, Plus, Trash2, X, ShoppingBag } from 'lucide-react';

interface CartDrawerProps {
  open: boolean;
  items: CartItem[];
  totalCents: number;
  onClose: () => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

const milkLabel = (milk: string) =>
  milk === 'oat' ? 'Oat' : 'Whole Milk';

export function CartDrawer({
  open,
  items,
  totalCents,
  onClose,
  onUpdateQuantity,
  onRemove,
  onCheckout,
}: CartDrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-espresso-950/50 backdrop-blur-sm transition-opacity ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-cream-50 shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-cream-200 px-5 py-4">
          <h2 className="font-serif text-xl font-bold text-espresso-950">
            Your Order
          </h2>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-espresso-700 transition hover:bg-cream-200"
            aria-label="Close order"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cream-200 text-espresso-500">
              <ShoppingBag className="h-7 w-7" />
            </div>
            <p className="font-serif text-lg font-semibold text-espresso-800">
              Your order is empty
            </p>
            <p className="text-sm text-espresso-600/80">
              Browse the menu and tap a drink to start your order.
            </p>
            <button
              onClick={onClose}
              className="mt-2 rounded-xl bg-espresso-900 px-5 py-2.5 text-sm font-semibold text-cream-100 transition hover:bg-espresso-950"
            >
              Keep shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-2xl border border-cream-200 bg-cream-100 p-3"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-espresso-950">
                      {item.name}
                    </p>
                    <p className="text-xs text-espresso-600">
                      {item.flavor ? `${item.flavor} · ` : ''}
                      {item.sizeLabel} · {milkLabel(item.milk)} · {formatPrice(item.priceCents)}
                    </p>
                    <div className="mt-2 inline-flex items-center rounded-lg border border-cream-300 bg-cream-50">
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity - 1)
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-l-lg text-espresso-700 transition hover:bg-cream-200"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-espresso-950">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity + 1)
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-r-lg text-espresso-700 transition hover:bg-cream-200"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="font-semibold text-espresso-950">
                      {formatPrice(item.priceCents * item.quantity)}
                    </span>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="text-espresso-500 transition hover:text-red-600"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-cream-200 px-5 py-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-espresso-700">Subtotal</span>
                <span className="font-serif text-xl font-bold text-espresso-950">
                  {formatPrice(totalCents)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={onClose}
                  className="rounded-xl border border-cream-300 bg-cream-100 px-4 py-3 text-sm font-semibold text-espresso-800 transition hover:bg-cream-200"
                >
                  Keep shopping
                </button>
                <button
                  onClick={onCheckout}
                  className="rounded-xl bg-caramel-500 px-4 py-3 text-sm font-bold text-espresso-950 transition hover:bg-caramel-600 active:scale-[0.98]"
                >
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
