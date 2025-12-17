import { DiaryEntry } from '@/lib/types/diary';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'diary_entries';

function sanitizeEntry(raw: unknown): DiaryEntry | null {
  if (!raw || typeof raw !== 'object') return null;
  const entry = raw as Partial<DiaryEntry>;
  
  if (typeof entry.id !== 'string') return null;

  const ensureString = (value: unknown) => (typeof value === 'string' ? value : '');
  
  let validDate = new Date().toISOString();
  if (typeof entry.dateTime === 'string') {
    const d = new Date(entry.dateTime);
    if (!isNaN(d.getTime())) {
      validDate = entry.dateTime;
    }
  }

  return {
    id: entry.id,
    dateTime: validDate,
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
  if (typeof window === 'undefined') return false;
  
  const webApp = getTelegramWebApp();
  if (!webApp) {
    console.log('[Storage] Telegram WebApp не доступен');
    return false;
  }
  
  // CloudStorage доступен с Bot API 6.9+
  // Проверяем версию через isVersionAtLeast, если метод доступен
  if (typeof webApp.isVersionAtLeast === 'function') {
    const isSupported = webApp.isVersionAtLeast('6.9');
    if (!isSupported) {
      console.log('[Storage] CloudStorage требует Bot API 6.9+, текущая версия:', webApp.version);
      return false;
    }
  }
  
  // Проверяем наличие CloudStorage объекта
  if (!webApp.CloudStorage) {
    console.log('[Storage] CloudStorage не доступен на этой платформе, платформа:', webApp.platform, 'версия:', webApp.version);
    return false;
  }
  
  // Проверяем наличие необходимых методов
  const hasRequiredMethods = 
    typeof webApp.CloudStorage.getItem === 'function' &&
    typeof webApp.CloudStorage.setItem === 'function';
  
  if (!hasRequiredMethods) {
    console.log('[Storage] CloudStorage методы не доступны');
    return false;
  }
  
  console.log('[Storage] CloudStorage доступен, платформа:', webApp.platform, 'версия:', webApp.version);
  return true;
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

// Миграция данных из localStorage в CloudStorage при первом запуске
async function migrateToCloudStorageIfNeeded() {
  if (!isCloudStorageAvailable() || typeof window === 'undefined') {
    return;
  }

  try {
    const webApp = getTelegramWebApp()!;
    
    // Проверяем, есть ли данные в CloudStorage
    const cloudData = await promisify<string | null>((callback) => {
      webApp.CloudStorage.getItem(STORAGE_KEY, (error, value) => {
        callback(error, value);
      });
    });

    // Если CloudStorage пуст, но есть данные в localStorage, мигрируем их
    if (!cloudData) {
      const localData = localStorage.getItem(STORAGE_KEY);
      if (localData) {
        console.log('[Storage] Миграция данных из localStorage в CloudStorage...');
        await promisify<boolean>((callback) => {
          webApp.CloudStorage.setItem(STORAGE_KEY, localData, (error, success) => {
            if (error) {
              console.error('[Storage] Ошибка миграции:', error);
              callback(error, false);
            } else {
              console.log('[Storage] Миграция завершена успешно');
              callback(null, success);
            }
          });
        });
      }
    }
  } catch (error) {
    console.error('[Storage] Ошибка при миграции:', error);
  }
}

export const telegramStorageService = {
  async getAllEntries(): Promise<DiaryEntry[]> {
    // Пытаемся мигрировать данные при первом запуске
    await migrateToCloudStorageIfNeeded();
    // Всегда пытаемся использовать CloudStorage, если доступен
    if (isCloudStorageAvailable()) {
      const webApp = getTelegramWebApp()!;

      try {
        console.log('[Storage] Чтение из CloudStorage...');
        // Получаем данные из Telegram Cloud Storage
        const data = await promisify<string | null>((callback) => {
          webApp.CloudStorage.getItem(STORAGE_KEY, (error, value) => {
            if (error) {
              console.error('[Storage] Ошибка CloudStorage.getItem:', error);
              callback(error, null);
            } else {
              callback(null, value);
            }
          });
        });

        if (data) {
          console.log('[Storage] Данные получены из CloudStorage, размер:', data.length);
          const entries = sanitizeEntries(JSON.parse(data));
          console.log('[Storage] Записей загружено:', entries.length);
          return entries.sort((a, b) => 
            new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
          );
        } else {
          console.log('[Storage] CloudStorage пуст, проверяем localStorage как fallback');
        }
      } catch (error) {
        console.error('[Storage] Критическая ошибка при получении записей из CloudStorage:', error);
        // Продолжаем к fallback на localStorage
      }
    }

    // Fallback на localStorage если CloudStorage недоступен или пуст
    if (typeof window !== 'undefined') {
      try {
        console.log('[Storage] Чтение из localStorage...');
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) {
          console.log('[Storage] localStorage пуст');
          return [];
        }
        const entries = sanitizeEntries(JSON.parse(data));
        console.log('[Storage] Записей загружено из localStorage:', entries.length);
        return entries.sort((a, b) => 
          new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
        );
      } catch (error) {
        console.error('[Storage] Ошибка при чтении localStorage:', error);
        return [];
      }
    }
    
    return [];
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
    const safeInclude = (text: string) => (text || '').toLowerCase().includes(lowerQuery);
    
    return entries.filter(entry => 
      safeInclude(entry.situationDescription) ||
      safeInclude(entry.attentionFocus) ||
      safeInclude(entry.thoughts) ||
      safeInclude(entry.bodySensations) ||
      safeInclude(entry.actions) ||
      safeInclude(entry.futureActions)
    );
  },

  async saveEntries(entries: DiaryEntry[]): Promise<void> {
    const data = JSON.stringify(entries);
    console.log('[Storage] Сохранение записей, количество:', entries.length);

    // Всегда пытаемся сохранить в CloudStorage, если доступен
    if (isCloudStorageAvailable()) {
      const webApp = getTelegramWebApp()!;

      try {
        console.log('[Storage] Сохранение в CloudStorage...');
        await promisify<boolean>((callback) => {
          webApp.CloudStorage.setItem(STORAGE_KEY, data, (error, success) => {
            if (error) {
              console.error('[Storage] Ошибка CloudStorage.setItem:', error);
              callback(error, false);
            } else {
              console.log('[Storage] Данные успешно сохранены в CloudStorage, success:', success);
              callback(null, success);
            }
          });
        });
        console.log('[Storage] CloudStorage сохранение завершено успешно');
      } catch (error) {
        console.error('[Storage] Критическая ошибка при сохранении в CloudStorage:', error);
        // Продолжаем к сохранению в localStorage как резервная копия
      }
    }

    // Всегда сохраняем резервную копию в localStorage для надежности
    if (typeof window !== 'undefined') {
      try {
        console.log('[Storage] Сохранение резервной копии в localStorage...');
        localStorage.setItem(STORAGE_KEY, data);
        console.log('[Storage] Резервная копия сохранена в localStorage');
      } catch (error) {
        console.error('[Storage] Ошибка при сохранении в localStorage:', error);
      }
    }
  },
};

