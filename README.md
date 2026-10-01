# Scribd Extension

Một tiện ích mở rộng nhẹ dành cho trình duyệt, hỗ trợ tối ưu hóa quá trình đọc và xuất tài liệu từ Scribd sang định dạng PDF.

## 📖 Giới thiệu

Scribd Extension được phát triển nhằm đơn giản hóa quá trình chuẩn bị tài liệu Scribd để in hoặc lưu dưới dạng PDF.

Extension cung cấp giao diện đơn giản với quy trình gồm hai bước: mở phiên bản Embed của tài liệu và thực hiện tải, xử lý तथा xuất tài liệu sang PDF.

Công cụ cũng hỗ trợ tự động cuộn trang để tải các nội dung Lazy Loading trước khi mở hộp thoại in, giúp hạn chế tình trạng thiếu trang hoặc trang trắng trong file PDF.

## ✨ Tính năng chính

### 1. Mở bản Embed

Chuyển đổi tài liệu Scribd thông thường sang phiên bản Embed:

- **Chuyển đổi tự động:** Nhận diện URL tài liệu Scribd và tạo link Embed tương ứng.
- **Giao diện tối giản:** Phiên bản Embed giúp loại bỏ bớt các thành phần giao diện không cần thiết khi chuẩn bị tài liệu để in.
- **Thao tác nhanh:** Người dùng chỉ cần nhấn nút **"Mở bản Embed"** để chuyển sang phiên bản phù hợp.

### 2. Tải và In PDF

Tính năng chính hỗ trợ chuẩn bị tài liệu trước khi xuất PDF:

- **Tự động cuộn:** Extension tự động cuộn toàn bộ tài liệu để kích hoạt quá trình tải các trang Lazy Loading.
- **Kiểm tra nội dung:** Theo dõi số lượng trang và chiều cao tài liệu để xác định khi nào nội dung đã ổn định.
- **Xóa UI không cần thiết:** Loại bỏ toolbar, banner, popup và một số thành phần giao diện không cần thiết khi in.
- **Tối ưu bố cục:** Điều chỉnh kích thước và vị trí của từng trang tài liệu trước khi in.
- **Hạn chế trang trắng:** Xử lý các phần tử dư thừa có thể gây ra trang trắng hoặc làm lệch bố cục khi xuất PDF.
- **Print trực tiếp:** Sau khi hoàn tất quá trình xử lý, Chrome sẽ tự động mở hộp thoại Print để người dùng lưu tài liệu dưới dạng PDF.

---

## ⚠️ Lưu ý

Để quá trình tải PDF hoạt động ổn định, người dùng nên đảm bảo tài liệu đã được tải đầy đủ trước khi thực hiện.

- Nên **cuộn đến cuối tài liệu trên Scribd** để nội dung được tải đầy đủ.
- Sau khi mở bản **Embed**, nên tiếp tục kiểm tra và cuộn hết tài liệu.
- Không nên bấm **"Tải và In PDF"** khi tài liệu vẫn đang tải hoặc còn nhiều trang chưa hiển thị.
- Nếu nội dung chưa được tải đầy đủ, file PDF có thể xuất hiện **trang trắng, thiếu trang hoặc thiếu nội dung**.

Extension có hỗ trợ tự động cuộn để tải nội dung, tuy nhiên tốc độ tải có thể phụ thuộc vào kích thước tài liệu và tốc độ mạng.

---

## 🛠 Hướng dẫn cài đặt

Do đây là công cụ phát triển cá nhân và chưa được đưa lên Chrome Web Store, bạn cần cài đặt thủ công thông qua chế độ Developer.

1. **Tải mã nguồn:** Tải file `.zip` của project về máy và giải nén.

2. **Mở trình quản lý Extension:** Truy cập:

   `chrome://extensions/`

3. **Bật Developer Mode:** Bật công tắc **"Developer mode"** ở góc trên bên phải.

4. **Load Extension:** Nhấn **"Load unpacked"**.

5. **Chọn thư mục:** Chọn thư mục chứa mã nguồn của `Scribd Extension`.

Sau khi cài đặt thành công, biểu tượng extension sẽ xuất hiện trong danh sách tiện ích của trình duyệt.

## 🚀 Cách sử dụng

### Bước 1 — Mở tài liệu

1. Truy cập tài liệu cần xử lý trên Scribd.
2. Đảm bảo tài liệu đã hiển thị đầy đủ.
3. Cuộn xuống cuối tài liệu để kích hoạt quá trình tải nội dung.

### Bước 2 — Mở bản Embed

1. Nhấn biểu tượng **Scribd Extension** trên trình duyệt.
2. Chọn **"1. Mở bản Embed"**.
3. Extension sẽ tự động chuyển tài liệu sang URL Embed.
4. Chờ trang Embed tải hoàn tất.
5. Cuộn kiểm tra tài liệu đến cuối trang.

### Bước 3 — Tải và In PDF

1. Mở lại **Scribd Extension**.
2. Nhấn **"2. Tải và In PDF"**.
3. Extension bắt đầu tự động cuộn tài liệu.
4. Chờ toàn bộ nội dung được tải.
5. Extension sẽ xử lý bố cục và loại bỏ các thành phần UI không cần thiết.
6. Chrome tự động mở cửa sổ **Print**.
7. Chọn **"Save to PDF"** để lưu tài liệu.

---

## 👨‍💻 Author

**Made by Quang Huy** ❤️
