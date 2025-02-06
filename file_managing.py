from csv import reader, writer

def loadCsv(filename: str):
    with open(filename, 'r') as file:
        return list(reader(file))

def saveCsv(filename: str, data: list):
    with open(filename, 'w', newline='') as file:
        writer(file).writerows(data)

def saveIcs(filename: str, data: list):
    with open(filename, 'w') as file:
        file.write('BEGIN:VCALENDAR\n')
        for event in data:
            file.write('BEGIN:VEVENT\n')
            file.write(f'SUMMARY:{event[0]}\n')
            file.write(f'DTSTART:{event[1]}\n')
            file.write(f'DTEND:{event[2]}\n')
            file.write(f'DESCRIPTION:{event[3]}\n')
            file.write('END:VEVENT\n')
        file.write('END:VCALENDAR\n')

def loadIcs(filename: str):
    with open(filename, 'r') as file:
        data = []
        event = []
        for line in file:
            if line.startswith('SUMMARY:'):
                event.append(line[8:].strip())
            elif line.startswith('DTSTART:'):
                event.append(line[8:].strip())
            elif line.startswith('DTEND:'):
                event.append(line[6:].strip())
            elif line.startswith('DESCRIPTION:'):
                event.append(line[12:].strip())
            elif line.startswith('END:VEVENT'):
                data.append(event)
                event = []
        return data