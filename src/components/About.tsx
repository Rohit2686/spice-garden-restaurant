import { Quote, Award, HeartHandshake, Sprout } from 'lucide-react';
import { aboutImage, aboutImageSecondary } from '../data/menu';
import { Reveal } from './Reveal';

const values = [
  {
    icon: Sprout,
    title: 'Fresh, every day',
    text: 'We grind our own spice blends each morning and source produce from local farms.',
  },
  {
    icon: HeartHandshake,
    title: 'Family recipes',
    text: 'Dishes passed down three generations, cooked exactly as they are at home.',
  },
  {
    icon: Award,
    title: 'Award-winning',
    text: 'Recognised by the Times Food Awards for Best North Indian cuisine, 2024.',
  },
];

export function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-bark-950 py-24 text-cream-50 sm:py-28">
      {/* Decorative glow */}
      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-spice-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-saffron-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Images */}
          <Reveal className="relative">
            <div className="relative overflow-hidden rounded-3xl shadow-warm">
              <img
                src={aboutImage}
                alt="Freshly prepared Indian bread at Spice Garden"
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bark-950/50 to-transparent" />
            </div>
            <div className="absolute -bottom-8 -right-4 hidden w-44 overflow-hidden rounded-2xl border-4 border-bark-950 shadow-warm sm:block">
              <img
                src={aboutImageSecondary}
                alt="Chef preparing food"
                loading="lazy"
                className="aspect-square w-full object-cover"
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -left-4 top-8 flex items-center gap-3 rounded-2xl bg-cream-50 px-4 py-3 text-bark-950 shadow-warm">
              <span className="font-display text-3xl font-bold text-spice-600">25</span>
              <span className="text-xs font-medium uppercase leading-tight tracking-wide text-bark-700">
                Years of
                <br />
                cooking
              </span>
            </div>
          </Reveal>

          {/* Text */}
          <div>
            <Reveal>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-spice-300">
                Our Story
              </span>
              <h2 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">
                A family kitchen that became a city favourite
              </h2>
            </Reveal>

            <Reveal delay={100}>
              <div className="mt-6 rounded-2xl border-l-2 border-spice-400 bg-white/5 p-5">
                <Quote className="h-6 w-6 text-spice-400" />
                <p className="mt-2 font-display text-lg italic leading-relaxed text-cream-100">
                  "We don't just serve food. We serve the warmth of a home you've never been to,
                  but somehow remember."
                </p>
                <p className="mt-3 text-sm text-spice-300">— Chef & Founder, Arjun Mehra</p>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <p className="mt-6 text-base leading-relaxed text-cream-100/80">
                Spice Garden began in 1999 as a tiny six-table eatery run by Arjun and his mother,
                Sarla. She brought her recipes from a village near Amritsar; he brought a dream of
                sharing them with the world. Today, our kitchen still grinds its own garam masala
                by hand, still slow-cooks dal makhani overnight, and still treats every guest like
                family walking through a home door.
              </p>
            </Reveal>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {values.map((v, i) => (
                <Reveal
                  key={v.title}
                  delay={200 + i * 80}
                  className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 transition-colors hover:bg-white/10"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-spice-500/20 text-spice-300">
                    <v.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-3 font-display text-base font-bold text-cream-50">
                    {v.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-cream-100/70">{v.text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
