import { motion } from 'framer-motion';

/**
 * Animaciones de entrada al hacer scroll para la Landing Page (no usar dentro del modal).
 * Todas conservan el `className` recibido, así no se pierde ninguna clase de Tailwind.
 */

const VIEWPORT = { once: true, amount: 0.2 };
const TRANSITION = { duration: 0.6, ease: 'easeOut' };

/** Fade in hacia arriba. `delay` (segundos) permite escalonar elementos sueltos. */
export function Reveal({ children, className, delay = 0, ...rest }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ ...TRANSITION, delay }}
      viewport={VIEWPORT}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

const groupVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: TRANSITION },
};

/** Contenedor de cascada: sus `RevealItem` aparecen uno tras otro. */
export function RevealGroup({ children, className, ...rest }) {
  return (
    <motion.div
      className={className}
      variants={groupVariants}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Hijo directo de `RevealGroup`; hereda el estado `hidden`/`visible` del padre. */
export function RevealItem({ children, className, ...rest }) {
  return (
    <motion.div className={className} variants={itemVariants} {...rest}>
      {children}
    </motion.div>
  );
}
