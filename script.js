'use strict';

const products = [
  { id: 'cloro', name: 'Cloro (Mediano)', size: '150 ml', image: '/assets/catalog/cloro.webp', page: '/productos/cloro/' },
  { id: 'vinagre', name: 'Vinagre (Mediano)', size: '150 ml', image: '/assets/catalog/vinagre.webp', page: '/productos/vinagre/' },
  { id: 'lavaplatos', name: 'Lavaplatos', size: '150 ml', image: '/assets/catalog/lavaplatos.webp', page: '/productos/lavaplatos/' },
  { id: 'vainilla', name: 'Vainilla', size: '90 ml', image: '/assets/catalog/vainilla.webp', page: '/productos/vainilla/' },
  { id: 'calzado', name: 'Líquido para Calzado', size: '90 ml', image: '/assets/catalog/calzado.webp', page: '/productos/calzado/' },
  { id: 'desinfectante', name: 'Desinfectante', size: '90 ml', image: '/assets/catalog/desinfectante.webp', page: '/productos/desinfectante/' },
  { id: 'rinse150', name: 'Rinse (Mediano)', size: '150 ml', image: '/assets/catalog/rinse.webp', page: '/productos/rinse/' },
  { id: 'rinse90', name: 'Rinse (Pequeño)', size: '90 ml', image: '/assets/catalog/rinse.webp', page: '/productos/rinse/' },
  { id: 'shampoo150', name: 'Shampoo (Mediano)', size: '150 ml', image: '/assets/catalog/shampoo.webp', page: '/productos/shampoo/' },
  { id: 'shampoo90', name: 'Shampoo (Pequeño)', size: '90 ml', image: '/assets/catalog/shampoo.webp', page: '/productos/shampoo/' }
];

const categoryFor = product => ['cloro', 'lavaplatos', 'desinfectante', 'calzado'].includes(product.id) ? 'limpieza' : /^(shampoo|rinse)/.test(product.id) ? 'personal' : 'otros';
const quantities = Object.fromEntries(products.map(product => [product.id, 0]));
// Keep only product selections in this tab. Customer contact details are never stored.
try {
  const saved = JSON.parse(sessionStorage.getItem('bonaplus-selection-v1') || '{}');
  products.forEach(product => { quantities[product.id] = normalizeQuantity(saved[product.id]); });
} catch { /* The catalog also works when browser storage is unavailable. */ }
const grid = document.getElementById('productGrid');
const summary = document.getElementById('cartSummary');
const cartPanel = document.getElementById('cartPanel');
const sendButton = document.getElementById('sendOrder');
const orderModal = document.getElementById('orderModal');
const orderForm = document.getElementById('orderForm');
const modalClose = orderModal?.querySelector('.modal-close');
const orderNotice = document.getElementById('orderNotice');
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

function renderProducts() {
  if (!grid) return;
  if (grid.children.length) return;
  grid.innerHTML = products.map((product, index) => {
    const dimensions = product.id.startsWith('shampoo') ? [560, 842]
      : product.id.startsWith('rinse') ? [720, 900]
      : product.id === 'desinfectante' ? [240, 300]
      : product.id === 'calzado' ? [1086, 1448] : [1024, 1536];
    return `
    <article class="product-card" id="card-${product.id}"><span class="product-index">${String(index + 1).padStart(2, '0')} / BONAPLUS</span><span class="product-selected" aria-hidden="true">✓</span>
      <a class="product-image" href="${product.page}" aria-label="Ver información de ${product.name} Bonaplus">
        <img src="${product.image}" alt="${product.name} Bonaplus, presentación ${product.size}" loading="lazy" decoding="async" width="${dimensions[0]}" height="${dimensions[1]}">
      </a>
      <div class="product-content">
        <h3><a href="${product.page}">${product.name}</a></h3>
        <p>${product.size}</p>
        <button type="button" class="details-button" data-action="toggle" data-id="${product.id}" aria-expanded="false" aria-controls="controls-${product.id}" aria-label="Añadir ${product.name} al pedido">Añadir al pedido</button>
        <div class="quantity-row" id="controls-${product.id}" hidden>
          <label class="quantity-label" for="qty-${product.id}">Cantidad de cajas</label>
          <div class="quantity" role="group" aria-label="Cantidad de cajas de ${product.name}">
            <button type="button" data-action="minus" data-id="${product.id}" aria-label="Restar una caja de ${product.name}">−</button>
            <input id="qty-${product.id}" data-quantity="${product.id}" type="number" min="0" max="999999" step="1" inputmode="numeric" value="0" aria-label="Cajas de ${product.name}">
            <button type="button" data-action="plus" data-id="${product.id}" aria-label="Agregar una caja de ${product.name}">+</button>
          </div>
          <button type="button" class="add-button" data-action="add100" data-id="${product.id}" aria-label="Agregar cien cajas de ${product.name}">+100 cajas</button>
        </div>
      </div>
    </article>`;
  }).join('');
}
function selectedProducts() {
  return products.filter(product => quantities[product.id] > 0);
}
function normalizeQuantity(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? Math.min(999999, Math.max(0, Math.trunc(amount))) : 0;
}
function updateCart(editingInput = null) {
  const selected = selectedProducts();
  const total = selected.reduce((sum, product) => sum + quantities[product.id], 0);
  if (summary) summary.textContent = selected.length
    ? `${selected.length} producto${selected.length === 1 ? '' : 's'} · ${total} caja${total === 1 ? '' : 's'}`
    : 'Elige productos para comenzar.';
  if (sendButton) sendButton.disabled = selected.length === 0;
  cartPanel?.classList.toggle('has-items', selected.length > 0);
  if (cartPanel) cartPanel.hidden = !selected.length;
  document.body.classList.toggle('has-order', selected.length > 0);
  try { sessionStorage.setItem('bonaplus-selection-v1', JSON.stringify(quantities)); } catch { /* Optional tab-local persistence. */ }
  if (orderNotice) orderNotice.textContent = total > 0 && total < 400
    ? `Tu selección suma ${total} caja${total === 1 ? '' : 's'}. Los pedidos habituales son de aproximadamente 400 cajas o más; nuestro equipo confirmará las condiciones aplicables.`
    : total >= 400
      ? `Tu selección suma ${total} cajas. El volumen está dentro del rango habitual de pedidos al por mayor.` : '';
  products.forEach(product => {
    const amount = quantities[product.id];
    const input = document.getElementById(`qty-${product.id}`);
    if (input && input !== editingInput) input.value = String(amount);
    document.getElementById(`card-${product.id}`)?.classList.toggle('is-selected', amount > 0);
    if (amount > 0) {
      const controls = document.getElementById(`controls-${product.id}`);
      if (controls) controls.hidden = false;
    }
    const minus = grid?.querySelector(`button[data-action="minus"][data-id="${product.id}"]`);
    if (minus) minus.disabled = amount === 0;
    const button = grid?.querySelector(`button[data-action="toggle"][data-id="${product.id}"]`);
    if (button) {
      button.textContent = amount > 0 ? `${amount.toLocaleString('es-DO')} ${amount === 1 ? 'caja' : 'cajas'} en tu pedido` : 'Añadir al pedido';
      if (amount > 0) button.setAttribute('aria-expanded', 'true');
      button.setAttribute('aria-label', amount > 0 ? `Editar cantidad de ${product.name}` : `Añadir ${product.name} al pedido`);
    }
  });
}
function openControls(id, button) {
  const controls = document.getElementById(`controls-${id}`);
  if (!controls || !button) return;
  controls.hidden = false;
  button.setAttribute('aria-expanded', 'true');
  if (quantities[id] === 0) quantities[id] = 1;
  updateCart();
  const input = document.getElementById(`qty-${id}`);
  input?.focus({ preventScroll: true });
  input?.select();
}
grid?.addEventListener('click', event => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const { id, action } = button.dataset;
  if (!id || !action || !(id in quantities)) return;
  if (action === 'toggle') { openControls(id, button); return; }
  if (action === 'plus') quantities[id] = normalizeQuantity(quantities[id] + 1);
  if (action === 'minus') quantities[id] = normalizeQuantity(quantities[id] - 1);
  if (action === 'add100') quantities[id] = normalizeQuantity(quantities[id] + 100);
  updateCart();
});
function readQuantity(event) {
  const input = event.target.closest('input[data-quantity]');
  if (!input || !(input.dataset.quantity in quantities)) return;
  quantities[input.dataset.quantity] = normalizeQuantity(input.value);
  if (event.type !== 'input') input.value = String(quantities[input.dataset.quantity]);
  updateCart(event.type === 'input' ? input : null);
}
grid?.addEventListener('input', readQuantity);
grid?.addEventListener('change', readQuantity);
grid?.addEventListener('focusout', readQuantity);

function openOrderModal() {
  if (!orderModal || !selectedProducts().length) return;
  if (typeof orderModal.showModal === 'function') orderModal.showModal();
  else orderModal.setAttribute('open', '');
  renderOrderReview();
  document.body.classList.add('modal-open');
  window.setTimeout(() => document.getElementById('customerName')?.focus(), 0);
}
function closeOrderModal() {
  if (!orderModal) return;
  if (typeof orderModal.close === 'function' && orderModal.open) orderModal.close();
  else orderModal.removeAttribute('open');
  document.body.classList.remove('modal-open');
  if (selectedProducts().length) sendButton?.focus();
  else document.getElementById('productSearch')?.focus({ preventScroll: true });
}
sendButton?.addEventListener('click', openOrderModal);
modalClose?.addEventListener('click', closeOrderModal);
orderModal?.addEventListener('cancel', event => { event.preventDefault(); closeOrderModal(); });
orderModal?.addEventListener('click', event => {
  if (event.target !== orderModal) return;
  const bounds = orderModal.getBoundingClientRect();
  const inside = event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
  if (!inside) closeOrderModal();
});
orderForm?.addEventListener('submit', event => {
  event.preventDefault();
  if (!orderForm.reportValidity()) return;
  const selected = selectedProducts();
  if (!selected.length) { closeOrderModal(); return; }
  const lines = selected.map(product => `• ${product.name} (${product.size}): ${quantities[product.id]} caja${quantities[product.id] === 1 ? '' : 's'}`);
  const total = selected.reduce((sum, product) => sum + quantities[product.id], 0);
  const name = document.getElementById('customerName')?.value.trim() || '';
  const business = document.getElementById('businessName')?.value.trim() || '';
  const phone = document.getElementById('customerPhone')?.value.trim() || '';
  const city = document.getElementById('customerCity')?.value.trim() || '';
  const notes = document.getElementById('customerNotes')?.value.trim() || '';
  const text = `Hola Bonaplus, quiero solicitar una cotización para un pedido al por mayor.\n\nDATOS DEL CLIENTE\nNombre: ${name}\nNegocio: ${business || 'No indicado'}\nTeléfono: ${phone}\nProvincia/Ciudad: ${city}\n\nPRODUCTOS\n${lines.join('\n')}\n\nTotal aproximado: ${total} caja${total === 1 ? '' : 's'}\nComentarios: ${notes || 'Ninguno'}\n\nPor favor, ayúdenme a coordinar precios, disponibilidad y envío.`;
  window.open(`https://wa.me/18093791396?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  closeOrderModal();
});

function setMenuOpen(open) {
  if (!nav || !toggle) return;
  nav.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
}
toggle?.addEventListener('click', () => setMenuOpen(!nav?.classList.contains('open')));
nav?.addEventListener('click', event => { if (event.target.closest('a')) setMenuOpen(false); });
document.addEventListener('click', event => {
  if (!nav?.classList.contains('open') || nav.contains(event.target) || toggle?.contains(event.target)) return;
  setMenuOpen(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav?.classList.contains('open')) { setMenuOpen(false); toggle?.focus(); }
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 880 && nav?.classList.contains('open')) setMenuOpen(false);
});
renderProducts();
updateCart();
const requestedProductId = new URLSearchParams(window.location.search).get('producto');
if (requestedProductId && requestedProductId in quantities) {
  const requestedButton = grid?.querySelector(`button[data-action="toggle"][data-id="${requestedProductId}"]`);
  openControls(requestedProductId, requestedButton);
}
const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: .08 });
  revealElements.forEach(element => observer.observe(element));
} else {
  revealElements.forEach(element => element.classList.add('visible'));
}

// Filter existing cards so quantities and expanded controls survive category changes.
let activeFilter = 'all';
const searchInput = document.getElementById('productSearch');
const filterButtons = document.querySelectorAll('[data-filter]');
const normalizeSearch = value => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
function filterProducts() {
  const query = normalizeSearch(searchInput?.value.trim() || '');
  let count = 0;
  products.forEach(product => {
    const visible = (activeFilter === 'all' || categoryFor(product) === activeFilter) && normalizeSearch(`${product.name} ${product.size}`).includes(query);
    const card = document.getElementById(`card-${product.id}`);
    if (card) card.hidden = !visible;
    if (visible) count++;
  });
  const empty = document.getElementById('emptyCatalog');
  if (empty) empty.hidden = count > 0;
  const status = document.getElementById('filterStatus');
  if (status) status.textContent = `${count} ${count === 1 ? 'presentación' : 'presentaciones'} disponible${count === 1 ? '' : 's'} en esta vista.`;
}
filterButtons.forEach(button => button.addEventListener('click', () => {
  activeFilter = button.dataset.filter;
  filterButtons.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
  filterProducts();
}));
searchInput?.addEventListener('input', filterProducts);
document.getElementById('resetFilters')?.addEventListener('click', () => {
  activeFilter = 'all';
  if (searchInput) searchInput.value = '';
  filterButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === 'all')));
  filterProducts();
  searchInput?.focus();
});
filterProducts();

function renderOrderReview() {
  const review = document.getElementById('orderReview');
  if (!review) return;
  review.innerHTML = selectedProducts().map(product => `<div class="order-review-row"><span>${product.name}<small>${product.size}</small></span><div class="review-quantity"><input type="number" min="0" max="999999" step="1" inputmode="numeric" data-review-quantity="${product.id}" value="${quantities[product.id]}" aria-label="Cajas de ${product.name} en el resumen"><span>cajas</span></div><button type="button" class="remove-item" data-remove="${product.id}" aria-label="Quitar ${product.name} del pedido">×</button></div>`).join('');
}
function readReviewQuantity(event) {
  const input = event.target.closest('[data-review-quantity]');
  if (!input || !(input.dataset.reviewQuantity in quantities)) return;
  quantities[input.dataset.reviewQuantity] = normalizeQuantity(input.value);
  if (event.type !== 'input') input.value = String(quantities[input.dataset.reviewQuantity]);
  updateCart();
  if (event.type === 'input') return;
  if (!selectedProducts().length) closeOrderModal();
  else if (input.value === '0') renderOrderReview();
}
['input', 'change', 'focusout'].forEach(type => document.getElementById('orderReview')?.addEventListener(type, readReviewQuantity));
document.getElementById('orderReview')?.addEventListener('click', event => {
  const button = event.target.closest('[data-remove]');
  if (!button || !(button.dataset.remove in quantities)) return;
  quantities[button.dataset.remove] = 0;
  updateCart();
  if (!selectedProducts().length) closeOrderModal();
  else { renderOrderReview(); document.querySelector('[data-review-quantity]')?.focus(); }
});
