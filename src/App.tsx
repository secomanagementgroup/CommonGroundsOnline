import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { MenuSection } from '@/components/MenuSection';
import { Footer } from '@/components/Footer';
import { ProductModal } from '@/components/ProductModal';
import { CartDrawer } from '@/components/CartDrawer';
import { CheckoutModal } from '@/components/CheckoutModal';
import { Confirmation } from '@/components/Confirmation';
import { useCart } from '@/hooks/useCart';
import { useProducts } from '@/hooks/useProducts';
import type { Product } from '@/types';

function App() {
  const cart = useCart();
  const { products } = useProducts();
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('order_id')) {
      setShowConfirmation(true);
    }
  }, []);

  const openCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const completeOrder = () => {
    cart.clear();
    setCheckoutOpen(false);
  };

  const handleContinueShopping = () => {
    setShowConfirmation(false);
    window.history.replaceState({}, '', window.location.pathname);
  };

  if (showConfirmation) {
    return <Confirmation onContinue={handleContinueShopping} />;
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <Header
        cartCount={cart.count}
        cartTotal={cart.totalCents}
        onOpenCart={() => setCartOpen(true)}
      />
      <main>
        <Hero />
        <MenuSection products={products} onSelect={setActiveProduct} />
      </main>
      <Footer />

      <ProductModal
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
        onAddToCart={cart.addItem}
      />
      <CartDrawer
        open={cartOpen}
        items={cart.items}
        totalCents={cart.totalCents}
        onClose={() => setCartOpen(false)}
        onUpdateQuantity={cart.updateQuantity}
        onRemove={cart.removeItem}
        onCheckout={openCheckout}
      />
      <CheckoutModal
        open={checkoutOpen}
        items={cart.items}
        totalCents={cart.totalCents}
        onClose={() => setCheckoutOpen(false)}
        onComplete={completeOrder}
      />
    </div>
  );
}

export default App;
