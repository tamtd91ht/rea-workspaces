# Xử lý sự cố

## Không thấy tool REA trong Claude Code

1. Bạn có khởi động từ thư mục gốc workspace không? Đăng ký chỉ có hiệu lực tại đó.
   Nếu đang ở trong một dự án có repo Git riêng, hãy khởi động `claude` ở thư mục gốc.
2. Chạy `claude mcp list` (từ thư mục gốc). Kỳ vọng: `rea: cmd.exe /d /c npx -y rea-agents@6.5.0 mcp - ✓ Connected`.
3. Không có trong danh sách → đăng ký lại ([getting-started.md](getting-started.md#register-rea-with-claude-code)).
4. Có nhưng lỗi → `npx -y rea-agents@6.5.0 mcp doctor --json` và đọc
   `checks` / `diagnostics.stderr`.
5. Đã kết nối nhưng phiên đang chạy không có tool → khởi động lại Claude Code.
6. Trong lúc chờ, CLI vẫn dùng được mà không cần MCP: `npx -y rea-agents@6.5.0 <command> --json`.

Đừng chạy `npx rea-agents setup` để "sửa" workspace này: nó sẽ thêm một đăng ký
user scope cho mọi dự án.

## Đăng ký hiển thị `cmd.exe D:/ C:/ npx ...`

Đăng ký đã được thêm từ Git Bash, vốn tự đổi `/d` và `/c` thành đường dẫn ổ đĩa.
Sửa từ PowerShell:

```powershell
claude mcp remove --scope local rea
claude mcp add --scope local rea -- cmd.exe /d /c npx -y rea-agents@6.5.0 mcp
```

(Hoặc đặt `MSYS_NO_PATHCONV=1` cho riêng lệnh đó trong Git Bash.)

## `rea doctor` báo thiếu đăng ký Claude Code

Đây là điều bình thường. `rea doctor`, `rea update` và `rea uninstall` chỉ đọc
entry user scope, không đọc đăng ký local scope. Hãy dùng `node scripts/check.mjs`
và `claude mcp list`.

## Phân tích native/Android lỗi `capability_unavailable` hoặc `provider_unavailable`

Engine chưa được cấu hình (máy này chưa cài engine nào). Kiểm tra
`npx -y rea-agents@6.5.0 doctor --provider ghidra --json` và xem
[rea-maintenance.md](rea-maintenance.md#analysis-engines).
JS/Electron tĩnh, .NET, metadata Go/Rust không cần engine.

## Output quá lớn / context bị đầy

Ghi output CLI vào `artifacts/` và dùng view tóm tắt `inspect-analysis-view`
([operating-guide.md](operating-guide.md#cli-usage)). Trong MCP, dùng
`"detail": "summary"` và `parent_evidence_id` được trả về.
Lỗi `resource_constraint` với `details.resource: "transport"` nghĩa là: hãy yêu
cầu một view của Evidence đã được lưu thay vì chạy lại phân tích.

## Lỗi của `new-project.mjs`

| Thông báo | Cách xử lý |
| --- | --- |
| `Destination already exists` | Chọn tên/ngày khác. Không có gì bị thay đổi. |
| `Invalid --name` | Chữ thường, số, một gạch nối giữa các từ, 3–48 ký tự, không có tiền tố ngày |
| `Unresolved template placeholders` | Template có `{{KEY}}` không xác định; sửa template |
| Còn sót `projects/.staging-*` | Một lần chạy bị gián đoạn; kiểm tra rồi xóa thủ công |

## `check.mjs sensitive` cảnh báo một file

Mở file và dòng được báo (giá trị đã bị che). Che dữ liệu hoặc chuyển file sang
`artifacts/` / `evidence/raw/`. Nếu file đã được commit trong repo dự án:
`git rm --cached`, commit, thay mới secret.

## Chưa cài jq

Không cần. Dùng lệnh `node -e` một dòng trong
[operating-guide.md](operating-guide.md#cli-usage).

## Hỗ trợ từ upstream

Cập nhật trước (bản mới có thể đã sửa lỗi), sau đó báo lỗi tại REA issues:
https://github.com/morluto/rea/issues — kèm phiên bản REA, loại target, các
bước tái hiện và output lỗi (đã che dữ liệu nhạy cảm).
