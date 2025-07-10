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
let firstmonth = null;
let secondmonth = null;

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
    let prevR = false
    let prevZ = false
    let next = false
    

    let days_of_month = [31, getFebDays(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

    calendar_days.innerHTML = ''

    let currDate = new Date()
    if (!month && month !== 0) month = currDate.getMonth()
    if (!year) year = currDate.getFullYear()

    let curr_month = `${month_names[month]}`
    month_picker.innerHTML = curr_month
    calendar_header_year.innerHTML = year
    let prevMonth = month === 0 ? 11 : month - 1
    let prevYear = month === 0 ? year - 1 : year
    let nextMonth = month === 11 ? 0 : month + 1
    let nextYear = month === 11 ? year + 1 : year
    // get first day of month
    let first_day = new Date(year, month, 1)

    for (let i = 0; i <= days_of_month[month] + first_day.getDay() - 1; i++) {
        let right = false
        let left = false
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
            

            Promise.all([
                db.collection(year.toString() + "l_z").doc(month.toString()).get(),
                db.collection(year.toString() + "l_r").doc(month.toString()).get(),
                db.collection(prevYear.toString() + "l_z").doc(prevMonth.toString()).get(),
                db.collection(prevYear.toString() + "l_r").doc(prevMonth.toString()).get(),
                db.collection(nextYear.toString() + "l_z").doc(nextMonth.toString()).get(),
                db.collection(nextYear.toString() + "l_r").doc(nextMonth.toString()).get() 
            ])
            .then(([lzDoc, lrDoc, prevLzDoc, prevLrDoc, nextLzDoc, nextLrDoc]) => {
                let savedDatesR = lrDoc.data() || {};
                let selectedDaysR = Object.keys(savedDatesR).map(Number).filter(day => savedDatesR[day]);
                let prevsavedDatesR = prevLrDoc.data() || {};
                let prevselectedDaysR = Object.keys(prevsavedDatesR).map(Number).filter(day => prevsavedDatesR[day]);
                let nextsavedDatesR = nextLrDoc.data() || {};
                let nextselectedDaysR = Object.keys(nextsavedDatesR).map(Number).filter(day => nextsavedDatesR[day]);
                if (selectedDaysR.length > 0) {
                    let firstSelectedDay = Math.min(...selectedDaysR);
                    let lastSelectedDay = Math.max(...selectedDaysR);
                    let currentDay = i - first_day.getDay() + 1;
                    let nextday = i - first_day.getDay() + 2;
                   if (savedDatesR[currentDay.toString()]) 
                    {      
                        if(savedDatesR[nextday.toString()] && prevR) { 
                            day.classList.add('shaped-selected');
                            prevR = true;
                        }
                        else if(i == days_of_month[month] + first_day.getDay() - 1) 
                        {
                            if(nextselectedDaysR.includes(1) && prevR) {
                                day.classList.add('shaped-selected');
                                prevR = true;
                            }
                            else if(prevR) {
                                left = true;
                            }
                            else {
                                right = true;
                                prevR = true;
                            }
                        }
                        else {
                            if(prevR) {
                                left = true;
                            }
                            else {
                                if(prevselectedDaysR.includes(days_of_month[prevMonth]) && i == first_day.getDay()) {
                                    day.classList.add('shaped-selected');
                                }
                                else {
                                    right = true;
                                }
                                prevR = true;
                            }    
                        }
                    }
                    else {
                        prevR = false
                    }
                }
                let savedDatesZ = lzDoc.data() || {};
                let selectedDaysZ = Object.keys(savedDatesZ).map(Number).filter(day => savedDatesZ[day]);
                let prevsavedDatesZ = prevLzDoc.data() || {};
                let prevselectedDaysZ = Object.keys(prevsavedDatesZ).map(Number).filter(day => prevsavedDatesZ[day]);
                let nextsavedDatesZ = nextLzDoc.data() || {};
                let nextselectedDaysZ = Object.keys(nextsavedDatesZ).map(Number).filter(day => nextsavedDatesZ[day]);

                let firstSelectedDay = Math.min(...selectedDaysZ);
                let lastSelectedDay = Math.max(...selectedDaysZ);
                let currentDay = i - first_day.getDay() + 1;
                let nextday = i - first_day.getDay() + 2;
                if (savedDatesZ[currentDay.toString()]) 
                {      
                    if(savedDatesZ[nextday.toString()] && prevZ) { 
                        day.classList.add('red-selected');
                        prevZ = true;
                    }
                    else if(i == days_of_month[month] + first_day.getDay() - 1) 
                    {
                        if(nextselectedDaysZ.includes(1) && prevZ) {
                            day.classList.add('red-selected');
                            prevZ = true;
                        }
                        else if(prevZ) {
                            if(right) {
                                day.classList.add('red-left-shaped-right');
                            }
                            else{
                                day.classList.add('red-selected-left');
                            }
                            
                        }
                        else {
                            if (left)
                            {
                                day.classList.add('shaped-left-red-right');
                            }
                            else 
                            {  
                                day.classList.add('red-selected-right');
                            }
                            prevZ = true;
                        }
                    }
                    else {
                        if(prevZ) {
                            if(right) {
                                day.classList.add('red-left-shaped-right');
                            }
                            else{
                                day.classList.add('red-selected-left');
                            }
                        }
                        else {
                            if(prevselectedDaysZ.includes(days_of_month[prevMonth]) && i == first_day.getDay()) {
                                day.classList.add('red-selected');
                            }
                            else {
                                if (left)
                            {
                                day.classList.add('shaped-left-red-right');
                            }
                            else 
                            {  
                                day.classList.add('red-selected-right');
                            }
                            }
                        }
                        prevZ = true
                    }
                }
                else {
                    prevZ = false
                    if(right){
                        day.classList.add('shaped-selected-right');
                    }
                    if(left){
                        day.classList.add('shaped-selected-left');
                    }
                }
            
            })
            .catch(error => {
                console.error("Error fetching collections:", error)
            })

    

            if (firstmonth === month && secondmonth > month) {
                if (i - first_day.getDay() + 1 >= firstSelectedDate && i - first_day.getDay() + 1 <= days_of_month[firstmonth]) {
                    day.classList.add('selected-range');
                }
            }
            if (firstmonth < month && secondmonth === month) {
                if (i - first_day.getDay() + 1 >= 0 && i - first_day.getDay() + 1 <= secondSelectedDate) {
                    day.classList.add('selected-range');
                }
            }
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

document.querySelector('#prev-month').onclick = () => {
    curr_month.value=(12+curr_month.value-1)%12
    generateCalendar(curr_month.value, curr_year.value)
}

document.querySelector('#next-month').onclick = () => {
    curr_month.value=(curr_month.value+1)%12
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
        firstmonth=curr_month.value;
        secondmonth=curr_month.value;
        highlightRange(firstSelectedDate, firstSelectedDate);
    } else if (!secondSelectedDate) {
        secondSelectedDate = dayNumber;
        secondmonth= curr_month.value;
        highlightRange(firstSelectedDate, secondSelectedDate);
    } else {
        resetSelection();
        firstmonth=null;
        secondmonth=null;
        firstSelectedDate = null;
        secondSelectedDate = null;
    }
}


function highlightRange(start, end) {
    if(firstmonth===secondmonth){
    document.querySelectorAll('.calendar-days div').forEach(day => {
        const dayNumber = parseInt(day.textContent);
        if (dayNumber >= Math.min(start, end) && dayNumber <= Math.max(start, end)) {
            day.classList.add('selected-range');
        }
        
    });
    }
    else 
    {
        document.querySelectorAll('.calendar-days div').forEach(day => {
        
            const dayNumber = parseInt(day.textContent);
            if (dayNumber >= 0 && dayNumber <=  end) {
                day.classList.add('selected-range');
            }        
        });
    }
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
// document.querySelector('#przycisk').onclick = () => {
//     const modal = document.getElementById('reservationModal');
//     modal.style.display = 'block';

//     const closeModal = document.getElementById('closeModal');
//     closeModal.onclick = () => {
//         modal.style.display = 'none';
//     };

//     // Submit form logic
//     const form = document.getElementById('reservationForm');
//     form.onsubmit = (e) => {
//         e.preventDefault();

//         // Get user data
//         const email = document.getElementById('email').value;
//         const name = document.getElementById('name').value;
//         const phone = document.getElementById('phone').value;

//         if (email && name && phone) {
//             modal.style.display = 'none'; // Hide the modal

//             if (firstSelectedDate && secondSelectedDate) {
//                 let start = Math.min(firstSelectedDate, secondSelectedDate);
//                 let end = Math.max(firstSelectedDate, secondSelectedDate);

//                 let dateFields = {};

//                 for (let day = start; day <= end; day++) {
//                     dateFields[day] = { date: day, email, name, phone };
//                 }

//                 db.collection(curr_year.value.toString() + "_r").doc(curr_month.value.toString()).set(dateFields, { merge: true })
//                     .then(() => {
//                         alert(`Wybrany termin: od dnia ${firstSelectedDate} do dnia ${secondSelectedDate} został zarezerwowany.`);
//                         console.log("Dane zapisane:", dateFields);
//                     })
//                     .catch((error) => {
//                         console.error("Błąd przy zapisywaniu: ", error);
//                         alert("Wystąpił błąd przy zapisie. Spróbuj ponownie.");
//                     });
//             } else {
//                 alert("Proszę wybrać zakres dat przed potwierdzeniem.");
//                 console.log("Brak wybranego zakresu dat.");
//             }
//         } else {
//             alert("Proszę wypełnić wszystkie pola formularza.");
//         }
//     };
// };

document.querySelector('#przycisk').onclick = () => {
    const loadingModal = document.getElementById('loadingModal');
    loadingModal.style.display = 'none';

    const modal = document.getElementById('reservationModal');
    modal.style.display = 'block';

    const closeModal = document.getElementById('closeModal');
    closeModal.onclick = () => {
        modal.style.display = 'none';
    };

    // Submit form logic
    const form = document.getElementById('reservationForm');
    form.onsubmit = async (e) => {
        modal.style.display = 'none'; // Hide the modal
        loadingModal.style.display = 'block'; // Show loading modal
        e.preventDefault();
        // Get user data
        const email = document.getElementById('email').value;
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        if (email && name && phone) {
            if (firstSelectedDate && secondSelectedDate) {
                const startDate = firstSelectedDate; // Start date
                const endDate = secondSelectedDate;  // End date

                // Prepare JSON data
                const data = {
                    name: String(name),          // Wymuszenie na string
                    email: String(email),
                    phone: String(phone),
                    startDate: String(firstSelectedDate),
                    endDate: String(secondSelectedDate),
                  };
                try {
                    // Send HTTP POST request
                     const response = await fetch('https:///mailstah-26tpntak4-stahsons-projects.vercel.app/api/sendEmail', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            name: String(name),          // Wymuszenie na string
                            email: String(email),
                            phone: String(phone),
                            startDate: String(firstSelectedDate+'/'+(firstmonth+1).toString()+'/'+curr_year.value.toString()),
                            endDate: String(secondSelectedDate+'/'+(secondmonth+1).toString()+'/'+curr_year.value.toString()),
                            home: 'Dom Łabędzia'
                          })
                    });
                    
                } catch (error) {
                    
                }
                if (firstSelectedDate && secondSelectedDate) {
                    if(firstmonth==secondmonth){
                    let start = Math.min(firstSelectedDate, secondSelectedDate);
                    let end = Math.max(firstSelectedDate, secondSelectedDate);
    
                    let dateFields = {};
    
                    for (let day = start; day <= end; day++) {
                        dateFields[day] = { date: day, email, name, phone };
                    }
    
                    db.collection(curr_year.value.toString() + "l_r").doc(curr_month.value.toString()).set(dateFields, { merge: true })
                        .then(() => {
                            
                            console.log("Dane zapisane:", dateFields);
                        })
                        .catch((error) => {
                            console.error("Błąd przy zapisywaniu: ", error);
                            alert("Wystąpił błąd przy zapisie. Spróbuj ponownie.");
                        });
                    }
                    else
                    {
                        let days_of_month = [31, getFebDays(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
                        let dateFields_1 = {};
    
                    for (let day = firstSelectedDate; day <= days_of_month[firstmonth]; day++) {
                        dateFields_1[day] = { date: day, email, name, phone };
                    }
    
                    db.collection(curr_year.value.toString() + "l_r").doc(firstmonth.toString()).set(dateFields_1, { merge: true })
                        .then(() => {
                            
                            console.log("Dane zapisane:", dateFields_1);
                        })
                        .catch((error) => {
                            console.error("Błąd przy zapisywaniu: ", error);
                            alert("Wystąpił błąd przy zapisie. Spróbuj ponownie.");
                        });
                    
                    let dateFields_2 = {};
    
                    for (let day = 1; day <= secondSelectedDate; day++) {
                        dateFields_2[day] = { date: day, email, name, phone };
                    }
    
                    db.collection(curr_year.value.toString() + "l_r").doc(secondmonth.toString()).set(dateFields_2, { merge: true })
                        .then(() => {
                            
                            console.log("Dane zapisane:", dateFields_2);
                        })
                        .catch((error) => {
                            console.error("Błąd przy zapisywaniu: ", error);
                            alert("Wystąpił błąd przy zapisie. Spróbuj ponownie.");
                        });
                    }
                        
                } else {
                    alert("Proszę wybrać zakres dat przed potwierdzeniem.");
                    console.log("Brak wybranego zakresu dat.");
                }

                const loadingContent = document.getElementById('loadingContent');
                    loadingContent.innerHTML = `
                        <p>Wybrany termin: od dnia ${firstSelectedDate}/${(firstmonth+1)}/${curr_year.value} do dnia ${secondSelectedDate}/${(secondmonth+1)}/${curr_year.value} został zarezerwowany.</p>
                        <p>Został wysłany mail z potwierdzeniem na podany adres email.</p>
                        <p>Po kliknięciu przycisku zamknij kalendarz sam się zaktualizuje.</p>
                        <button id="closeLoadingModal" class="btnl">Zamknij</button>
                    `;
                    // Dodaj obsługę przycisku zamknięcia
                    document.getElementById('closeLoadingModal').onclick = () => {
                        loadingModal.style.display = 'none';
                        generateCalendar(curr_month.value, curr_year.value); 
                    };

                modal.style.display = 'none'; // Hide the modal
            } else {
                alert("Proszę wybrać zakres dat przed potwierdzeniem.");
                console.log("Brak wybranego zakresu dat.");
            }
        } else {
            alert("Proszę wypełnić wszystkie pola formularza.");
        }
    };
};

