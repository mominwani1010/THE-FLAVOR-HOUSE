// Loader
window.addEventListener("load", () => {
    const loader = document.getElementById("loader");

    setTimeout(() => {
        loader.style.opacity = "0";
        loader.style.visibility = "hidden";
    }, 1200);
});

// Navbar background on scroll
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
    if (window.scrollY > 80) {
        navbar.style.background = "rgba(10,10,10,0.92)";
    } else {
        navbar.style.background = "rgba(20,20,20,.45)";
    }
});

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", function (e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        if (target) {
            target.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});const orderBtn = document.getElementById("orderBtn");

if(orderBtn){

orderBtn.addEventListener("click",()=>{

window.open("https://wa.me/916005640160","_blank");

});

}
