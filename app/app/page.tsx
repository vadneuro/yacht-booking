'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/ui/Header';
import SearchBar from '@/components/ui/SearchBar';
import YachtPublicCard from '@/components/ui/YachtPublicCard';
import Footer from '@/components/ui/Footer';
import ContactHub from '@/components/ui/ContactHub';
import OceanWaves from '@/components/ui/OceanWaves';
import ParticlesField from '@/components/ui/ParticlesField';
import TiltCard from '@/components/ui/TiltCard';
import ScrollProgress from '@/components/ui/ScrollProgress';
import CursorGlow from '@/components/ui/CursorGlow';
import WeatherWidget from '@/components/ui/WeatherWidget';
import CountUp from '@/components/ui/CountUp';
import { getYachts } from '@/lib/data';
import SchemaOrg from '@/components/ui/SchemaOrg';

export default function HomePage() {
  const yachts = getYachts();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <ScrollProgress />
      <CursorGlow />
      <Header />

      {/* ═══════════ HERO ═══════════ */}
      <section ref={heroRef} className="relative h-[100svh] min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Parallax background */}
        <motion.div
          className="absolute inset-0"
          style={{ scale: heroScale }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=2000&q=85')",
            }}
          />
        </motion.div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--navy)]/50 via-[var(--navy)]/30 to-[var(--navy)]/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--navy)]/30 via-transparent to-[var(--navy)]/30" />

        {/* Noise texture */}
        <div className="absolute inset-0 noise-overlay" />

        {/* Floating particles */}
        <ParticlesField />

        {/* Animated orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[var(--azure)]/10 blur-[80px] animate-breathe" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-[var(--teal)]/10 blur-[60px] animate-breathe" style={{ animationDelay: '2s' }} />

        {/* Content */}
        <motion.div
          className="relative z-10 w-full max-w-7xl mx-auto px-5 md:px-8 text-center"
          style={{ opacity: heroOpacity, y: heroY }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
            className="space-y-7"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/[0.15] shadow-lg shadow-black/10"
            >
              <span className="relative w-2.5 h-2.5">
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
                <span className="absolute inset-0 rounded-full bg-emerald-400" />
              </span>
              <span className="text-xs font-semibold text-white/90 tracking-wide">
                Сезон 2026 открыт - бронируйте лучшие даты
              </span>
            </motion.div>

            {/* Title */}
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter">
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                className="block"
              >
                Аренда яхт
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                className="block mt-2 bg-gradient-to-r from-[var(--azure)] via-[var(--teal)] to-[var(--azure)] bg-clip-text text-transparent animate-gradient-text"
                style={{ backgroundSize: '200% auto' }}
              >
                в Ялте
              </motion.span>
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed font-light"
            >
              Моторные и парусные яхты, катамараны с опытными капитанами.
              <br className="hidden md:block" />
              Незабываемые маршруты вдоль крымского побережья.
            </motion.p>
          </motion.div>

          {/* Weather */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.7 }}
            className="mt-8"
          >
            <WeatherWidget />
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="mt-8"
          >
            <SearchBar variant="hero" />
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="mt-12 flex items-center justify-center gap-8 md:gap-16"
          >
            {[
              { value: 20, suffix: '+', label: 'Яхт' },
              { value: 127, suffix: '', label: 'Отзывов' },
              { value: 4, suffix: ' года', label: 'Опыта' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-white">
                  <CountUp end={stat.value} suffix={stat.suffix} duration={2.5} />
                </p>
                <p className="text-xs text-white/40 mt-1 font-medium tracking-wide">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Ocean waves */}
        <OceanWaves />

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] tracking-[0.2em] uppercase text-white/30 font-medium">Листайте</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1.5 h-1.5 rounded-full bg-white/60"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════ FLEET ═══════════ */}
      <section className="py-24 md:py-32 px-5 md:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14"
          >
            <div>
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--azure)] mb-3 block"
              >
                Наш флот
              </motion.span>
              <h2 className="text-3xl md:text-5xl font-black text-[var(--navy)] tracking-tight">
                Выберите свою яхту
              </h2>
              <p className="text-[var(--muted)] mt-3 max-w-md">
                Каждая яхта проходит тщательную проверку. Только лучшие суда с опытными капитанами.
              </p>
            </div>
            <a
              href="/catalog"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[var(--azure)]/30 text-sm font-semibold text-[var(--azure)] hover:bg-[var(--azure)] hover:text-white transition-all duration-300"
            >
              Весь каталог
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="group-hover:translate-x-1 transition-transform">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {yachts.map((yacht, i) => (
              <TiltCard key={yacht.id} intensity={5}>
                <YachtPublicCard yacht={yacht} index={i} />
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section id="how-it-works" className="py-24 md:py-32 px-5 md:px-8 bg-[var(--surface)] relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--azure)]/[0.03] rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[var(--teal)]/[0.03] rounded-full blur-[80px]" />

        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--azure)] mb-3 block">
              Просто и удобно
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-[var(--navy)] tracking-tight">
              Три шага до мечты
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-[var(--azure)]/20 to-transparent" />

            {[
              {
                step: '01',
                title: 'Выберите яхту',
                description: 'Изучите каталог, сравните характеристики. 3D-фото, отзывы, рейтинг капитана.',
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                  </svg>
                ),
                color: 'from-blue-500 to-cyan-400',
              },
              {
                step: '02',
                title: 'Забронируйте',
                description: 'Выберите дату и время. Мгновенное подтверждение. Безопасная онлайн-оплата.',
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><path d="m9 16 2 2 4-4"/>
                  </svg>
                ),
                color: 'from-violet-500 to-purple-400',
              },
              {
                step: '03',
                title: 'Наслаждайтесь',
                description: 'Капитан встретит в марине. Отправляйтесь навстречу закату и впечатлениям.',
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
                  </svg>
                ),
                color: 'from-amber-500 to-orange-400',
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
              >
                <TiltCard intensity={4}>
                  <div className="relative p-8 rounded-3xl bg-white border border-black/[0.04] shadow-sm group hover:shadow-xl transition-shadow duration-500">
                    {/* Step number watermark */}
                    <span className="absolute top-4 right-6 text-7xl font-black text-black/[0.03] group-hover:text-[var(--azure)]/[0.06] transition-colors duration-700">
                      {item.step}
                    </span>

                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                      {item.icon}
                    </div>

                    <h3 className="text-lg font-bold text-[var(--navy)] mb-2">{item.title}</h3>
                    <p className="text-sm text-[var(--muted)] leading-relaxed">{item.description}</p>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ EXPERIENCE / STATS ═══════════ */}
      <section className="py-24 md:py-32 px-5 md:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image with floating elements */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              className="relative"
            >
              <div className="relative rounded-[2rem] overflow-hidden aspect-[4/3] shadow-2xl shadow-black/10">
                <Image
                  fill
                  src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80"
                  alt="Яхтенная прогулка в Ялте - аренда яхт от Glissa"
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>

              {/* Floating review card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6, type: 'spring' }}
                className="absolute -bottom-6 -right-4 md:right-6 glass rounded-2xl p-5 shadow-2xl max-w-[260px] animate-float"
              >
                <div className="flex gap-0.5 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-[var(--navy)] font-medium leading-snug">
                  &laquo;Невероятные впечатления! Капитан показал скрытые бухты&raquo;
                </p>
                <p className="text-xs text-[var(--muted)] mt-2">- Анна М., июнь 2026</p>
              </motion.div>

              {/* Floating stat card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.6, type: 'spring' }}
                className="absolute -top-4 -left-4 md:left-6 glass rounded-2xl p-4 shadow-2xl animate-float-delay"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xl font-black text-[var(--navy)]">
                      <CountUp end={98} suffix="%" duration={2} />
                    </p>
                    <p className="text-xs text-[var(--muted)]">Довольных клиентов</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              className="space-y-8"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--azure)] mb-3 block">
                  Почему выбирают нас
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-[var(--navy)] leading-[1.05] tracking-tight">
                  Больше, чем
                  <br />
                  <span className="text-gradient">аренда яхты</span>
                </h2>
              </div>

              <div className="space-y-5">
                {[
                  { title: 'Сертифицированные капитаны', desc: 'Каждый - с многолетним опытом и международными лицензиями.', emoji: '🧭' },
                  { title: 'Прозрачные цены', desc: 'Цена = финальная сумма. Топливо и оснащение уже включены.', emoji: '💎' },
                  { title: 'Гибкая отмена', desc: 'Бесплатная отмена за 24 часа. Ваши деньги в безопасности.', emoji: '🛡' },
                  { title: 'Мгновенное подтверждение', desc: 'Без ожидания. Бронируйте - и через минуту всё готово.', emoji: '⚡' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="flex items-start gap-4 p-4 rounded-2xl hover:bg-[var(--surface)] transition-colors duration-300 group cursor-default"
                  >
                    <span className="text-2xl group-hover:scale-125 transition-transform duration-300">{item.emoji}</span>
                    <div>
                      <h4 className="font-bold text-[var(--navy)] mb-0.5">{item.title}</h4>
                      <p className="text-sm text-[var(--muted)] leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ DESTINATIONS ═══════════ */}
      <section id="destinations" className="py-24 md:py-32 px-5 md:px-8 bg-[var(--surface)] relative overflow-hidden">
        <div className="absolute inset-0 noise-overlay" />

        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-14"
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--azure)] mb-3 block">
              Направления
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-[var(--navy)] tracking-tight">
              Маршруты, от которых<br />захватывает дух
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { name: 'Ласточкино гнездо', time: '2–3 ч', price: 'от 8 000 ₽', image: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?auto=format&fit=crop&w=800&q=80', tag: 'Популярный' },
              { name: 'Бухта Ласпи', time: '4–5 ч', price: 'от 16 000 ₽', image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=800&q=80', tag: 'Снорклинг' },
              { name: 'Форос - Балаклава', time: '6–8 ч', price: 'от 24 000 ₽', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80', tag: 'Приключение' },
            ].map((dest, i) => (
              <motion.div
                key={dest.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
              >
                <TiltCard intensity={4}>
                  <div className="group relative rounded-3xl overflow-hidden aspect-[3/4] cursor-pointer">
                    <Image
                      fill
                      src={dest.image}
                      alt={`Яхтенная прогулка ${dest.name} - маршрут из Ялты`}
                      className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                    />
                    {/* Multi-layer gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--azure)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    {/* Tag */}
                    <div className="absolute top-5 left-5">
                      <span className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold text-white border border-white/20">
                        {dest.tag}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-7">
                      <h3 className="text-white font-bold text-xl mb-2 group-hover:translate-y-[-4px] transition-transform duration-500">{dest.name}</h3>
                      <div className="flex items-center justify-between">
                        <p className="text-white/70 text-sm flex items-center gap-1.5">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                          </svg>
                          {dest.time}
                        </p>
                        <span className="text-sm font-bold text-white">{dest.price}</span>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-10"
          >
            <Link
              href="/routes"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border-2 border-[var(--navy)] text-[var(--navy)] font-semibold text-sm hover:bg-[var(--navy)] hover:text-white transition-all duration-300"
            >
              Все 15 маршрутов
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ SUNRISE / SUNSET ═══════════ */}
      <section className="relative overflow-hidden">
        {/* Full-bleed background */}
        <div className="absolute inset-0">
          <Image
            fill
            src="https://images.unsplash.com/photo-1541690215789-9b383ac81e33?auto=format&fit=crop&w=2000&q=85"
            alt="Закат над крымскими горами с моря"
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-orange-900/30 via-transparent to-amber-900/20" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 py-32 md:py-44">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
            className="text-center mb-20"
          >
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400 mb-4 block">
              Особые выходы
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
              Эмоции, которые
              <br />
              <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300 bg-clip-text text-transparent">
                останутся на всю жизнь
              </span>
            </h2>
            <p className="mt-6 text-lg text-white/55 max-w-2xl mx-auto leading-relaxed font-light">
              Есть моменты, которые невозможно пережить с берега. Встреча рассвета или проводы заката
              на яхте посреди Чёрного моря — это не просто красота. Это точка отсчёта нового.
            </p>
          </motion.div>

          {/* Two cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                time: 'Рассвет',
                hours: '05:30 — 08:00',
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M12 2v4M4.93 7.93l2.83 2.83M2 16h4M20 16h-4M19.07 7.93l-2.83 2.83"/>
                    <path d="M12 10a4 4 0 0 1 4 4H8a4 4 0 0 1 4-4z"/>
                    <path d="M2 20h20"/>
                  </svg>
                ),
                gradient: 'from-sky-500/20 to-indigo-500/10',
                accent: 'border-sky-400/30',
                tag: 'bg-sky-400/20 text-sky-200',
                tagText: 'Тихое утро',
                desc: 'Море стеклянное. Ни людей, ни шума. Только вы, горизонт и первые лучи, которые окрашивают воду в золото. Такого рассвета вы не видели никогда.',
              },
              {
                time: 'Закат',
                hours: '19:00 — 22:00',
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M12 10a4 4 0 0 1 4 4H8a4 4 0 0 1 4-4z"/>
                    <path d="M2 20h20M4.93 14.07l2.83-2.83M2 8h4M20 8h-4M19.07 14.07l-2.83-2.83"/>
                  </svg>
                ),
                gradient: 'from-orange-500/20 to-rose-500/10',
                accent: 'border-orange-400/30',
                tag: 'bg-orange-400/20 text-orange-200',
                tagText: 'Самый популярный',
                desc: 'Солнце падает в море, небо горит от оранжевого до малинового, огни Ялты зажигаются один за другим. Бокал вина. Тишина. Человек рядом. Лучшего вечера не придумать.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.time}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.15, ease: [0.23, 1, 0.32, 1] }}
              >
                <div className={`relative p-8 rounded-3xl bg-gradient-to-br ${item.gradient} backdrop-blur-md border ${item.accent} border-white/10 h-full flex flex-col gap-5 group hover:scale-[1.02] transition-transform duration-500`}>
                  {/* Icon + time */}
                  <div className="flex items-start justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-500">
                      {item.icon}
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${item.tag}`}>
                      {item.tagText}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-white mb-1">{item.time}</h3>
                    <p className="text-sm text-white/40 font-medium">{item.hours}</p>
                  </div>

                  <p className="text-white/70 leading-relaxed text-sm flex-1">{item.desc}</p>

                  <a
                    href="/catalog"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition-colors group/link"
                  >
                    Забронировать выход
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="group-hover/link:translate-x-1 transition-transform">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom quote */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-center mt-16 text-white/30 text-sm italic max-w-xl mx-auto"
          >
            Каждый выход — это 2-3 часа, которые вы будете вспоминать годами
          </motion.p>
        </div>
      </section>

      {/* ═══════════ TESTIMONIALS ═══════════ */}
      <section className="py-24 md:py-32 px-5 md:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-14"
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--azure)] mb-3 block">
              Отзывы
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-[var(--navy)] tracking-tight">
              Что говорят наши гости
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Алексей К.', text: 'Потрясающая прогулка! Капитан Иван показал невероятные места, куда невозможно добраться пешком. Дети в восторге.', yacht: 'Мануну', rating: 5 },
              { name: 'Марина С.', text: 'Организовали день рождения на яхте. Всё прошло идеально - от встречи до шампанского на закате. Рекомендую!', yacht: 'Паласса', rating: 5 },
              { name: 'Дмитрий П.', text: 'Первый раз на парусной яхте. Спокойно, тихо, ветер в лицо. Совсем другое ощущение моря. Вернёмся обязательно.', yacht: 'Аврора', rating: 5 },
            ].map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <TiltCard intensity={3}>
                  <div className="p-7 rounded-3xl bg-white border border-black/[0.04] shadow-sm h-full flex flex-col">
                    {/* Stars */}
                    <div className="flex gap-0.5 mb-4">
                      {[...Array(review.rating)].map((_, j) => (
                        <svg key={j} width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-[var(--navy)] leading-relaxed flex-1">
                      &laquo;{review.text}&raquo;
                    </p>

                    {/* Author */}
                    <div className="mt-5 pt-4 border-t border-black/[0.05] flex items-center justify-between">
                      <div>
                        <p className="font-bold text-sm text-[var(--navy)]">{review.name}</p>
                        <p className="text-xs text-[var(--muted)]">Яхта {review.yacht}</p>
                      </div>
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--azure-light)] text-[var(--azure)]">
                        Проверено
                      </span>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ КАК ДОБРАТЬСЯ ═══════════ */}
      <section id="location" className="py-20 md:py-28 px-5 md:px-8 bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--azure)] mb-3 block">Где нас найти</span>
            <h2 className="text-3xl md:text-4xl font-black text-[var(--navy)] tracking-tight">Как добраться до причала</h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left: info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-5"
            >
              {/* Address */}
              <div className="flex gap-4 p-5 bg-white rounded-2xl border border-black/[0.04] shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[var(--azure-light)] text-[var(--azure)] flex items-center justify-center shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-[var(--navy)] mb-0.5">Адрес причала</p>
                  <address className="not-italic text-sm text-[var(--muted)] leading-relaxed">
                    Набережная им. Ленина, 1<br />
                    Ялта, Республика Крым, 298600
                  </address>
                </div>
              </div>

              {/* Hours */}
              <div className="flex gap-4 p-5 bg-white rounded-2xl border border-black/[0.04] shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[var(--azure-light)] text-[var(--azure)] flex items-center justify-center shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-[var(--navy)] mb-0.5">Часы работы</p>
                  <p className="text-sm text-[var(--muted)]">09:00 - 22:00, май - октябрь</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-4 p-5 bg-white rounded-2xl border border-black/[0.04] shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[var(--azure-light)] text-[var(--azure)] flex items-center justify-center shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72"/>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-[var(--navy)] mb-0.5">Телефон</p>
                  <a href="tel:+79790840089" className="text-sm text-[var(--azure)] hover:underline">+7 (979) 084-00-89</a>
                </div>
              </div>
            </motion.div>

            {/* Right: directions + map link */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl border border-black/[0.04] shadow-sm p-6"
            >
              <h3 className="font-bold text-[var(--navy)] mb-4">Как добраться</h3>
              <ul className="space-y-4 text-sm text-[var(--muted)]">
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-[var(--azure)] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <span><strong className="text-[var(--navy)]">На такси:</strong> около 10 минут от центра города. Скажите водителю: "Морской причал, набережная Ленина".</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-[var(--azure)] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <span><strong className="text-[var(--navy)]">На маршрутке:</strong> до остановки "Набережная" - маршруты № 1, 5, 7 от автовокзала.</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-[var(--azure)] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <span><strong className="text-[var(--navy)]">Пешком:</strong> 10 минут от центра набережной мимо Массандровского пляжа.</span>
                </li>
              </ul>

              <div className="mt-6 pt-5 border-t border-black/[0.05] flex flex-col sm:flex-row gap-3">
                <a
                  href="https://yandex.ru/maps/?pt=34.1639,44.4963&z=17&l=map"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--navy)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  Яндекс Карты
                </a>
                <a
                  href="https://2gis.ru/yalta?m=34.1639%2C44.4963%2F17"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--navy)] text-[var(--navy)] text-sm font-semibold hover:bg-[var(--surface)] transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  2ГИС
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="py-24 md:py-32 px-5 md:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className="relative rounded-[2.5rem] overflow-hidden p-12 md:p-20 text-center"
          >
            {/* BG layers */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--navy)] via-[oklch(18%_0.04_220)] to-[var(--azure)]/80" />
            <div
              className="absolute inset-0 opacity-15 bg-cover bg-center"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1200&q=50')" }}
            />
            <div className="absolute inset-0 noise-overlay" />

            {/* Animated orbs */}
            <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-[var(--azure)]/20 blur-[60px] animate-breathe" />
            <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-[var(--teal)]/20 blur-[50px] animate-breathe" style={{ animationDelay: '2s' }} />

            <div className="relative z-10">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-3xl md:text-5xl font-black text-white tracking-tight mb-5"
              >
                Готовы к путешествию?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-lg text-white/60 mb-10 max-w-lg mx-auto"
              >
                Забронируйте яхту сейчас и получите скидку 10% на первую аренду. Количество мест ограничено.
              </motion.p>
              <motion.a
                href="/catalog"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 px-10 py-5 rounded-full
                           bg-white text-[var(--navy)] font-bold text-lg
                           shadow-2xl shadow-black/20 hover:shadow-white/20 transition-shadow"
              >
                Выбрать яхту
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ SEO TEXT ═══════════ */}
      <section className="bg-[var(--surface)] border-t border-black/[0.04] px-5 md:px-8 py-10">
        <div className="max-w-4xl mx-auto">
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none select-none">
              <h2 className="text-base font-semibold text-[var(--navy)]">Прогулки на яхте в Ялте - аренда яхт 2026</h2>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--muted)] transition-transform duration-300 group-open:rotate-180 shrink-0">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </summary>
            <div className="mt-5 prose prose-sm max-w-none text-[var(--muted)] leading-relaxed space-y-4">
              <p>
                Ялта - один из лучших портовых городов Крыма для яхтенного отдыха. Тёплое Чёрное море, живописные берега и разнообразие маршрутов делают морские прогулки незабываемым опытом для каждого гостя полуострова. Glissa предлагает аренду яхт в Ялте с опытными капитанами - с мая по октябрь, ежедневно с 09:00 до 22:00.
              </p>
              <p>
                В нашем флоте 11 яхт разных типов: парусные, моторные и катамараны вместимостью от 4 до 12 человек. Каждое судно технически исправно, застраховано и оснащено всем необходимым для комфортного отдыха на воде.
              </p>
              <h3 className="text-sm font-semibold text-[var(--navy)] mt-4 mb-2">Что включает прогулка на яхте в Ялте</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Опытный капитан с международными лицензиями</li>
                <li>Топливо и оснащение без доплат</li>
                <li>Снаряжение для снорклинга</li>
                <li>Страховка и спасательное оборудование</li>
              </ul>
              <h3 className="text-sm font-semibold text-[var(--navy)] mt-4 mb-2">Популярные маршруты яхтенных прогулок из Ялты</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Ласточкино гнездо - 2-3 часа, вид на замок с моря</li>
                <li>Бухта Ласпи - 4-5 часов, прозрачная вода и снорклинг</li>
                <li>Симеиз и скала Дива - 3-4 часа, дикий берег</li>
                <li>Форос - Балаклава - 6-8 часов, полный день на море</li>
              </ul>
              <h3 className="text-sm font-semibold text-[var(--navy)] mt-4 mb-2">Стоимость аренды яхты в Ялте 2026</h3>
              <p>
                Цены на аренду яхты в Ялте - от 8 000 рублей в час. Итоговая стоимость зависит от типа судна, продолжительности и маршрута. Минимальный срок - 2 часа. Оплата онлайн, бесплатная отмена за 24 часа. Все цены финальные - топливо и оснащение включены.
              </p>
              <p>
                Забронировать морскую прогулку в Крыму можно онлайн за несколько минут: выберите яхту в каталоге, укажите дату и время - подтверждение придёт мгновенно.
              </p>
            </div>
          </details>
        </div>
      </section>

      <Footer />
      <ContactHub />
      <SchemaOrg />
    </div>
  );
}
