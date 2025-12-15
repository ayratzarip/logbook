'use client';

import { Header } from '@/components/layout/Header';
import { VideoPlayer } from '@/components/instructions/VideoPlayer';
import { InstructionRow } from '@/components/instructions/InstructionRow';
import { IconCard } from '@/components/instructions/IconCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function InstructionsPage() {
  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-3xl space-y-8">
        {/* Видео инструкция */}
        <section>
          <VideoPlayer />
        </section>

        {/* Как вести журнал */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Как вести журнал</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InstructionRow
                icon="📝"
                title="Описание ситуации"
                description="Опишите ситуацию, которая произошла. Постарайтесь быть максимально подробными."
              />
              <InstructionRow
                icon="🎯"
                title="Фокус внимания"
                description="Определите, на чем было сосредоточено ваше внимание в этот момент."
              />
              <InstructionRow
                icon="🧠"
                title="Ваши мысли"
                description="Зафиксируйте мысли, которые приходили вам в голову во время ситуации."
              />
              <InstructionRow
                icon="💪"
                title="Телесные ощущения"
                description="Оцените интенсивность телесных ощущений и опишите их."
              />
              <InstructionRow
                icon="🏃"
                title="Ваши действия"
                description="Опишите, что вы сделали и какой был результат."
              />
              <InstructionRow
                icon="💡"
                title="Что делать в будущем"
                description="Подумайте, что можно сделать лучше в подобных ситуациях в будущем."
              />
            </CardContent>
          </Card>
        </section>

        {/* Что означают иконки */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Что означают иконки</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <IconCard
                  icon="🕐"
                  title="Дата и время"
                  description="Время создания записи"
                />
                <IconCard
                  icon="📝"
                  title="Описание ситуации"
                  description="Основное описание произошедшего"
                />
                <IconCard
                  icon="🎯"
                  title="Фокус внимания"
                  description="На чем было сосредоточено внимание"
                />
                <IconCard
                  icon="🧠"
                  title="Мысли"
                  description="Ваши мысли во время ситуации"
                />
                <IconCard
                  icon="💪"
                  title="Телесные ощущения"
                  description="Физические ощущения и их интенсивность"
                />
                <IconCard
                  icon="🏃"
                  title="Действия"
                  description="Что вы сделали и результат"
                />
                <IconCard
                  icon="💡"
                  title="Будущее"
                  description="Что делать в подобных ситуациях"
                />
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}

