FROM nginx:alpine
# Xóa cấu hình mặc định của Nginx để tránh xung đột với cấu hình của mình
RUN rm /etc/nginx/conf.d/default.conf
# Copy file cấu hình nginx.conf từ máy vào bên trong container Nginx
COPY nginx.conf /etc/nginx/conf.d