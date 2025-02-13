

document.addEventListener('DOMContentLoaded', function () {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let currentDate = new Date();
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let currentView = "month"; 
    const monthYearDisplay = document.getElementById('monthYear');
    const prevMonthButton = document.getElementById('prevMonth');
    const nextMonthButton = document.getElementById('nextMonth');
    const calendarContainer = document.getElementById('calendar-container');



    function renderCalendar(month, year, view = "month") {
        monthYearDisplay.textContent = `${months[month]} ${year}`;
        calendarContainer.innerHTML = ''; // Clear previous content
    
        if (view === "month") {
            renderMonthView(month, year);
        } else if (view === "week") {
            renderWeekView();
        } else if (view === "day") {
            renderDayView();
        }
    }
    
    function renderMonthView(month, year) {
        let daysHeader = document.createElement('div');
        daysHeader.className = 'days-header';
        days.forEach(day => {
            let dayDiv = document.createElement('div');
            dayDiv.className = 'day header-day';
            dayDiv.textContent = day;
            daysHeader.appendChild(dayDiv);
        });
        calendarContainer.appendChild(daysHeader);
    
        let daysDiv = document.createElement('div');
        daysDiv.className = 'days-container';
        let date = new Date(year, month, 1);
        
    
        for (let i = 0; i < date.getDay(); i++) {
            let emptyDayDiv = document.createElement('div');
            emptyDayDiv.className = 'day';
            daysDiv.appendChild(emptyDayDiv);
        }
    
        while (date.getMonth() === month) {
            let dayDiv = document.createElement('div');
            dayDiv.className = 'day';
            dayDiv.textContent = date.getDate();
    
            if (date.getDate() === currentDate.getDate() &&
                date.getMonth() === currentDate.getMonth() &&
                date.getFullYear() === currentDate.getFullYear()) {
                dayDiv.classList.add('current-day');
            }
    
            daysDiv.appendChild(dayDiv);
            date.setDate(date.getDate() + 1);
        }
    
        calendarContainer.appendChild(daysDiv);
    }
    
    function renderWeekView() {
        let weekDiv = document.createElement('div');
        weekDiv.className = 'week-container';
    
        let startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
        for (let i = 0; i < 7; i++) {
            let dayDiv = document.createElement('div');
            dayDiv.className = 'day';
            dayDiv.textContent = `${days[startOfWeek.getDay()]} ${startOfWeek.getDate()}`;
    
            if (startOfWeek.toDateString() === new Date().toDateString()) {
                dayDiv.classList.add('current-day');
            }
    
            weekDiv.appendChild(dayDiv);
            startOfWeek.setDate(startOfWeek.getDate() + 1);
        }
    
        calendarContainer.appendChild(weekDiv);
    }
    
    function renderDayView() {
        calendarContainer.innerHTML = ''; 

        let dayHeader = document.createElement('div');
        dayHeader.className = 'day-header';
        dayHeader.textContent = `${days[currentDate.getDay()]}, ${currentDate.getDate()}`;
        calendarContainer.appendChild(dayHeader);
    
        let daySchedule = document.createElement('div');
        daySchedule.className = 'day-schedule';
    
        for (let hour = 0; hour < 24; hour++) {
            let timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot';
            let formattedHour = hour.toString().padStart(2, '0') + ":00";
    
            timeSlot.innerHTML = `<span class="time-label">${formattedHour}</span> <span class="event"></span>`;
            daySchedule.appendChild(timeSlot);
        }
    
        calendarContainer.appendChild(daySchedule);
    }
    




    prevMonthButton.onclick = function () {
        if (currentMonth === 0) {
            currentMonth = 11;
            currentYear -= 1;
        } else {
            currentMonth -= 1;
        }
        renderCalendar(currentMonth, currentYear);
    };

    nextMonthButton.onclick = function () {
        if (currentMonth === 11) {
            currentMonth = 0;
            currentYear += 1;
        } else {
            currentMonth += 1;
        }
        renderCalendar(currentMonth, currentYear);
    };

    document.getElementById('monthView').onclick = function () {
        currentView = "month";
        renderCalendar(currentMonth, currentYear, "month");
    };

    document.getElementById('weekView').onclick = function () {
        currentView = "week";
        renderCalendar(currentMonth, currentYear, "week");
    };

    document.getElementById('dayView').onclick = function () {
        currentView = "day";
        renderCalendar(currentMonth, currentYear, "day");
    };



    let name = "teehee";
    let description = "somebs";
    let priority = -999;
    let date = 1;


    renderCalendar(currentMonth, currentYear);
    console.log(currentMonth + " of " + currentYear);


    makeEvent.onclick = function () {

        fetch('http://127.0.0.1:5000/add_event?name=' + name + '&description=' + description + '&priority=' + priority + '&date=' + date)
            .then((response) => {
                return response.json();
            })
            .then((myJson) => {
                console.log("When I make event I get id: " + myJson.event);
            });
    };

    fetch('http://127.0.0.1:5000/add_event?name=' + name + '&description=' + description + '&priority=' + priority + '&date=' + date)
        .then((response) => {
            return response.json();
        })
        .then((myJson) => {
            console.log("When I make event I get id: " + myJson.event);
        });


});



