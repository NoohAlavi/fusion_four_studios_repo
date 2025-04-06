#Authors: Johathan Lavoie, Mason Cacheino, Nooh Alavi, Rahif Haffeez, Shawn Xiao
#Date: March 31st, 2025
#Filename: test_script.py
#Description: Test file, using selenium and pytest. Automatically tests adding an event/task, deleting event/task, and c

from selenium import webdriver
from selenium.webdriver.common.by import By
import time
import pytest

# Set up the WebDriver
driver = webdriver.Chrome()
driver.get("http://localhost:5000") 
driver.maximize_window()

def set_datetime_value(element, value):
    """Set a datetime-local input value using JavaScript and dispatch a change event."""
    driver.execute_script("""
        arguments[0].value = arguments[1];
        arguments[0].dispatchEvent(new Event('input'));
        arguments[0].dispatchEvent(new Event('change'));
    """, element, value)

def close_all_modals():
    """Closes any open modals on the page."""
    modals = driver.find_elements(By.CSS_SELECTOR, "div.modal")
    for modal in modals:
        if modal.is_displayed():
            try:
                close_btn = modal.find_element(By.CSS_SELECTOR, ".close")
                close_btn.click()
                time.sleep(1)
            except Exception as e:
                print("Error closing modal:", e)

def test_calendar_navigation():
    """Tests switching between day, week, and month views"""
    close_all_modals() 
    views = ["monthView", "weekView", "dayView"]
    for view in views:
        button = driver.find_element(By.ID, view)
        button.click()
        time.sleep(1) 
        assert driver.find_element(By.ID, "calendar-container").is_displayed()

def test_event_creation():
    """Tests adding a valid event"""
    close_all_modals()
    driver.find_element(By.ID, "openEventModal").click() 
    time.sleep(1)
    
    # Add values to the event form
    driver.find_element(By.ID, "eventTitle").clear()
    driver.find_element(By.ID, "eventTitle").send_keys("Test Event")
    start_input = driver.find_element(By.ID, "startTime")
    end_input = driver.find_element(By.ID, "endTime")
    set_datetime_value(start_input, "2025-04-17T10:00")
    set_datetime_value(end_input, "2025-04-17T13:00")


    driver.find_element(By.ID, "submitEvent").click()
    time.sleep(1)
    close_all_modals()
    assert "Test Event" in driver.page_source

def test_event_invalid_date():
    """Tests error handling when end time is before start time"""
    close_all_modals()
    driver.find_element(By.ID, "openEventModal").click()
    time.sleep(1)
    
    # Add values to the event form
    driver.find_element(By.ID, "eventTitle").clear()
    driver.find_element(By.ID, "eventTitle").send_keys("Invalid Event")
    start_input = driver.find_element(By.ID, "startTime")
    end_input = driver.find_element(By.ID, "endTime")
    set_datetime_value(start_input, "2025-04-17T10:00")
    set_datetime_value(end_input, "2025-04-16T10:00")

    # Click submit
    driver.find_element(By.ID, "submitEvent").click()
    time.sleep(1)
    close_all_modals()
    assert "Start time must be before end time." in driver.page_source

def test_task_creation():
    """Tests adding a valid task"""
    close_all_modals()
    driver.find_element(By.ID, "openTaskModal").click()
    time.sleep(1)
    
    # Add values to task form
    driver.find_element(By.ID, "taskTitle").clear()
    driver.find_element(By.ID, "taskTitle").send_keys("Test Task")
    deadline_input = driver.find_element(By.ID, "deadline")
    set_datetime_value(deadline_input, "2025-04-12T12:00")
    
    # Click submit
    driver.find_element(By.ID, "submitTask").click()
    time.sleep(1)
    close_all_modals()
    assert "Test Task" in driver.page_source

def test_task_invalid_deadline():
    """Tests error handling for past deadlines"""
    close_all_modals()
    driver.find_element(By.ID, "openTaskModal").click()
    time.sleep(1)
    
    # Add values to task form
    driver.find_element(By.ID, "taskTitle").clear()
    driver.find_element(By.ID, "taskTitle").send_keys("Old Task")
    deadline_input = driver.find_element(By.ID, "deadline")
    set_datetime_value(deadline_input, "2023-01-01T12:00")
    
    # Click submit
    driver.find_element(By.ID, "submitTask").click()
    time.sleep(1)
    close_all_modals()
    assert "Deadline cannot be in the past." in driver.page_source

def test_event_deletion():
    """Tests deleting an event"""
    close_all_modals()
    event_delete_buttons = driver.find_elements(By.CLASS_NAME, "delete-event")
    if event_delete_buttons:
        event_delete_buttons[0].click()
        time.sleep(1)
        alert = driver.switch_to.alert
        alert.accept()
        time.sleep(1)
        close_all_modals()
        assert "Test Event" not in driver.page_source

def teardown_module():
    driver.quit()

if __name__ == "__main__":
    pytest.main()
