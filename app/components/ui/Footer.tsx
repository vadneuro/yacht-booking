import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[var(--navy)] text-white/70 mt-auto">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--azure)] to-[var(--teal)] flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
                  <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/>
                  <path d="M12 2v8"/>
                </svg>
              </div>
              <span className="font-bold text-lg text-white">Glissa</span>
            </div>
            <p className="text-sm leading-relaxed text-white/50 max-w-[28ch]">
              Аренда яхт премиум-класса. Незабываемые впечатления на воде.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Яхты</h4>
            <ul className="space-y-2.5">
              <li><Link href="/catalog" className="text-sm hover:text-white transition-colors">Каталог яхт в Ялте</Link></li>
              <li><Link href="/catalog" className="text-sm hover:text-white transition-colors">Моторные яхты</Link></li>
              <li><Link href="/catalog" className="text-sm hover:text-white transition-colors">Парусные яхты</Link></li>
              <li><Link href="/catalog" className="text-sm hover:text-white transition-colors">Катамараны</Link></li>
              <li><Link href="/routes" className="text-sm hover:text-white transition-colors">Маршруты прогулок</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Компания</h4>
            <ul className="space-y-2.5">
              {['О нас', 'Контакты', 'Для владельцев', 'Блог'].map(item => (
                <li key={item}>
                  <span className="text-sm text-white/70">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Контакты</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <address className="not-italic leading-relaxed text-white/70">
                  Набережная им. Ленина, 1<br />
                  Ялта, Республика Крым
                </address>
              </li>
              <li className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72"/>
                </svg>
                <a href="tel:+79790840089" className="hover:text-white transition-colors">+7 (979) 084-00-89</a>
              </li>
              <li className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
                WhatsApp
              </li>
              <li className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/>
                </svg>
                Telegram
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} Glissa. Все права защищены.
          </p>
          <div className="flex items-center gap-6 text-xs text-white/40">
            <span>Политика конфиденциальности</span>
            <span>Оферта</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
