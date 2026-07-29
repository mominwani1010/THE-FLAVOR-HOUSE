// LOADER

window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    setTimeout(() => {
        loader.style.opacity = "0";
        loader.style.visibility = "hidden";
    }, 1000);
});

// HERO SLIDER

const slides = document.querySelectorAll(".slide");
let currentSlide = 0;

function heroSlider() {
    slides.forEach(slide => slide.classList.remove("active"));
    currentSlide++;
    if (currentSlide >= slides.length) currentSlide = 0;
    slides[currentSlide].classList.add("active");
}

setInterval(heroSlider, 4000);

// MOBILE MENU

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});

// CART

const cart = [];
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const cartPanel = document.querySelector(".cart-panel");
const cartBtn = document.querySelector(".cart-btn");

cartBtn.onclick = () => {
    cartPanel.classList.toggle("active");
};

document.querySelectorAll(".add-cart").forEach(button => {

    button.addEventListener("click", () => {

        const name = button.dataset.name;
        const price = Number(button.dataset.price);

        cart.push({ name, price });

        updateCart();

    });

});

function updateCart() {

    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach(item => {

        total += item.price;

        cartItems.innerHTML += `
        <div>
            <span>${item.name}</span>
            <span>₹${item.price}</span>
        </div>
        `;

    });

    cartCount.textContent = cart.length;
    cartTotal.textContent = total;

}

// WHATSAPP CHECKOUT

document.getElementById("checkout").onclick = () => {

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    let message = "🍽️ *The Flavor House Order*%0A%0A";

    cart.forEach(item => {
        message += `• ${item.name} - ₹${item.price}%0A`;
    });

    message += `%0A*Total:* ₹${cartTotal.textContent}`;
    message += `%0A%0APlease confirm my order.`;

    window.open(
        `https://wa.me/916005640160?text=${message}`,
        "_blank"
    );

};
