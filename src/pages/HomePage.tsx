import { Hero } from '../components/Hero';
import { MenuSection } from '../components/MenuSection';
import { About } from '../components/About';
import { Gallery } from '../components/Gallery';
import { Contact } from '../components/Contact';

export function HomePage() {
  return (
    <>
      <Hero />
      <MenuSection />
      <About />
      <Gallery />
      <Contact />
    </>
  );
}
