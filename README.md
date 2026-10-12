# Smart Home Website Demo

## Chạy trên máy tính
1. Giải nén thư mục.
2. Mở thư mục `smart-home-website` trong Visual Studio Code.
3. Mở `index.html` bằng trình duyệt, hoặc dùng extension Live Server.
4. Thử nút bật/tắt. Hiện tại đây chỉ là demo giao diện.

## Các tệp
- `index.html`: cấu trúc nội dung.
- `style.css`: giao diện và bố cục responsive.
- `script.js`: tương tác, đồng hồ và ví dụ `fetch()`.

## Kết nối API thật sau này
Trong `script.js`:
1. Đổi `API_BASE_URL` thành URL backend HTTPS thật.
2. Đổi `DEMO_MODE` thành `false`.
3. Đảm bảo backend triển khai:
   - `GET /api/status`
   - `POST /api/devices/light` với JSON `{"state":"on"}` hoặc `{"state":"off"}`
   - `POST /api/devices/fan` với JSON tương tự.
4. Backend phải bật CORS cho domain GitHub Pages của bạn.

Các endpoint trên chỉ là ví dụ hợp đồng API; chúng chưa tồn tại cho đến khi bạn xây backend.

## Đưa lên GitHub Pages
1. Tạo repository mới trên GitHub.
2. Upload `index.html`, `style.css`, `script.js` lên thư mục gốc của repository.
3. Mở Settings -> Pages.
4. Trong phần Build and deployment, chọn Deploy from a branch.
5. Chọn branch `main` và folder `/ (root)`, rồi Save.
6. Chờ GitHub Pages triển khai và mở URL mà GitHub cung cấp.

## Lưu ý bảo mật và phần cứng
- Không đặt mật khẩu Wi-Fi, API secret hay khóa riêng tư trong JavaScript phía trình duyệt.
- GitHub Pages không chạy backend.
- Không nên mở trực tiếp ESP8266 ra Internet hoặc dùng HTTP không bảo vệ cho điều khiển thiết bị.
- Chỉ kết nối relay và điện lưới khi đã có thiết kế an toàn, cách ly phù hợp và người có chuyên môn kiểm tra.
