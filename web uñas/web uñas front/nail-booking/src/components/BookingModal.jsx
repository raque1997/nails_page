import { useEffect } from 'react';
import { X } from 'lucide-react';
import BookingNative from './BookingNative';

/** Modal de reservas. El estado (abierto/cerrado) lo controla el padre (MainLayout). */
export default function BookingModal({ isOpen, onClose }) {
  // Bloquea el scroll del fondo y permite cerrar con Escape mientras está abierto.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-label="Reservar cita"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-plum-900/80 backdrop-blur-sm" onClick={onClose}></div>

        {/* Modal Content */}
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-fadeIn">
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-lila-100">
            <div>
              <h3 className="font-display text-xl text-plum-800">Selecciona tu Horario</h3>
              <p className="text-sm text-plum-500">Elige el día y hora que prefieras</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-lila-100 hover:bg-lila-200 flex items-center justify-center transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5 text-plum-600" />
            </button>
          </div>

          {/* Calendario de reservas */}
          <div className="overflow-y-auto" style={{ maxHeight: '550px' }}>
            <BookingNative />
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-lila-100 bg-lila-50">
            <p className="text-sm text-plum-500">Reserva sincronizada con Google Calendar</p>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
}
