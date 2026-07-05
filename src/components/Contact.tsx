import { MapPin, Phone, Clock, MessageCircle, Map } from 'lucide-react';
import { restaurantInfo } from '../data/menu';
import { Reveal } from './Reveal';
import { useBooking } from '../context/BookingContext';

const whatsappUrl = `https://wa.me/${restaurantInfo.whatsapp}?text=${encodeURIComponent(
  `Hello ${restaurantInfo.name}, I'd like to know more about your menu and bookings.`,
)}`;

export function Contact() {
  const { openBooking } = useBooking();
  return (
    <section id="contact" className="bg-cream-50 bg-grain py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-spice-600">
            Visit Us
          </span>
          <h2 className="mt-3 font-display text-4xl font-bold text-bark-950 sm:text-5xl">
            Come break bread with us
          </h2>
          <p className="mt-4 text-base leading-relaxed text-bark-700">
            Walk in, or reserve your table in advance — we can't wait to host you.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* Info cards */}
          <Reveal className="flex flex-col gap-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoCard icon={MapPin} title="Find us">
                <p className="text-sm leading-relaxed text-bark-700">{restaurantInfo.address}</p>
              </InfoCard>
              <InfoCard icon={Phone} title="Call us">
                <a
                  href={`tel:${restaurantInfo.phone.replace(/\s/g, '')}`}
                  className="text-sm leading-relaxed text-bark-700 transition-colors hover:text-spice-600"
                >
                  {restaurantInfo.phone}
                </a>
                <a
                  href={`mailto:${restaurantInfo.email}`}
                  className="mt-1 block text-sm leading-relaxed text-bark-700 transition-colors hover:text-spice-600"
                >
                  {restaurantInfo.email}
                </a>
              </InfoCard>
            </div>

            <InfoCard icon={Clock} title="Opening hours">
              <ul className="space-y-2">
                {restaurantInfo.hours.map((h) => (
                  <li
                    key={h.day}
                    className="flex items-center justify-between gap-4 border-b border-bark-100 pb-2 text-sm last:border-0 last:pb-0"
                  >
                    <span className="font-medium text-bark-800">{h.day}</span>
                    <span className="text-bark-600">{h.time}</span>
                  </li>
                ))}
              </ul>
            </InfoCard>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={openBooking}
                className="flex-1 rounded-full bg-spice-500 px-6 py-3.5 text-sm font-semibold text-cream-50 shadow-warm transition-all duration-300 hover:bg-spice-600 hover:-translate-y-0.5"
              >
                Reserve a table
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-leaf-500 px-6 py-3.5 text-sm font-semibold text-cream-50 shadow-warm transition-all duration-300 hover:bg-leaf-600 hover:-translate-y-0.5"
              >
                <MessageCircle className="h-4 w-4" />
                Chat on WhatsApp
              </a>
            </div>
          </Reveal>

          {/* Map placeholder */}
          <Reveal
            delay={120}
            className="relative overflow-hidden rounded-3xl shadow-warm ring-1 ring-bark-200"
          >
            <div className="flex min-h-[360px] flex-col items-center justify-center gap-4 bg-spice-100 bg-grain p-8 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-spice-500 text-cream-50 shadow-warm">
                <Map className="h-8 w-8" />
              </span>
              <div>
                <p className="font-display text-lg font-bold text-bark-950">
                  Your Google Maps location will appear here
                </p>
                <p className="mt-1 max-w-xs text-sm text-bark-600">
                  This is a sample demo website. Connect a Google Maps API key to display the live
                  location of {restaurantInfo.name}.
                </p>
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-bark-500">
                <MapPin className="h-3.5 w-3.5 text-spice-500" />
                {restaurantInfo.address}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function InfoCard({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof MapPin;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-bark-100 transition-shadow hover:shadow-warm">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-spice-50 text-spice-600">
          <Icon className="h-5 w-5" />
        </span>
        <h3 className="font-display text-lg font-bold text-bark-950">{title}</h3>
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}
