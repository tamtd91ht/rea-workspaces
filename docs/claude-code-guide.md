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
| `.claude/settings.json` | Chặn đọc file key/env; chặn sửa trong `rea-core/`; hỏi trước khi `git push` và `rea setup`; đăng ký hook guard |
| `.claude/skills/rea-project-init` | `/rea-project-init <tên> [mục tiêu]` |
| `.claude/skills/rea-investigation` | `/rea-investigation <project-id> [câu hỏi]` |
| `.claude/skills/rea-evidence-review` | `/rea-evidence-review <project-id>` |
| `.claude/skills/rea-project-closeout` | `/rea-project-closeout <project-id> [archive]` — chỉ gọi thủ công (`disable-model-invocation`) |
| `.claude/skills/rea-session-save`, `rea-session-resume` | Lưu/tiếp tục phiên điều tra vào `projects/<id>/notes/sessions/` |
| `.claude/skills/api-design`, `springboot-*`, `jpa-patterns`, `java-coding-standards`, `golang-patterns`, `golang-testing` | Skill tham khảo backend (copy từ ECC) |
| `.claude/agents/java-reviewer.md`, `go-reviewer.md`, `security-reviewer.md` | Agent review code (copy từ ECC; `model: sonnet` giữ nguyên bản gốc) |
| `.claude/agents/report-sanitizer.md` | Agent chỉ đọc, rà báo cáo trước khi chia sẻ |
| `.claude/hooks/guard.mjs` | Hook PreToolUse bảo vệ workspace (xem bên dưới) |
| `.claude/THIRD_PARTY_NOTICES.md` | Nguồn gốc, commit ECC và giấy phép MIT của phần được copy/chuyển thể |

## Thành phần lấy từ ECC

Copy có chọn lọc từ [ECC](https://github.com/affaan-m/ECC) bản 2.2.3 (commit
`76aaa77`), giữ nguyên văn để dễ cập nhật. **Không** cài installer, hooks hay
plugin của ECC: chúng gồm 28 hook ở mọi sự kiện và hàng trăm skill không liên
quan. Danh sách đầy đủ và cách cập nhật: `.claude/THIRD_PARTY_NOTICES.md`.

Skill backend dùng cho hai việc: diễn giải backend của target (kết luận dựa
trên "Spring/Go thường làm vậy" luôn là **Inferred**), và xây lại tính năng
tương tự trong dự án của bạn. Agent review chỉ chạy lệnh build/test trên code
của bạn, không bao giờ trên artifact của target.

<a id="guard-hook"></a>

## Hook bảo vệ (guard)

Đăng ký trong `.claude/settings.json` (`PreToolUse`, matcher
`Write|Edit|MultiEdit|NotebookEdit|Bash|PowerShell`), chạy
`node "$CLAUDE_PROJECT_DIR/.claude/hooks/guard.mjs"`:

| Quy tắc | Quyết định |
| --- | --- |
| Nội dung ghi vào workspace trông giống secret (token, cookie, key, JWT, mật khẩu), trừ `artifacts/` và `evidence/raw/` | deny — yêu cầu che `[REDACTED:<loại>]` |
| Ghi vào `projects/<khác>` hoặc `archive/<khác>` khi đã có dự án đang làm | deny |
| `rm -r`/`Remove-Item -Recurse` vào dữ liệu workspace, `git reset --hard`, `git clean -f`, `git push --force`, `git checkout .` | ask — bạn xác nhận |

- Dự án đang làm: `node scripts/active-project.mjs set <id>` / `show` / `clear`
  (file `.claude/active-project`, không commit). `/rea-project-init` và
  `/rea-investigation` tự đặt; `/rea-project-closeout` tự xóa.
- Lỗi nội bộ của hook → cho phép thao tác và in cảnh báo (fail-open), để lỗi
  hook không làm kẹt phiên.
- Giới hạn: không thấy được file do lệnh shell ghi ra (ví dụ `> file`), và chỉ
  dựa trên mẫu. Đây là lớp bảo vệ bổ sung, không thay thế việc rà soát.
- Hook chỉ chạy khi folder đã được chấp nhận trong hộp thoại trust của Claude Code.
- Kiểm thử sau khi sửa hook: `node scripts/test-guard.mjs` (21 trường hợp).
  Đã kiểm chứng thêm trong một phiên `claude -p` thật ngày 2026-10-16.
- Tắt: xóa khối `hooks` trong `.claude/settings.json` (xem lại bằng lệnh `/hooks`).

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
