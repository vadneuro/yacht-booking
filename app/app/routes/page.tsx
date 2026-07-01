'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import ContactHub from '@/components/ui/ContactHub';
import ScrollProgress from '@/components/ui/ScrollProgress';

const ROUTES = [
  {
    id: 1,
    name: 'Ласточкино гнездо',
    duration: '2–3 часа',
    tag: 'Популярный',
    tagColor: 'bg-[var(--azure)]',
    teaser: 'Самый узнаваемый символ Крыма - с той стороны, которую не видят с берега.',
    description: `С берега замок выглядит как открытка. С воды - как чудо. Подходим вплотную к мысу Ай-Тодор: скала уходит вертикально вниз, замок висит над головой, и только отсюда понимаешь, насколько это дерзкая постройка. По пути - грот в Мачтовой скале, где археологи нашли стоянку первобытного человека, и скала Парус, которую не видно ни с одной обзорной площадки.

Любопытный факт: именно здесь граф Воронцов приказал наладить добычу устриц. Получилось - и черноморский устричный промысел пошёл отсюда.`,
    highlight: 'Вид на замок с моря - открытка, которую не купить ни в одном киоске.',
  },
  {
    id: 2,
    name: 'Мисхор - устричные линии',
    duration: '3–4 часа',
    tag: 'Гастро',
    tagColor: 'bg-emerald-500',
    teaser: 'Идём вдоль устричных линий. Садки видно прямо с борта.',
    description: `Идём вдоль устричных линий - садки видно прямо с борта, уходят в глубину ровными рядами. Здесь растут черноморские устрицы и мидии. Достаём прямо на палубу, открываем, выжимаем лимон. Вода в этом месте неожиданно чистая - прозрачность до дна. Можно нырнуть и посмотреть на садки снизу.

Возвращаемся вдоль набережной Ялты - город с воды совсем другой.`,
    highlight: 'Устрицы с лимоном прямо в море - лучший обед на борту.',
  },
  {
    id: 3,
    name: 'Симеиз - скала Дива',
    duration: '3–4 часа',
    tag: 'Природа',
    tagColor: 'bg-teal-500',
    teaser: '51 метр вертикального камня прямо из моря. Обходим со всех сторон.',
    description: `51 метр вертикального камня прямо из моря. Дива стоит отдельно от берега - и когда обходишь её с трёх сторон, каждый раз другой силуэт. Рядом - скала Монах и скала Кошка, у подножия - чистейшая вода и дно, которое видно без маски. Симеиз облюбовали дайверы и скалолазы не случайно: место дикое, людей мало, характер у берега свой.`,
    highlight: 'Диву снимало несколько советских фильмов - узнаёте пейзаж прямо с борта.',
  },
  {
    id: 4,
    name: 'Алупка - Воронцовский дворец',
    duration: '3–4 часа',
    tag: 'История',
    tagColor: 'bg-amber-500',
    teaser: 'Южный фасад дворца смотрит в море. С воды он открывается целиком.',
    description: `Дворец строили 20 лет, и южный фасад - мавританский, с резными арками - смотрит прямо в море. С берега его заслоняют деревья. С воды он открывается целиком, на фоне Ай-Петри - и это совсем другое впечатление. Огибаем мыс Ай-Тодор, Ласточкино гнездо остаётся за кормой. По желанию - высадка и прогулка по парку.`,
    highlight: 'От Ласточкиного гнезда до Воронцовского дворца - 5 км береговой линии с видами, которые меняются каждую минуту.',
  },
  {
    id: 5,
    name: 'Мрия - курорт с воды',
    duration: '2–3 часа',
    tag: 'Премиум',
    tagColor: 'bg-violet-500',
    teaser: 'Лучший курорт Крыма выглядит с моря совсем иначе, чем с дороги.',
    description: `С дороги Мрия выглядит как дорогой отель. С моря - как что-то средиземноморское: белые террасы уступами к воде, кипарисы, собственный пляж. Проходим медленно вдоль берега - с борта виден весь курорт так, как не покажет ни одна фотография. Купание в бухте под отелем. При желании - причаливаем и берём кофе на террасе.`,
    highlight: 'Мрия принимает яхты - при желании можно причалить и выпить кофе на террасе.',
  },
  {
    id: 6,
    name: 'Бухта Ласпи',
    duration: '4–6 часов',
    tag: 'Снорклинг',
    tagColor: 'bg-cyan-500',
    teaser: 'Самая чистая и труднодоступная бухта Крыма. Только по морю.',
    description: `С суши сюда ведёт горная тропа. С моря - свободный вход. Ласпи закрыта с трёх сторон горами, вода в ней другого цвета - насыщеннее, темнее у берега и бирюзовая на мелководье. Галечные пляжи у мыса Айя, скалы из воды, тишина. В будний день здесь может не быть ни одного человека. Бросаем якорь, никуда не торопимся.`,
    highlight: 'В будний день на пляже бухты Ласпи может не быть ни одного человека.',
  },
  {
    id: 7,
    name: 'Балаклава',
    duration: '6–8 часов',
    tag: 'Приключение',
    tagColor: 'bg-rose-500',
    teaser: 'Скрытый фьорд, крепость XIV века и скалы, уходящие в небо на 500 метров.',
    description: `Бухту не видно с моря - вход скрыт за скалами, и это не случайно: здесь прятали подводные лодки. Заходим в узкий фьорд: слева руины генуэзской крепости Чембало XIV века, справа набережная с рыбацкими лодками. За бухтой - скалы заказника Аязьма, которые поднимаются из воды на 500 метров, и гроты глубиной до 18 метров. Самый дальний маршрут - и самый запоминающийся.`,
    highlight: 'Балаклава была секретным советским объектом - здесь базировались подводные лодки.',
  },
  {
    id: 8,
    name: 'Медведь-Гора - нос мишки',
    duration: '3–4 часа',
    tag: 'Природа',
    tagColor: 'bg-teal-500',
    teaser: 'Гора входит в море мысом. На носу - дикие пляжи, куда только с воды.',
    description: `Аю-Даг виден из Ялты - но только с воды понимаешь его масштаб. Гора входит в море мысом Монастырским: это и есть нос. Обходим его по кругу - с одной стороны Гурзуф и лагерь Артек, с другой Партенит и амфитеатр в горах. На самом носу - дикие пляжи, куда добраться можно только с воды. Высаживаемся, купаемся, смотрим на всё побережье сразу.`,
    highlight: 'Легенда гласит, что медведь пьёт воду из моря - и замер навеки.',
  },
  {
    id: 9,
    name: 'Открытое море',
    duration: '2–3 часа',
    tag: 'Особый',
    tagColor: 'bg-slate-500',
    teaser: 'Две мили от берега. Под килем - 500 метров. Горизонт по кругу.',
    description: `Уходим на две мили от берега. Берег становится тонкой полосой, под килем - около 500 метров воды. Никакого шума, никаких моторок, никакого берега рядом. Только ветер, волна и горизонт по кругу. Здесь встречают дельфинов - они выходят в открытое море кормиться. Маршрут без достопримечательностей, но именно его чаще всего вспоминают.`,
    highlight: 'Здесь понимаешь, что такое Чёрное море.',
  },
  {
    id: 10,
    name: 'Мыс Мартьян',
    duration: '2–3 часа',
    tag: 'Заповедник',
    tagColor: 'bg-green-600',
    teaser: 'Реликтовый лес, 200 видов морских обитателей и дельфины - почти гарантия.',
    description: `Самый маленький заповедник Крыма - 240 гектаров, половина из которых акватория. Реликтовый можжевельник и земляничное дерево спускаются прямо к воде. В акватории больше 200 видов морских обитателей - снорклинг здесь один из лучших на всём южном берегу. Дельфины заходят в заповедник регулярно: не обещаем, но шансы высокие.`,
    highlight: 'Дельфины здесь - не редкость, а почти гарантия в сезон.',
  },
  {
    id: 11,
    name: 'Гурзуф',
    duration: '3–4 часа',
    tag: 'Культура',
    tagColor: 'bg-orange-500',
    teaser: 'Дача Чехова, скалы Адалары и виноградники террасами - самый итальянский посёлок Крыма.',
    description: `Маленький белый домик прямо у воды - дача Чехова. Он выбрал Гурзуф, а не шумную Ялту, и с моря понятно почему: тихая бухта, скалы-близнецы Адалары, виноградники террасами в гору. Морской порт Артека за мысом - якорная стоянка, которую сравнивают с итальянским побережьем. Швартуемся, идём в старый город - дома XIX века, узкие улицы, кафе на набережной.`,
    highlight: 'Морской порт Артека - якорная стоянка, которую сравнивают с итальянским побережьем.',
  },
  {
    id: 12,
    name: 'Мыс Плака',
    duration: '3–4 часа',
    tag: 'История',
    tagColor: 'bg-amber-500',
    teaser: 'Дворец княгини Гагариной закрыт с суши. С воды виден целиком.',
    description: `Мыс выдаётся в море на 300 метров и поднимается на 50 метров над водой. На вершине - дворец княгини Гагариной: башенки, красная остроконечная крыша, маленькая церковь в византийском стиле рядом. С суши дворец закрыт и недоступен. С воды - виден целиком. Купание у подножия мыса, вода чистая, дно каменистое.`,
    highlight: 'С суши дворец недоступен. С воды - виден целиком.',
  },
  {
    id: 13,
    name: 'Санта-Барбара',
    duration: '2–3 часа',
    tag: 'Тихий',
    tagColor: 'bg-sky-500',
    teaser: 'Крым без толпы. Тихая бухта, белые дома на скалах, чистое море.',
    description: `Посёлок Утёс - без толпы, без громкой музыки, без сувенирных рядов. Небольшая бухта, защищённая от волны, белые дома на скалах, прозрачная вода. Хорошее место для тех, кто хочет просто провести день на море - порыбачить с борта, поплавать, посидеть на палубе. Тридцать километров от Ялты, и ощущение, что вы в другом мире.`,
    highlight: 'Тридцать километров от Ялты - и ощущение, что вы в другом мире.',
  },
  {
    id: 14,
    name: 'Новый Свет - грот Голицына',
    duration: '8–10 часов',
    tag: 'Дальний',
    tagColor: 'bg-indigo-500',
    teaser: 'Три бухты разного цвета, грот с феноменальной акустикой и Царская якорная стоянка.',
    description: `Князь Голицын основал здесь имение, разбил виноградники и построил в скале концертный зал - грот, выбитый морем в скале, с акустикой, которую оценил Шаляпин. Заходим в грот с резинки: свод уходит вверх, вода внутри тёмная, голос резонирует. Три бухты - Зелёная, Синяя, Голубая - каждая своего цвета. Якорная стоянка в Царской бухте, где в 1912 году стояла императорская яхта «Штандарт».`,
    highlight: 'В Царской бухте в 1912 году стояла императорская яхта «Штандарт».',
  },
  {
    id: 15,
    name: 'Судак - генуэзская крепость',
    duration: '8–10 часов',
    tag: 'Дальний',
    tagColor: 'bg-indigo-500',
    teaser: 'Крепость XIV века идёт по гребню горы прямо над морем. С берега это не увидеть.',
    description: `Крепость XIV века идёт по гребню горы прямо над морем - башня за башней, стена за стеной. С суши это туристический объект. С воды - нечто другое: скала, стены, небо, и ни одного человека между вами и этим видом. Подходим к подножию, купаемся в прозрачной бухте. Судак хорошо идёт в паре с Новым Светом - полный день или ночёвка на борту.`,
    highlight: 'Судак и Новый Свет - идеальная пара для полного дня или ночёвки на борту.',
  },
];

export default function RoutesPage() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <ScrollProgress />
      <Header />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-5 md:px-8 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1548438294-1ad5d5f4f063?auto=format&fit=crop&w=2000&q=85')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--navy)]/80 via-[var(--navy)]/60 to-[var(--navy)]/90" />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--azure)] mb-4 block">
              Направления
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
              Маршруты Glissa
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              15 маршрутов из Ялты вдоль южного берега Крыма. От двух часов до полного дня.
              Каждый открывает то, чего не увидеть с берега.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Routes */}
      <section className="py-16 md:py-24 px-5 md:px-8 bg-[#f8fafc]">
        <div className="max-w-5xl mx-auto space-y-4">
          {ROUTES.map((route, i) => (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
            >
              <div
                className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-300"
                onClick={() => setExpanded(expanded === route.id ? null : route.id)}
              >
                {/* Header row */}
                <div className="flex items-center gap-4 p-5 md:p-6">
                  {/* Number */}
                  <span className="hidden md:flex w-10 h-10 rounded-xl bg-[#f1f5f9] items-center justify-center text-sm font-bold text-[var(--muted)] shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-bold text-[var(--navy)] text-lg leading-tight">{route.name}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white ${route.tagColor}`}>
                        {route.tag}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--muted)] line-clamp-1">{route.teaser}</p>
                  </div>

                  {/* Duration + toggle */}
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="hidden sm:flex items-center gap-1.5 text-sm text-[var(--muted)]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                      </svg>
                      {route.duration}
                    </span>
                    <motion.div
                      animate={{ rotate: expanded === route.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M6 9l6 6 6-6"/>
                      </svg>
                    </motion.div>
                  </div>
                </div>

                {/* Expanded content */}
                <AnimatePresence>
                  {expanded === route.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                    >
                      <div className="px-5 md:px-6 pb-6 border-t border-black/5">
                        <div className="pt-5 grid md:grid-cols-[1fr_auto] gap-6 items-end">
                          {/* Description */}
                          <div>
                            <p className="text-[var(--muted)] leading-relaxed whitespace-pre-line mb-4">
                              {route.description}
                            </p>
                            {/* Highlight */}
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--azure)]/5 border border-[var(--azure)]/10">
                              <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--azure)" strokeWidth="2.5" strokeLinecap="round">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                              </svg>
                              <p className="text-sm text-[var(--navy)] font-medium">{route.highlight}</p>
                            </div>
                          </div>

                          {/* CTA */}
                          <div className="flex flex-col gap-2 shrink-0">
                            <span className="text-xs text-[var(--muted)] text-center">{route.duration}</span>
                            <Link
                              href="/catalog"
                              onClick={e => e.stopPropagation()}
                              className="px-6 py-3 rounded-xl bg-[var(--azure)] text-white text-sm font-semibold
                                         shadow-lg shadow-[var(--azure)]/20 hover:shadow-[var(--azure)]/40
                                         hover:bg-[var(--azure)]/90 transition-all whitespace-nowrap text-center"
                            >
                              Выбрать яхту
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-5 md:px-8 bg-[var(--navy)]">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
              Не знаете, куда пойти?
            </h2>
            <p className="text-white/60 text-lg mb-8">
              Расскажите про компанию и настроение - подберём маршрут и яхту за минуту.
            </p>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[var(--azure)] text-white font-semibold text-lg
                         shadow-xl shadow-[var(--azure)]/30 hover:shadow-[var(--azure)]/50 hover:bg-[var(--azure)]/90 transition-all"
            >
              Выбрать яхту
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      <ContactHub />
      <Footer />
    </div>
  );
}
