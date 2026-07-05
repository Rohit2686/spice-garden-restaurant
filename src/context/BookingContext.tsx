import { createContext, useContext, useState, type ReactNode } from 'react';

type BookingContextValue = {
  bookingOpen: boolean;
  openBooking: () => void;
  closeBooking: () => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookingOpen, setBookingOpen] = useState(false);
  return (
    <BookingContext.Provider
      value={{
        bookingOpen,
        openBooking: () => setBookingOpen(true),
        closeBooking: () => setBookingOpen(false),
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
}
