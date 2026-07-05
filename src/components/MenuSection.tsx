import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Flame, Star, Loader2 } from 'lucide-react';
import { useMenu } from '../context/MenuContext';
import { Reveal } from './Reveal';

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

type MenuSectionProps = {
  showPrices?: boolean;
};

export function MenuSection({ showPrices = false }: MenuSectionProps) {
  const navigate = useNavigate();
  const { categories, loading } = useMenu();
  const [active, setActive] = useState<string>('');

  // Initialize active category when categories load
  useEffect(() => {
    if (!active && categories.length > 0) {
      setActive(categories[0].id);
    }
  }, [active, categories]);

  const current = categories.find((c) => c.id === active) ?? categories[0];

  return (
    <section id="menu" className="relative bg-cream-50 bg-grain py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-spice-600">
            Our Menu
          </span>
          <h2 className="mt-3 font-display text-4xl font-bold text-bark-950 sm:text-5xl">
            Crafted with authentic spices
          </h2>
          <p className="mt-4 text-base leading-relaxed text-bark-700">
            Every plate celebrates India's regional kitchens — from street-side chaat to royal
            dum biryani. Browse by category and find your next favourite.
          </p>
        </Reveal>

        {/* Category tabs */}
        <Reveal delay={100} className="mt-12">
          <div className="scrollbar-hide -mx-5 flex justify-start gap-2 overflow-x-auto px-5 pb-2 sm:justify-center sm:overflow-visible">
            {categories.map((cat) => {
              const isActive = cat.id === active;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActive(cat.id)}
                  className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-spice-500 text-cream-50 shadow-warm'
                      : 'bg-white text-bark-700 ring-1 ring-bark-200 hover:bg-spice-50 hover:text-spice-700'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Category blurb */}
        {current && (
          <Reveal key={current.id} className="mt-8 text-center">
            <p className="mx-auto max-w-xl text-sm italic text-bark-600">{current.blurb}</p>
          </Reveal>
        )}

        {/* Items */}
        {loading ? (
          <div className="mt-10 flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-spice-500" />
          </div>
        ) : (
          <div key={current?.id ?? 'empty'} className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {current?.items.map((item, i) => (
              <Reveal
                key={item.id}
                delay={i * 80}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-bark-100 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-warm"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bark-950/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  {item.is_popular && (
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-saffron-500 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-bark-950 shadow">
                      <Star className="h-3 w-3 fill-current" />
                      Popular
                    </span>
                  )}
                  {item.is_veg && (
                    <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-leaf-500 text-cream-50 shadow">
                      <Leaf className="h-4 w-4" />
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-xl font-bold text-bark-950">{item.name}</h3>
                    {showPrices && (
                      <span className="shrink-0 rounded-lg bg-spice-50 px-2.5 py-1 font-sans text-base font-bold text-spice-700">
                        {inr(item.price)}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-bark-600">
                    {item.description}
                  </p>
                  {item.tags && item.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {item.tags.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center gap-1 rounded-full bg-cream-100 px-2.5 py-0.5 text-[11px] font-medium text-bark-700"
                        >
                          {t === 'Chef Special' && <Flame className="h-3 w-3 text-spice-500" />}
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        )}

        <Reveal className="mt-12 text-center">
          <p className="text-sm text-bark-600">
            A glimpse of what we serve. Tap{' '}
            <button
              onClick={() => navigate('/order')}
              className="font-semibold text-spice-600 hover:underline"
            >
              Order Now
            </button>{' '}
            to see prices and place an order.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
