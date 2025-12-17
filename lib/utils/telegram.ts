import { TelegramWebApp } from '@/lib/types/telegram';

export function getTelegramWebApp(): TelegramWebApp | null {
  if (typeof window === 'undefined') return null;
  return window.Telegram?.WebApp || null;
}

export function initTelegramWebApp(): void {
  if (typeof window === 'undefined') return;
  
  const webApp = window.Telegram?.WebApp;
  if (!webApp) return;
  
  // Инициализация Telegram Web App
  webApp.ready?.();
  
  // Разворачиваем на весь экран (проверяем наличие метода)
  if (typeof webApp.expand === 'function') {
    webApp.expand();
  }
  
  // Применяем тему Telegram
  if (webApp.themeParams?.bg_color) {
    document.documentElement.style.setProperty('--telegram-bg-color', webApp.themeParams.bg_color);
  }
  if (webApp.themeParams?.text_color) {
    document.documentElement.style.setProperty('--telegram-text-color', webApp.themeParams.text_color);
  }
}

/**
 * Ожидает готовности Telegram WebApp
 * Возвращает Promise, который резолвится когда WebApp готов к использованию
 */
export function waitForTelegramWebApp(timeout = 5000): Promise<TelegramWebApp | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(null);
      return;
    }

    // Если уже доступен, возвращаем сразу
    const webApp = window.Telegram?.WebApp;
    if (webApp) {
      // Вызываем ready() если еще не вызван
      webApp.ready?.();
      resolve(webApp);
      return;
    }

    // Ждем появления WebApp
    let attempts = 0;
    const maxAttempts = timeout / 100; // проверяем каждые 100мс

    const checkInterval = setInterval(() => {
      attempts++;
      const app = window.Telegram?.WebApp;
      
      if (app) {
        clearInterval(checkInterval);
        app.ready?.();
        resolve(app);
      } else if (attempts >= maxAttempts) {
        clearInterval(checkInterval);
        console.warn('[Telegram] WebApp не загрузился за', timeout, 'мс');
        resolve(null);
      }
    }, 100);
  });
}

