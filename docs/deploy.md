# Деплой АрендаЯхтЯлта на VPS

## Структура на сервере

```
/var/www/arenda-yaht-yalta/
├── landing/        ← статический лендинг (Nginx)
├── app/            ← Next.js приложение (PM2 + Nginx proxy)
└── agent/          ← Telegram-бот (PM2)
```

---

## 1. Подготовка VPS

```bash
# Обновить систему
apt update && apt upgrade -y

# Установить Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Установить PM2
npm install -g pm2

# Установить Nginx
apt install -y nginx

# Создать директорию
mkdir -p /var/www/arenda-yaht-yalta
```

---

## 2. Загрузить файлы

Со своего компьютера:
```bash
# Скопировать проект на сервер (заменить IP)
rsync -avz --exclude node_modules --exclude .git \
  /Users/a1234/Documents/Projects/yacht-booking/ \
  root@YOUR_SERVER_IP:/var/www/arenda-yaht-yalta/
```

---

## 3. Лендинг (статика через Nginx)

Создать файл `/etc/nginx/sites-available/arenda-yaht-yalta`:
```nginx
server {
    listen 80;
    server_name arenda-yaht-yalta.ru www.arenda-yaht-yalta.ru;

    root /var/www/arenda-yaht-yalta/landing;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    # Проксировать /api и остальные роуты в Next.js
    location /yachts {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
    }

    location /admin {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
    }

    location /captain {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/arenda-yaht-yalta /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

---

## 4. Next.js приложение

```bash
cd /var/www/arenda-yaht-yalta/app

# Создать .env.local из шаблона
cp env.local.example .env.local
nano .env.local   # вставить реальные ключи

# Установить зависимости и собрать
npm install
npm run build

# Запустить через PM2
pm2 start npm --name "yacht-app" -- start
pm2 save
pm2 startup
```

---

## 5. Telegram-бот

```bash
cd /var/www/arenda-yaht-yalta/agent

# Создать .env из шаблона
cp env.example .env
nano .env   # вставить токены

# Установить зависимости
npm install

# Запустить через PM2
pm2 start src/bot.js --name "yacht-bot"
pm2 save
```

---

## 6. HTTPS (Let's Encrypt)

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d arenda-yaht-yalta.ru -d www.arenda-yaht-yalta.ru
```

Сертификат обновляется автоматически.

---

## 7. Проверить что всё работает

```bash
pm2 status              # оба процесса running
curl localhost:3000     # Next.js отвечает
nginx -t                # конфиг без ошибок
```

Открыть в браузере:
- `https://arenda-yaht-yalta.ru` — лендинг
- `https://arenda-yaht-yalta.ru/yachts/mariya` — карточка яхты
- `https://arenda-yaht-yalta.ru/admin` — панель (PIN: 2026)
- `https://arenda-yaht-yalta.ru/captain/ivan-captain-2026` — кабинет капитана

---

## Что нужно от тебя перед деплоем

| Задача | Где сделать |
|--------|-------------|
| Купить домен arenda-yaht-yalta.ru | reg.ru или nic.ru |
| DNS: A-запись → IP сервера | Личный кабинет регистратора |
| Создать Supabase проект | supabase.com |
| Получить Anthropic API Key | console.anthropic.com |
| Создать Telegram-бота | @BotFather в Telegram |
| (Опционально) Подключить Twilio | twilio.com для WhatsApp |

---

## Ключи для .env файлов

### agent/.env
```
TELEGRAM_BOT_TOKEN=       # из @BotFather
ANTHROPIC_API_KEY=        # из console.anthropic.com
SUPABASE_URL=             # из Supabase → Settings → API
SUPABASE_ANON_KEY=        # из Supabase → Settings → API
ADMIN_TELEGRAM_ID=        # твой Telegram ID (узнать у @userinfobot)
```

### app/.env.local
```
ANTHROPIC_API_KEY=        # тот же ключ
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```
