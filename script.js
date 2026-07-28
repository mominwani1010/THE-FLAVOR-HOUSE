/* ==========================================================================
   THE FLAVOR HOUSE - MAIN SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. DATA DIRECTORY (Full Menu Items) ---
    const menuData = [
        {
            id: 'm1',
            name: 'Royal Butter Chicken',
            category: 'mains',
            price: 450,
            image: 'images/Butter chicken.png',
            description: 'Tender chicken simmered in rich velvety tomato, butter, and cashew cream sauce.'
        },
        {
            id: 'm2',
            name: 'Gourmet Flavor Burger',
            category: 'fastfood',
            price: 280,
            image: 'images/burger.png',
            description: 'Artisanal brioche bun, double grilled patty, aged cheddar, and house special sauce.'
        },
        {
            id: 'm3',
            name: 'Special Wok Fried Rice',
            category: 'mains',
            price: 240,
            image: 'images/fried rice.png',
            description: 'Aromatic basmati rice toss-fried with fresh farm vegetables and exotic Asian spices.'
        },
        {
            id: 'm4',
            name: 'Truffle Crisp Fries',
            category: 'fastfood',
            price: 180,
            image: 'images/french fries.png',
            description: 'Golden crisp hand-cut potato fries lightly infused with truffle oil and rosemary.'
        },
        {
            id: 'm5',
            name: 'Royal Fruit Custard',
            category: 'desserts',
            price: 190,
            image: 'images/fruit custard.png',
            description: 'Chilled silky vanilla custard layered with fresh seasonal fruits and roasted nuts.'
        }
    ];

    // --- 2. PRELOADER & INITIAL ANIMATIONS ---
    const loader = document.getElementById('loader');
    const loaderBar = document.getElementById('loaderBar');

    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 15;
        if (loaderBar) loaderBar.style.width = `${progress}%`;

        if (progress >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => {
                if (loader) loader.classList.add('loaded');
                initGSAPAnimations();
            }, 300);
        }
    }, 60);

    // --- 3. NAVBAR SCROLL EFFECT & MOBILE HAMBURGER ---
    const navbar = document.getElementById('navbar');
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const navLinks = document.getElementById('navLinks');
    const navLinkItems = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', () => {
            hamburgerMenu.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            if (hamburgerMenu) hamburgerMenu.classList.remove('active');
            if (navLinks) navLinks.classList.remove('active');
        });
    });

    // --- 4. SWIPER JS 3D CAROUSEL ---
    const signatureSwiper = new Swiper('.signature-swiper', {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        loop: true,
        autoplay: {
            delay: 3500,
            disableOnInteraction: false,
        },
        coverflowEffect: {
            rotate: 20,
            stretch: 0,
            depth: 120,
            modifier: 1,
            slideShadows: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            320: { slidesPerView: 1, spaceBetween: 20 },
            640: { slidesPerView: 1.5, spaceBetween: 30 },
            1024: { slidesPerView: 2.5, spaceBetween: 40 }
        }
    });

    // --- 5. MENU SYSTEM (SEARCH & FILTER) ---
    const menuGrid = document.getElementById('menuGrid');
    const menuSearchInput = document.getElementById('menuSearchInput');
    const categoryFilters = document.getElementById('categoryFilters');

    function renderMenu(items) {
        if (!menuGrid) return;
        menuGrid.innerHTML = '';

        if (items.length === 0) {
            menuGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem;">No delicious dishes matched your search.</p>`;
            return;
        }

        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'menu-card';
            card.innerHTML = `
                <div class="menu-card-img-wrap">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                </div>
                <div class="menu-card-body">
                    <h3 class="menu-card-title">${item.name}</h3>
                    <p class="menu-card-desc">${item.description}</p>
                    <div class="menu-card-footer">
                        <span class="dish-price">₹${item.price}</span>
                        <button class="add-to-cart-btn magnetic-btn" 
                                data-id="${item.id}" 
                                data-name="${item.name}" 
                                data-price="${item.price}" 
                                data-image="${item.image}">
                            <i class="ri-add-line"></i> Add
                        </button>
                    </div>
                </div>
            `;
            menuGrid.appendChild(card);
        });

        attachAddToCartListeners();
    }

    // Initial Menu Render
    renderMenu(menuData);

    // Search Filtering
    if (menuSearchInput) {
        menuSearchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const activeCategoryBtn = categoryFilters.querySelector('.filter-btn.active');
            const activeCategory = activeCategoryBtn ? activeCategoryBtn.dataset.category : 'all';

            const filtered = menuData.filter(item => {
                const matchesSearch = item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query);
                const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
                return matchesSearch && matchesCategory;
            });

            renderMenu(filtered);
        });
    }

    // Category Buttons Filtering
    if (categoryFilters) {
        const filterBtns = categoryFilters.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const category = btn.dataset.category;
                const query = menuSearchInput ? menuSearchInput.value.toLowerCase().trim() : '';

                const filtered = menuData.filter(item => {
                    const matchesCategory = category === 'all' || item.category === category;
                    const matchesSearch = item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query);
                    return matchesCategory && matchesSearch;
                });

                renderMenu(filtered);
            });
        });
    }

    // --- 6. SHOPPING CART SYSTEM (LOCALSTORAGE) ---
    let cart = JSON.parse(localStorage.getItem('flavor_house_cart')) || [];

    const openCartBtn = document.getElementById('openCartBtn');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartTotalPrice = document.getElementById('cartTotalPrice');
    const cartBadgeCount = document.getElementById('cartBadgeCount');

    function toggleCart(open = true) {
        if (open) {
            cartOverlay.classList.add('active');
            cartSidebar.classList.add('active');
        } else {
            cartOverlay.classList.remove('active');
            cartSidebar.classList.remove('active');
        }
    }

    if (openCartBtn) openCartBtn.addEventListener('click', () => toggleCart(true));
    if (closeCartBtn) closeCartBtn.addEventListener('click', () => toggleCart(false));
    if (cartOverlay) cartOverlay.addEventListener('click', () => toggleCart(false));

    function saveCart() {
        localStorage.setItem('flavor_house_cart', JSON.stringify(cart));
        updateCartUI();
    }

    function addToCart(item) {
        const existing = cart.find(i => i.id === item.id);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ ...item, qty: 1 });
        }
        saveCart();
        toggleCart(true);
    }

    function updateCartUI() {
        if (!cartItemsContainer || !cartBadgeCount || !cartTotalPrice) return;

        cartItemsContainer.innerHTML = '';
        let total = 0;
        let count = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="cart-empty-text">Your cart is empty. Explore our signatures & menu!</p>';
        } else {
            cart.forEach(item => {
                total += item.price * item.qty;
                count += item.qty;

                const cartItemEl = document.createElement('div');
                cartItemEl.className = 'cart-item';
                cartItemEl.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">₹${item.price}</div>
                        <div class="cart-item-qty">
                            <button class="qty-btn dec-qty" data-id="${item.id}">-</button>
                            <span>${item.qty}</span>
                            <button class="qty-btn inc-qty" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <i class="ri-delete-bin-line cart-item-remove" data-id="${item.id}"></i>
                `;
                cartItemsContainer.appendChild(cartItemEl);
            });
        }

        cartTotalPrice.innerText = `₹${total}`;
        cartBadgeCount.innerText = count;

        const modalTotalPrice = document.getElementById('modalTotalPrice');
        if (modalTotalPrice) modalTotalPrice.innerText = `₹${total}`;

        attachCartControls();
    }

    function attachAddToCartListeners() {
        const addBtns = document.querySelectorAll('.add-to-cart-btn');
        addBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const item = {
                    id: btn.dataset.id,
                    name: btn.dataset.name,
                    price: parseFloat(btn.dataset.price),
                    image: btn.dataset.image
                };
                addToCart(item);
            });
        });
    }

    function attachCartControls() {
        const incBtns = document.querySelectorAll('.inc-qty');
        const decBtns = document.querySelectorAll('.dec-qty');
        const removeBtns = document.querySelectorAll('.cart-item-remove');

        incBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const item = cart.find(i => i.id === id);
                if (item) {
                    item.qty += 1;
                    saveCart();
                }
            });
        });

        decBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const item = cart.find(i => i.id === id);
                if (item) {
                    item.qty -= 1;
                    if (item.qty <= 0) {
                        cart = cart.filter(i => i.id !== id);
                    }
                    saveCart();
                }
            });
        });

        removeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                cart = cart.filter(i => i.id !== id);
                saveCart();
            });
        });
    }

    // Initialize Cart UI
    attachAddToCartListeners();
    updateCartUI();

    // --- 7. CHECKOUT & WHATSAPP INTEGRATION ---
    const checkoutModal = document.getElementById('checkoutModal');
    const openCheckoutBtn = document.getElementById('openCheckoutBtn');
    const closeCheckoutBtn = document.getElementById('closeCheckoutBtn');
    const checkoutForm = document.getElementById('checkoutForm');

    function toggleCheckout(open = true) {
        if (cart.length === 0 && open) {
            alert('Your cart is empty. Please add items before checking out.');
            return;
        }
        if (open) {
            toggleCart(false);
            checkoutModal.classList.add('active');
        } else {
            checkoutModal.classList.remove('active');
        }
    }

    if (openCheckoutBtn) openCheckoutBtn.addEventListener('click', () => toggleCheckout(true));
    if (closeCheckoutBtn) closeCheckoutBtn.addEventListener('click', () => toggleCheckout(false));

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('custName').value.trim();
            const phone = document.getElementById('custPhone').value.trim();
            const address = document.getElementById('custAddress').value.trim();
            const notes = document.getElementById('custNotes').value.trim() || 'None';

            let grandTotal = 0;
            let orderListText = '';

            cart.forEach((item, index) => {
                const itemTotal = item.price * item.qty;
                grandTotal += itemTotal;
                orderListText += `${index + 1}. *${item.name}* x ${item.qty} = ₹${itemTotal}\n`;
            });

            // Beautiful WhatsApp Formatting
            const message = `*NEW ORDER - THE FLAVOR HOUSE*%0A` +
                `-----------------------------------%0A` +
                `*Customer Name:* ${encodeURIComponent(name)}%0A` +
                `*Phone:* ${encodeURIComponent(phone)}%0A` +
                `*Delivery/Table:* ${encodeURIComponent(address)}%0A` +
                `*Special Notes:* ${encodeURIComponent(notes)}%0A` +
                `-----------------------------------%0A` +
                `*ORDER SUMMARY:*%0A${encodeURIComponent(orderListText)}` +
                `-----------------------------------%0A` +
                `*Grand Total:* ₹${grandTotal}%0A` +
                `-----------------------------------%0A` +
                `Thank you for dining with THE FLAVOR HOUSE!`;

            const whatsappUrl = `https://wa.me/916005640160?text=${message}`;

            // Reset cart
            cart = [];
            saveCart();
            toggleCheckout(false);

            // Redirect to WhatsApp
            window.open(whatsappUrl, '_blank');
        });
    }

    // --- 8. GSAP ANIMATIONS & SCROLL TRIGGER ---
    function initGSAPAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        // Hero Content Reveal
        gsap.from('.hero-subtitle', { opacity: 0, y: 30, duration: 1, delay: 0.2 });
        gsap.from('.hero-title', { opacity: 0, y: 40, duration: 1, delay: 0.4 });
        gsap.from('.hero-description', { opacity: 0, y: 30, duration: 1, delay: 0.6 });
        gsap.from('.hero-buttons', { opacity: 0, y: 30, duration: 1, delay: 0.8 });

        // Scroll Animations for Sections
        const sectionTitles = document.querySelectorAll('.section-title, .section-tag');
        sectionTitles.forEach(el => {
            gsap.from(el, {
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                },
                opacity: 0,
                y: 30,
                duration: 0.8,
            });
        });

        // About Grid Fade
        gsap.from('.about-text-content', {
            scrollTrigger: {
                trigger: '.about-section',
                start: 'top 75%',
            },
            opacity: 0,
            x: -40,
            duration: 1
        });

        gsap.from('.about-gallery-grid', {
            scrollTrigger: {
                trigger: '.about-section',
                start: 'top 75%',
            },
            opacity: 0,
            x: 40,
            duration: 1
        });

        // Chef Cards Parallax / Fade
        gsap.from('.chef-card', {
            scrollTrigger: {
                trigger: '.chefs-section',
                start: 'top 75%',
            },
            opacity: 0,
            y: 50,
            stagger: 0.3,
            duration: 1
        });
    }

});
