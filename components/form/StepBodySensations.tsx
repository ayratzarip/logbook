'use client';

import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';

interface StepBodySensationsProps {
  intensity: number;
  text: string;
  onIntensityChange: (intensity: number) => void;
  onTextChange: (text: string) => void;
}

export function StepBodySensations({
  intensity,
  text,
  onIntensityChange,
  onTextChange,
}: StepBodySensationsProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-text-primary dark:text-white mb-2">
          Интенсивность ощущений (0-10)
        </label>
        <Slider
          value={intensity}
          onValueChange={onIntensityChange}
          min={0}
          max={10}
          step={1}
        />
      </div>
      <Textarea
        placeholder="Опишите телесные ощущения..."
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        rows={6}
        required
      />
    </div>
  );
}

