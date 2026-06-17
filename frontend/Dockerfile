# --- GIAI ĐOẠN 1: Dịch code (Build) ---
FROM node:20-alpine as build

WORKDIR /app

# Copy và cài thư viện
COPY package*.json ./
RUN npm install

# Copy code và tiến hành build (sẽ tạo ra thư mục tên là 'dist')
COPY . .
RUN npm run build


# --- GIAI ĐOẠN 2: Chạy web bằng Nginx ---
FROM nginx:alpine

# Lấy thư mục 'dist' vừa tạo ở trên, copy sang ổ đĩa của Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Cấu hình một chút để khi F5 web không bị lỗi 404 (do React Router)
RUN echo "server { listen 80; location / { root /usr/share/nginx/html; index index.html index.htm; try_files \$uri \$uri/ /index.html; } }" > /etc/nginx/conf.d/default.conf

# Mở cổng 80 (cổng web mặc định)
EXPOSE 80

# Chạy Nginx
CMD ["nginx", "-g", "daemon off;"]