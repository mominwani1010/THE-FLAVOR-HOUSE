// Add simple entry animations using GSAP
gsap.from(".vintage-text", { opacity: 0, y: 50, duration: 1.5, ease: "power3.out" });
gsap.from(".hero p", { opacity: 0, y: 30, duration: 1.5, delay: 0.5, ease: "power3.out" });
gsap.from(".cta-btn", { opacity: 0, scale: 0.8, duration: 1, delay: 1, ease: "back.out(1.7)" });

// Single Page Navigation Logic
const homeView = document.getElementById("home-view");
const menuView = document.getElementById("menu-view");

function showMenu() {
  homeView.style.display = "none";
  menuView.style.display = "block";
  window.scrollTo(0, 0);
  // Animate menu dishes popping in
  gsap.from("#full-menu-grid .dish-card", {
    opacity: 0,
    y: 40,
    stagger: 0.1,
    duration: 0.8,
    ease: "power2.out"
  });
}

function showHome() {
  menuView.style.display = "none";
  homeView.style.display = "block";
  window.scrollTo(0, 0);
}

// Shopping Cart Logic
let cart = [];

function addToCart(itemName, itemPrice) {
  // Check if item already exists in cart
  const existingItem = cart.find(item => item.name === itemName);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ name: itemName, price: itemPrice, qty: 1 });
  }
  
  updateCartUI();
  
  // Quick visual feedback
  const cartBtn = document.querySelector('.cart-btn');
  gsap.to(cartBtn, { scale: 1.2, duration: 0.1, yoyo: true, repeat: 1, color: "#fff", backgroundColor: "#d4af37" });
}

function updateCartUI() {
  // Update count
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById("cart-count").innerText = totalItems;

  // Update Modal Display
  const cartItemsContainer = document.getElementById("cart-items");
  let html = "";
  let totalPrice = 0;

  cart.forEach((item, index) => {
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

// Checkout Form Submission (WhatsApp Redirect)
function processCheckout() {
  if (cart.length === 0) {
    alert("Please add items to your cart first!");
    return;
  }

  const name = document.getElementById("cust-name").value.trim();
  const mobile = document.getElementById("cust-mobile").value.trim();
  const address = document.getElementById("cust-address").value.trim();

  if (!name || !mobile || !address) {
    alert("Please fill in your Name, Mobile, and Delivery Address.");
    return;
  }

  // Construct the WhatsApp Message
  let message = "*New Order for THE FLAVOR HOUSE*%0A";
  message += "---------------------------%0A";
  
  let total = 0;
  cart.forEach(item => {
    let itemTotal = item.price * item.qty;
    total += itemTotal;
    message += `${item.qty}x ${item.name} - ₹${itemTotal}%0A`;
  });

  message += "---------------------------%0A";
  message += `*Total Amount: ₹${total}*%0A%0A`;
  
  message += "*Customer Details:*%0A";
  message += `Name: ${name}%0A`;
  message += `Phone: ${mobile}%0A`;
  message += `Address: ${address}`;

  // Restaurant WhatsApp Number (Hardcoded for Security)
  const whatsappNumber = "916005640160"; 
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${message}`;

  // Open WhatsApp in a new tab
  window.open(whatsappURL, "_blank");

  // Optional: Clear cart after opening WhatsApp
  cart = [];
  updateCartUI();
  toggleCart();
  
  // Clear form inputs
  document.getElementById("cust-name").value = "";
  document.getElementById("cust-mobile").value = "";
  document.getElementById("cust-address").value = "";
}
