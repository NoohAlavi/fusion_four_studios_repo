import flask
from flask import request
from Task.Task import Task

# Create the application.
APP = flask.Flask(__name__)


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

    e = Task(name, description, priority, date)

    print(e.id)

    return flask.jsonify({'event': e.id})


if __name__ == '__main__':
    APP.debug=True
    APP.run()




