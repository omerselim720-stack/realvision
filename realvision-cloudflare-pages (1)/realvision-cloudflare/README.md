# RealVision AI Studio — Cloudflare Pages

## Yayınlama
1. Bu klasörü GitHub deposuna yükleyin.
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git.
3. Build command: `npm run build`
4. Build output directory: `dist`
5. Root directory boş kalsın (repo kökü).

## Gemini API anahtarı
Cloudflare Pages projesinde Settings → Variables and Secrets (veya Environment variables) bölümüne gidin.
`GEMINI_API_KEY` adında **Secret** oluşturup Google AI Studio'dan aldığınız Gemini API anahtarını girin.
Ardından yeni deployment başlatın.

API anahtarı frontend koduna yazılmıyor; `functions/api/generate.js` sunucu tarafında kullanıyor.

## Önemli
- Bu proje tek bir `index.html` olarak değil, React/Vite projesi olarak build edilmelidir.
- `functions/api/generate.js` Cloudflare Pages Functions olarak `/api/generate` endpoint'ini sağlar.
- Görsel üretim modellerinin erişilebilirliği Google hesabınızın/API projesinin durumuna bağlıdır.
- "8K RAW / 4K UHD" arayüzündeki ifadeler prompt talimatlarıdır; gerçek çıktı çözünürlüğünü garanti etmez.
