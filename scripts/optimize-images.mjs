// Пережимает мастера из assets/images-src/*.png в облегчённые WebP + PNG-фолбэк
// в public/images/. Запуск: npm run images:optimize (VISUAL-01).
import { readdir, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SRC = 'assets/images-src', OUT = 'public/images';
// Значок карточки рисуется в боксе ~389×295 CSS-пикселей, маскот — до 65.
// WebP берём в двойном размере под ретину; PNG-фолбэк почти никто не грузит
// (WebP поддерживают все актуальные браузеры), поэтому он меньше и без ретины.
const webpSize = { mascot: 200, _default: 760 };
const pngSize = { mascot: 160, _default: 560 };
const kb = n => (n / 1024).toFixed(0) + ' КБ';

await mkdir(OUT, { recursive: true });
const files = (await readdir(SRC)).filter(f => f.endsWith('.png'));
for (const file of files) {
 const name = path.basename(file, '.png');
 const src = sharp(path.join(SRC, file));
 await src.clone().resize(webpSize[name] ?? webpSize._default, null, { fit: 'cover' })
  .webp({ quality: 74, effort: 6 }).toFile(path.join(OUT, `${name}.webp`));
 await src.clone().resize(pngSize[name] ?? pngSize._default, null, { fit: 'cover' })
  .png({ compressionLevel: 9, palette: true, quality: 78, dither: 1 }).toFile(path.join(OUT, `${name}.png`));
 const [w, p] = await Promise.all([stat(path.join(OUT, `${name}.webp`)), stat(path.join(OUT, `${name}.png`))]);
 console.log(`${name.padEnd(12)} webp ${kb(w.size).padStart(7)}   png ${kb(p.size).padStart(7)}`);
}
