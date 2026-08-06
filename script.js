const products = [
  { id: 'cloro', name: 'Cloro (Mediano)', size: '150 ml', image: 'assets/product-art/cloro.jpg' },
  { id: 'vinagre', name: 'Vinagre (Mediano)', size: '150 ml', image: 'assets/product-art/vinagre.jpg' },
  { id: 'lavaplatos', name: 'Lavaplatos', size: '150 ml', image: 'assets/product-art/lavaplatos.jpg' },
  { id: 'vainilla', name: 'Vainilla', size: '90 ml', image: 'assets/product-art/vainilla.jpg' },
  { id: 'calzado', name: 'Líquido para Calzado', size: '90 ml', image: 'assets/product-art/calzado.jpg' },
  { id: 'desinfectante', name: 'Desinfectante', size: '90 ml', image: 'assets/product-art/desinfectante.jpg' },
  { id: 'rinse150', name: 'Rinse (Mediano)', size: '150 ml', image: 'assets/product-art/rinse.jpg' },
  { id: 'rinse90', name: 'Rinse (Pequeño)', size: '90 ml', image: 'assets/product-art/rinse.jpg' },
  { id: 'shampoo150', name: 'Shampoo (Mediano)', size: '150 ml', image: 'assets/product-art/shampoo.jpg' },
  { id: 'shampoo90', name: 'Shampoo (Pequeño)', size: '90 ml', image: 'assets/product-art/shampoo.jpg' }
];
const quantities = Object.fromEntries(products.map(p => [p.id, 0]));
const grid = document.getElementById('productGrid');
const summary = document.getElementById('cartSummary');
const sendButton = document.getElementById('sendOrder');
const orderModal = document.getElementById('orderModal');
const orderForm = document.getElementById('orderForm');
const modalClose = orderModal.querySelector('.modal-close');
const orderNotice = document.getElementById('orderNotice');

function renderProducts(){
  grid.innerHTML = products.map(product => `
    <article class="product-card reveal">
      <div class="product-image"><img src="${product.image}" alt="${product.name} Bonaplus, presentación ${product.size}" loading="lazy" decoding="async" width="900" height="1200"></div>
      <div class="product-content">
        <h3>${product.name}</h3><p>${product.size}</p>
        <button class="details-button" data-action="toggle" data-id="${product.id}" aria-expanded="false" aria-controls="controls-${product.id}">Agregar al pedido</button>
        <div class="quantity-row" id="controls-${product.id}" hidden>
          <div class="quantity" role="group" aria-label="Cantidad de cajas de ${product.name}"><button data-action="minus" data-id="${product.id}" aria-label="Restar una caja de ${product.name}">−</button><span id="qty-${product.id}" aria-live="polite" aria-atomic="true">0</span><button data-action="plus" data-id="${product.id}" aria-label="Agregar una caja de ${product.name}">+</button></div>
          <button class="add-button" data-action="add10" data-id="${product.id}" aria-label="Agregar diez cajas de ${product.name}">+10 cajas</button>
        </div>
      </div>
    </article>`).join('');
}
function selectedProducts(){return products.filter(p => quantities[p.id] > 0)}
function updateCart(){
  const selected = selectedProducts();
  const total = selected.reduce((sum,p) => sum + quantities[p.id],0);
  summary.textContent = selected.length ? `${selected.length} producto${selected.length===1?'':'s'} seleccionado${selected.length===1?'':'s'} · ${total} caja${total===1?'':'s'} aproximada${total===1?'':'s'}.` : 'Aún no has agregado productos.';
  sendButton.disabled = selected.length === 0;
  orderNotice.textContent = total > 0 && total < 400 ? `Tu selección suma ${total} cajas. Los pedidos habituales son de aproximadamente 400 cajas o más; nuestro equipo confirmará las condiciones aplicables.` : total >= 400 ? `Tu selección suma ${total} cajas. El volumen está dentro del rango habitual de pedidos al por mayor.` : '';
  products.forEach(p => { const el=document.getElementById(`qty-${p.id}`); if(el) el.textContent=quantities[p.id]; });
}
function openControls(id,button){
  const controls=document.getElementById(`controls-${id}`); controls.hidden=false; button.setAttribute('aria-expanded','true'); button.textContent='Producto agregado'; if(quantities[id]===0) quantities[id]=1;
}
grid.addEventListener('click',event=>{
  const button=event.target.closest('button[data-action]'); if(!button) return;
  const {id,action}=button.dataset;
  if(action==='toggle') openControls(id,button);
  if(action==='plus') quantities[id]+=1;
  if(action==='minus') quantities[id]=Math.max(0,quantities[id]-1);
  if(action==='add10') quantities[id]+=10;
  updateCart();
});
sendButton.addEventListener('click',()=>{ if(typeof orderModal.showModal==='function') orderModal.showModal(); else orderModal.setAttribute('open',''); });
modalClose.addEventListener('click',()=>orderModal.close());
orderModal.addEventListener('click',event=>{
  if(event.target !== orderModal) return;
  const bounds=orderModal.getBoundingClientRect();
  const inside=event.clientX>=bounds.left && event.clientX<=bounds.right && event.clientY>=bounds.top && event.clientY<=bounds.bottom;
  if(!inside) orderModal.close();
});
orderForm.addEventListener('submit',event=>{
  event.preventDefault();
  if(!orderForm.reportValidity()) return;
  const lines=selectedProducts().map(p=>`• ${p.name} (${p.size}): ${quantities[p.id]} cajas`);
  const total=selectedProducts().reduce((sum,p)=>sum+quantities[p.id],0);
  const name=document.getElementById('customerName').value.trim();
  const business=document.getElementById('businessName').value.trim();
  const phone=document.getElementById('customerPhone').value.trim();
  const city=document.getElementById('customerCity').value.trim();
  const notes=document.getElementById('customerNotes').value.trim();
  const text=`Hola Bonaplus, quiero solicitar una cotización para un pedido al por mayor.\n\nDATOS DEL CLIENTE\nNombre: ${name}\nNegocio: ${business||'No indicado'}\nTeléfono: ${phone}\nProvincia/Ciudad: ${city}\n\nPRODUCTOS\n${lines.join('\n')}\n\nTotal aproximado: ${total} cajas\nComentarios: ${notes||'Ninguno'}\n\nPor favor, ayúdenme a coordinar precios, disponibilidad y envío.`;
  window.open(`https://wa.me/18093791396?text=${encodeURIComponent(text)}`,'_blank','noopener,noreferrer');
  orderModal.close();
});
const toggle=document.querySelector('.menu-toggle'); const nav=document.querySelector('.nav');
function setMenuOpen(open){
  nav.classList.toggle('open',open);
  toggle.setAttribute('aria-expanded',String(open));
  toggle.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');
}
toggle.addEventListener('click',()=>setMenuOpen(!nav.classList.contains('open')));
nav.addEventListener('click',event=>{if(event.target.closest('a')) setMenuOpen(false)});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav.classList.contains('open')){setMenuOpen(false);toggle.focus()}});
renderProducts(); updateCart();
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.08});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
