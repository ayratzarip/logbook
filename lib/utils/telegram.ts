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

