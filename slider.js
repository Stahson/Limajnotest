let currentIndex = 0;
const slides = document.querySelectorAll(".img-container");

function showSlide(index) {
    const slider = document.querySelector(".slider");
    if (index >= slides.length) {
        currentIndex = 0; // Wracaj do pierwszego zdjęcia po ostatnim
    } else if (index < 0) {
        currentIndex = slides.length - 1; // Wracaj do ostatniego zdjęcia po pierwszym
    } else {
        currentIndex = index;
    }
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
}

function nextSlide() {
    showSlide(currentIndex + 1);
}

function prevSlide() {
    showSlide(currentIndex - 1);
}

// Opcjonalnie: automatyczne przewijanie co 3 sekundy
setInterval(nextSlide, 3000);