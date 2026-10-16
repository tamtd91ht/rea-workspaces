# Cấu hình Claude Code

Các quy ước đã được kiểm chứng với tài liệu Claude Code (code.claude.com, các
trang memory, skills, settings, permissions, MCP) ngày 2026-10-16 cho Claude Code 2.1.x.

## Thứ gì được nạp khi nào

Khởi động `claude` ở thư mục gốc workspace. Khi đó:

| Thành phần | Nguồn | Được nạp |
| --- | --- | --- |
| `CLAUDE.md` | gốc | Khi khởi động |
| `.claude/rules/*.md` | gốc | Khi khởi động (không có frontmatter `paths:` nên luôn nạp) |
| `projects/<id>/CLAUDE.md` | dự án | Khi cần, lúc Claude làm việc trong thư mục đó |
| `.claude/skills/*/SKILL.md` | gốc | Có thể khám phá; gọi bằng `/tên` |
| `.claude/settings.json` | gốc | Chỉ thư mục làm việc của phiên — phiên khởi động trong thư mục con không kế thừa |
| MCP server `rea` | `~/.claude.json`, local scope cho thư mục này | Khi khởi động |

## Các file

| File | Mục đích |
| --- | --- |
| `CLAUDE.md` | Bản đồ workspace, chọn dự án, cách dùng REA, cốt lõi về bằng chứng và bảo mật, khi nào cần hỏi |
| `.claude/rules/project-management.md` | Đặt tên, tạo dự án, cập nhật trạng thái, duyệt Git/lưu trữ |
| `.claude/rules/evidence.md` | Nhãn, sổ đăng ký, ID, không bịa đặt |
| `.claude/rules/security.md` | Chốt chặn quyền được phép, che dữ liệu, capture, cổng debug, dữ liệu gửi nhà cung cấp |
| `.claude/rules/workspace-integrity.md` | Bảo vệ `rea-core`, file người dùng, cấu hình người dùng; giữ tài liệu đã kiểm chứng |
| `.claude/settings.json` | Chặn đọc file key/env; chặn sửa trong `rea-core/`; hỏi trước khi `git push` và `rea setup` |
| `.claude/skills/rea-project-init` | `/rea-project-init <tên> [mục tiêu]` |
| `.claude/skills/rea-investigation` | `/rea-investigation <project-id> [câu hỏi]` |
| `.claude/skills/rea-evidence-review` | `/rea-evidence-review <project-id>` |
| `.claude/skills/rea-project-closeout` | `/rea-project-closeout <project-id> [archive]` — chỉ gọi thủ công (`disable-model-invocation`) |

Không định nghĩa agent tùy chỉnh: skill điều tra có thể yêu cầu Claude dùng các
subagent có sẵn cho những câu hỏi độc lập, và một agent riêng chưa đem lại lợi
ích cụ thể. Chỉ thêm agent vào `.claude/agents/` khi có nhu cầu đã được chứng minh.

## Commit và cục bộ

| Được commit (repo workspace) | Chỉ cục bộ |
| --- | --- |
| `CLAUDE.md`, `.claude/settings.json`, `.claude/rules/`, `.claude/skills/` | `.claude/settings.local.json`, `CLAUDE.local.md` (bị Git ignore), `~/.claude.json` (đăng ký MCP) |

Đặt các quyền được duyệt riêng cho cá nhân vào `.claude/settings.local.json`.
Không bao giờ đặt thông tin đăng nhập vào bất kỳ file nào trong số này.

## Ghi chú về quyền

- `deny` thắng `ask`, `ask` thắng `allow`. Các quy tắc deny chặn Read/Grep/Glob
  của Claude và các lệnh shell đọc file phổ biến với những đường dẫn đó, nhưng
  không chặn được mọi subprocess.
- Không cấu hình quy tắc `allow` rộng nào; các lời nhắc xin quyền vẫn hoạt động bình thường.

## Thay đổi cấu hình

Giữ `CLAUDE.md` ngắn gọn; đưa quy trình vào skill hoặc `docs/`. Ghi thay đổi vào
`CHANGELOG.md`. Kiểm chứng các khóa settings mới với schema chính thức
(`https://json.schemastore.org/claude-code-settings.json`).
