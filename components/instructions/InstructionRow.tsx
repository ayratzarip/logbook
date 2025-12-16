'use client';

interface InstructionRowProps {
  icon: string;
  title: string;
  description: string;
}

export function InstructionRow({ icon, title, description }: InstructionRowProps) {
  return (
    <div className="flex items-start space-x-4 p-4 rounded-xl bg-gray-100 dark:bg-gray-5 border border-gray-90 dark:border-gray-35">
      <div className="text-3xl flex-shrink-0">{icon}</div>
      <div>
        <h3 className="text-h2 text-gray-0 dark:text-gray-100 mb-1">
          {title}
        </h3>
        <p className="text-caption">
          {description}
        </p>
      </div>
    </div>
  );
}

