# Nghệ An Travel - Khám Phá Trái Tim Miền Trung Việt Nam

Chào mừng bạn đến với dự án **Nghệ An Travel**. Đây là một ứng dụng du lịch hiện đại, được thiết kế để mang đến trải nghiệm khám phá Nghệ An toàn diện nhất. Ứng dụng tích hợp công nghệ AI tiên tiến, bản đồ tương tác và kho dữ liệu văn hóa phong phú.

---

## 🌟 Giới thiệu dự án

Nghệ An Travel không chỉ là một trang web thông tin du lịch thông thường. Đây là một nền tảng tương tác giúp du khách:
- **Khám phá**: Tìm hiểu về các điểm đến, trải nghiệm, ẩm thực và văn hóa đặc trưng của xứ Nghệ.
- **Hỗ trợ AI**: Trợ lý ảo thông minh tích hợp Google Gemini giúp giải đáp mọi thắc mắc về du lịch.
- **Bản đồ tương tác**: Tích hợp Google Maps và Leaflet để định vị các điểm tham quan một cách chính xác.
- **Tiện ích**: Từ điển giọng địa phương, vòng quay may mắn, và hệ thống đặt chỗ trực tuyến.

---

## 🏗 Cấu trúc dự án

Dự án được xây dựng theo kiến trúc React hiện đại, sử dụng Vite để tối ưu hóa hiệu năng:

```text
nghệ-an-travel/
├── dist/               # Thư mục chứa mã nguồn sau khi build (sẵn sàng triển khai)
├── src/                # Thư mục chứa mã nguồn chính
│   ├── components/     # Các thành phần giao diện dùng chung (Navbar, Footer, Card...)
│   ├── pages/          # Các trang chính của ứng dụng (Home, Destinations, Map...)
│   ├── services/       # Các dịch vụ API (Gemini AI, Site Search...)
│   ├── data/           # Dữ liệu tĩnh về các địa danh và thông tin du lịch
│   ├── App.tsx         # File cấu hình Routing chính
│   └── main.tsx        # File entry point của ứng dụng
├── public/             # Các tài nguyên tĩnh (Images, Sounds, Icons)
├── .env                # File cấu hình biến môi trường (API Keys)
├── package.json        # Quản lý dependencies và scripts
└── vite.config.ts      # Cấu hình Vite
```

---

## 🛠️ Hướng dẫn cài đặt từ đầu

Để chạy dự án này trên môi trường local, hãy làm theo các bước sau:

### 1. Yêu cầu hệ thống
- **Node.js**: Phiên bản 18.x trở lên.
- **npm**: Thường đi kèm với Node.js.

### 2. Tải mã nguồn
Giải nén file dự án vào một thư mục trên máy tính của bạn.

### 3. Cài đặt Dependencies
Mở terminal (PowerShell hoặc CMD) tại thư mục gốc của dự án và chạy:
```bash
npm install
```

### 4. Chạy ứng dụng
Khởi động server phát triển bằng lệnh:
```bash
npm run dev
```
Truy cập địa chỉ: **[http://localhost:3000](http://localhost:3000)**

---

## 📦 Cách build và triển khai lên Netlify

Để đưa ứng dụng lên Netlify theo cách thủ công (tải lên file .zip), hãy thực hiện các bước sau:

### Bước 1: Build ứng dụng
Chạy lệnh build để tạo ra phiên bản sản xuất:
```bash
npm run build
```
Sau khi lệnh hoàn tất, một thư mục mới có tên `dist/` sẽ xuất hiện trong thư mục gốc. Thư mục này chứa toàn bộ mã nguồn đã được tối ưu hóa.

### Bước 2: Nén thư mục `dist` thành file .zip
- **Trên Windows**: Chuột phải vào thư mục `dist` -> **Send to** -> **Compressed (zipped) folder**.
- **Trên macOS**: Chuột phải vào thư mục `dist` -> **Compress "dist"**.
- **Dùng lệnh (PowerShell)**:
  ```powershell
  Compress-Archive -Path dist/* -DestinationPath nghệ-an-travel.zip
  ```

### Bước 3: Tải lên Netlify
1. Đăng nhập vào [Netlify](https://app.netlify.com/).
2. Kéo và thả file `.zip` vừa tạo vào khu vực **"Drag and drop your site folder here"** trong trang quản lý của Netlify.
3. Chờ quá trình upload hoàn tất, ứng dụng của bạn sẽ được kích hoạt với một đường link công khai.

---

## 🚀 Công nghệ sử dụng
- **Framework**: React 19, Vite 6
- **Styling**: Tailwind CSS 4
- **Animation**: Framer Motion
- **Maps**: Google Maps Platform & Leaflet
- **Icons**: Lucide React

---
Chúc bạn có những trải nghiệm tuyệt vời cùng **Nghệ An Travel**!
