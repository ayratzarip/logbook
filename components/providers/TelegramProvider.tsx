'use client';

import { useEffect, useState } from 'react';
import { initTelegramWebApp, waitForTelegramWebApp } from '@/lib/utils/telegram';
import { useThemeStore } from '@/lib/store/theme-store';

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const initFromTelegram = useThemeStore((state) => state.initFromTelegram);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      try {
        // Ждем готовности Telegram WebApp
        const webApp = await waitForTelegramWebApp(5000);
        
        if (!mounted) return;

        if (webApp) {
          console.log('[Telegram] WebApp готов, платформа:', webApp.platform);
          // Инициализация Telegram Web App
          initTelegramWebApp();
          
          // Инициализация темы из Telegram
          initFromTelegram();
        } else {
          console.warn('[Telegram] WebApp не доступен, работаем в режиме fallback');
          // Даже если WebApp не доступен, продолжаем работу
          initFromTelegram();
        }
      } catch (error) {
        console.error('[Telegram] Ошибка инициализации:', error);
        // Продолжаем работу даже при ошибке
        initFromTelegram();
      } finally {
        if (mounted) {
          setIsReady(true);
        }
      }
    }

    initialize();

    return () => {
      mounted = false;
    };
  }, [initFromTelegram]);

  // Рендерим children сразу, но они могут проверять готовность через состояние
  return <>{children}</>;
}

