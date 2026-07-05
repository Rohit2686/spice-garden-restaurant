import { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { galleryImages } from '../data/menu';
import { Reveal } from './Reveal';

export function Gallery() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight') setLightbox((i) => (i === null ? i : (i + 1) % galleryImages.length));
      if (e.key === 'ArrowLeft')
        setLightbox((i) => (i === null ? i : (i - 1 + galleryImages.length) % galleryImages.length));
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightbox]);

  // Bento-style layout: first image large, rest fill in
  return (
    <section id="gallery" className="bg-cream-100 bg-grain py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-spice-600">
            <Camera className="h-4 w-4" />
            Gallery
          </span>
          <h2 className="mt-3 font-display text-4xl font-bold text-bark-950 sm:text-5xl">
            A feast for the eyes
          </h2>
          <p className="mt-4 text-base leading-relaxed text-bark-700">
            A glimpse of what awaits — sizzling tandoor plates, fragrant biryanis, and the warmth
            of our dining room.
          </p>
        </Reveal>

        <div className="mt-12 grid auto-rows-[180px] grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:auto-rows-[220px]">
          {galleryImages.map((img, i) => {
            const span =
              i === 0
                ? 'col-span-2 row-span-2'
                : i === 3
                  ? 'md:col-span-2 md:row-span-1'
                  : i === 5
                    ? 'md:row-span-2'
                    : '';
            return (
              <Reveal
                key={img.src}
                delay={(i % 4) * 80}
                className={`group relative cursor-pointer overflow-hidden rounded-2xl shadow-card ${span}`}
              >
                <button
                  onClick={() => setLightbox(i)}
                  className="block h-full w-full"
                  aria-label={`View image: ${img.alt}`}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bark-950/70 via-bark-950/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute bottom-0 left-0 right-0 translate-y-2 p-4 text-left opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="text-sm font-medium text-cream-50">{img.alt}</p>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-bark-950/95 p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-cream-50 transition-colors hover:bg-white/20"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
          <button
            className="absolute left-2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-cream-50 transition-colors hover:bg-white/20 sm:left-6"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((i) => (i === null ? i : (i - 1 + galleryImages.length) % galleryImages.length));
            }}
            aria-label="Previous"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
          <figure
            className="max-h-[85vh] max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={galleryImages[lightbox].src.replace('w=1200', 'w=1600')}
              alt={galleryImages[lightbox].alt}
              className="max-h-[78vh] w-auto rounded-2xl object-contain shadow-warm"
            />
            <figcaption className="mt-4 text-center text-sm text-cream-100/80">
              {galleryImages[lightbox].alt} · {lightbox + 1} / {galleryImages.length}
            </figcaption>
          </figure>
          <button
            className="absolute right-2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-cream-50 transition-colors hover:bg-white/20 sm:right-6"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((i) => (i === null ? i : (i + 1) % galleryImages.length));
            }}
            aria-label="Next"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        </div>
      )}
    </section>
  );
}
