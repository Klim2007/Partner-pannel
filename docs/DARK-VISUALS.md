# Тёмные иллюстрации сервисов · 10.09.2026

Созданы встроенным ImageGen, по отдельному запросу для каждого сервиса.
Мастера: `assets/images-src/{documents,legal,suppliers,crm,insurance,accounting}-dark.png`.
Браузерные версии: `public/images/*-dark.webp` и `public/images/*-dark.png`.
Предыдущие светлые иллюстрации сохранены. Маскот не изменён.

## Промпт

Use case: stylized-concept. Single standalone 3D icon for a business service catalog: SUBJECT. Premium dark smoked glass and polished titanium with electric cyan and cobalt edge lighting. Pure BLACK #000000 background, no horizon, no floor, no glow at the outer frame. Square image, entire object centered occupying central 65%, ample pure black margins. Isometric three-quarter view, refined crisp silhouette, sophisticated not toy-like. No text, no lettering, no logos, no watermark.

SUBJECT для каждого файла:

- documents: Two floating document sheets with a curved exchange arrow
- legal: Elegant legal balance scales
- suppliers: Three shipping boxes and a magnifying glass
- crm: Three connected customer profile tiles
- insurance: A protective shield in front of a small office building
- accounting: A calculator with a receipt

## Анимация

CSS в `src/styles.css`: `.dark-visual`, `.icon-stage`, `@keyframes icon-float`.
При раскрытии иллюстрация уменьшается и перемещается вверх, затем покачивается;
текстовая панель выезжает снизу. Высота карточки при раскрытии не меняется.
Сенсорный ввод и клавиатура используют то же состояние раскрытия.
`prefers-reduced-motion` отключает движение, сохраняя доступность информации.
