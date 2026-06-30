import { Bot, InlineKeyboard } from 'grammy';
import { chat, clearHistory } from './agent.js';

export function createBot(token) {
  const bot = new Bot(token);
  const adminId = process.env.ADMIN_TELEGRAM_ID
    ? parseInt(process.env.ADMIN_TELEGRAM_ID)
    : null;

  // /start — приветствие
  bot.command('start', async (ctx) => {
    const name = ctx.from?.first_name ?? 'гость';
    await ctx.reply(
      `Привет, ${name}! Я помогу подобрать и забронировать яхту в Ялте.\n\nПросто напиши — например, «хочу яхту на 6 человек в эти выходные» или «что у вас есть?»`,
      {
        reply_markup: new InlineKeyboard()
          .text('🛥 Показать яхты', 'show_yachts')
          .row()
          .text('📞 Позвонить', 'call'),
      }
    );
  });

  // /new — сброс контекста
  bot.command('new', async (ctx) => {
    clearHistory(ctx.chat.id);
    await ctx.reply('Начинаем сначала. Чем могу помочь?');
  });

  // Кнопки
  bot.callbackQuery('show_yachts', async (ctx) => {
    await ctx.answerCallbackQuery();
    const reply = await chat(ctx.chat.id, 'Покажи все доступные яхты');
    await ctx.reply(reply);
  });

  bot.callbackQuery('call', async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.reply('Позвонить напрямую: +7 979 084-00-89');
  });

  // Все текстовые сообщения — через нейроагента
  bot.on('message:text', async (ctx) => {
    const text = ctx.message.text;
    if (text.startsWith('/')) return;

    await ctx.replyWithChatAction('typing');

    try {
      const reply = await chat(ctx.chat.id, text);
      await ctx.reply(reply);

      // Уведомляем админа о новой заявке если в ответе есть booking_id
      if (adminId && reply.includes('BK-')) {
        const bookingMatch = reply.match(/BK-[A-Z0-9]+/);
        if (bookingMatch) {
          const clientInfo = `@${ctx.from?.username ?? ctx.from?.first_name ?? 'unknown'} (${ctx.from?.id})`;
          await bot.api.sendMessage(
            adminId,
            `📋 Новая заявка ${bookingMatch[0]}\nКлиент: ${clientInfo}`
          );
        }
      }
    } catch (err) {
      console.error('Agent error:', err);
      await ctx.reply('Что-то пошло не так. Попробуй ещё раз или позвони: +7 979 084-00-89');
    }
  });

  bot.catch((err) => {
    console.error('Bot error:', err);
  });

  return bot;
}
