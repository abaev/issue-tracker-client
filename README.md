# Mini Issue Tracker — клиент

Небольшой учебный frontend-проект на Vue 3 и TypeScript. Предоставляет интерфейс для работы с задачами через отдельный REST API.

## Возможности

- Просмотр списка задач, поиск по названию и фильтрация по статусу.
- Создание, редактирование и удаление задач.
- Проверка ответов API во время выполнения с помощью Zod.
- Отображение ошибок операций через toast-уведомления.

## Технологии

Vue 3 · TypeScript · Vue Router · Axios · Zod · Tailwind CSS 4 · daisyUI

## Запуск проекта

**Требования:** Node.js 22.18+ или 24.12+, npm.

1. Установить зависимости:

   ```bash
   npm install
   ```

2. Указать адрес API в файле `.env.development`:

   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

   Перед запуском клиента необходимо отдельно запустить [Mini Issue Tracker API](https://github.com/abaev/issue-tracker-api).

3. Запустить сервер разработки:

   ```bash
   npm run dev
   ```

4. Проверить типы и выполнить production-сборку:

   ```bash
   npm run build
   ```
