import { DiaryEntry } from '@/lib/types/diary';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'diary_entries';

function sanitizeEntry(raw: unknown): DiaryEntry | null {
  if (!raw || typeof raw !== 'object') return null;
  const entry = raw as Partial<DiaryEntry>;
  
  if (typeof entry.id !== 'string') return null;

  const ensureString = (value: unknown) => (typeof value === 'string' ? value : '');

  return {
    id: entry.id,
    dateTime: typeof entry.dateTime === 'string' ? entry.dateTime : new Date().toISOString(),
    situationDescription: ensureString(entry.situationDescription),
    attentionFocus: ensureString(entry.attentionFocus),
    thoughts: ensureString(entry.thoughts),
    bodySensations: ensureString(entry.bodySensations),
    actions: ensureString(entry.actions),
    futureActions: ensureString(entry.futureActions),
  };
}

function sanitizeEntries(raw: unknown): DiaryEntry[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map(sanitizeEntry)
    .filter((entry): entry is DiaryEntry => entry !== null);
}

// Получить Telegram WebApp API
function getTelegramWebApp() {
  if (typeof window === 'undefined') return null;
  return window.Telegram?.WebApp || null;
}

// Проверить, доступен ли CloudStorage
function isCloudStorageAvailable() {
  const webApp = getTelegramWebApp();
  return webApp && webApp.CloudStorage && typeof webApp.CloudStorage.getItem === 'function';
}

// Утилита для преобразования Promise в callback-based API
function promisify<T>(
  fn: (callback: (error: Error | null, result: T) => void) => void
): Promise<T> {
  return new Promise((resolve, reject) => {
    fn((error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result!);
      }
    });
  });
}

export const telegramStorageService = {
  async getAllEntries(): Promise<DiaryEntry[]> {
    // Fallback на localStorage если CloudStorage недоступен
    if (!isCloudStorageAvailable()) {
      if (typeof window !== 'undefined') {
        try {
          const data = localStorage.getItem(STORAGE_KEY);
          if (!data) return [];
          const entries = sanitizeEntries(JSON.parse(data));
          return entries.sort((a, b) => 
            new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
          );
        } catch (error) {
          console.error('Ошибка при чтении localStorage:', error);
          return [];
        }
      }
      return [];
    }

    const webApp = getTelegramWebApp()!;

    try {
      // Получаем данные из Telegram Cloud Storage
      const data = await promisify<string | null>((callback) => {
        webApp.CloudStorage.getItem(STORAGE_KEY, (error, value) => {
          callback(error, value);
        });
      });

      if (!data) return [];
      
      const entries = sanitizeEntries(JSON.parse(data));
      return entries.sort((a, b) => 
        new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
      );
    } catch (error) {
      console.error('Ошибка при получении записей из CloudStorage:', error);
      // Fallback на localStorage при ошибке CloudStorage
      try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return [];
        const entries = sanitizeEntries(JSON.parse(data));
        return entries.sort((a, b) => 
          new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
        );
      } catch {
        return [];
      }
    }
  },

  async getEntry(id: string): Promise<DiaryEntry | null> {
    const entries = await this.getAllEntries();
    return entries.find(e => e.id === id) || null;
  },

  async insertEntry(entry: Omit<DiaryEntry, 'id'>): Promise<DiaryEntry> {
    const entries = await this.getAllEntries();
    const newEntry: DiaryEntry = { ...entry, id: uuidv4() };
    entries.push(newEntry);
    await this.saveEntries(entries);
    return newEntry;
  },

  async updateEntry(entry: DiaryEntry): Promise<boolean> {
    const entries = await this.getAllEntries();
    const index = entries.findIndex(e => e.id === entry.id);
    if (index === -1) return false;
    entries[index] = entry;
    await this.saveEntries(entries);
    return true;
  },

  async deleteEntry(id: string): Promise<boolean> {
    const entries = await this.getAllEntries();
    const filtered = entries.filter(e => e.id !== id);
    if (filtered.length === entries.length) return false;
    await this.saveEntries(filtered);
    return true;
  },

  async searchEntries(query: string): Promise<DiaryEntry[]> {
    const entries = await this.getAllEntries();
    const lowerQuery = query.toLowerCase();
    return entries.filter(entry => 
      entry.situationDescription.toLowerCase().includes(lowerQuery) ||
      entry.attentionFocus.toLowerCase().includes(lowerQuery) ||
      entry.thoughts.toLowerCase().includes(lowerQuery) ||
      entry.bodySensations.toLowerCase().includes(lowerQuery) ||
      entry.actions.toLowerCase().includes(lowerQuery) ||
      entry.futureActions.toLowerCase().includes(lowerQuery)
    );
  },

  async saveEntries(entries: DiaryEntry[]): Promise<void> {
    const data = JSON.stringify(entries);

    // Fallback на localStorage если CloudStorage недоступен
    if (!isCloudStorageAvailable()) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, data);
      }
      return;
    }

    const webApp = getTelegramWebApp()!;

    try {
      await promisify<boolean>((callback) => {
        webApp.CloudStorage.setItem(STORAGE_KEY, data, (error, success) => {
          callback(error, success);
        });
      });
    } catch (error) {
      console.error('Ошибка при сохранении в CloudStorage:', error);
      // Fallback на localStorage при ошибке
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, data);
      }
    }
  },
};

