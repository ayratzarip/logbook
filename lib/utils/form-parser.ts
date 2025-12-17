import { DiaryEntry } from '@/lib/types/diary';
import {
  ATTENTION_FOCUS_OPTIONS,
  THOUGHT_OPTIONS,
  ACTION_RESULT_OPTIONS,
  FUTURE_ACTION_OPTIONS,
  ACTION_RESULT_SEPARATOR,
  FUTURE_ACTION_SEPARATOR,
} from '@/lib/constants/form-options';
import { FormState, FormStep } from '@/lib/types/diary';

export function parseEntryToFormState(entry: DiaryEntry | null): Partial<FormState> {
  if (!entry) {
    return {
      currentStep: 'situation',
      situationDescription: '',
      selectedAttentionOption: null,
      attentionText: '',
      selectedThoughtOption: null,
      thoughtsText: '',
      bodySensationsIntensity: 0,
      bodySensationsText: '',
      actionsText: '',
      selectedActionResult: null,
      selectedFutureActionOption: null,
      futureActionsText: '',
      entryDateTime: new Date(),
    };
  }

  // Парсинг фокуса внимания
  let selectedAttentionOption: string | null = null;
  let attentionText = entry.attentionFocus;
  for (const option of ATTENTION_FOCUS_OPTIONS) {
    if (entry.attentionFocus.startsWith(option)) {
      selectedAttentionOption = option;
      attentionText = entry.attentionFocus.substring(option.length).trim();
      break;
    }
  }

  // Парсинг мыслей
  let selectedThoughtOption: string | null = null;
  let thoughtsText = entry.thoughts;
  for (const option of THOUGHT_OPTIONS) {
    if (entry.thoughts.startsWith(option)) {
      selectedThoughtOption = option;
      thoughtsText = entry.thoughts.substring(option.length).trim();
      break;
    }
  }

  // Парсинг телесных ощущений (формат: "5. Описание ощущений")
  let bodySensationsIntensity = 0;
  let bodySensationsText = entry.bodySensations;
  const intensityMatch = entry.bodySensations.match(/^(\d+)\./);
  if (intensityMatch) {
    bodySensationsIntensity = parseInt(intensityMatch[1], 10);
    bodySensationsText = entry.bodySensations.substring(intensityMatch[0].length).trim();
  }

  // Парсинг действий (поддерживаем старый формат ||RESULT: и новый Результат:)
  let actionsText = entry.actions;
  let selectedActionResult: string | null = null;
  const oldSeparator = '||RESULT:';
  const separator = entry.actions.includes(ACTION_RESULT_SEPARATOR) 
    ? ACTION_RESULT_SEPARATOR 
    : (entry.actions.includes(oldSeparator) ? oldSeparator : null);
  
  if (separator) {
    const parts = entry.actions.split(separator);
    actionsText = parts[0].trim();
    const resultText = parts[1]?.trim();
    if (resultText && ACTION_RESULT_OPTIONS.includes(resultText)) {
      selectedActionResult = resultText;
    }
  }

  // Парсинг будущих действий (поддерживаем старый формат ||FA_OPTION: и новый Что делать в будущем:)
  let futureActionsText = entry.futureActions;
  let selectedFutureActionOption: string | null = null;
  const oldFutureSeparator = '||FA_OPTION:';
  const futureSeparator = entry.futureActions.includes(FUTURE_ACTION_SEPARATOR)
    ? FUTURE_ACTION_SEPARATOR
    : (entry.futureActions.includes(oldFutureSeparator) ? oldFutureSeparator : null);
  
  if (futureSeparator) {
    const parts = entry.futureActions.split(futureSeparator);
    const optionText = parts[0]?.trim();
    if (optionText && FUTURE_ACTION_OPTIONS.includes(optionText)) {
      selectedFutureActionOption = optionText;
      futureActionsText = parts[1]?.trim() || '';
    }
  } else {
    // Проверяем, начинается ли с одного из вариантов
    for (const option of FUTURE_ACTION_OPTIONS) {
      if (entry.futureActions.startsWith(option)) {
        selectedFutureActionOption = option;
        futureActionsText = entry.futureActions.substring(option.length).trim();
        break;
      }
    }
  }

  return {
    currentStep: 'situation',
    situationDescription: entry.situationDescription,
    selectedAttentionOption,
    attentionText,
    selectedThoughtOption,
    thoughtsText,
    bodySensationsIntensity,
    bodySensationsText,
    actionsText,
    selectedActionResult,
    selectedFutureActionOption,
    futureActionsText,
    entryDateTime: new Date(entry.dateTime),
  };
}

export function formStateToEntry(formState: FormState): Omit<DiaryEntry, 'id'> {
  // Формируем фокус внимания
  let attentionFocus = formState.selectedAttentionOption || '';
  if (formState.attentionText) {
    attentionFocus = attentionFocus ? `${attentionFocus} ${formState.attentionText}` : formState.attentionText;
  }

  // Формируем мысли
  let thoughts = formState.selectedThoughtOption || '';
  if (formState.thoughtsText) {
    thoughts = thoughts ? `${thoughts} ${formState.thoughtsText}` : formState.thoughtsText;
  }

  // Формируем телесные ощущения
  const bodySensations = formState.bodySensationsIntensity > 0
    ? `${formState.bodySensationsIntensity}. ${formState.bodySensationsText}`
    : formState.bodySensationsText;

  // Формируем действия
  let actions = formState.actionsText;
  if (formState.selectedActionResult) {
    actions += ` ${ACTION_RESULT_SEPARATOR} ${formState.selectedActionResult}`;
  }

  // Формируем будущие действия
  let futureActions = '';
  if (formState.selectedFutureActionOption) {
    futureActions = formState.selectedFutureActionOption;
    if (formState.futureActionsText) {
      futureActions += ` ${FUTURE_ACTION_SEPARATOR} ${formState.futureActionsText}`;
    }
  } else {
    futureActions = formState.futureActionsText;
  }

  return {
    dateTime: formState.entryDateTime.toISOString(),
    situationDescription: formState.situationDescription,
    attentionFocus,
    thoughts,
    bodySensations,
    actions,
    futureActions,
  };
}

