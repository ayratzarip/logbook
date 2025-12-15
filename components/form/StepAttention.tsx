'use client';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { ATTENTION_FOCUS_OPTIONS } from '@/lib/constants/form-options';

interface StepAttentionProps {
  selectedOption: string | null;
  text: string;
  onOptionChange: (option: string) => void;
  onTextChange: (text: string) => void;
}

export function StepAttention({
  selectedOption,
  text,
  onOptionChange,
  onTextChange,
}: StepAttentionProps) {
  return (
    <div className="space-y-4">
      <RadioGroup value={selectedOption || ''} onValueChange={onOptionChange}>
        {ATTENTION_FOCUS_OPTIONS.map((option) => (
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

