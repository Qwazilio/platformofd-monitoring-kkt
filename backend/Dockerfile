# Используем Node.js 18
FROM node:20-alpine

WORKDIR /app

# Создаем пользователя с ID 1000 (обычный пользователь)
RUN adduser -D -u 1000 appuser

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем исходный код
COPY . .

# Собираем TypeScript в JavaScript
RUN npm run build

# Открываем порт (например, 3001)
EXPOSE 3001

# Запускаем сервер
CMD ["npm", "run", "start"]
