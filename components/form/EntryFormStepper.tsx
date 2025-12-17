'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormState, FormStep, DiaryEntry } from '@/lib/types/diary';
import { FORM_STEPS, STEP_TITLES, ACTION_RESULT_OPTIONS } from '@/lib/constants/form-options';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { StepSituation } from './StepSituation';
import { StepAttention } from './StepAttention';
import { StepThoughts } from './StepThoughts';
import { StepBodySensations } from './StepBodySensations';
import { StepActions } from './StepActions';
import { StepFutureActions } from './StepFutureActions';
import { formStateToEntry } from '@/lib/utils/form-parser';
import { useDiaryStore } from '@/lib/store/diary-store';
import { getTelegramWebApp } from '@/lib/utils/telegram';

// Подсказки для каждого шага формы
const STEP_HINTS: Record<FormStep, { title: string; content: React.ReactNode }> = {
  situation: {
    title: 'Описание ситуации',
    content: (
      <div className="space-y-3 text-sm">
        <p>Старайтесь записывать максимально кратко. Если писать подробно, то, во-первых, Вы быстрее устанете, во-вторых, удобнее анализировать схематичные записи.</p>
        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
          <p className="font-semibold mb-2">Примеры:</p>
          <p> Первый день в Инфотехлаб. Вхожу в офис.</p>
          <p> Первое свидание с Ксюшей. В кафе Лакомка.</p>
        </div>
      </div>
    ),
  },
  attention: {
    title: 'Фокус внимания',
    content: (
      <div className="space-y-3 text-sm">
        <p>В зависимости от того, куда направлено внимание, будут развиваться дальнейшие процессы в голове и в теле.</p>
        <p className="font-semibold">Куда может быть направлено внимание:</p>
        <ul className="list-decimal pl-5 space-y-1">
          <li><strong>На зрительном образе</strong> (увидели мятую рубашку, или как вьются волосы).</li>
          <li><strong>На звуках</strong> (шум кондиционера, тембр голоса).</li>
          <li><strong>На смысле</strong> (слушаете коллегу про столовую).</li>
          <li><strong>На ощущениях тела</strong> (проверяете не покраснели ли вы).</li>
          <li><strong>Погружен в мысли</strong> (оперируете выдуманными вещами).</li>
          <li><strong>Внимание скачет</strong> (хаос в голове, «бегающий взгляд»).</li>
          <li><strong>Внимание рассеянно</strong> (полусон, отключение).</li>
        </ul>
        <p className="text-xs italic">Первые три варианта считаются оптимальными.</p>
      </div>
    ),
  },
  thoughts: {
    title: 'Мысли',
    content: (
      <div className="space-y-3 text-sm">
        <p>Мысли – это когнитивные процессы, скрытые от внешнего наблюдателя. Если сложно выявить мысли, запишите самое логичное или представьте «облачко» над головой персонажа.</p>
        <p className="font-semibold">Виды мыслей:</p>
        <ul className="list-decimal pl-5 space-y-1">
          <li><strong>Тревожные мысли о будущем</strong> – «А вдруг...»</li>
          <li><strong>Переживания прошлого</strong> – вспышки воспоминаний.</li>
          <li><strong>Сожаления о прошлом</strong> – «Ах, если бы...»</li>
          <li><strong>Ожидания оценки</strong> – «Какой я?», «Как они подумали?»</li>
          <li><strong>Установки</strong> – «Я должен», глубинные правила.</li>
          <li><strong>Перегрузка планированием</strong> – попытка всё спрогнозировать.</li>
          <li><strong>Мыслил «линейно»</strong> – поглощён одной идеей (к этому стремимся).</li>
        </ul>
      </div>
    ),
  },
  bodySensations: {
    title: 'Телесные ощущения',
    content: (
      <div className="space-y-3 text-sm">
        <p>Биологический смысл — подготовка к действию (убежать, напасть). Нужно подготовить тело: тонус мышц, глюкоза, кислород.</p>
        <p className="font-semibold">Как описать телесные ощущения:</p>
        <ul className="list-decimal pl-5 space-y-1">
          <li>Быстро сканируем мышцы тела (стопы, лоб, пресс, шея, лицо).</li>
          <li>Оцениваем сердцебиение.</li>
          <li>Оцениваем дыхание.</li>
          <li>Ощущения в животе и малом тазу.</li>
          <li>Кожа (жарко, холодно, пот).</li>
        </ul>
        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md mt-2">
          <p className="font-semibold mb-1">Пример:</p>
          <p>Весь напрягся, сердце стучало, покраснело лицо, вспотел.</p>
        </div>
      </div>
    ),
  },
  actions: {
    title: 'Ваши действия и результат',
    content: (
      <div className="space-y-3 text-sm">
        <p>Оцениваем правильность действий по результату, а не по абстрактным правилам. Если результат получен — действие эффективно.</p>
        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
          <p className="font-semibold mb-2">Примеры:</p>
          <p><strong>Неуспех:</strong> Молча подошёл к своему столу и сел.</p>
          <p><strong>Успех:</strong> Слушал её, рассказал историю про свою собаку.</p>
        </div>
      </div>
    ),
  },
  futureActions: {
    title: 'Что делать в будущем?',
    content: (
      <div className="space-y-3 text-sm">
        <ul className="list-disc pl-5 space-y-2">
          <li>Если не знаете, как поступать — нажимаем «Не знаю». Позже это обсудим.</li>
          <li>Если знаете — записываете план действий.</li>
        </ul>
        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
          <p className="font-semibold mb-1">Пример:</p>
          <p>При входе поздороваться, представиться, фиксируя внимание на лицах новых коллег.</p>
        </div>
      </div>
    ),
  },
};

interface EntryFormStepperProps {
  initialEntry?: DiaryEntry | null;
}

export function EntryFormStepper({ initialEntry }: EntryFormStepperProps) {
  const router = useRouter();
  const addEntry = useDiaryStore((state) => state.addEntry);
  const updateEntry = useDiaryStore((state) => state.updateEntry);

  const [hintOpen, setHintOpen] = useState(false);

  const [formState, setFormState] = useState<FormState>(() => {
    // Если есть initialEntry, парсим все данные сразу при инициализации
    if (initialEntry) {
      return {
        currentStep: 'situation' as FormStep,
        situationDescription: initialEntry.situationDescription,
        selectedAttentionOption: null,
        attentionText: initialEntry.attentionFocus,
        selectedThoughtOption: null,
        thoughtsText: initialEntry.thoughts,
        bodySensationsIntensity: parseInt(initialEntry.bodySensations.match(/^(\d+)/)?.[1] || '0', 10),
        bodySensationsText: initialEntry.bodySensations.replace(/^\d+\.\s*/, ''),
        actionsText: initialEntry.actions.split(/\|\|RESULT:/)[0].trim(),
        selectedActionResult: null,
        selectedFutureActionOption: null,
        futureActionsText: initialEntry.futureActions.split(/\|\|FA_OPTION:/)[1]?.trim() || '',
        entryDateTime: new Date(initialEntry.dateTime),
      };
    }

    // Значения по умолчанию для новой записи
    return {
      currentStep: 'situation' as FormStep,
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
  });

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
      if (webApp && typeof webApp.showAlert === 'function') {
        webApp.showAlert('Пожалуйста, заполните обязательные поля');
        webApp.HapticFeedback?.notificationOccurred?.('error');
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
      if (webApp && typeof webApp.showAlert === 'function') {
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
      if (webApp && typeof webApp.showAlert === 'function') {
        webApp.HapticFeedback?.notificationOccurred?.('success');
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
      if (webApp && typeof webApp.showAlert === 'function') {
        webApp.showAlert('Не удалось сохранить запись');
        webApp.HapticFeedback?.notificationOccurred?.('error');
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
        <div className="text-caption">
          Шаг {currentStepIndex + 1} из {FORM_STEPS.length}
        </div>
        <div className="flex items-center justify-center gap-2 mt-1">
          <h2 className="text-h1">
            {STEP_TITLES[formState.currentStep]}
          </h2>
          <button
            type="button"
            onClick={() => setHintOpen(true)}
            className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center text-sm font-medium"
            aria-label="Подсказка"
          >
            ?
          </button>
        </div>
      </div>

      {/* Модальное окно с подсказкой */}
      <Dialog
        open={hintOpen}
        onOpenChange={setHintOpen}
        title={STEP_HINTS[formState.currentStep].title}
      >
        <DialogContent>
          {STEP_HINTS[formState.currentStep].content}
        </DialogContent>
        <DialogFooter>
          <Button variant="primary" onClick={() => setHintOpen(false)}>
            Понятно
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Прогресс бар */}
      <div className="w-full bg-gray-90 dark:bg-gray-35 rounded-full h-2">
        <div
          className="bg-brand-70 h-2 rounded-full transition-all duration-300"
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
          variant="secondary"
          onClick={handleBack}
          disabled={isFirstStep}
        >
          Назад
        </Button>
        {isLastStep || (formState.currentStep === 'actions' && formState.selectedActionResult === ACTION_RESULT_OPTIONS[0]) ? (
          <Button
            variant="primary"
            onClick={handleSave}
          >
            Сохранить
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleNext}
          >
            Далее
          </Button>
        )}
      </div>
    </div>
  );
}

