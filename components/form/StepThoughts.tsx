'use client';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { THOUGHT_OPTIONS } from '@/lib/constants/form-options';

interface StepThoughtsProps {
  selectedOption: string | null;
  text: string;
  onOptionChange: (option: string) => void;
  onTextChange: (text: string) => void;
}

export function StepThoughts({
  selectedOption,
  text,
  onOptionChange,
  onTextChange,
}: StepThoughtsProps) {
  return (
    <div className="space-y-4">
      <RadioGroup value={selectedOption || ''} onValueChange={onOptionChange}>
        {THOUGHT_OPTIONS.map((option) => (
          <RadioGroupItem
            key={option}
            value={option}
            label={option}
          />
        ))}
      </RadioGroup>
      <Textarea
        placeholder="Дополнительные уточнения (необязательно)..."
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        rows={4}
      />
    </div>
  );
}

