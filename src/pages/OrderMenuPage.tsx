import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UtensilsCrossed,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Leaf,
  Flame,
  Star,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ShoppingCart,
  ArrowLeft,
} from 'lucide-react';
import { supabase, type Order, type OrderItem } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { useMenu } from '../context/MenuContext';
import { Reveal } from '../components/Reveal';

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

type OrderMenuPageProps = {
  mode: 'dine_in' | 'takeaway';
};

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function OrderMenuPage({ mode }: OrderMenuPageProps) {
  const navigate = useNavigate();
  const { categories, loading: menuLoading } = useMenu();
  const { lines, itemCount, subtotal, taxes, total, add, decrement, remove, clear, qtyOf } =
    useCart();
  const [activeCat, setActiveCat] = useState<string>('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [customer, setCustomer] = useState({ name: '', phone: '', table: '', notes: '' });

  // Set active category when menu loads
  const current = categories.find((c) => c.id === activeCat) ?? categories[0];
  const modeLabel = mode === 'dine_in' ? 'Dine In' : 'Takeaway';
  const ModeIcon = mode === 'dine_in' ? UtensilsCrossed : ShoppingBag;

  // Initialize active category
  if (!activeCat && categories.length > 0) {
    setActiveCat(categories[0].id);
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (lines.length === 0) return;
    setStatus('submitting');
    setErrorMsg('');

    const items: OrderItem[] = lines.map((l) => ({
      name: l.name,
      price: l.price,
      qty: l.qty,
    }));

    const payload: Omit<Order, 'id' | 'status' | 'created_at'> = {
      order_type: mode,
      customer_name: customer.name.trim(),
      customer_phone: customer.phone.trim(),
      table_number: mode === 'dine_in' ? customer.table.trim() || null : null,
      items,
      total,
      notes: customer.notes.trim() || null,
    };

    try {
      const { error } = await supabase.from('orders').insert(payload);
      if (error) throw error;
      setStatus('success');
      clear();
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <section className="bg-cream-50 bg-grain pt-28 pb-24 sm:pt-32 sm:pb-28">
        <div className="mx-auto max-w-lg px-5 sm:px-8">
          <Reveal>
            <div className="rounded-3xl bg-white p-8 text-center shadow-warm ring-1 ring-bark-100">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-leaf-500/15 text-leaf-600">
                <CheckCircle2 className="h-9 w-9" />
              </div>
              <h2 className="mt-5 font-display text-2xl font-bold text-bark-950">Order placed!</h2>
              <p className="mt-2 text-sm leading-relaxed text-bark-600">
                Thank you for your order. Your{' '}
                <span className="font-semibold text-bark-800">{modeLabel.toLowerCase()}</span> order
                totalling{' '}
                <span className="font-sans font-semibold text-bark-800">{inr(total)}</span> has been
                received. Our kitchen will start preparing it right away and we'll call you to
                confirm.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  onClick={() => navigate('/order')}
                  className="rounded-full bg-spice-500 px-6 py-3 text-sm font-semibold text-cream-50 shadow-warm transition-colors hover:bg-spice-600"
                >
                  Place another order
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="rounded-full border border-bark-200 px-6 py-3 text-sm font-semibold text-bark-700 transition-colors hover:bg-bark-50"
                >
                  Back to home
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-cream-50 bg-grain pt-28 pb-24 sm:pt-32 sm:pb-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-spice-600">
            Order Now
          </span>
          <h1 className="mt-3 font-display text-4xl font-bold text-bark-950 sm:text-5xl">
            Build your order
          </h1>
          <p className="mt-4 text-base leading-relaxed text-bark-700">
            {mode === 'dine_in'
              ? 'Dine In — add dishes and we will bring them to your table.'
              : 'Takeaway — add dishes and pick them up ready to go.'}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Menu + cart builder */}
          <div>
            <div className="mb-6 flex items-center justify-between">
              <button
                onClick={() => navigate('/order')}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-bark-600 transition-colors hover:text-spice-600"
              >
                <ArrowLeft className="h-4 w-4" />
                Change dining option
              </button>
              <span className="inline-flex items-center gap-2 rounded-full bg-spice-50 px-3 py-1 text-xs font-semibold text-spice-700">
                <ModeIcon className="h-3.5 w-3.5" /> {modeLabel}
              </span>
            </div>

            {/* Category tabs */}
            <div className="scrollbar-hide -mx-5 flex justify-start gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0">
              {categories.map((cat) => {
                const isActive = cat.id === activeCat;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCat(cat.id)}
                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
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

            {/* Items */}
            {menuLoading ? (
              <div className="mt-6 flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-spice-500" />
              </div>
            ) : (
              <div key={current?.id ?? 'empty'} className="mt-6 grid gap-5 sm:grid-cols-2">
                {current?.items.map((item, i) => {
                  const inCart = qtyOf(item.name);
                  return (
                    <Reveal
                      key={item.id}
                      delay={i * 60}
                      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-bark-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-warm"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
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
                          <h3 className="font-display text-lg font-bold leading-tight text-bark-950">
                            {item.name}
                          </h3>
                          <span className="shrink-0 font-sans text-base font-bold text-spice-700">
                            {inr(item.price)}
                          </span>
                        </div>
                        <p className="mt-1.5 flex-1 text-sm leading-relaxed text-bark-600">
                          {item.description}
                        </p>
                        {item.tags && item.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
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

                      {/* Add to cart / qty stepper */}
                      <div className="mt-4">
                        {inCart === 0 ? (
                          <button
                            onClick={() => add(item)}
                            className="flex w-full items-center justify-center gap-2 rounded-full bg-spice-500 px-4 py-2.5 text-sm font-semibold text-cream-50 shadow-warm transition-all duration-300 hover:bg-spice-600 hover:-translate-y-0.5"
                          >
                            <Plus className="h-4 w-4" />
                            Add to Cart
                          </button>
                        ) : (
                          <div className="flex items-center justify-between rounded-full bg-spice-50 p-1 ring-1 ring-spice-200">
                            <button
                              onClick={() => decrement(item.name)}
                              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-spice-700 shadow-sm transition-colors hover:bg-spice-100"
                              aria-label={`Remove one ${item.name}`}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="font-sans text-sm font-bold text-spice-700">
                              {inCart} in cart
                            </span>
                            <button
                              onClick={() => add(item)}
                              className="flex h-9 w-9 items-center justify-center rounded-full bg-spice-500 text-cream-50 shadow-sm transition-colors hover:bg-spice-600"
                              aria-label={`Add one more ${item.name}`}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
            )}
          </div>

          {/* Cart summary */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-3xl bg-white shadow-warm ring-1 ring-bark-200">
              <div className="flex items-center justify-between bg-bark-950 px-5 py-4 text-cream-50">
                <h2 className="flex items-center gap-2 font-display text-lg font-bold">
                  <ShoppingCart className="h-5 w-5 text-spice-300" />
                  Your Cart
                </h2>
                <span className="rounded-full bg-spice-500 px-2.5 py-0.5 text-xs font-bold text-cream-50">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </span>
              </div>

              <div className="p-5">
                {lines.length === 0 ? (
                  <div className="flex flex-col items-center gap-3 py-10 text-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cream-100 text-bark-400">
                      <ShoppingCart className="h-7 w-7" />
                    </span>
                    <p className="text-sm text-bark-600">
                      Your cart is empty. Add some dishes to get started!
                    </p>
                  </div>
                ) : (
                  <>
                    <ul className="space-y-3">
                      {lines.map((line) => (
                        <li
                          key={line.name}
                          className="flex items-start justify-between gap-3 border-b border-bark-100 pb-3 last:border-0 last:pb-0"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-bark-900">{line.name}</p>
                            <p className="mt-0.5 text-xs text-bark-500">
                              {inr(line.price)} × {line.qty}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-sans text-sm font-bold text-bark-900">
                              {inr(line.price * line.qty)}
                            </span>
                            <button
                              onClick={() => remove(line.name)}
                              className="flex h-7 w-7 items-center justify-center rounded-full text-bark-400 transition-colors hover:bg-red-50 hover:text-red-500"
                              aria-label={`Remove ${line.name} from cart`}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>

                    {/* Totals */}
                    <div className="mt-4 space-y-1.5 border-t border-bark-100 pt-4 text-sm">
                      <div className="flex justify-between text-bark-600">
                        <span>Subtotal</span>
                        <span className="font-sans font-medium">{inr(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-bark-600">
                        <span>Taxes & charges (5%)</span>
                        <span className="font-sans font-medium">{inr(taxes)}</span>
                      </div>
                      <div className="flex justify-between border-t border-bark-100 pt-2 text-base font-bold text-bark-950">
                        <span>Total</span>
                        <span className="font-sans">{inr(total)}</span>
                      </div>
                    </div>

                    <button
                      onClick={clear}
                      className="mt-3 w-full text-center text-xs font-medium text-bark-500 transition-colors hover:text-red-500"
                    >
                      Clear cart
                    </button>
                  </>
                )}

                {/* Customer details form */}
                {lines.length > 0 && (
                  <form
                    onSubmit={handleSubmit}
                    className="mt-5 space-y-3 border-t border-bark-100 pt-5"
                  >
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      value={customer.name}
                      onChange={(e) => setCustomer((c) => ({ ...c, name: e.target.value }))}
                      className="input"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Phone number"
                      value={customer.phone}
                      onChange={(e) => setCustomer((c) => ({ ...c, phone: e.target.value }))}
                      className="input"
                    />
                    {mode === 'dine_in' && (
                      <input
                        type="text"
                        placeholder="Table number (e.g. T-12)"
                        value={customer.table}
                        onChange={(e) => setCustomer((c) => ({ ...c, table: e.target.value }))}
                        className="input"
                      />
                    )}
                    <textarea
                      placeholder="Notes for the kitchen (optional)"
                      rows={2}
                      value={customer.notes}
                      onChange={(e) => setCustomer((c) => ({ ...c, notes: e.target.value }))}
                      className="input resize-none"
                    />

                    {status === 'error' && (
                      <div className="flex items-start gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-700 ring-1 ring-red-200">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-spice-500 px-6 py-3.5 text-sm font-semibold text-cream-50 shadow-warm transition-all duration-300 hover:bg-spice-600 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {status === 'submitting' ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Placing order...
                        </>
                      ) : (
                        <>Place order · {inr(total)}</>
                      )}
                    </button>
                    <p className="text-center text-xs text-bark-500">
                      Pay at the counter. We'll confirm your order by phone.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
