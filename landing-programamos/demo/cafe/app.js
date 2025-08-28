// Datos de productos (demo)
const PRODUCTS = [
  {id:'latte',     name:'Latte',        desc:'Leche cremosa con espresso doble', price:12000, img:'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=1200', cat:'bebidas'},
  {id:'capuccino', name:'Capuccino',    desc:'Espuma perfecta, toque de cacao',  price:11000, img:'https://images.pexels.com/photos/340996/pexels-photo-340996.jpeg?auto=compress&cs=tinysrgb&w=1200', cat:'bebidas'},
  {id:'americano', name:'Americano',    desc:'Espresso + agua caliente',          price:8000,  img:'https://images.pexels.com/photos/1153600/pexels-photo-1153600.jpeg?auto=compress&cs=tinysrgb&w=1200', cat:'bebidas'},
  {id:'espresso',  name:'Espresso',     desc:'Doble shot 18g – 36g',             price:9000,  img:'https://images.pexels.com/photos/296888/pexels-photo-296888.jpeg?auto=compress&cs=tinysrgb&w=1200', cat:'bebidas'},
  {id:'matcha',    name:'Matcha Latte', desc:'Té verde japonés + leche',          price:14000, img:'https://images.pexels.com/photos/4033635/pexels-photo-4033635.jpeg?auto=compress&cs=tinysrgb&w=1200', cat:'bebidas'},
  {id:'chai',      name:'Chai Latte',   desc:'Especias + leche vaporizada',       price:13000, img:'https://images.pexels.com/photos/4942949/pexels-photo-4942949.jpeg?auto=compress&cs=tinysrgb&w=1200', cat:'bebidas'},
  {id:'coldbrew',  name:'Cold Brew',    desc:'12h de extracción en frío',         price:13000, img:'https://images.pexels.com/photos/2101187/pexels-photo-2101187.jpeg?auto=compress&cs=tinysrgb&w=1200', cat:'frio'},
  {id:'affogato',  name:'Affogato',     desc:'Helado vainilla + espresso',        price:16000, img:'https://images.pexels.com/photos/4109998/pexels-photo-4109998.jpeg?auto=compress&cs=tinysrgb&w=1200', cat:'frio'},
  {id:'croissant', name:'Croissant',    desc:'Mantequilla francesa, hojaldre',    price:7000,  img:'https://images.pexels.com/photos/2135/food-coffee-cup-breakfast.jpg?auto=compress&cs=tinysrgb&w=1200', cat:'panaderia'},
  {id:'brownie',   name:'Brownie',      desc:'Chocolate oscuro + nueces',         price:8000,  img:'https://images.pexels.com/photos/45202/brownie-cake-dessert-chocolate-45202.jpeg?auto=compress&cs=tinysrgb&w=1200', cat:'panaderia'},
  {id:'cheesecake',name:'Cheesecake',   desc:'Frutos rojos, porción generosa',    price:15000, img:'https://images.pexels.com/photos/704569/pexels-photo-704569.jpeg?auto=compress&cs=tinysrgb&w=1200', cat:'panaderia'},
  {id:'cookie',    name:'Cookie',       desc:'Chips de chocolate 70%',            price:6000,  img:'https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=1200', cat:'panaderia'},
  {id:'sandwich',  name:'Sándwich',     desc:'Pan masa madre + jamón y queso',    price:15000, img:'https://images.pexels.com/photos/6054349/pexels-photo-6054349.jpeg?auto=compress&cs=tinysrgb&w=1200', cat:'panaderia'},
  {id:'combo1',    name:'Combo Desayuno',desc:'Latte + croissant',                 price:18000, img:'https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=1200', cat:'combo'},
  {id:'combo2',    name:'Combo Tarde',   desc:'Americano + brownie',               price:17000, img:'https://images.pexels.com/photos/45202/brownie-cake-dessert-chocolate-45202.jpeg?auto=compress&cs=tinysrgb&w=1200', cat:'combo'}
];

// Render de productos
const grid = document.getElementById('grid');
function renderGrid(list){
  grid.innerHTML = list.map(p => `
  <article class="card" data-id="${p.id}">
    <div class="card__img"><img src="${p.img}" alt="${p.name}"></div>
    <div class="card__body">
      <h3 class="card__title">${p.name}</h3>
      <p class="card__desc">${p.desc}</p>
    </div>
    <div class="card__foot">
      <span class="price">$${p.price.toLocaleString('es-CO')}</span>
      <button class="btn solid add">Añadir</button>
    </div>
  </article>
`).join('');
  // animación de entrada con IO
  const cards = Array.from(document.querySelectorAll('.card'));
  const io = new IntersectionObserver(es=>{
    es.forEach((e, idx)=>{ if(e.isIntersecting){ e.target.classList.add('show'); io.unobserve(e.target);} });
  }, {threshold:.1});
  cards.forEach(c=>io.observe(c));
}
renderGrid(PRODUCTS);

// Estado del carrito
let cart = {}; // id -> qty
const drawer = document.getElementById('drawer');
const backdrop = document.getElementById('backdrop');
const cartCount = document.getElementById('cartCount');
const cartList  = document.getElementById('cartList');
const subtotalEl = document.getElementById('subtotal');

function updateCartBadge(){
  const n = Object.values(cart).reduce((a,b)=>a+b,0);
  cartCount.textContent = n;
  cartCount.classList.remove('bump'); void cartCount.offsetWidth; cartCount.classList.add('bump');
}
function format(n){ return '$' + n.toLocaleString('es-CO'); }
function getItem(id){ return PRODUCTS.find(p=>p.id===id); }
function renderCart(){
  const items = Object.entries(cart);
  if(items.length===0){
    cartList.innerHTML = '<li style="opacity:.7;padding:12px">Tu carrito está vacío</li>';
    subtotalEl.textContent = '$0';
    return;
  }
  let subtotal = 0;
  cartList.innerHTML = items.map(([id,qty])=>{
    const p = getItem(id); const line = p.price*qty; subtotal+=line;
    return `
      <li class="cart-item" data-id="${id}">
        <img src="${p.img}" alt="${p.name}">
        <div>
          <b>${p.name}</b>
          <div class="qty">
            <button class="dec">−</button>
            <span>${qty}</span>
            <button class="inc">+</button>
          </div>
        </div>
        <div><b>${format(line)}</b></div>
      </li>`;
  }).join('');
  subtotalEl.textContent = format(subtotal);
}

// Abrir/cerrar drawer
document.getElementById('openCart').addEventListener('click', ()=>{
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden','false');
  backdrop.hidden = false;
});
document.getElementById('closeCart').addEventListener('click', closeDrawer);
backdrop.addEventListener('click', closeDrawer);
function closeDrawer(){
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden','true');
  backdrop.hidden = true;
}

// Añadir producto
grid.addEventListener('click', (e)=>{
  const addBtn = e.target.closest('.add');
  if(!addBtn) return;
  const id = addBtn.closest('.card').dataset.id;
  cart[id] = (cart[id]||0) + 1;
  updateCartBadge();
  renderCart();
  toast('Añadido al carrito');
});

// Cambiar cantidades en el carrito
cartList.addEventListener('click', (e)=>{
  const li = e.target.closest('.cart-item');
  if(!li) return;
  const id = li.dataset.id;
  if(e.target.classList.contains('inc')){ cart[id]++; }
  if(e.target.classList.contains('dec')){ cart[id] = Math.max(0, (cart[id]||0)-1); if(cart[id]===0) delete cart[id]; }
  updateCartBadge(); renderCart();
});

// Vaciar / Checkout
document.getElementById('clearCart').addEventListener('click', ()=>{ cart={}; updateCartBadge(); renderCart(); });
document.getElementById('checkout').addEventListener('click', ()=>{
  if(Object.keys(cart).length===0) return alert('Tu carrito está vacío.');
  const lines = Object.entries(cart).map(([id,qty])=>{ const p=getItem(id); return `• ${p.name} x${qty} — ${format(p.price*qty)}`;}).join('\n');
  const total = Object.entries(cart).reduce((s,[id,qty])=>s+getItem(id).price*qty,0);
  const msg = encodeURIComponent(`Pedido Bartimeo Café\n${lines}\nTotal: ${format(total)}`);
  window.open(`https://wa.me/573002061711?text=${msg}`, '_blank');
});

// Búsqueda
const q = document.getElementById('q');
q.addEventListener('input', ()=> applyFilters());

// Filtros por categoría
const chips = Array.from(document.querySelectorAll('.chip'));
chips.forEach(c=> c.addEventListener('click', ()=>{
  chips.forEach(x=>x.classList.remove('is-on'));
  c.classList.add('is-on');
  applyFilters();
}));

function applyFilters(){
  const term = q.value.trim().toLowerCase();
  const active = document.querySelector('.chip.is-on')?.dataset.filter || 'all';
  let list = PRODUCTS.filter(p =>
    (active==='all' || p.cat===active) &&
    (p.name.toLowerCase().includes(term) || p.desc.toLowerCase().includes(term))
  );
  renderGrid(list);
}

// Toast
const toastEl = document.getElementById('toast');
let toastTimer = null;
function toast(msg){
  clearTimeout(toastTimer);
  toastEl.textContent = msg;
  toastEl.hidden = false;
  toastEl.classList.add('show');
  toastTimer = setTimeout(()=>{ toastEl.classList.remove('show'); toastEl.hidden = true; }, 1400);
}
