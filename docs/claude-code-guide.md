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
| `.claude/rules/security.md` | Chốt chặn quyền được phép, che dữ liệu, capture, cổng debug, luồng dữ liệu ra ngoài (Gemini, shadcn, GitHub) |
| `.claude/rules/workspace-integrity.md` | Bảo vệ `rea-core`, file người dùng, cấu hình người dùng; giữ tài liệu đã kiểm chứng |
| `.claude/settings.json` | Chặn đọc file key/env; chặn sửa trong `rea-core/`; hỏi trước khi `git push` và `rea setup`; đăng ký hook guard |
| `.claude/skills/rea-project-init` | `/rea-project-init <tên> [mục tiêu]` |
| `.claude/skills/rea-investigation` | `/rea-investigation <project-id> [câu hỏi]` — REA |
| `.claude/skills/rea-ui-design` | `/rea-ui-design <project-id>` — điều phối UI UX Pro Max |
| `.claude/skills/rea-engineering` | `/rea-engineering <project-id>` — điều phối agent/skill ECC |
| `.claude/skills/rea-session-save`, `rea-session-resume` | Lưu/tiếp tục phiên vào `projects/<id>/notes/sessions/` |
| `.claude/skills/rea-evidence-review` | `/rea-evidence-review <project-id>` |
| `.claude/skills/rea-project-closeout` | `/rea-project-closeout <project-id> [archive]` — chỉ gọi thủ công (`disable-model-invocation`) |
| `.claude/agents/report-sanitizer.md` | Agent chỉ đọc, rà báo cáo trước khi chia sẻ |
| Skill/agent từ ECC (14 skill, 10 agent) | Xem [ecc-guide.md](ecc-guide.md) |
| Skill từ UI UX Pro Max (7 skill) | Xem [ui-ux-pro-max-guide.md](ui-ux-pro-max-guide.md) |
| `.claude/hooks/guard.mjs` | Hook PreToolUse bảo vệ workspace (xem bên dưới) |
| `.claude/THIRD_PARTY_NOTICES.md` | Nguồn gốc, phiên bản, giấy phép của thành phần bên thứ ba |

Skill riêng của workspace chỉ **điều phối** công cụ có sẵn (đọc/ghi file dự
án, chọn agent/skill, áp quy tắc bằng chứng) — không sao chép chức năng của chúng.

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
