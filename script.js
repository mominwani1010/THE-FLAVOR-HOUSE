/* ===========================
LOADER
=========================== */

window.addEventListener("load", () => {
    const loader = document.getElementById("loader");

    if (loader) {
        setTimeout(() => {
            loader.style.opacity = "0";
            loader.style.visibility = "hidden";
        }, 1000);
    }
});

/* ===========================
HERO SLIDER
=========================== */

const slides = document.querySelectorAll(".slide");

let currentSlide = 0;

function changeSlide() {

    if (slides.length === 0) return;

    slides.forEach(slide => {
        slide.classList.remove("active");
    });

    currentSlide++;

    if (currentSlide >= slides.length) {
        currentSlide = 0;
    }

    slides[currentSlide].classList.add("active");
}

if (slides.length > 0) {
    setInterval(changeSlide, 4000);
}

/* ===========================
MOBILE MENU
=========================== */

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {

        navLinks.classList.toggle("active");

    });

    document.querySelectorAll(".nav-links a").forEach(link => {

        link.addEventListener("click", () => {

            navLinks.classList.remove("active");

        });

    });

}

/* ===========================
INTERIOR GALLERY SLIDER
=========================== */

const galleryTrack = document.querySelector(".gallery-track");

const galleryImages = document.querySelectorAll(".gallery-track img");

const dots = document.querySelectorAll(".dot");

let galleryIndex = 0;

function showGallery(index){

    if(!galleryTrack) return;

    galleryTrack.style.transform =
    `translateX(-${index * 100}%)`;

    dots.forEach(dot=>dot.classList.remove("active"));

    if(dots[index]){
        dots[index].classList.add("active");
    }

}

const nextBtn = document.querySelector(".gallery-btn.next");
const prevBtn = document.querySelector(".gallery-btn.prev");

if(nextBtn){

nextBtn.addEventListener("click",()=>{

galleryIndex++;

if(galleryIndex>=galleryImages.length){

galleryIndex=0;

}

showGallery(galleryIndex);

});

}

if(prevBtn){

prevBtn.addEventListener("click",()=>{

galleryIndex--;

if(galleryIndex<0){

galleryIndex=galleryImages.length-1;

}

showGallery(galleryIndex);

});

}

if(galleryImages.length>0){

setInterval(()=>{

galleryIndex++;

if(galleryIndex>=galleryImages.length){

galleryIndex=0;

}

showGallery(galleryIndex);

},3500);

}/* ===========================
QUANTITY BUTTONS
=========================== */

document.querySelectorAll(".quantity").forEach(box => {

const minus = box.querySelector(".minus");
const plus = box.querySelector(".plus");
const input = box.querySelector("input");

plus.addEventListener("click", () => {
input.value = parseInt(input.value) + 1;
});

minus.addEventListener("click", () => {
if (parseInt(input.value) > 1) {
input.value = parseInt(input.value) - 1;
}
});

});

/* ===========================
SHOPPING CART
=========================== */

let cart = [];

const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");

function updateCart() {

if (!cartItems) return;

cartItems.innerHTML = "";

let total = 0;

cart.forEach((item, index) => {

total += item.price * item.quantity;

cartItems.innerHTML += `

<div class="cart-item">

<div>

<strong>${item.name}</strong>

<br>

₹${item.price} × ${item.quantity}

</div>

<button onclick="removeItem(${index})">

❌

</button>

</div>

`;

});

cartTotal.textContent = total;

cartCount.textContent = cart.length;

}

document.querySelectorAll(".add-cart").forEach(button => {

button.addEventListener("click", () => {

const card = button.closest(".food-card");

const quantityInput = card.querySelector("input");

const quantity = quantityInput ? parseInt(quantityInput.value) : 1;

cart.push({

name: button.dataset.name,

price: Number(button.dataset.price),

quantity

});

updateCart();

});

});

function removeItem(index){

cart.splice(index,1);

updateCart();

}

/* ===========================
OPEN / CLOSE CART
=========================== */

const floatingCart = document.getElementById("floatingCart");
const cartSidebar = document.getElementById("cartSidebar");
const closeCart = document.getElementById("closeCart");

if(floatingCart){

floatingCart.onclick = ()=>{

cartSidebar.classList.add("active");

};

}

if(closeCart){

closeCart.onclick = ()=>{

cartSidebar.classList.remove("active");

};

}

/* ===========================
WHATSAPP ORDER
=========================== */

const whatsappBtn = document.getElementById("whatsappOrder");

if(whatsappBtn){

whatsappBtn.onclick = ()=>{

const name = document.getElementById("customerName").value.trim();
const phone = document.getElementById("customerPhone").value.trim();
const address = document.getElementById("customerAddress").value.trim();
const note = document.getElementById("customerNote").value.trim();

if(!name || !phone || !address){

alert("Please fill all required details.");

return;

}

if(cart.length===0){

alert("Your cart is empty.");

return;

}

let message = "🍽️ *THE FLAVOR HOUSE*%0A%0A";

message += "*Customer Name:* " + name + "%0A";
message += "*Phone:* " + phone + "%0A";
message += "*Address:* " + address + "%0A%0A";

message += "*Order Details*%0A";

let total = 0;

cart.forEach(item=>{

message += "• " + item.name + " × " + item.quantity + " = ₹" + (item.price * item.quantity) + "%0A";

total += item.price * item.quantity;

});

message += "%0A*Total:* ₹" + total;

if(note){

message += "%0A%0ASpecial Instructions:%0A" + note;

}

window.open(

"https://wa.me/916005640160?text="+message,

"_blank"

);

};

}

/* ===========================
SCROLL TO TOP
=========================== */

const scrollBtn = document.getElementById("scrollTop");

window.addEventListener("scroll",()=>{

if(!scrollBtn) return;

if(window.scrollY>300){

scrollBtn.style.display="block";

}else{

scrollBtn.style.display="none";

}

});

if(scrollBtn){

scrollBtn.onclick=()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

};

}
