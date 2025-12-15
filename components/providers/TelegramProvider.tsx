'use client';

import { useEffect } from 'react';
import { initTelegramWebApp } from '@/lib/utils/telegram';
import { useThemeStore } from '@/lib/store/theme-store';

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const initFromTelegram = useThemeStore((state) => state.initFromTelegram);

  useEffect(() => {
    // Инициализация Telegram Web App
    initTelegramWebApp();
    
    // Инициализация темы из Telegram
    initFromTelegram();
  }, [initFromTelegram]);

  return <>{children}</>;
}

