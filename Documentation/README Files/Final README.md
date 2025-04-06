# Event Horizon Calendar
Event Horizon Calendar is a calendar webapp that has the ability for users to add events for important occasions you need to keep track of, and tasks for any work that you want to keep track of.

With the built in features such as the document file reader, recurring events, or task priortizer, you'll be able to keep track of events and tasks efficiently.

## Table of Contents
1. [Environment Requirements](#environment-requirements)
2. [Installation](#installation)
     - [Releases](#releases)
     - [Build](#build)
3. [Troubleshooting](#troubleshooting)
     - [Releases](#troubleshoot-releases)
     - [Build](#troubleshoot-build)
4. [Authors](#authors)

## Environment Requirements
- Python 3.8.x (for Build Version)
- A web browser (Edge, Chrome, Firefox, etc)
### Packages (In Requirements.txt)
- Flask
- PyPDF2
- Python-Docx
#### For Testing
- PyTest
- Selenium

## Installation
### Releases
#### 1. Environment Setup:
Go into the `Releases` of the GitHub repository and download the latest release of Event Horizon Calendar for your OS. After installation proceed with the next steps.

- **Windows:** 
    Install ```eventHorizonCalendar-windows``` for Windows
    
    Upon accessing the contents, you should see: (Note: [D] = directory)
    ```
    eventHorizonCalendar-mac [D]
        -eventHorizonCalendar-main [D]
            -main.exe
            -initiate.bat
            -data [D]
                -config.json
                -events.csv
                -tasks.csv
        -run.bat
    ```
    
- **Mac:** 
    Install ```eventHorizonCalendar-mac``` for Mac
    
    Upon accessing the contents, you should see: (Note: [D] = directory)
    ```
    eventHorizonCalendar-mac [D]
        -dist [D]
            -main
        -data [D]
            -config.json
            -events.csv
            -tasks.csv
        -run.sh
    ```    
    
- **Linux:** 
    Install ```eventHorizonCalendar-linux``` for Linux
    
    Upon accessing the contents, you should see:  (Note: [D] = directory)
    ```
     eventHorizonCalendar-linux
        -data [D]
            -config.json
            -events.csv
            -tasks.csv
        -dist [D]
            - main
        run.sh
    ```

#### 2. Running the Program
- **Windows:** To run Event Horizon Calendar, double click `run.bat`. The command prompt will appear and will display a message indicating the program is booting up. After a short while, the program will start and your chosen browser should open automatically at `http://127.0.0.1:5000/`

- **Mac:** To run Event Horizon Calendar, open Spotlight Search with `CMD + Space` and type in terminal and open it. After opening terminal using the command `cd`, navigate to the `eventHorizonCalendar-mac` directory and run the program with:
    ```
    ./run.sh
    ```
    The terminal will display the program is booting up and should open at `http://127.0.0.1:6000/`

- **Linux:** To run Event Horizon Calendar, open terminal with `CTRL+ALT+T` (Ubuntu/Debian) and navigate to the `eventHorizonCalendar-linux` directory. After run:
    ```
    ./run.sh
    ```
The terminal will display that the program is booting up and it should automatically open at `http://127.0.0.1:5000/`

### Build
#### 1. Environment Setup
- **Windows:** Press ```WIN+R``` and type in ```cmd``` to open Command Prompt.

    Run the following command to install Python: 
    ```
    winget install Python
    ```
- **MacOS:** Press ```CMD + Space``` to open Spotlight Search, and type in ```Terminal```.

    After opening the terminal, you can proceed to run:
    ```
    brew install python3
    ```
- **Linux:** For an Ubuntu/Debian based system, press ```CTRL+ALT+T``` to open terminal and run:
    ```
    sudo apt update
    sudo apt install python3
    ```
 

#### 2. Install the required packages
- Download the project files by pressing the `Code` dropdown and `Download Zip` or by going into command prompt/terminal and typing:
    ```
    git clone https://github.com/NoohAlavi/fusion_four_studios_repo
    ```


- In terminal or command prompt, go into the root directory of the application and run:
    ```
    pip install -r requirements.txt
    ```

#### 3. Run the demo in browser
- **Windows:** Make sure you're in the root directory in command prompt and run:
    ``` 
    python main.py
    ```

- **MacOS/Linux:** Make sure you're in the root directory in the terminal and run:
    ``` 
    python3 main.py
    ```
After go to your browser and type in `http://127.0.0.1:5000/`

If you would like to use the test file, go into the tests directory and run:
``` 
pytest test_script.py
```

## Troubleshooting
### Troubleshoot Releases
#### Booting Up System Does Not Open Up Webpage
    
- **Windows/Linux:**
    
    If the system fails to open up the webpage on its own. You can simply type in ```http://127.0.0.1:5000/``` in your chosen browser and it should display

- **Mac:**
    
    If the system failed to open up the webpage on its own. Type in ```http://127.0.0.1:6000/``` in your browser and the program should display.

#### Permissions Denied

- **Mac/Linux:**
If upon attempting to run ```./run.sh``` on Linux, the system displays:
    ```
    bash: ./run.sh: Permission denied
    ```
or for Mac:
    ```
    zsh: permission denied: .../eventHorizonCalendar-mac/run.sh
    ```
type in your terminal
    ```
    chmod +x run.sh
    ```
and try running ```./run.sh``` again.

#### Port 6000 is already in use
- **Mac:** If port 6000 is already in use, go to System Preferences -> Sharing -> and tick AirPlay Receiver off.

    If it isn't there, go to System Preferences -> General -> Sharing/AirDrop & Handoff -> and tick AirPlay Receiver off.
    
### Troubleshoot Build

#### Port 5000 is already in use
- **Mac:** If port 5000 is already in use, go to System Preferences -> Sharing -> and tick AirPlay Receiver off.

    If it isn't there, go to System Preferences -> General -> Sharing/AirDrop & Handoff -> and tick AirPlay Receiver off.

#### Test file not working
- If running the test file yields the error:
    ```
    ERROR test_script.py - selenium.common.exceptions.WebDriverExce...
    ```
make sure that the program is running with main.py, and then in a different terminal/command prompt run the command again.

## Authors
Built by: Fusion Five Studios 
- Jonathan Lavoie - Jonathan-Lavoie
- Mason Cacheino  - MASONCacheino
- Nooh Alavi - NoohAlavi
- Rahif Haffeez - otuMoment
- Shawn Xiao - DonaldPmurt
