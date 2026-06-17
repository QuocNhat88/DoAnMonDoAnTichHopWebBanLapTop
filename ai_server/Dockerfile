#môi truơngf
FROM python:3.10-slim

#Tạo thư mục
WORKDIR /app

#copy file thư viênj
COPY requirements.txt ./

#cài thư viện
RUN pip install --no-cache-dir -r requirements.txt

#copy  file code
COPY . .

#mở cổng
EXPOSE 8000


#chạy
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]