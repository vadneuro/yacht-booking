// Определения инструментов для Claude API (tool use)

export const TOOL_DEFINITIONS = [
  {
    name: 'get_yachts',
    description: 'Получить список доступных яхт. Можно фильтровать по вместимости, типу и цене.',
    input_schema: {
      type: 'object',
      properties: {
        min_capacity: {
          type: 'number',
          description: 'Минимальное количество человек',
        },
        yacht_type: {
          type: 'string',
          enum: ['sailing', 'motor', 'catamaran', 'premium'],
          description: 'Тип яхты: sailing=парусная, motor=моторная, catamaran=катамаран, premium=премиум',
        },
        max_price_per_hour: {
          type: 'number',
          description: 'Максимальная цена за час в рублях',
        },
      },
    },
  },
  {
    name: 'check_availability',
    description: 'Проверить доступность яхты на конкретную дату и время.',
    input_schema: {
      type: 'object',
      required: ['yacht_id', 'date'],
      properties: {
        yacht_id: {
          type: 'string',
          description: 'ID яхты',
        },
        date: {
          type: 'string',
          description: 'Дата в формате YYYY-MM-DD',
        },
        time_start: {
          type: 'string',
          description: 'Время начала в формате HH:MM',
        },
        time_end: {
          type: 'string',
          description: 'Время окончания в формате HH:MM',
        },
      },
    },
  },
  {
    name: 'create_booking_request',
    description: 'Создать заявку на бронирование яхты. Вызывать только когда клиент явно подтвердил детали.',
    input_schema: {
      type: 'object',
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
];
