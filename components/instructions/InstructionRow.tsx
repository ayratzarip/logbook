'use client';

interface InstructionRowProps {
  icon: string;
  title: string;
  description: string;
}

export function InstructionRow({ icon, title, description }: InstructionRowProps) {
  return (
    <div className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
      <div className="text-3xl flex-shrink-0">{icon}</div>
      <div>
        <h3 className="font-semibold text-text-primary dark:text-white mb-1">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
    </div>
  );
}

