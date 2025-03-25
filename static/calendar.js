/*
  Authors: Johathan Lavoie, Mason Cacheino, Nooh Alavi, Rahif Haffeez, Shawn Xiao
  Date: February 6th, 2025
  Filename: calendar.js
  Description: Contains the logic for rendering and managing the calendar interface.
*/

document.addEventListener('DOMContentLoaded', function () {
  //Calendar Setup and Initialization 
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
  const dayDropdown = document.getElementById("start-of-week-dropdown");
  const saveButton = document.getElementById("save-day")

  //Elements for event panel
  const confirmDateButton = document.getElementById('goToDate');
  const datePicker = document.getElementById('datePicker');
  const searchBar = document.getElementById("searchBar");
  const eventList = document.getElementById("eventList");
  const taskList = document.getElementById("taskList");
  
  //Elements for task and event modals.
  const eventModal = document.getElementById("eventModal");
  const taskModal = document.getElementById("taskModal");
  const infoModal = document.getElementById("infoModal");
  const openEventModalBtn = document.getElementById("openEventModal");
  const openTaskModalBtn = document.getElementById("openTaskModal");
  const closeButtons = document.querySelectorAll(".modal .close");

  //Elements for file upload
  const eventFileInput = document.getElementById('eventFile');
  const taskFileInput = document.getElementById('taskFile');

  //Main function to render calendar based on the current view
  function renderCalendar() {
    monthYearDisplay.textContent = `${months[viewDate.getMonth()]} ${viewDate.getFullYear()}`;
    calendarContainer.innerHTML = '';
    fetchEventsAndTasks();

    const startOfWeek = dayDropdown.value;
    console.log(days.indexOf(startOfWeek))
    const startDayIndex = days.indexOf(startOfWeek);

    if (currentView === "month") {
      renderMonthView(viewDate.getMonth(), viewDate.getFullYear(), startDayIndex);
    } else if (currentView === "week") {
      renderWeekView(startDayIndex);
    } else if (currentView === "day") {
      renderDayView();
    }
  }

  //Grab current start of the week from data
  fetch('/get_start_of_week')
    .then(response => response.json())
    .then(data => {
      dayDropdown.value = data.startOfWeek;
      renderCalendar();
    });

  //Render the calendar in month view
  function renderMonthView(month, year, startDayIndex) {
    let daysHeader = document.createElement('div');
    daysHeader.className = 'days-header';

    //Rearrange days based on the selected start of the week
    let reorderedDays = [...days.slice(startDayIndex), ...days.slice(0, startDayIndex)];

    reorderedDays.forEach(day => {
      let dayDiv = document.createElement('div');
      dayDiv.className = 'day header-day';
      dayDiv.textContent = day;
      daysHeader.appendChild(dayDiv);
    });

    calendarContainer.appendChild(daysHeader);

    let daysDiv = document.createElement('div');
    daysDiv.className = 'days-container';
    let date = new Date(year, month, 1);

    //Add empty slots before the first day based on the selected start of the week
    for (let i = 0; i < (date.getDay() - startDayIndex + 7) % 7; i++) {
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
  function renderWeekView(startDayIndex) {
    let weekDiv = document.createElement('div');
    weekDiv.className = 'week-container';

    let startOfWeek = new Date(viewDate);
    //Adjust the start day based on the selected start day
    startOfWeek.setDate(viewDate.getDate() - (viewDate.getDay() - startDayIndex + 7) % 7); //Adjust the start of the week

    //Display each day of the week with correct start day
    for (let i = 0; i < 7; i++) {
      let dayDiv = document.createElement('div');
      dayDiv.style.textAlign = 'left';
      dayDiv.className = 'day';

      //Display the correct day name and date
      dayDiv.textContent = `${days[startOfWeek.getDay()]} ${startOfWeek.getDate()}`;

      //Highlight the current day
      if (startOfWeek.toDateString() === today.toDateString()) {
        dayDiv.classList.add('current-day');
      }

      weekDiv.appendChild(dayDiv);
      startOfWeek.setDate(startOfWeek.getDate() + 1); //Move to the next day
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

    //Create two columns for morning and evening
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

  //View change buttons
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

  //Whenever the dropdown changes, update the calendar.
  dayDropdown.addEventListener('change', function () {
    renderCalendar();
  });

  //Switch calendar to selected date
  confirmDateButton.addEventListener('click', function () {
    const selectedDate = datePicker.value;
    if (selectedDate) {
      viewDate = new Date(selectedDate);
      renderCalendar();
    } else {
      alert("Make sure to fill out the date.")
    }
  });

  //Save the day to the config file
  saveButton.addEventListener('click', () => {
    const selectedDay = dayDropdown.value;

    fetch('/save_start_of_week', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ startOfWeek: selectedDay })
    })
      .then(response => response.json(), renderCalendar)
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to save start of the week');
      });
  });

  //Event/Task Panel 
  
  //Event Modal
  openEventModalBtn.addEventListener("click", function () {
    eventModal.style.display = "block";
  });

  //Task Modal
  openTaskModalBtn.addEventListener("click", function () {
    taskModal.style.display = "block";
  });

  //Handle closing for modals
  closeButtons.forEach(button => {
    button.addEventListener("click", function () {
      eventModal.style.display = "none";
      taskModal.style.display = "none";
      infoModal.style.display = "none";
    });
  });

  window.addEventListener("click", function (event) {
    if (event.target === eventModal) eventModal.style.display = "none";
    if (event.target === taskModal) taskModal.style.display = "none";
    if (event.target === infoModal) infoModal.style.display = "none";
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

  //Fill event form with extracted data
  function fillEventFormWithExtractedData(data) {
    document.getElementById('eventId').value = data.id || '';
    document.getElementById('eventTitle').value = data.name || '';
    document.getElementById('eventNotes').value = data.description || '';
    document.getElementById('location').value = data.location || '';
    document.getElementById('startTime').value = data.start_datetime || '';
    document.getElementById('endTime').value = data.end_datetime || '';
    document.getElementById('eventPriority').value = data.priority || '2';
    document.getElementById('repeat').value = data.repeatability || 'none';
    document.getElementById('eventColour').value = data.colour || '#0000FF';
  }

  //Fill task form with extracted data
  function fillTaskFormWithExtractedData(data) {
    document.getElementById('taskId').value = data.id || '';
    document.getElementById('taskTitle').value = data.name || '';
    document.getElementById('taskNotes').value = data.description || '';
    document.getElementById('deadline').value = data.deadline || '';
    document.getElementById('taskPriority').value = data.priority || '2';
    document.getElementById('taskColour').value = data.colour || '#0000FF';
  }

  //Grabs the csv data from the backend
  async function fetchEventsAndTasks() {
    try {
      const eventsResponse = await fetch('/get_events');
      if (!eventsResponse.ok) throw new Error('Failed to fetch events.');
      const tasksResponse = await fetch('/get_tasks');
      if (!tasksResponse.ok) throw new Error('Failed to fetch tasks.');

      const eventsData = await eventsResponse.json();
      const tasksData = await tasksResponse.json();

      renderEvents(eventsData.events.slice(1));
      renderTasks(tasksData.tasks.slice(1));
    } catch (error) {
      console.error('Error fetching event and tasks:', error);
    }
  }

  //Create the buttons for events/tasks
  function createButton(icon, marginRight, marginLeft, onClick) {
    const btn = document.createElement('div');
    btn.textContent = icon;
    btn.style.marginRight = `${marginRight}px`;
    btn.style.marginLeft = `${marginLeft}px`;
    btn.style.cursor = 'pointer';
    btn.addEventListener('click', onClick);
    return btn;
  }

  //Render the events
  function renderEvents(events) {
    const eventList = document.getElementById('eventList');
    eventList.innerHTML = '';

    events.forEach(event => {
      const eventContainer = document.createElement('div');
      eventContainer.style.display = 'flex';
      eventContainer.style.alignItems = 'center';

      //Delete Button
      const delBtn = createButton('🗑️', 8, 4, () => {
        if (confirm('Are you sure you want to delete this event?')) {
          fetch('/remove_event', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: event[0] }),
          })
            .then(() => eventContainer.remove())
            .catch(error => console.error('Error deleting event:', error));
        }
      });

      //Edit Button
      const editBtn = createButton('✏️', 8, 0, () => {
        fillEventFormWithExtractedData({
          id: event[0],
          name: event[2],
          description: event[3],
          priority: event[4],
          location: event[5],
          repeatability: event[6],
          start_datetime: event[7],
          end_datetime: event[8],
          colour: event[9]
        });
        eventModal.style.display = "block";
      });

      //Info Button
      const infoBtn = createButton('ℹ️', 8, 0, () => {
        let locationHTML = event[5] ? `<p><strong>Location:</strong> ${event[5]}</p>` : "";
        let descriptionHTML = event[3] ? `<p><strong>Description:</strong> ${event[3]}</p>` : "";
        let priorityText = "Unknown";
        if (event[4] === "1") {
          priorityText = "Low";
        } else if (event[4] === "2") {
          priorityText = "Medium";
        } else if (event[4] === "3") {
          priorityText = "High";
        }
        document.getElementById('infoContent').innerHTML = `
          <h3>${event[2]}</h3>
          ${descriptionHTML}
          ${locationHTML}
          <p><strong>Start:</strong> ${new Date(event[7]).toLocaleString()}</p>
          <p><strong>End:</strong> ${new Date(event[8]).toLocaleString()}</p>
          <p><strong>Priority:</strong> ${priorityText}</p>
        `;
        document.getElementById('infoModal').style.display = 'block';
      });

      const li = document.createElement('li');
      li.textContent = `${event[2]}: ${new Date(event[7]).toLocaleString()} - ${new Date(event[8]).toLocaleString()}`;
      li.style.listStyle = 'none';

      eventContainer.appendChild(delBtn);
      eventContainer.appendChild(editBtn);
      eventContainer.appendChild(infoBtn);
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

      //Delete Button
      const delBtn = createButton('🗑️', 8, 4, () => {
        if (confirm('Are you sure you want to delete this task?')) {
          fetch('/remove_task', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: task[0] }),
          })
            .then(() => taskContainer.remove())
            .catch(error => console.error('Error deleting task:', error));
        }
      });

      //Edit Button
      const editBtn = createButton('✏️', 8, 0, () => {
        fillTaskFormWithExtractedData({
          id: task[0],
          name: task[2],
          description: task[3],
          deadline: task[5],
          priority: task[4],
          colour: task[6]
        });
        taskModal.style.display = "block";
      });

      //Info Button
      const infoBtn = createButton('ℹ️', 8, 0, () => {
        let descriptionHTML = task[3] ? `<p><strong>Description:</strong> ${task[3]}</p>` : "";
        let priorityText = "Unknown";
        if (task[4] === "1") {
          priorityText = "Low";
        } else if (task[4] === "2") {
          priorityText = "Medium";
        } else if (task[4] === "3") {
          priorityText = "High";
        }

        document.getElementById('infoContent').innerHTML = `
          <h3>${task[2]}</h3>
          ${descriptionHTML}
          <p><strong>Deadline:</strong> ${new Date(task[5]).toLocaleString()}</p>
          <p><strong>Priority:</strong> ${priorityText}</p>
        `;
        document.getElementById('infoModal').style.display = 'block';
      });

      const li = document.createElement('li');
      li.textContent = `${task[2]}: ${new Date(task[5]).toLocaleString()}`;
      li.style.listStyle = 'none';

      taskContainer.appendChild(delBtn);
      taskContainer.appendChild(editBtn);
      taskContainer.appendChild(infoBtn);
      taskContainer.appendChild(li);

      taskList.appendChild(taskContainer);
    });
  }

  //Close handler for the info modal
  document.getElementById('infoClose').addEventListener('click', function () {
    document.getElementById('infoModal').style.display = 'none';
  });

  window.addEventListener('click', function (event) {
    const infoModal = document.getElementById('infoModal');
    if (event.target === infoModal) {
      infoModal.style.display = 'none';
    }
  });

  //Takes input of
  searchBar.addEventListener("input", function () {
    const query = searchBar.value.toLowerCase().trim();

    function filterContainers(containers) {
      Array.from(containers).forEach(container => {
        const text = container.textContent.toLowerCase();
        if (text.includes(query)) {
          container.style.display = "flex";
        } else {
          container.style.display = "none";
        }
      });
    }

    const eventContainers = eventList.children;
    const taskContainers = taskList.children;

    filterContainers(eventContainers, "event");
    filterContainers(taskContainers, "task");
  });

  //Handle Event Submission
  document.getElementById('eventForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const id = document.getElementById('eventId').value;
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

    //Prepare data for the POST request
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

    let url = '/add_event';
    if (typeof id !== 'undefined' && id) {
      eventData.id = id;
      url = '/update_event';
    }

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    })
      .then(response => response.json())
      .then(() => {
        eventModal.style.display = "none";
        this.reset();
        renderCalendar();
      })
      .catch(error => console.error('Error submitting event:', error));
  });

  //Handle Task Submission
  document.getElementById('taskForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const id = document.getElementById('taskId').value;
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskNotes').value;
    const taskDeadline = document.getElementById('deadline').value;
    const priority = document.getElementById('taskPriority').value;
    const colour = document.getElementById('taskColour').value;

    if (!title || !taskDeadline) {
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
    };

    let url = '/add_task';
    if (id) {
      taskData.id = id;
      url = '/update_task';
    }

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    })
      .then(response => response.json())
      .then(() => {
        taskModal.style.display = "none";
        this.reset();
        document.getElementById('taskId').value = '';
        renderCalendar();
      })
      .catch(error => console.error('Error submitting task:', error));
  });

  const viewButtons = document.querySelectorAll(".viewControls button");

  viewButtons.forEach(button => {
    button.addEventListener("click", function () {
      //Remove 'active' from all buttons
      viewButtons.forEach(btn => btn.classList.remove("active"));
      //Add 'active' to the clicked button
      this.classList.add("active");
    });
  });
});
