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
  const prioritizerContainer = document.getElementById('prioritizedTaskContainer');
  const priortizeTasksButton = document.getElementById('taskPriortizerBtn');

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

  /**
   * Renders the calendar based off the currentView value.
  */
  function renderCalendar() {
    monthYearDisplay.textContent = `${months[viewDate.getMonth()]} ${viewDate.getFullYear()}`;
    calendarContainer.innerHTML = '';

    const startOfWeek = dayDropdown.value;
    const startDayIndex = days.indexOf(startOfWeek);

    if (currentView === "month") {
      renderMonthView(viewDate.getMonth(), viewDate.getFullYear(), startDayIndex);
    } else if (currentView === "week") {
      renderWeekView(startDayIndex);
    } else if (currentView === "day") {
      renderDayView();
    }

    if (currentView === "day") {
      prioritizerContainer.style.display = 'block';
    } else {
      prioritizerContainer.style.display = 'none';
    }

    updateViewButtons();

    fetchEventsAndTasks();
  }

  //Grab current start of the week from config.json
  fetch('/get_start_of_week')
    .then(response => response.json())
    .then(data => {
      dayDropdown.value = data.startOfWeek;
      renderCalendar();
    });

  /**
   * Renders the month view for the Calendar UI for a specific month or year,
   * starting on the custom day of the week based off 'startDayIndex'.
   * It creates the days of the month in a grid. Makes sure to handle the first day
   * of the month and create empty spaces before the first day.
   * @param {number} month - The month number (0-11) to render (0 = January ... 11 = December)
   * @param {number} year  - Year of the calendar 
   * @param {number} startDayIndex - The index (0-6) that indicates the start of the week. (0 = Sunday ... 6 = Saturday)
  */
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

    //Create empty slots before the first day
    for (let i = 0; i < (date.getDay() - startDayIndex + 7) % 7; i++) {
      let emptyDayDiv = document.createElement('div');
      emptyDayDiv.className = 'day';
      daysDiv.appendChild(emptyDayDiv);
    }

    //Render each day cell
    while (date.getMonth() === month) {
      let dayDiv = document.createElement('div');
      dayDiv.className = 'day';

      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      dayDiv.dataset.date = `${yyyy}-${mm}-${dd}`;

      //Create a dedicated element for the day number
      let dayNumberSpan = document.createElement('span');
      dayNumberSpan.className = 'day-number';
      dayNumberSpan.textContent = date.getDate();
      dayDiv.appendChild(dayNumberSpan);

      //Create an inner container for events/tasks
      let eventsContainer = document.createElement('div');
      eventsContainer.className = 'events-container';
      dayDiv.appendChild(eventsContainer);

      if (date.toDateString() === today.toDateString()) {
        dayDiv.classList.add('current-day');
      }

      dayDiv.addEventListener('click', function () {
        currentView = 'day';
        //Parse the date string to a new Date using local values
        const parts = dayDiv.dataset.date.split('-');
        viewDate = new Date(parts[0], parts[1] - 1, parts[2]);
        renderCalendar();
      });

      daysDiv.appendChild(dayDiv);
      date.setDate(date.getDate() + 1);
    }

    calendarContainer.appendChild(daysDiv);
  }

  /**
   * Renders the calendar for the selected week view based off the selected 'startDayIndex', 
   * and renders a single week with 7 days starting from the adjusted start day.
   * @param {number} startDayIndex - The index (0-6) that indicates the start of the week. (0 = Sunday ... 6 = Saturday)
   */
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

      const yyyy = startOfWeek.getFullYear();
      const mm = String(startOfWeek.getMonth() + 1).padStart(2, '0');
      const dd = String(startOfWeek.getDate()).padStart(2, '0');
      dayDiv.dataset.date = `${yyyy}-${mm}-${dd}`;

      //Display the correct day name and date
      dayDiv.textContent = `${days[startOfWeek.getDay()]} ${startOfWeek.getDate()}`;

      //Highlight the current day
      if (startOfWeek.toDateString() === today.toDateString()) {
        dayDiv.classList.add('current-day');
      }

      dayDiv.addEventListener('click', function () {
        currentView = 'day';
        //Parse the local date string to create a new Date object
        const parts = dayDiv.dataset.date.split('-');
        viewDate = new Date(parts[0], parts[1] - 1, parts[2]);
        renderCalendar();
      });

      weekDiv.appendChild(dayDiv);
      startOfWeek.setDate(startOfWeek.getDate() + 1); //Move to the next day
    }

    calendarContainer.appendChild(weekDiv);
  }

  /**
   * Renders the calendar in day view for the calendar UI. Renders a single day by
   * generating two columns, one for the morning (12AM to 11:59AM) and one for the afternoon (12PM to 11:59PM).
   * Displays the day header with the day name and date, and there are time slots for each hour
   * of the day.
   */
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

  /**
 * Priortizes tasks based off their deadline and priority.
 * 
 * Sorts an array of tasks primarily by their deadline. If two tasks have
 * the same deadline, it will sort them by their priorty. Priority is determined
 * from the value in the fourth element of each task. (1 = Low ... 3 = High)
 * @param {Array} tasks - An array of task objects.  
 * @returns {Array} - Sorted array of tasks.
 */
  function prioritizeTasks(tasks) {

    const doableTasks = tasks

    doableTasks.sort((a, b) => {
      const deadlineA = new Date(a[5]).getTime();
      const deadlineB = new Date(b[5]).getTime();

      if (deadlineA === deadlineB) { //Sort by priority when deadlines are equal
        return b[4] - a[4];
      }
      return deadlineA - deadlineB; //Sort by deadline (earliest first)
    });

    return doableTasks;
  }

  /**
   * Fetches tasks from the tasks.csv, priortizes the tasks, then renders onto the webpage.
   * 
   * The function fetches tasks from the tasks.csv, processes the data, and then
   * displays the sorted list by title, deadline, and priorty. If no tasks available
   * then a message is displayed.
   */
  function renderPriortizedTasks() {
    fetch('/get_tasks')
      .then(response => response.json())
      .then(tasksData => {
        const tasks = tasksData.tasks.slice(1);
        const prioritizedTasks = prioritizeTasks(tasks);
        const prioritizedTaskList = document.getElementById('prioritizedTaskList');
        prioritizedTaskList.innerHTML = ''; //clear previous list

        //If no tasks, render this and exit function
        if (prioritizedTasks.length === 0) {
          prioritizedTaskList.innerHTML = '<p>No tasks available.</p>';
          return;
        }

        //Change from number to text for rendering.
        prioritizedTasks.forEach(task => {
          const li = document.createElement('li');
          let priorityText = "Unknown";
          if (task[4] === "1") {
            priorityText = "Low";
          } else if (task[4] === "2") {
            priorityText = "Medium";
          } else if (task[4] === "3") {
            priorityText = "High";
          }

          //Display task title, deadline and priority.
          li.textContent = `${task[2]} - Deadline: ${new Date(task[5]).toLocaleString()} - Priority: ${priorityText}`;
          prioritizedTaskList.appendChild(li);
        });
      })
      .catch(error => console.error('Error fetching tasks:', error));
  }

  //In day view, when the user clicks the "Priortize Tasks" button.
  priortizeTasksButton.addEventListener('click', function () {
    renderPriortizedTasks();
  });

  //Navigation Controls

  //Set the date pickers date to today.
  let yyyy = today.getFullYear();
  let mm = String(today.getMonth() + 1).padStart(2, '0');
  let dd = String(today.getDate()).padStart(2, '0');
  datePicker.value = `${yyyy}-${mm}-${dd}`;

  /**
   * Updates the view buttons to be correctly highlighted.
   */
  function updateViewButtons() {
    const viewButtons = document.querySelectorAll(".viewControls button");
    viewButtons.forEach(button => {
      //Remove the 'active' class from all buttons
      button.classList.remove("active");
    });

    //Add the 'active' class to the button corresponding to the current view
    const activeButton = document.getElementById(currentView + "View");
    if (activeButton) {
      activeButton.classList.add("active");
    }
  }

  /**
   * Navigates to the previous time period based on the current view.
   * 
   * This function checks the current view and adjusts the view date, after
   * it calls renderCalendar() to update the view.
   */
  prevPeriodButton.onclick = function () {
    if (currentView === "month") {
      if (viewDate.getMonth() === 0) {
        viewDate.setMonth(11); //Go back to December of the previous year
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

  /**
   * Navigates to the next time period based on the current view.
   * 
   * This function checks the current view and adjusts the view date, after
   * it calls renderCalendar() to update the view.
   */
  nextPeriodButton.onclick = function () {
    if (currentView === "month") {
      if (viewDate.getMonth() === 11) {
        viewDate.setMonth(0); //Go to January of the next year
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

  //Switches view to the monthView and re-renders.
  document.getElementById('monthView').onclick = function () {
    currentView = "month";
    viewDate = new Date();
    renderCalendar();
  };

  //Switches view to the weekView and re-renders.
  document.getElementById('weekView').onclick = function () {
    currentView = "week";
    viewDate = new Date();
    renderCalendar();
  };

  //Switches view to the dayView and re-renders.
  document.getElementById('dayView').onclick = function () {
    currentView = "day";
    viewDate = new Date();
    renderCalendar();
  };

  renderCalendar();

  //Update the calendar to accomodate the week starting day whenever the dropdown changes.
  dayDropdown.addEventListener('change', function () {
    renderCalendar();
  });

  //Saves the starting week day to config.json
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

  //Switch calendar to selected date based off the datepicker value. 
  confirmDateButton.addEventListener('click', function () {
    const selectedDate = datePicker.value;

    if (selectedDate) {
      let dateParts = selectedDate.split("-");
      viewDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
      renderCalendar();
    } else {
      alert("Make sure to fill out the date.")
    }
  });

  //Event/Task Panel 

  //Clear previous existing errors and display event modal.
  openEventModalBtn.addEventListener("click", function () {
    clearErrors("eventErrorMessages");
    eventModal.style.display = "block";
  });

  //Clear previous existing errors and display task modal.
  openTaskModalBtn.addEventListener("click", function () {
    clearErrors("taskErrorMessages");
    taskModal.style.display = "block";
  });

  //Pressing close button will close the modal.
  closeButtons.forEach(button => {
    button.addEventListener("click", function () {
      eventModal.style.display = "none";
      taskModal.style.display = "none";
      infoModal.style.display = "none";
    });
  });

  //Clicking outside the modal will close it
  window.addEventListener("click", function (event) {
    if (event.target === eventModal) eventModal.style.display = "none";
    if (event.target === taskModal) taskModal.style.display = "none";
    if (event.target === infoModal) infoModal.style.display = "none";
  });

  /**
   * Fetches events and tasks from the backend and renders them
   * 
   * This function fetches the events and tasks data from their respective csv files.
   * Upon a successful retrieval, it clears any existing events and renders the new
   * events. If an error occurs during the fetch process, it logs the error to the
   * console.
   */
  async function fetchEventsAndTasks() {
    try {
      //Fetch events
      const eventsResponse = await fetch('/get_events');
      if (!eventsResponse.ok) throw new Error('Failed to fetch events.');
      
      //Fetch tasks
      const tasksResponse = await fetch('/get_tasks');
      if (!tasksResponse.ok) throw new Error('Failed to fetch tasks.');

      //Parse from the respone
      const eventsData = await eventsResponse.json();
      const tasksData = await tasksResponse.json();

      //Clear existing events
      clearExistingEvents();

      //Render events and tasks, ignores the header.
      renderEvents(eventsData.events.slice(1));
      renderTasks(tasksData.tasks.slice(1));
    } catch (error) {
      console.error('Error fetching event and tasks:', error);
    }
  }

  /** 
   * Creates the buttons for an event and task on the event/task panel.
   * Provides a div element that serves as a button. Displays the provided icon text, has margins
   * applied, and an onclick function.
   * 
   * @param {string} icon - Takes text such as symbol or emoji to be displayed
   * @param {number} marginRight - The amount of space in pixels for the right margin
   * @param {number} marginLeft - The amount of space in pixels for the left margin
   * 
   * @returns {HTMLElement} The created div element.
  */
  function createButton(icon, marginRight, marginLeft, onClick) {
    const btn = document.createElement('div');
    btn.textContent = icon;
    btn.style.marginRight = `${marginRight}px`;
    btn.style.marginLeft = `${marginLeft}px`;
    btn.style.cursor = 'pointer';
    btn.addEventListener('click', onClick);
    return btn;
  }

  /**
   * Determines the contrast colour (black/white) for a given hex colour.
   * 
   * This function calculates the luminance of a given colour in hex form and then
   * returns either black (#000000) or white (#FFFFFF) as the contrast colour. The choice
   * is based of the lumiance of the chosen colour.
   * 
   * The luminance is calculated using the formula for relative luminance based on the RGB values.
   * 
   * @param {string} hex - The hex colour code (e.g. "#RRGGBB") to show which contrast color is applied.
   *  
   * @returns {string} The contrast colour in hex format, either "#000000" or "#FFFFFF"
   */
  function getContrastTextColor(hex) {
    let r = parseInt(hex.substring(1, 3), 16) / 255;
    let g = parseInt(hex.substring(3, 5), 16) / 255;
    let b = parseInt(hex.substring(5, 7), 16) / 255;

    let luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    return luminance > 0.5 ? "#000000" : "#FFFFFF";
  }

  //Clears existing events from the days in the calendar UI
  function clearExistingEvents() {
    const eventContainers = document.querySelectorAll('.events-container');
    eventContainers.forEach(container => {
      container.innerHTML = ''; //Remove old events from each day
    });
  }

  /**
   * Calculates the occurerences of a repeating event within a specified date range.
   * 
   * Checks what the event's repeatability is set to (weekly, monthly, yearly, etc) and generates
   * all occurrences of the event that fall within the visible date range.
   * 
   * @param {Array} event - The event data array
   * @param {string} visibleStart - The start date of the visible date range
   * @param {string} visibleEnd - The end date of the visible date range
   * 
   * @returns {Date[]} An array of Date objects representing the occurrences of the event within specified date range. 
   */
  function getOccurrences(event, visibleStart, visibleEnd) {
    const repeat = event[6]; //expected values: 'once' 'weekly', 'monthly', 'yearly'
    const baseDate = new Date(event[7]);
    let occurrences = [];

    if (repeat === 'once' || !repeat) {
      if (baseDate >= visibleStart && baseDate <= visibleEnd) {
        occurrences.push(new Date(baseDate));
      }
      return occurrences;
    }

    //For repeating events, fast-forward to the first occurrence on or after visibleStart.
    let occurrence = new Date(baseDate);
    while (occurrence < visibleStart) {
      if (repeat === 'weekly') {
        occurrence.setDate(occurrence.getDate() + 7);
      } else if (repeat === 'monthly') {
        occurrence.setMonth(occurrence.getMonth() + 1);
      } else if (repeat === 'yearly') {
        occurrence.setFullYear(occurrence.getFullYear() + 1);
      } else {
        break;
      }
    }

    //Add occurrences until the next occurrence is past visibleEnd.
    while (occurrence <= visibleEnd) {
      occurrences.push(new Date(occurrence));
      if (repeat === 'weekly') {
        occurrence.setDate(occurrence.getDate() + 7);
      } else if (repeat === 'monthly') {
        occurrence.setMonth(occurrence.getMonth() + 1);
      } else if (repeat === 'yearly') {
        occurrence.setFullYear(occurrence.getFullYear() + 1);
      } else {
        break;
      }
    }

    return occurrences;
  }


  /**
 * Renders a list of events on the page, displaying each event with buttons for deletion, editing, and viewing information.
 * 
 * @param {Array} events - An array of event data, where each event is represented as an array with the following structure:
 *   - `event[0]`: Event ID
 *   - `event[2]`: Event name/title
 *   - `event[3]`: Event description
 *   - `event[4]`: Event priority (1 - Low, 2 - Medium, 3 - High)
 *   - `event[5]`: Event location
 *   - `event[6]`: Repeatability (e.g., 'once', 'weekly', 'monthly', 'yearly')
 *   - `event[7]`: Start date and time of the event
 *   - `event[8]`: End date and time of the event
 *   - `event[9]`: Event colour
 */
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
            .then(() => eventContainer.remove(), renderCalendar())
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
      addEventToCalendar(event);
    });
  }

  /**
   * Add an event's occurrences to the calendar based on the current view
   * 
   * @param {Array} event - The event data, which is an array containing info about the event. 
   */
  function addEventToCalendar(event) {
    const eventId = event[0];
    //Determine the visible period based on current view:
    let visibleStart, visibleEnd;
    if (currentView === "month") {
      visibleStart = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
      visibleEnd = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);
    } else if (currentView === "week") {
      const startDayIndex = days.indexOf(dayDropdown.value);
      let startOfWeek = new Date(viewDate);
      startOfWeek.setDate(viewDate.getDate() - ((viewDate.getDay() - startDayIndex + 7) % 7));
      visibleStart = new Date(startOfWeek);
      visibleEnd = new Date(startOfWeek);
      visibleEnd.setDate(visibleEnd.getDate() + 6);
    } else if (currentView === "day") {
      visibleStart = new Date(viewDate);
      visibleStart.setHours(0, 0, 0, 0);
      visibleEnd = new Date(viewDate);
      visibleEnd.setHours(23, 59, 59, 999);
    }

    //Get all occurrences of the event within the visible period.
    const occurrences = getOccurrences(event, visibleStart, visibleEnd);
    occurrences.forEach(occurrence => {
      const occurrenceDateStr = occurrence.toISOString().split('T')[0];

      if (currentView === "month") {
        const dayCell = [...document.querySelectorAll('.days-container .day')]
          .find(cell => cell.dataset.date === occurrenceDateStr);
        if (dayCell) {
          const eventsContainer = dayCell.querySelector('.events-container');
          if (eventsContainer) {

            if (eventsContainer.querySelector(`#event-${eventId}-${occurrenceDateStr}`)) return;
            const eventDiv = document.createElement('div');
            eventDiv.className = 'calendar-event';
            eventDiv.id = `event-${eventId}-${occurrenceDateStr}`;
            eventDiv.textContent = event[2];
            eventDiv.style.backgroundColor = event[9];
            eventDiv.style.color = getContrastTextColor(event[9]);
            eventsContainer.appendChild(eventDiv);
          }
        }
      } else if (currentView === "week") {
        const dayCells = document.querySelectorAll('.week-container .day');
        dayCells.forEach(dayCell => {
          if (dayCell.dataset.date === occurrenceDateStr) {
            if (dayCell.querySelector(`#event-${eventId}-${occurrenceDateStr}`)) return;
            const eventDiv = document.createElement('div');
            eventDiv.className = 'calendar-event';
            eventDiv.id = `event-${eventId}-${occurrenceDateStr}`;
            eventDiv.style.backgroundColor = event[9];
            eventDiv.style.color = getContrastTextColor(event[9]);
            eventDiv.textContent = event[2];
            dayCell.appendChild(eventDiv);
          }
        });
      } else if (currentView === "day") {
        const currentDayStr = viewDate.toISOString().split('T')[0];
        if (occurrenceDateStr !== currentDayStr) return;

        const eventHour = occurrence.getHours();
        const timeSlots = document.querySelectorAll('.day-schedule .time-slot');

        if (timeSlots[eventHour]) {
          if (timeSlots[eventHour].querySelector(`#event-${eventId}-${occurrenceDateStr}`)) return;

          const eventDiv = document.createElement('div');
          eventDiv.className = 'calendar-event';
          eventDiv.id = `event-${eventId}-${occurrenceDateStr}`;
          eventDiv.style.backgroundColor = event[9];
          eventDiv.style.color = getContrastTextColor(event[9]);
          eventDiv.textContent = event[2];
          timeSlots[eventHour].appendChild(eventDiv);

        }
      }
    });
  }

    /**
   * Renders a list of tasks on the page, displaying each tasks with buttons for deletion, editing, and viewing information.
   * 
   * @param {Array} tasks - An array of task data, where each task is represented as an array with the following structure:
   *   - `task[0]`: Task ID
   *   - `task[2]`: Task name/title
   *   - `task[3]`: Task description
   *   - `task[4]`: Task priority (1 - Low, 2 - Medium, 3 - High)
   *   - `task[5]`: Task deadline
   *   - `task[6]`: Task colour
   */
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
            .then(() => taskContainer.remove(), renderCalendar())
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
      addTaskToCalendar(task);
    });
  }

  /**
   * Add a task to the calendar based on the current view.
   *
   * @param {Object} task - Task object containing task details
   */
  function addTaskToCalendar(task) {
    const taskId = task[0];
    const taskDate = new Date(task[5]);
    const taskDayStr = taskDate.toISOString().split('T')[0]; //Format as YYYY-MM-DD

    //Handle for 'day' view:
    if (currentView === "month") {
      const dayCell = [...document.querySelectorAll('.days-container .day')]
        .find(cell => cell.dataset.date === taskDayStr);
      if (dayCell) {
        //Prevent duplicate task insertion
        if (dayCell.querySelector(`#task-${taskId}`)) return;
        const taskDiv = document.createElement('div');
        taskDiv.className = 'calendar-task';
        taskDiv.id = `task-${taskId}`;
        taskDiv.style.backgroundColor = task[6]; //task colour
        taskDiv.style.color = getContrastTextColor(task[6]);
        taskDiv.textContent = task[2]; //task title
        //Style tasks to appear less significant
        taskDiv.style.fontSize = '0.8em';
        taskDiv.style.opacity = '0.7';
        dayCell.appendChild(taskDiv);
      }
    } else if (currentView === "week") {
      const dayCells = document.querySelectorAll('.week-container .day');
      dayCells.forEach(dayCell => {
        if (dayCell.dataset.date === taskDayStr) {
          if (dayCell.querySelector(`#task-${taskId}`)) return;

          const taskDiv = document.createElement('div');
          taskDiv.className = 'calendar-task';
          taskDiv.id = `task-${taskId}`;
          taskDiv.style.backgroundColor = task[6];
          taskDiv.style.color = getContrastTextColor(task[6]);
          taskDiv.textContent = task[2];
          taskDiv.style.fontSize = '0.8em';
          taskDiv.style.opacity = '0.7';
          dayCell.appendChild(taskDiv);
        }
      });
    } else if (currentView === "day") {
      const currentDayStr = viewDate.toISOString().split('T')[0]; //Format as YYYY-MM-DD
      if (taskDayStr !== currentDayStr) return; //Skip if task is not for the current day.

      const taskHour = taskDate.getHours();
      const timeSlots = document.querySelectorAll('.day-schedule .time-slot');
      if (timeSlots[taskHour]) {
        //Prevent duplicate insertion using a unique ID.
        if (timeSlots[taskHour].querySelector(`#task-${taskId}`)) return;

        const taskDiv = document.createElement('div');
        taskDiv.className = 'calendar-task';
        taskDiv.id = `task-${task[0]}`;
        taskDiv.style.backgroundColor = task[6];
        taskDiv.style.color = getContrastTextColor(task[6]);
        taskDiv.textContent = task[2];
        taskDiv.style.fontSize = '0.8em';
        taskDiv.style.opacity = '0.7';
        timeSlots[taskHour].appendChild(taskDiv);
      }
    }
  }

  //Takes input of whatever is in the search bar and check titles and dates.
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

    filterContainers(eventContainers);
    filterContainers(taskContainers);
  });

  /**
   * Handles the file upload for an event.
   * 
   * When a file is uploaded, send the selected file to the backend to parse for data.
   * Upon a successful upload, the backend responds with data and is used to fill the
   * event form with the extracted data. If an error occurs, throws the error to console.
   * 
   * @param {Event} e - Event triggered by the file input change
   * @returns {void} Does not return anything but updates the task form
   */
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

  /**
   * Handles the file upload for a task.
   * 
   * When a file is uploaded, send the selected file to the backend to parse for data.
   * Upon a successful upload, the backend responds with data and is used to fill the
   * task form with the extracted data. If an error occurs, throw error
   * 
   * @param {Event} e - Event triggered by the file input change
   * @returns {void} Does not return anything but updates the task form
   */
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

  /**
   * Handles the submission of the event form.
   * This function checks the form data to make sure it is valid and ensure the required fields
   * are filled out. It submits the event data to the backend.
   * 
   * If there are any errors in the form, they are displayed on the UI. If successful
   * the form is reset, event modal closed, and the calendar gets re-rendered.
   */
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

    const errors = [];

    //Character limits
    const titleLimit = 20;
    const locationLimit = 40;
    const descriptionLimit = 180;

    if (!title) {
      errors.push("Event title is required.");
    } else if (title.length > titleLimit) {
      errors.push(`Event title must be ${titleLimit} characters or less.`);
    }

    if (notes.length > descriptionLimit) {
      errors.push(`Event notes must be ${descriptionLimit} characters or less.`);
    }

    if (eventLocation.length > locationLimit) {
      errors.push(`Location must be ${locationLimit} characters or less.`)
    }

    //Validate start and end times
    if (!startTime || !endTime) {
      errors.push("Both start time and end time are required.");
    } else {
      const start = new Date(startTime);
      const end = new Date(endTime);
      const minYear = new Date().getFullYear();

      if (start >= end) {
        errors.push("Start time must be before end time.");
      } else if (start.getFullYear() < minYear || end.getFullYear() < minYear) {
        errors.push(`Event dates must be in ${minYear} or later.`);
      }
    }

    if (errors.length > 0) {
      displayErrors(errors, "eventErrorMessages");
      return;
    }

    //Prepare data for submission
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
    if (id) {
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

    /**
   * Handles the submission of the task form.
   * This function checks the form data to make sure it is valid and ensure the required fields
   * are filled out. It submits the task data to the backend.
   * 
   * If there are any errors in the form, they are displayed on the UI. If successful
   * the form is reset, task modal closed, and the calendar gets re-rendered.
   */
  document.getElementById('taskForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const id = document.getElementById('taskId').value;
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskNotes').value;
    const taskDeadline = document.getElementById('deadline').value;
    const priority = document.getElementById('taskPriority').value;
    const colour = document.getElementById('taskColour').value;

    const errors = [];

    //Character limits
    const titleLimit = 20;
    const descriptionLimit = 140;

    if (!title) {
      errors.push("Task name is required.");
    } else if (title.length > titleLimit) {
      errors.push(`Task name must be ${titleLimit} characters or less.`);
    }

    if (description.length > descriptionLimit) {
      errors.push(`Task description must be ${descriptionLimit} characters or less.`);
    }

    if (!taskDeadline) {
      errors.push("Deadline is required.");
    } else {
      const deadlineDate = new Date(taskDeadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const minYear = today.getFullYear(); //Get the current year

      if (deadlineDate < today) {
        errors.push("Deadline cannot be in the past.");
      } else if (deadlineDate.getFullYear() < minYear) {
        errors.push(`Deadline year cannot be before ${minYear}.`);
      }
    }

    if (errors.length > 0) {
      displayErrors(errors, "taskErrorMessages");
      return;
    }

    //Prepare data for submission
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

  /** 
   * Function to display validation errors dynamically in the specific container of a form.
   * 
   * Takes an array of error messages and appends each message as a paragraph
   * element with red text to the specified conainer.
   * 
   * @param {Array} errors - An array of error messages to be displayed
   * @param {string} containerId - The ID of the HTML container where errors will be shown.
   */ 
  function displayErrors(errors, containerId) {
    const errorContainer = document.getElementById(containerId);
    errorContainer.innerHTML = "";
    errors.forEach(err => {
      const errorElement = document.createElement("p");
      errorElement.textContent = err;
      errorElement.style.color = "red";
      errorContainer.appendChild(errorElement);
    });
  }

  /**
   * Function that clears the error messages from a specified container.
   * Removes error messages by setting the innerHTML to an empty string.
   * 
   * @param {string} containerId 
   */
  function clearErrors(containerId) {
    const errorContainer = document.getElementById(containerId);
    if (errorContainer) {
      errorContainer.innerHTML = ""; //Clear the error messages
    }
  }

  const viewButtons = document.querySelectorAll(".viewControls button");

  //Handle view button clicks and toggle the 'active' class to indicate the selected view.
  viewButtons.forEach(button => {
    button.addEventListener("click", function () {
      
      //Remove 'active' from all buttons
      viewButtons.forEach(btn => btn.classList.remove("active"));
      
      //Add 'active' to the clicked button
      this.classList.add("active");
    });
  });
});