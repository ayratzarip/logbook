'use client';

import { Textarea } from '@/components/ui/textarea';
import { formatDateShort } from '@/lib/utils/date';

interface StepSituationProps {
  value: string;
  onChange: (value: string) => void;
  dateTime: Date;
}

export function StepSituation({ value, onChange, dateTime }: StepSituationProps) {
  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Дата и время: {formatDateShort(dateTime)}
      </div>
      <Textarea
        placeholder="Опишите ситуацию, которая произошла..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={8}
        required
      />
    </div>
  );
}

