export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-espresso-950 text-cream-100"
    >
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-caramel-600 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-espresso-700 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="max-w-2xl">
          <span className="inline-block rounded-full border border-cream-400/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-cream-300">
            Neighborhood Coffee
          </span>
          <h1 className="mt-5 font-serif text-4xl font-bold leading-tight sm:text-6xl">
            Coffee that brings us together.
          </h1>
          <p className="mt-4 max-w-xl text-base text-cream-200/90 sm:text-lg">
            Order ahead from the Common Grounds menu — pick your milk, choose
            how many, and we'll have it ready for pickup.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#menu"
              className="inline-flex items-center justify-center rounded-xl bg-cream-100 px-6 py-3 font-semibold text-espresso-950 transition hover:bg-cream-50 active:scale-95"
            >
              Order Now
            </a>
            <a
              href="#about"
              className="inline-flex items-center justify-center rounded-xl border border-cream-400/40 px-6 py-3 font-semibold text-cream-100 transition hover:bg-espresso-900"
            >
              Our Story
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
