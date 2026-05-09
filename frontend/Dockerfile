# Stage 1: Build
FROM node:20-slim AS builder

WORKDIR /app

# Встановлюємо pnpm
RUN npm install -g pnpm

# Копіюємо файли конфігурацій
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Копіюємо весь вихідний код
COPY . .

# Встановлюємо залежності та збираємо всі три додатки
RUN pnpm install
RUN pnpm run build:all

# Stage 2: Serve
FROM nginx:alpine

# Видаляємо стандартний конфіг nginx
RUN rm /etc/nginx/conf.d/default.conf

# Копіюємо наш конфіг (Student: 80, Instructor: 81, Manager: 82)
COPY nginx.conf /etc/nginx/conf.d/

# Копіюємо зібрані бандли
COPY --from=builder /app/apps/student/dist /usr/share/nginx/html/student
COPY --from=builder /app/apps/instructor/dist /usr/share/nginx/html/instructor
COPY --from=builder /app/apps/manager/dist /usr/share/nginx/html/manager

EXPOSE 80 81 82

CMD ["nginx", "-g", "daemon off;"]
