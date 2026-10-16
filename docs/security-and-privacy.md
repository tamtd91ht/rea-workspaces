# Bảo mật và quyền riêng tư

## Quyền được phép

- Chỉ phân tích phần mềm, hệ thống và dữ liệu bạn sở hữu hoặc được phép kiểm tra
  (xem [DISCLAIMER](https://github.com/morluto/rea/blob/main/DISCLAIMER.md) của REA).
- Ghi lại cơ sở được phép trong `scope/authorization.md` và `project.yaml` trước
  mọi phân tích; chỉ đặt `authorization.confirmed: true` sau khi có xác nhận rõ ràng.
- Tương tác runtime (trình duyệt, Electron, process capture, thiết bị) còn cần
  hoạt động đó được đánh dấu là được phép trong `scope/authorization.md`.
- Công cụ thương mại (IDA, Hopper, JEB) phải có license hợp lệ; không bao giờ
  vượt qua cơ chế license, xác thực hay kiểm soát truy cập.

## Thông tin đăng nhập

- Không bao giờ lưu mật khẩu, session cookie, bearer/refresh token, API key hay
  private key trong file dự án, báo cáo, prompt, ảnh chụp hoặc commit.
- Gọi tài khoản test theo vai trò ("test user A"); giữ secret của chúng trong
  trình quản lý mật khẩu.
- Che giá trị bằng `[REDACTED:cookie]`, `[REDACTED:token]`, v.v. Bản thân REA che
  thông tin xác thực ở tầng truyền tải và các giá trị được đánh dấu rõ là nhạy
  cảm, nhưng không suy đoán độ nhạy cảm từ tên — hãy rà soát output của nó trước
  khi sao chép trích đoạn.
- Trong workspace này Claude Code bị chặn đọc `.env`, `*.pem`, `*.key`, `*.p12`,
  `*.pfx` và SSH key (`.claude/settings.json`).

## Điều tra website

- Dùng tài khoản test riêng và một profile trình duyệt riêng:
  ```powershell
  & "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir="$env:TEMP\rea-browser-profile" http://127.0.0.1:3000
  ```
  REA không khởi động hay tắt trình duyệt này; hãy tự đóng khi xong. Không bao
  giờ mở cổng debug ra ngoài loopback (`127.0.0.1`). Nguồn:
  `rea-core/docs/browser-observation.md`.
- Ưu tiên quan sát thụ động. Các kịch bản đã khai báo phải tránh request phá
  hoại hoặc làm thay đổi trạng thái, trừ khi được phép.
- Tránh thu thập dữ liệu cá nhân không liên quan; nếu lỡ thu thập thì không trích dẫn.

## Lưu giữ bằng chứng

- `artifacts/` và `evidence/raw/` chứa tài liệu lớn hoặc chưa che, và bị Git
  ignore. File capture (`*.har`, `*.saz`, `*.pcap`, `*.pcapng`, `*.qlog`) bị
  ignore ở mọi nơi.
- Khi đóng dự án, thống nhất với chủ sở hữu việc giữ artifact, chuyển sang kho
  lưu trữ được duyệt, hay xóa.

## Vệ sinh Git

- Repo workspace có remote trên GitHub: tuyệt đối không chứa dữ liệu dự án.
  `.gitignore` của nó loại trừ `projects/*`, `archive/*`, `rea-core/`, secret và capture.
- Repo của dự án không được thêm remote cho tới khi đã quyết định dữ liệu được
  phép lưu ở đâu.
- `.gitignore` không bảo vệ các file đã được track. Nếu lỡ commit secret:
  `git rm --cached <file>`, commit, **thay mới (rotate) secret đó**, và coi như lịch
  sử đã bị lộ (viết lại lịch sử là một thao tác riêng, cần được duyệt).
- Chạy `node scripts/check.mjs sensitive` trước khi commit hoặc push.

## Lưu ý về nhà cung cấp AI

REA phân tích target ở máy cục bộ, nhưng mọi kết quả tool, trích đoạn file và
prompt mà Claude Code xử lý đều được gửi tới nhà cung cấp mô hình (Anthropic)
theo chính sách dữ liệu của họ và cài đặt tài khoản của bạn. "Phân tích cục bộ"
không có nghĩa là kết quả ở lại trên máy. Với target nhạy cảm:

- Giữ output gốc dung lượng lớn trong `artifacts/` và chỉ gửi bản tóm tắt/view cho agent.
- Không dán secret hay dữ liệu cá nhân vào cuộc hội thoại.
- Kiểm tra chính sách của tổ chức về việc gửi mã nguồn hoặc dữ liệu độc quyền
  tới nhà cung cấp AI trước khi bắt đầu dự án.
