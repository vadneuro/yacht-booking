import type Anthropic from '@anthropic-ai/sdk';

export const TOOL_DEFINITIONS: Anthropic.Messages.Tool[] = [
  {
    name: 'get_yachts',
    description: 'Получить список доступных яхт. Можно фильтровать по вместимости, типу и цене.',
    input_schema: {
      type: 'object' as const,
      properties: {
        min_capacity: { type: 'number', description: 'Минимальное количество человек' },
        yacht_type: {
          type: 'string',
          enum: ['sailing', 'motor', 'catamaran'],
          description: 'Тип яхты: sailing=парусная, motor=моторная, catamaran=катамаран',
        },
        max_price_per_hour: { type: 'number', description: 'Максимальная цена за час в рублях' },
      },
    },
  },
  {
    name: 'check_availability',
    description: 'Проверить доступность яхты на конкретную дату и время.',
    input_schema: {
      type: 'object' as const,
      required: ['yacht_id', 'date'],
      properties: {
        yacht_id: { type: 'string', description: 'ID яхты' },
        date: { type: 'string', description: 'Дата в формате YYYY-MM-DD' },
        time_start: { type: 'string', description: 'Время начала HH:MM' },
        time_end: { type: 'string', description: 'Время окончания HH:MM' },
      },
    },
  },
  {
    name: 'create_booking',
    description: 'Создать бронирование стандартной прогулки (2-8 часов). Вызывать только когда клиент подтвердил все детали: яхту, дату, время, имя, телефон.',
    input_schema: {
      type: 'object' as const,
      required: ['yacht_id', 'yacht_name', 'date', 'time_start', 'time_end', 'client_name', 'client_phone'],
      properties: {
        yacht_id: { type: 'string' },
        yacht_name: { type: 'string' },
        date: { type: 'string', description: 'YYYY-MM-DD' },
        time_start: { type: 'string', description: 'HH:MM' },
        time_end: { type: 'string', description: 'HH:MM' },
        client_name: { type: 'string' },
        client_phone: { type: 'string' },
        notes: { type: 'string', description: 'Дополнительные пожелания' },
      },
    },
  },
  {
    name: 'create_inquiry',
    description: 'Создать заявку на индивидуальный запрос: корпоратив, многодневная аренда, особые маршруты, свадьба и т.д. Менеджер свяжется с клиентом.',
    input_schema: {
      type: 'object' as const,
      required: ['client_name', 'client_phone', 'description'],
      properties: {
        client_name: { type: 'string' },
        client_phone: { type: 'string' },
        description: { type: 'string', description: 'Описание запроса: тип мероприятия, даты, количество гостей, бюджет, пожелания' },
        preferred_date: { type: 'string', description: 'Предпочтительная дата YYYY-MM-DD' },
        guest_count: { type: 'number', description: 'Количество гостей' },
      },
    },
  },
];
