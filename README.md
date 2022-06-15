# businessSector
PostgreSQL задеплоен на https://console.scalegrid.io/, для настройки ничего не требуется, все прописано в конфиге.
DONE Регистрация пользователя (POST /user/register) 
DONE Авторизация пользователя (POST /user/login)
DONE Редактирование пользователя (PUT /profile/[id])
DONE Получение пользователя (GET /profile/[id])
DONE Получение всех пользователей с пагинацией (GET /profiles?page=1, 10 на страницу)
DONE У каждого пользователя должно быть ID, Имя, Фамилия, Email, Пароль, Пол (Мужской, Женский), Фото, Дата регистрации.
DONE При регистрации указывает только Имя, Email, Пароль.
DONE При редактировании можно менять всю информацию кроме ID, Пароля, Дата регистрации.
DONE При получение всех пользователей с пагинацией сортировать по дате регистрации.
DONE В базе данных хранить только название файла, все фото должны лежать в папке и раздаваться статически.
DONE Валидация входных параметров
не совсем понял что подразумевается Используется ORM (Любая)
DONE Используется JWT
DONE Пароль будет хранится как хеш
частично! Проверка фото по размеру, и формату (до 10 мб, .jpg, .png)
DONE Весь код не будет в контроллерах
