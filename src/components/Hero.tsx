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
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="max-w-2xl">
          <h1 className="font-serif text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl">
            Let's find some
            <br />
            <span className="text-caramel-400">Common Grounds.</span>
          </h1>
          <div className="mt-6 space-y-1.5">
            <p className="text-lg font-medium text-cream-200/90 sm:text-xl">
              Coffee made from scratch.
            </p>
            <p className="text-lg font-medium text-cream-200/90 sm:text-xl">
              Moments made together.
            </p>
          </div>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
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
