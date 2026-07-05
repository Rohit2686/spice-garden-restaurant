import { useNavigate } from 'react-router-dom';
import { UtensilsCrossed, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Reveal } from '../components/Reveal';

export function OrderChoicePage() {
  const navigate = useNavigate();

  const options = [
    {
      path: '/order/dine-in' as const,
      title: 'Dine In',
      desc: 'Sit back and let us serve your meal at the table.',
      icon: UtensilsCrossed,
      points: ['Table service', 'Fresh & hot', 'Pay after your meal'],
    },
    {
      path: '/order/takeaway' as const,
      title: 'Takeaway',
      desc: 'Order ahead and pick it up ready to go.',
      icon: ShoppingBag,
      points: ['Ready when you arrive', 'Packed for travel', 'Skip the wait'],
    },
  ];

  return (
    <section className="bg-cream-50 bg-grain pt-28 pb-24 sm:pt-32 sm:pb-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-spice-600">
            Order Now
          </span>
          <h1 className="mt-3 font-display text-4xl font-bold text-bark-950 sm:text-5xl">
            How would you like to enjoy your meal?
          </h1>
          <p className="mt-4 text-base leading-relaxed text-bark-700">
            Choose a dining option to start adding dishes to your cart.
          </p>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
          {options.map((opt, i) => (
            <Reveal key={opt.path} delay={i * 100}>
              <button
                onClick={() => navigate(opt.path)}
                className="group flex h-full w-full flex-col items-start rounded-3xl bg-white p-8 text-left shadow-card ring-1 ring-bark-100 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-warm hover:ring-spice-300"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-spice-50 text-spice-600 transition-all duration-300 group-hover:bg-spice-500 group-hover:text-cream-50">
                  <opt.icon className="h-8 w-8" />
                </span>
                <h2 className="mt-5 font-display text-2xl font-bold text-bark-950">{opt.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-bark-600">{opt.desc}</p>
                <ul className="mt-5 space-y-2">
                  {opt.points.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-sm text-bark-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-spice-500" />
                      {p}
                    </li>
                  ))}
                </ul>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-spice-600 transition-all group-hover:gap-2.5">
                  Select
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </span>
              </button>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-bark-600 transition-colors hover:text-spice-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </button>
        </div>
      </div>
    </section>
  );
}
