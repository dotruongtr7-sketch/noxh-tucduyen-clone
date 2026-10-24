# Home Central – Clone landing page (NOXH Túc Duyên)

Bản dựng lại giao diện trang **noxhtucduyen.vn** dưới dạng web tĩnh (HTML/CSS/JS thuần), tự chứa toàn bộ ảnh & icon.

## Chạy xem
- Cách nhanh: mở thẳng `index.html` bằng trình duyệt.
- Có server tĩnh (đúng hơn cho đường dẫn ảnh): chạy PowerShell
  ```powershell
  powershell -ExecutionPolicy Bypass -File serve.ps1 -Port 8123
  ```
  rồi mở http://localhost:8123

## Cấu trúc
```
index.html            – toàn bộ nội dung 1 trang
css/style.css         – giao diện (màu teal #3597A0 + cam #ee7a2b)
js/script.js          – header sticky, menu mobile, tabs, lightbox video, form
assets/img/           – ảnh phối cảnh, mặt bằng, tin tức, logo
assets/svg/           – icon thông số & mạng xã hội (dạng PNG)
serve.ps1             – static server để preview
```

## Section
Header · Hero (video) · Tổng quan (9 thông số) · Vị trí (timeline kết nối) ·
Tiện ích (mặt bằng + chú thích) · Mặt bằng (tab tòa H1/H2/H3) · Tin tức ·
Thư viện · Liên hệ (form đăng ký) · Footer · Nút nổi (gọi/Zalo/YouTube).

## Ghi chú
- **Font**: bản gốc dùng *SVN-Gotham* (bản quyền, server chặn tải). Bản này thay bằng
  **Montserrat** (rất sát Gotham) + **Great Vibes** cho chữ ký. Nếu có file
  `SVN-Gotham-*.otf`, bỏ vào `assets/fonts/` và khai báo `@font-face` để giống 100%.
- **Form** hiện chỉ chạy phía client (log ra console). Muốn nhận lead thật, thay
  phần xử lý trong `js/script.js` bằng `fetch()` POST tới API/Google Sheet/CRM.
- Nội dung & hình ảnh thuộc bản quyền Công ty CP Đầu tư Homever – dùng cho mục đích
  tham khảo/dựng mẫu.
