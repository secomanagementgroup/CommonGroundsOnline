import { Coffee, Mail, Phone, Clock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-espresso-950 text-cream-200">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
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
            <h3 className="flex items-center gap-2 text-sm font-semibold tracking-[0.2em] text-cream-300">
              <Mail className="h-4 w-4" /> Contact us
            </h3>
            <p className="mt-3 text-sm text-cream-300/80">
              <a
                href="mailto:commongrounds.cafeco@gmail.com"
                className="transition-colors hover:text-cream-100"
              >
                commongrounds.cafeco@gmail.com
              </a>
              <br />
              <a
                href="tel:+19098512178"
                className="transition-colors hover:text-cream-100"
              >
                (909) 851-2178
              </a>
            </p>
          </div>
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-cream-300">
              <Clock className="h-4 w-4" /> Hours
            </h3>
            <p className="mt-3 text-sm text-cream-300/80">
              We drink a lot of coffee, so we'll be ready when you need us
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
