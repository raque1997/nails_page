import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 w-12 h-12 bg-plum-800 hover:bg-plum-700 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-50 cursor-pointer ${
        isVisible ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-4'
      }`}
      aria-label="Volver arriba"
    >
      <ChevronUp className="w-5 h-5 text-lila-50" />
    </button>
  );
}
