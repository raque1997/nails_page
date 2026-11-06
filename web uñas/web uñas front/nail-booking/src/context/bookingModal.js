import { createContext, useContext } from 'react';

/**
 * Permite que cualquier componente (páginas, Footer, CTA...) abra el modal de reservas
 * sin pasar props por todo el árbol. El estado vive en MainLayout.
 */
export const BookingModalContext = createContext({
  openBooking: () => {},
  closeBooking: () => {},
});

export const useBookingModal = () => useContext(BookingModalContext);
