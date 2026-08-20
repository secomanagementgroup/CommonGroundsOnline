import { Coffee, MapPin, Clock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-espresso-950 text-cream-200">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div id="about" className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <Coffee className="h-5 w-5 text-caramel-500" />
              <span className="font-serif text-lg font-bold text-cream-100">
                Common Grounds
              </span>
            </div>
            <p className="mt-3 text-sm text-cream-300/80">
              A neighborhood coffee company built on the idea that the best
              conversations start over a great cup.
            </p>
          </div>
          <div id="visit">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-cream-300">
              <MapPin className="h-4 w-4" /> Visit
            </h3>
            <p className="mt-3 text-sm text-cream-300/80">
              8637 Cava Dr<br />
              Rancho Cucamonga, CA 91730
            </p>
          </div>
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-cream-300">
              <Clock className="h-4 w-4" /> Hours
            </h3>
            <p className="mt-3 text-sm text-cream-300/80">
              Mon – Fri · 6am – 6pm<br />
              Sat – Sun · 7am – 5pm
            </p>
          </div>
        </div>
        <div className="mt-10 border-t border-espresso-800 pt-6 text-xs text-cream-400/70">
          © {new Date().getFullYear()} Common Grounds Coffee Co. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
