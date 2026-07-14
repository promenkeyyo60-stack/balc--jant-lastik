# Balcı Jant & Lastik

Premium jant ve lastik ürün kataloğu web uygulaması.

## Özellikler

- 🔍 **Ürün Arama & Filtreleme** - Marka, kategori ve metin bazlı arama
- 📊 **Canlı Stok Takibi** - Excel dosyasından otomatik güncelleme (30sn aralıkla)
- 🎨 **Modern Tasarım** - Koyu tema, animasyonlar, mobil uyumlu arayüz
- 📱 **Mobil Öncelikli** - Tam responsive, dokunmatik optimize
- ❄️☀️ **Mevsim Göstergesi** - Kış/Yaz/4 Mevsim lastik sınıflandırması

## Teknoloji

- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Veri**: Excel (veri.xlsx) → SheetJS ile tarayıcıda okuma
- **Hosting**: Vercel (statik site)
- **Font**: Inter (Google Fonts)

## Kurulum

### Vercel'e Deploy
1. GitHub repo'sunu Vercel'e import edin
2. Framework: "Other" seçin
3. Build komutu boş bırakın
4. Output dizini: `.` (root)

### Yerel Geliştirme
```bash
# Herhangi bir statik sunucu ile çalıştırabilirsiniz
npx serve .
# veya
python -m http.server 8080
```

## Veri Yapısı (veri.xlsx)

Excel dosyanızda aşağıdaki sütunlar desteklenir:

| Sütun | Açıklama |
|-------|----------|
| Tip | `LASTİK` veya `JANT` |
| Kategori | BİNEK, UHP, KAMYON vb. |
| Marka | Ürün markası |
| Kod | Ürün kodu |
| Aciklama | Ürün açıklaması |
| Ebat | Ürün ebatı |
| Model | Ürün modeli |
| Mevsim | KIŞ, YAZ, 4 Mevsim |
| DOT | Üretim yılı |
| Gorsel | Görsel dosya adı |
| Stok | Stok adedi |
