export const getDefaultTemplate = (project) => [
  {
    id: "cover",
    type: "cover",
    level: 0,
    content: {
      title: project.name,
      subtitle: "Base info of product",
      version: "1.0.0",
      logo: null,
    },
  },
  {
    id: "changelog",
    type: "changelog",
    level: 0,
    content: {
      title: "Change log",
      entries: [
        {
          date: new Date().toLocaleDateString("en-GB"),
          version: "1.0.0",
          type: "added",
          description: "Initial documentation created",
        },
      ],
    },
  },
  {
    id: 1,
    type: "section",
    level: 1,
    content: { title: "Информация о продукте" },
  },
  {
    id: 2,
    type: "paragraph",
    level: 2,
    content: { text: "Добавьте описание вашего продукта здесь..." },
  },
  { id: 3, type: "section", level: 1, content: { title: "Введение" } },
  { id: 4, type: "heading", level: 2, content: { text: "Начало работы" } },
  {
    id: 5,
    type: "paragraph",
    level: 2,
    content: {
      text: "Добро пожаловать в документацию. Этот документ содержит всю необходимую информацию для работы с API.",
    },
  },
  {
    id: 6,
    type: "section",
    level: 1,
    content: { title: "Термины и сокращения" },
  },
  {
    id: 7,
    type: "list",
    level: 2,
    content: {
      items: [
        { term: "API", definition: "Application Programming Interface" },
        { term: "REST", definition: "Representational State Transfer" },
        { term: "JSON", definition: "JavaScript Object Notation" },
      ],
    },
  },
  {
    id: 8,
    type: "section",
    level: 1,
    content: { title: "Адрес веб-сервиса" },
  },
  {
    id: 9,
    type: "heading",
    level: 2,
    content: { text: "Production Environment" },
  },
  {
    id: 10,
    type: "code",
    level: 2,
    content: { language: "text", code: "https://api.example.com" },
  },
  {
    id: 11,
    type: "heading",
    level: 2,
    content: { text: "Test Environment" },
  },
  {
    id: 12,
    type: "code",
    level: 2,
    content: { language: "text", code: "https://test-api.example.com" },
  },
  {
    id: 13,
    type: "section",
    level: 1,
    content: { title: "Формат сообщений веб-сервиса" },
  },
  {
    id: 14,
    type: "paragraph",
    level: 2,
    content: {
      text: "Все запросы и ответы используют формат JSON. Кодировка: UTF-8.",
    },
  },
  {
    id: 15,
    type: "section",
    level: 1,
    content: { title: "Модули и методы" },
  },
  {
    id: 16,
    type: "paragraph",
    level: 2,
    content: { text: "Добавьте описание ваших API методов здесь..." },
  },
];