import Anthropic from '@anthropic-ai/sdk';
import { TOOL_DEFINITIONS } from './agent-tools';
import { handleToolCall } from './agent-tool-handlers';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Ты — ИИ-консьерж сервиса Glissa — премиальной платформы аренды яхт в Крыму. Работаешь 24/7 и можешь принимать бронирования в любое время суток.

Твоя личность:
- Дружелюбный, но профессиональный
- Создаёшь ощущение заботы и эксклюзивности
- Отвечаешь кратко и по делу (максимум 3-4 предложения за раз)
- Используешь эмодзи умеренно (1-2 на сообщение)

Твоя задача:
1. Понять мечту клиента (романтика? день рождения? семейный отдых? корпоратив?)
2. Узнать: дату, количество гостей, бюджет, предпочтения
3. Использовать инструмент get_yachts для подбора яхты
4. Проверить доступность через check_availability
5. Создать бронирование через create_booking или заявку через create_inquiry

МОДЕЛЬ БРОНИРОВАНИЯ:
- Стандартные прогулки (2-8 часов): используй create_booking. Клиент оплачивает только бронь (15% комиссия). Остальное — капитану в день прогулки.
- Сложные запросы (корпоративы, свадьбы, многодневные, индивидуальные маршруты): используй create_inquiry. Менеджер свяжется для обсуждения.

Для бронирования тебе нужно собрать:
- Яхту (подбери через get_yachts)
- Дату (YYYY-MM-DD)
- Время начала и конца (HH:MM)
- Имя клиента
- Телефон клиента

Правила:
- Не задавай все вопросы сразу — веди диалог естественно
- Предлагай конкретные варианты, а не просто описывай
- Перед созданием бронирования — коротко подтверди детали
- После создания бронирования обязательно сообщи клиенту сумму комиссии и ссылку на оплату
- Цены в рублях, время — 10:00-18:00
- Капитан ВСЕГДА включён в стоимость, топливо включено
- Бесплатная отмена за 24 часа
- Минимальная аренда — 2 часа

Популярные маршруты:
• Ласточкино гнездо (2-3 ч) — самый популярный
• Бухта Ласпи (4-5 ч) — снорклинг, дикие пляжи
• Форос—Балаклава (6-8 ч) — гроты, закат

Контакты для связи с менеджером:
• WhatsApp / Telegram / Звонок: +7 (979) 084-00-89

Сегодняшняя дата: ${new Date().toISOString().split('T')[0]}

Никогда не выдумывай информацию. Если не знаешь — предложи связаться с менеджером.`;

const MAX_TOOL_ITERATIONS = 5;

type MessageParam = Anthropic.Messages.MessageParam;
const sessions = new Map<string, MessageParam[]>();

export interface ChatResult {
  reply: string;
  bookingId?: string;
  action?: 'booking_created' | 'inquiry_created';
}

export async function chat(sessionId: string, userMessage: string): Promise<ChatResult> {
  if (!sessions.has(sessionId)) sessions.set(sessionId, []);
  const history = sessions.get(sessionId)!;

  history.push({ role: 'user', content: userMessage });

  let response = await callClaude(history);
  let iterations = 0;
  let bookingId: string | undefined;
  let action: ChatResult['action'];

  while (response.stop_reason === 'tool_use' && iterations < MAX_TOOL_ITERATIONS) {
    iterations++;
    history.push({ role: 'assistant', content: response.content });

    const toolResults: Anthropic.Messages.ToolResultBlockParam[] = [];
    for (const block of response.content) {
      if (block.type !== 'tool_use') continue;

      const result = await handleToolCall(block.name, block.input as Record<string, unknown>);

      if (block.name === 'create_booking' && (result as Record<string, unknown>).success) {
        bookingId = (result as Record<string, unknown>).booking_id as string;
        action = 'booking_created';
      } else if (block.name === 'create_inquiry' && (result as Record<string, unknown>).success) {
        bookingId = (result as Record<string, unknown>).inquiry_id as string;
        action = 'inquiry_created';
      }

      toolResults.push({
        type: 'tool_result',
        tool_use_id: block.id,
        content: JSON.stringify(result),
      });
    }

    history.push({ role: 'user', content: toolResults });
    response = await callClaude(history);
  }

  history.push({ role: 'assistant', content: response.content });

  if (history.length > 40) sessions.set(sessionId, history.slice(-40));

  const textBlock = response.content.find((b): b is Anthropic.Messages.TextBlock => b.type === 'text');
  return {
    reply: textBlock?.text ?? '...',
    bookingId,
    action,
  };
}

async function callClaude(messages: MessageParam[]) {
  return client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: [{
      type: 'text',
      text: SYSTEM_PROMPT,
      cache_control: { type: 'ephemeral' },
    }],
    tools: TOOL_DEFINITIONS,
    messages,
  });
}

export function clearSession(sessionId: string): void {
  sessions.delete(sessionId);
}
