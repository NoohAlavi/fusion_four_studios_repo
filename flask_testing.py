import flask

# Create the application.
APP = flask.Flask(__name__)

i = 0

@APP.route('/')
def index():
    return flask.render_template('calendar.html')


if __name__ == '__main__':
    APP.debug=True
    APP.run()




