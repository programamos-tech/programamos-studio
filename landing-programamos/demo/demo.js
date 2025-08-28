// scroll suave entre secciones
document.querySelectorAll('[data-scroll]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const id = btn.getAttribute('data-scroll');
    document.querySelector(id)?.scrollIntoView({behavior:'smooth', block:'start'});
  });
});

/* ====== CAFÉ: carrito mínimo + WhatsApp ====== */
const cart = [];
const cartList = document.getElementById('cartList');
function renderCart(){
  cartList.innerHTML = cart.map(x=>`<li>${x}</li>`).join('') || '<li style="opacity:.6">Sin ítems</li>';
}
renderCart();

document.querySelectorAll('.demo-cafe .add').forEach(b=>{
  b.addEventListener('click', ()=>{
    cart.push(b.dataset.item);
    renderCart();
  });
});
document.getElementById('cartClear').addEventListener('click', ()=>{
  cart.length = 0; renderCart();
});
document.getElementById('cartSend').addEventListener('click', ()=>{
  const txt = encodeURIComponent(`Pedido Café Aurora:\n- ${cart.join('\n- ')}`);
  window.open(`https://wa.me/573002061711?text=${txt}`, '_blank');
});

/* ====== HOTEL: demo disponibilidad ====== */
document.getElementById('hotelForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  const box = document.getElementById('hotelResult');
  box.hidden = false;
  box.animate([{opacity:0, transform:'translateY(6px)'},{opacity:1, transform:'translateY(0)'}],{duration:260, easing:'ease-out'});
});

/* ====== FERRETERÍA: cotizar por WhatsApp ====== */
document.querySelectorAll('.demo-ferre .cotizar').forEach(b=>{
  b.addEventListener('click', ()=>{
    const item = b.dataset.item;
    const txt = encodeURIComponent(`Hola 👋\nQuiero cotizar: ${item}`);
    window.open(`https://wa.me/573002061711?text=${txt}`, '_blank');
  });
});

/* ====== FINANZAS: elegibilidad simple ====== */
document.getElementById('finForm').addEventListener('submit',(e)=>{
  e.preventDefault();
  const data = new FormData(e.target);
  const monto  = +data.get('monto');
  const ventas = +data.get('ventas');
  const ok = ventas >= monto * 0.5; // regla demo
  const box = document.getElementById('finResult');
  box.textContent = ok ? 'Elegible ✅ — Te contactaremos por WhatsApp.' : 'Por ahora no elegible ❌ — intentemos con otro monto.';
  box.hidden = false;
  box.animate([{opacity:0},{opacity:1}],{duration:220});
});