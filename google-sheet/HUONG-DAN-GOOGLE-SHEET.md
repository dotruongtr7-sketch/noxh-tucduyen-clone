# Đổ dữ liệu form về Google Sheet — Hướng dẫn 5 bước (~3 phút)

Không cần server, miễn phí, dữ liệu về thẳng Google Sheet của Anh.

## Bước 1 — Tạo Google Sheet
1. Vào https://sheets.new (tạo bảng tính mới).
2. Đặt tên, ví dụ **"Leads Home Central"**.

## Bước 2 — Mở Apps Script
- Trên Sheet: menu **Tiện ích mở rộng (Extensions) → Apps Script**.

## Bước 3 — Dán code
1. Xóa hết nội dung mẫu trong ô soạn thảo.
2. Mở file **`Code.gs`** (cùng thư mục này), copy toàn bộ, dán vào.
3. Bấm biểu tượng **💾 Save** (Ctrl+S).

## Bước 4 — Deploy thành Web App
1. Bấm nút **Deploy (Triển khai) → New deployment (Bản triển khai mới)**.
2. Ở ô "Select type" (bánh răng ⚙️) → chọn **Web app**.
3. Điền:
   - **Description:** Home Central form
   - **Execute as:** **Me** (chính Anh)
   - **Who has access:** **Anyone** (Bất kỳ ai) ← BẮT BUỘC để web gửi được
4. Bấm **Deploy**.
5. Lần đầu Google hỏi quyền → **Authorize access** → chọn tài khoản → nếu hiện
   "Google hasn't verified this app" thì bấm **Advanced → Go to … (unsafe)** →
   **Allow**. (An toàn vì đây là script của chính Anh.)
6. Copy **Web app URL** (dạng `https://script.google.com/macros/s/……/exec`).

## Bước 5 — Gắn link vào web
Có 2 cách:
- **Cách A (nhanh):** gửi link `……/exec` đó cho em, em dán vào web + test giúp Anh.
- **Cách B (tự làm):** mở file `js/script.js`, dòng đầu tìm:
  ```js
  var SHEET_ENDPOINT = '';
  ```
  dán link vào giữa 2 dấu nháy:
  ```js
  var SHEET_ENDPOINT = 'https://script.google.com/macros/s/XXXXX/exec';
  ```
  Lưu lại → tải lại web → điền thử form → mở Sheet xem có dòng mới.

---

## Kiểm tra nhanh
- Dán Web app URL vào trình duyệt → thấy chữ **"Home Central lead endpoint: OK"** là deploy đúng.
- Điền form trên web → trong Sheet, tab **Leads** sẽ có: Thời gian · Họ tên · SĐT · Email · Nguồn.

## Lưu ý
- Mỗi lần **sửa code** trong Apps Script phải **Deploy → Manage deployments → chỉnh
  (bút chì) → Version: New version → Deploy** thì thay đổi mới có hiệu lực. (Chỉ đổi
  code mới cần; gắn link vào web thì không.)
- Muốn nhận **email/Zalo báo mỗi lead mới** — báo em, em thêm vào `Code.gs`.
