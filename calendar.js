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

        for (let i = 0; i < date.getDay(); i++) {
            let emptyDayDiv = document.createElement('div');
            emptyDayDiv.className = 'day';
            daysDiv.appendChild(emptyDayDiv);
        }

        while (date.getMonth() === month) {
            let dayDiv = document.createElement('div');
            dayDiv.className = 'day';
            dayDiv.textContent = date.getDate();
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

    renderCalendar(currentMonth, currentYear); // Initial render for the current month
});
