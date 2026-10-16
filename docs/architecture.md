# Kiến trúc

## Phân chia trách nhiệm

| Đường dẫn | Phụ trách | Quản lý phiên bản |
| --- | --- | --- |
| `CLAUDE.md`, `.claude/` | Cách Claude Code hoạt động trong workspace này | Repo workspace |
| `docs/` | Quy trình (mỗi chủ đề chỉ có một tài liệu chuẩn) | Repo workspace |
| `templates/` | Bộ khung dự án và các template tài liệu đã được duyệt | Repo workspace |
| `scripts/` | Tạo dự án và các kiểm tra chỉ đọc | Repo workspace |
| `rea-core/` | Mã nguồn, tài liệu và skill agent chính thức của REA (upstream) | Bản clone riêng của `morluto/rea` |
| `projects/<id>/` | Phạm vi, bằng chứng, phát hiện và sản phẩm bàn giao của một dự án | Repo riêng của dự án (tùy chọn) |
| `archive/<id>/` | Các dự án đã đóng | Giống như dự án |

Workspace và các dự án có trách nhiệm tách biệt: workspace giữ môi trường và
các quy trình dùng lại được; mỗi dự án giữ mục tiêu, phạm vi, bằng chứng và
quyết định của riêng nó. Không có gì thuộc về một dự án được ghi ra ngoài
`projects/<id>/`.

## Mô hình Git

- **Repo workspace** (thư mục gốc): chỉ theo dõi các file của workspace.
  `.gitignore` loại trừ `rea-core/`, `projects/*`, `archive/*`, secret và file
  capture. Không commit tên dự án hay dữ liệu dự án, vì repo này có remote
  (`github.com/tamtd91ht/rea-workspaces`).
- **rea-core**: bản clone độc lập của `https://github.com/morluto/rea.git`.
  Không phải submodule; không bao giờ chỉnh sửa. Xem [rea-maintenance.md](rea-maintenance.md).
- **Repo của dự án**: tùy chọn (`new-project.mjs --git`). Dùng khi dự án kéo
  dài hoặc báo cáo cần lịch sử. Không thêm remote trước khi quyết định dữ liệu
  dự án được phép lưu ở đâu (xem [security-and-privacy.md](security-and-privacy.md)).
- Không dùng submodule, worktree hay công cụ monorepo.

## Tích hợp REA

| Lớp | Vị trí | Ghi chú |
| --- | --- | --- |
| MCP server | `~/.claude.json` → `projects["D:/…/rea-workspaces"].mcpServers.rea` (Claude Code **local scope**) | `cmd.exe /d /c npx -y rea-agents@6.5.0 mcp`; chỉ workspace này thấy |
| CLI | `npx -y rea-agents@6.5.0 <command>` | Không cài toàn cục |
| Phương pháp điều tra | `rea-core/.agents/skills/reverse-engineer-anything/` | Được `/rea-investigation` đọc; cố ý không cài skill ở cấp user |
| Engine phân tích | Chưa cài (Ghidra/IDA/JADX do người dùng tự cung cấp) | JS/Electron tĩnh, .NET, metadata Go/Rust chạy được mà không cần engine |

Chọn local scope để 207 tool của REA không bị nạp vào các dự án Claude Code
không liên quan.

## Mô hình phiên làm việc

Khởi động Claude Code từ thư mục gốc workspace. Đã kiểm chứng ngày 2026-10-16
bằng `claude mcp list`: `rea` kết nối được từ thư mục gốc và từ một thư mục con
thông thường của repo workspace (`docs/`), nhưng **không** có khi đứng bên
trong một dự án có repo Git riêng. Claude Code cũng không kế thừa
`.claude/settings.json` từ thư mục cha, và skill của dự án chỉ được tìm tới Git
root gần nhất — nên phiên khởi động bên trong dự án như vậy sẽ thiếu MCP server,
settings và skill của workspace.

## Vì sao bộ khung dự án nằm ở `templates/project/`

Đặt nó ngoài `projects/` giúp mọi thư mục trong `projects/` đều là dự án thật:
việc liệt kê, quy tắc ignore và script không cần ngoại lệ.
