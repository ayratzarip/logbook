'use client';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { FUTURE_ACTION_OPTIONS } from '@/lib/constants/form-options';

interface StepFutureActionsProps {
  selectedOption: string | null;
  text: string;
  onOptionChange: (option: string) => void;
  onTextChange: (text: string) => void;
}

export function StepFutureActions({
  selectedOption,
  text,
  onOptionChange,
  onTextChange,
}: StepFutureActionsProps) {
  const showTextarea = selectedOption === FUTURE_ACTION_OPTIONS[0]; // "Знаю, что делать"

  return (
    <div className="space-y-4">
      <RadioGroup value={selectedOption || ''} onValueChange={onOptionChange}>
        {FUTURE_ACTION_OPTIONS.map((option) => (
          <RadioGroupItem
            key={option}
            value={option}
            label={option}
          />
        ))}
      </RadioGroup>
      {showTextarea && (
        <Textarea
          placeholder="Опишите, что вы будете делать в подобных ситуациях..."
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          rows={6}
          required
        />
      )}
    </div>
  );
}

