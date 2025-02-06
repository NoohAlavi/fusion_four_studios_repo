from time import time
from math import round
from enum import Enum

class Priority(Enum):
    LOW = 1
    MEDIUM = 2
    HIGH = 3

class Task:
    def __init__(self, name: str, description: str, priority: Priority, deadline: str):
        self.name = name
        self.description = description
        self.priority = priority
        self.deadline = deadline
        
        self.id = round(time())
        pass

    def export_as_csv(self):
        pass

    def __str__(self):
        pass

class Event(Task):
    def __init__(self, name, description, location, priority, start_date, deadline):
        super().__init__(name, description, location, priority, deadline)
        
        self.location = location
        self.start_date = start_date
        self.location = location

    def export_as_csv(self):
        pass

    def __str__(self):
        pass