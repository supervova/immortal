# Веб-сайт конструктора цифровых личностей и социальной сети Echo Immortal

## Рабочие команды

Установка зависимостей:

```sh
npm install
# или
yarn install
```

Запуск локального сервера:

```sh
gulp dev
```

Сборка проекта:

```sh
gulp --p
```

Сборка и оптимизация стилей, скриптов и изображений:

```sh
# Для production следует добавлять флаг `--p`
gulp img
gulp css
gulp js
gulp sprite
gulp pages
```

## Структура папок

```text
immortal/
├── dist/                       # Папка локального сервера
├── docs/                       # Документация
├── config/                     # Глобальные переменные: для мета-тегов по умолчанию и т.п.
├── public/                     # Папка для production
│   ├── assets/                 # Подключаемые ресурсы
│   |   ├── css/
│   |   ├── fonts/
│   |   ├── js/
│   |   ├── img/
│   |   └── videos/
│   ├── index.php               # Главная точка входа для PHP
│   ├── manifest.json           # Файл манифеста для PWA
│   └── *.php                   # Другие страницы
├── src/
│   ├── assets/                 # Исходные файлы интерфейсов
│   │   ├── css                 # Собранные CSS-файлы до пост-процессинга и оптимизации
│   │   ├── fonts/
│   │   ├── js/
│   │   │   ├── *.js            # Исходные скрипты, ESM
│   │   │   └── main.js
│   │   ├── img/                # Исходные изображения
│   │   │   ├── components/
│   │   │   ├── icons/
│   │   │   └── pages/
│   │   ├── scss/               # Исходные стили
│   │   │   ├── abstracts/      # Примеси, функции, пользовательские селекторы и медиазапросы
│   │   │   ├── content/        # Типографика
│   │   │   ├── form/           # Стили компонентов формы
│   │   │   ├── pages/          # Стили страниц
│   │   │   ├── _*.scss         # Стили компонентов и переменные
│   │   │   └── main.scss
│   │   └── videos/
│   ├── Controllers/            # Контроллеры для обработки различных маршрутов
│   ├── Helpers/                # Вспомогательные функции
│   ├── Models/                 # Модели для взаимодействия с данными
│   ├── Services/               # Логика, которая не относится напрямую к контроллерам, но может быть общей для нескольких частей приложения.
│   └── templates/              # Twig-шаблоны страниц и служебные HTML-файлы
│       ├── base/
│       ├── components/
│       └── *.twig              # Шаблоны страниц
├── .cursorrules                # Настройки Cursor, ИИ-редактора кода
├── .editorconfig               # Настройки форматирования кода — помогают поддерживать единый стиль в разных редакторах и IDE.
├── .env                        # Переменные окружения
├── composer.json               # Зависимости PHP
├── gulpfile.js                 # Конфигурация Gulp для сборки проекта
├── package.json                # Зависимости Node.js и настройки линтеров
├── phpcs.xml.dist              # Конфигурация для PHP CodeSniffer — стандарты кодирования PHP
└── readme.md                   # Этот файл
```

Другие возможные папки:

- `fixtures/` — тестовые данные
- `tests/` — тесты
- `vendor/` — зависимости

## Правила именования папок и файлов

Соответствуют стандарту PSR-4 для автозагрузки классов в PHP, который является частью рекомендаций PHP-FIG (PHP Framework Interop Group).

- Папки с пространствами имён и классами пишутся в PascalCase (с большой буквы, без дефисов и подчеркиваний): Controllers/, Models/
- Имена файлов классов тоже должны быть в PascalCase: UserController.php, BaseModel.php
- Название файла должно точно соответствовать имени класса.

Для папок, которые не содержат классы (например, конфиги, шаблоны, «статика»), используются «шашлычный» регистр — строчные буквы, через дефисы: config/, templates/, assets/.
