'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function VideoPlayer() {
  const [showVideo, setShowVideo] = useState(false);

  if (!showVideo) {
    return (
      <Card className="text-center py-12 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowVideo(true)}>
        <div className="text-6xl mb-4">▶️</div>
        <Button variant="gradient" size="lg" onClick={(e) => {
          e.stopPropagation();
          setShowVideo(true);
        }}>
          Посмотреть видео-инструкцию
        </Button>
      </Card>
    );
  }

  return (
    <Card>
      <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg">
        <iframe
          src="https://player.vimeo.com/video/1041570908"
          className="absolute top-0 left-0 w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    </Card>
  );
}

