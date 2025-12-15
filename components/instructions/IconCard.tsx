'use client';

import { Card } from '@/components/ui/card';

interface IconCardProps {
  icon: string;
  title: string;
  description: string;
}

export function IconCard({ icon, title, description }: IconCardProps) {
  return (
    <Card className="text-center p-6">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-semibold text-text-primary dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </Card>
  );
}

