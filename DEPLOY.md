# Инструкции по деплою на GitHub Pages

## Быстрый старт

### Вариант 1: Автоматический деплой (рекомендуется)

1. **Включите GitHub Pages:**
   - Откройте репозиторий на GitHub
   - Перейдите в `Settings` → `Pages`
   - В разделе `Source` выберите `GitHub Actions`
   - Сохраните изменения

2. **Запушьте изменения:**
   ```bash
   git add .
   git commit -m "Настройка деплоя на GitHub Pages"
   git push origin main
   ```

3. **Проверьте деплой:**
   - Перейдите в `Actions` в репозитории
   - Дождитесь завершения workflow `Deploy to GitHub Pages`
   - Приложение будет доступно по адресу: `https://ayratzarip.github.io/logbook/`

### Вариант 2: Ручной деплой

```bash
# Установите зависимости (если еще не установлены)
npm install

# Соберите и задеплойте
npm run deploy
```

## Настройка Telegram Mini App

После успешного деплоя:

1. Откройте [@BotFather](https://t.me/BotFather) в Telegram
2. Отправьте команду `/mybots`
3. Выберите вашего бота
4. Выберите `Bot Settings` → `Configure Mini App`
5. Введите URL: `https://ayratzarip.github.io/logbook/`
6. Сохраните изменения

## Локальная проверка перед деплоем

Для проверки сборки локально:

```bash
# Сборка для GitHub Pages
npm run build:gh-pages

# Запуск локального сервера для проверки (требует установки serve)
npx serve out
```

Откройте `http://localhost:3000/logbook` в браузере для проверки.

## Устранение проблем

### Проблема: Страница не загружается

- Убедитесь, что в настройках репозитория включен GitHub Pages
- Проверьте, что workflow завершился успешно в разделе `Actions`
- Убедитесь, что используется правильный URL с путем `/logbook`

### Проблема: Статические ресурсы не загружаются

- Проверьте, что в `next.config.ts` установлены `basePath` и `assetPrefix`
- Убедитесь, что файл `.nojekyll` находится в папке `public/`

### Проблема: Telegram Mini App не работает

- Убедитесь, что URL начинается с `https://`
- Проверьте, что приложение доступно в браузере
- Убедитесь, что в настройках бота указан правильный URL

## Структура файлов после сборки

После выполнения `npm run build:gh-pages` создается папка `out/` со статическими файлами:

```
out/
├── _next/
├── entry/
├── instructions/
├── index.html
├── manifest.json
└── ...
```

Эта папка автоматически публикуется на GitHub Pages через GitHub Actions.
