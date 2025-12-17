import { FormStep } from '@/lib/types/diary';

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

export const ACTION_RESULT_SEPARATOR = 'Результат:';
export const FUTURE_ACTION_SEPARATOR = 'Что делать в будущем:';

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

