export async function onRequestPost({ request, env }) {
  if (!env.GEMINI_API_KEY) {
    return Response.json({ error: { message: 'Sunucu yapılandırmasında GEMINI_API_KEY eksik.' } }, { status: 500 });
  }
  let body;
  try { body = await request.json(); }
  catch { return Response.json({ error: { message: 'Geçersiz JSON isteği.' } }, { status: 400 }); }

  const allowedModels = new Set([
    'gemini-3.1-flash-image',
    'gemini-3.1-flash-lite-image',
    'gemini-3-flash-preview'
  ]);
  if (!allowedModels.has(body.model) || !body.payload) {
    return Response.json({ error: { message: 'Geçersiz model veya istek içeriği.' } }, { status: 400 });
  }

  const upstream = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${body.model}:generateContent?key=${env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body.payload)
    }
  );
  const data = await upstream.text();
  return new Response(data, {
    status: upstream.status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
  });
}
