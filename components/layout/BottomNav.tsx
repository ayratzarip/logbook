'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';

interface NavItem {
  href: string;
  label: string;
  icon: string;
  activeIcon: string;
  isAddButton?: boolean;
}

const navItems: NavItem[] = [
  {
    href: '/',
    label: 'Записи',
    icon: '📋',
    activeIcon: '📔',
  },
  {
    href: '/entry/new',
    label: 'Добавить',
    icon: '+',
    activeIcon: '+',
    isAddButton: true,
  },
  {
    href: '/instructions',
    label: 'Инструкции',
    icon: '📖',
    activeIcon: '📘',
  },
];

export function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-90/80 bg-gray-100/95 backdrop-blur-lg dark:border-gray-35/80 dark:bg-gray-5/95 safe-area-bottom">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-around px-4">
        {navItems.map((item) => {
          const active = isActive(item.href);
          
          // Специальная кнопка "Добавить"
          if (item.isAddButton) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center gap-1 px-4 py-1 transition-colors min-w-[72px]"
              >
                <span 
                  className="w-10 h-10 rounded-full bg-brand-70 flex items-center justify-center text-white text-2xl font-light shadow-md"
                  aria-hidden
                >
                  +
                </span>
                <span
                  className={cn(
                    'text-xs font-medium',
                    active
                      ? 'text-gray-0 dark:text-gray-100'
                      : 'text-gray-60'
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          }
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors min-w-[72px]',
                active ? 'text-brand-70' : 'text-gray-60'
              )}
            >
              <span className={cn('text-2xl', !active && 'grayscale opacity-60')} aria-hidden>
                {active ? item.activeIcon : item.icon}
              </span>
              <span
                className={cn(
                  'text-xs font-medium',
                  active
                    ? 'text-gray-0 dark:text-gray-100'
                    : 'text-gray-60'
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
