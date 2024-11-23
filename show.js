

// function sendEmail(subjectString, bodyString) {

//     import nodemailer from 'nodemailer';

//     const transporter = nodemailer.createTransport({
//         service: 'gmail', // Możesz użyć innego dostawcy
//         auth: {
//             user: 'osadalimajno@gmail.com',
//             pass: 'kilop098#' // Wygeneruj hasło aplikacji w Google
//         }
//     });
//     const mailOptions = {
//         from: 'osadalimajno@gmail.com', // Adres nadawcy
//         to: 'franek.gwiazda0@gmail.com', // Adres odbiorcy
//         subject: subjectString, // Pierwszy string jako temat
//         text: bodyString // Drugi string jako treść
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             console.log('Błąd podczas wysyłania: ', error);
//         } else {
//             console.log('Wiadomość wysłana: ' + info.response);
//         }
//     });
// }

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
    //sendEmail('Mój temat', 'To jest treść wiadomości.');

}


// Funkcja wysyłająca e-mail


// Przykładowe dane do wysłania

// Funkcja do zamknięcia modala (przyciskiem zamknięcia)
function closeModal() {
    var modal = document.getElementById("imageModal");
    modal.style.display = "none";
}