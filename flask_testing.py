import flask
from flask import request
from Task.Task import Task
from Task.Task import Event
from datetime import datetime

# Create the application.
APP = flask.Flask(__name__)
tasks = []


@APP.route('/')
def index():
    return flask.render_template('calendar.html')


@APP.route('/add_event', methods=['GET'])
def add_event():
    
    # Get the event data from the request.
    name = request.args.get('name')
    description = request.args.get('description')
    priority = request.args.get('priority')
    date = request.args.get('date')

    task = Task(name, description, priority, date)

    tasks.append(task)

    return flask.jsonify({'event': task.id})


@APP.route('/get_daily_task', methods=['GET'])
def get_daily_events():
    date = [request.args.get('year'), request.args.get('month'), request.args.get('day')]
    date = datetime(date[0], date[1], date[2])

    tasks_on_date = [task for task in tasks if task.deadline == date]

    return flask.jsonify({'tasks': [tasks_on_date]})


if __name__ == '__main__':
    APP.debug=True
    APP.run()




