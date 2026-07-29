/* ============================================================
   THE FLAVOR HOUSE — script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const WHATSAPP_NUMBER = '916005640160';

  /* ---------------------------------------------------------
     PRELOADER
  --------------------------------------------------------- */
  const preloader = document.getElementById('preloader');
  const preloaderLine = document.querySelector('.preloader-line span');
  if (preloaderLine && window.gsap) {
    gsap.to(preloaderLine, { width: '100%', duration: 1.4, ease: 'power2.inOut' });
  }
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (preloader) preloader.classList.add('loaded');
      document.body.style.overflow = '';
      runHeroReveal();
    }, 900);
  });
  // Safety fallback in case 'load' never fires quickly
  setTimeout(() => {
    if (preloader && !preloader.classList.contains('loaded')) {
      preloader.classList.add('loaded');
      runHeroReveal();
    }
  }, 3500);

  /* ---------------------------------------------------------
     FOOTER YEAR
  --------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     NAVBAR SCROLL STATE
  --------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------------------------------------------------
     MOBILE MENU
  --------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileOverlay = document.getElementById('mobileOverlay');

  function openMobileMenu() {
    hamburger.classList.add('open');
    mobileMenu.classList.add('active');
    mobileOverlay.classList.add('active');
  }
  function closeMobileMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('active');
    mobileOverlay.classList.remove('active');
  }
  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
  });
  mobileOverlay.addEventListener('click', closeMobileMenu);
  document.querySelectorAll('.mobile-links a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  /* ---------------------------------------------------------
     SMOOTH ANCHOR OFFSET (account for fixed navbar)
  --------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = window.innerWidth < 720 ? 70 : 90;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---------------------------------------------------------
     MAGNETIC BUTTONS + CURSOR (desktop only)
  --------------------------------------------------------- */
  const isFinePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  const dot = document.getElementById('magnetDot');

  if (isFinePointer && dot) {
    window.addEventListener('mousemove', (e) => {
      dot.style.left = e.clientX + 'px';
      dot.style.top = e.clientY + 'px';
    });

    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
      el.addEventListener('mouseenter', () => { dot.style.width = '26px'; dot.style.height = '26px'; });
      el.addEventListener('mouseleave', () => { dot.style.width = '10px'; dot.style.height = '10px'; });
    });
  }

  /* ---------------------------------------------------------
     HERO REVEAL + PARALLAX
  --------------------------------------------------------- */
  function runHeroReveal() {
    if (!window.gsap) return;
    gsap.from('.reveal-inner', {
      yPercent: 110,
      duration: 1.1,
      ease: 'power4.out',
      stagger: 0.12
    });
    gsap.from('.hero .reveal-up', {
      opacity: 0,
      y: 24,
      duration: 1,
      delay: 0.5,
      stagger: 0.15,
      ease: 'power3.out'
    });
  }

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    // Hero background parallax
    gsap.to('#heroBg', {
      yPercent: 12,
      scale: 1.05,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });

    // Generic scroll reveals
    const revealTargets = [
      '.welcome .eyebrow', '.welcome .section-title', '.welcome-copy', '.welcome-stats',
      '.dishes .section-head', '.chefs .section-head', '.about .section-head',
      '.menu .section-head', '.contact .section-head'
    ];
    revealTargets.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        gsap.from(el, {
          opacity: 0, y: 40, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' }
        });
      });
    });

    gsap.utils.toArray('.dish-card').forEach((card, i) => {
      gsap.from(card, {
        opacity: 0, y: 60, duration: 0.8, ease: 'power3.out', delay: (i % 3) * 0.08,
        scrollTrigger: { trigger: card, start: 'top 90%' }
      });
    });

    gsap.utils.toArray('.chef-card').forEach((card, i) => {
      gsap.from(card, {
        opacity: 0, y: 50, duration: 0.9, ease: 'power3.out', delay: i * 0.15,
        scrollTrigger: { trigger: card, start: 'top 88%' }
      });
    });

    gsap.utils.toArray('.gallery-item').forEach((item, i) => {
      gsap.from(item, {
        opacity: 0, scale: 0.9, duration: 0.7, ease: 'power3.out', delay: (i % 4) * 0.06,
        scrollTrigger: { trigger: item, start: 'top 92%' }
      });
    });

    gsap.utils.toArray('.menu-card').forEach((card, i) => {
      gsap.from(card, {
        opacity: 0, y: 30, duration: 0.6, ease: 'power3.out', delay: (i % 3) * 0.06,
        scrollTrigger: { trigger: card, start: 'top 94%' }
      });
    });

    gsap.from('.contact-info', {
      opacity: 0, x: -30, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '.contact-grid', start: 'top 85%' }
    });
    gsap.from('.contact-map', {
      opacity: 0, x: 30, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '.contact-grid', start: 'top 85%' }
    });

    // Stat counters
    document.querySelectorAll('.stat-num').forEach(el => {
      const target = parseInt(el.dataset.count, 10) || 0;
      ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: 1.6,
            ease: 'power2.out',
            onUpdate: () => { el.textContent = Math.round(obj.val); }
          });
        }
      });
    });
  }

  /* ---------------------------------------------------------
     SWIPER — SIGNATURE DISHES
  --------------------------------------------------------- */
  if (window.Swiper) {
    new Swiper('.dishSwiper', {
      loop: true,
      grabCursor: true,
      autoplay: { delay: 3800, disableOnInteraction: false },
      spaceBetween: 26,
      slidesPerView: 1.05,
      centeredSlides: false,
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: { nextEl: '.swiper-next-custom', prevEl: '.swiper-prev-custom' },
      breakpoints: {
        640: { slidesPerView: 1.6, spaceBetween: 24 },
        900: { slidesPerView: 2.2, spaceBetween: 28 },
        1200: { slidesPerView: 3, spaceBetween: 30 }
      }
    });
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
    toastTimer = setTimeout(() => toast.classList.remove('active'), 2400);
  }

  /* ---------------------------------------------------------
     CART SYSTEM (localStorage)
  --------------------------------------------------------- */
  const CART_KEY = 'flavorhouse_cart';

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (e) {
      return [];
    }
  }
  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  function addToCart(name, price, img) {
    const cart = getCart();
    const existing = cart.find(item => item.name === name);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ name, price, img, qty: 1 });
    }
    saveCart(cart);
    renderCart();
    showToast(`${name} added to cart`);
  }

  function updateQty(name, delta) {
    const cart = getCart();
    const item = cart.find(i => i.name === name);
    if (!item) return;
    item.qty += delta;
    const updated = cart.filter(i => i.qty > 0);
    saveCart(updated);
    renderCart();
  }

  function removeFromCart(name) {
    const cart = getCart().filter(i => i.name !== name);
    saveCart(cart);
    renderCart();
  }

  function cartTotal(cart) {
    return cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  }

  const cartItemsEl = document.getElementById('cartItems');
  const cartEmptyMsg = document.getElementById('cartEmptyMsg');
  const cartTotalEl = document.getElementById('cartTotal');
  const cartCountEl = document.getElementById('cartCount');

  function renderCart() {
    const cart = getCart();

    cartItemsEl.querySelectorAll('.cart-item').forEach(el => el.remove());

    if (cart.length === 0) {
      cartEmptyMsg.style.display = 'block';
    } else {
      cartEmptyMsg.style.display = 'none';
      cart.forEach(item => {
        const row = document.createElement('div');
        row.className = 'cart-item';
        row.innerHTML = `
          <img src="${item.img}" alt="${item.name}">
          <div class="cart-item-info">
            <h5>${item.name}</h5>
            <span>₹${item.price} × ${item.qty} = ₹${item.price * item.qty}</span>
            <div class="qty-controls">
              <button type="button" data-action="dec" aria-label="Decrease quantity">&minus;</button>
              <span>${item.qty}</span>
              <button type="button" data-action="inc" aria-label="Increase quantity">&plus;</button>
            </div>
          </div>
          <button type="button" class="cart-remove" data-action="remove">Remove</button>
        `;
        row.querySelector('[data-action="inc"]').addEventListener('click', () => updateQty(item.name, 1));
        row.querySelector('[data-action="dec"]').addEventListener('click', () => updateQty(item.name, -1));
        row.querySelector('[data-action="remove"]').addEventListener('click', () => removeFromCart(item.name));
        cartItemsEl.appendChild(row);
      });
    }

    const total = cartTotal(cart);
    cartTotalEl.textContent = `₹${total}`;
    const count = cart.reduce((sum, i) => sum + i.qty, 0);
    cartCountEl.textContent = count;
  }

  // Bind add-to-cart buttons (both slider + menu grid)
  document.querySelectorAll('.btn-add, .btn-add-sm').forEach(btn => {
    btn.addEventListener('click', () => {
      const { name, price, img } = btn.dataset;
      addToCart(name, parseInt(price, 10), img);
      btn.classList.add('added');
      setTimeout(() => btn.classList.remove('added'), 700);
    });
  });

  renderCart();

  /* ---------------------------------------------------------
     CART DRAWER
  --------------------------------------------------------- */
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartToggle = document.getElementById('cartToggle');
  const cartClose = document.getElementById('cartClose');

  function openCart() {
    cartDrawer.classList.add('active');
    cartOverlay.classList.add('active');
  }
  function closeCart() {
    cartDrawer.classList.remove('active');
    cartOverlay.classList.remove('active');
  }
  cartToggle.addEventListener('click', openCart);
  cartClose.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  /* ---------------------------------------------------------
     CHECKOUT MODAL
  --------------------------------------------------------- */
  const checkoutBtn = document.getElementById('checkoutBtn');
  const checkoutOverlay = document.getElementById('checkoutOverlay');
  const checkoutModal = document.getElementById('checkoutModal');
  const checkoutClose = document.getElementById('checkoutClose');
  const checkoutForm = document.getElementById('checkoutForm');
  const reserveBtn = document.getElementById('reserveBtn');

  function openCheckout() {
    if (getCart().length === 0) {
      showToast('Your cart is empty — add a dish first');
      return;
    }
    closeCart();
    checkoutOverlay.classList.add('active');
    checkoutModal.classList.add('active');
  }
  function closeCheckout() {
    checkoutOverlay.classList.remove('active');
    checkoutModal.classList.remove('active');
  }
  checkoutBtn.addEventListener('click', openCheckout);
  checkoutOverlay.addEventListener('click', closeCheckout);
  checkoutClose.addEventListener('click', closeCheckout);

  if (reserveBtn) {
    reserveBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (getCart().length === 0) {
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi! I would like to place an order at The Flavor House.')}`, '_blank');
      } else {
        openCheckout();
      }
    });
  }

  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const address = document.getElementById('custAddress').value.trim();
    const notes = document.getElementById('custNotes').value.trim();

    if (!name || !phone || !address) {
      showToast('Please fill in all required fields');
      return;
    }

    const cart = getCart();
    if (cart.length === 0) {
      showToast('Your cart is empty');
      return;
    }

    let message = `*New Order — The Flavor House*\n\n`;
    message += `*Customer:* ${name}\n`;
    message += `*Phone:* ${phone}\n`;
    message += `*Address:* ${address}\n`;
    if (notes) message += `*Special Instructions:* ${notes}\n`;
    message += `\n*Order Summary:*\n`;
    cart.forEach(item => {
      message += `• ${item.name} × ${item.qty} — ₹${item.price * item.qty}\n`;
    });
    message += `\n*Total: ₹${cartTotal(cart)}*\n\n`;
    message += `Thank you for choosing The Flavor House — Where Every Bite Tells a Story.`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');

    closeCheckout();
    checkoutForm.reset();
  });

  /* ---------------------------------------------------------
     MENU — SEARCH + CATEGORY FILTER
  --------------------------------------------------------- */
  const menuSearch = document.getElementById('menuSearch');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const menuCards = document.querySelectorAll('.menu-card');
  const menuEmpty = document.getElementById('menuEmpty');
  let activeFilter = 'all';

  function applyMenuFilters() {
    const query = menuSearch.value.trim().toLowerCase();
    let visibleCount = 0;

    menuCards.forEach(card => {
      const matchesCategory = activeFilter === 'all' || card.dataset.category === activeFilter;
      const matchesSearch = card.dataset.name.includes(query);
      const show = matchesCategory && matchesSearch;
      card.style.display = show ? '' : 'none';
      if (show) visibleCount++;
    });

    menuEmpty.style.display = visibleCount === 0 ? 'block' : 'none';
  }

  menuSearch.addEventListener('input', applyMenuFilters);
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      applyMenuFilters();
    });
  });

  /* ---------------------------------------------------------
     ESCAPE KEY CLOSES ANY OVERLAY
  --------------------------------------------------------- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
      closeCart();
      closeCheckout();
    }
  });

});
