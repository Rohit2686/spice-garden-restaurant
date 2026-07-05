import { useNavigate } from 'react-router-dom';
import { ChefHat } from 'lucide-react';

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <section className="flex min-h-screen items-center justify-center bg-cream-50 bg-grain px-5 pt-20">
      <div className="text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-spice-50 text-spice-600">
          <ChefHat className="h-8 w-8" />
        </span>
        <h1 className="mt-6 font-display text-6xl font-bold text-bark-950">404</h1>
        <p className="mt-2 text-base text-bark-600">
          This page is off the menu. Let's get you back to something delicious.
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 rounded-full bg-spice-500 px-6 py-3 text-sm font-semibold text-cream-50 shadow-warm transition-colors hover:bg-spice-600"
        >
          Back to home
        </button>
      </div>
    </section>
  );
}
