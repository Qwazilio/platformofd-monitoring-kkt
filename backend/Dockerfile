# Используем Node.js 18
FROM node:18-alpine 

WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем исходный код
COPY . .

# Собираем TypeScript в JavaScript
RUN npm run build

# Открываем порт (например, 3001)
EXPOSE 61708

# Запускаем сервер
CMD ["npm", "run", "start"]
