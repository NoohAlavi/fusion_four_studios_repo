document.addEventListener('DOMContentLoaded', function() {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    const monthYearDisplay = document.getElementById('monthYear');
    const prevMonthButton = document.getElementById('prevMonth');
    const nextMonthButton = document.getElementById('nextMonth');

    function renderCalendar(month, year) {
        monthYearDisplay.textContent = `${months[month]} ${year}`;
        let calendarContainer = document.getElementById('calendar-container');
        calendarContainer.innerHTML = ''; // Clear previous content
    
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
        let currentDate = new Date(); // Define currentDate here
    
        for (let i = 0; i < date.getDay(); i++) {
            let emptyDayDiv = document.createElement('div');
            emptyDayDiv.className = 'day';
            daysDiv.appendChild(emptyDayDiv);
        }
    
        while (date.getMonth() === month) {
            let dayDiv = document.createElement('div');
            dayDiv.className = 'day';
            dayDiv.textContent = date.getDate();
    
            if (date.getDate() === currentDate.getDate() && date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear()) {
                dayDiv.classList.add('current-day');
            }
    
            daysDiv.appendChild(dayDiv);
            date.setDate(date.getDate() + 1);
        }
    
        calendarContainer.appendChild(daysDiv);
    }

    prevMonthButton.onclick = function() {
        if (currentMonth === 0) {
            currentMonth = 11;
            currentYear -= 1;
        } else {
            currentMonth -= 1;
        }
        renderCalendar(currentMonth, currentYear);
    };

    nextMonthButton.onclick = function() {
        if (currentMonth === 11) {
            currentMonth = 0;
            currentYear += 1;
        } else {
            currentMonth += 1;
        }
        renderCalendar(currentMonth, currentYear);
    };

    let name = "teehee";
    let description = "somebs";
    let priority = -999;
    let date = 1;

    makeEvent.onclick = function() {

        fetch('http://127.0.0.1:5000/add_event?name='+name+'&description='+description+'&priority='+priority+'&date='+date)
        .then((response) => {
          return response.json();
        })
        .then((myJson) => {
          console.log("When I make event I get id: " + myJson.event);
        });
    };

    fetch('http://127.0.0.1:5000/add_event?name='+name+'&description='+description+'&priority='+priority+'&date='+date)
  .then((response) => {
    return response.json();
  })
  .then((myJson) => {
    console.log("When I make event I get id: " + myJson.event);
  });

    renderCalendar(currentMonth, currentYear); // Initial render for the current month
});
