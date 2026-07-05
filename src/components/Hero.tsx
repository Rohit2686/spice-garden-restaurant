import { useNavigate } from 'react-router-dom';
import { Star, UtensilsCrossed, ChevronDown } from 'lucide-react';
import { heroImage, restaurantInfo } from '../data/menu';
import { useBooking } from '../context/BookingContext';

export function Hero() {
  const navigate = useNavigate();
  const { openBooking } = useBooking();

  return (
    <section id="home" className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="A spread of authentic Indian dishes"
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bark-950/80 via-bark-950/55 to-bark-950/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-bark-950/70 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-5 pt-28 pb-20 sm:px-8">
        <div className="max-w-2xl">
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-spice-400/40 bg-spice-500/10 px-4 py-1.5 backdrop-blur-sm">
            <span className="flex items-center gap-0.5 text-saffron-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-current" />
              ))}
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-cream-100">
              Rated 4.9 by 2,400+ guests
            </span>
          </div>

          <h1
            className="animate-fade-up mt-6 font-display text-5xl font-bold leading-[1.05] text-cream-50 sm:text-6xl md:text-7xl"
            style={{ animationDelay: '0.1s' }}
          >
            {restaurantInfo.name}
            <span className="mt-3 block font-display text-2xl font-medium italic text-spice-300 sm:text-3xl">
              {restaurantInfo.tagline}
            </span>
          </h1>

          <p
            className="animate-fade-up mt-6 max-w-xl text-base leading-relaxed text-cream-100/85 sm:text-lg"
            style={{ animationDelay: '0.2s' }}
          >
            From the smoky tandoors of Punjab to the fragrant biryanis of Hyderabad — every dish
            at Spice Garden is a journey through India's rich culinary heritage, plated with love.
          </p>

          <div
            className="animate-fade-up mt-9 flex flex-col gap-4 sm:flex-row sm:items-center"
            style={{ animationDelay: '0.3s' }}
          >
            <button
              onClick={openBooking}
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-spice-500 px-8 py-4 text-base font-semibold text-cream-50 shadow-warm transition-all duration-300 hover:bg-spice-600 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
            >
              <UtensilsCrossed className="h-5 w-5 transition-transform group-hover:rotate-12" />
              Book a Table
            </button>
            <button
              onClick={() => navigate('/order')}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-cream-100/30 bg-white/5 px-8 py-4 text-base font-semibold text-cream-50 backdrop-blur-sm transition-all duration-300 hover:border-cream-100/60 hover:bg-white/10"
            >
              Order Now
            </button>
          </div>

          {/* Stats */}
          <div
            className="animate-fade-up mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-cream-100/15 pt-8"
            style={{ animationDelay: '0.4s' }}
          >
            {[
              { value: '25+', label: 'Years of flavour' },
              { value: '80+', label: 'Signature dishes' },
              { value: '100%', label: 'Fresh spices daily' },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-display text-3xl font-bold text-spice-300">{s.value}</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-cream-100/70">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <button
        onClick={() =>
          document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })
        }
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 animate-float-slow text-cream-100/70 transition-colors hover:text-cream-50 sm:block"
        aria-label="Scroll to menu"
      >
        <ChevronDown className="h-7 w-7" />
      </button>
    </section>
  );
}
