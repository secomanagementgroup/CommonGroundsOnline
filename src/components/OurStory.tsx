import { Bean, Clock, Sparkles, Droplet } from 'lucide-react';

const pillars = [
  {
    icon: Bean,
    title: 'Fresh Roasted Beans',
    body: 'We start with fresh roasted whole beans, and grind them in house before every brew',
  },
  {
    icon: Clock,
    title: '18-Hour Cold Brew',
    body: 'Ground and steeped cold for 18 hours to pull out a smooth, low-acid finish.',
  },
  {
    icon: Sparkles,
    title: 'Filtration',
    body: 'The beans are vetted, the water is triple filtered, and the finished product is filtered once more before serving.',
  },
  {
    icon: Droplet,
    title: 'Just Add Milk',
    body: 'We know, there are about 50 different “milk” options. We offer Whole Cow Milk and Oat Milk.',
  },
  {
    icon: Sparkles,
    title: 'Home-Made Syrups',
    body: 'Every syrup is made from scratch with ingredients you can pronounce and count on one hand.',
  },
  {
    icon: Droplet,
    title: 'Curated Cream Tops',
    body: 'Our curated cream tops bring it all together with perfectly paired flavor notes.',
  },
];

export function OurStory() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-cream-100 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-caramel-600">
            Our Story
          </span>
          <h2 className="mt-4 font-serif text-3xl font-bold leading-tight text-espresso-950 sm:text-5xl">
            What makes Common Grounds
            <br className="hidden sm:block" /> not so common?
          </h2>
        </div>

        <div className="mt-10 space-y-5 text-center">
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="flex items-start gap-4 rounded-2xl border border-cream-300 bg-cream-50 p-5 shadow-sm transition hover:border-caramel-300 hover:shadow-md"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-caramel-100 text-caramel-600">
                <p.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-espresso-950">
                  {p.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-espresso-700/80">
                  {p.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
