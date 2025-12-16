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
      <h3 className="text-h2 text-gray-0 dark:text-gray-100 mb-2">
        {title}
      </h3>
      <p className="text-caption">
        {description}
      </p>
    </Card>
  );
}

