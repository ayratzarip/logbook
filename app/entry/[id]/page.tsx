import { EntryDetailPageClient } from '@/components/diary/EntryDetailPage';

// Для статического экспорта
export const dynamic = 'force-static';

// Возвращаем placeholder ID для статической генерации.
// Реальные записи загружаются динамически через CloudStorage.
// На GitHub Pages 404.html перенаправит на главную страницу для неизвестных ID.
export async function generateStaticParams(): Promise<{ id: string }[]> {
  // Placeholder ID для генерации хотя бы одной страницы
  return [{ id: 'placeholder' }];
}

export default function EntryDetailPage() {
  return <EntryDetailPageClient />;
}
