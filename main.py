#Authors: Johathan Lavoie, Mason Cacheino, Nooh Alavi, Rahif Haffeez, Shawn Xiao
#Date: February 6th, 2025
#Filename: main.py
#Description: Contains the Flask application for the web interface. It is the main entry point to run the webapp and serves as the backend for the calendar and task/event management system.

import flask
import os
import re
import json
from flask import request, jsonify
from Task.Task import Task, Event
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
CONFIG_FILE = os.path.join(DATA_FOLDER, 'config.json')

#Regex string in the format "YYYY-MM-DDTHH:MM"
DATE_PATTERN = r'\d{4}-\d{2}-\d{2}T\d{2}:\d{2}'

#HELPER FUNCTIONS

#Create event object
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

#Create task object
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

#Handle config file
def load_config():
    try:
        with open(CONFIG_FILE, 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        return {}

#Save config file
def save_config(config):
    with open(CONFIG_FILE, 'w') as file:
        json.dump(config, file)


#INITIAL ROUTES

#Load HTML file
@APP.route('/')
def index():
    return flask.render_template('calendar.html')

#Get saved events
@APP.route('/get_events', methods=['GET'])
def get_events():
    events = load_csv(EVENTS_CSV)
    return jsonify({'events': events})

#Get saved tasks
@APP.route('/get_tasks', methods=['GET'])
def get_tasks():
    tasks = load_csv(TASKS_CSV)
    return jsonify({'tasks' : tasks})

#EVENT/TASK CRUD
#Add events
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

#Add tasks
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

#Removes existing event
@APP.route('/remove_event', methods=['POST'])
def remove_event():
    """
    Takes id from button, deletes event with id then updates events.csv
    """
    id = request.get_json()["id"]
    events = load_csv(EVENTS_CSV)
    print(events, id)
    events = list(filter(lambda e: e[0] != id, events))
    print(events)
    save_csv(EVENTS_CSV, events)
    return jsonify({'status': 'success', 'event_removed': id})
    
#Removes existing task
@APP.route('/remove_task', methods=['POST'])
def remove_task():
    """
    Takes id from button, deletes task with id then updates tasks.csv
    """
    id = request.get_json()["id"]
    tasks = load_csv(TASKS_CSV)
    print(tasks)
    tasks = list(filter(lambda e: e[0] != id, tasks))
    print(tasks)
    save_csv(TASKS_CSV, tasks)
    return jsonify({'status': 'success', 'task_removed': id})

#Updates an existing event
@APP.route('/update_event', methods=['POST'])
def update_event():
    """
    Updates an existing event with new data.
    Expects the JSON payload to include the event 'id' along with the other fields.
    """
    data = request.get_json()
    event_id = data.get('id')
    events = load_csv(EVENTS_CSV)
    updated = False
    for i, event in enumerate(events):
        if event[0] == event_id:
            new_event = Event(
                data['name'],
                data['description'],
                data['location'],
                data['priority'],
                data['repeatability'],
                data['start_datetime'],
                data['end_datetime'],
                data['colour']
            )
            new_event.id = event_id
            events[i] = new_event.export_as_csv()
            updated = True
            break
    if updated:
        save_csv(EVENTS_CSV, events)
        return jsonify({'status': 'success', 'event_id': event_id})
    else:
        return jsonify({'status': 'error', 'message': 'Event not found'}), 404
    
#Updates an existing task
@APP.route('/update_task', methods=['POST'])
def update_task():
    """
    Updates an existing task with new data.
    Expects the JSON payload to include the task 'id' along with the other fields.
    """
    data = request.get_json()
    task_id = data.get('id')
    tasks = load_csv(TASKS_CSV)
    updated = False
    for i, task in enumerate(tasks):
        if task[0] == task_id:
            new_task = Task(
                data['name'],
                data['description'],
                data['priority'],
                data['deadline'],
                data['colour']
            )
            new_task.id = task_id
            tasks[i] = new_task.export_as_csv()
            updated = True
            break
    if updated:
        save_csv(TASKS_CSV, tasks)
        return jsonify({'status': 'success', 'task_id': task_id})
    else:
        return jsonify({'status': 'error', 'message': 'Task not found'}), 404

#Handles the uploaded file
@APP.route('/upload_file', methods=['POST'])
def upload_file():
    """
    Extracts data from valid uploaded file and fills in the respective form with collected data.
    Expects only docx, pdf, and txt files.
    """

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
                "repeatability": "once",
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

#CONFIG FILE ROUTES
@APP.route('/save_start_of_week', methods=['POST'])
def save_start_of_week():
    """
    Takes the value from the dropdown menu and saves it to the config file.
    """
    data = request.get_json()
    start_of_week = data.get('startOfWeek')
    config = load_config()
    config['startOfWeek'] = start_of_week
    save_config(config)
    return jsonify({'status': 'success', 'startOfWeek': start_of_week})

@APP.route('/get_start_of_week', methods=['GET'])
def get_start_of_week():
    """
    Loads the config file and grabs the saved day of the week.
    """
    config = load_config()
    start_of_week = config.get('startOfWeek', 'Sun')  # Default to 'Sun' if not set
    return jsonify({'startOfWeek': start_of_week})

if __name__ == '__main__':
    APP.debug = True
    APP.run()
