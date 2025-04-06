# Event Horizon Calendar
Event Horizon Calendar is a calendar webapp that has the ability for users to add events or tasks to their calendar with core features "Task Prioritizer" and "File Reader".

## Environment Requirements
- A web browser (Edge, Chrome, Firefox, etc)

## Installation
### 1. Environment Setup:
- **Windows:** 

    Install ```eventHorizonCalendar-windows``` for Windows
    
    Upon accessing the contents, you should see: (Note: [D] = directory)
    ```
    eventHorizonCalendar-windows [D]
        -eventHorizonCalendar-main [D]
            -main.exe
            -initiate.bat
            -data [D]
                -config.json
                -events.csv
                -tasks.csv
        -run.bat
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
    
### 2. Running the Program
- **Windows:** 
    
    To run Event Horizon Calendar, double-click on ```run.bat```
    
    Upon running ```run.bat``` you should see command prompt pop up and echoing the program is booting up,
    after a short while, eventually the program will start and your browser should have opened at ```http://127.0.0.1:5000/```

- **Linux:** 
 
    To run Event Horizon Calendar, open up terminal with ```CTRL+ALT+T``` (Ubuntu/Debian) and ```cd``` into the ```eventHorizonCalender-linux``` directory. 
    
    Once you're in the directory, type ```./run.sh``` and press ```ENTER```

    Upon running this command, you should see the terminal print out that the program is booting up. After a few seconds the system should start and automatically open up your browser at ```http://127.0.0.1:5000/```

## Troubleshooting

### Booting Up System Does Not Open Up Webpage
    
- **Windows/Linux**
    
    If the system fails to open up the webpage on its own. You can simply type in ```http://127.0.0.1:5000/``` in your chosen browser and it should display

### Permissions Denied

- **Linux**

If upon attempting to run ```./run.sh``` the system displays:
```
bash: ./run.sh: Permission denied
```

type in your terminal
```
chmod +x run.sh
```
and try running ```./run.sh``` again.



# Authors
Built by: Fusion Five Studios 
- Jonathan Lavoie 
- Mason Cacheino 
- Nooh Alavi
- Rahif Haffeez
- Shawn Xiao
