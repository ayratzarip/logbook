'use client';

import { Card } from '@/components/ui/card';

interface DetailCardProps {
  icon: string;
  title: string;
  content: string;
}

export function DetailCard({ icon, title, content }: DetailCardProps) {
  return (
    <Card className="mb-4">
      <div className="flex items-start space-x-3">
        <div className="text-2xl">{icon}</div>
        <div className="flex-1">
          <h3 className="font-semibold text-text-primary dark:text-white mb-2">
            {title}
          </h3>
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {content}
          </div>
        </div>
      </div>
    </Card>
  );
}

