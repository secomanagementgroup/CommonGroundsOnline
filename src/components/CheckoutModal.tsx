import { useEffect, useState } from 'react';
import type { CartItem } from '@/types';
import { formatPrice } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { X, Loader2, ExternalLink, AlertCircle } from 'lucide-react';

interface CheckoutModalProps {
  open: boolean;
  items: CartItem[];
  totalCents: number;
  onClose: () => void;
  onComplete: () => void;
}

const milkLabel = (milk: string) => (milk === 'oat' ? 'Oat' : 'Whole Milk');

export function CheckoutModal({
  open,
  items,
  totalCents,
  onClose,
  onComplete,
}: CheckoutModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'waiting' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setStatus('idle');
      setErrorMsg('');
      setCheckoutUrl(null);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && status !== 'submitting') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose, status]);

  useEffect(() => {
    if (status !== 'waiting') return;
    const checkReturn = () => {
      const params = new URLSearchParams(window.location.search);
      if (params.get('order_id')) {
        onComplete();
      }
    };
    checkReturn();
    const interval = setInterval(checkReturn, 500);
    return () => clearInterval(interval);
  }, [status, onComplete]);

  if (!open) return null;

  const handleSubmit = async () => {
    setStatus('submitting');
    setErrorMsg('');
    try {
      const { data: orderData, error: insertError } = await supabase
        .from('orders')
        .insert({
          items,
          total_cents: totalCents,
          status: 'pending',
          customer_name: name.trim() || null,
          customer_phone: phone.trim() || null,
          notes: notes.trim() || null,
        })
        .select('id')
        .single();

      if (insertError) throw insertError;

      const returnUrl = `${window.location.origin}${window.location.pathname}`;
      const { data: fnData, error: fnError } = await supabase.functions.invoke(
        'create-square-checkout',
        {
          body: {
            orderId: orderData.id,
            items,
            customerName: name.trim() || null,
            customerPhone: phone.trim() || null,
            notes: notes.trim() || null,
            returnUrl,
          },
        },
      );

      if (fnError) throw fnError;

      if (fnData?.checkoutUrl) {
        setCheckoutUrl(fnData.checkoutUrl);
        window.open(fnData.checkoutUrl, '_blank');
        setStatus('waiting');
        return;
      }

      throw new Error('No checkout URL returned from Square.');
    } catch (err) {
      setStatus('error');
      setErrorMsg(
        err instanceof Error ? err.message : 'Could not start Square checkout.',
      );
    }
  };

  const handleClose = () => {
    if (status === 'waiting') {
      onComplete();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-espresso-950/60 backdrop-blur-sm sm:items-center sm:p-6">
      <div className="relative w-full max-w-md overflow-hidden rounded-t-3xl bg-cream-50 shadow-2xl sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-cream-200 px-5 py-4">
          <h2 className="font-serif text-xl font-bold text-espresso-950">
            Checkout
          </h2>
          {status !== 'submitting' && (
            <button
              onClick={handleClose}
              className="flex h-9 w-9 items-center justify-center rounded-full text-espresso-700 transition hover:bg-cream-200"
              aria-label="Close checkout"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {status === 'waiting' ? (
          <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-caramel-100">
              <Loader2 className="h-8 w-8 animate-spin text-caramel-600" />
            </div>
            <h3 className="font-serif text-xl font-bold text-espresso-950">
              Complete your payment
            </h3>
            <p className="text-sm text-espresso-700/80">
              We've opened Square's secure payment page in a new tab. Complete
              your payment there, then come back here.
            </p>
            {checkoutUrl && (
              <a
                href={checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-caramel-500 px-5 py-2.5 text-sm font-bold text-espresso-950 transition hover:bg-caramel-600"
              >
                <ExternalLink className="h-4 w-4" />
                Open payment page again
              </a>
            )}
            <p className="text-xs text-espresso-500">
              Already paid? Close this window to return to the menu.
            </p>
            <button
              onClick={handleClose}
              className="mt-2 w-full rounded-xl border border-cream-300 bg-cream-100 px-6 py-3 font-semibold text-espresso-800 transition hover:bg-cream-200"
            >
              I've paid — back to menu
            </button>
          </div>
        ) : (
          <div className="flex max-h-[80vh] flex-col">
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="mb-4 space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-espresso-800">
                      <span className="font-semibold">{item.quantity}×</span>{' '}
                      {item.name}
                      {item.flavor && (
                        <span className="text-espresso-500"> · {item.flavor}</span>
                      )}
                      <span className="text-espresso-500">
                        {' '}
                        · {item.sizeLabel} · {milkLabel(item.milk)}
                      </span>
                    </span>
                    <span className="font-semibold text-espresso-950">
                      {formatPrice(item.priceCents * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mb-4 flex items-center justify-between border-t border-cream-200 pt-3">
                <span className="font-semibold text-espresso-800">Total</span>
                <span className="font-serif text-xl font-bold text-espresso-950">
                  {formatPrice(totalCents)}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-espresso-600">
                    Name (optional)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="For pickup"
                    className="w-full rounded-xl border border-cream-300 bg-cream-100 px-4 py-2.5 text-espresso-950 placeholder:text-espresso-400 focus:border-caramel-500 focus:outline-none focus:ring-1 focus:ring-caramel-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-espresso-600">
                    Phone (optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="In case we need to reach you"
                    className="w-full rounded-xl border border-cream-300 bg-cream-100 px-4 py-2.5 text-espresso-950 placeholder:text-espresso-400 focus:border-caramel-500 focus:outline-none focus:ring-1 focus:ring-caramel-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-espresso-600">
                    Notes (optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    placeholder="Special instructions"
                    className="w-full resize-none rounded-xl border border-cream-300 bg-cream-100 px-4 py-2.5 text-espresso-950 placeholder:text-espresso-400 focus:border-caramel-500 focus:outline-none focus:ring-1 focus:ring-caramel-500"
                  />
                </div>
              </div>

              {status === 'error' && (
                <div className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>

            <div className="border-t border-cream-200 p-5">
              <button
                onClick={handleSubmit}
                disabled={status === 'submitting' || items.length === 0}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-caramel-500 px-6 py-3.5 font-bold text-espresso-950 transition hover:bg-caramel-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Connecting to Square…
                  </>
                ) : (
                  <>
                    <ExternalLink className="h-5 w-5" />
                    Pay with Square · {formatPrice(totalCents)}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
