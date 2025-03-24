#Authors: Johathan Lavoie, Mason Cacheino, Nooh Alavi, Rahif Haffeez, Shawn Xiao
#Date: February 6th, 2025
#Filename: file_managing.py
#Description: This file handles, I/O for CSV and ICS files. It also handles the uploaded file input when creating/editing an event/task.

from csv import reader, writer
import re
from collections import Counter
import PyPDF2
import docx

#Variable setup
ALLOWED_EXTENSIONS = {'pdf', 'docx', 'txt'}
FILLER_WORDS = {
    'the', 'a', 'an', 'in', 'on', 'at', 'as', 'to', 'and', 
    'for', 'but', 'with', 'of', 'by', 'is', 'it', 'this', 'that', 'you', 'I'
}

#CSV FUNCTIONS
def load_csv(filename: str):
    """
    Loads either the task or event CSV
    """
    with open(filename, 'r') as file:
        return list(reader(file))

def save_csv(filename: str, data: list):
    """
    Saves an event/task to the respective CSV
    """
    with open(filename, 'w', newline='') as file:
        writer(file).writerows(data)

###need to update these 
#ICS FUNCTIONS
def load_ics(filename: str):
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

def save_ics(filename: str, data: list):
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

#UPLOADED FILE FUNCTIONS
def allowed_file(filename):
    """
    Check to see if the file is an acceptable format from its extension.
    """
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_text_from_pdf(filepath: str) -> str:
    """
    Extract text from content from a PDF file
    """
    text = ""
    with open(filepath, 'rb') as f:
        reader = PyPDF2.PdfReader(f)
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text

def extract_text_from_docx(filepath: str) -> str:
    """
    Extract text content from DOCX file.
    """
    doc = docx.Document(filepath)
    text = "\n".join(para.text for para in doc.paragraphs)
    return text

def extract_text_from_text(filepath:str) -> str:
    """
    Extract text content from a TXT file.
    """ 
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

def count_keywords(text: str) -> dict:
    """
    Count keywords in the text while ignoring common filler words.
    """
    words = re.findall(r'\b[a-zA-Z]+\b', text.lower())
    filtered = [w for w in words if w not in FILLER_WORDS]
    return dict(Counter(filtered))
