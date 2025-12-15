'use client';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { ACTION_RESULT_OPTIONS, ACTION_RESULT_SEPARATOR } from '@/lib/constants/form-options';

interface StepActionsProps {
  text: string;
  selectedResult: string | null;
  onTextChange: (text: string) => void;
  onResultChange: (result: string) => void;
}

export function StepActions({
  text,
  selectedResult,
  onTextChange,
  onResultChange,
}: StepActionsProps) {
  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Опишите ваши действия..."
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        rows={6}
        required
      />
      <RadioGroup value={selectedResult || ''} onValueChange={onResultChange}>
        {ACTION_RESULT_OPTIONS.map((option) => (
          <RadioGroupItem
            key={option}
            value={option}
            label={option}
          />
        ))}
      </RadioGroup>
    </div>
  );
}

