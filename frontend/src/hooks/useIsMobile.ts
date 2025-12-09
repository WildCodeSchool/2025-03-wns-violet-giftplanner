import { useEffect, useState } from 'react';

/**
 * Hook pour détecter si l'écran est en mode mobile
 * @param breakpoint - Largeur max en pixels pour considérer comme mobile (par défaut 768px = Tailwind 'md')
 * @returns true si l'écran est <= breakpoint
 */
export const useIsMobile = (breakpoint: number = 768): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= breakpoint);
    };

    // État initial
    checkIsMobile();

    // Écoute des changements de taille d'écran
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, [breakpoint]);

  return isMobile;
};
