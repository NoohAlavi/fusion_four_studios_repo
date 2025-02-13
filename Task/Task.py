from time import time
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

    def __str__(self):
        return f"Task: {self.name} (Due: {self.deadline}) - Priority: {self.priority.name} - {self.description}"

    def export_as_csv(self):
        pass


class Event(Task):
    def __init__(self, name: str, description: str, location: str, priority: Priority, start_time: str, end_time: str):
        super().__init__(name, description, priority, None)  # No deadline for events
        self.location = location
        self.start_time = start_time
        self.end_time = end_time

    def __str__(self):
        return f"Event: {self.name} (Start: {self.start_time} - End: {self.end_time}) - Location: {self.location} - {self.description}"

    def export_as_csv(self):
        pass
