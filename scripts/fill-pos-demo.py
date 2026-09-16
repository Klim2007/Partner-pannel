"""Overlay demo profile on the four-page supplied blank; never add signatures."""
from io import BytesIO
from pathlib import Path
from datetime import date
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

root = Path(__file__).resolve().parents[1]
source = root / '2 Заяв. о присоед. к тип. форме Дог. эквайринга Банк ВТБ (без откр банк счет).pdf'
output = root / 'public/documents/pos-application-demo.pdf'
output.parent.mkdir(parents=True, exist_ok=True)
pdfmetrics.registerFont(TTFont('DemoArial', 'C:/Windows/Fonts/arial.ttf'))
reader, writer = PdfReader(source), PdfWriter()
for index, page in enumerate(reader.pages):
    width, height = float(page.mediabox.width), float(page.mediabox.height)
    buf = BytesIO()
    c = canvas.Canvas(buf, pagesize=(width, height))
    def put(x, y, text, size=10):
        c.setFont('DemoArial', size * width / 708)
        c.setFillColorRGB(0, .2, .55)
        c.drawString(x * width / 708, height - y * height / 1000, text)
    put(85, 20, 'ДЕМО. Автозаполнение из тестового профиля. Не подписано ЭЦП.', 10)
    put(212, 935, 'ТОО «ДЕМО КОМПАНИЯ»', 8)
    if index == 0:
        put(88, 280, 'Астана (демо)', 12)
        put(82, 332, 'ТОО «ДЕМО КОМПАНИЯ»', 12)
        put(82, 380, 'Иванов Иван Иванович (демонстрационный профиль)', 11)
        put(82, 447, 'Устава (демо)', 11)
        for x in [337, 369, 408, 448, 478, 505, 532, 558, 581, 604, 624, 647]:
            if x < 633: put(x, 516, '0', 11)
        put(276, 571, '×', 12)
        put(280, 607, 'DEMO-001', 9)
        put(431, 607, '01.01.2026', 9)
        put(280, 624, 'Демонстрационный регистрирующий орган', 9)
        put(292, 640, 'DEMO-001', 9)
        put(441, 640, '01.01.2026', 9)
        put(280, 673, 'Демонстрационный регистрирующий орган', 9)
        put(280, 746, 'DEMO-ACCOUNT-0001', 11)
        put(280, 768, 'Демонстрационный банк; БИК: DEMO', 10)
    if index == 2:
        c.setFillColorRGB(1, 1, 1)
        c.rect(395*width/708, height-507*height/1000, 266*width/708, 15*height/1000, fill=1, stroke=0)
        for x, digit in zip([401,432,465,499,532,567,599,633],date.today().strftime('%d%m%Y')):
            put(x, 503, digit, 11)
        put(85, 537, 'Иванов И.И., директор (демо)', 9)
        put(85, 586, 'Не предусмотрено', 9)
    if index == 3:
        for y in [260, 650]:
            put(117, y, 'Иванов Иван Иванович', 10)
            put(293, y, 'DEMO-ID-001 (не документ)', 9)
            put(507, y, 'Директор (демо)', 10)
        for y in [302, 693]:
            put(117, y, 'Не предусмотрено', 9)
            put(293, y, '—', 10)
            put(507, y, '—', 10)
        for y in [334, 740]: put(88, y, 'Директор, Иванов И.И. (демо)', 9)
        for y in [431, 838]: put(88, y, 'Не предусмотрено', 9)
        for y in [164, 557]:
            put(489, y, date.today().strftime('%d'), 10)
            put(544, y, date.today().strftime('%m'), 10)
            put(633, y, date.today().strftime('%y'), 10)
    c.save()
    page.merge_page(PdfReader(BytesIO(buf.getvalue())).pages[0])
    writer.add_page(page)
with output.open('wb') as f: writer.write(f)
assert len(PdfReader(output).pages) == 4
print(output)
