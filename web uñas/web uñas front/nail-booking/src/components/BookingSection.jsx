import { Calendar, Clock, Check } from 'lucide-react';
import { WHATSAPP_URL } from '../constants';
import { useBookingModal } from '../context/bookingModal';
import { Reveal, RevealGroup, RevealItem } from './Reveal';

export default function BookingSection() {
  const { openBooking } = useBookingModal();

  return (
    <>
      <section id="agendar" className="py-24 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-lila-100 to-lila-50"></div>

        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          {/* Header */}
          <Reveal className="text-center mb-16">
            <p className="text-sm tracking-widest uppercase text-plum-500 mb-4">
              Reservaciones
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-plum-800 mb-6">
              Agenda tu Cita
            </h2>
            <div className="w-16 h-px bg-gold-500 mx-auto"></div>
          </Reveal>

          {/* Booking Card */}
          <Reveal className="bg-white rounded-3xl shadow-xl shadow-plum-900/10 overflow-hidden border border-lila-200">
            <div className="grid lg:grid-cols-2">

              {/* Left Side - Info */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="mb-8">
                  <span className="inline-flex items-center space-x-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full mb-6">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-sm font-medium text-green-700">Disponible esta semana</span>
                  </span>

                  <h3 className="font-display text-2xl lg:text-3xl text-plum-800 mb-4">
                    Reserva tu sesión de uñas
                  </h3>
                  <p className="text-plum-600 leading-relaxed">
                    Selecciona el día y horario que mejor se adapte a ti.
                    Recibirás confirmación inmediata por email.
                  </p>
                </div>

                {/* Features */}
                <RevealGroup className="space-y-4 mb-8">
                  {[
                    { icon: Calendar, text: 'Disponibilidad en tiempo real' },
                    { icon: Clock, text: 'Confirmación instantánea' },
                    { icon: Check, text: 'Recordatorio automático 24h antes' },
                  ].map((item, index) => (
                    <RevealItem key={index} className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-gold-600" />
                      </div>
                      <span className="text-plum-700">{item.text}</span>
                    </RevealItem>
                  ))}
                </RevealGroup>

                {/* CTA Button */}
                <button
                  onClick={openBooking}
                  className="btn-gold px-8 py-4 rounded-full text-lg font-medium flex items-center justify-center space-x-3 w-full lg:w-auto"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Ver Horarios Disponibles</span>
                </button>

                {/* Alternative */}
                <p className="text-sm text-plum-500 mt-4 text-center lg:text-left">
                  ¿Prefieres escribirnos?{' '}
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#25D366] hover:underline font-medium"
                  >
                    WhatsApp
                  </a>
                </p>
              </div>

              {/* Right Side - Visual */}
              <div className="hidden lg:block relative bg-gradient-to-br from-plum-800 to-plum-900 p-12">
                {/* Decorative elements */}
                <div className="absolute top-8 right-8 w-24 h-24 border border-gold-500/20 rounded-full"></div>
                <div className="absolute bottom-12 left-8 w-16 h-16 border border-gold-500/30 rounded-full"></div>
                <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-gold-400 rounded-full"></div>

                <div className="relative z-10 h-full flex flex-col justify-center text-center">
                  <div className="w-20 h-20 rounded-full bg-gold-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-gold-500/30">
                    <Calendar className="w-10 h-10 text-plum-900" />
                  </div>
                  <p className="font-display text-2xl text-lila-50 mb-2">
                    Sábados y Domingos
                  </p>
                  <p className="text-lila-200/70">
                    9:00 AM - 6:00 PM
                  </p>
                  <div className="w-12 h-px bg-gold-500/50 mx-auto my-6"></div>
                  <p className="text-sm text-lila-200/50">
                    Sesiones de 3 horas
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Bottom Note */}
          <Reveal className="text-center text-plum-500 text-sm mt-8">
            ¿Problemas para agendar?{' '}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-600 hover:text-gold-700 underline"
            >
              Escríbenos por WhatsApp
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
