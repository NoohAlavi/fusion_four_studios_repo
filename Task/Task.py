#Authors: Johathan Lavoie, Mason Cacheino, Nooh Alavi, Rahif Haffeez, Shawn Xiao
#Date: February 6th, 2025
#Filename: Task.py
#Description: Contains the definitions of the Task and Event classes, which represent the tasks and events in the system.

from time import time
from enum import Enum
from datetime import datetime

class Priority(Enum):
    LOW = 1
    MEDIUM = 2
    HIGH = 3

class Task:
    def __init__(self, name: str, description: str, priority: Priority, deadline: str):
        self.name = name
        self.description = description
        self.priority = priority

        #Parse the combined date/time (e.g. "03/12/2025, 2:30PM")
        self.deadline = datetime.strptime(deadline, "%m/%d/%y, %I:%M %p")
        
        self.id = round(time())
        

    def export_as_csv(self):
        """
        Return a list that canbe written as a single CSV row.
        Tasks: [id, "Task", name, description, priority, deadline]
        """
        return [self.id, 
                "Task",
                self.name,
                self.description,
                self.priority.name,
                self.deadline.strftime('%m/%d/%y, %I:%M %p')
        ]

    def __str__(self):
        return (f"Task: {self.name} Deadline: {self.deadline.strftime('%m/%d/%y, %I:%M %p')}")

class Event(Task):
    def __init__(self, name, description, location, priority, start_datetime, end_datetime):
        super().__init__(name, description, priority, end_datetime) #Initialize Task with a deadline (end_time)
        
        self.location = location
        self.start_datetime = datetime.strptime(f"{start_datetime}", "%m/%d/%y, %I:%M %p")
        self.end_datetime = datetime.strptime(f"{end_datetime}", "%m/%d/%y, %I:%M %p")

    def export_as_csv(self):
        """
        Return a list that canbe written as a single CSV row.
        Events: [id, "Event", name, description, location, priority, start_datetime, end_datetime]
        """

        return [
            self.id,
            "Event",
            self.name,
            self.description,
            self.priority.name,
            self.location,
            self.start_datetime.strftime("%m/%d/%y, %I:%M %p"),
            self.end_datetime.strftime("%m/%d/%y, %I:%M %p")
        ]

    def __str__(self):
        return (f"Event: {self.name} at {self.location} (Starts: {self.start_datetime.strftime('%m/%d/%y, %I:%M %p')}, Ends: {self.end_datetime.strftime('%m/%d/%y, %I:%M %p')})")