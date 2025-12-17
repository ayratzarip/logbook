import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  initFromTelegram: () => void;
}

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return;
  
  document.documentElement.classList.toggle('dark', theme === 'dark');
  
  // Также применяем тему Telegram, если доступна
  const webApp = typeof window !== 'undefined' ? window.Telegram?.WebApp : null;
  if (webApp) {
    // Telegram автоматически применяет тему через colorScheme
    const telegramTheme = webApp.colorScheme;
    document.documentElement.classList.toggle('dark', telegramTheme === 'dark');
  }
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'light',
  
  toggleTheme: () => {
    const newTheme = get().theme === 'light' ? 'dark' : 'light';
    set({ theme: newTheme });
    applyTheme(newTheme);
  },
  
  setTheme: (theme) => {
    set({ theme });
    applyTheme(theme);
  },
  
  initFromTelegram: () => {
    if (typeof window === 'undefined') return;
    
    const webApp = window.Telegram?.WebApp;
    if (webApp) {
      const telegramTheme = webApp.colorScheme || 'light';
      set({ theme: telegramTheme });
      applyTheme(telegramTheme);
      
      // Слушаем изменения темы Telegram (если поддерживается)
      if (typeof webApp.onEvent === 'function') {
        webApp.onEvent('themeChanged', () => {
          const newTheme = webApp.colorScheme || 'light';
          set({ theme: newTheme });
          applyTheme(newTheme);
        });
      }
    } else {
      // Fallback: проверяем системную тему
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = prefersDark ? 'dark' : 'light';
      set({ theme: initialTheme });
      applyTheme(initialTheme);
    }
  },
}));

