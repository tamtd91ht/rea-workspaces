# Bằng chứng

- `register.md` — sổ đăng ký bằng chứng (ID `E-001`, ...). Mọi mục được một
  phát hiện dẫn chiếu đều phải có trong sổ.
- Có thể lưu trích đoạn nhỏ, đã che dữ liệu nhạy cảm, dễ đọc ngay cạnh sổ
  (ví dụ `E-003-ipc-handler.txt`). Đặt tên file theo ID bằng chứng.
- `raw/` — output tool chưa che hoặc dung lượng lớn cần giữ để truy nguồn.
  Bị Git ignore. Chỉ tạo khi cần.
- Output lớn, tái tạo được (Evidence JSON đầy đủ của REA, app đã giải nén)
  thuộc về `../artifacts/`.

Trước khi lưu bất cứ thứ gì vào đây: xóa cookie, token, mật khẩu, key và dữ
liệu cá nhân không liên quan, thay giá trị bằng `[REDACTED:<loại>]`.
