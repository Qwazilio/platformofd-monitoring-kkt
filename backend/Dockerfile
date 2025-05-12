# Используем Node.js 18
FROM node:20-alpine

WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install
# Установка необходимых пакетов для SQLite
RUN apk add --no-cache sqlite-libs

# Копируем исходный код
COPY . .

# Собираем TypeScript в JavaScript
RUN npm run build

# Открываем порт (например, 3001)
EXPOSE 3001

# Запускаем сервер
CMD ["npm", "run", "start"]
