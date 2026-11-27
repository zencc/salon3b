# Salon 3B — Ev planlayıcı

Üç evin 3B modeli ve mobilya yerleşimi (Hilal Konutları, VIP Kurtköy, Kayışehri); bu bilgisayarda çalışan küçük bir uygulama.

## Çalıştırma

`Baslat.cmd` dosyasına çift tıklayın. Tarayıcıda http://localhost:8137 açılır.
Açık kalan siyah pencere uygulamanın sunucusudur; kapatınca uygulama da durur.

Gerekenler: Node.js (kurulu) ve internet bağlantısı (three.js ve yazı tipleri internetten yükleniyor).

## Dosyalar

- `index.html` — modelin kendisi (oda, mobilyalar, kontroller)
- `server.js` — sayfayı sunar ve yerleşimi kaydeder; ek paket gerektirmez
- `data/` — her evin kaydedilen yerleşimi: `layout.json` Hilal Konutları, `layout-ac-blok.json` VIP Kurtköy, `layout-abef.json` Kayışehri. Yedek almak ya da başka bilgisayara taşımak için bu klasörü kopyalayın.

## Kısayollar

Sürükle: taşı · R: döndür · Del: kaldır · oklar: 1 cm kaydır (Shift ile 10 cm) · WASD: gez · Ctrl+Z: geri al · F: tam ekran
