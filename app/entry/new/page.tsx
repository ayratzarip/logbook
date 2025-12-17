'use client';

import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { EntryFormStepper } from '@/components/form/EntryFormStepper';

export default function NewEntryPage() {
  return (
    <div className="min-h-screen bg-gray-95 dark:bg-brand-10 pb-20">
      <Header title="Новая запись" showExport={false} showAddToHome={false} />
      
      <main className="container mx-auto px-4 py-4 max-w-3xl">
        <EntryFormStepper />
      </main>

      <BottomNav />
    </div>
  );
}
