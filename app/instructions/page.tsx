'use client';

import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { useState } from 'react';
import { cn } from '@/lib/utils/cn';

function InstructionItem({ title, summary, children }: { title: string, summary: string, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden mb-4 bg-white dark:bg-gray-950">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-4 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex justify-between items-start"
      >
        <div className="pr-4">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{summary}</p>
        </div>
        <span className={cn("transform transition-transform duration-200 text-gray-400 mt-1 shrink-0", isOpen ? "rotate-180" : "")}>
          ▼
        </span>
      </button>
      {isOpen && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 space-y-4 text-sm leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}

export default function InstructionsPage() {
  return (
    <div className="min-h-screen bg-gray-95 dark:bg-brand-10 pb-20">
      <Header title="Инструкции" showExport={false} showAddToHome={false} />
      
      <main className="container mx-auto px-4 py-4 max-w-3xl space-y-6">
        <section>
          <InstructionItem
            title="Для чего нужен журнал самонаблюдения"
            summary="Это инструмент для анализа и решения проблем, а не дневник."
          >
            <p>
              Относитесь к этому как к журналу логов на компьютере или бортовому самописцу на самолёте. Они нужны, чтобы контролировать процесс отладки и разбираться в случае сбоя или ошибки. Точно так же наш журнал – это не дневник, в который Вы сливаете свои мысли, это – инструмент, который нужен для решения проблем.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Благодаря журналу самонаблюдения вам будет проще разделять проблему на элементы, то есть Вы привыкните делать декомпозицию задачи.</li>
              <li>Вы научитесь замечать свои мысли, контролировать внимание.</li>
              <li>Периодически Вы будете анализировать свой журнал и искать закономерности (паттерны поведения).</li>
              <li>Журнал позволит отслеживать прогресс.</li>
              <li>Когда ведёшь стандартизированные записи, проще разбираться с «авариями» и готовиться ко второй попытке.</li>
            </ul>
          </InstructionItem>

          <InstructionItem
            title="Когда заполнять журнал"
            summary="Основные правила: когда и при каких обстоятельствах делать записи."
          >
            <ul className="list-decimal pl-5 space-y-2">
                <li>В первые две-три недели записываем каждый очный или заочный социальный контакт.</li>
                <li>В первые две-три недели записываем каждый раз, когда меняется настроение.</li>
                <li>Во время каждого неудачного социального взаимодействия.</li>
                <li>После каждого эффективного социального взаимодействия.</li>
                <li>Когда Вы движетесь к цели, то при выполнении каждого шага.</li>
            </ul>
          </InstructionItem>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Инструкция по заполнению разделов</h2>
          
          <InstructionItem
            title="I. Дата и время"
            summary="Записываются автоматически при создании записи."
          >
            <p>Дата и время создания записи фиксируются автоматически системой.</p>
          </InstructionItem>

          <InstructionItem
            title="II. Описание ситуации"
            summary="Записывайте максимально кратко и схематично."
          >
            <p>Старайтесь записывать максимально кратко. Если писать подробно, то, во-первых, Вы быстрее устанете, во-вторых, удобнее анализировать схематичные записи.</p>
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
                <p className="font-semibold mb-2">Примеры:</p>
                <p><strong>Пример Неуспеха:</strong> Первый день в Инфотехлаб. Вхожу в офис.</p>
                <p><strong>Пример Успеха:</strong> Первое свидание с Ксюшей. В кафе Лакомка.</p>
            </div>
          </InstructionItem>

          <InstructionItem
            title="III. Фокус внимания"
            summary="Куда было направлено ваше внимание: образы, звуки, смысл, ощущения, мысли."
          >
             <p>В зависимости от того, куда направлено внимание, будут развиваться дальнейшие процессы в голове и в теле.</p>
             <h4 className="font-semibold mt-2">Куда может быть направлено внимание:</h4>
             <ul className="list-decimal pl-5 space-y-2 mt-2">
                <li><strong>На зрительном образе.</strong> (увидели мятую рубашку, или как вьются волосы).</li>
                <li><strong>На звуках.</strong> (шум кондиционера, тембр голоса).</li>
                <li><strong>На смысле.</strong> (слушаете коллегу про столовую, или историю про котёнка).</li>
                <li><strong>На ощущениях своего тела.</strong> (проверяете не покраснели ли вы, не дрожат ли руки).</li>
                <li><strong>Погружен в свои мысли.</strong> (вместо наблюдения за реальностью, оперируете выдуманными вещами).</li>
                <li><strong>Внимание скачет.</strong> (быстрые переключения, хаос в голове, «бегающий взгляд»).</li>
                <li><strong>Внимание рассеянно.</strong> (полусон, полузабытье, отключение от действительности).</li>
             </ul>
             <p className="mt-2 text-sm italic">Первые три варианта – внимание на зрительных образах, звуках и смысле мы считаем оптимальными.</p>
             <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
                <p className="font-semibold mb-2">Примеры:</p>
                <p><strong>Случай 1:</strong> Погружен в свои мысли.</p>
                <p><strong>Случай 2:</strong> Внимание на смысле (примечание: внимательно слушал про Ксюшиного котёнка).</p>
            </div>
          </InstructionItem>

          <InstructionItem
            title="IV. Мысли"
            summary="Когнитивные процессы: тревожные мысли, ожидания оценки, установки и др."
          >
            <p>Мысли – это когнитивные процессы, скрытые от внешнего наблюдателя. Если сложно выявить мысли, запишите самое логичное, что подходит под ситуацию, или представьте &quot;облачко&quot; над головой персонажа в комиксе.</p>
            <h4 className="font-semibold mt-2">Виды мыслей:</h4>
            <ul className="list-decimal pl-5 space-y-2 mt-2">
                <li><strong>Тревожные мысли о будущем.</strong> Начинаются с «А вдруг». Фильмы-катастрофы в воображении.</li>
                <li><strong>Переживания прошлого опыта.</strong> Вспышки воспоминаний, ассоциации с прошлым негативным опытом.</li>
                <li><strong>Сожаления о прошлом.</strong> Начинаются с «ах, если бы…».</li>
                <li><strong>Ожидания оценки и самооценка.</strong> «Какой я?», «Как они подумали?». Прилагательные (умный-тупой, красивая-толстая).</li>
                <li><strong>Установки.</strong> «Я должен», «Как говорила бабушка». Глубинные правила.</li>
                <li><strong>Перегрузка планированием.</strong> Попытка спрогнозировать все варианты, «подстелить соломку».</li>
                <li><strong>Мыслил «линейно».</strong> Поглощен одной идеей, без сомнений. Специфический нетревожный способ (к которому стремимся).</li>
            </ul>
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
                <p className="font-semibold mb-2">Примеры:</p>
                <p><strong>Случай 1:</strong> Перегрузка планированием (продумывал что сказать, предугадывал реакцию).</p>
                <p><strong>Случай 2:</strong> Мыслил «линейно», поглощён рассказом.</p>
            </div>
          </InstructionItem>

          <InstructionItem
            title="V. Телесные ощущения"
            summary="Сканирование тела: мышцы, сердцебиение, дыхание. Интенсивность (0-10)."
          >
            <p>Биологический смысл — подготовка к действию (убежать, напасть). Нужно подготовить тело: тонус мышц, глюкоза, кислород.</p>
            <h4 className="font-semibold mt-2">Как описать телесные ощущения:</h4>
            <ul className="list-decimal pl-5 space-y-2 mt-2">
                <li>Быстро сканируем мышцы тела (стопы, лоб, пресс, шея, лицо).</li>
                <li>Оцениваем сердцебиение.</li>
                <li>Оцениваем дыхание.</li>
                <li>Ощущения в животе и малом тазу.</li>
                <li>Кожа (жарко, холодно, пот).</li>
            </ul>
            <p className="mt-2">Оцениваем интенсивность по шкале от 0 до 10.</p>
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
                <p className="font-semibold mb-2">Примеры:</p>
                <p><strong>Случай 1:</strong> Весь напрягся, сердце стучало, покраснело лицо, вспотел. Интенсивность - 6.</p>
                <p><strong>Случай 2:</strong> Небольшое напряжение в надплечьях, жар в груди, тепло в животе. Интенсивность - 3.</p>
            </div>
          </InstructionItem>

          <InstructionItem
            title="VI. Ваши действия и результат"
            summary="Кратко опишите действия и отметьте, добились ли желаемого результата."
          >
            <p>Оцениваем правильность действий по результату, а не по абстрактным правилам. Если результат получен — действие эффективно.</p>
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
                <p className="font-semibold mb-2">Примеры:</p>
                <p><strong>Случай 1:</strong> Молча подошёл к своему столу и сел. Не получил желаемый результат.</p>
                <p><strong>Случай 2:</strong> Слушал её, рассказал историю про свою собаку. Добился желаемого результата.</p>
            </div>
          </InstructionItem>

          <InstructionItem
            title="VII. Что делать в будущем?"
            summary="План действий на подобные ситуации, если результат не был достигнут."
          >
            <ul className="list-disc pl-5 space-y-2">
                <li>Если не знаете, как поступать — нажимаем «Не знаю». Позже это обсудим.</li>
                <li>Если знаете — записываете план действий.</li>
            </ul>
             <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
                <p className="font-semibold mb-2">Пример:</p>
                <p>Знаю, что делать в подобных ситуациях. При входе поздороваться, представиться, фиксируя внимание на лицах новых коллег.</p>
            </div>
          </InstructionItem>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
