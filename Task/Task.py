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
    def __init__(self, name: str, description: str, priority: Priority, deadline: str, colour: str):
        self.name = name
        self.description = description
        self.priority = priority
        self.colour = colour

        #Parse the combined date/time (e.g. "03/12/2025, 2:30PM")
        self.deadline = datetime.strptime(deadline, "%Y-%m-%dT%H:%M")
        
        self.id = round(time())
        

    def export_as_csv(self):
        """
        Return a list that canbe written as a single CSV row.
        Tasks: [id, "Task", name, description, priority, deadline, colour]
        """
        return [
                self.id, #0
                "Task", #1
                self.name, #2
                self.description, #3
                self.priority, #4
                self.deadline.strftime('%Y-%m-%dT%H:%M'), #5
                self.colour #6
        ]

    def __str__(self):
        return (f"Task: {self.name} Deadline: {self.deadline.strftime('%Y-%m-%dT%H:%M')}")

class Event(Task):
    def __init__(self, name, description, location, priority, repeatability, start_datetime, end_datetime, colour):
        super().__init__(name, description, priority, end_datetime, colour) 
        
        self.location = location
        self.repeatability = repeatability
        self.start_datetime = datetime.strptime(f"{start_datetime}", "%Y-%m-%dT%H:%M")
        self.end_datetime = datetime.strptime(f"{end_datetime}", "%Y-%m-%dT%H:%M")

    def export_as_csv(self):
        """
        Return a list that canbe written as a single CSV row.
        Events: [id, "Event", name, description, priority, location, repeatability, start_datetime, end_datetime, colour]
        """

        return [
            self.id, #0
            "Event", #1
            self.name, #2
            self.description, #3
            self.priority, #4
            self.location, #5
            self.repeatability, #6
            self.start_datetime.strftime("%Y-%m-%dT%H:%M"), #7
            self.end_datetime.strftime("%Y-%m-%dT%H:%M"), #8
            self.colour #9
        ]

    def __str__(self):
        return (f"Event: {self.name} at {self.location} (Starts: {self.start_datetime.strftime('%Y-%m-%dT%H:%M')}, Ends: {self.end_datetime.strftime('%Y-%m-%dT%H:%M')})")