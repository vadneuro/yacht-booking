import Anthropic from '@anthropic-ai/sdk';
import { TOOL_DEFINITIONS } from './tools.js';
import { handleToolCall } from './tool-handlers.js';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Ты — нейроагент сервиса «АрендаЯхтЯлта». Помогаешь туристам арендовать яхту в Ялте.

Твоя задача:
1. Узнать потребность клиента: дата, количество человек, бюджет, предпочтения (тип яхты, цели)
2. Подобрать подходящую яхту из каталога
3. Проверить доступность на нужную дату
4. Принять заявку на бронирование

Правила общения:
- Общайся на русском, тепло и по делу
- Не задавай все вопросы сразу — веди диалог естественно
- Если клиент не знает что хочет — задай 1-2 уточняющих вопроса
- Всегда предлагай конкретные варианты, а не просто описывай возможности
- Цены указывай в рублях, время — в формате 10:00-18:00
- Перед созданием заявки — коротко подтверди детали брони

Для создания заявки нужно собрать:
- Название яхты (уже известно из выбора)
- Дата (YYYY-MM-DD)
- Время начала и конца
- Имя клиента
- Телефон клиента

Формат ответов: короткие абзацы, без длинных списков. Конкретика, цифры, факты.`;

// conversations хранит историю сообщений по chat_id
const conversations = new Map();

export async function chat(chatId, userMessage) {
  // Инициализируем историю если нет
  if (!conversations.has(chatId)) {
    conversations.set(chatId, []);
  }

  const history = conversations.get(chatId);
  history.push({ role: 'user', content: userMessage });

  let response = await callClaude(history);

  // Обработка tool use в цикле
  while (response.stop_reason === 'tool_use') {
    const assistantMessage = { role: 'assistant', content: response.content };
    history.push(assistantMessage);

    const toolResults = [];
    for (const block of response.content) {
      if (block.type !== 'tool_use') continue;

      const result = await handleToolCall(block.name, block.input);
      toolResults.push({
        type: 'tool_result',
        tool_use_id: block.id,
        content: JSON.stringify(result),
      });
    }

    history.push({ role: 'user', content: toolResults });
    response = await callClaude(history);
  }

  // Сохраняем финальный ответ ассистента
  history.push({ role: 'assistant', content: response.content });

  // Ограничиваем историю — последние 40 сообщений
  if (history.length > 40) {
    conversations.set(chatId, history.slice(-40));
  }

  const textBlock = response.content.find(b => b.type === 'text');
  return textBlock?.text ?? '...';
}

async function callClaude(messages) {
  return client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: [
      {
        type: 'text',
        text: SYSTEM_PROMPT,
        // Кешируем системный промпт — он не меняется
        cache_control: { type: 'ephemeral' },
      },
    ],
    tools: TOOL_DEFINITIONS,
    messages,
  });
}

export function clearHistory(chatId) {
  conversations.delete(chatId);
}
