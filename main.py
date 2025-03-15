#Authors: Johathan Lavoie, Mason Cacheino, Nooh Alavi, Rahif Haffeez, Shawn Xiao
#Date: February 6th, 2025
#Filename: main.py
#Description: Contains the Flask application for the web interface. It is the main entry point to run the webapp and serves as the backend for the calendar and task/event management system.

import flask
from file_managing import load_csv, save_csv
import os
from flask import request, jsonify
from Task.Task import Task, Event, Priority
from datetime import datetime

# Create the application.
APP = flask.Flask(__name__)

#Data
DATA_FOLDER = 'data'
TASKS_CSV = os.path.join(DATA_FOLDER, 'tasks.csv')
EVENTS_CSV = os.path.join(DATA_FOLDER, 'events.csv')

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
