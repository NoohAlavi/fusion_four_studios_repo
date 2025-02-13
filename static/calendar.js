document.addEventListener('DOMContentLoaded', function() {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonthIndex = today.getMonth();
    const currentYearValue = today.getFullYear();
    
    const monthYearDisplay = document.getElementById('monthYear');
    const prevMonthButton = document.getElementById('prevMonth');
    const nextMonthButton = document.getElementById('nextMonth');

    const eventModeButton = document.getElementById('eventModeButton');
    const taskModeButton = document.getElementById('taskModeButton');
    const manageTitle = document.getElementById('manageTitle');  
    const itemList = document.getElementById('itemList');
    const addItemButton = document.getElementById('addItemButton');
    const itemModal = document.getElementById('itemModal');
    const closeModal = document.getElementById('closeModal');
    const modalTitle = document.getElementById('modalTitle');
    const eventForm = document.getElementById('eventForm');
    const taskForm = document.getElementById('taskForm');
    const eventTitleInput = document.getElementById('eventTitle');
    const eventDateInput = document.getElementById('eventDate');
    const taskTitleInput = document.getElementById('taskTitle');
    const taskDueDateInput = document.getElementById('taskDueDate');
    
    let currentMode = 'event'; 
    let events = [];
    let tasks = [];
    
    function renderCalendar(month, year) {
        monthYearDisplay.textContent = `${months[month]} ${year}`;
        let calendarContainer = document.getElementById('calendar-container');
        calendarContainer.innerHTML = '';  
        
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
            
            if (date.getDate() === currentDay && date.getMonth() === currentMonthIndex && date.getFullYear() === currentYearValue) {
                dayDiv.classList.add('current-day');
            }
            
            daysDiv.appendChild(dayDiv);
            date.setDate(date.getDate() + 1);
        }
        
        calendarContainer.appendChild(daysDiv);
    }
    
    eventModeButton.addEventListener('click', function() {
        currentMode = 'event';
        manageTitle.textContent = 'Manage Event';  
        modalTitle.textContent = 'Add Event';
        eventForm.style.display = 'block';
        taskForm.style.display = 'none';
        renderSidebar();
    });
    
    taskModeButton.addEventListener('click', function() {
        currentMode = 'task';
        manageTitle.textContent = 'Manage Task';  
        modalTitle.textContent = 'Add Task';
        taskForm.style.display = 'block';
        eventForm.style.display = 'none';
        renderSidebar();
    });
    
    addItemButton.addEventListener('click', function() {
        itemModal.style.display = 'block';
    });
    
    closeModal.addEventListener('click', function() {
        itemModal.style.display = 'none';
    });
    
    function addItemToSidebar(item) {
        const li = document.createElement('li');
        li.textContent = `${item.title} - ${item.date}`;
        itemList.appendChild(li);
    }
    
    function renderSidebar() {
        itemList.innerHTML = '';  
        let items = currentMode === 'event' ? events : tasks;
        
        items.forEach(item => {
            addItemToSidebar(item);
        });
    }
    
    eventForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const title = eventTitleInput.value;
        const date = eventDateInput.value;
        const newEvent = { title, date };
        events.push(newEvent);
        renderSidebar();
        itemModal.style.display = 'none';
        eventForm.reset();
    });
    
    taskForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const title = taskTitleInput.value;
        const dueDate = taskDueDateInput.value;
        const newTask = { title, date: dueDate };
        tasks.push(newTask);
        renderSidebar();
        itemModal.style.display = 'none';
        taskForm.reset();
    });
    
    prevMonthButton.addEventListener('click', function() {
        if (currentMonth === 0) {
            currentMonth = 11;
            currentYear--;
        } else {
            currentMonth--;
        }
        renderCalendar(currentMonth, currentYear);
    });
    
    nextMonthButton.addEventListener('click', function() {
        if (currentMonth === 11) {
            currentMonth = 0;
            currentYear++;
        } else {
            currentMonth++;
        }
        renderCalendar(currentMonth, currentYear);
    });
    
    renderCalendar(currentMonth, currentYear); 
    renderSidebar(); 
});
