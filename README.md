# 🏢 Hệ Thống Quản Lý & Đặt Thuê Căn Hộ Trực Tuyến
> **Dự án Môn học:** Công nghệ Phần mềm Mới 
> **Tác giả:** Trình Văn Lưu  

---

## 📌 Giới Thiệu (Overview)

**Hệ Thống Quản Lý & Đặt Thuê Căn Hộ Trực Tuyến** là ứng dụng Web Full-stack hiện đại hỗ trợ người dùng tìm kiếm, xem chi tiết, đặt giữ chỗ căn hộ và quản lý hợp đồng cư dân trực tuyến. Hệ thống cung cấp giải pháp toàn diện cho cả khách hàng (xem/đặt căn hộ, quản lý hợp đồng) và Quản trị viên (quản lý danh mục căn hộ, hợp đồng và cư dân).

---

## ✨ Tính Năng Nổi Bật (Key Features)

### 👤 Dành cho Khách hàng / Cư dân
- **Xác thực & Bảo mật:** Đăng ký, đăng nhập tài khoản với mã hóa password (`Bcrypt`) & xác thực qua `JWT`. Khôi phục mật khẩu bảo mật qua Email OTP (`Nodemailer`).
- **Khám phá Căn hộ:** 
  - Xem danh sách căn hộ theo từng danh mục, hỗ trợ **Lazy Loading** tải dữ liệu mượt mà.
  - Xem chi tiết thông số kỹ thuật, giá thuê/bán, tiện ích và slider hình ảnh (`Swiper`).
- **Giỏ hàng & Đặt giữ chỗ (Booking Cart):** Thêm căn hộ yêu thích vào giỏ hàng, xem chi tiết và thực hiện quy trình đăng ký giữ chỗ/thuê căn hộ.
- **Bảng điều khiển Cư dân (Resident Dashboard):** Theo dõi danh sách căn hộ đã thuê/mua, quản lý thông tin cá nhân và tra cứu hợp đồng trực tuyến.

### 🛠 Dành cho Quản trị viên (Admin API)
- Quản lý danh mục căn hộ (Thêm, sửa, xóa, cập nhật trạng thái khả dụng).
- Quản lý và duyệt danh sách hợp đồng đặt chỗ/thuê căn hộ từ cư dân.
- Quản lý tài khoản và phân quyền người dùng trong hệ thống.

---

## 🛠 Công Nghệ Sử Dụng (Tech Stack)

### 🔹 Frontend
- **Core Framework:** React 18 (Vite)
- **State Management:** Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)
- **Routing:** React Router DOM v6
- **UI Components & Icons:** Ant Design (`antd`), `@ant-design/icons`
- **Styling:** Tailwind CSS, PostCSS, Autoprefixer
- **Slider / Carousel:** Swiper
- **HTTP Client:** Axios

### 🔹 Backend
- **Runtime & Framework:** Node.js, Express.js (v5)
- **Database & ORM:** MongoDB, Mongoose ORM
- **Authentication:** JSON Web Token (`jsonwebtoken`), `bcrypt` / `bcryptjs`
- **Mailer Service:** Nodemailer, EJS (Template Engine)
- **Environment & Utilities:** `dotenv`, `cors`, `nodemon`

### 🔹 DevOps & Tooling
- **Concurrently:** Cho phép chạy đồng thời cả Backend và Frontend chỉ với một câu lệnh đơn duy nhất tại root.

---

## 📂 Cấu Trúc Dự Án (Project Structure)

```text
BTTuan02_Buoi4_CNPMMoi/
├── backend/                  # Server Backend (Express.js + Node.js)
│   ├── src/
│   │   ├── config/           # Kết nối Database (db.js)
│   │   ├── controllers/      # Xử lý logic nghiệp vụ
│   │   ├── middleware/       # JWT Auth & Phân quyền middleware
│   │   ├── models/           # Mongoose Schemas (User, Apartment, Cart, Contract)
│   │   ├── routes/           # RESTful API Routes
│   │   ├── seeder.js         # Script khởi tạo dữ liệu mẫu
│   │   └── server.js         # Điểm khởi chạy Backend Server
│   ├── .env                  # Cấu hình biến môi trường Backend
│   └── package.json
│
├── frontend/                 # Client Frontend (React.js + Vite)
│   ├── src/
│   │   ├── api/              # Axios instance & API calls
│   │   ├── components/       # UI Components dùng chung
│   │   ├── pages/            # Các trang giao diện (Home, Detail, BookingCart, ResidentDashboard,...)
│   │   ├── store/            # Redux Store & Slices
│   │   └── styles/           # Global styles & Tailwind config
│   ├── index.html
│   └── package.json
│
├── package.json              # Package root chứa script chạy đồng thời
└── README.md                 # Tài liệu hướng dẫn dự án
```

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy (Getting Started)

### 📋 Yêu cầu tiên quyết
- **Node.js**: `>= 18.x`
- **MongoDB**: Chạy cục bộ (Local MongoDB) hoặc MongoDB Atlas Connection String.

### 1️⃣ Clone Dự án
```bash
git clone https://github.com/Luuloneranger/BTTuan02_Buoi4_CNPMMoi.git
cd BTTuan02_Buoi4_CNPMMoi
```

### 2️⃣ Cài Đặt Dependencies

Cài đặt tất cả packages cho thư mục root, backend và frontend:

```bash
# Cài đặt tại root
npm install

# Cài đặt Backend
cd backend && npm install && cd ..

# Cài đặt Frontend
cd frontend && npm install && cd ..
```

### 3️⃣ Cấu Hình Biến Môi Trường (.env)

Tạo file `.env` trong thư mục `backend/`:

```env
PORT=8089
MONGO_URI=mongodb://localhost:27017/apartment_booking
JWT_SECRET=your_secret_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

### 4️⃣ Tạo Dữ Liệu Mẫu (Seeder - Tùy chọn)
Chạy script seeder để nạp sẵn dữ liệu thử nghiệm (Căn hộ, Tài khoản mẫu):

```bash
cd backend
node src/seeder.js
cd ..
```

### 5️⃣ Khởi Chạy Ứng Dụng

Chạy **đồng thời** cả Backend và Frontend bằng 1 lệnh duy nhất tại thư mục root:

```bash
npm run dev
```

- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:8089`

---

## 📡 Danh Sách RESTful API Chính

| Phương thức | Endpoint | Mô tả | Phân quyền |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Đăng ký tài khoản mới | Public |
| **POST** | `/api/auth/login` | Đăng nhập hệ thống | Public |
| **POST** | `/api/auth/forgot-password` | Gửi OTP khôi phục mật khẩu qua Email | Public |
| **GET** | `/api/apartments` | Lấy danh sách căn hộ (hỗ trợ lọc & phân trang) | Public |
| **GET** | `/api/apartments/:id` | Lấy chi tiết căn hộ | Public |
| **GET** | `/api/cart` | Lấy danh sách căn hộ trong giỏ đặt chỗ | User |
| **POST** | `/api/cart` | Thêm căn hộ vào giỏ đặt chỗ | User |
| **GET** | `/api/contracts` | Danh sách hợp đồng của người dùng | User |
| **POST** | `/api/contracts` | Tạo hợp đồng đặt giữ chỗ mới | User |
| **GET / POST** | `/api/admin/*` | Quản trị danh mục căn hộ, hợp đồng và người dùng | Admin |

---

## 📝 Giấy Phép (License)
Dự án được phát hành dưới giấy phép **ISC License**.

