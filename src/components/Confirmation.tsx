import { useEffect, useState } from 'react';
import { CheckCircle2, Coffee } from 'lucide-react';

interface ConfirmationProps {
  onContinue: () => void;
}

export function Confirmation({ onContinue }: ConfirmationProps) {
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('order_id');
    if (id) setOrderId(id);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-50 px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-espresso-950">
          Order confirmed!
        </h1>
        <p className="mt-3 text-espresso-700/80">
          Thank you for your order. We've received your payment and your drinks
          will be ready for pickup shortly.
        </p>
        {orderId && (
          <p className="mt-4 rounded-xl bg-cream-100 px-4 py-2.5 text-sm text-espresso-600">
            Order reference: <span className="font-semibold text-espresso-800">{orderId}</span>
          </p>
        )}
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-espresso-500">
          <Coffee className="h-4 w-4" />
          <span>Common Grounds Coffee Co.</span>
        </div>
        <button
          onClick={onContinue}
          className="mt-8 w-full rounded-xl bg-espresso-900 px-6 py-3.5 font-semibold text-cream-100 transition hover:bg-espresso-950 active:scale-[0.98]"
        >
          Back to menu
        </button>
      </div>
    </div>
  );
}
