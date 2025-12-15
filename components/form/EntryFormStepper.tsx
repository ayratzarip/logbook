'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FormState, FormStep, DiaryEntry } from '@/lib/types/diary';
import { FORM_STEPS, STEP_TITLES, ACTION_RESULT_OPTIONS } from '@/lib/constants/form-options';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StepSituation } from './StepSituation';
import { StepAttention } from './StepAttention';
import { StepThoughts } from './StepThoughts';
import { StepBodySensations } from './StepBodySensations';
import { StepActions } from './StepActions';
import { StepFutureActions } from './StepFutureActions';
import { formStateToEntry } from '@/lib/utils/form-parser';
import { useDiaryStore } from '@/lib/store/diary-store';
import { getTelegramWebApp } from '@/lib/utils/telegram';

interface EntryFormStepperProps {
  initialEntry?: DiaryEntry | null;
}

export function EntryFormStepper({ initialEntry }: EntryFormStepperProps) {
  const router = useRouter();
  const addEntry = useDiaryStore((state) => state.addEntry);
  const updateEntry = useDiaryStore((state) => state.updateEntry);

  const [formState, setFormState] = useState<FormState>(() => ({
    currentStep: 'situation',
    situationDescription: initialEntry?.situationDescription || '',
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
    entryDateTime: initialEntry ? new Date(initialEntry.dateTime) : new Date(),
  }));

  // Парсим начальные данные, если есть
  useEffect(() => {
    if (initialEntry) {
      // Простой парсинг для редактирования
      setFormState((prev) => ({
        ...prev,
        situationDescription: initialEntry.situationDescription,
        attentionText: initialEntry.attentionFocus,
        thoughtsText: initialEntry.thoughts,
        bodySensationsText: initialEntry.bodySensations.replace(/^\d+\.\s*/, ''),
        bodySensationsIntensity: parseInt(initialEntry.bodySensations.match(/^(\d+)/)?.[1] || '0', 10),
        actionsText: initialEntry.actions.split(/\|\|RESULT:/)[0].trim(),
        futureActionsText: initialEntry.futureActions.split(/\|\|FA_OPTION:/)[1]?.trim() || '',
      }));
    }
  }, [initialEntry]);

  const currentStepIndex = FORM_STEPS.indexOf(formState.currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === FORM_STEPS.length - 1;

  const validateStep = (step: FormStep): boolean => {
    switch (step) {
      case 'situation':
        return formState.situationDescription.trim().length > 0;
      case 'attention':
        return true; // Опционально
      case 'thoughts':
        return true; // Опционально
      case 'bodySensations':
        return formState.bodySensationsText.trim().length > 0;
      case 'actions':
        return formState.actionsText.trim().length > 0 && formState.selectedActionResult !== null;
      case 'futureActions':
        if (formState.selectedFutureActionOption === null) return false;
        if (formState.selectedFutureActionOption === 'Знаю, что делать в подобных ситуациях') {
          return formState.futureActionsText.trim().length > 0;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep(formState.currentStep)) {
      const webApp = getTelegramWebApp();
      if (webApp) {
        webApp.showAlert('Пожалуйста, заполните обязательные поля');
        webApp.HapticFeedback.notificationOccurred('error');
      } else {
        alert('Пожалуйста, заполните обязательные поля');
      }
      return;
    }

    // Проверяем, нужно ли пропустить последний шаг
    if (formState.currentStep === 'actions' && formState.selectedActionResult === ACTION_RESULT_OPTIONS[0]) {
      // "Добились желаемого результата" - сохраняем сразу
      handleSave();
      return;
    }

    if (!isLastStep) {
      const nextStepIndex = currentStepIndex + 1;
      setFormState((prev) => ({
        ...prev,
        currentStep: FORM_STEPS[nextStepIndex],
      }));
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      const prevStepIndex = currentStepIndex - 1;
      setFormState((prev) => ({
        ...prev,
        currentStep: FORM_STEPS[prevStepIndex],
      }));
    }
  };

  const handleSave = async () => {
    if (!validateStep(formState.currentStep)) {
      const webApp = getTelegramWebApp();
      if (webApp) {
        webApp.showAlert('Пожалуйста, заполните обязательные поля');
      } else {
        alert('Пожалуйста, заполните обязательные поля');
      }
      return;
    }

    try {
      const entryData = formStateToEntry(formState);

      if (initialEntry) {
        await updateEntry({ ...entryData, id: initialEntry.id });
      } else {
        await addEntry(entryData);
      }

      const webApp = getTelegramWebApp();
      if (webApp) {
        webApp.HapticFeedback.notificationOccurred('success');
        webApp.showAlert(initialEntry ? 'Запись обновлена' : 'Запись сохранена', () => {
          router.push('/');
        });
      } else {
        alert(initialEntry ? 'Запись обновлена' : 'Запись сохранена');
        router.push('/');
      }
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      const webApp = getTelegramWebApp();
      if (webApp) {
        webApp.showAlert('Не удалось сохранить запись');
        webApp.HapticFeedback.notificationOccurred('error');
      } else {
        alert('Не удалось сохранить запись');
      }
    }
  };

  const renderStep = () => {
    switch (formState.currentStep) {
      case 'situation':
        return (
          <StepSituation
            value={formState.situationDescription}
            onChange={(value) => setFormState((prev) => ({ ...prev, situationDescription: value }))}
            dateTime={formState.entryDateTime}
          />
        );
      case 'attention':
        return (
          <StepAttention
            selectedOption={formState.selectedAttentionOption}
            text={formState.attentionText}
            onOptionChange={(option) => setFormState((prev) => ({ ...prev, selectedAttentionOption: option }))}
            onTextChange={(text) => setFormState((prev) => ({ ...prev, attentionText: text }))}
          />
        );
      case 'thoughts':
        return (
          <StepThoughts
            selectedOption={formState.selectedThoughtOption}
            text={formState.thoughtsText}
            onOptionChange={(option) => setFormState((prev) => ({ ...prev, selectedThoughtOption: option }))}
            onTextChange={(text) => setFormState((prev) => ({ ...prev, thoughtsText: text }))}
          />
        );
      case 'bodySensations':
        return (
          <StepBodySensations
            intensity={formState.bodySensationsIntensity}
            text={formState.bodySensationsText}
            onIntensityChange={(intensity) => setFormState((prev) => ({ ...prev, bodySensationsIntensity: intensity }))}
            onTextChange={(text) => setFormState((prev) => ({ ...prev, bodySensationsText: text }))}
          />
        );
      case 'actions':
        return (
          <StepActions
            text={formState.actionsText}
            selectedResult={formState.selectedActionResult}
            onTextChange={(text) => setFormState((prev) => ({ ...prev, actionsText: text }))}
            onResultChange={(result) => setFormState((prev) => ({ ...prev, selectedActionResult: result }))}
          />
        );
      case 'futureActions':
        return (
          <StepFutureActions
            selectedOption={formState.selectedFutureActionOption}
            text={formState.futureActionsText}
            onOptionChange={(option) => setFormState((prev) => ({ ...prev, selectedFutureActionOption: option }))}
            onTextChange={(text) => setFormState((prev) => ({ ...prev, futureActionsText: text }))}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Индикатор шага */}
      <div className="text-center">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Шаг {currentStepIndex + 1} из {FORM_STEPS.length}
        </div>
        <h2 className="text-xl font-semibold text-text-primary dark:text-white mt-1">
          {STEP_TITLES[formState.currentStep]}
        </h2>
      </div>

      {/* Прогресс бар */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-[#3A5BA0] to-[#6EC6F5] h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentStepIndex + 1) / FORM_STEPS.length) * 100}%` }}
        />
      </div>

      {/* Контент шага */}
      <Card>
        <CardContent className="pt-6">
          {renderStep()}
        </CardContent>
      </Card>

      {/* Кнопки навигации */}
      <div className="flex justify-between gap-4">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={isFirstStep}
        >
          Назад
        </Button>
        {isLastStep || (formState.currentStep === 'actions' && formState.selectedActionResult === ACTION_RESULT_OPTIONS[0]) ? (
          <Button
            variant="gradient"
            onClick={handleSave}
          >
            Сохранить
          </Button>
        ) : (
          <Button
            variant="gradient"
            onClick={handleNext}
          >
            Далее
          </Button>
        )}
      </div>
    </div>
  );
}

