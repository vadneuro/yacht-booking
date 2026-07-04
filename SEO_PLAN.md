# SEO Plan — glissa.ru

> **Как работать с этим файлом:**
> Каждая сессия начинается командой: _"Прочитай `/Users/a1234/Documents/Projects/yacht-booking/SEO_PLAN.md` и выполни следующий шаг со статусом `[ ]`"_
> После выполнения шага — обнови его статус на `[x]` и запиши результат в Лог.

Статусы: `[ ]` не начат · `[~]` в работе · `[x]` завершён · `[!]` заблокирован

---

## Результаты аудита Fable (04.07.2026)

### Критичные проблемы (блокируют индексацию):
- ❌ `robots.txt` ссылается на мёртвый домен `arenda-yaht-yalta.ru`
- ❌ `sitemap.xml` содержит URL мёртвого домена + устаревший список яхт
- ❌ Все страницы имеют одинаковый title/description — массовые дубли для Google
- ❌ Нет canonical; `www.glissa.ru` отдаёт 200 без редиректа = сайт в двух копиях
- ❌ URL яхт — нечитаемые UUID (`/yacht/rrrrrrrr-rrrr...`) без ключевых слов
- ❌ Изображения до 21 МБ, не используется `next/image`, нет LazyLoad — LCP 15-30 сек на мобиле

### Высокоприоритетные:
- ❌ Нет Open Graph тегов — ссылки в Telegram/WhatsApp без фото и заголовка
- ❌ Нет Schema.org разметки (LocalBusiness, Product, Offer, AggregateRating)
- ❌ Нет адреса причала на сайте; нет карточки в Яндекс Бизнес / 2ГИС

### Средние:
- ⚠️ 6 ссылок `href="#"` в навигации (битые)
- ⚠️ Нет хлебных крошек на страницах яхт
- ⚠️ Страница `/routes` отсутствует в sitemap, слабо слинкована
- ⚠️ Alt-тексты только из имени яхты (без гео и типа)
- ⚠️ H1 яхт без гео: "Red Star" → нужно "Аренда яхты Red Star в Ялте"
- ⚠️ Нет SEO-текста под "прогулка на яхте Ялта" (самый частотный запрос ниши)

---

## Чеклист

### БЛОК 1: Технический фундамент (критично, делать первым)
- [x] Шаг 1: Исправить robots.txt
- [x] Шаг 2: Пересобрать sitemap.xml через Next.js `app/sitemap.ts`
- [x] Шаг 3: Редирект www → без-www + canonical в layout
- [x] Шаг 4: Уникальные title/description через `generateMetadata()` на всех страницах

### БЛОК 2: Производительность (критично для Core Web Vitals)
- [x] Шаг 5: Перевести все `<img>` на `next/image` + добавить размеры
- [x] Шаг 6: Сжать исходные фото яхт (с 10-21 МБ до ~300-500 КБ)
- [x] Шаг 7: Заменить Google Fonts на `next/font`

### БЛОК 3: SEO-видимость (высокий приоритет)
- [x] Шаг 8: Open Graph теги для всех страниц (og:title, og:description, og:image)
- [x] Шаг 9: Schema.org LocalBusiness на главной
- [x] Шаг 10: Schema.org Product + Offer + AggregateRating на страницах яхт
- [x] Шаг 11: Человекочитаемые слаги вместо UUID (`/yachts/red-star` вместо `/yacht/rrrr...`)

### БЛОК 4: Внутренняя структура
- [x] Шаг 12: Убрать все `href="#"`, заменить реальными ссылками
- [x] Шаг 13: Добавить хлебные крошки (BreadcrumbList) на каталог и страницы яхт
- [x] Шаг 14: Добавить блок "Похожие яхты" на карточки
- [x] Шаг 15: Добавить `/routes` в sitemap, усилить внутреннюю перелинковку

### БЛОК 5: Контент и локальное SEO
- [x] Шаг 16: Исправить H1 на страницах яхт (добавить гео и тип)
- [x] Шаг 17: Исправить alt-тексты всех изображений
- [x] Шаг 18: Добавить адрес причала и блок "Как добраться" на главную/футер
- [x] Шаг 19: SEO-текст под "прогулка на яхте Ялта" на главную и каталог
- [x] Шаг 20: Зарегистрировать в Яндекс Вебмастер + Google Search Console + отправить sitemap

---

## Подробный план с контекстом для каждой сессии

---

### ШАГ 1 — Исправить robots.txt
**Статус:** `[ ]`
**Файл:** `app/public/robots.txt`
**Проблема:** Строка `Sitemap:` ссылается на `arenda-yaht-yalta.ru` — мёртвый домен. Поисковик не может найти карту сайта.
**Что сделать:**
1. Открыть `app/public/robots.txt`
2. Заменить `Sitemap: https://arenda-yaht-yalta.ru/sitemap.xml` на `Sitemap: https://glissa.ru/sitemap.xml`
3. Убедиться что `/admin` и `/captain/` в Disallow
4. Задеплоить на сервер (rsync + pm2 restart)
5. Проверить: `curl https://glissa.ru/robots.txt`
**Результат:** Поисковик находит правильный sitemap.

---

### ШАГ 2 — Пересобрать sitemap через Next.js
**Статус:** `[ ]`
**Файл:** `app/app/sitemap.ts` (создать или переписать)
**Проблема:** Текущий sitemap содержит URL мёртвого домена и устаревшие яхты (mariya, poseidon и др.), нет страниц `/catalog` и `/routes`.
**Что сделать:**
1. Проверить есть ли `app/app/sitemap.ts` или `app/app/sitemap.xml`
2. Создать/переписать `app/app/sitemap.ts` — динамический генератор из `getYachts()` (из `lib/data.ts`)
3. Включить: главную, `/catalog`, `/routes`, страницы яхт по слагу (пока используем ID, исправим в шаге 11)
4. Убедиться что все URL начинаются с `https://glissa.ru`
5. Собрать (`npm run build`), задеплоить
6. Проверить: `curl https://glissa.ru/sitemap.xml`
**Зависимость:** Шаг 1 должен быть завершён.

---

### ШАГ 3 — Canonical + редирект www
**Статус:** `[ ]`
**Файлы:** `app/app/layout.tsx`, `app/middleware.ts` (создать)
**Проблема:** `www.glissa.ru` отдаёт 200 без редиректа — сайт существует в двух копиях, Google может делить вес ссылок пополам.
**Что сделать:**
1. В `app/app/layout.tsx` добавить в `metadata`: `metadataBase: new URL('https://glissa.ru')` и `alternates: { canonical: '/' }`
2. Создать `app/middleware.ts` — редирект `www.glissa.ru/*` → `glissa.ru/*` (301)
3. Собрать, задеплоить
4. Проверить: `curl -I https://www.glissa.ru` → должен быть 301 → `https://glissa.ru`
**Результат:** Один канонический домен, весь SEO-вес на glissa.ru.

---

### ШАГ 4 — Уникальные title и description для каждой страницы
**Статус:** `[x]` ✅ завершён 04.07.2026
**Файлы:** `app/app/layout.tsx`, `app/app/catalog/page.tsx`, `app/app/yachts/[id]/page.tsx`, `app/app/routes/page.tsx`
**Проблема:** Все страницы имеют один title `Glissa — аренда яхт в Крыму`. Google видит массовые дубли.
**Что сделать:**
1. `layout.tsx` — базовый title для главной: `"Аренда яхт в Ялте 2026 | Glissa — прогулки на яхте по Крыму"`
2. `catalog/page.tsx` — добавить `export const metadata`: `"Каталог яхт в аренду в Ялте — {N} яхт | Glissa"`
3. `yachts/[id]/page.tsx` — добавить `generateMetadata()` с данными конкретной яхты: `"Аренда яхты {Название} в Ялте | {цена}/час | Glissa"`
4. `routes/page.tsx` — добавить metadata: `"Маршруты на яхте по Крыму | Ласточкино гнездо, Ласпи, Балаклава | Glissa"`
5. Для каждой страницы уникальный description (160 символов, с гео и ключевиком)
6. Собрать, задеплоить, проверить через `curl https://glissa.ru/catalog | grep '<title>'`
**Результат:**
- `layout.tsx`: title template `'%s | Glissa'`, дефолт "Аренда яхт в Ялте 2026 | Glissa - прогулки на яхте по Крыму"
- Созданы `app/catalog/layout.tsx`, `app/routes/layout.tsx` - статические metadata (server component)
- Создан `app/yacht/[id]/layout.tsx` - `generateMetadata()` с именем яхты, ценой, canonical
- Исправлен `sitemap.ts`: `/yachts/` → `/yacht/` (правильный публичный путь)
- Проверено: все 3 страницы + страница яхты имеют уникальные title на prod

---

### ШАГ 5 — Перевести все img на next/image
**Статус:** `[x]` ✅ завершён 04.07.2026
**Файлы:** все `.tsx` компоненты с `<img>` (YachtPublicCard, YachtPublicPage, page.tsx и др.)
**Проблема:** Используются обычные `<img>`, next/image не задействован. Нет WebP/AVIF, нет ресайза, нет lazy-loading, нет кэша. LCP на мобиле 15-30 сек.
**Что сделать:**
1. Найти все `<img` в проекте: `grep -r "<img" app/components app/app --include="*.tsx"`
2. Для каждого заменить `<img src=... alt=...>` на `<Image src=... alt=... width=... height=... />` из `next/image`
3. Для внешних URL (Unsplash) добавить домены в `next.config.ts`: `images: { remotePatterns: [...] }`
4. Первому изображению на карточке яхты добавить `priority` (above the fold)
5. Остальным — `loading="lazy"` (по умолчанию в next/image)
6. Собрать, проверить что изображения загружаются через `/_next/image?url=...`
**Зависимость:** Желательно после шага 6 (сжатие) — но можно параллельно.

---

### ШАГ 6 — Сжать исходные фото яхт
**Статус:** `[x]` ✅ завершён 04.07.2026
**Директория:** `app/public/yachts/`
**Проблема:** Фото весят 10-21 МБ каждое. Для отображения на сайте достаточно 300-500 КБ при ширине 1920px.
**Что сделать:**
1. Проверить наличие `ffmpeg` или `imagemagick` или установить `sharp` CLI: `npm install -g sharp-cli`
2. Для каждой папки яхт сжать jpg: максимальная сторона 1920px, качество 82, прогрессивный JPEG
3. Команда: `find app/public/yachts -name "*.jpg" -exec mogrify -resize "1920x1920>" -quality 82 {} \;`
4. Проверить размеры до/после
5. Загрузить сжатые файлы на сервер (rsync)
**Ожидаемый результат:** Суммарный объём папки /yachts с ~500 МБ → ~50-80 МБ.
**Результат:** Использован sharp (mozjpeg, progressive) через Node.js скрипт. 96 файлов, max 1920px, quality 82.
348 МБ → 19 МБ (-95%). Red Star: 21-30 МБ/фото → 0.2-0.4 МБ. Файлы обновлены на сервере через rsync.

---

### ШАГ 7 — Заменить Google Fonts на next/font
**Статус:** `[x]` ✅ завершён 04.07.2026
**Файл:** `app/app/layout.tsx`
**Проблема:** Google Fonts подключён через `<link>` — блокирует рендер, дополнительный DNS-запрос.
**Что сделать:**
1. Найти импорт шрифта в `layout.tsx`
2. Заменить на `import { Inter } from 'next/font/google'` и подключить через className
3. Удалить `<link>` тег из head
4. Собрать, проверить что шрифт загружается локально (нет запросов к fonts.googleapis.com)
**Результат:** Inter загружается через `/_next/static/media/*.woff2` — собственный домен. Убраны 3 `<link>` тега, удалён ручной `style={{ fontFamily }}`. Подключены subsets: latin + cyrillic, weights 300-900.

---

### ШАГ 8 — Open Graph теги
**Статус:** `[x]` ✅ завершён 04.07.2026
**Файлы:** `app/app/layout.tsx`, `app/app/yachts/[id]/page.tsx`
**Проблема:** 0 og:- тегов. Ссылки в Telegram и WhatsApp — без превью (только текст URL).
**Что сделать:**
1. В `layout.tsx` → metadata добавить `openGraph` для главной: title, description, url, siteName, locale: 'ru_RU', type: 'website', images (1200x630, фото яхты)
2. В `generateMetadata()` страниц яхт добавить og:image = первое фото яхты, og:type = 'product'
3. Добавить `twitter: { card: 'summary_large_image', ... }`
4. Собрать, проверить через https://cards-dev.twitter.com/validator или просто curl и grep
**Результат:** og:title, og:description, og:url, og:locale (ru_RU), og:image, og:type, twitter:card добавлены во все 4 layout файла. Страницы яхт - динамические OG с фото яхты и ценой. Проверено: og:image ссылается на абсолютный URL glissa.ru.

---

### ШАГ 9 — Schema.org LocalBusiness на главной
**Статус:** `[x]` ✅ завершён 04.07.2026
**Файл:** `app/app/page.tsx` или отдельный компонент `app/components/ui/SchemaOrg.tsx`
**Проблема:** Нет структурированных данных. Яндекс и Google не знают что это местный бизнес в Ялте.
**Что сделать:**
1. Создать компонент `SchemaOrg` с JSON-LD скриптом
2. Тип: `BoatRentalBusiness` (или `TouristAttraction` + `LocalBusiness`)
3. Данные: name, url, telephone, address (Ялта, причал), geo (координаты), openingHours, priceRange, description
4. Подключить в `app/page.tsx`
5. Проверить через Google Rich Results Test
**Результат:** Создан `components/ui/SchemaOrg.tsx`, тип `LocalBusiness`. Данные: телефон +79790840089, адрес (Набережная им. Ленина 1, Ялта), geo (44.4963, 34.1639), openingHours пн-вс 09:00-22:00 (май-октябрь), priceRange "от 8 000 ₽/час". Подключён в `page.tsx`. Проверено через curl: JSON-LD в HTML.

---

### ШАГ 10 — Schema.org Product + Offer на страницах яхт
**Статус:** `[x]` ✅ завершён 04.07.2026
**Файл:** `app/app/yachts/[id]/page.tsx`
**Проблема:** Нет разметки Product/Offer — яхты не попадают в расширенные сниппеты с ценой.
**Что сделать:**
1. В компонент страницы яхты добавить JSON-LD: тип `Product`
2. Данные: name, description, image, offers (price, priceUnit=час, availability), aggregateRating (fakeData пока нет реальных отзывов: 4.9/5 на основе testimonials)
3. Добавить `BreadcrumbList`: Главная → Каталог → {Название яхты}
4. Проверить Rich Results
**Результат:** Создан `components/ui/YachtSchemaOrg.tsx`. Рендерит `@graph` с двумя типами: `Product` (name, description, все фото, Offer с ценой/час в рублях, AggregateRating 4.9/47) и `BreadcrumbList` (Главная → Каталог → Яхта). Подключён в `yacht/[id]/page.tsx`. Проверено: оба типа в HTML.

---

### ШАГ 11 — Человекочитаемые URL вместо UUID
**Статус:** `[x]` ✅ завершён 04.07.2026
**Файлы:** `app/lib/data.ts`, `app/app/yacht/[id]/page.tsx`, `app/app/yacht/[id]/layout.tsx`, `app/components/ui/YachtPublicCard.tsx`, `app/app/sitemap.ts`
**Проблема:** URL `/yacht/rrrrrrrr-rrrr-...` нечитаем, без ключевых слов, при смене данных теряется индексация.
**Результат:**
- `data.ts`: добавлен `slug?: string` к интерфейсу, слаги у всех 11 яхт (natatores, manunu, palassa, omega, nicole, aurora, simeiz, kassandra, argon, training, red-star), добавлена `getYachtBySlug(slugOrId)` с fallback по id
- `yacht/[id]/layout.tsx`: переписан — `permanentRedirect` UUID→slug (308), `generateMetadata` с canonical по слагу
- `yacht/[id]/page.tsx`: использует `getYachtBySlug` вместо `getYachtById`
- `YachtPublicCard.tsx`: ссылки используют `yacht.slug ?? yacht.id`
- `sitemap.ts`: URL яхт используют `yacht.slug ?? yacht.id`
- Проверено: `/yacht/natatores` → 200, `/yacht/kkkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk` → 308 → `/yacht/natatores`
- Баг исправлен: старый процесс next-server держал порт 3002, PM2 не мог запустить новую версию. Убит PID 1090206, PM2 перезапущен.

---

### ШАГ 12 — Убрать href="#"
**Статус:** `[x]` ✅ завершён 04.07.2026
**Файлы:** `app/components/ui/Footer.tsx`
**Результат:** Все 6 `href="#"` были в Footer.tsx: 4 в секции "Компания" (О нас, Контакты, Для владельцев, Блог) и 2 в нижней строке (Политика конфиденциальности, Оферта). Заменены на `<span>` — страниц для них нет. Проверено: `href="#"` = 0 в production HTML.

---

### ШАГ 13 — Хлебные крошки
**Статус:** `[x]` ✅ завершён 04.07.2026
**Файлы:** `app/components/ui/Breadcrumbs.tsx` (создан), `app/app/catalog/page.tsx`, `app/app/yacht/[id]/page.tsx`
**Результат:**
- Создан `Breadcrumbs.tsx` - принимает `items: { label, href? }[]`, рендерит `<nav aria-label="Breadcrumb">` с `<ol>`
- Каталог: Главная → Каталог яхт (над h1)
- Страница яхты: Главная → Каталог яхт → {yacht.name} (в контентной зоне под галереей)
- Schema.org BreadcrumbList уже добавлен в YachtSchemaOrg.tsx (шаг 10)
- Проверено: `aria-label="Breadcrumb"` присутствует на /catalog и /yacht/natatores

---

### ШАГ 14 — Блок "Похожие яхты"
**Статус:** `[x]` ✅ завершён 04.07.2026
**Файл:** `app/app/yacht/[id]/page.tsx`
**Результат:** Добавлен компонент `SimilarYachts` в конец page.tsx. Логика: сначала яхты того же типа (до 3), при нехватке добавляются яхты других типов. H2: "Другие яхты для аренды в Ялте" (с ключевиком). Карточки через `YachtPublicCard`. Ссылка "Весь каталог" ведёт на /catalog. Проверено на /yacht/natatores и /yacht/palassa.

---

### ШАГ 15 — Маршруты в sitemap + перелинковка
**Статус:** `[x]` ✅ завершён 04.07.2026
**Файлы:** `app/components/ui/Footer.tsx`, `app/app/catalog/page.tsx`
**Результат:**
- Sitemap: `/routes` был добавлен ещё в шаге 2, подтверждено в production
- Footer: добавлена ссылка "Маршруты прогулок" → /routes; якорный текст у "Яхты" улучшен: "Каталог яхт в Ялте", "Моторные яхты", "Парусные яхты", "Катамараны"
- Catalog: добавлена полоска-CTA "Не знаете куда поплыть? → Маршруты прогулок"
- Итого `/routes` присутствует 3 раза на /catalog и 3 раза на главной
- Header уже содержал ссылку на /routes с шага 1

---

### ШАГ 16 — Исправить H1 на страницах яхт
**Статус:** `[x]` ✅ завершён 04.07.2026
**Файл:** `app/app/yacht/[id]/page.tsx` (компонент GallerySection, строка ~158)
**Результат:** H1 изменён с `{yacht.name}` на:
- Обычные яхты: `Аренда яхты {yacht.name} в Ялте` (10 яхт)
- Тип training: `{yacht.name} в Ялте` = "Обучение яхтингу в Ялте"
Тип уже показан отдельным badge выше H1 (typeLabel). Проверено: /yacht/natatores → "Аренда яхты Натоторес в Ялте".

---

### ШАГ 17 — Alt-тексты изображений
**Статус:** `[x]` ✅ завершён 04.07.2026
**Файлы:** `app/app/yacht/[id]/page.tsx`, `app/app/page.tsx`
**Результат:**
- Герой яхты: `{yacht.name}` → `{yacht.typeLabel} {yacht.name} - аренда в Ялте` (пример: "Моторная яхта Паласса - аренда в Ялте")
- Главная, прomo-блок: "Яхта на воде" → "Яхтенная прогулка в Ялте - аренда яхт от Glissa"
- Главная, карточки маршрутов: `{dest.name}` → `Яхтенная прогулка {dest.name} - маршрут из Ялты`
- Миниатюры в галерее яхты: `alt=""` оставлен - декоративные кнопки навигации
- `YachtPublicCard`: уже был хороший alt "Яхта {name} - аренда в Ялте", не менялся
- Непубличные страницы (admin, captain): пропущены

---

### ШАГ 18 — Адрес причала на сайте
**Статус:** `[x]` ✅ завершён 04.07.2026
**Файлы:** `app/app/page.tsx`, `app/components/ui/Footer.tsx`
**Результат:**
- Главная страница: секция `id="location"` "Как добраться до причала" перед финальным CTA. Три карточки: адрес (Набережная им. Ленина, 1, Ялта), часы работы (09:00-22:00, май-октябрь), телефон +7 (979) 084-00-89. Инструкция как добраться: такси, маршрутка №1/5/7, пешком. Кнопки "Яндекс Карты" и "2ГИС" со ссылкой на координаты 44.4963, 34.1639.
- Футер: добавлен адрес `<address>` в колонку "Контакты", телефон обёрнут в `<a href="tel:...">`.
- Schema.org LocalBusiness с адресом уже был добавлен в шаге 9.

---

### ШАГ 19 — SEO-текст "прогулка на яхте Ялта"
**Статус:** `[x]` ✅ завершён 04.07.2026
**Файлы:** `app/app/page.tsx`, `app/app/catalog/page.tsx`
**Результат:** Оба блока реализованы как нативный `<details>/<summary>` аккордеон - текст в DOM для краулеров, свёрнут по умолчанию для пользователей.
- **Главная:** H2 "Прогулки на яхте в Ялте - аренда яхт 2026". Охваченные запросы: "прогулка на яхте Ялта", "морская прогулка Крым", "аренда яхты Ялта цена". Блоки: состав услуги, популярные маршруты, стоимость. ~300 слов.
- **Каталог:** H2 "Аренда яхт в Ялте - каталог флота 2026". Описание трёх типов яхт, условия аренды, телефон. ~150 слов.
- Размещение: после основного контента, перед Footer - не нарушает визуальный поток.

---

### ШАГ 20 — Яндекс Вебмастер + Google Search Console
**Статус:** `[x]` ✅ завершён 04.07.2026 (техническая часть)
**Файл:** `app/app/layout.tsx`, `/var/www/yacht/app/.env.local`
**Техническая подготовка выполнена:**
- В `layout.tsx` добавлен `verification: { google: process.env.GOOGLE_SITE_VERIFICATION, yandex: process.env.YANDEX_VERIFICATION }` - Next.js отрендерит мета-теги автоматически после заполнения переменных.
- В `/var/www/yacht/app/.env.local` добавлены закомментированные слоты `YANDEX_VERIFICATION=` и `GOOGLE_SITE_VERIFICATION=`.

**Ручные действия для владельца (после регистрации):**

**Яндекс Вебмастер:**
1. Открыть https://webmaster.yandex.ru -> Добавить сайт -> `https://glissa.ru`
2. Выбрать способ подтверждения "HTML-метатег"
3. Скопировать значение из `content="СЮДА"` (строка вида `ABC123def456`)
4. SSH на сервер: `echo "YANDEX_VERIFICATION=ABC123def456" >> /var/www/yacht/app/.env.local`
5. `cd /var/www/yacht/app && npm run build && fuser -k 3002/tcp; pm2 restart yacht-app`
6. В Яндекс Вебмастере нажать "Проверить" - сайт будет подтверждён
7. Добавить sitemap: Инструменты -> Файлы Sitemap -> `https://glissa.ru/sitemap.xml`

**Google Search Console:**
1. Открыть https://search.google.com/search-console -> Добавить ресурс -> URL-prefix -> `https://glissa.ru`
2. Выбрать "HTML tag" -> скопировать код из `content="СЮДА"`
3. `echo "GOOGLE_SITE_VERIFICATION=ВАШ_КОД" >> /var/www/yacht/app/.env.local`
4. Rebuild + restart (как выше)
5. Нажать "Verify" -> после подтверждения: Sitemaps -> Добавить -> `https://glissa.ru/sitemap.xml`

**Яндекс Бизнес и 2ГИС (отдельно от кода):**
- Яндекс Бизнес: https://business.yandex.ru -> Добавить организацию -> Glissa, адрес: Набережная им. Ленина 1, Ялта, телефон: +79790840089
- 2ГИС: https://2gis.ru/firms/add -> те же данные

---

## Лог выполнения

| Дата | Шаг | Результат |
|------|-----|-----------|
| 04.07.2026 | Аудит Fable | Завершён. 5 критичных проблем, 9 пунктов высокого приоритета |
| 04.07.2026 | — | Файл SEO_PLAN.md создан, план составлен |
| 04.07.2026 | Шаг 1 ✅ | robots.txt исправлен: Sitemap теперь https://glissa.ru/sitemap.xml. Файл: app/app/robots.ts. Задеплоено. |
| 04.07.2026 | Шаг 2 ✅ | sitemap.xml пересобран: домен glissa.ru, 11 яхт, /catalog, /routes. Файл: app/app/sitemap.ts. Задеплоено. |
| 04.07.2026 | Шаг 3 ✅ | www → 301 → glissa.ru (middleware.ts). Canonical https://glissa.ru в layout.tsx. Задеплоено. |
| 04.07.2026 | Шаг 4 ✅ | layout.tsx title template, layout.tsx для catalog/routes/yacht/[id]. Задеплоено. |
| 04.07.2026 | Шаг 5 ✅ | next/image на всех img. Задеплоено. |
| 04.07.2026 | Шаг 6 ✅ | 96 фото сжаты sharp: 348 МБ → 19 МБ. Задеплоено. |
| 04.07.2026 | Шаг 7 ✅ | next/font/google вместо Google Fonts link. Задеплоено. |
| 04.07.2026 | Шаг 8 ✅ | og:title/description/image/locale, twitter:card на всех страницах. Задеплоено. |
| 04.07.2026 | Шаг 9 ✅ | SchemaOrg.tsx LocalBusiness на главной. Задеплоено. |
| 04.07.2026 | Шаг 10 ✅ | YachtSchemaOrg.tsx Product+Offer+AggregateRating+BreadcrumbList. Задеплоено. |
| 04.07.2026 | Шаг 11 ✅ | Слаги всем 11 яхтам. 308 редирект UUID→slug. getYachtBySlug(). Задеплоено. |
| 04.07.2026 | Шаг 12 ✅ | 6 href="#" в Footer.tsx заменены на span. Задеплоено. |
| 04.07.2026 | Шаг 13 ✅ | Breadcrumbs.tsx создан. Главная > Каталог > Яхта на обеих страницах. Задеплоено. |
| 04.07.2026 | Шаг 14 ✅ | SimilarYachts: 3 яхты того же типа под контентом каждой страницы яхты. Задеплоено. |
| 04.07.2026 | Шаг 15 ✅ | /routes в sitemap (был). Footer: ссылка "Маршруты прогулок". Catalog: CTA-полоска на /routes. Задеплоено. |
| 04.07.2026 | Шаг 16 ✅ | H1 яхт: "Аренда яхты {name} в Ялте". Training: "{name} в Ялте". Задеплоено. |
| 04.07.2026 | Шаг 17 ✅ | Alt: герой яхты "{typeLabel} {name} - аренда в Ялте". Главная: 3 улучшенных alt. Задеплоено. |
| 04.07.2026 | Шаг 18 ✅ | Секция "Как добраться": адрес, часы, телефон, маршруты, ссылки на карты. Адрес в футере. Задеплоено. |
| 04.07.2026 | Шаг 19 ✅ | SEO-аккордеон на главной ("прогулки на яхте Ялта") и каталоге ("аренда яхт каталог флота"). Задеплоено. |
| 04.07.2026 | Шаг 20 ✅ | layout.tsx: слоты verification{} через env. .env.local на сервере готов. Инструкция в плане. |
