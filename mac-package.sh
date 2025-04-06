#!/bin/bash
pyinstaller --onefile --add-data "data:data"  --add-data "static:static"  --add-data "templates:templates"  main.py
cp -r data/ dist/data