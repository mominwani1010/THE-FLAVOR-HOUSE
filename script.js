/* ==========================================================================
   THE FLAVOR HOUSE - ROBUST PRODUCTION SCRIPT
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

    // --- 2. FAIL-SAFE PRELOADER SYSTEM ---
    const initPreloader = () => {
        try {
            const loader = document.getElementById('loader');
            const loaderBar = document.getElementById('loaderBar');

            if (!loader) return;

            let isDismissed = false;

            const dismissLoader = () => {
                if (isDismissed) return;
                isDismissed = true;
                loader.classList.add('loaded');
                initGSAPAnimations();
            };

            // Hard safety timeout: loader WILL disappear after 2.5s no matter what happens
            const fallbackTimeout = setTimeout(dismissLoader, 2500);

            // Progressive bar animation
            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += 20;
                if (loaderBar) loaderBar.style.width = `${progress}%`;

                if (progress >= 100) {
                    clearInterval(progressInterval);
                    clearTimeout(fallbackTimeout);
                    setTimeout(dismissLoader, 200);
                }
            }, 50);

        } catch (err) {
            console.warn('Preloader encountered an issue, force-hiding:', err);
            const loader = document.getElementById('loader');
            if (loader) loader.classList.add('loaded');
        }
    };

    // --- 3. NAVBAR & MOBILE NAVIGATION ---
    const initNavigation = () => {
        try {
            const navbar = document.getElementById('navbar');
            const hamburgerMenu = document.getElementById('hamburgerMenu');
            const navLinks = document.getElementById('navLinks');
            const navLinkItems = document.querySelectorAll('.nav-link');

            if (navbar) {
                window.addEventListener('scroll', () => {
                    if (window.scrollY > 50) {
                        navbar.classList.add('scrolled');
                    } else {
                        navbar.classList.remove('scrolled');
                    }
                }, { passive: true });
            }

            if (hamburgerMenu && navLinks) {
                hamburgerMenu.addEventListener('click', () => {
                    hamburgerMenu.classList.toggle('active');
                    navLinks.classList.toggle('active');
                });

                navLinkItems.forEach(link => {
                    link.addEventListener('click', () => {
                        hamburgerMenu.classList.remove('active');
                        navLinks.classList.remove('active');
                    });
                });
            }
        } catch (err) {
            console.warn('Navigation setup issue:', err);
        }
    };

    // --- 4. SAFE SWIPER CAROUSEL INITIALIZATION ---
    const initSwiper = () => {
        try {
            if (typeof Swiper === 'undefined') {
                console.warn('Swiper library not loaded. Carousel skipped.');
                return;
            }

            const swiperContainer = document.querySelector('.signature-swiper');
            if (!swiperContainer) return;

            new Swiper('.signature-swiper', {
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
        } catch (err) {
            console.warn('Swiper initialization issue:', err);
        }
    };

    // --- 5. INTERACTIVE MENU SYSTEM ---
    const initMenuSystem = () => {
        try {
            const menuGrid = document.getElementById('menuGrid');
            const menuSearchInput = document.getElementById('menuSearchInput');
            const categoryFilters = document.getElementById('categoryFilters');

            const renderMenu = (items) => {
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
            };

            // Initial Menu Render
            renderMenu(menuData);

            // Search Filter Listener
            if (menuSearchInput) {
                menuSearchInput.addEventListener('input', (e) => {
                    const query = e.target.value.toLowerCase().trim();
                    const activeCategoryBtn = categoryFilters ? categoryFilters.querySelector('.filter-btn.active') : null;
                    const activeCategory = activeCategoryBtn ? activeCategoryBtn.dataset.category : 'all';

                    const filtered = menuData.filter(item => {
                        const matchesSearch = item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query);
                        const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
                        return matchesSearch && matchesCategory;
                    });

                    renderMenu(filtered);
                });
            }

            // Category Filters Listener
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
        } catch (err) {
            console.warn('Menu rendering issue:', err);
        }
    };

    // --- 6. SHOPPING CART & LOCAL STORAGE ---
    let cart = [];
    try {
        const storedCart = localStorage.getItem('flavor_house_cart');
        if (storedCart) cart = JSON.parse(storedCart);
    } catch (e) {
        cart = [];
    }

    const toggleCart = (open = true) => {
        try {
            const cartOverlay = document.getElementById('cartOverlay');
            const cartSidebar = document.getElementById('cartSidebar');
            if (cartOverlay && cartSidebar) {
                if (open) {
                    cartOverlay.classList.add('active');
                    cartSidebar.classList.add('active');
                } else {
                    cartOverlay.classList.remove('active');
                    cartSidebar.classList.remove('active');
                }
            }
        } catch (err) {
            console.warn('Cart toggle issue:', err);
        }
    };

    const saveCart = () => {
        try {
            localStorage.setItem('flavor_house_cart', JSON.stringify(cart));
        } catch (e) {
            console.warn('Could not access localStorage:', e);
        }
        updateCartUI();
    };

    const addToCart = (item) => {
        try {
            const existing = cart.find(i => i.id === item.id);
            if (existing) {
                existing.qty += 1;
            } else {
                cart.push({ ...item, qty: 1 });
            }
            saveCart();
            toggleCart(true);
        } catch (err) {
            console.warn('Failed to add item to cart:', err);
        }
    };

    const updateCartUI = () => {
        try {
            const cartItemsContainer = document.getElementById('cartItemsContainer');
            const cartTotalPrice = document.getElementById('cartTotalPrice');
            const cartBadgeCount = document.getElementById('cartBadgeCount');
            const modalTotalPrice = document.getElementById('modalTotalPrice');

            if (!cartItemsContainer) return;

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

            if (cartTotalPrice) cartTotalPrice.innerText = `₹${total}`;
            if (cartBadgeCount) cartBadgeCount.innerText = count;
            if (modalTotalPrice) modalTotalPrice.innerText = `₹${total}`;

            attachCartControls();
        } catch (err) {
            console.warn('Updating cart UI failed:', err);
        }
    };

    function attachAddToCartListeners() {
        try {
            const addBtns = document.querySelectorAll('.add-to-cart-btn');
            addBtns.forEach(btn => {
                // Ensure duplicate listeners are avoided by clearing existing click handler if attached
                btn.onclick = () => {
                    const item = {
                        id: btn.dataset.id,
                        name: btn.dataset.name,
                        price: parseFloat(btn.dataset.price) || 0,
                        image: btn.dataset.image
                    };
                    addToCart(item);
                };
            });
        } catch (err) {
            console.warn('Attaching cart button listeners failed:', err);
        }
    }

    function attachCartControls() {
        try {
            const incBtns = document.querySelectorAll('.inc-qty');
            const decBtns = document.querySelectorAll('.dec-qty');
            const removeBtns = document.querySelectorAll('.cart-item-remove');

            incBtns.forEach(btn => {
                btn.onclick = () => {
                    const id = btn.dataset.id;
                    const item = cart.find(i => i.id === id);
                    if (item) {
                        item.qty += 1;
                        saveCart();
                    }
                };
            });

            decBtns.forEach(btn => {
                btn.onclick = () => {
                    const id = btn.dataset.id;
                    const item = cart.find(i => i.id === id);
                    if (item) {
                        item.qty -= 1;
                        if (item.qty <= 0) {
                            cart = cart.filter(i => i.id !== id);
                        }
                        saveCart();
                    }
                };
            });

            removeBtns.forEach(btn => {
                btn.onclick = () => {
                    const id = btn.dataset.id;
                    cart = cart.filter(i => i.id !== id);
                    saveCart();
                };
            });
        } catch (err) {
            console.warn('Attaching cart quantity control listeners failed:', err);
        }
    }

    const initCartEvents = () => {
        try {
            const openCartBtn = document.getElementById('openCartBtn');
            const closeCartBtn = document.getElementById('closeCartBtn');
            const cartOverlay = document.getElementById('cartOverlay');

            if (openCartBtn) openCartBtn.addEventListener('click', () => toggleCart(true));
            if (closeCartBtn) closeCartBtn.addEventListener('click', () => toggleCart(false));
            if (cartOverlay) cartOverlay.addEventListener('click', () => toggleCart(false));

            attachAddToCartListeners();
            updateCartUI();
        } catch (err) {
            console.warn('Cart initialization issue:', err);
        }
    };

    // --- 7. CHECKOUT & WHATSAPP INTEGRATION ---
    const initCheckout = () => {
        try {
            const checkoutModal = document.getElementById('checkoutModal');
            const openCheckoutBtn = document.getElementById('openCheckoutBtn');
            const closeCheckoutBtn = document.getElementById('closeCheckoutBtn');
            const checkoutForm = document.getElementById('checkoutForm');

            const toggleCheckout = (open = true) => {
                if (cart.length === 0 && open) {
                    alert('Your cart is empty. Please add items before checking out.');
                    return;
                }
                if (checkoutModal) {
                    if (open) {
                        toggleCart(false);
                        checkoutModal.classList.add('active');
                    } else {
                        checkoutModal.classList.remove('active');
                    }
                }
            };

            if (openCheckoutBtn) openCheckoutBtn.addEventListener('click', () => toggleCheckout(true));
            if (closeCheckoutBtn) closeCheckoutBtn.addEventListener('click', () => toggleCheckout(false));

            if (checkoutForm) {
                checkoutForm.addEventListener('submit', (e) => {
                    e.preventDefault();

                    const nameInput = document.getElementById('custName');
                    const phoneInput = document.getElementById('custPhone');
                    const addressInput = document.getElementById('custAddress');
                    const notesInput = document.getElementById('custNotes');

                    const name = nameInput ? nameInput.value.trim() : 'Customer';
                    const phone = phoneInput ? phoneInput.value.trim() : '';
                    const address = addressInput ? addressInput.value.trim() : '';
                    const notes = (notesInput && notesInput.value.trim()) ? notesInput.value.trim() : 'None';

                    let grandTotal = 0;
                    let orderListText = '';

                    cart.forEach((item, index) => {
                        const itemTotal = item.price * item.qty;
                        grandTotal += itemTotal;
                        orderListText += `${index + 1}. *${item.name}* x ${item.qty} = ₹${itemTotal}\n`;
                    });

                    // Construct WhatsApp message
                    const message = `*NEW ORDER - THE FLAVOR HOUSE*%0A` +
                        `-----------------------------------%0A` +
                        `*Customer Name:* ${encodeURIComponent(name)}%0A` +
                        `*Phone:* ${encodeURIComponent(phone)}%0A` +
                        `*Delivery/Table:* ${encodeURIComponent(addre
