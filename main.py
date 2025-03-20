#Authors: Johathan Lavoie, Mason Cacheino, Nooh Alavi, Rahif Haffeez, Shawn Xiao
#Date: February 6th, 2025
#Filename: main.py
#Description: Contains the Flask application for the web interface. It is the main entry point to run the webapp and serves as the backend for the calendar and task/event management system.

import flask
import os
import re
from flask import request, jsonify
from Task.Task import Task, Event, Priority
from datetime import datetime
from file_managing import (
    load_csv, 
    save_csv,
    allowed_file,
    extract_text_from_pdf,
    extract_text_from_docx,
    extract_text_from_text,
    count_keywords
)

# Create the application.
APP = flask.Flask(__name__)

#Data
DATA_FOLDER = 'data'
TASKS_CSV = os.path.join(DATA_FOLDER, 'tasks.csv')
EVENTS_CSV = os.path.join(DATA_FOLDER, 'events.csv')

#Regex string in the format "YYYY-MM-DDTHH:MM"
DATE_PATTERN = r'\d{4}-\d{2}-\d{2}T\d{2}:\d{2}'

def create_event_from_data(data):
    """
    Create an event object from given data.
    Expected fields in the 'data' dictionary:
    - name
    - description
    - location
    - priority (ENUM: 1 = LOW, 2 = MEDIUM, 3 = HIGH)
    - repeatability
    - start_datetime (format: "YYYY-MM-DDTHH:MM")
    - end_datetime (format: "YYYY-MM-DDTHH:MM")
    - colour (format: #RRGGBB)
    """
    name = data['name']
    description = data['description']
    location = data['location']
    priority = data['priority']
    repeatability = data['repeatability']
    start_datetime = data['start_datetime']
    end_datetime = data['end_datetime']
    colour = data['colour']

    #Create event object
    event = Event(name, description, location, priority, repeatability, start_datetime, end_datetime, colour)
    return event

def create_task_from_data(data):
    """
    Creates a task object from given data.
    Expected fields in the 'task' dictionary:
    - name
    - description
    - priority (ENUM: 1 = LOW, 2 = MEDIUM, 3 = HIGH)
    - deadline(format: "YYYY-MM-DDTHH:MM")
    - colour (format: #RRGGBB)
    """
    name = data['name']
    description = data['description']
    priority = data['priority']
    deadline = data['deadline']
    colour = data['colour']

    #Create task object
    task = Task(name, description, priority, deadline, colour)
    return task

#Route to serve the calendar page
@APP.route('/')
def index():
    return flask.render_template('calendar.html')

<<<<<<< Updated upstream
=======
@APP.route('/remove_event', methods=['GET'])
def remove_event():
    """
    Takes id from button, deletes event with id then updates events.csv
    """
    id = request.args.get("id")
    events = load_csv(EVENTS_CSV)
    print(events)
    events = list(filter(lambda e: e[0] != id, events))
    print(events)
    save_csv(EVENTS_CSV, events)
    return jsonify({'status': 'success', 'event_removed': id})
    
@APP.route('/remove_task', methods=['POST'])
def remove_task():
    """
    Takes id from button, deletes task with id then updates tasks.csv
    """
    id = int(request.args.get("id"))
    tasks = load_csv(TASKS_CSV)
    print(tasks)
    tasks = list(filter(lambda e: e[0] != id, tasks))
    print(tasks)
    save_csv(TASKS_CSV, tasks)
    return jsonify({'status': 'success', 'task_removed': id})


>>>>>>> Stashed changes
#Route to add an event
@APP.route('/add_event', methods=['POST'])
def add_event():
    """
    Takes data from forms, creates the event, then adds into the events.csv.
    """
    data = request.get_json()
    event = create_event_from_data(data)
    events = load_csv(EVENTS_CSV)
    events.append(event.export_as_csv())
    save_csv(EVENTS_CSV, events)
    return jsonify({'status': 'success', 'event_id': event.id})

#Route to add task
@APP.route('/add_task', methods=['POST'])
def add_task():
    """
    Takes data from forms, creates the task, and then adds it to the tasks.csv.
    """
    data = request.get_json()
    task = create_task_from_data(data)
    tasks = load_csv(TASKS_CSV)
    tasks.append(task.export_as_csv())
    save_csv(TASKS_CSV, tasks)
    return jsonify({'status': 'success', 'task_id': task.id})

#Route to get saved events
@APP.route('/get_events', methods=['GET'])
def get_events():
    events = load_csv(EVENTS_CSV)
    return jsonify({'events': events})

#Route to get saved tasks
@APP.route('/get_tasks', methods=['GET'])
def get_tasks():
    tasks = load_csv(TASKS_CSV)
    return jsonify({'tasks' : tasks})

#Route that handles the uploaded file
@APP.route('/upload_file', methods=['POST'])
def upload_file():

    if 'file' not in request.files:
        return jsonify({'status': 'error', 'message': 'No file part in the request'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'status': 'error', 'message': 'No selected file'}), 400
    
    upload_type = request.form.get("upload_type", "event").lower()

    if file and allowed_file(file.filename):
        filename = file.filename
        upload_folder = 'uploads'
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)
        upload_path = os.path.join(upload_folder, filename)
        file.save(upload_path)
    
        ext = filename.rsplit('.', 1)[1].lower()
        try:
            if ext == 'pdf':
                extracted_text = extract_text_from_pdf(upload_path)
            elif ext == 'docx':
                extracted_text = extract_text_from_docx(upload_path)
            elif ext == 'txt':
                extracted_text = extract_text_from_text(upload_path)
            else:
                return jsonify({'status': 'error', 'message': 'Unsupported file type. Allowed: pdf, docx, txt'}), 400
        except Exception as e:
            return jsonify({'status': 'error', 'message': f"Error extracting text: {str(e)}"}), 500
        
        lines = extracted_text.strip().splitlines()
        title = lines[0] if lines else ""
        dates = re.findall(DATE_PATTERN, extracted_text)

        keywords_count = count_keywords(extracted_text)
        sorted_keywords = sorted(keywords_count.items(), key=lambda kv: kv[1], reverse=True)
        top_keywords = [kw for kw, count in sorted_keywords[:5]]
        description = "Keywords: " + ", ".join(top_keywords)
        
        if upload_type == "event":
            start_datetime = dates[0] if len(dates) >= 1 else ""
            end_datetime = dates[1] if len(dates) >= 2 else ""
            response_data = {
                "name": title,
                "description": description,
                "location": "",
                "start_datetime": start_datetime,
                "end_datetime": end_datetime,
                "repeatability": "Once",
                "priority": "2",
                "colour": "#FF0000",
            }
        elif upload_type == "task":
            deadline = dates[0] if len (dates) >= 1 else ""
            response_data = {
                "name": title,
                "description": description,
                "deadline": deadline,
                "priority": "2",
                "colour": "#0000FF"
            }
        os.remove(upload_path)
        return jsonify({'status': 'success', 'data': response_data})
    else:
        return jsonify({'status': 'error', 'message': 'Unsupported file format. Allowed: pdf, docx, txt'})

@APP.route('/get_daily_task', methods=['GET'])
def get_daily_events():
    date = [request.args.get('year'), request.args.get('month'), request.args.get('day')]
    date = datetime(date[0], date[1], date[2])

    tasks = load_csv(TASKS_CSV)
    tasks_on_date = [
        task for task in tasks if datetime.strptime(task[5], "%Y-%m-%dT%H:%M").date() == date.date()
    ]

    return flask.jsonify({'tasks': [tasks_on_date]})


if __name__ == '__main__':
    APP.debug=True
    APP.run()
