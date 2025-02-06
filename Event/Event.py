class Event:
    def __init__(self, name, description, location, priority, id, start_date, end_date):
        self.name = name
        self.description = description
        self.location = location
        self.priority = priority
        self.start_date = start_date 
        self.end_date = end_date
        
        #TODO: implement unique ID generator

        pass

    def export_as_csv(self):
        pass