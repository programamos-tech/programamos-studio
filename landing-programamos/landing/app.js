/* ===== helpers ===== */
const $  = s => document.querySelector(s);

/* ===== Año en footer ===== */
(() => { const y = $('#year'); if(y) y.textContent = new Date().getFullYear(); })();

/* ===== Banner evento — contador simple ===== */
(() => {
  const el = $('#oh-count');
  if(!el) return;
  const target = new Date(Date.now() + 1000*60*60*24*52); // 52 días demo
  const pad = n => n.toString().padStart(2,'0');
  function tick(){
    const now = new Date();
    let diff = Math.max(0, target - now);
    const d = Math.floor(diff/86400000); diff -= d*86400000;
    const h = Math.floor(diff/3600000);  diff -= h*3600000;
    const m = Math.floor(diff/60000);    diff -= m*60000;
    const s = Math.floor(diff/1000);
    el.textContent = `${d}d ${pad(h)}:${pad(m)}:${pad(s)}`;
    requestAnimationFrame(()=>setTimeout(tick, 500));
  }
  tick();
})();

/* ===== Lluvia de símbolos (morado) ===== */
(() => {
  const canvas = document.getElementById('binary');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');

  const SYMBOLS = ['{','}','</>',';','()=>','()','[]','#','<div>','const','let'];
  const SIZE_MIN=11, SIZE_MAX=18;
  const SPEED_MIN=8, SPEED_MAX=16;
  const WOBBLE_AMPL=6, WOBBLE_SPEED=.6;
  const DENSITY=0.035;   // partículas / 1000 px²
  const FADE=0.05;
  const COLOR = 'rgba(35,15,73,0.65)';

  let w,h,parts=[],last=0;

  function rand(a,b){ return a + Math.random()*(b-a); }
  function pick(a){ return a[(Math.random()*a.length)|0]; }

  function spawn(randomY=false){
    const size = rand(SIZE_MIN,SIZE_MAX);
    return { x:Math.random()*w, y: randomY ? Math.random()*h : -40,
      v: rand(SPEED_MIN,SPEED_MAX), size, sym: pick(SYMBOLS), wob: Math.random()*Math.PI*2 };
  }
  function resize(){
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio||1));
    w = canvas.width  = Math.floor(innerWidth * dpr);
    h = canvas.height = Math.floor(innerHeight * dpr);
    canvas.style.width  = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const count = Math.floor((innerWidth*innerHeight) * DENSITY / 1000);
    parts = Array.from({length:count}, ()=>spawn(true));
  }
  resize(); addEventListener('resize', resize);

  function draw(ts){
    if(!last) last = ts;
    const dt = (ts - last)/1000; last = ts;

    ctx.fillStyle = `rgba(251,251,254,${FADE})`;
    ctx.fillRect(0,0,innerWidth,innerHeight);

    ctx.fillStyle = COLOR;
    for(const p of parts){
      p.y += p.v * dt;
      p.wob += dt * WOBBLE_SPEED;
      const x = p.x + Math.sin(p.wob) * WOBBLE_AMPL;

      ctx.font = `${p.size}px "Fira Code", monospace`;
      ctx.fillText(p.sym, x, p.y);

      if(p.y > innerHeight + 60) Object.assign(p, spawn(false));
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();

/* ===== Typewriter del HERO ===== */
(() => {
  const el = document.getElementById('typewriter');
  if(!el) return;
  const caret = '<span class="caret"></span>';
const lines = [
  `<span class="token.comment">// 🚀 Transformación digital en acción</span>`,
  `<span class="token.keyword">function</span> <span class="token.function">crecerConProgramamos</span>(negocio){`,
  `  conectar(negocio, <span class="token.string">"internet 🌐"</span>);`,
  `  optimizar(negocio, <span class="token.string">"procesos ⚙️"</span>);`,
  `  <span class="token.keyword">return</span> <span class="token.string">"💜 crecimiento"</span>;`,
  `}`,
  ``,
  `<span class="token.keyword">const</span> resultado = <span class="token.function">crecerConProgramamos</span>(<span class="token.string">"tu empresa"</span>);`,
  ``,
  `<span class="token.comment">// 🌴 Orgullo local</span>`,
  `<span class="token.keyword">const</span> programamos = {`,
  `  origen: <span class="token.string">"Sincelejo"</span>`,
  `};`,
  ``,
  `<span class="token.function">console</span>.log(<span class="token.string">"📍 Ubicados en "</span> + programamos.origen + <span class="token.string">" 🚀"</span>);`
];


  let out="", i=0, j=0, typed=false;

  function step(){
    if(i>=lines.length){ el.innerHTML = out + caret; return; }
    const line = lines[i];
    if(j<line.length){
      out += line[j++]; el.innerHTML = out + caret;
      setTimeout(step, 14 + Math.random()*16);
    }else{
      out += "\n"; j=0; i++; el.innerHTML = out + caret;
      setTimeout(step, 210);
    }
  }
  const io = new IntersectionObserver((es)=>{
    es.forEach(e=>{
      if(e.isIntersecting && !typed){ typed = true; step(); io.disconnect(); }
    });
  }, {threshold:.3});
  io.observe(el);
})();

/* ===== SDLC: círculo interactivo ===== */
(() => {
  const labelsEl = document.getElementById('sdlcLabels');
  if(!labelsEl) return;

  const labels   = Array.from(labelsEl.querySelectorAll('.sdlc__label'));
  const marker   = document.getElementById('sdlcMarker');
  const progress = document.querySelector('.sdlc__progress');

  const pTitle = document.getElementById('sdlcTitle');
  const pText  = document.getElementById('sdlcText');
  const pIdx   = document.getElementById('sdlcIndex');
  const pDots  = document.getElementById('sdlcDots');
  const pWrap  = document.getElementById('sdlcPanel');
  const btnPrev= document.getElementById('sdlcPrev');
  const btnNext= document.getElementById('sdlcNext');

  const steps = [
    {
      t:'Requisitos',
      d:'Definimos en sencillo qué problema resolvemos y para quién. Elegimos un MVP manejable.',
      more:`<p>En esta fase aclaramos el objetivo y el alcance sin tecnicismos.</p>
      <ul>
        <li>¿Quién usa esto? ¿Qué dolor le quitamos?</li>
        <li>Historias de usuario con criterios de éxito claros.</li>
        <li>Alcance del MVP: lo mínimo valioso para salir.</li>
      </ul>`
    },
    {
      t:'Diseño',
      d:'Convertimos ideas en pantallas navegables. Validamos el flujo antes de programar.',
      more:`<p>Prototipamos en Figma y acordamos cómo se ve y cómo se usa.</p>
      <ul>
        <li>Flujos simples (paso a paso) y estados (cargando/errores).</li>
        <li>Componentes y estilos consistentes.</li>
        <li>Si hay APIs, dejamos el “contrato” definido.</li>
      </ul>`
    },
    {
      t:'Implementación',
      d:'Construimos lo acordado y conectamos servicios necesarios.',
      more:`<p>Programamos la app con buenas prácticas y entregas pequeñas.</p>
      <ul>
        <li>Frontend + backend con control de versiones.</li>
        <li>Integraciones (pagos, correos, WhatsApp, etc.).</li>
        <li>Automatizaciones que ahorran tiempo.</li>
      </ul>`
    },
    {
      t:'Pruebas',
      d:'Probamos que funcione bien en distintas pantallas y casos.',
      more:`<p>Buscamos errores antes que tú los veas.</p>
      <ul>
        <li>Funcional, responsive y accesible.</li>
        <li>Rendimiento (que cargue rápido).</li>
        <li>Corregimos lo encontrado y volvemos a probar.</li>
      </ul>`
    },
    {
      t:'Despliegue',
      d:'Publicamos en internet de forma segura y con respaldo.',
      more:`<p>Dejamos todo listo para operar sin sobresaltos.</p>
      <ul>
        <li>Dominio, SSL y variables de entorno.</li>
        <li>Backups y plan de vuelta atrás (rollback).</li>
        <li>Monitoreo básico: logs y alertas.</li>
      </ul>`
    },
    {
      t:'Mantenimiento',
      d:'Mantenemos la app al día y estable.',
      more:`<p>Cuidamos la salud del sistema.</p>
      <ul>
        <li>Actualizaciones y parches de seguridad.</li>
        <li>Pequeñas mejoras continuas.</li>
        <li>Soporte y seguimiento de errores.</li>
      </ul>`
    },
    {
      t:'Retroalimentación',
      d:'Medimos uso real y planeamos la siguiente versión.',
      more:`<p>Aprendemos de datos y de tus usuarios.</p>
      <ul>
        <li>Métricas de uso y embudos simples.</li>
        <li>Feedback de clientes y equipo.</li>
        <li>Roadmap priorizado para la próxima iteración.</li>
      </ul>`
    },
  ];

  // Distribuir labels en círculo (base SVG 240x240)
  const center = { x: 120, y: 120 };
  const radiusText = 108;
  labels.forEach((el, idx)=>{
    const angle = (idx / labels.length) * Math.PI*2 - Math.PI/2; // arriba
    const x = center.x + radiusText * Math.cos(angle);
    const y = center.y + radiusText * Math.sin(angle);
    el.style.left = `${(x/240)*100}%`;
    el.style.top  = `${(y/240)*100}%`;
  });

  // Dots en el panel
  pDots.innerHTML = steps.map(()=>'<i></i>').join('');
  const dots = Array.from(pDots.querySelectorAll('i'));

  let i = 0;
  let timer = null;
  const AUTOPLAY = 4200;

  function setMarker(angleRad){
    const r = 88;
    const x = center.x + r * Math.cos(angleRad);
    const y = center.y + r * Math.sin(angleRad);
    marker.style.left = `${(x/240)*100}%`;
    marker.style.top  = `${(y/240)*100}%`;
  }
  function setProgress(idx){
    const C = 2*Math.PI*88;
    // Mantener sincronía: el anillo refleja el paso actual.
    // Se llena al 100% solo en el último paso.
    const last = steps.length - 1;
    const pct = idx === last ? 1 : (idx / steps.length);
    progress.style.strokeDashoffset = (C * (1 - pct));
  }

  function setStep(n, fromUser=false){
    i = (n + steps.length) % steps.length;

    labels.forEach(l=>l.classList.remove('is-active'));
    labels[i].classList.add('is-active');

    pWrap.classList.remove('anim-enter'); void pWrap.offsetWidth; pWrap.classList.add('anim-enter');
    pTitle.textContent = steps[i].t;
    pText.textContent  = steps[i].d;
    pIdx.textContent   = `${i+1}/${steps.length}`;

    dots.forEach(d=>d.classList.remove('is-on')); dots[i].classList.add('is-on');

    const angle = (i / steps.length) * Math.PI*2 - Math.PI/2;
    setMarker(angle);
    setProgress(i);

    if(fromUser) pause();
  }

  function next(){ setStep(i+1); }
  function prev(){ setStep(i-1); }

  labels.forEach((el, idx)=> el.addEventListener('click', ()=> setStep(idx, true)));
  btnNext.addEventListener('click', ()=> next());
  btnPrev.addEventListener('click', ()=> prev());
  document.addEventListener('keydown', e=>{
    if(e.key==='ArrowRight') next();
    if(e.key==='ArrowLeft')  prev();
  });

  let isModalOpen = false;
  function play(){
    if(isModalOpen) return; // no reanudar mientras el modal esté abierto
    clearInterval(timer);
    timer = setInterval(next, AUTOPLAY);
  }
  function pause(){ clearInterval(timer); timer=null; }
  [labelsEl, pWrap].forEach(el=>{
    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', play);
    el.addEventListener('focusin', pause);
    el.addEventListener('focusout', play);
  });

  setStep(0); play();
  addEventListener('resize', ()=> setStep(i));

  // ===== Modal "Más info" =====
  const btnMore   = document.getElementById('sdlcMore');
  const modal     = document.getElementById('sdlcModal');
  const modalIdx  = document.getElementById('sdlcModalIdx');
  const modalTit  = document.getElementById('sdlcModalTitle');
  const modalBody = document.getElementById('sdlcModalBody');
  const closeBtn  = document.getElementById('sdlcModalClose');

  function openModal(){
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    modalIdx.textContent = `${i+1}/${steps.length}`;
    modalTit.textContent = steps[i].t;
    modalBody.innerHTML  = steps[i].more;
    isModalOpen = true;
    pause();
  }
  function closeModal(){
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    isModalOpen = false;
    play();
  }
  if(btnMore){ btnMore.addEventListener('click', openModal); }
  modal?.addEventListener('click', (e)=>{
    const t = e.target;
    if(t instanceof HTMLElement && t.dataset.close === 'sdlcModal') closeModal();
  });
  closeBtn?.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape' && isModalOpen) closeModal(); });
})();

/* ===== Carrusel "De escuela a fábrica" ===== */
(function(){
  const wrap = document.getElementById('storyCarousel');
  if(!wrap) return;

  const track  = wrap.querySelector('.carousel__track');
  const slides = Array.from(wrap.querySelectorAll('.carousel__slide'));
  const btnPrev= wrap.querySelector('.carousel__btn.prev');
  const btnNext= wrap.querySelector('.carousel__btn.next');
  const dotsBox= wrap.querySelector('.carousel__dots');

  // Dots
  dotsBox.innerHTML = slides.map((_,i)=>`<button aria-label="Ir a la foto ${i+1}"></button>`).join('');
  const dots = Array.from(dotsBox.children);

  let i = 0;
  let timer = null;
  const AUTOPLAY = 3800;

  function go(n, fromUser=false){
    i = (n + slides.length) % slides.length;
    const x = -i * 100;
    track.style.transform = `translateX(${x}%)`;
    dots.forEach(d=>d.classList.remove('is-active'));
    dots[i].classList.add('is-active');
    if(fromUser) pause(), play(); // reinicia autoplay tras interacción
  }

  function next(){ go(i+1); }
  function prev(){ go(i-1); }

  // Eventos
  btnNext.addEventListener('click', () => go(i+1, true));
  btnPrev.addEventListener('click', () => go(i-1, true));
  dots.forEach((d,idx)=> d.addEventListener('click', ()=> go(idx, true)));

  // Swipe táctil
  let sx=0, dx=0, touching=false;
  track.addEventListener('touchstart', e=>{ touching=true; sx=e.touches[0].clientX; dx=0; pause();}, {passive:true});
  track.addEventListener('touchmove',  e=>{ if(!touching) return; dx=e.touches[0].clientX - sx; }, {passive:true});
  track.addEventListener('touchend',   ()=>{ 
    touching=false; 
    if(Math.abs(dx)>40) (dx<0? next():prev());
    play();
  });

  function play(){ clearInterval(timer); timer = setInterval(next, AUTOPLAY); }
  function pause(){ clearInterval(timer); }

  // Pausa al hover/focus
  wrap.addEventListener('mouseenter', pause);
  wrap.addEventListener('mouseleave', play);
  wrap.addEventListener('focusin',  pause);
  wrap.addEventListener('focusout', play);

  // Init
  go(0);
  play();
})();

/* ===== WhatsApp: Solicitar cotización en PLANES ===== */
(() => {
  const buttons = Array.from(document.querySelectorAll('.quote-btn'));
  if(buttons.length === 0) return;

  const PHONE = '573002061711';
  const MESSAGES = {
    starter: `Hola 👋, quisiera cotizar el plan Starter — Página web básica.
• Alcance: sitio informativo de 3 secciones (inicio, servicios, contacto).
• Interés: dominio/hosting/SSL + diseño + WhatsApp.
¿Podemos tener una reunión para una cotización?`,
    full: `Hola 👋, quisiera cotizar el plan Full Stack — Desarrollo a la medida.
• Alcance: funcionalidades personalizadas e integraciones.
• Interés: documentación, flujos en Figma, frontend (React) + backend (Laravel) y APIs.
¿Podemos agendar una llamada para revisar requerimientos?`
  };

  function openWA(kind){
    const txt = encodeURIComponent(MESSAGES[kind] || 'Hola, me interesa una cotización.');
    const url = `https://wa.me/${PHONE}?text=${txt}`;
    window.open(url, '_blank', 'noopener');
  }

  buttons.forEach(btn=>{
    btn.addEventListener('click', ()=> openWA(btn.dataset.plan));
  });
})();

/* ===== Escuela: botón Inscripciones apunta al link del menú ===== */
(() => {
  const btn = document.getElementById('schoolEnrollBtn');
  if(!btn) return;
  const schoolLink = Array.from(document.querySelectorAll('.menu a'))
    .find(a => /escuela/i.test(a.textContent || ''));
  if(schoolLink){ btn.href = schoolLink.getAttribute('href'); }
})();
