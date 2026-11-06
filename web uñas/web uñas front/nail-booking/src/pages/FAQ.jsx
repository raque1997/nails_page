import { useState } from 'react';
import { HelpCircle, ChevronDown, Calendar } from 'lucide-react';
import { WHATSAPP_URL } from '../constants';
import { useBookingModal } from '../context/bookingModal';
import { Reveal, RevealGroup, RevealItem } from '../components/Reveal';

const FAQS = [
  {
    category: 'Sobre las Citas',
    questions: [
      {
        question: '¿Cómo puedo agendar una cita?',
        answer: 'Puedes agendar directamente desde esta página usando el calendario integrado o haciendo clic en cualquier botón de "Reservar". Selecciona la fecha y hora disponible, ingresa tus datos y recibirás una confirmación por email.',
      },
      {
        question: '¿Cómo cancelo o reprogramo mi cita?',
        answer: 'Puedes modificar tu cita desde el correo de confirmación que recibes al agendar. Te pido avisar con al menos 24 horas de anticipación para poder ofrecer el espacio a otra clienta.',
      },
      {
        question: '¿Cuánto tiempo dura una sesión?',
        answer: 'Depende del servicio: una aplicación básica toma aproximadamente 2 horas. Sets con diseños elaborados, arte 3D o mucha pedrería pueden tomar 3-4 horas.',
      },
    ],
  },
  {
    category: 'Sobre los Servicios',
    questions: [
      {
        question: '¿Cuánto duran las uñas acrílicas?',
        answer: 'Con el cuidado adecuado, tus uñas acrílicas pueden durar de 3 a 4 semanas. Recomiendo un mantenimiento cada 2-3 semanas para mantenerlas perfectas.',
      },
      {
        question: '¿Qué diferencia hay entre acrílico, polygel y dipping?',
        answer: 'El acrílico es la técnica más versátil y duradera, ideal para esculturas. El polygel es más ligero y flexible. El dipping es de aplicación rápida y no requiere lámpara UV.',
      },
      {
        question: '¿Puedo traer mi propio diseño?',
        answer: '¡Por supuesto! Me encanta recrear diseños que mis clientas traen de Pinterest o Instagram. Envíame las fotos de referencia cuando agendes.',
      },
    ],
  },
  {
    category: 'Precios y Pagos',
    questions: [
      {
        question: '¿Cuáles son los precios?',
        answer: 'Los precios varían según el servicio y la complejidad del diseño. Una aplicación básica tiene un precio base, y los diseños elaborados se cotizan según el trabajo requerido.',
      },
      {
        question: '¿Se requiere anticipo?',
        answer: 'Para confirmar tu cita se solicita un anticipo del 50%. Este se descuenta del total del servicio y garantiza tu espacio.',
      },
    ],
  },
  {
    category: 'Cuidados',
    questions: [
      {
        question: '¿Cómo cuido mis uñas acrílicas?',
        answer: 'Evita usar tus uñas como herramientas, usa guantes para tareas domésticas, hidrata tus cutículas diariamente y evita golpes fuertes.',
      },
      {
        question: '¿Puedo retirar las uñas en casa?',
        answer: 'No lo recomiendo. El retiro casero puede dañar tus uñas naturales. Siempre agenda una cita de retiro profesional.',
      },
    ],
  },
];

export default function FAQ() {
  const { openBooking } = useBookingModal();
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setActiveIndex(activeIndex === key ? null : key);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-lila-50 to-lila-100"></div>

        <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <Reveal className="text-center">
            <p className="text-sm tracking-widest uppercase text-plum-500 mb-4">
              Ayuda
            </p>
            <h1 className="font-display text-4xl sm:text-5xl text-plum-800 mb-6">
              Preguntas Frecuentes
            </h1>
            <div className="w-16 h-px bg-gold-500 mx-auto mb-6"></div>
            <p className="text-lg text-plum-600">
              Respuestas a las dudas más comunes sobre mis servicios.
            </p>
          </Reveal>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-lila-50"></div>

        <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          {FAQS.map((category, categoryIndex) => (
            <Reveal key={categoryIndex} className="mb-12">
              {/* Category Header */}
              <h2 className="font-display text-xl text-plum-800 mb-6">
                {category.category}
              </h2>

              {/* Questions */}
              <div className="space-y-3">
                {category.questions.map((faq, questionIndex) => {
                  const key = `${categoryIndex}-${questionIndex}`;
                  const isActive = activeIndex === key;

                  return (
                    <div
                      key={questionIndex}
                      className={`bg-white rounded-xl overflow-hidden border transition-all ${
                        isActive ? 'border-gold-400 shadow-sm' : 'border-lila-200'
                      }`}
                    >
                      <button
                        onClick={() => toggleFAQ(categoryIndex, questionIndex)}
                        className="w-full px-6 py-5 flex items-center justify-between text-left"
                      >
                        <span className="font-medium text-plum-800 flex items-center space-x-3 pr-4">
                          <HelpCircle className="w-5 h-5 text-plum-400 flex-shrink-0" />
                          <span>{faq.question}</span>
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-plum-400 transition-transform duration-300 flex-shrink-0 ${
                            isActive ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          isActive ? 'max-h-96' : 'max-h-0'
                        }`}
                      >
                        <div className="px-6 pb-5 text-plum-600 leading-relaxed border-t border-lila-100 pt-4 ml-8">
                          <p>{faq.answer}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-lila-50 to-lila-100"></div>

        <div className="max-w-2xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <Reveal className="bg-white rounded-2xl p-8 lg:p-12 text-center border border-lila-200">
            <h2 className="font-display text-2xl sm:text-3xl text-plum-800 mb-4">
              ¿Más preguntas?
            </h2>
            <p className="text-plum-600 mb-8">
              Estoy aquí para ayudarte.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                  type="button"
                  onClick={openBooking}
                  className="btn-gold px-8 py-4 rounded-full inline-flex items-center justify-center space-x-2"
                >
                <Calendar className="w-5 h-5" />
                <span>Agendar Cita</span>
              </button>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full inline-flex items-center justify-center space-x-2 bg-[#25D366] text-white font-medium hover:bg-[#20BD5A] hover:scale-105 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span>WhatsApp</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-lila-50"></div>

        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <Reveal className="text-center mb-12">
            <h2 className="font-display text-2xl sm:text-3xl text-plum-800">
              Tips
            </h2>
          </Reveal>

          <RevealGroup className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Antes de tu Cita',
                tips: ['No cortes tus cutículas', 'Llega con uñas sin esmalte', 'Trae fotos de referencia'],
              },
              {
                title: 'Durante la Sesión',
                tips: ['Relájate y disfruta', 'Comunica tus preferencias', 'Pregunta cualquier duda'],
              },
              {
                title: 'Después del Servicio',
                tips: ['Hidrata tus cutículas', 'Evita agua caliente 24h', 'Agenda tu próximo relleno'],
              },
            ].map((section, index) => (
              <RevealItem key={index} className="bg-white rounded-xl p-6 border border-lila-200">
                <h3 className="font-medium text-plum-800 mb-4">{section.title}</h3>
                <ul className="space-y-3">
                  {section.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="text-plum-600 text-sm">
                      {tip}
                    </li>
                  ))}
                </ul>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>
    </>
  );
}
