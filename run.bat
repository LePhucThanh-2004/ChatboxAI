@echo off
REM Kích hoạt môi trường ảo
cd backend
call venv\Scripts\activate
cd ..
REM Chạy backend bằng module từ thư mục gốc
start python -m backend.main
REM Mở frontend bằng trình duyệt (mở file index.html)
cd frontend
explorer index.html
cd ..