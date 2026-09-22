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

  // Shared navigation behavior lives here so supporting pages do not duplicate inline JS.
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.getElementById('mainNav') || document.querySelector('.nav');
  const isEnglish = document.documentElement.lang.toLowerCase().startsWith('en');
  const setMenuOpen = open => {
    if (!menuToggle || !mainNav) return;
    mainNav.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open
      ? (isEnglish ? 'Close menu' : 'Cerrar menú')
      : (isEnglish ? 'Open menu' : 'Abrir menú'));
  };
  menuToggle?.addEventListener('click', () => setMenuOpen(!mainNav?.classList.contains('open')));
  mainNav?.addEventListener('click', event => {
    if (event.target.closest('a')) setMenuOpen(false);
  });
  document.addEventListener('click', event => {
    if (!mainNav?.classList.contains('open') || mainNav.contains(event.target) || menuToggle?.contains(event.target)) return;
    setMenuOpen(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && mainNav?.classList.contains('open')) {
      setMenuOpen(false);
      menuToggle?.focus();
    }
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 880 && mainNav?.classList.contains('open')) setMenuOpen(false);
  }, { passive: true });

  // One lightweight header scroll state for every page.
  const header = document.querySelector('.site-header');
  let headerFrame = 0;
  const paintHeader = () => {
    headerFrame = 0;
    header?.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  paintHeader();
  window.addEventListener('scroll', () => {
    if (!headerFrame) headerFrame = requestAnimationFrame(paintHeader);
  }, { passive: true });

  // Do not contact Google Maps until the visitor is close to the footer.
  const maps = document.querySelectorAll('iframe[data-map-src]');
  if (maps.length) {
    const loadMap = frame => {
      if (!frame.dataset.mapSrc) return;
      frame.src = frame.dataset.mapSrc;
      frame.removeAttribute('data-map-src');
    };
    if ('IntersectionObserver' in window) {
      const mapObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          loadMap(entry.target);
          mapObserver.unobserve(entry.target);
        });
      }, { rootMargin: '900px 0px' });
      maps.forEach(frame => mapObserver.observe(frame));
    } else {
      maps.forEach(loadMap);
    }
  }

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