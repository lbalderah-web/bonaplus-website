(() => {
  'use strict';
  const allowedEvents = new Set([
    'page_view','whatsapp_click','email_click','phone_click','product_open',
    'catalog_filter','catalog_search','add_to_order_opened','quantity_quick_add',
    'review_order','order_form_submit','export_inquiry','language_switch'
  ]);

  function pageType() {
    const path = location.pathname;
    if (path.startsWith('/exportaciones/')) return 'export_es';
    if (path.startsWith('/en/')) return 'export_en';
    if (path.startsWith('/productos/')) return 'product';
    if (path.startsWith('/mayoristas/')) return 'wholesale';
    if (path.startsWith('/fabricante-productos-limpieza/')) return 'manufacturer_seo';
    if (path.startsWith('/empresa/')) return 'company';
    if (path.startsWith('/productos-limpieza/')) return 'cleaning_category';
    if (path.startsWith('/productos-cuidado-personal/')) return 'personal_care_category';
    if (path.startsWith('/guia-mayoristas/')) return 'wholesale_guide';
    return path === '/' ? 'home' : 'other';
  }

  function cleanData(data = {}) {
    const out = {};
    Object.entries(data).slice(0, 12).forEach(([key, value]) => {
      if (!/^[a-z0-9_]{1,40}$/i.test(key)) return;
      if (typeof value === 'string') out[key] = value.slice(0, 80);
      else if (typeof value === 'number' && Number.isFinite(value)) out[key] = value;
      else if (typeof value === 'boolean') out[key] = value;
    });
    return out;
  }

  function send(event, data = {}) {
    if (!allowedEvents.has(event)) return;
    const payload = { event, path: location.pathname, data: cleanData({ page_type: pageType(), ...data }) };

    try {
      if (typeof window.va === 'function') window.va('event', { name: event, data: payload.data });
    } catch (_) {}

    const body = JSON.stringify(payload);
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/event', new Blob([body], { type: 'application/json' }));
        return;
      }
    } catch (_) {}

    fetch('/api/event', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
      keepalive: true,
      credentials: 'same-origin'
    }).catch(() => {});
  }

  window.bonaplusTrack = send;
  const productIdFrom = el => el?.closest?.('.product-card')?.id?.replace(/^card-/, '') || '';

  document.addEventListener('click', event => {
    const target = event.target.closest('a,button');
    if (!target) return;

    if (target.matches('a[href*="wa.me"]')) {
      send(location.pathname.startsWith('/exportaciones/') || location.pathname.startsWith('/en/') ? 'export_inquiry' : 'whatsapp_click', {
        placement: target.closest('header') ? 'header' : target.closest('footer') ? 'footer' : target.closest('.cta,.closing') ? 'cta' : 'content'
      });
      return;
    }
    if (target.matches('a[href^="mailto:"]')) {
      send(location.pathname.startsWith('/exportaciones/') || location.pathname.startsWith('/en/') ? 'export_inquiry' : 'email_click', {
        placement: target.closest('footer') ? 'footer' : 'content'
      });
      return;
    }
    if (target.matches('a[href^="tel:"]')) {
      send('phone_click', { placement: target.closest('footer') ? 'footer' : 'content' });
      return;
    }
    if (target.matches('[data-language-switch]')) {
      send('language_switch', { language: target.getAttribute('data-language-switch') || '' });
      return;
    }

    const filter = target.closest('button[data-filter]');
    if (filter) {
      send('catalog_filter', { filter: filter.dataset.filter || '' });
      return;
    }

    const action = target.closest('button[data-action]');
    if (action) {
      const id = action.dataset.id || '';
      if (action.dataset.action === 'toggle') send('add_to_order_opened', { product: id });
      if (action.dataset.action === 'add100') send('quantity_quick_add', { product: id });
      return;
    }

    if (target.closest('#sendOrder')) {
      send('review_order', {});
      return;
    }

    const product = productIdFrom(target);
    if (product && target.closest('.product-image,h3')) send('product_open', { product });
  });

  document.addEventListener('change', event => {
    const input = event.target.closest('#productSearch');
    if (input) send('catalog_search', { query_length: String(input.value || '').trim().length });
  });

  document.addEventListener('submit', event => {
    if (event.target?.id === 'orderForm') send('order_form_submit', {});
  });

  const productPath = location.pathname.match(/^\/productos\/([^/]+)\/?/);
  send('page_view', productPath ? { product: productPath[1] } : {});
})();