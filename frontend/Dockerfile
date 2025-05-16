# Используем Node.js 18
FROM node:20-alpine

WORKDIR /app


# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Копируем исходный код
COPY . .

# Собираем TypeScript в JavaScript
RUN npm run build

EXPOSE 3000

# Запускаем сервер
CMD ["npm", "run", "start"]
