# POS терминал · 16.09.2026

Страница `/pos-terminal` в существующем локальном проекте. Переход:
«Продукты и услуги» → «Эквайринг» → «POS терминал».
Использует существующую авторизацию и общее меню.

## Требования пользователя

- Текст перенесён с предоставленных скриншотов: заголовок и описание эквайринга,
  «Возможности:», «Как подключить», «Пакет документов», четыре типовые формы.
- Кнопка: «Подключить POS Терминал».
- Нажатие открывает модальное окно с четырьмя страницами заполненного исходного PDF.
  Тестовый профиль: ТОО «ДЕМО КОМПАНИЯ», демонстрационный представитель,
  регистрационные данные и расчётный счёт. Заполнение: `scripts/fill-pos-demo.py`.
- Под документом кнопки «подписать ЭЦП» и «отправить». Первая выполняет только
  явно обозначенный демонстрационный шаг; сертификат и юридическая подпись не создаются.
  До этого шага отправка недоступна. После отправки появляется уведомление
  «Ваша заявка принята в работу» с уточнением демонстрационного режима.
  Закрытие или Escape отменяет просмотр; повторное открытие сбрасывает шаг подписи.
- Это демонстрационное уведомление, а не реальная банковская заявка:
  данные не отправляются в банк, не сохраняются как заявка и не запускают оплату.
- Изображение: современный сенсорный терминал, синий корпус,
  приглушённый тёмно-голубой студийный фон без магазина,
  демонстрационный QR с надписью «СБП» на экране.
- QR — иллюстрация, не платёжная интеграция и не подтверждение поддержки СБП.
- Файлы именно этих типовых договоров и пакет документов пока не привязаны.
  Названия отображаются без изменений; кнопка пакета сообщает об отсутствии файла.
- Главная, партнёрская витрина и AI не изменялись; в общем меню добавлена ссылка.

## Изображение

Создано и отредактировано встроенным ImageGen. Мастер:
`assets/images-src/pos-touchscreen.png`. Версии для страницы:
`public/images/pos-touchscreen.webp`, `public/images/pos-touchscreen.png`.

Финальный промпт редактирования:

Edit the supplied POS terminal product image. Keep the modern large touchscreen terminal shape, built-in printer and paper, no physical keypad, three-quarter camera view, realistic premium product-photography quality and landscape 3:2 composition. Change the terminal casing from black to rich cobalt BLUE. Completely REMOVE the shop interior and wood counter; replace with a seamless slightly dark muted blue studio background and matching blue surface, gentle gradient, soft realistic contact shadow, no other objects. Replace the contactless symbol on the screen with a clean white payment panel showing the exact Cyrillic heading 'СБП' above a large illustrative black-and-white QR-style square code. Put small visible Cyrillic label 'ДЕМО' below the illustrative code. This is a nonfunctional demo QR illustration, no actual payment destination, account, URL or financial details. Preserve generous margins around entire device. No extra text or watermark.

## Проверка

Проверять вход перед открытием страницы, переход из меню на `/pos-terminal`,
отображение всех разделов, открытие уведомления кнопкой подключения,
закрытие кнопкой «Понятно» и клавишей Escape, возврат фокуса на кнопку.
На узких экранах изображение располагается под описанием, текст не обрезается.
