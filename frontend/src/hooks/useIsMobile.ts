import { useEffect, useState } from 'react';

/**
 * Hook pour détecter si l'écran est en mode mobile
 * @param breakpoint - Largeur max en pixels pour considérer comme mobile (par défaut 768px = Tailwind 'md')
 * @returns true si l'écran est <= breakpoint
 */
export const useIsMobile = (breakpoint: number = 768): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);
    
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
    };

    // État initial
    handleChange(mediaQuery);
    
    // Écoute des changements
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [breakpoint]);

  return isMobile;
};


/* Explications de Chloé: Pourquoi ce hook ?
Détection responsive en temps réel
Réutilisable dans tous les composants
Gestion du resize de fenêtre automatique */