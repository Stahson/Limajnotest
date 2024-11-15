function openModal(imgElement) {
    var modal = document.getElementById("imageModal");
    var modalImg = document.getElementById("modalImage");
    var captionText = document.getElementById("caption");

    modal.style.display = "block";
    modalImg.src = imgElement.src; // Ustawia zdjęcie modalne na kliknięte zdjęcie
    captionText.innerHTML = imgElement.alt; // Może być tekst alternatywny lub opis

    // Jeśli klikniesz na modal, to go zamkniesz
    modal.onclick = function () {
        modal.style.display = "none";
    }
}

// Funkcja do zamknięcia modala (przyciskiem zamknięcia)
function closeModal() {
    var modal = document.getElementById("imageModal");
    modal.style.display = "none";
}