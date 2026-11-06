import { useCallback, useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import BookingModal from '../components/BookingModal';
import { BookingModalContext } from '../context/bookingModal';

export default function MainLayout() {
  // Único lugar donde vive el estado del modal de reservas.
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const openBooking = useCallback(() => setIsBookingOpen(true), []);
  const closeBooking = useCallback(() => setIsBookingOpen(false), []);
  const bookingApi = useMemo(() => ({ openBooking, closeBooking }), [openBooking, closeBooking]);

  return (
    <BookingModalContext.Provider value={bookingApi}>
      {/* Respeta "reducir movimiento" del sistema: sin desplazamientos, solo fundido. */}
      <MotionConfig reducedMotion="user">
      <div className="min-h-screen gradient-lilac text-plum-800 font-sans antialiased overflow-x-hidden">
        <Navbar onReserve={openBooking} />
        <main>
          <Outlet />
        </main>
        <Footer />
        <BackToTop />
        <BookingModal isOpen={isBookingOpen} onClose={closeBooking} />
      </div>
      </MotionConfig>
    </BookingModalContext.Provider>
  );
}
