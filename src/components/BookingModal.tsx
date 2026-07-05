import { useEffect, useState, type FormEvent } from 'react';
import { X, CalendarDays, Users, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase, type Reservation } from '../lib/supabase';

type BookingModalProps = {
  open: boolean;
  onClose: () => void;
};

const timeSlots = [
  '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '18:30', '19:00', '19:30', '20:00',
  '20:30', '21:00', '21:30',
];

type Status = 'idle' | 'submitting' | 'success' | 'error';

const today = new Date().toISOString().split('T')[0];

export function BookingModal({ open, onClose }: BookingModalProps) {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    guests: 2,
    reservation_date: '',
    reservation_time: '19:00',
    message: '',
  });

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setStatus('idle');
        setErrorMsg('');
      }, 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && status !== 'submitting') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, status]);

  if (!open) return null;

  const update = (field: keyof typeof form, value: string | number) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    const payload: Omit<Reservation, 'id' | 'status' | 'created_at'> = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      guests: Number(form.guests),
      reservation_date: form.reservation_date,
      reservation_time: form.reservation_time,
      message: form.message.trim() || null,
    };

    try {
      const { error } = await supabase.from('reservations').insert(payload);
      if (error) throw error;
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.',
      );
    }
  };

  const reset = () => {
    setForm({
      name: '',
      email: '',
      phone: '',
      guests: 2,
      reservation_date: '',
      reservation_time: '19:00',
      message: '',
    });
    setStatus('idle');
    setErrorMsg('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-bark-950/70 p-0 backdrop-blur-sm animate-fade-in sm:items-center sm:p-4"
      onClick={() => status !== 'submitting' && onClose()}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-t-3xl bg-cream-50 shadow-warm sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-spice-600 px-6 py-5 text-cream-50">
          <button
            onClick={() => status !== 'submitting' && onClose()}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-cream-50 transition-colors hover:bg-white/25"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <h2 className="font-display text-2xl font-bold">Book a Table</h2>
          <p className="mt-1 text-sm text-cream-100/85">
            Reserve your spot — we'll confirm via WhatsApp within the hour.
          </p>
        </div>

        {status === 'success' ? (
          <div className="px-6 py-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-leaf-500/15 text-leaf-600">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <h3 className="mt-5 font-display text-2xl font-bold text-bark-950">
              Reservation received!
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-bark-600">
              Thank you, {form.name.split(' ')[0] || 'guest'}. We've received your request for{' '}
              <span className="font-semibold text-bark-800">{form.guests} guest(s)</span> on{' '}
              <span className="font-semibold text-bark-800">
                {new Date(form.reservation_date).toLocaleDateString('en-IN', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                })}
              </span>{' '}
              at <span className="font-semibold text-bark-800">{form.reservation_time}</span>. Our
              team will reach out shortly to confirm.
            </p>
            <button
              onClick={reset}
              className="mt-6 rounded-full bg-spice-500 px-6 py-3 text-sm font-semibold text-cream-50 shadow-warm transition-colors hover:bg-spice-600"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto px-6 py-6">
            <div className="grid gap-4">
              <Field label="Full name" required>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="input"
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Email" required>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    placeholder="you@example.com"
                    className="input"
                  />
                </Field>
                <Field label="Phone" required>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    placeholder="+91 98765 43210"
                    className="input"
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Date" required icon={CalendarDays}>
                  <input
                    type="date"
                    required
                    min={today}
                    value={form.reservation_date}
                    onChange={(e) => update('reservation_date', e.target.value)}
                    className="input"
                  />
                </Field>
                <Field label="Guests" required icon={Users}>
                  <select
                    value={form.guests}
                    onChange={(e) => update('guests', Number(e.target.value))}
                    className="input"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'guest' : 'guests'}
                      </option>
                    ))}
                    <option value={13}>13+ (large party)</option>
                  </select>
                </Field>
              </div>

              <Field label="Time" required>
                <div className="flex flex-wrap gap-2">
                  {timeSlots.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => update('reservation_time', t)}
                      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                        form.reservation_time === t
                          ? 'bg-spice-500 text-cream-50 shadow'
                          : 'bg-white text-bark-700 ring-1 ring-bark-200 hover:bg-spice-50'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Special requests (optional)">
                <textarea
                  value={form.message}
                  onChange={(e) => update('message', e.target.value)}
                  rows={2}
                  placeholder="Birthday cake, high chair, window seat..."
                  className="input resize-none"
                />
              </Field>

              {status === 'error' && (
                <div className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="mt-2 flex items-center justify-center gap-2 rounded-full bg-spice-500 px-6 py-3.5 text-sm font-semibold text-cream-50 shadow-warm transition-all duration-300 hover:bg-spice-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending request...
                  </>
                ) : (
                  'Confirm reservation'
                )}
              </button>
              <p className="text-center text-xs text-bark-500">
                No payment required — we'll confirm availability before finalising.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  icon: Icon,
  children,
}: {
  label: string;
  required?: boolean;
  icon?: typeof CalendarDays;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-bark-800">
        {Icon && <Icon className="h-3.5 w-3.5 text-spice-500" />}
        {label}
        {required && <span className="text-spice-500">*</span>}
      </span>
      {children}
    </label>
  );
}
