'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Проверяем, есть ли сохраненный путь для редиректа (для GitHub Pages)
    const redirectPath = sessionStorage.getItem('redirectPath');
    if (redirectPath) {
      sessionStorage.removeItem('redirectPath');
      router.replace(redirectPath);
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-95 dark:bg-brand-10 pb-20">
      <Header title="Страница не найдена" showExport={false} showAddToHome={false} />
      
      <main className="container mx-auto px-4 py-12 max-w-3xl text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-h1 mb-4 text-gray-0 dark:text-gray-100">
          Страница не найдена
        </h2>
        <p className="text-body text-gray-35 dark:text-gray-90 mb-8">
          Запрашиваемая страница не существует или была удалена
        </p>
        <Link href="/">
          <Button variant="primary">
            Вернуться на главную
          </Button>
        </Link>
      </main>

      <BottomNav />
    </div>
  );
}
