/*
  Authors: Johathan Lavoie, Mason Cacheino, Nooh Alavi, Rahif Haffeez, Shawn Xiao
  Date: February 6th, 2025
  Filename: calendar.js
  Description: Contains the logic for rendering and managing the calendar interface.
*/

document.addEventListener('DOMContentLoaded', function () {
  //Calendar Setup and Intialization 
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const today = new Date();
  let viewDate = new Date();

  let currentView = "month"; //Possible views: 'month', 'week', 'day'

  //Get elements for calendar navigation and control
  const monthYearDisplay = document.getElementById('monthYear');
  const prevPeriodButton = document.getElementById('prevPeriod');
  const nextPeriodButton = document.getElementById('nextPeriod');
  const calendarContainer = document.getElementById('calendar-container');

  //Elements for task and event modals.
  const eventModal = document.getElementById("eventModal");
  const taskModal = document.getElementById("taskModal");
  const openEventModalBtn = document.getElementById("openEventModal");
  const openTaskModalBtn = document.getElementById("openTaskModal");
  const closeButtons = document.querySelectorAll(".modal .close");

  //Elements for file upload
  const eventFileInput = document.getElementById('eventFile');
  const taskFileInput = document.getElementById('taskFile');

  //Calendar rendering logic

  //Main function to render calendar based on the current view
  function renderCalendar() {
    monthYearDisplay.textContent = `${months[viewDate.getMonth()]} ${viewDate.getFullYear()}`;
    calendarContainer.innerHTML = '';
    fetchEventsAndTasks();
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
      dayDiv.style.textAlign = 'left';
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

    //Create time slots for each hour of the day
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
  prevPeriodButton.onclick = function () {
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
  nextPeriodButton.onclick = function () {
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

  //Event Modal
  openEventModalBtn.addEventListener("click", function () {
    eventModal.style.display = "block";
  });

  //Task Modal
  openTaskModalBtn.addEventListener("click", function () {
    taskModal.style.display = "block";
  });

  closeButtons.forEach(button => {
    button.addEventListener("click", function () {
      eventModal.style.display = "none";
      taskModal.style.display = "none";
    });
  });

  window.addEventListener("click", function (event) {
    if (event.target === eventModal) {
      eventModal.style.display = "none";
    }
    if (event.target === taskModal) {
      taskModal.style.display = "none";
    }
  });

  //Handle file upload for Event
  eventFileInput.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_type', 'event'); 
      
      fetch('/upload_file', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          fillEventFormWithExtractedData(data.data);
        } else {
          alert(`Error: ${data.message}`);
        }
      })
      .catch(error => console.error('Error uploading file:', error));
    }
  });

  //Handle file upload for Task
  taskFileInput.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_type', 'task'); 
      
      fetch('/upload_file', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          fillTaskFormWithExtractedData(data.data);
        } else {
          alert(`Error: ${data.message}`);
        }
      })
      .catch(error => console.error('Error uploading file:', error));
    }
  });

  //FIll event form with extarcted data
  function fillEventFormWithExtractedData(data) {
    document.getElementById('eventTitle').value = data.name || '';
    document.getElementById('eventNotes').value = data.description || '';
    document.getElementById('location').value = data.location || '';
    document.getElementById('startTime').value = data.start_datetime || '';
    document.getElementById('endTime').value = data.end_datetime || '';
    document.getElementById('eventPriority').value = data.priority || '2';  // Default: Medium
    document.getElementById('repeat').value = data.repeatability || 'none';  // Default: none
    document.getElementById('eventColour').value = data.colour || '#0000FF';  // Default: Blue
  }

  //Fill task form with extracted data
  function fillTaskFormWithExtractedData(data) {
    document.getElementById('taskTitle').value = data.name || '';
    document.getElementById('taskNotes').value = data.description || '';
    document.getElementById('deadline').value = data.deadline || '';
    document.getElementById('taskPriority').value = data.priority || '2';  // Default: Medium
    document.getElementById('taskColour').value = data.colour || '#0000FF';  // Default: Blue
  }

  //Grabs the csv data from the backend
  async function fetchEventsAndTasks(){
    try{
      const eventsResponse = await fetch('get_events');
      const tasksResponse = await fetch('/get_tasks');

      const eventsData = await eventsResponse.json();
      const tasksData = await tasksResponse.json();

      renderEvents(eventsData.events.slice(1));
      renderTasks(tasksData.tasks.slice(1));
    }catch(error){
      console.error('Error fetching event and tasks:', error);
    }
  }

  //Render the events
  function renderEvents(events){
    const eventList = document.getElementById('eventList');
    eventList.innerHTML = '';
    
    events.forEach(event => {
      const eventContainer = document.createElement('div');
      eventContainer.style.display = 'flex';
      eventContainer.style.alignItems = 'center';
  
      const delBtn = document.createElement('div');
      delBtn.textContent = '🗑️';
      delBtn.style.marginRight = '8px';
      delBtn.style.marginLeft = '4px';
      delBtn.style.cursor = 'pointer';

      delBtn.id = event[0]; // Gets the ID of the event, so that it can be modified/deleted later on
  
      const optionsBtn = document.createElement('div');
      optionsBtn.textContent = '✏️';
      optionsBtn.style.marginRight = '8px';
      optionsBtn.style.cursor = 'pointer';
  
      const li = document.createElement('li');
      li.textContent = `${event[2]}: ${new Date(event[7]).toLocaleString()} - ${new Date(event[8]).toLocaleString()}`;
      li.style.listStyle = 'none';
  
      eventContainer.appendChild(delBtn);
      eventContainer.appendChild(optionsBtn);
      eventContainer.appendChild(li);
  
      eventList.appendChild(eventContainer);
  });
  
  }

  //Render the tasks
  function renderTasks(tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    
    tasks.forEach(task => {
      const taskContainer = document.createElement('div');
      taskContainer.style.display = 'flex';
      taskContainer.style.alignItems = 'center';
  
      const delBtn = document.createElement('div');
      delBtn.textContent = '🗑️';
      delBtn.style.marginRight = '8px';
      delBtn.style.marginLeft = '4px';
      delBtn.style.cursor = 'pointer';
      
      delBtn.id = task[0]; // Gets the ID of the event, so that it can be modified/deleted later on

      const optionsBtn = document.createElement('div');
      optionsBtn.textContent = '✏️';
      optionsBtn.style.marginRight = '8px';
      optionsBtn.style.cursor = 'pointer';
  
      const li = document.createElement('li');
      li.textContent = `${task[2]}: ${new Date(task[5]).toLocaleString()}`;
      li.style.listStyle = 'none';
  
      taskContainer.appendChild(delBtn);
      taskContainer.appendChild(optionsBtn);
      taskContainer.appendChild(li);
  
      taskList.appendChild(taskContainer);
  });
  
  } 

  //Handle Event Submission
  document.getElementById('eventForm').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const title = document.getElementById('eventTitle').value;
    const notes = document.getElementById('eventNotes').value;
    const eventLocation = document.getElementById('location').value;
    const eventPriority = document.getElementById('eventPriority').value;
    const eventRepeat = document.getElementById('repeat').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const colour = document.getElementById('eventColour').value;
  
    if (!title || !startTime || !endTime) {
      alert("Please fill in all fields for the event.");
      return;
    }
  
    // Prepare data for the POST request
    const eventData = {
      name: title,
      description: notes,
      priority: eventPriority,
      location: eventLocation,
      repeatability: eventRepeat,
      start_datetime: startTime,
      end_datetime: endTime,
      colour: colour
    };
  
    fetch('/add_event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    })
    .then(() => {
      const li = document.createElement('li');
      li.textContent = `${title}: ${new Date(startTime).toLocaleString()} - ${new Date(endTime).toLocaleString()}`;
      document.getElementById('eventList').appendChild(li);
      eventModal.style.display = "none";
      this.reset();
    }) 
    .catch(error => console.error('Error adding event:', error));
  });  

  //Handle Task Submission
  document.getElementById('taskForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskNotes').value;
    const taskDeadline = document.getElementById('deadline').value;
    const priority = document.getElementById('taskPriority').value;
    const colour = document.getElementById('taskColour').value;

    if (!title || !deadline) {
      alert("Please fill in all fields for the task.");
      return;
    }

    //Prepare data for the POST request
    const taskData = {
      name: title,
      description: description,
      deadline: taskDeadline,
      priority: priority,
      colour: colour
    }

    fetch('/add_task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    })
    .then(response => response.json())

    .then(() => {
      // On success, append the task to the task list
      const li = document.createElement('li');
      li.textContent = `${title}: Due ${new Date(taskDeadline).toLocaleString()}`;
      document.getElementById('taskList').appendChild(li);
      taskModal.style.display = "none";
      this.reset();
    })
    .catch(error => console.error('Error adding task:', error));
  });

  const viewButtons = document.querySelectorAll(".viewControls button");

  viewButtons.forEach(button => {
    button.addEventListener("click", function () {
      // Remove 'active' from all buttons
      viewButtons.forEach(btn => btn.classList.remove("active"));

      // Add 'active' to the clicked button
      this.classList.add("active");
    });
  });
});