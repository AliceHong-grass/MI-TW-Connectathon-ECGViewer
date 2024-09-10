# MI-TW-Connectathon-ECGViewer

## Windows CMD
1. cd 到專案資料夾
2. set FLASK_APP=BackEnd.py
3. flask run --reload --debugger --host 0.0.0.0 --port 8088

## Ubuntu Terminal
1. cd 到專案資料夾
2. export FLASK_APP=BackEnd.py
3. flask run --reload --debugger --host 0.0.0.0 --port 8088

- reload：修改 py 檔後，Flask server 會自動 reload
- debugger：如果有錯誤，會在頁面上顯示是哪一行錯誤
- host：可以指定允許訪問的主機 IP
- port：自訂網路埠號的參數
