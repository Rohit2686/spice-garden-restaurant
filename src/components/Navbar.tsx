import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Flame } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

const sectionLinks = [
  { href: '/#about', label: 'About' },
  { href: '/#gallery', label: 'Gallery' },
  { href: '/#contact', label: 'Contact' },
];

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { openBooking } = useBooking();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const goSection = (href: string) => {
    setOpen(false);
    if (location.pathname !== '/') {
      navigate(href);
    } else {
      const id = href.split('#')[1];
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const goOrder = () => {
    setOpen(false);
    navigate('/order');
  };

  const goHome = () => {
    setOpen(false);
    navigate('/');
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-bark-950/95 backdrop-blur-md shadow-warm'
          : 'bg-gradient-to-b from-bark-950/70 to-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <button onClick={goHome} className="group flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-spice-500 text-cream-50 shadow-warm transition-transform group-hover:scale-110">
            <Flame className="h-5 w-5" />
          </span>
          <span className="flex flex-col leading-none text-left">
            <span className="font-display text-xl font-bold tracking-wide text-cream-50">
              Spice Garden
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-spice-300">
              Indian Cuisine
            </span>
          </span>
        </button>

        <ul className="hidden items-center gap-8 md:flex">
          <li>
            <button
              onClick={goHome}
              className="group relative text-sm font-medium text-cream-100/90 transition-colors hover:text-cream-50"
            >
              Home
              <span className="absolute -bottom-1.5 left-0 h-0.5 w-0 bg-spice-400 transition-all duration-300 group-hover:w-full" />
            </button>
          </li>
          <li>
            <button
              onClick={goOrder}
              className="group relative text-sm font-medium text-cream-100/90 transition-colors hover:text-cream-50"
            >
              Order Now
              <span className="absolute -bottom-1.5 left-0 h-0.5 w-0 bg-spice-400 transition-all duration-300 group-hover:w-full" />
            </button>
          </li>
          {sectionLinks.map((l) => (
            <li key={l.href}>
              <button
                onClick={() => goSection(l.href)}
                className="group relative text-sm font-medium text-cream-100/90 transition-colors hover:text-cream-50"
              >
                {l.label}
                <span className="absolute -bottom-1.5 left-0 h-0.5 w-0 bg-spice-400 transition-all duration-300 group-hover:w-full" />
              </button>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <button
            onClick={openBooking}
            className="rounded-full bg-spice-500 px-6 py-2.5 text-sm font-semibold text-cream-50 shadow-warm transition-all duration-300 hover:bg-spice-600 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          >
            Book a Table
          </button>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-cream-50 transition-colors hover:bg-white/10 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden bg-bark-950/98 backdrop-blur-md transition-all duration-300 ${
          open ? 'max-h-96 border-t border-bark-800' : 'max-h-0'
        }`}
      >
        <ul className="flex flex-col gap-1 px-5 py-4">
          <li>
            <button
              onClick={goHome}
              className="block w-full rounded-lg px-4 py-3 text-left text-base font-medium text-cream-100 transition-colors hover:bg-spice-500/15 hover:text-cream-50"
            >
              Home
            </button>
          </li>
          <li>
            <button
              onClick={goOrder}
              className="block w-full rounded-lg px-4 py-3 text-left text-base font-medium text-cream-100 transition-colors hover:bg-spice-500/15 hover:text-cream-50"
            >
              Order Now
            </button>
          </li>
          {sectionLinks.map((l) => (
            <li key={l.href}>
              <button
                onClick={() => goSection(l.href)}
                className="block w-full rounded-lg px-4 py-3 text-left text-base font-medium text-cream-100 transition-colors hover:bg-spice-500/15 hover:text-cream-50"
              >
                {l.label}
              </button>
            </li>
          ))}
          <li className="mt-2">
            <button
              onClick={() => {
                setOpen(false);
                openBooking();
              }}
              className="w-full rounded-full bg-spice-500 px-6 py-3 text-base font-semibold text-cream-50 shadow-warm transition-colors hover:bg-spice-600"
            >
              Book a Table
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
}
