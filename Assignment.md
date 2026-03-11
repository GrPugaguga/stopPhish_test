# StopPhish Notes

Мини-приложение для управления заметками с
backend-API, базой данных и простым frontend-интерфейсом.

## Стек

### Frontend

- **Vue 3**
- **TypeScript**
- **Tailwind** — стилизация
- **Pinia** — стейт-менеджмент
- **Vue Router** — маршрутизация с auth guard
- **Axios** — HTTP-клиент с interceptors (JWT, 401 redirect)
- **Vite** — сборка

### Backend

- **Moleculer** — микросервисный фреймворк
- **NATS** — транспорт сообщений между сервисами
- **TypeORM** — ORM для PostgreSQL
- **Zod** — валидация входных данных
- **bcryptjs** + **jsonwebtoken** — аутентификация

### Инфраструктура

- **Docker** + **Docker Compose** — контейнеризация
- **Kubernetes** — оркестрация
- **Nginx** — раздача статики фронтенда (SPA routing)
- **PostgreSQL 16** — две отдельные БД (users, notes)

## Дополнительные задачи

- **Аутентификация: JWT + учёт пользователей** - выполнены и осуществляются через users сервис
- **Категории заметок: Возможность группировать заметки по категориям** - выполнено, создана дополнительная сущность category и CRUD операции с ней
- **Полнотекстовый поиск: Поиск заметок по содержимому** - выполнено, осуществляется через ILIKE запросы к бд
- **Миграции: Использование миграций в ORM** - используются  миграции TypeORM
- **Обработка ошибок**: Все ошибки валидируются, для кастомных ошибок создан shared/errors
- **Валидация: Валидация всех данных и на фронте, и в API** - работает через использование общих zod схем и хелпер shared/schemas/validator.ts для actions внутри сервисов
- **Moleculer: Разделение бэкенда на сервисы** - Для бекенда используется Moleculer и Moleculer-web. Backend разделен на gateway, users, notes. Для транспорта выбрал NATS
- **Docker: Dockerfile для backend и frontend** - созданы (frontend/Dockerfile и backend/Dockerfile)
- **Тесты: Unit / Integration тесты API** - подключен vitest, созданы тесты для сервисов, middleware и gateway валидации ошибок в папках __tests__ внутри сервисов 
- **Kubernetes / k3s: Конфигурации для деплоя (Deployment, Service, ConfigMap, Secret)** - собрал конфиг внутри kubernetes папки
- **CI/CD: GitHub Actions / GitLab CI** - внутри .github/workflows добавил ci с проверками линтера, формата и прогоном тестов. Также добавил простой .husky/pre-push


### Микросервисы

| Сервис      | Назначение                                     | База данных |
| ----------- | ---------------------------------------------- | ----------- |
| **gateway** | API Gateway, HTTP-роуты, auth middleware, CORS | —           |
| **users**   | Регистрация, логин, валидация JWT-токенов      | users_db    |
| **notes**   | CRUD заметок и категорий                       | notes_db    |

### Shared-модуль

Общий код между frontend и backend (path alias `@shared`):

- `shared/schemas/` — Zod-схемы валидации + TypeScript-типы (единый источник правды)
- `shared/errors/` — типизированные ошибки (BadRequest 400, Unauthorized 401, NotFound 404, ValidationError 422, Conflict 409)
- `shared/config/` — env-переменные с Zod-валидацией


## API-эндпоинты

### Аутентификация (публичные)

| Метод | URL              | Описание                                               |
| ----- | ---------------- | ------------------------------------------------------ |
| POST  | `/auth/register` | Регистрация. Body: `{ email, password }` → `{ token }` |
| POST  | `/auth/login`    | Вход. Body: `{ email, password }` → `{ token }`        |

### Заметки (требуют `Authorization: Bearer <token>`)

| Метод  | URL              | Описание                                            |
| ------ | ---------------- | --------------------------------------------------- |
| GET    | `/api/notes`     | Список заметок. Query: `?search=...&categoryId=N`   |
| GET    | `/api/notes/:id` | Одна заметка по ID                                  |
| POST   | `/api/notes`     | Создать. Body: `{ title, content, categoryId? }`    |
| PUT    | `/api/notes/:id` | Обновить. Body: `{ title?, content?, categoryId? }` |
| DELETE | `/api/notes/:id` | Удалить заметку                                     |

### Категории (требуют `Authorization: Bearer <token>`)

| Метод  | URL                   | Описание                                            |
| ------ | --------------------- | --------------------------------------------------- |
| GET    | `/api/categories`     | Список категорий пользователя                       |
| POST   | `/api/categories`     | Создать. Body: `{ name }`                           |
| PUT    | `/api/categories/:id` | Переименовать. Body: `{ name }`                     |
| DELETE | `/api/categories/:id` | Удалить категорию (каскадно удаляет заметки внутри) |

## Запуск

.env был оставлен чтобы ничего не копировать

## Запуск через Docker Compose

```bash

# Сборка
docker compose up --build -d

# Миграции запускаются автоматически при старте сервисов

# Сиды (после запуска)
docker compose exec users npx tsx backend/users/src/seeds/seed.ts
docker compose exec notes npx tsx backend/notes/src/seeds/seed.ts
```

Приложение доступно:

- **Frontend**: http://localhost:8080
- **API**: http://localhost:3000


## Запуск в Kubernetes

### Предварительные условия

- Docker Desktop с включённым Kubernetes (Settings → Kubernetes → Enable)
- `kubectl` CLI

### 1. Сборка образов

```bash
docker build -t stopphish-backend -f backend/Dockerfile .
docker build -t stopphish-frontend -f frontend/Dockerfile --build-arg VITE_API_URL=http://localhost:30000 .
```

### 2. Деплой

```bash
# Сначала namespace
kubectl apply -f kubernetes/namespace.yaml

# Затем конфиги и секреты
kubectl apply -f kubernetes/secrets.yaml -f kubernetes/configmap.yaml

# Инфраструктура (БД, NATS)
kubectl apply -f kubernetes/users-db.yaml -f kubernetes/notes-db.yaml -f kubernetes/nats.yaml

# Сервисы приложения
kubectl apply -f kubernetes/gateway.yaml -f kubernetes/users.yaml -f kubernetes/notes.yaml -f kubernetes/frontend.yaml

# Ingress (опционально)
kubectl apply -f kubernetes/ingress.yaml
```

### 3. Проверка статуса

```bash
kubectl get pods -n stopphish
# Все поды должны быть в статусе Running
```

### 4. Сиды в Kubernetes

```bash
kubectl exec -it deployment/users -n stopphish -- npx tsx backend/users/src/seeds/seed.ts
kubectl exec -it deployment/notes -n stopphish -- npx tsx backend/notes/src/seeds/seed.ts
```

### 5. Доступ к приложению

- **Frontend**: http://localhost:30080
- **API**: http://localhost:30000

### Полезные команды

```bash
# Логи сервиса
kubectl logs -f deployment/gateway -n stopphish

# Зайти в под
kubectl exec -it deployment/notes -n stopphish -- sh

# Рестарт после пересборки образа
kubectl rollout restart deployment gateway -n stopphish

# Удалить всё
kubectl delete namespace stopphish
```

### K8s-ресурсы

| Файл             | Ресурсы                                               |
| ---------------- | ----------------------------------------------------- |
| `namespace.yaml` | Namespace `stopphish`                                 |
| `secrets.yaml`   | Secret — пароли БД, JWT, NATS                         |
| `configmap.yaml` | ConfigMap — хосты, порты                              |
| `users-db.yaml`  | StatefulSet + PVC + headless Service                  |
| `notes-db.yaml`  | StatefulSet + PVC + headless Service                  |
| `nats.yaml`      | Deployment + Service                                  |
| `gateway.yaml`   | Deployment + NodePort Service (:30000)                |
| `users.yaml`     | Deployment (внутренний, через NATS)                   |
| `notes.yaml`     | Deployment (внутренний, через NATS)                   |
| `frontend.yaml`  | Deployment + NodePort Service (:30080)                |
| `ingress.yaml`   | Ingress — роутинг /auth, /api → gateway, / → frontend |

## Тесты

```bash
# Запуск всех тестов
npm run test
```

### Покрытие (48 тестов)

| Файл                                                    | Тестов | Что покрывает                                                                |
| ------------------------------------------------------- | ------ | ---------------------------------------------------------------------------- |
| `shared/schemas/__tests__/schemas.test.ts`              | 17     | Zod-схемы: валидация note, category, user (включая categoryId: null)         |
| `shared/schemas/__tests__/validator.test.ts`            | 3      | createAction: парсинг params, coercion, ValidationError 422                  |
| `backend/notes/src/__tests__/notes.service.test.ts`     | 14     | CRUD notes + categories, update с categoryId: null, дубликат → ConflictError |
| `backend/users/src/__tests__/users.service.test.ts`     | 6      | register, login, validateToken + ошибки                                      |
| `backend/gateway/src/__tests__/auth.middleware.test.ts` | 4      | Bearer token, 401, MoleculerClientError                                      |
| `backend/gateway/src/__tests__/gateway.onError.test.ts` | 4      | Маппинг error codes (404, 409, 500), защита от строковых кодов               |


### Миграции

| Команда                            | Описание                             |
| ---------------------------------- | ------------------------------------ |
| `npm run migration:run:users`      | Применить миграции users_db          |
| `npm run migration:run:notes`      | Применить миграции notes_db          |
| `npm run migration:revert:users`   | Откатить последнюю миграцию users_db |
| `npm run migration:revert:notes`   | Откатить последнюю миграцию notes_db |
| `npm run migration:generate:users` | Сгенерировать миграцию users_db      |
| `npm run migration:generate:notes` | Сгенерировать миграцию notes_db      |

## Тестовые пользователи

| Email             | Пароль      |
| ----------------- | ----------- |
| test@example.com  | password123 |
| admin@example.com | admin123    |
