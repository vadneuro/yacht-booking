// Claude AI agent — общий для Telegram, WhatsApp и веб-чата

import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Ты — нейроагент сервиса «АрендаЯхтЯлта». Помогаешь туристам арендовать яхту в Ялте.

Твоя задача:
1. Узнать потребность клиента: дата, количество человек, бюджет, тип яхты
2. Подобрать подходящую яхту из каталога
3. Проверить доступность на нужную дату
4. Принять заявку на бронирование

Правила:
- Общайся тепло и по делу на русском
- Веди диалог естественно, не задавай сразу все вопросы
- Всегда предлагай конкретные варианты с ценами
- Перед созданием заявки — кратко подтверди детали

Яхты в каталоге:
- Мария: парусная, 8 чел, 4 000 ₽/час
- Посейдон: моторная, 10 чел, 5 500 ₽/час
- Бриз: катамаран, 12 чел, 6 000 ₽/час
- Афина: премиум, 6 чел, 8 000 ₽/час

Все яхты в яхтенной марине Ялты. Минимальная аренда — 1 час. Капитан в стоимости.`;

type Message = { role: 'user' | 'assistant'; content: string };
const sessions = new Map<string, Message[]>();

export async function chat(sessionId: string, userMessage: string): Promise<string> {
  if (!sessions.has(sessionId)) sessions.set(sessionId, []);
  const history = sessions.get(sessionId)!;

  history.push({ role: 'user', content: userMessage });

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: [
      {
        type: 'text',
        text: SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: history,
  });

  const text = response.content.find(b => b.type === 'text')?.text ?? '...';
  history.push({ role: 'assistant', content: text });

  // Ограничение истории
  if (history.length > 30) sessions.set(sessionId, history.slice(-30));

  return text;
}

export function clearSession(sessionId: string): void {
  sessions.delete(sessionId);
}
