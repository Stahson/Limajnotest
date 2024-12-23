const firebaseConfig = {

    apiKey: "AIzaSyCS2J5AxvS9PpNXqNLNjKP4vM1jtGOjITQ",
  
    authDomain: "flutter-a9dce.firebaseapp.com",
  
    databaseURL: "https://flutter-a9dce-default-rtdb.firebaseio.com",
  
    projectId: "flutter-a9dce",
  
    storageBucket: "flutter-a9dce.firebasestorage.app",
  
    messagingSenderId: "561921975040",
  
    appId: "1:561921975040:web:f68ca5366233d71c0849e5",
  
    measurementId: "G-0269001WYP"
  
};

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

let calendar = document.querySelector('.calendar')
let firstSelectedDate = null;
let secondSelectedDate = null;

const month_names = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];

isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) || (year % 100 === 0 && year % 400 ===0)
}

getFebDays = (year) => {
    return isLeapYear(year) ? 29 : 28
}

generateCalendar = (month, year) => {
    

    let calendar_days = calendar.querySelector('.calendar-days')
    let calendar_header_year = calendar.querySelector('#year')

    let days_of_month = [31, getFebDays(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

    calendar_days.innerHTML = ''

    let currDate = new Date()
    if (!month) month = currDate.getMonth()
    if (!year) year = currDate.getFullYear()

    let curr_month = `${month_names[month]}`
    month_picker.innerHTML = curr_month
    calendar_header_year.innerHTML = year

    // get first day of month
    
    let first_day = new Date(year, month, 1)

    for (let i = 0; i <= days_of_month[month] + first_day.getDay() - 1; i++) {
        let day = document.createElement('div')
        if (i >= first_day.getDay()) {
            day.classList.add('calendar-day-hover')
            day.innerHTML = i - first_day.getDay() + 1
            day.innerHTML += `<span></span>
                            <span></span>
                            <span></span>
                            <span></span>`
            if (i - first_day.getDay() + 1 === currDate.getDate() && year === currDate.getFullYear() && month === currDate.getMonth()) {
                day.classList.add('curr-date')
            }
            day.addEventListener('click', () => selectDate(i - first_day.getDay() + 1))
            db.collection(year.toString()+"_z") // e.g., 2024 collection
            .doc(month.toString()) // e.g., 5 for May
            .get()
            .then(doc => {                
                let savedDates = doc.data();            
                if (savedDates[(i-first_day.getDay()+1).toString()]) {
                    day.classList.add('red-selected');
                }
            });
            db.collection(year.toString()+"_r") // e.g., 2024 collection
            .doc(month.toString()) // e.g., 5 for May
            .get()
            .then(doc => {                
                let savedDates = doc.data();            
                if (savedDates[(i-first_day.getDay()+1).toString()]) {
                    day.classList.add('shaped-selected');
                }
            });
        }
        calendar_days.appendChild(day)
    }
    

        
}

let month_list = calendar.querySelector('.month-list')

month_names.forEach((e, index) => {
    let month = document.createElement('div')
    month.innerHTML = `<div data-month="${index}">${e}</div>`
    month.querySelector('div').onclick = () => {
        month_list.classList.remove('show')
        curr_month.value = index
        generateCalendar(index, curr_year.value)
    }
    month_list.appendChild(month)
})

let month_picker = calendar.querySelector('#month-picker')

month_picker.onclick = () => {
    month_list.classList.add('show')
}

let currDate = new Date()

let curr_month = {value: currDate.getMonth()}
let curr_year = {value: currDate.getFullYear()}

generateCalendar(curr_month.value, curr_year.value)

document.querySelector('#prev-year').onclick = () => {
    --curr_year.value
    generateCalendar(curr_month.value, curr_year.value)
}

document.querySelector('#next-year').onclick = () => {
    ++curr_year.value
    generateCalendar(curr_month.value, curr_year.value)
}

// let dark_mode_toggle = document.querySelector('.dark-mode-switch')

// dark_mode_toggle.onclick = () => {
//     document.querySelector('body').classList.toggle('light')
//     document.querySelector('body').classList.toggle('dark')
// }


function selectDate(dayNumber) {
    if (!firstSelectedDate) {
        firstSelectedDate = dayNumber;
        highlightRange(firstSelectedDate, firstSelectedDate);
    } else if (!secondSelectedDate) {
        secondSelectedDate = dayNumber;
        highlightRange(firstSelectedDate, secondSelectedDate);
    } else {
        resetSelection();
        firstSelectedDate = null;
        secondSelectedDate = null;
    }
}


function highlightRange(start, end) {
    document.querySelectorAll('.calendar-days div').forEach(day => {
        const dayNumber = parseInt(day.textContent);
        if (dayNumber >= Math.min(start, end) && dayNumber <= Math.max(start, end)) {
            day.classList.add('selected-range');
        }
        
    });
}

function resetSelection() {
    document.querySelectorAll('.calendar-days div').forEach(day => day.classList.remove('selected-range'));
}

/*document.querySelector('#przycisk').onclick = () => {
    if (firstSelectedDate && secondSelectedDate) {
        let start = Math.min(firstSelectedDate, secondSelectedDate);
        let end = Math.max(firstSelectedDate, secondSelectedDate);

        // Inicjalizuj obiekt na przechowanie zakresu dat jako osobne pola
        let dateFields = {};
        
        for (let day = start; day <= end; day++) {
            dateFields[day] = { date: day };
        }

      
        db.collection(curr_year.value.toString()+"_r").doc(curr_month.value.toString()).set(dateFields, { merge: true })
        .then(() => {
            alert(`Wybrany termin: od dnia ${firstSelectedDate} do dnia ${secondSelectedDate} został zarezerwowany.`);
            console.log("Dane zapisane:", dateFields);
        })
        .catch((error) => {
            console.error("Błąd przy zapisywaniu: ", error);
            alert("Wystąpił błąd przy zapisie. Spróbuj ponownie.");
        });
    } else {
        alert("Proszę wybrać zakres dat przed potwierdzeniem.");
        console.log("Brak wybranego zakresu dat.");
    }
};*/
document.querySelector('#przycisk').onclick = () => {
    const modal = document.getElementById('reservationModal');
    modal.style.display = 'block';

    const closeModal = document.getElementById('closeModal');
    closeModal.onclick = () => {
        modal.style.display = 'none';
    };

    // Submit form logic
    const form = document.getElementById('reservationForm');
    form.onsubmit = (e) => {
        e.preventDefault();

        // Get user data
        const email = document.getElementById('email').value;
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;

        if (email && name && phone) {
            modal.style.display = 'none'; // Hide the modal

            if (firstSelectedDate && secondSelectedDate) {
                let start = Math.min(firstSelectedDate, secondSelectedDate);
                let end = Math.max(firstSelectedDate, secondSelectedDate);

                let dateFields = {};

                for (let day = start; day <= end; day++) {
                    dateFields[day] = { date: day, email, name, phone };
                }

                db.collection(curr_year.value.toString() + "_r").doc(curr_month.value.toString()).set(dateFields, { merge: true })
                    .then(() => {
                        alert(`Wybrany termin: od dnia ${firstSelectedDate} do dnia ${secondSelectedDate} został zarezerwowany.`);
                        console.log("Dane zapisane:", dateFields);
                    })
                    .catch((error) => {
                        console.error("Błąd przy zapisywaniu: ", error);
                        alert("Wystąpił błąd przy zapisie. Spróbuj ponownie.");
                    });
            } else {
                alert("Proszę wybrać zakres dat przed potwierdzeniem.");
                console.log("Brak wybranego zakresu dat.");
            }
        } else {
            alert("Proszę wypełnić wszystkie pola formularza.");
        }
    };
};


