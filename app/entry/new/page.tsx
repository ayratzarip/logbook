'use client';

import { Header } from '@/components/layout/Header';
import { EntryFormStepper } from '@/components/form/EntryFormStepper';

export default function NewEntryPage() {
  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-3xl">
        <EntryFormStepper />
      </main>
    </div>
  );
}

