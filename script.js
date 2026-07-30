/* ============================================================
   THE FLAVOR HOUSE — script.js (shared across index.html & menu.html)
   Vanilla JS only — no external frameworks.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const WHATSAPP_NUMBER = '916005640160';
  const CART_KEY = 'flavorhouse_cart';

  /* ---------------------------------------------------------
     FOOTER YEAR
  --------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     PRELOADER
  --------------------------------------------------------- */
  const preloader = document.getElementById('preloader');
  function hidePreloader() {
    if (preloader) preloader.classList.add('hide');
  }
  window.addEventListener('load', () => setTimeout(hidePreloader, 500));
  setTimeout(hidePreloader, 3000); // safety fallback

  /* ---------------------------------------------------------
     NAVBAR SCROLL STATE
  --------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  function onScrollNav() {
    if (window.scrollY > 30) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
  if (navbar) {
    window.addEventListener('scroll', onScrollNav, { passive: true });
    onScrollNav();
  }

  /* ---------------------------------------------------------
     MOBILE HAMBURGER MENU (auto-close on link tap)
  --------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navOverlay = document.getElementById('navOverlay');

  function openNav() {
    hamburger.classList.add('open');
    navMenu.classList.add('active');
    navOverlay.classList.add('active');
  }
  function closeNav() {
    hamburger.classList.remove('open');
    navMenu.classList.remove('active');
    navOverlay.classList.remove('active');
  }
  if (hamburger && navMenu && navOverlay) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.contains('open') ? closeNav() : openNav();
    });
    navOverlay.addEventListener('click', closeNav);
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeNav);
    });
  }

  /* ---------------------------------------------------------
     SMOOTH SCROLL WITH NAVBAR OFFSET (same-page anchors only)
  --------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = window.innerWidth < 720 ? 68 : 86;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---------------------------------------------------------
     SCROLL REVEAL ANIMATIONS
  --------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------------------------------------------------------
     HERO BACKGROUND SLIDER (fade, every 4s) — index.html only
  --------------------------------------------------------- */
  const heroSlides = document.querySelectorAll('.hero-slide');
  if (heroSlides.length) {
    let heroIndex = 0;
    setInterval(() => {
      heroSlides[heroIndex].classList.remove('active');
      heroIndex = (heroIndex + 1) % heroSlides.length;
      heroSlides[heroIndex].classList.add('active');
    }, 4000);
  }

  /* ---------------------------------------------------------
     FEATURED DISHES CAROUSEL (native scroll + arrows)
  --------------------------------------------------------- */
  const dishTrack = document.getElementById('dishTrack');
  const dishPrev = document.getElementById('dishPrev');
  const dishNext = document.getElementById('dishNext');
  if (dishTrack && dishPrev && dishNext) {
    const scrollByCard = () => {
      const card = dishTrack.querySelector('.dish-card');
      return card ? card.getBoundingClientRect().width + 26 : 320;
    };
    dishPrev.addEventListener('click', () => dishTrack.scrollBy({ left: -scrollByCard(), behavior: 'smooth' }));
    dishNext.addEventListener('click', () => dishTrack.scrollBy({ left: scrollByCard(), behavior: 'smooth' }));
  }

  /* ---------------------------------------------------------
     INTERIOR GALLERY CAROUSEL
     (autoplay, arrows, dots, infinite loop, touch swipe, lightbox)
  --------------------------------------------------------- */
  const galleryTrack = document.getElementById('galleryTrack');
  const galleryPrev = document.getElementById('galleryPrev');
  const galleryNext = document.getElementById('galleryNext');
  const galleryDotsWrap = document.getElementById('galleryDots');

  if (galleryTrack) {
    const slides = Array.from(galleryTrack.children);
    let gIndex = 0;
    let gTimer;

    // Build dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Go to image ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      galleryDotsWrap.appendChild(dot);
    });
    const dots = Array.from(galleryDotsWrap.children);

    function update() {
      galleryTrack.style.transform = `translateX(-${gIndex * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === gIndex));
    }
    function goTo(i) {
      gIndex = (i + slides.length) % slides.length;
      update();
      resetAutoplay();
    }
    function next() { goTo(gIndex + 1); }
    function prev() { goTo(gIndex - 1); }

    function resetAutoplay() {
      clearInterval(gTimer);
      gTimer = setInterval(next, 5000);
    }

    galleryNext.addEventListener('click', next);
    galleryPrev.addEventListener('click', prev);
    resetAutoplay();

    // Touch swipe
    let touchStartX = 0;
    galleryTrack.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    galleryTrack.addEventListener('touchend', (e) => {
      const delta = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) > 50) delta < 0 ? next() : prev();
    }, { passive: true });

    // Lightbox
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    slides.forEach(slide => {
      const img = slide.querySelector('img');
      img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
      });
    });
    if (lightboxClose) {
      lightboxClose.addEventListener('click', () => lightbox.classList.remove('active'));
      lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('active'); });
    }
  }

  /* ---------------------------------------------------------
     TOAST
  --------------------------------------------------------- */
  const toast = document.getElementById('toast');
  let toastTimer;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('active');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('active'), 2200);
  }

  /* ---------------------------------------------------------
     CART SYSTEM (localStorage — shared across pages)
  --------------------------------------------------------- */
  function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch (e) { return []; }
  }
  function saveCart(cart) { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }

  function addToCart(id, name, price, img, qty) {
    qty = qty || 1;
    const cart = getCart();
    const existing = cart.find(i => i.id === id);
    if (existing) existing.qty += qty;
    else cart.push({ id, name, price, img, qty });
    saveCart(cart);
    renderCart();
    showToast(`${name} added to cart`);
  }
  function changeQty(id, delta) {
    const cart = getCart();
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    saveCart(cart.filter(i => i.qty > 0));
    renderCart();
  }
  function removeItem(id) {
    saveCart(getCart().filter(i => i.id !== id));
    renderCart();
  }
  function cartTotal(cart) { return cart.reduce((sum, i) => sum + i.price * i.qty, 0); }

  const cartBody = document.getElementById('cartBody');
  const cartEmpty = document.getElementById('cartEmpty');
  const cartTotalEl = document.getElementById('cartTotal');
  const cartBadge = document.getElementById('cartBadge');

  function renderCart() {
    if (!cartBody) return;
    const cart = getCart();
    cartBody.querySelectorAll('.cart-item').forEach(el => el.remove());

    if (cart.length === 0) {
      if (cartEmpty) cartEmpty.style.display = 'block';
    } else {
      if (cartEmpty) cartEmpty.style.display = 'none';
      cart.forEach(item => {
        const row = document.createElement('div');
        row.className = 'cart-item';
        row.innerHTML = `
          <img src="${item.img}" alt="${item.name}">
          <div class="cart-item-info">
            <h5>${item.name}</h5>
            <span>₹${item.price} × ${item.qty} = ₹${item.price * item.qty}</span>
            <div class="cart-qty">
              <button type="button" data-action="dec" aria-label="Decrease">&minus;</button>
              <span>${item.qty}</span>
              <button type="button" data-action="inc" aria-label="Increase">&plus;</button>
            </div>
            <button type="button" class="cart-remove" data-action="remove">Remove</button>
          </div>
        `;
        row.querySelector('[data-action="inc"]').addEventListener('click', () => changeQty(item.id, 1));
        row.querySelector('[data-action="dec"]').addEventListener('click', () => changeQty(item.id, -1));
        row.querySelector('[data-action="remove"]').addEventListener('click', () => removeItem(item.id));
        cartBody.appendChild(row);
      });
    }

    const total = cartTotal(cart);
    if (cartTotalEl) cartTotalEl.textContent = `₹${total}`;
    if (cartBadge) cartBadge.textContent = cart.reduce((sum, i) => sum + i.qty, 0);
  }
  renderCart();

  // Bind Add to Cart buttons (home carousel + menu grid)
  document.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', () => {
      const { id, name, price, img } = btn.dataset;
      const stepper = document.querySelector(`.qty-stepper[data-id="${id}"]`);
      const qty = stepper ? parseInt(stepper.querySelector('.qty-val').textContent, 10) : 1;
      addToCart(id, name, parseInt(price, 10), img, qty);
      btn.classList.add('added');
      setTimeout(() => btn.classList.remove('added'), 700);
      if (stepper) stepper.querySelector('.qty-val').textContent = '1';
    });
  });

  // Quantity steppers (menu.html)
  document.querySelectorAll('.qty-stepper').forEach(stepper => {
    const valEl = stepper.querySelector('.qty-val');
    stepper.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        let val = parseInt(valEl.textContent, 10);
        if (btn.dataset.action === 'inc') val += 1;
        else val = Math.max(1, val - 1);
        valEl.textContent = val;
      });
    });
  });

  /* ---------------------------------------------------------
     CART SIDEBAR TOGGLE
  --------------------------------------------------------- */
  const cartSidebar = document.getElementById('cartSidebar');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartFloat = document.getElementById('cartFloat');
  const cartClose = document.getElementById('cartClose');

  function openCart() { cartSidebar.classList.add('active'); cartOverlay.classList.add('active'); }
  function closeCart() { cartSidebar.classList.remove('active'); cartOverlay.classList.remove('active'); }
  if (cartFloat) cartFloat.addEventListener('click', openCart);
  if (cartClose) cartClose.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  /* ---------------------------------------------------------
     CHECKOUT MODAL + WHATSAPP MESSAGE
  --------------------------------------------------------- */
  const checkoutOpen = document.getElementById('checkoutOpen');
  const checkoutOverlay = document.getElementById('checkoutOverlay');
  const checkoutModal = document.getElementById('checkoutModal');
  const checkoutClose = document.getElementById('checkoutClose');
  const checkoutForm = document.getElementById('checkoutForm');

  function openCheckout() {
    if (getCart().length === 0) { showToast('Your cart is empty'); return; }
    closeCart();
    checkoutOverlay.classList.add('active');
    checkoutModal.classList.add('active');
  }
  function closeCheckout() {
    checkoutOverlay.classList.remove('active');
    checkoutModal.classList.remove('active');
  }
  if (checkoutOpen) checkoutOpen.addEventListener('click', openCheckout);
  if (checkoutOverlay) checkoutOverlay.addEventListener('click', closeCheckout);
  if (checkoutClose) checkoutClose.addEventListener('click', closeCheckout);

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('custName').value.trim();
      const phone = document.getElementById('custPhone').value.trim();
      const address = document.getElementById('custAddress').value.trim();
      const notes = document.getElementById('custNotes').value.trim();

      if (!name || !phone || !address) { showToast('Please fill in all required fields'); return; }

      const cart = getCart();
      if (cart.length === 0) { showToast('Your cart is empty'); return; }

      let msg = `THE FLAVOR HOUSE\n\n`;
      msg += `Customer Name: ${name}\n`;
      msg += `Phone: ${phone}\n`;
      msg += `Address: ${address}\n\n`;
      msg += `Order:\n`;
      cart.forEach(item => { msg += `${item.name} ×${item.qty}\n`; });
      msg += `\nTotal ₹${cartTotal(cart)}\n`;
      msg += `\nSpecial Instructions: ${notes ? notes : 'None'}`;

      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
      closeCheckout();
      checkoutForm.reset();
    });
  }

  /* ---------------------------------------------------------
     SCROLL TO TOP BUTTON
  --------------------------------------------------------- */
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('show', window.scrollY > 500);
    }, { passive: true });
    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------------------------------------------------------
     ESCAPE KEY CLOSES OVERLAYS
  --------------------------------------------------------- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeNav();
      closeCart();
      closeCheckout();
      const lb = document.getElementById('lightbox');
      if (lb) lb.classList.remove('active');
    }
  });

});
