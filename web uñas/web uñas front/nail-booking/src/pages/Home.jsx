import { Link } from 'react-router-dom';
import BookingSection from '../components/BookingSection';
import CTA from '../components/CTA';
import { useBookingModal } from '../context/bookingModal';
import { Reveal } from '../components/Reveal';

export default function Home() {
  const { openBooking } = useBookingModal();
  return (
    <>
      {/* Hero Section - Editorial Style */}
      <section className="min-h-screen relative overflow-hidden">
        {/* Subtle Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-lila-50 via-lila-100 to-lila-50"></div>

        {/* Very Subtle Accent */}
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gold-500/5 rounded-full blur-3xl"></div>

        {/* Main Content - with padding-top for navbar */}
        <div className="relative min-h-screen pt-28 lg:pt-32">
          <div className="grid lg:grid-cols-2 h-full min-h-[calc(100vh-8rem)]">

            {/* Left Column - Text Content */}
            <Reveal className="flex flex-col justify-center px-8 sm:px-12 lg:px-16 xl:px-24 py-12 lg:py-0">
              {/* Minimal Badge */}
          

              {/* Main Heading with Serif Font */}
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-tight mb-8">
                <span className="text-plum-800">Uñas que</span>
                <br />
                <span className="text-plum-800">Reflejan tu</span>
                <br />
                <em className="text-gold-600 not-italic">Esencia</em>
              </h1>

              {/* Elegant Separator */}
              <div className="w-16 h-px bg-gold-500 mb-8"></div>

              {/* Description */}
              <p className="text-plum-600 text-lg leading-relaxed max-w-md mb-10">
                Especialista en uñas acrílicas de lujo. Cada set es una pieza
                única, diseñada para reflejar tu estilo personal.
              </p>

              {/* CTA Buttons - Clean and Minimal */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                    type="button"
                    onClick={openBooking}
                    className="btn-gold px-8 py-4 rounded-full text-center"
                  >
                  Reservar Cita
                </button>
                <Link
                  to="/servicios"
                  className="btn-gold-outline px-8 py-4 rounded-full text-center"
                >
                  Ver Servicios
                </Link>
              </div>

              {/* Minimal Social Proof */}
              <div className="mt-12 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-lila-300 border-2 border-lila-50"
                    />
                  ))}
                </div>
                <p className="text-sm text-plum-500">
                  +200 clientas satisfechas
                </p>
              </div>
            </Reveal>

            {/* Right Column - Hero Image */}
            <Reveal className="relative hidden lg:block" delay={0.2}>
              {/* Image Container */}
              <div className="absolute top-0 bottom-8 left-4 right-4 xl:left-8 xl:right-8">
                <div className="relative h-full w-full overflow-hidden rounded-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=1200&auto=format&fit=crop"
                    alt="Uñas acrílicas elegantes"
                    className="w-full h-full object-cover"
                  />
                  {/* Subtle Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-plum-900/20 via-transparent to-transparent"></div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Mobile Hero Image (shows below text on mobile) */}
        <Reveal className="lg:hidden px-6 pb-12">
          <div className="relative rounded-2xl overflow-hidden aspect-[4/5] max-w-sm mx-auto">
            <img
              src="https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=800&auto=format&fit=crop"
              alt="Uñas acrílicas elegantes"
              className="w-full h-full object-cover"
            />
          </div>
        </Reveal>
      </section>

      {/* Booking Section */}
      <BookingSection />

      {/* CTA Section */}
      <CTA />
    </>
  );
}
