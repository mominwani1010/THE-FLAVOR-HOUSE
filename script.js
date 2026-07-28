// --- SAFELY INITIALIZE 3D THREE.JS HERO SCENE ---
function init3DHero() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  // Check WebGL availability for mobile safety
  try {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Mobile optimization

    // Floating Vintage Gold Torus
    const geometry = new THREE.TorusGeometry(2.5, 0.15, 12, 48);
    const material = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.8,
      roughness: 0.2,
      wireframe: true
    });
    const torus = new THREE.Mesh(geometry, material);
    scene.add(torus);

    // Light particles
    const particlesCount = window.innerWidth < 768 ? 80 : 180; // Reduced for mobile
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 12;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      color: 0xd4af37,
      size: 0.04,
      transparent: true,
      opacity: 0.7
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xd4af37, 2);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    camera.position.z = 5;

    // Smooth Mouse / Touch Parallax
    let targetX = 0, targetY = 0;
    const handleMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      targetX = (clientX / window.innerWidth - 0.5) * 0.4;
      targetY = (clientY / window.innerHeight - 0.5) * 0.4;
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove, { passive: true });

    function animate() {
      requestAnimationFrame(animate);

      torus.rotation.x += 0.004;
      torus.rotation.y += 0.006;
      particlesMesh.rotation.y += 0.001;

      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (-targetY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

  } catch (err) {
    console.warn("WebGL not supported or disabled on device; using CSS fallback.");
  }
}

// Call Three.js initialization
init3DHero();

// --- GSAP ANIMATIONS ---
if (typeof gsap !== "undefined") {
  gsap.from(".vintage-text", { opacity: 0, y: 30, duration: 1.2, ease: "power2.out" });
  gsap.from(".hero p", { opacity: 0, y: 20, duration: 1.2, delay: 0.3, ease: "power2.out" });
  gsap.from(".cta-btn", { opacity: 0, scale: 0.9, duration: 0.8, delay: 0.6 });
}

// --- SINGLE PAGE NAVIGATION LOGIC ---
function showMenu() {
  document.getElementById("home-view").style.display = "none";
  document.getElementById("menu-view").style.display = "block";
  window.scrollTo(0, 0);

  if (typeof gsap !== "undefined") {
    gsap.from("#full-menu-grid .dish-card", {
      opacity: 0,
      y: 30,
      stagger: 0.08,
      duration: 0.6,
      ease: "power2.out"
    });
  }
}

function showHome() {
  document.getElementById("menu-view").style.display = "none";
  document.getElementById("home-view").style.display = "block";
  window.scrollTo(0, 0);
}

// --- CART LOGIC ---
let cart = [];

function addToCart(itemName, itemPrice) {
  const existingItem = cart.find(item => item.name === itemName);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ name: itemName, price: itemPrice, qty: 1 });
  }
  
  updateCartUI();
  
  const cartBtn = document.querySelector('.cart-btn');
  if (typeof gsap !== "undefined") {
    gsap.to(cartBtn, { scale: 1.15, duration: 0.1, yoyo: true, repeat: 1 });
  }
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById("cart-count").innerText = totalItems;

  const cartItemsContainer = document.getElementById("cart-items");
  let html = "";
  let totalPrice = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.qty;
    totalPrice += itemTotal;
    html += `
      <div class="cart-item">
        <span>${item.qty}x ${item.name}</span>
        <span>₹${itemTotal}</span>
      </div>
    `;
  });

  if (cart.length === 0) {
    html = "<p style='color: #888;'>Your cart is empty.</p>";
  }

  cartItemsContainer.innerHTML = html;
  document.getElementById("cart-total-price").innerText = totalPrice;
}

function toggleCart() {
  const modal = document.getElementById("cart-modal");
  if (modal.style.display === "flex") {
    modal.style.display = "none";
  } else {
    updateCartUI();
    modal.style.display = "flex";
  }
}

// --- SECURE WHATSAPP CHECKOUT ---
function processCheckout() {
  if (cart.length === 0) {
    alert("Please add items to your cart first!");
    return;
  }

  const name = document.getElementById("cust-name").value.trim();
  const mobile = document.getElementById("cust-mobile").value.trim();
  const address = document.getElementById("cust-address").value.trim();

  if (!name || !mobile || !address) {
    alert("Please fill in your Name, Mobile Number, and Address.");
    return;
  }

  let message = "*New Order for THE FLAVOR HOUSE*%0A";
  message += "---------------------------%0A";
  
  let total = 0;
  cart.forEach(item => {
    let itemTotal = item.price * item.qty;
    total += itemTotal;
    message += `${item.qty}x ${encodeURIComponent(item.name)} - ₹${itemTotal}%0A`;
  });

  message += "---------------------------%0A";
  message += `*Total Amount: ₹${total}*%0A%0A`;
  
  message += "*Customer Details:*%0A";
  message += `Name: ${encodeURIComponent(name)}%0A`;
  message += `Phone: ${encodeURIComponent(mobile)}%0A`;
  message += `Address: ${encodeURIComponent(address)}`;

  const whatsappNumber = "916005640160"; 
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${message}`;

  window.open(whatsappURL, "_blank");

  cart = [];
  updateCartUI();
  toggleCart();
  
  document.getElementById("cust-name").value = "";
  document.getElementById("cust-mobile").value = "";
  document.getElementById("cust-address").value = "";
}
