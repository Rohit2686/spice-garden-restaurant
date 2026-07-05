import { useEffect, useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { restaurantInfo } from '../data/menu';

const whatsappUrl = `https://wa.me/${restaurantInfo.whatsapp}?text=${encodeURIComponent(
  `Hello ${restaurantInfo.name}! I'd like to make a reservation.`,
)}`;

export function WhatsAppButton() {
  const [show, setShow] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => setTooltipOpen(true), 1200);
    const t2 = setTimeout(() => setTooltipOpen(false), 6000);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [show]);

  return (
    <div
      className={`fixed bottom-5 right-5 z-40 flex items-center gap-3 transition-all duration-500 sm:bottom-6 sm:right-6 ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
      }`}
    >
      {tooltipOpen && (
        <div className="relative hidden items-center sm:flex">
          <span className="rounded-2xl bg-white px-4 py-2.5 text-sm font-medium text-bark-800 shadow-warm">
            Chat with us — we reply fast!
          </span>
          <span className="absolute -right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 bg-white" />
          <button
            onClick={() => setTooltipOpen(false)}
            className="ml-1 flex h-6 w-6 items-center justify-center rounded-full text-bark-500 hover:bg-bark-100"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-warm transition-all duration-300 hover:scale-110 sm:h-16 sm:w-16"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-pulse-ring" />
        <MessageCircle className="relative h-7 w-7" />
      </a>
    </div>
  );
}
