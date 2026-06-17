# Tải môi trường
FROM node:20-alpine

# Tạo thư mục ảo bên trong docker
WORKDIR /app

# Các file bỏ vào thư mục đã đc tạo
COPY package*.json ./

#Lệnh để cài thư viện
RUN npm install

#copy mấy file còn lại
COPY . .

#Cổng đg chạy
EXPOSE 3000

#lệnh chạy sv
CMD ["npm", "start"]

