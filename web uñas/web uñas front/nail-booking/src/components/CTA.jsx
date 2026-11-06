import { useBookingModal } from '../context/bookingModal';
import { Reveal } from './Reveal';

export default function CTA() {
  const { openBooking } = useBookingModal();
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-plum"></div>

      {/* Subtle Accent */}
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl"></div>

      <Reveal className="max-w-3xl mx-auto px-6 sm:px-8 relative z-10 text-center">
        {/* Heading */}
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-lila-50 mb-6 leading-tight">
          Tu próximo set de ensueño
          <br />
          <em className="text-gold-400 not-italic">está a un clic</em>
        </h2>

        <p className="text-lg text-lila-200/80 mb-10 max-w-xl mx-auto leading-relaxed">
          Reserva ahora y prepárate para transformar tus manos en obras de arte.
        </p>

        {/* CTA Button */}
        <button
            type="button"
            onClick={openBooking}
            className="inline-block btn-gold px-10 py-5 rounded-full text-lg"
          >
          Reservar mi Cita
        </button>

        {/* Trust Badge */}
        <p className="mt-8 text-sm text-lila-200/50">
          Confirmación instantánea
        </p>
      </Reveal>
    </section>
  );
}
