'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

export function ErudaProvider() {
  const [shouldLoadEruda, setShouldLoadEruda] = useState(false);

  useEffect(() => {
    // Проверяем, нужно ли загружать Eruda
    // В development режиме или если в URL есть параметр ?eruda=true
    const isDevelopment = process.env.NODE_ENV === 'development';
    const hasErudaParam = typeof window !== 'undefined' && window.location.search.includes('eruda=true');
    
    setShouldLoadEruda(isDevelopment || hasErudaParam);
  }, []);

  if (!shouldLoadEruda) {
    return null;
  }

  return (
    <Script
      src="https://cdn.jsdelivr.net/npm/eruda"
      strategy="lazyOnload"
      onLoad={() => {
        if (typeof window !== 'undefined' && (window as any).eruda) {
          (window as any).eruda.init();
          console.log('🔧 Eruda инициализирована для отладки');
        }
      }}
    />
  );
}
