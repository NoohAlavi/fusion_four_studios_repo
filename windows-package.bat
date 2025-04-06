@echo off
pyinstaller --onefile --add-data "data;data" --add-data "static;static" --add-data "templates;templates" main.py
xcopy /E /I /H data\ dist\data\