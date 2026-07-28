// ==============================
// THE FLAVOR HOUSE
// Premium Restaurant Script
// ==============================

// Loader

window.addEventListener("load", () => {

const loader = document.querySelector(".loader");

setTimeout(() => {

loader.style.display = "none";

},2000);

});

// Sticky Navbar

window.addEventListener("scroll",()=>{

const header=document.querySelector("header");

if(window.scrollY>50){

header.style.background="rgba(0,0,0,.9)";

}else{

header.style.background="rgba(0,0,0,.55)";

}

});

// Mobile Menu

const hamburger=document.querySelector(".hamburger");

const navLinks=document.querySelector(".nav-links");

hamburger.addEventListener("click",()=>{

navLinks.classList.toggle("active");

});

// =====================
// CART
// =====================

let cart=[];

const cartCount=document.getElementById("cart-count");

const buttons=document.querySelectorAll(".add-cart");

buttons.forEach(button=>{

button.addEventListener("click",()=>{

const item={

name:button.dataset.name,

price:Number(button.dataset.price)

};

cart.push(item);

updateCart();

alert(item.name+" added to cart!");

});

});

function updateCart(){

cartCount.innerText=cart.length;

localStorage.setItem("cart",JSON.stringify(cart));

}

window.addEventListener("load",()=>{

const saved=localStorage.getItem("cart");

if(saved){

cart=JSON.parse(saved);

updateCart();

}

});// ===============================
// CART SIDEBAR
// ===============================

const cartButton = document.getElementById("cart-btn");

const cartPanel = document.createElement("div");

cartPanel.className = "cart-panel";

cartPanel.innerHTML = `

<div class="cart-header">

<h2>Your Cart</h2>

<button id="close-cart">✖</button>

</div>

<div id="cart-items"></div>

<h3 id="cart-total">Total : ₹0</h3>

<input type="text" id="customer-name" placeholder="Your Name">

<input type="tel" id="customer-phone" placeholder="Phone Number">

<textarea id="customer-address" placeholder="Delivery Address"></textarea>

<button id="checkout-btn">

Place Order on WhatsApp

</button>

`;

document.body.appendChild(cartPanel);

// Open Cart

cartButton.addEventListener("click", () => {

cartPanel.classList.add("show-cart");

renderCart();

});

// Close Cart

document.getElementById("close-cart").addEventListener("click", () => {

cartPanel.classList.remove("show-cart");

});

// Render Cart

function renderCart() {

const container = document.getElementById("cart-items");

container.innerHTML = "";

let total = 0;

cart.forEach((item, index) => {

total += item.price;

container.innerHTML += `

<div class="cart-item">

<h4>${item.name}</h4>

<p>₹${item.price}</p>

<button onclick="removeItem(${index})">

Remove

</button>

</div>

`;

});

document.getElementById("cart-total").innerHTML =

"Total : ₹" + total;

}

// Remove Item

function removeItem(index){

cart.splice(index,1);

updateCart();

renderCart();

}

// ===============================
// WHATSAPP CHECKOUT
// ===============================

document.getElementById("checkout-btn")

.addEventListener("click",()=>{

const name=document.getElementById("customer-name").value;

const phone=document.getElementById("customer-phone").value;

const address=document.getElementById("customer-address").value;

if(name==="" || phone==="" || address===""){

alert("Please fill all details.");

return;

}

let message="🍽 *THE FLAVOR HOUSE ORDER*%0A%0A";

message+="👤 Name : "+name+"%0A";

message+="📞 Phone : "+phone+"%0A";

message+="📍 Address : "+address+"%0A%0A";

message+="*Items Ordered*%0A";

let total=0;

cart.forEach(item=>{

message+="• "+item.name+" - ₹"+item.price+"%0A";

total+=item.price;

});

message+="%0A💰 Total : ₹"+total;

window.open(

"https://wa.me/916005640160?text="+message,

"_blank"

);

});// ===============================
// SMOOTH SCROLL
// ===============================

document.querySelectorAll('a[href^="#"]').forEach(link => {

link.addEventListener("click", function(e){

e.preventDefault();

const target=document.querySelector(this.getAttribute("href"));

if(target){

target.scrollIntoView({

behavior:"smooth"

});

}

});

});

// ===============================
// SCROLL ANIMATION
// ===============================

const observer=new IntersectionObserver((entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("show");

}

});

},

{

threshold:0.2

});

document.querySelectorAll(

".dish-card,.chef-card,.review-card,.contact-box,.stat-box,.feature"

).forEach(el=>{

el.classList.add("hidden");

observer.observe(el);

});

// ===============================
// BUTTON RIPPLE EFFECT
// ===============================

document.querySelectorAll(

".btn,.btn2,.add-cart"

).forEach(button=>{

button.addEventListener("click",function(e){

const ripple=document.createElement("span");

const rect=this.getBoundingClientRect();

const size=Math.max(rect.width,rect.height);

ripple.style.width=size+"px";

ripple.style.height=size+"px";

ripple.style.left=(e.clientX-rect.left-size/2)+"px";

ripple.style.top=(e.clientY-rect.top-size/2)+"px";

ripple.classList.add("ripple");

this.appendChild(ripple);

setTimeout(()=>{

ripple.remove();

},600);

});

});

// ===============================
// FOOD IMAGE HOVER EFFECT
// ===============================

document.querySelectorAll(".dish-card img").forEach(img=>{

img.addEventListener("mousemove",()=>{

img.style.transform="scale(1.08) rotate(2deg)";

});

img.addEventListener("mouseleave",()=>{

img.style.transform="scale(1) rotate(0deg)";

});

});

// ===============================
// COPYRIGHT YEAR
// ===============================

const year=new Date().getFullYear();

const footer=document.querySelector("footer");

if(footer){

footer.innerHTML=footer.innerHTML.replace("2026",year);

}

console.log("The Flavor House Website Loaded Successfully");.hidden{
opacity:0;
transform:translateY(40px);
transition:all .8s ease;
}

.show{
opacity:1;
transform:translateY(0);
}

.ripple{
position:absolute;
border-radius:50%;
transform:scale(0);
animation:ripple .6s linear;
background:rgba(255,255,255,.5);
pointer-events:none;
}

.btn,
.btn2,
.add-cart{
position:relative;
overflow:hidden;
}

@keyframes ripple{
to{
transform:scale(4);
opacity:0;
}
}
