/* ══════════════════════════════════════
   LUXE STORE — Shared App JS
   Used by all pages
══════════════════════════════════════ */

/* ── CURSOR ── */
(function initCursor(){
  const cur=document.getElementById('cur'),curR=document.getElementById('curR');
  if(!cur||!curR)return;
  document.addEventListener('mousemove',e=>{
    cur.style.left=e.clientX+'px'; cur.style.top=e.clientY+'px';
    curR.style.left=e.clientX+'px'; curR.style.top=e.clientY+'px';
  });
})();

/* ── SCROLL NAV ── */
window.addEventListener('scroll',()=>{
  const nav=document.getElementById('navbar');
  if(nav) nav.classList.toggle('solid', window.scrollY > 40);
});

/* ══════════════════════════════════════
   PRODUCT DATA (single source of truth)
══════════════════════════════════════ */
const PRODUCTS = [
  {id:1,  name:'Premium Leather Tote',    cat:'accessories', price:4299,  oldPrice:6999,  icon:'👜', bg:'bg-peach', rating:4.8, reviews:234, tag:'sale', sizes:['S','M','L'],          desc:'Handcrafted from full-grain leather, this spacious tote is your perfect everyday companion. Features a zip closure, interior pockets, and adjustable strap.'},
  {id:2,  name:'Floral Summer Dress',     cat:'fashion',     price:1899,  oldPrice:2999,  icon:'👗', bg:'bg-rose',  rating:4.6, reviews:187, tag:'new',  sizes:['XS','S','M','L','XL'], desc:'A breezy floral dress perfect for summer days. Made with breathable cotton fabric, featuring a flattering A-line silhouette and adjustable straps.'},
  {id:3,  name:'Wireless Earbuds Pro',    cat:'electronics', price:3499,  oldPrice:4999,  icon:'🎧', bg:'bg-sky',   rating:4.7, reviews:312, tag:'sale', sizes:['One Size'],            desc:'True wireless earbuds with active noise cancellation, 30-hour battery life, and premium sound quality. IPX5 water resistant.'},
  {id:4,  name:'Minimalist Wall Clock',   cat:'home',        price:1299,  oldPrice:null,  icon:'🕐', bg:'bg-mint',  rating:4.5, reviews:98,  tag:null,   sizes:['"12','14"','18"'],      desc:'A beautifully designed minimalist wall clock with silent quartz movement. Powder-coated metal frame available in multiple finish options.'},
  {id:5,  name:'Slim Fit Chinos',         cat:'fashion',     price:1499,  oldPrice:2299,  icon:'👖', bg:'bg-sun',   rating:4.4, reviews:156, tag:'sale', sizes:['28','30','32','34','36'], desc:'Classic slim-fit chinos crafted from premium cotton-stretch blend. Perfect for both casual and smart-casual occasions.'},
  {id:6,  name:'Ceramic Plant Pot Set',   cat:'home',        price:899,   oldPrice:null,  icon:'🪴', bg:'bg-sage',  rating:4.9, reviews:74,  tag:'new',  sizes:['Small','Medium','Large'], desc:'Set of 3 handmade ceramic plant pots with drainage holes and bamboo trays. Each pot is unique with subtle hand-painted details.'},
  {id:7,  name:'Smart Watch Series X',    cat:'electronics', price:8999,  oldPrice:12999, icon:'⌚', bg:'bg-slate', rating:4.8, reviews:421, tag:'sale', sizes:['40mm','44mm'],         desc:'Advanced smartwatch with health monitoring, GPS, always-on display, and 7-day battery life. Compatible with iOS and Android.'},
  {id:8,  name:'Canvas Backpack',         cat:'accessories', price:2199,  oldPrice:3499,  icon:'🎒', bg:'bg-sun',   rating:4.6, reviews:203, tag:'sale', sizes:['20L','30L'],           desc:'Durable canvas backpack with padded laptop compartment (up to 15"), multiple organiser pockets, and ergonomic padded straps.'},
  {id:9,  name:'Linen Shirt',             cat:'fashion',     price:1199,  oldPrice:null,  icon:'👔', bg:'bg-mint',  rating:4.3, reviews:89,  tag:'new',  sizes:['S','M','L','XL','XXL'], desc:'Effortlessly cool linen shirt that keeps you comfortable in warm weather. Slightly relaxed fit, perfect for layering or wearing solo.'},
  {id:10, name:'Scented Candle Set',      cat:'home',        price:799,   oldPrice:999,   icon:'🕯', bg:'bg-lav',   rating:4.7, reviews:167, tag:'sale', sizes:['Set of 3','Set of 6'], desc:'Luxury soy wax candles in premium glass jars. Long-burning (60+ hours), available in 6 curated fragrances from our signature collection.'},
  {id:11, name:'Gold Hoop Earrings',      cat:'accessories', price:599,   oldPrice:999,   icon:'💍', bg:'bg-peach', rating:4.5, reviews:312, tag:'sale', sizes:['Small','Medium','Large'], desc:'Classic 18K gold-plated hoop earrings. Hypoallergenic, tarnish-resistant finish. Available in 3 sizes to suit every style.'},
  {id:12, name:'Yoga Mat Premium',        cat:'home',        price:1599,  oldPrice:2199,  icon:'🧘', bg:'bg-sage',  rating:4.8, reviews:245, tag:'new',  sizes:['Standard','XL'],       desc:'Extra-thick 6mm TPE yoga mat with alignment lines and carry strap. Non-slip surface, eco-friendly materials, perfect for all practice types.'},
];

/* ══════════════════════════════════════
   CART — localStorage persistence
══════════════════════════════════════ */
function getCart(){ return JSON.parse(localStorage.getItem('luxe-cart') || '[]'); }
function saveCart(cart){ localStorage.setItem('luxe-cart', JSON.stringify(cart)); }
function getTotalItems(){ return getCart().reduce((s,i)=>s+i.qty, 0); }
function getTotalPrice(){ return getCart().reduce((s,i)=>s+i.price*i.qty, 0); }

function addToCart(product, qty=1){
  const cart = getCart();
  const ex = cart.find(i=>i.id===product.id);
  if(ex){ ex.qty += qty; } else { cart.push({...product, qty}); }
  saveCart(cart);
  updateCartDot();
  renderCartSidebar();
  showToast('🛒', `${product.name} added to cart!`);
}

function removeFromCart(id){
  saveCart(getCart().filter(i=>i.id!==id));
  updateCartDot();
  renderCartSidebar();
  if(typeof renderCartPage === 'function') renderCartPage();
}

function changeCartQty(id, delta){
  const cart = getCart();
  const item = cart.find(i=>i.id===id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0){ saveCart(cart.filter(i=>i.id!==id)); }
  else { saveCart(cart); }
  updateCartDot();
  renderCartSidebar();
  if(typeof renderCartPage === 'function') renderCartPage();
}

function updateCartDot(){
  const dot = document.getElementById('cartDot');
  if(dot) dot.classList.toggle('has-items', getTotalItems()>0);
  const lbl = document.getElementById('cartCountLabel');
  const n = getTotalItems();
  if(lbl) lbl.textContent = n>0 ? `(${n})` : '';
}

/* ── CART SIDEBAR ── */
function renderCartSidebar(){
  const wrap = document.getElementById('cartItemsWrap');
  const bot  = document.getElementById('cartBot');
  if(!wrap) return;
  const cart = getCart();
  if(!cart.length){
    wrap.innerHTML = '<div class="cart-empty-state"><div class="cart-empty-icon">🛒</div><div class="cart-empty-txt">Your cart is empty</div></div>';
    if(bot) bot.style.display = 'none';
    return;
  }
  if(bot) bot.style.display = 'block';
  wrap.innerHTML = cart.map(i=>`
    <div class="ci">
      <div class="ci-img">${i.icon}</div>
      <div class="ci-body">
        <div class="ci-name">${i.name}</div>
        <div class="ci-variant">${i.cat||''}</div>
        <div class="ci-row">
          <span class="ci-price">₹${(i.price*i.qty).toLocaleString('en-IN')}</span>
          <div style="display:flex;align-items:center;gap:8px">
            <div class="qty-ctrl">
              <button class="qty-btn" onclick="changeCartQty(${i.id},-1)">−</button>
              <span class="qty-num">${i.qty}</span>
              <button class="qty-btn" onclick="changeCartQty(${i.id},1)">+</button>
            </div>
            <button class="ci-del" onclick="removeFromCart(${i.id})">✕</button>
          </div>
        </div>
      </div>
    </div>`).join('');
  const total = getTotalPrice();
  const subtEl = document.getElementById('cartSubtotal');
  const totEl  = document.getElementById('cartTotalAmt');
  if(subtEl) subtEl.textContent = '₹'+total.toLocaleString('en-IN');
  if(totEl)  totEl.textContent  = '₹'+total.toLocaleString('en-IN');
}

function openCart(){
  document.getElementById('cartVeil').classList.add('on');
  document.getElementById('cartPanel').classList.add('on');
}
function closeCart(){
  document.getElementById('cartVeil').classList.remove('on');
  document.getElementById('cartPanel').classList.remove('on');
}

/* ══════════════════════════════════════
   TOAST
══════════════════════════════════════ */
let _toastTimer;
function showToast(icon, msg){
  const t  = document.getElementById('toast');
  const ti = document.getElementById('toastIcon');
  const tm = document.getElementById('toastMsg');
  if(!t) return;
  if(ti) ti.textContent = icon;
  if(tm) tm.textContent = msg;
  t.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(()=>t.classList.remove('show'), 2800);
}

/* ══════════════════════════════════════
   PRODUCT CARD HTML
══════════════════════════════════════ */
function productCardHTML(p, detailPage='product-detail.html'){
  const discount = p.oldPrice ? Math.round((1-p.price/p.oldPrice)*100) : 0;
  const stars = Array.from({length:5},(_,i)=>`<span class="star${i<Math.round(p.rating)?'':' e'}">★</span>`).join('');
  const tagHTML = p.tag ? `<span class="tag ${p.tag}">${p.tag==='sale'?`-${discount}%`:p.tag}</span>` : '';
  return `
    <div class="prod-card" onclick="window.location='${detailPage}?id=${p.id}'">
      <div class="prod-img">
        <div class="prod-img-bg ${p.bg}">${p.icon}</div>
        <div class="prod-badges">${tagHTML}</div>
        <div class="prod-actions">
          <button class="prod-action-btn" onclick="event.stopPropagation();addToCart(PRODUCTS.find(x=>x.id===${p.id}))" title="Add to cart">🛒</button>
          <button class="prod-action-btn" onclick="event.stopPropagation();showToast('♡','Added to wishlist!')" title="Wishlist">♡</button>
        </div>
      </div>
      <div class="prod-info">
        <div class="prod-cat">${p.cat}</div>
        <div class="prod-name">${p.name}</div>
        <div class="prod-bottom">
          <div class="prod-price-block">
            <span class="price">₹${p.price.toLocaleString('en-IN')}</span>
            ${p.oldPrice ? `<span class="old-price">₹${p.oldPrice.toLocaleString('en-IN')}</span>` : ''}
          </div>
          <div class="rating">${stars}<span class="star-count">(${p.reviews})</span></div>
        </div>
      </div>
    </div>`;
}

/* ══════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════ */
function setupReveal(){
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('on'); obs.unobserve(e.target); }});
  }, {threshold:.1});
  document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
}

/* ── SHARED FOOTER TEMPLATE ── */
function renderFooter(containerId){
  const el = document.getElementById(containerId);
  if(!el) return;
  el.innerHTML = `
  <footer>
    <div class="footer-grid">
      <div>
        <div class="footer-brand-name">LUXE<span>.</span></div>
        <p class="footer-desc">Your one-stop destination for premium fashion, accessories, electronics and lifestyle products at the best prices.</p>
        <div class="footer-socials">
          <div class="fsoc">𝕏</div><div class="fsoc">📘</div><div class="fsoc">📷</div><div class="fsoc">▶️</div>
        </div>
      </div>
      <div>
        <div class="footer-col-title">Shop</div>
        <ul class="footer-links">
          <li><a href="index.html">Home</a></li>
          <li><a href="products.html">All Products</a></li>
          <li><a href="products.html?cat=fashion">Fashion</a></li>
          <li><a href="products.html?cat=accessories">Accessories</a></li>
          <li><a href="products.html?cat=electronics">Electronics</a></li>
        </ul>
      </div>
      <div>
        <div class="footer-col-title">Help</div>
        <ul class="footer-links">
          <li><a href="#">Shipping Info</a></li>
          <li><a href="#">Returns & Exchange</a></li>
          <li><a href="#">Size Guide</a></li>
          <li><a href="contact.html">Contact Support</a></li>
          <li><a href="#">FAQ</a></li>
        </ul>
      </div>
      <div>
        <div class="footer-col-title">Company</div>
        <ul class="footer-links">
          <li><a href="#">About Us</a></li>
          <li><a href="#">Careers</a></li>
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Terms of Service</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="footer-copy">© 2026 LUXE. All rights reserved.</div>
      <div class="footer-pay">
        <span class="pay-tag">UPI</span><span class="pay-tag">Visa</span>
        <span class="pay-tag">Mastercard</span><span class="pay-tag">Rupay</span><span class="pay-tag">COD</span>
      </div>
    </div>
  </footer>`;
}

/* ── SHARED NAV HTML ── */
function renderNav(activePage){
  const pages = [
    {href:'index.html',    id:'home',    label:'Home'},
    {href:'products.html', id:'products',label:'Products'},
    {href:'cart.html',     id:'cart',    label:'Cart'},
    {href:'contact.html',  id:'contact', label:'Contact'},
  ];
  const links = pages.map(p=>`
    <li><a href="${p.href}" class="${p.id===activePage?'active':''}">${p.label}</a></li>
  `).join('');
  return `
  <nav id="navbar">
    <a class="nav-logo" href="index.html">LUXE<span>.</span></a>
    <ul class="nav-links">${links}</ul>
    <div class="nav-right">
      <button class="icon-btn" onclick="showToast('🔍','Search coming soon')">🔍</button>
      <button class="icon-btn" onclick="showToast('♡','Added to wishlist!')">♡</button>
      <button class="icon-btn" onclick="openCart()" style="position:relative">
        🛒
        <span class="cart-dot" id="cartDot"></span>
      </button>
    </div>
  </nav>`;
}

/* ── SHARED CART SIDEBAR HTML ── */
function renderCartSidebarHTML(){
  return `
  <div class="cart-veil" id="cartVeil" onclick="closeCart()"></div>
  <div class="cart-panel" id="cartPanel">
    <div class="cart-top">
      <div class="cart-title">Cart <span id="cartCountLabel" style="font-size:13px;color:var(--muted);font-weight:400"></span></div>
      <button class="cart-close" onclick="closeCart()">✕</button>
    </div>
    <div class="cart-items-wrap" id="cartItemsWrap">
      <div class="cart-empty-state"><div class="cart-empty-icon">🛒</div><div class="cart-empty-txt">Your cart is empty</div></div>
    </div>
    <div class="cart-bot" id="cartBot" style="display:none">
      <div class="cart-subtotal-row"><span>Subtotal</span><span id="cartSubtotal">₹0</span></div>
      <div class="cart-subtotal-row"><span>Shipping</span><span style="color:var(--success)">Free</span></div>
      <div class="cart-total-row"><span>Total</span><span id="cartTotalAmt">₹0</span></div>
      <button class="btn-checkout" onclick="window.location='cart.html'">Checkout →</button>
      <button class="btn-continue" onclick="closeCart();window.location='products.html'">Continue Shopping</button>
    </div>
  </div>`;
}

/* ── TOAST HTML ── */
function renderToastHTML(){
  return `<div class="toast" id="toast"><span id="toastIcon"></span><span id="toastMsg"></span></div>`;
}

/* ══════════════════════════════════════
   CONTACT PAGE — GTM-instrumented form
   ──────────────────────────────────────
   All meaningful user interactions push
   events to window.dataLayer so GTM can
   fire GA4 events, pixels, or any tag.

   Events pushed:
     form_start         – first field interaction
     form_field_complete – a required field passes validation
     form_field_error   – a field fails validation (on blur)
     form_submit        – button clicked (before validation)
     form_validation_error – validation failed; lists bad fields
     form_success       – submission confirmed (simulated send)
══════════════════════════════════════ */

/* ── Safe dataLayer push helper ── */
function dlPush(eventData) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(eventData);
}

/* ── Shared form metadata (reused in every push) ── */
function formMeta() {
  const form = document.getElementById('contact-form');
  return {
    form_id:       form ? form.getAttribute('data-gtm-form-id')       : 'contact_form',
    form_name:     form ? form.getAttribute('data-gtm-form-name')     : 'Contact Us',
    form_location: form ? form.getAttribute('data-gtm-form-location') : 'contact_page',
  };
}

/* ── Form validation rules ── */
const CONTACT_CHECKS = [
  { id:'fname',    fgId:'fg-fname',    validate: v => v.trim().length >= 2,                  field:'first_name' },
  { id:'lname',    fgId:'fg-lname',    validate: v => v.trim().length >= 2,                  field:'last_name'  },
  { id:'cemail',   fgId:'fg-email',    validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), field:'email'      },
  { id:'csubject', fgId:'fg-subject',  validate: v => v !== '',                              field:'subject'    },
  { id:'cmsg',     fgId:'fg-msg',      validate: v => v.trim().length >= 10,                 field:'message'    },
];

/* ── Track whether form_start has been pushed already ── */
let _formStarted = false;

/* ── Live validation + field-level GTM events ── */
function attachLiveValidation() {
  CONTACT_CHECKS.forEach(c => {
    const el = document.getElementById(c.id);
    const fg = document.getElementById(c.fgId);
    if (!el || !fg) return;

    /* form_start — fires once on the very first interaction */
    el.addEventListener('focus', () => {
      if (!_formStarted) {
        _formStarted = true;
        dlPush({
          event:          'form_start',
          ...formMeta(),
          form_field_name: c.field,
        });
      }
    }, { once: false });

    /* live visual feedback as user types */
    el.addEventListener('input', () => {
      const ok = c.validate(el.value);
      el.classList.toggle('error',    !ok && el.value !== '');
      fg.classList.toggle('has-error',!ok && el.value !== '');
    });

    /* form_field_complete / form_field_error on blur */
    el.addEventListener('blur', () => {
      if (el.value === '') return;           // skip untouched optional fields
      const ok = c.validate(el.value);
      if (ok) {
        dlPush({
          event:           'form_field_complete',
          ...formMeta(),
          form_field_name:  c.field,
        });
      } else {
        dlPush({
          event:           'form_field_error',
          ...formMeta(),
          form_field_name:  c.field,
          error_message:    fg.querySelector('.error-msg')
                              ? fg.querySelector('.error-msg').textContent.trim()
                              : 'Validation error',
        });
      }
    });
  });
}

/* ── Submit handler — full GTM instrumentation ── */
function submitContactForm(e) {
  /* Prevent native form submission — we handle everything in JS */
  if (e) e.preventDefault();

  /* ── Push form_submit immediately on click ── */
  dlPush({
    event: 'form_submit',
    ...formMeta(),
  });

  /* ── Run validation ── */
  let valid = true;
  const errorFields = [];

  CONTACT_CHECKS.forEach(c => {
    const el = document.getElementById(c.id);
    const fg = document.getElementById(c.fgId);
    if (!el || !fg) return;
    const ok = c.validate(el.value);
    el.classList.toggle('error',    !ok);
    fg.classList.toggle('has-error',!ok);
    if (!ok) {
      valid = false;
      errorFields.push(c.field);
    }
  });

  /* ── Validation failed ── */
  if (!valid) {
    dlPush({
      event:               'form_validation_error',
      ...formMeta(),
      error_fields:         errorFields,          // array of field names
      error_fields_count:   errorFields.length,
    });
    showToast('❌', 'Please fill in all required fields.');
    return;
  }

  /* ── Validation passed — start simulated send ── */
  const btn  = document.getElementById('formSubmitBtn');
  const text = document.getElementById('submitText');
  if (!btn || !text) return;

  btn.disabled = true;
  text.textContent = 'Sending…';

  /* Simulate async send (replace setTimeout with real fetch/XHR in production) */
  setTimeout(() => {
    btn.disabled = false;
    text.textContent = 'Send Message →';

    /* Reveal success banner */
    const successMsg = document.getElementById('successMsg');
    if (successMsg) successMsg.classList.add('show');

    /* ── form_success — the key conversion event for GTM ── */
    dlPush({
      event:           'form_success',
      ...formMeta(),
      /* Non-PII subject value so you can segment in GA4 */
      form_subject:    document.getElementById('csubject')
                         ? document.getElementById('csubject').value
                         : '',
    });

    /* Clear all fields and reset tracking flag */
    CONTACT_CHECKS.forEach(c => {
      const el = document.getElementById(c.id);
      if (el) { el.value = ''; el.classList.remove('error'); }
      const fg = document.getElementById(c.fgId);
      if (fg) fg.classList.remove('has-error');
    });
    _formStarted = false;

    showToast('✅', 'Message sent successfully!');
  }, 1800);
}

/* ── FAQ accordion ── */
function toggleFaq(el) {
  document.querySelectorAll('.faq-item.open').forEach(item => {
    if (item !== el) item.classList.remove('open');
  });
  el.classList.toggle('open');
}

function initFaq() {
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => toggleFaq(item));
  });
}

/* ══════════════════════════════════════
   INIT — runs on every page load
══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. Mount shared chrome for ALL pages ── */
  const navEl   = document.getElementById('navMount');
  const cartEl  = document.getElementById('cartSidebarMount');
  const toastEl = document.getElementById('toastMount');
  const footEl  = document.getElementById('footerMount');

  /* Detect which page we're on by filename */
  const page = location.pathname.split('/').pop().replace('.html','') || 'index';
  const activeKey = page === 'index' || page === '' ? 'home'
                  : page === 'product-detail'       ? 'products'
                  : page;                             /* products | cart | contact */

  if (navEl)   navEl.innerHTML   = renderNav(activeKey);
  if (cartEl)  cartEl.innerHTML  = renderCartSidebarHTML();
  if (toastEl) toastEl.innerHTML = renderToastHTML();
  if (footEl)  renderFooter('footerMount');

  /* ── 2. Cart UI (needs #cartDot injected above) ── */
  updateCartDot();
  renderCartSidebar();

  /* ── 3. Scroll reveal ── */
  setupReveal();

  /* ── 4. Contact-page extras ── */
  if (document.getElementById('contactPageMount')) {
    attachLiveValidation();
    initFaq();

    /* Listen on the <form> submit event (fires for both button click
       and Enter-key submission) so e.preventDefault() can block
       native navigation. GTM's Form Submit trigger also fires here. */
    const form = document.getElementById('contact-form');
    if (form) form.addEventListener('submit', submitContactForm);
  }
});
