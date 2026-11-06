import { Check, ArrowRight, Calendar, Clock } from 'lucide-react';
import { useBookingModal } from '../context/bookingModal';
import { Reveal, RevealGroup, RevealItem } from '../components/Reveal';

const SERVICES_DATA = [
  {
    id: 1,
    name: 'Uñas Acrílicas',
    description: 'Máxima resistencia y firmeza para lucir manos estilizadas que soportan tu rutina diaria y cualquier diseño, ya sea en extensión o como baño acrílico.',
    features: ['Duración 3-4 semanas con cuidados', 'Cortas, Medianas y Largas Extremas', 'Color a elegir'],
    popular: false,
  },
  {
    id: 2,
    name: 'Técnica Híbrida',
    description: 'Combina lo mejor de dos sistemas mediante una mezcla de sistemas para darte una adherencia superior.',
    features: ['Duración 3 a 4 semanas con cuidados', 'Largos medianos a largos', 'Alta durabilidad'],
    popular: false,
  },
  {
    id: 3,
    name: 'Builder Gel',
    description: 'Trabajado con formas esculturales, ofrece un acabado ultra natural, brillante y flexible que fortalece tus uñas sin sensación de peso.',
    features: ['Duración 3 a 4 semanas con cuidados', 'Ideal para Uñas cortas a medianas', 'Acabado natural'],
    popular: false,
  },
  {
    id: 4,
    name: 'Soft Gel (Press On)',
    description: 'Aplicación rápida con kit Soft Gel que logra uñas ultradelgadas, ligeras y con una simetría perfecta en la mitad de tiempo',
    features: ['Duración 2 a 3 semanas con cuidados', 'Cortas y largas.', 'Diseños únicos'],
    popular: true,
  },
  {
    id: 5,
    name: 'Polygel',
    description: 'Moldeado suavemente con solución y pincel lengua de gato, te brinda la fuerza del acrílico pero tan ligero y cómodo que olvidarás que llevas extensiones.',
    features: ['Duración 3 a 4 semanas con cuidados', 'Sin olor', 'Ultra ligero'],
    popular: false,
  },
  {
    id: 6,
    name: 'Dipping Powder',
    description: 'Sistema de resina y dipping powder que aporta color uniforme y dureza inmediata a tu uña natural.',
    features: ['Duración 2 a 3 semanas con cuidados', 'Uñas cortas', 'Colores vibrantes'],
    popular: false,
  },
  {
    id: 7,
    name: 'Rubber Gel',
    description: 'Sistema de nivelación y refuerzo que alisa imperfecciones o estrías y crea una capa protectora flexible que evita quiebres, ayudando a que tu uña natural crezca fuerte y sana.',
    features: ['Duración 2 a 3 semanas con cuidados', 'Uñas cortas a medianas', 'Recomedable para el cuidado de uñas naturales'],
    popular: false,
  },
    {
    id: 8,
    name: 'Pedicure Spa y Acripie',
    description: 'Combina la relajación del Pedicure Spa con el Acripie para lograr pies suaves y uñas reconstruidas, simétricas y con un brillo intacto que resiste el roce del calzado.',
    features: ['Duración 3 a 4 semanas con cuidados', 'Recomendables cortas', 'Firme pero ligero'],
    popular: false,
  },
    {
    id: 9,
    name: 'Retiro Profesional',
    description: 'Remoción segura con aluminio, algodón y acetona pura que protege las capas de tu uña natural, dejándola sana, limpia y lista para un nuevo set sin debilitarla.',
    features: ['Cualquier sistema o largo previo.', 'Tiempo estimado de 1 hora', 'Recuerda notificar si necesitas retiro'],
    popular: false,
  },
];

const ADDONS = [
  { name: 'Pedrería Swarovski', price: 'Según diseño' },
  { name: 'French Clásico', price: 'Consultar' },
  { name: 'Efecto chrome/espejo', price: 'Consultar' },
  { name: 'Diseño a mano alzada', price: 'Según complejidad' },
  { name: 'Encapsulado con glitter o cola de sirena', price: 'Consultar' },
  { name: 'Encapsulado con flores secas', price: 'Consultar' },
  { name: 'Encapsulado concha nacar', price: 'Consultar' },
  { name: 'Efecto Azúcar o suéter', price: 'Consultar' },
  { name: 'Relieve en Gel Sólido', price: 'Consultar' },
  { name: 'Flor o diseños 3D', price: 'Consultar' },
];

export default function Services() {
  const { openBooking } = useBookingModal();
  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-lila-50 to-lila-100"></div>

        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <Reveal className="text-center">
            <p className="text-sm tracking-widest uppercase text-plum-500 mb-4">
              Servicios
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-plum-800 mb-6">
              El Arte de las Uñas
            </h1>
            <div className="w-16 h-px bg-gold-500 mx-auto mb-6"></div>
            <p className="text-lg text-plum-600 max-w-2xl mx-auto">
              Técnicas premium, productos de alta calidad y atención personalizada
              para crear tu set de uñas perfecto.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-lila-50"></div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <RevealGroup className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES_DATA.map((service) => (
              <RevealItem key={service.id} className="h-full">
              <div
                className={`h-full bg-white rounded-2xl p-8 border transition-all hover:shadow-lg ${
                  service.popular ? 'border-gold-400 shadow-md' : 'border-lila-200 hover:border-lila-300'
                }`}
              >
                {/* Popular Badge */}
                {service.popular && (
                  <span className="inline-block px-3 py-1 bg-gold-100 text-gold-700 text-xs font-medium rounded-full mb-4">
                    Popular
                  </span>
                )}

                {/* Content */}
                <h3 className="font-display text-xl text-plum-800 mb-3">{service.name}</h3>
                <p className="text-plum-600 text-sm mb-6 leading-relaxed">{service.description}</p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm text-plum-600">
                      <Check className="w-4 h-4 text-gold-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                    type="button"
                    onClick={openBooking}
                    className="inline-flex items-center space-x-1 text-gold-600 hover:text-gold-700 transition-colors text-sm font-medium"
                  >
                  <span>Reservar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-lila-50 to-lila-100"></div>

        <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <Reveal className="text-center mb-12">
            <p className="text-sm tracking-widest uppercase text-plum-500 mb-4">
              Personalización
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-plum-800 mb-4">
              Extras
            </h2>
          </Reveal>

          <Reveal className="bg-white rounded-2xl p-8 border border-lila-200">
            <RevealGroup className="grid sm:grid-cols-2 gap-4">
              {ADDONS.map((addon, index) => (
                <RevealItem
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl bg-lila-50 border border-lila-100"
                >
                  <span className="text-plum-700">{addon.name}</span>
                  <span className="text-plum-500 text-sm">{addon.price}</span>
                </RevealItem>
              ))}
            </RevealGroup>

            <div className="mt-8 pt-6 border-t border-lila-100 text-center">
              <p className="text-plum-500 text-sm mb-4">
                Los precios finales se confirman según el diseño elegido
              </p>
              <button
                  type="button"
                  onClick={openBooking}
                  className="btn-gold px-8 py-4 rounded-full inline-flex items-center space-x-2"
                >
                <Calendar className="w-5 h-5" />
                <span>Agendar Consulta</span>
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-lila-50"></div>

        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <Reveal className="text-center mb-16">
            <p className="text-sm tracking-widest uppercase text-plum-500 mb-4">
              El Proceso
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-plum-800">
              Qué Esperar
            </h2>
          </Reveal>

          <RevealGroup className="grid md:grid-cols-4 gap-8">
            {[
              { step: 1, title: 'Consulta', desc: 'Hablamos sobre el diseño que deseas' },
              { step: 2, title: 'Preparación', desc: 'Cuidado de tus uñas naturales' },
              { step: 3, title: 'Aplicación', desc: 'Técnica experta con productos premium' },
              { step: 4, title: 'Acabado', desc: 'Perfección en cada detalle' },
            ].map((item) => (
              <RevealItem key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center mx-auto mb-4 font-display text-xl">
                  {item.step}
                </div>
                <h3 className="font-medium text-plum-800 mb-2">{item.title}</h3>
                <p className="text-plum-500 text-sm">{item.desc}</p>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal className="mt-12 text-center">
            <div className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-lila-100 text-plum-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Duración promedio: 2-3 horas</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 gradient-plum"></div>

        <Reveal className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10 text-center">
          <h2 className="font-display text-3xl sm:text-4xl text-lila-50 mb-6">
            ¿Lista para tu transformación?
          </h2>
          <p className="text-lg text-lila-200/80 mb-10 max-w-xl mx-auto">
            Reserva tu cita y déjate consentir.
          </p>
          <button
              type="button"
              onClick={openBooking}
              className="inline-flex items-center space-x-2 btn-gold px-10 py-5 rounded-full text-lg"
            >
            <Calendar className="w-5 h-5" />
            <span>Reservar Ahora</span>
          </button>
        </Reveal>
      </section>
    </>
  );
}
