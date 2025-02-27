document.addEventListener('DOMContentLoaded', function () {
    //Calendar Setup and Initiialisation 
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
    const today = new Date();
    let viewDate = new Date();
  
    let currentView = "month"; //Possible views: 'month', 'week', 'day'
    
    //Get elements for calendar navigation and control
    const monthYearDisplay = document.getElementById('monthYear');
    const prevMonthButton = document.getElementById('prevMonth');
    const nextMonthButton = document.getElementById('nextMonth');
    const calendarContainer = document.getElementById('calendar-container');
  

    //Calendar rendering logic

    //Main function to render calendar based on the current view
    function renderCalendar() {
      monthYearDisplay.textContent = `${months[viewDate.getMonth()]} ${viewDate.getFullYear()}`;
      calendarContainer.innerHTML = ''; 
  
      if (currentView === "month") {
        renderMonthView(viewDate.getMonth(), viewDate.getFullYear());
      } else if (currentView === "week") {
        renderWeekView();
      } else if (currentView === "day") {
        renderDayView();
      }
    }
  
    //Render the calendar in month view
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

      //Add empty slots before the first day
      for (let i = 0; i < date.getDay(); i++) {
        let emptyDayDiv = document.createElement('div');
        emptyDayDiv.className = 'day';
        daysDiv.appendChild(emptyDayDiv);
      }
      
      //Render the actual days of the month
      while (date.getMonth() === month) {
        let dayDiv = document.createElement('div');
        dayDiv.className = 'day';
        dayDiv.textContent = date.getDate();
        
        //Highlight the current day
        if (date.toDateString() === today.toDateString()) {
          dayDiv.classList.add('current-day');
        }
  
        daysDiv.appendChild(dayDiv);
        date.setDate(date.getDate() + 1);
      }
  
      calendarContainer.appendChild(daysDiv);
    }
    
    //Render the calendar in the week view
    function renderWeekView() {
      let weekDiv = document.createElement('div');
      weekDiv.className = 'week-container';
  
      // Get the start of the week (Sunday)
      let startOfWeek = new Date(viewDate);
      startOfWeek.setDate(viewDate.getDate() - viewDate.getDay());
      
      //Display each day of the week
      for (let i = 0; i < 7; i++) {
        let dayDiv = document.createElement('div');
        dayDiv.className = 'day';
        dayDiv.textContent = `${days[startOfWeek.getDay()]} ${startOfWeek.getDate()}`;
  
        //Highlight the current day
        if (startOfWeek.toDateString() === today.toDateString()) {
          dayDiv.classList.add('current-day');
        }
  
        weekDiv.appendChild(dayDiv);
        startOfWeek.setDate(startOfWeek.getDate() + 1);
      }
  
      calendarContainer.appendChild(weekDiv);
    }
    
    //Render the calendar in the day view
    function renderDayView() {
      calendarContainer.innerHTML = '';
      
      //Display the current day header
      let dayHeader = document.createElement('div');
      dayHeader.className = 'day-header';
      dayHeader.textContent = `${days[viewDate.getDay()]}, ${viewDate.getDate()}`;
      calendarContainer.appendChild(dayHeader);
  
      let daySchedule = document.createElement('div');
      daySchedule.className = 'day-schedule two-columns';
      
      //Create two different column for morning and evening
      let morningColumn = document.createElement('div');
      morningColumn.className = 'half-day';
      let eveningColumn = document.createElement('div');
      eveningColumn.className = 'half-day';
  
      //CReate time slots for each hour of the day
      for (let hour = 0; hour < 24; hour++) {
        let timeSlot = document.createElement('div');
        timeSlot.className = 'time-slot';
        let formattedHour = (hour % 12 || 12) + (hour < 12 ? " AM" : " PM");
        timeSlot.innerHTML = `<span class="time-label">${formattedHour}</span> <span class="event"></span>`;
  
        if (hour < 12) {
          morningColumn.appendChild(timeSlot);
        } else {
          eveningColumn.appendChild(timeSlot);
        }
      }
  
      daySchedule.appendChild(morningColumn);
      daySchedule.appendChild(eveningColumn);
      calendarContainer.appendChild(daySchedule);
    }
    
    //Navigation Controls

    //Navigate to the previous time period
    prevMonthButton.onclick = function () {
      if (currentView === "month") {
        if (viewDate.getMonth() === 0) {
          viewDate.setMonth(11);
          viewDate.setFullYear(viewDate.getFullYear() - 1);
        } else {
          viewDate.setMonth(viewDate.getMonth() - 1);
        }
      } else if (currentView === "week") {
        viewDate.setDate(viewDate.getDate() - 7);
      } else if (currentView === "day") {
        viewDate.setDate(viewDate.getDate() - 1);
      }
      renderCalendar();
    };
  
    //Navigate to the next time period
    nextMonthButton.onclick = function () {
      if (currentView === "month") {
        if (viewDate.getMonth() === 11) {
          viewDate.setMonth(0);
          viewDate.setFullYear(viewDate.getFullYear() + 1);
        } else {
          viewDate.setMonth(viewDate.getMonth() + 1);
        }
      } else if (currentView === "week") {
        viewDate.setDate(viewDate.getDate() + 7);
      } else if (currentView === "day") {
        viewDate.setDate(viewDate.getDate() + 1);
      }
      renderCalendar();
    };
  
    // View change buttons
    document.getElementById('monthView').onclick = function () {
      currentView = "month";
      viewDate = new Date();
      renderCalendar();
    };
  
    document.getElementById('weekView').onclick = function () {
      currentView = "week";
      viewDate = new Date();
      renderCalendar();
    };
  
    document.getElementById('dayView').onclick = function () {
      currentView = "day";
      viewDate = new Date();
      renderCalendar();
    };
  
    renderCalendar();
  
    // Modal Handling for Adding Events/Tasks
    const modal = document.getElementById('modal');
    const openModalBtn = document.getElementById('openModal');
    const closeModalSpan = document.querySelector('.modal .close');
    
    openModalBtn.addEventListener('click', function () {
      modal.style.display = 'block';
    });
  
    closeModalSpan.addEventListener('click', function () {
      modal.style.display = 'none';
    });
  
    window.addEventListener('click', function (event) {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
  
    //Switch between Event and Task fields based on selection
    document.getElementById('type').addEventListener('change', function () {
      if (this.value === 'event') {
        document.getElementById('eventFields').style.display = 'block';
        document.getElementById('taskFields').style.display = 'none';
      } else {
        document.getElementById('eventFields').style.display = 'none';
        document.getElementById('taskFields').style.display = 'block';
      }
    });
  
    //Handle form submission for adding events/tasks
    document.getElementById('eventTaskForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const type = document.getElementById('type').value;
        const title = document.getElementById('title').value;
        let displayText = title;
    
        if (type === 'event') {
          const startTime = document.getElementById('startTime').value;
          const endTime = document.getElementById('endTime').value;
          const startDisplay = new Date(startTime).toLocaleString();
          const endDisplay = new Date(endTime).toLocaleString();
          displayText += `: ${startDisplay} - ${endDisplay}`;
        } else {
          const deadline = document.getElementById('deadline').value;
          const deadlineDisplay = new Date(deadline).toLocaleString();
          displayText += `: Due ${deadlineDisplay}`;
        }
    
        const li = document.createElement('li');
        li.textContent = displayText;
        const list = document.getElementById('eventTaskList');
        list.appendChild(li);
        
        //Log to console for debugging
        console.log('Event added:', displayText, 'Total items:', list.childElementCount);
    
        this.reset();
        document.getElementById('eventFields').style.display = 'block';
        document.getElementById('taskFields').style.display = 'none';
    
        modal.style.display = 'none';
    });
  });
  