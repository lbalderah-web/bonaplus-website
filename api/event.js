const ALLOWED_EVENTS = new Set([
  'page_view','whatsapp_click','email_click','phone_click','product_open',
  'catalog_filter','catalog_search','add_to_order_opened','quantity_quick_add',
  'review_order','order_form_submit','export_inquiry','language_switch'
]);

function sanitize(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const out = {};
  Object.entries(value).slice(0, 12).forEach(([key, item]) => {
    if (!/^[a-z0-9_]{1,40}$/i.test(key)) return;
    if (typeof item === 'string') out[key] = item.slice(0, 80);
    else if (typeof item === 'number' && Number.isFinite(item)) out[key] = item;
    else if (typeof item === 'boolean') out[key] = item;
  });
  return out;
}

export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  if (!body || typeof body !== 'object') body = {};

  const event = typeof body.event === 'string' ? body.event.slice(0, 50) : '';
  if (!ALLOWED_EVENTS.has(event)) return res.status(400).json({ ok: false });

  const path = typeof body.path === 'string' && body.path.startsWith('/') ? body.path.slice(0, 180) : '/';
  const data = sanitize(body.data);

  console.log(JSON.stringify({
    type: 'bonaplus_event',
    event,
    path,
    data,
    timestamp: new Date().toISOString()
  }));

  return res.status(204).end();
}
