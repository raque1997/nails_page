import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { BRAND } from '../constants';

const NAV_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/servicios', label: 'Servicios' },
  { to: '/faq', label: 'FAQ' },
];

/** @param {{ onReserve: () => void }} props Abre el modal de reservas (el estado vive en MainLayout). */
export default function Navbar({ onReserve }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="group">
            <img
              src="/Logo.png"
              alt={BRAND.name}
              className="h-12 sm:h-14 w-auto transition-opacity group-hover:opacity-80"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm tracking-wide transition-colors ${
                  isActive(link.to)
                    ? 'text-plum-800 font-medium'
                    : 'text-plum-600 hover:text-plum-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => onReserve()}
              className="btn-gold px-6 py-3 rounded-full text-sm"
            >
              Reservar
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-plum-700"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${
        isMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-white border-t border-lila-100 px-6 py-6 space-y-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`block py-3 text-base transition-colors ${
                isActive(link.to)
                  ? 'text-plum-800 font-medium'
                  : 'text-plum-600 hover:text-plum-800'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => {
              setIsMenuOpen(false);
              onReserve();
            }}
            className="block w-full btn-gold text-center py-4 rounded-full text-sm mt-4"
          >
            Reservar Cita
          </button>
        </div>
      </div>
    </nav>
  );
}
