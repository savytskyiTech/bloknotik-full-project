# Bloknotik Mistera Mariana — Frontend Monorepo

> Monorepo фронтенд-платформа для системи управління автошколою, що об'єднує три окремих застосунки під єдиним управлінням pnpm workspaces.

---

## 📦 Структура проєкту

```
bloknotik-mistera-mariana-frontend/
├── apps/
│   ├── instructor/                    # Застосунок інструктора
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── App.tsx            # Корінь (login gate → InstructorApp)
│   │   │   │   └── components/
│   │   │   │       ├── LoginPage.tsx  # Сторінка входу (мінімалістична)
│   │   │   │       └── InstructorApp.tsx
│   │   │   ├── styles/               # Теми, шрифти, Tailwind
│   │   │   └── main.tsx              # Точка входу React
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   └── package.json              # @bloknotik/instructor
│   │
│   ├── manager/                       # Застосунок менеджера
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── App.tsx            # Корінь (login gate → RouterProvider)
│   │   │   │   ├── routes.tsx         # React Router config
│   │   │   │   └── components/
│   │   │   │       ├── LoginPage.tsx  # Сторінка входу (split-screen)
│   │   │   │       ├── Layout.tsx
│   │   │   │       ├── dashboard/
│   │   │   │       ├── schedule/
│   │   │   │       ├── users/
│   │   │   │       └── settings/
│   │   │   ├── styles/
│   │   │   └── main.tsx
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   └── package.json              # @bloknotik/manager
│   │
│   └── student/                       # Застосунок студента
│       ├── src/
│       │   ├── app/
│       │   │   ├── App.tsx            # Корінь (login gate → головний SPA)
│       │   │   └── components/
│       │   │       ├── LoginPage.tsx  # Сторінка входу (glassmorphism)
│       │   │       └── ...
│       │   ├── styles/
│       │   └── main.tsx
│       ├── index.html
│       ├── vite.config.ts
│       └── package.json              # @bloknotik/student
│
├── packages/
│   └── ui/                            # Спільні компоненти (заглушка)
│       └── package.json              # @bloknotik/ui
│
├── package.json                       # Кореневий — скрипти оркестрації
├── pnpm-workspace.yaml                # Реєстрація apps/* та packages/*
├── .npmrc                             # pnpm hoisting конфіг
└── README.md
```

---

## 🛠 Технологічний стек

| Технологія | Версія | Призначення |
|---|---|---|
| [React](https://react.dev) | 18.3.1 | UI фреймворк |
| [Vite](https://vitejs.dev) | 6.3.5 | Bundler / Dev-сервер |
| [Tailwind CSS](https://tailwindcss.com) | 4.1.12 | Стилізація |
| [Radix UI](https://www.radix-ui.com) | — | Headless UI-компоненти |
| [MUI](https://mui.com) | 7.3.5 | Material UI-компоненти |
| [React Router](https://reactrouter.com) | 7.13.0 | Клієнтський роутинг (manager) |
| [React Hook Form](https://react-hook-form.com) | 7.55.0 | Управління формами |
| [Recharts](https://recharts.org) | 2.15.2 | Графіки та діаграми |
| [Motion](https://motion.dev) | 12.23.24 | Анімації |
| [Lucide React](https://lucide.dev) | 0.487.0 | Іконки |
| [pnpm](https://pnpm.io) | ≥9.0 | Пакетний менеджер + workspaces |

---

## 🚀 Початок роботи

### Передумови

- **Node.js** ≥ 18
- **pnpm** ≥ 9 — встановити глобально:
  ```bash
  npm install -g pnpm
  ```

### Встановлення залежностей

З кореня репозиторію одна команда встановлює залежності для **всіх** застосунків:

```bash
pnpm install
```

---

## 💻 Команди розробки

### Запуск окремого застосунку

```bash
pnpm dev:instructor   # → http://localhost:5173
pnpm dev:manager      # → http://localhost:5174
pnpm dev:student      # → http://localhost:5175
```

### Запуск всіх застосунків одночасно

```bash
pnpm dev:all
```

> [!NOTE]
> При паралельному запуску кожен застосунок займає свій порт. Порти можна налаштувати у `vite.config.ts` кожного app.

### Build

```bash
# Зібрати конкретний застосунок
pnpm build:instructor
pnpm build:manager
pnpm build:student

# Зібрати всі застосунки
pnpm build:all
```

### Preview продакшн-збірки

```bash
pnpm preview:instructor
pnpm preview:manager
pnpm preview:student
```

### Робота напряму в директорії app

```bash
cd apps/instructor
pnpm dev      # dev-сервер
pnpm build    # production build
```

---

## 📁 Apps

### `apps/instructor` — Застосунок інструктора
**Package:** `@bloknotik/instructor`

Мобільний інтерфейс для інструкторів автошколи. Відображає розклад на день, активні заняття, список учнів з прогресом та профіль.

**Ключові екрани:**
- 🔐 Сторінка входу (мінімалістичний стиль, чорно-білий)
- 🏠 Головна — статистика дня, активне заняття, таймлайн
- 📅 Календар — управління слотами, блокування днів
- 👥 Учні — список з прогресом, деталі по кожному
- 👤 Профіль — рейтинг, статистика, налаштування

**Тема:** монохромна (`#030213`), радіус `0.625rem`, ShadCN-стиль

---

### `apps/manager` — Застосунок менеджера
**Package:** `@bloknotik/manager`

Адміністративна панель для менеджерів автошколи з повноцінним роутингом через React Router.

**Ключові екрани:**
- 🔐 Сторінка входу (split-screen: брендова ліва панель + форма праворуч)
- 📊 Dashboard — ключові метрики, графіки
- 📅 Розклад — планування занять
- 👥 Користувачі — управління студентами та інструкторами
- ⚙️ Налаштування

**Тема:** deep violet (`#7C3AED`), `Inter` font

---

### `apps/student` — Застосунок студента
**Package:** `@bloknotik/student`

Студентський портал для бронювання занять, перегляду прогресу та взаємодії з інструктором.

**Ключові екрани:**
- 🔐 Сторінка входу (glassmorphism, violet gradient blobs)
- 🏠 Головна — наступне заняття, прогрес тижня, швидкі дії
- 📅 Мої заняття — список запланованих занять
- 👤 Профіль — налаштування, Telegram-бот, нотатки інструктора

**Тема:** фіолетова (`#8b5cf6`), радіус `1.5rem`, glassmorphism

---

## 🔐 Сторінки входу

Кожен застосунок має власну `LoginPage.tsx` з унікальним дизайном у стилі свого app:

| App | Стиль | Особливості |
|---|---|---|
| **instructor** | Мінімалістичний, ч/б | Shield-badge, строга типографіка |
| **manager** | Split-screen layout | Брендова панель з описом фіч, пульсуючий статус |
| **student** | Glassmorphism | Gradient blobs, frosted-glass картка |

**Логіка:** `LoginPage` приймає `onLogin?: () => void` — після заповнення форми (будь-які непорожні значення) викликається колбек і відкривається основний застосунок. Готово до підключення реального auth.

---

## 📦 Packages

### `packages/ui` — Спільний UI-пакет
**Package:** `@bloknotik/ui`

Заглушка для майбутніх спільних React-компонентів та утиліт. Підключити до app:

```json
// apps/instructor/package.json
{
  "dependencies": {
    "@bloknotik/ui": "workspace:*"
  }
}
```

---

## 🏗 Додавання нового застосунку

1. Створити `apps/my-new-app/` з `index.html`, `src/main.tsx`, `vite.config.ts`
2. Додати `package.json` з `"name": "@bloknotik/my-new-app"`
3. Додати скрипти до кореневого `package.json`:
   ```json
   "dev:my-new-app": "pnpm --filter @bloknotik/my-new-app dev",
   "build:my-new-app": "pnpm --filter @bloknotik/my-new-app build"
   ```
4. Запустити `pnpm install` — новий пакет підхопиться автоматично

---

## 🏗 Додавання нового спільного пакету

1. Створити `packages/my-package/` з `package.json` (`"name": "@bloknotik/my-package"`)
2. `pnpm install` з кореня — пакет стає частиною workspace

---

## 🔍 Корисні pnpm команди

```bash
# Запустити команду в конкретному пакеті
pnpm --filter @bloknotik/instructor <команда>

# Запустити у всіх apps паралельно
pnpm --parallel --filter './apps/*' <команда>

# Переглянути залежності workspace
pnpm ls --depth=1

# Додати залежність до конкретного app
pnpm --filter @bloknotik/student add some-package

# Додати dev-залежність до кореня
pnpm add -D -w some-dev-tool
```

---

## 📝 Конфігурація

### `pnpm-workspace.yaml`
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### `.npmrc`
```
shamefully-hoist=true        # Дозволяє Vite знаходити залежності
strict-peer-dependencies=false
auto-install-peers=true
```

### `vite.config.ts` (в кожному app)
- Плагіни: `@vitejs/plugin-react` + `@tailwindcss/vite`
- Аліас `@` → `./src`
- Raw imports: `*.svg`, `*.csv`

---

## 🤝 Внесок у проєкт

1. Форкнути репозиторій
2. Створити feature branch: `git checkout -b feature/my-feature`
3. Зафіксувати зміни: `git commit -m 'feat: add my feature'`
4. Відправити: `git push origin feature/my-feature`
5. Відкрити Pull Request
