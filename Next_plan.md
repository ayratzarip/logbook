# План миграции Soft Skills Engine: Logbook на Next.js/TypeScript

## 📋 Обзор проекта

**Soft Skills Engine: Logbook** - приложение для ведения дневника самонаблюдения, разработанное для застенчивых людей. Помогает структурированно анализировать ситуации, мысли, эмоции и действия для развития социальных навыков.

### Текущий стек (Flutter)
- Flutter/Dart
- SQLite (нативные платформы) + SharedPreferences (web)
- Provider (управление состоянием)
- Material Design 3

### Целевой стек (Next.js)
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- LocalStorage / IndexedDB для хранения данных
- Zustand или React Context для состояния
- shadcn/ui для компонентов

---

## 📁 Структура проекта Next.js

```
soft-skills-logbook-next/
├── app/
│   ├── layout.tsx              # Корневой layout с providers
│   ├── page.tsx                # Главная страница (HomeScreen)
│   ├── entry/
│   │   ├── new/
│   │   │   └── page.tsx        # Создание записи
│   │   └── [id]/
│   │       ├── page.tsx        # Просмотр записи (EntryDetailScreen)
│   │       └── edit/
│   │           └── page.tsx    # Редактирование записи
│   └── instructions/
│       └── page.tsx            # Страница инструкций
├── components/
│   ├── ui/                     # Базовые UI компоненты (shadcn)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── dialog.tsx
│   │   ├── slider.tsx
│   │   ├── radio-group.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── Header.tsx          # Шапка с логотипом и кнопками
│   │   └── ThemeToggle.tsx     # Переключатель темы
│   ├── diary/
│   │   ├── EntryCard.tsx       # Карточка записи в списке
│   │   ├── EntryList.tsx       # Список записей
│   │   ├── EntryDetail.tsx     # Детальный просмотр записи
│   │   ├── DetailCard.tsx      # Карточка поля записи
│   │   └── SearchBar.tsx       # Поиск по записям
│   ├── form/
│   │   ├── EntryFormStepper.tsx    # Многошаговая форма
│   │   ├── StepSituation.tsx       # Шаг 1: Описание ситуации
│   │   ├── StepAttention.tsx       # Шаг 2: Фокус внимания
│   │   ├── StepThoughts.tsx        # Шаг 3: Мысли
│   │   ├── StepBodySensations.tsx  # Шаг 4: Телесные ощущения
│   │   ├── StepActions.tsx         # Шаг 5: Действия
│   │   └── StepFutureActions.tsx   # Шаг 6: Что делать в будущем
│   └── instructions/
│       ├── VideoPlayer.tsx     # Компонент видео
│       ├── InstructionRow.tsx  # Строка инструкции
│       └── IconCard.tsx        # Карточка иконки
├── lib/
│   ├── types/
│   │   └── diary.ts            # TypeScript типы
│   ├── constants/
│   │   └── form-options.ts     # Константы для формы
│   ├── store/
│   │   ├── diary-store.ts      # Zustand store для записей
│   │   └── theme-store.ts      # Zustand store для темы
│   ├── services/
│   │   └── storage.ts          # Сервис работы с localStorage
│   └── utils/
│       ├── date.ts             # Утилиты для дат
│       └── csv-export.ts       # Экспорт в CSV
├── hooks/
│   ├── useDiary.ts             # Хук для работы с дневником
│   └── useTheme.ts             # Хук для работы с темой
├── public/
│   └── images/
│       └── logo.png            # Логотип приложения
├── styles/
│   └── globals.css             # Глобальные стили + Tailwind
├── tailwind.config.ts
├── next.config.js
├── package.json
└── tsconfig.json
```

---

## 📊 Модель данных

### TypeScript типы (lib/types/diary.ts)

```typescript
export interface DiaryEntry {
  id: string;                    // UUID вместо числового ID
  dateTime: string;              // ISO string
  situationDescription: string;
  attentionFocus: string;
  thoughts: string;
  bodySensations: string;
  actions: string;
  futureActions: string;
}

export type FormStep = 
  | 'situation'
  | 'attention'
  | 'thoughts'
  | 'bodySensations'
  | 'actions'
  | 'futureActions';

export interface FormState {
  currentStep: FormStep;
  situationDescription: string;
  selectedAttentionOption: string | null;
  attentionText: string;
  selectedThoughtOption: string | null;
  thoughtsText: string;
  bodySensationsIntensity: number;
  bodySensationsText: string;
  actionsText: string;
  selectedActionResult: string | null;
  selectedFutureActionOption: string | null;
  futureActionsText: string;
  entryDateTime: Date;
}
```

---

## 📝 Константы формы (lib/constants/form-options.ts)

```typescript
export const ATTENTION_FOCUS_OPTIONS = [
  'Сконцентрирован на зрительном образе',
  'Сконцентрирован на звуках',
  'Сконцентрирован на смысле',
  'Концентрируюсь на ощущениях своего тела',
  'Погружен в свои мысли',
  'Внимание скачет',
  'Внимание рассеянно',
];

export const THOUGHT_OPTIONS = [
  'Тревожные мысли будущем "А вдруг...."',
  'Переживания прошлого опыта',
  'Сожаление о прошлом "Ах если бы..."',
  'Ожидание оценки и самооценка',
  'Установки "Я должен..."',
  'Перегрузка планированием',
];

export const ACTION_RESULT_OPTIONS = [
  'Добились желаемого результата',
  'Не получили желаемый результат',
];

export const FUTURE_ACTION_OPTIONS = [
  'Знаю, что делать в подобных ситуациях',
  'Не знаю, что делать в подобных ситуациях',
];

export const ACTION_RESULT_SEPARATOR = '||RESULT:';
export const FUTURE_ACTION_SEPARATOR = '||FA_OPTION:';

export const FORM_STEPS: FormStep[] = [
  'situation',
  'attention',
  'thoughts',
  'bodySensations',
  'actions',
  'futureActions',
];

export const STEP_TITLES: Record<FormStep, string> = {
  situation: 'Описание ситуации',
  attention: 'Фокус внимания',
  thoughts: 'Ваши мысли',
  bodySensations: 'Телесные ощущения',
  actions: 'Ваши действия и результат',
  futureActions: 'Что делать в будущем?',
};
```

---

## 🎨 Цветовая схема и темы

### Tailwind конфигурация

```typescript
// tailwind.config.ts
const config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3A5BA0',  // глубокий синий
          light: '#6EC6F5',    // светло-голубой акцент
        },
        surface: {
          light: '#F6F8FB',
          dark: '#181C24',
        },
        card: {
          light: '#FFFFFF',
          dark: '#232A3B',
        },
        text: {
          primary: '#222B45',
          secondary: '#172554',
          muted: '#B0B8C1',
        },
        gradient: {
          start: {
            light: '#F2F2F7',
            dark: '#1C1C1E',
          },
          end: {
            light: '#E5E5EA',
            dark: '#2C2C2E',
          },
        },
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '18px',
        '3xl': '22px',
      },
    },
  },
};
```

---

## 🔧 Задачи по этапам

### Этап 1: Инициализация проекта

1. **Создать Next.js проект**
   ```bash
   npx create-next-app@latest soft-skills-logbook-next --typescript --tailwind --eslint --app --src-dir=false
   ```

2. **Установить зависимости**
   ```bash
   npm install zustand date-fns uuid
   npm install -D @types/uuid
   npx shadcn-ui@latest init
   npx shadcn-ui@latest add button card input textarea dialog slider radio-group toast
   ```

3. **Настроить шрифт Nunito** в `layout.tsx`

4. **Скопировать логотип** в `public/images/logo.png`

---

### Этап 2: Базовые типы и константы

1. Создать `lib/types/diary.ts` с интерфейсами
2. Создать `lib/constants/form-options.ts` с константами
3. Настроить Tailwind с кастомными цветами

---

### Этап 3: Сервисы и хранение данных

**lib/services/storage.ts:**

```typescript
import { DiaryEntry } from '@/lib/types/diary';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'diary_entries';

export const storageService = {
  getAllEntries(): DiaryEntry[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const entries = JSON.parse(data) as DiaryEntry[];
    return entries.sort((a, b) => 
      new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
    );
  },

  getEntry(id: string): DiaryEntry | null {
    const entries = this.getAllEntries();
    return entries.find(e => e.id === id) || null;
  },

  insertEntry(entry: Omit<DiaryEntry, 'id'>): DiaryEntry {
    const entries = this.getAllEntries();
    const newEntry: DiaryEntry = { ...entry, id: uuidv4() };
    entries.push(newEntry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return newEntry;
  },

  updateEntry(entry: DiaryEntry): boolean {
    const entries = this.getAllEntries();
    const index = entries.findIndex(e => e.id === entry.id);
    if (index === -1) return false;
    entries[index] = entry;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return true;
  },

  deleteEntry(id: string): boolean {
    const entries = this.getAllEntries();
    const filtered = entries.filter(e => e.id !== id);
    if (filtered.length === entries.length) return false;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  searchEntries(query: string): DiaryEntry[] {
    const entries = this.getAllEntries();
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
};
```

---

### Этап 4: Zustand Store

**lib/store/diary-store.ts:**

```typescript
import { create } from 'zustand';
import { DiaryEntry } from '@/lib/types/diary';
import { storageService } from '@/lib/services/storage';

interface DiaryState {
  entries: DiaryEntry[];
  isLoading: boolean;
  searchQuery: string;
  
  // Actions
  loadEntries: () => void;
  addEntry: (entry: Omit<DiaryEntry, 'id'>) => Promise<void>;
  updateEntry: (entry: DiaryEntry) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  
  // Computed
  filteredEntries: () => DiaryEntry[];
}

export const useDiaryStore = create<DiaryState>((set, get) => ({
  entries: [],
  isLoading: false,
  searchQuery: '',

  loadEntries: () => {
    set({ isLoading: true });
    const entries = storageService.getAllEntries();
    set({ entries, isLoading: false });
  },

  addEntry: async (entry) => {
    storageService.insertEntry(entry);
    get().loadEntries();
  },

  updateEntry: async (entry) => {
    storageService.updateEntry(entry);
    get().loadEntries();
  },

  deleteEntry: async (id) => {
    storageService.deleteEntry(id);
    get().loadEntries();
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  clearSearch: () => set({ searchQuery: '' }),

  filteredEntries: () => {
    const { entries, searchQuery } = get();
    if (!searchQuery) return entries;
    return storageService.searchEntries(searchQuery);
  },
}));
```

**lib/store/theme-store.ts:**

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
      },
      setTheme: (theme) => {
        set({ theme });
        document.documentElement.classList.toggle('dark', theme === 'dark');
      },
    }),
    { name: 'theme-storage' }
  )
);
```

---

### Этап 5: Layout и базовые компоненты

**app/layout.tsx:**
- Подключение шрифта Nunito
- ThemeProvider
- Toaster для уведомлений

**components/layout/Header.tsx:**
- Логотип + название
- Кнопка переключения темы (🌙/☀️)
- Кнопка инструкций (❓)
- Кнопка экспорта в CSV (⬇️)

**components/layout/ThemeToggle.tsx:**
- Переключатель светлой/тёмной темы

---

### Этап 6: Главная страница (HomeScreen)

**app/page.tsx:**

Функциональность:
- Поле поиска с очисткой
- Список записей (EntryList)
- Пустое состояние с иконкой и текстом
- FAB кнопка "Новая запись" с градиентом
- Загрузка данных при монтировании

**components/diary/SearchBar.tsx:**
- Input с иконкой поиска
- Кнопка очистки (если есть текст)
- Debounce для поиска

**components/diary/EntryList.tsx:**
- Маппинг записей в EntryCard
- Пустое состояние

**components/diary/EntryCard.tsx:**
- Градиентный фон карточки
- Цветная полоска слева
- Дата и время с иконкой
- Заголовок "Ситуация" + превью текста
- Popup меню (редактировать / удалить)
- Клик -> переход на детальную страницу

---

### Этап 7: Страница просмотра записи (EntryDetailScreen)

**app/entry/[id]/page.tsx:**

Функциональность:
- Загрузка записи по ID
- Отображение всех полей в карточках DetailCard
- AppBar с popup меню (редактировать / удалить)
- FAB кнопка "Редактировать"

**components/diary/DetailCard.tsx:**
- Иконка + заголовок
- Контент в затемнённом блоке
- Тени и скругления

**Поля для отображения:**
1. Дата и время записи (Icons: access_time)
2. Описание ситуации (Icons: description)
3. Фокус внимания (Icons: center_focus_strong)
4. Мысли (Icons: psychology)
5. Телесные ощущения (Icons: accessibility_new)
6. Действия (Icons: directions_run)
7. Что делать в будущем (Icons: lightbulb)

---

### Этап 8: Многошаговая форма (EntryFormStepper)

**app/entry/new/page.tsx и app/entry/[id]/edit/page.tsx:**

Обёртки для EntryFormStepper с/без начальных данных.

**components/form/EntryFormStepper.tsx:**

Логика:
- PageView аналог через состояние currentStep
- Валидация каждого шага перед переходом
- Кнопки "Назад" / "Далее" / "Сохранить"
- Индикатор "Шаг X из 6"
- Условная логика: если выбран "Добились желаемого результата" -> сохранить сразу без шага 6

**Шаги формы:**

1. **StepSituation** (Описание ситуации)
   - Textarea для описания
   - Отображение даты/времени

2. **StepAttention** (Фокус внимания)
   - RadioGroup с 7 вариантами
   - Textarea для уточнений

3. **StepThoughts** (Мысли)
   - RadioGroup с 6 вариантами
   - Textarea для уточнений

4. **StepBodySensations** (Телесные ощущения)
   - Slider 0-10 с градиентом (зелёный → жёлтый → красный)
   - Textarea для описания ощущений

5. **StepActions** (Действия и результат)
   - Textarea для описания действий
   - RadioGroup с 2 вариантами результата

6. **StepFutureActions** (Что делать в будущем?)
   - RadioGroup с 2 вариантами
   - Условное Textarea (только если "Знаю, что делать")

---

### Этап 9: Страница инструкций

**app/instructions/page.tsx:**

Функциональность:
- Видео-инструкция (Vimeo embed): `https://player.vimeo.com/video/1041570908`
- Кнопка воспроизведения с градиентом
- Раздел "Как вести журнал" с иконками и описаниями
- Раздел "Что означают иконки"

**components/instructions/VideoPlayer.tsx:**
- iframe с Vimeo
- Модальное окно или отдельная страница

**components/instructions/InstructionRow.tsx:**
- Иконка + заголовок + описание

**components/instructions/IconCard.tsx:**
- Карточка с иконкой и описанием функции

---

### Этап 10: Экспорт в CSV

**lib/utils/csv-export.ts:**

```typescript
import { DiaryEntry } from '@/lib/types/diary';
import { format } from 'date-fns';

function sanitizeCsvField(text: string): string {
  if (text.includes(',') || text.includes('"') || text.includes('\n')) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function exportToCsv(entries: DiaryEntry[]): void {
  if (entries.length === 0) return;

  const headers = [
    'id', 'dateTime', 'situationDescription', 'attentionFocus',
    'thoughts', 'bodySensations', 'actions', 'futureActions'
  ];

  const rows = entries.map(entry => [
    sanitizeCsvField(entry.id),
    sanitizeCsvField(format(new Date(entry.dateTime), 'yyyy-MM-dd HH:mm:ss')),
    sanitizeCsvField(entry.situationDescription),
    sanitizeCsvField(entry.attentionFocus),
    sanitizeCsvField(entry.thoughts),
    sanitizeCsvField(entry.bodySensations),
    sanitizeCsvField(entry.actions),
    sanitizeCsvField(entry.futureActions),
  ].join(','));

  const csvContent = [headers.join(','), ...rows].join('\n');
  
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `soft_skills_logbook_export_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
```

---

### Этап 11: Диалоги и уведомления

- **DeleteDialog**: Подтверждение удаления записи
- **Toast уведомления**:
  - "Запись сохранена" (зелёный)
  - "Запись обновлена" (зелёный)
  - "Запись удалена" (оранжевый/красный)
  - "Нет записей для экспорта" (предупреждение)
  - Ошибки валидации (оранжевый)

---

### Этап 12: Финальная полировка

1. **Анимации:**
   - Плавные переходы между шагами формы
   - Hover эффекты на карточках
   - Анимация появления элементов

2. **Адаптивность:**
   - Mobile-first дизайн
   - Адаптивные отступы и размеры

3. **Accessibility:**
   - Aria-labels
   - Keyboard navigation
   - Focus states

4. **SEO и метаданные:**
   - Title и description
   - Open Graph теги

---

## ✅ Чеклист готовности

- [ ] Инициализация Next.js проекта
- [ ] Настройка Tailwind с кастомными цветами
- [ ] Установка shadcn/ui компонентов
- [ ] Типы TypeScript
- [ ] Константы формы
- [ ] Storage service (localStorage)
- [ ] Zustand stores (diary + theme)
- [ ] Layout с Header
- [ ] Главная страница со списком записей
- [ ] Поиск по записям
- [ ] Карточки записей с popup меню
- [ ] Страница детального просмотра
- [ ] Многошаговая форма создания
- [ ] Редактирование существующих записей
- [ ] Удаление записей с подтверждением
- [ ] Страница инструкций
- [ ] Видео-плеер Vimeo
- [ ] Экспорт в CSV
- [ ] Светлая/тёмная тема
- [ ] Toast уведомления
- [ ] Адаптивный дизайн
- [ ] Тестирование всей функциональности

---

## 🎯 Ключевые особенности для реализации

### 1. Градиенты
Использовать CSS градиенты для:
- FAB кнопок (`from-[#3A5BA0] to-[#6EC6F5]`)
- Полоски слева в карточках
- Кнопки воспроизведения видео
- Кнопки "Далее/Сохранить"

### 2. Слайдер интенсивности
Кастомный слайдер с градиентным треком:
- 0-3: зелёный
- 4-7: оранжевый
- 8-10: красный

### 3. Условная логика формы
- Если на шаге "Действия" выбран "Добились желаемого результата" → пропустить шаг "Что делать в будущем" и сохранить сразу
- На шаге "Что делать в будущем" показывать textarea только если выбран "Знаю, что делать"

### 4. Парсинг сохранённых данных
При редактировании восстанавливать:
- Выбранную radio-опцию из сохранённого текста
- Интенсивность из строки "5. Описание ощущений"
- Результат действий из разделителя `||RESULT:`
- Опцию будущих действий из разделителя `||FA_OPTION:`

### 5. Локализация дат
Использовать `date-fns` с русской локалью для форматирования дат:
- В списке: `dd.MM.yyyy HH:mm`
- В детальном просмотре: `dd MMMM yyyy, HH:mm` (на русском)

---

## 📱 Responsive Breakpoints

```css
/* Mobile first */
sm: 640px   /* Небольшие планшеты */
md: 768px   /* Планшеты */
lg: 1024px  /* Ноутбуки */
xl: 1280px  /* Десктопы */
```

---

## 🚀 Команды для запуска

```bash
# Разработка
npm run dev

# Сборка
npm run build

# Продакшен
npm start

# Линтинг
npm run lint
```

---

*Документ создан для AI-агента. Следуйте этапам последовательно, проверяя каждый этап перед переходом к следующему.*

