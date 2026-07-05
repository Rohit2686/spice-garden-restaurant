import { useNavigate, useLocation } from 'react-router-dom';
import { Flame, MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';
import { restaurantInfo } from '../data/menu';

const sectionLinks = [
  { id: 'about', label: 'About' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'contact', label: 'Contact' },
];

export function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const goSection = (id: string) => {
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-bark-950 text-cream-100">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-spice-500 text-cream-50">
                <Flame className="h-5 w-5" />
              </span>
              <span className="font-display text-xl font-bold text-cream-50">
                {restaurantInfo.name}
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-cream-100/70">
              Authentic Indian cuisine, crafted with hand-ground spices and three generations of
              family recipes.
            </p>
            <div className="mt-5 flex gap-3">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-cream-100/80 transition-all hover:bg-spice-500 hover:text-cream-50"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-cream-50">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <button
                  onClick={() => navigate('/')}
                  className="text-sm text-cream-100/70 transition-colors hover:text-spice-300"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/order')}
                  className="text-sm text-cream-100/70 transition-colors hover:text-spice-300"
                >
                  Order Now
                </button>
              </li>
              {sectionLinks.map((l) => (
                <li key={l.id}>
                  <button
                    onClick={() => goSection(l.id)}
                    className="text-sm text-cream-100/70 transition-colors hover:text-spice-300"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-cream-50">
              Reach us
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-cream-100/70">
              <li className="flex gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-spice-400" />
                <span>{restaurantInfo.address}</span>
              </li>
              <li className="flex gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-spice-400" />
                <a href={`tel:${restaurantInfo.phone.replace(/\s/g, '')}`} className="hover:text-spice-300">
                  {restaurantInfo.phone}
                </a>
              </li>
              <li className="flex gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-spice-400" />
                <a href={`mailto:${restaurantInfo.email}`} className="hover:text-spice-300">
                  {restaurantInfo.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-cream-50">
              Hours
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-cream-100/70">
              {restaurantInfo.hours.map((h) => (
                <li key={h.day}>
                  <span className="block font-medium text-cream-100/90">{h.day}</span>
                  <span className="text-cream-100/60">{h.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-cream-100/50">
            © {new Date().getFullYear()} {restaurantInfo.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <p className="text-xs text-cream-100/50">
              Crafted with love & a lot of spices.
            </p>
            <a
              href="/admin"
              className="text-[10px] text-cream-100/30 transition-colors hover:text-cream-100/50"
            >
              Admin
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
