import 'dotenv/config';
import { createBot } from './src/bot.js';

const token = process.env.TELEGRAM_BOT_TOKEN;
const apiKey = process.env.ANTHROPIC_API_KEY;

if (!token) {
  console.error('TELEGRAM_BOT_TOKEN не задан. Скопируй env.example в .env и заполни.');
  process.exit(1);
}

if (!apiKey) {
  console.error('ANTHROPIC_API_KEY не задан. Скопируй env.example в .env и заполни.');
  process.exit(1);
}

const bot = createBot(token);

bot.start({
  onStart: (info) => {
    console.log(`✅ Бот @${info.username} запущен`);
    console.log(`   Напиши /start в Telegram чтобы начать`);
  },
});

// Graceful shutdown
process.once('SIGINT', () => bot.stop());
process.once('SIGTERM', () => bot.stop());
