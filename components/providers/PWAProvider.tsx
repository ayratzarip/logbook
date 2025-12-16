'use client';

import { useEffect } from 'react';

export function PWAProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator
    ) {
      // Регистрация Service Worker после загрузки страницы
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('Service Worker зарегистрирован:', registration.scope);
          })
          .catch((error) => {
            console.error('Ошибка регистрации Service Worker:', error);
          });
      });
    }
  }, []);

  return <>{children}</>;
}
