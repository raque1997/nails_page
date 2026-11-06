import { useEffect, useMemo, useState, type SyntheticEvent } from 'react';
import { DayPicker } from 'react-day-picker';
import { es } from 'react-day-picker/locale';
import 'react-day-picker/style.css';
import { format, startOfToday } from 'date-fns';
import { CalendarDays, Check, Loader2 } from 'lucide-react';

/** Duración de cada cita. Debe caber en el horario laboral del servidor (9:00-18:00). */
const APPOINTMENT_MINUTES = 180;

interface Slot {
  time: string;
  available: boolean;
}
interface AvailabilityResponse {
  slots: Slot[];
}
interface BookResponse {
  eventId: string;
}
interface ApiError {
  error: string;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

/** El negocio solo atiende sábados (6) y domingos (0). */
const isWeekend = (date: Date): boolean => date.getDay() === 0 || date.getDay() === 6;

/** Extrae el mensaje de error de la API; tolera respuestas que no son JSON. */
const readError = async (res: Response): Promise<string> => {
  try {
    return ((await res.json()) as ApiError).error;
  } catch {
    return `Error del servidor (${res.status}).`;
  }
};

const addMinutes = (time: string, minutes: number): string => {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + minutes;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};

/* ---- Neumorfismo: las clases van completas para que Tailwind las detecte ---- */
const RAISED =
  'shadow-[9px_9px_16px_rgb(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)]';
const PRESSED =
  'shadow-[inset_4px_4px_8px_rgba(163,177,198,0.7),inset_-4px_-4px_8px_rgba(255,255,255,0.8)]';
const ACTIVE_BG = 'bg-gradient-to-br from-pink-400 to-pink-500 text-white';

const inputClass = `w-full rounded-xl bg-[#e0e5ec] ${PRESSED} px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-400/60`;

export default function BookingNative() {
  const [day, setDay] = useState<Date | undefined>();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsStatus, setSlotsStatus] = useState<Status>('idle');
  const [time, setTime] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [bookStatus, setBookStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  // Se calcula una sola vez por montaje, no en cada render.
  const today = useMemo(() => startOfToday(), []);
  const dateKey = day ? format(day, 'yyyy-MM-dd') : null;

  /** El reinicio del estado vive en el evento, no en el efecto (evita renders en cascada). */
  const selectDay = (next: Date | undefined) => {
    setDay(next);
    setSlots([]);
    setTime(null);
    setSlotsStatus(next ? 'loading' : 'idle');
  };

  // Solo sincroniza con la API: todos los setState ocurren de forma asíncrona.
  useEffect(() => {
    if (!dateKey) return;
    const controller = new AbortController();

    fetch(`/api/availability?date=${dateKey}&duration=${APPOINTMENT_MINUTES}`, {
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await readError(res));
        const data = (await res.json()) as AvailabilityResponse;
        setSlots(data.slots);
        setSlotsStatus('idle');
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setSlotsStatus('error');
      });

    return () => controller.abort();
  }, [dateKey]);

  const confirm = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!dateKey || !time) return;
    setBookStatus('loading');
    setMessage('');
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: dateKey,
          startTime: time,
          endTime: addMinutes(time, APPOINTMENT_MINUTES),
          customer: form,
        }),
      });
      if (!res.ok) throw new Error(await readError(res));
      (await res.json()) as BookResponse;
      setBookStatus('success');
    } catch (err) {
      setMessage(
        err instanceof TypeError
          ? 'No hay conexión con el servidor. Intenta de nuevo.'
          : err instanceof Error
            ? err.message
            : 'No se pudo registrar la cita.',
      );
      setBookStatus('error');
    }
  };

  const reset = () => {
    selectDay(undefined);
    setForm({ name: '', email: '', phone: '' });
    setBookStatus('idle');
    setMessage('');
  };

  if (bookStatus === 'success' && day && time) {
    return (
      <div
        className={`w-full max-w-4xl mx-auto bg-[#e0e5ec] ${RAISED} rounded-3xl p-10 text-center`}
      >
        <div
          className={`w-14 h-14 rounded-full ${ACTIVE_BG} ${RAISED} flex items-center justify-center mx-auto mb-4`}
        >
          <Check className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-semibold text-slate-700 mb-2">¡Cita confirmada!</h3>
        <p className="text-slate-500 mb-6">
          {format(day, 'dd/MM/yyyy')} a las {time}. Te contactaremos si hay algún cambio.
        </p>
        <button
          onClick={reset}
          className={`px-6 py-2 rounded-2xl bg-[#e0e5ec] ${RAISED} text-slate-700 hover:text-pink-500 active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.7),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] transition-all duration-300`}
        >
          Agendar otra cita
        </button>
      </div>
    );
  }

  return (
    <div
      className={`w-full max-w-4xl mx-auto bg-[#e0e5ec] ${RAISED} rounded-3xl p-4 sm:p-8 text-slate-700`}
    >
      <div className="grid md:grid-cols-2 md:min-h-[420px]">
        {/* Fecha */}
        <div className="flex justify-center md:items-start md:pr-6">
          <DayPicker
            mode="single"
            locale={es}
            selected={day}
            onSelect={selectDay}
            disabled={[{ before: today }, (date: Date) => !isWeekend(date)]}
            modifiers={{ available: (date: Date) => isWeekend(date) && date >= today }}
            modifiersClassNames={{
              available:
                '[&_button]:cursor-pointer [&_button]:rounded-2xl [&_button]:text-slate-700 [&_button]:transition-all [&_button]:duration-300 [&_button]:shadow-[3px_3px_6px_rgb(163,177,198,0.6),-3px_-3px_6px_rgba(255,255,255,0.5)] [&_button:hover]:text-pink-500',
              selected:
                '[&_button]:bg-gradient-to-br [&_button]:from-pink-400 [&_button]:to-pink-500 [&_button]:text-white [&_button]:font-bold [&_button]:border-transparent [&_button]:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.7),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] [&_button:hover]:text-white',
              disabled:
                'opacity-50 [&_button]:text-slate-400 [&_button]:shadow-none [&_button]:cursor-not-allowed [&_button]:bg-[#e0e5ec]',
            }}
            style={
              {
                '--rdp-accent-color': '#ec4899',
                '--rdp-accent-background-color': 'transparent',
                '--rdp-today-color': '#ec4899',
                color: '#334155',
              } as React.CSSProperties
            }
          />
        </div>

        {/* Horas y datos */}
        <div className="mt-6 md:mt-0 md:pl-6 min-h-[320px] md:h-full md:shadow-[-1px_0_0_rgba(163,177,198,0.35),1px_0_0_rgba(255,255,255,0.7)]">
          {!day ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[320px] text-center space-y-3">
              <CalendarDays className="w-12 h-12 text-slate-400" strokeWidth={1.5} />
              <p className="text-lg font-medium text-slate-700">Selecciona una fecha</p>
              <p className="text-sm text-slate-500">Los horarios disponibles aparecerán aquí</p>
            </div>
          ) : (
            <h3 className="font-semibold text-slate-700 mb-4">
              Horarios para el {format(day, 'dd/MM/yyyy')}
            </h3>
          )}

          {slotsStatus === 'loading' && (
            <p className="flex items-center gap-2 text-slate-500 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" /> Cargando horarios...
            </p>
          )}
          {slotsStatus === 'error' && (
            <p className="text-red-500 text-sm">No se pudo cargar la disponibilidad.</p>
          )}
          {day && slotsStatus === 'idle' && slots.length === 0 && (
            <p className="text-slate-500 text-sm">No hay horarios disponibles ese día.</p>
          )}
          {slotsStatus === 'idle' && slots.length > 0 && slots.every((s) => !s.available) && (
            <p className="text-slate-500 text-sm">Todos los horarios de este día están ocupados.</p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 p-2">
            {slots.map(({ time: slotTime, available }) => (
              <button
                key={slotTime}
                type="button"
                disabled={!available}
                onClick={() => available && setTime(slotTime)}
                className={`py-2 px-1 rounded-xl text-sm transition-all duration-300 ease-in-out animate-[slotIn_300ms_ease-in-out_both] ${
                  !available
                    ? 'bg-[#e0e5ec] opacity-50 text-slate-400 cursor-not-allowed line-through'
                    : time === slotTime
                      ? `${ACTIVE_BG} ${PRESSED} font-medium`
                      : `bg-[#e0e5ec] ${RAISED} text-slate-700 hover:text-pink-500`
                }`}
              >
                {slotTime}
                {!available && (
                  <span className="block text-xs no-underline [text-decoration:none]">Ocupado</span>
                )}
              </button>
            ))}
          </div>

          {time && (
            <form onSubmit={confirm} className="space-y-4 p-2">
              <input
                required
                className={inputClass}
                placeholder="Nombre"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                required
                type="email"
                className={inputClass}
                placeholder="Correo"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                required
                type="tel"
                className={inputClass}
                placeholder="Teléfono"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              {bookStatus === 'error' && <p className="text-red-500 text-sm">{message}</p>}
              <button
                type="submit"
                disabled={bookStatus === 'loading'}
                className={`w-full py-3 rounded-2xl ${ACTIVE_BG} ${RAISED} font-medium hover:brightness-105 disabled:opacity-60 flex items-center justify-center gap-2 transition-all duration-300`}
              >
                {bookStatus === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
                Confirmar cita a las {time}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
