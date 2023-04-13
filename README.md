# Randomuser.me API Integration with PostgreSQL

Приложение получает данные c API https://randomuser.me/api/, 
записывает их в таблицу Users базы данных users_db.

Необходимые переменные окружения:
`USER=postgres
HOST=localhost
PASSWORD=yourpassword
PORT=5432`

## Установка и запуск

* Клонируйте репозиторий проекта с GitHub: `https://github.com/AniaSelezneva/randomuser-to-pg.git`
* Установите зависимости: `npm i`
* Запустите сервер: `npm start`
