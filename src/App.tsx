import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { BookingModal } from './components/BookingModal';
import { ScrollToTop } from './components/ScrollToTop';
import { HomePage } from './pages/HomePage';
import { OrderChoicePage } from './pages/OrderChoicePage';
import { OrderMenuPage } from './pages/OrderMenuPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { BookingProvider, useBooking } from './context/BookingContext';
import { CartProvider } from './context/CartContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { MenuProvider } from './context/MenuContext';

function Shell() {
  const { bookingOpen, closeBooking } = useBooking();
  return (
    <MenuProvider>
      <div className="min-h-screen bg-cream-50">
        <ScrollToTop />
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/order" element={<OrderChoicePage />} />
            <Route path="/order/dine-in" element={<OrderMenuPage mode="dine_in" />} />
            <Route path="/order/takeaway" element={<OrderMenuPage mode="takeaway" />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
        <WhatsAppButton />
        <BookingModal open={bookingOpen} onClose={closeBooking} />
      </div>
    </MenuProvider>
  );
}

function AdminShell() {
  return (
    <Routes>
      <Route path="/" element={<AdminLoginPage />} />
      <Route path="/dashboard" element={<AdminDashboardPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BookingProvider>
      <CartProvider>
        <AdminAuthProvider>
          <Routes>
            <Route path="/admin/*" element={<AdminShell />} />
            <Route path="/*" element={<Shell />} />
          </Routes>
        </AdminAuthProvider>
      </CartProvider>
    </BookingProvider>
  );
}
