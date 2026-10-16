# Kiến trúc

## Bốn lớp

| Lớp | Thành phần | Trách nhiệm | Không làm |
| --- | --- | --- | --- |
| A — Điều tra | REA (MCP + CLI) | Quan sát, thu thập bằng chứng, phân tích target được phép | Viết code sản phẩm; phân tích mã nguồn thông thường |
| B — Kỹ thuật | Thành phần ECC đã copy (agent, skill) | Lập kế hoạch, kiến trúc, TDD, sửa build, review, kiểm chứng | Cài hook/installer/plugin ECC |
| C — Thiết kế | UI UX Pro Max (skill, CLI phạm vi dự án) | Đề xuất design system, style, màu, font, layout, hướng dẫn UX/accessibility | Chứng minh UI đạt chuẩn; dùng cho dự án không có UI |
| D — Điều phối | Claude Code + workspace | Tổ chức dự án, chỉ dẫn chung, template, chọn công cụ, quy trình, bằng chứng, kiểm chứng, vòng đời | Phụ thuộc chi tiết nội bộ của một công cụ |

Các công cụ không tự tích hợp; lớp D nối chúng qua file trong dự án — xem
[combined-workflows.md](combined-workflows.md).

## Ranh giới cấu hình

| Vị trí | Nội dung | Phạm vi | Trong repo workspace? |
| --- | --- | --- | --- |
| `CLAUDE.md`, `.claude/rules/` | Chỉ dẫn chung | Workspace | có |
| `.claude/settings.json` | Quyền, hook guard | Workspace (không kế thừa vào thư mục con khởi động riêng) | có |
| `.claude/skills/`, `.claude/agents/` | Skill/agent riêng + ECC + UI UX Pro Max | Workspace | có |
| `.claude/settings.local.json`, `.claude/active-project` | Cá nhân, trạng thái | Máy cục bộ | không |
| `~/.claude.json` → `projects[<workspace>].mcpServers.rea` | Đăng ký REA | Local scope, chỉ thư mục workspace | không |
| `~/.claude/settings.json`, `~/.claude/skills` | Cấu hình toàn cục của bạn | Mọi dự án | **không bị workspace sửa** |

## Phân chia trách nhiệm thư mục

| Đường dẫn | Phụ trách | Quản lý phiên bản |
| --- | --- | --- |
| `CLAUDE.md`, `.claude/` | Cách Claude Code hoạt động trong workspace (xem [claude-code-guide.md](claude-code-guide.md)) | Repo workspace |
| `docs/`, `docs/playbooks/` | Quy trình; bài học theo loại target | Repo workspace |
| `templates/` | Bộ khung dự án và template tài liệu | Repo workspace |
| `scripts/` | Tạo dự án, kiểm tra chỉ đọc, test hook | Repo workspace |
| `rea-core/` | Mã nguồn, tài liệu, skill chính thức của REA | Clone riêng `morluto/rea` |
| `ecc-reference/` | Nguồn ECC để đối chiếu/cập nhật thành phần đã copy | Clone riêng `affaan-m/ECC` |
| `ui-ux-pro-max-reference/` | Nguồn UI UX Pro Max để đọc/đối chiếu | Clone riêng |
| `projects/<id>/` | Dữ liệu một dự án | Repo riêng của dự án (tùy chọn) |
| `archive/<id>/` | Dự án đã đóng | Giống dự án |

Repo tham chiếu **không phải bản cài đặt**: những gì Claude Code dùng nằm
trong `.claude/` (hoặc đăng ký MCP), không phải trong các clone.

## Tổ chức dự án

Loại dự án (`--type`) quyết định thư mục được tạo — không tạo thư mục thừa:

| Module | Có trong loại | Thư mục / file |
| --- | --- | --- |
| chung | mọi loại | `README.md`, `CLAUDE.md`, `project.yaml`, `plans/decisions.md`, `notes/`, `artifacts/`, `.gitignore` |
| investigation | investigation, combined | `scope/`, `plans/investigation-plan.md`, `evidence/`, `findings/` |
| design | ui-design, combined | `design/design-brief.md`, `design/design-system.md` (+ `design/design-system/` sinh ra) |
| engineering | engineering, combined | `plans/implementation-plan.md`, `tests/test-plan.md` |

`reports/` được tạo khi đóng dự án. Code nằm trong repo của bạn
(`implementation.repository`), không trong thư mục dự án — trừ khi bạn chọn vậy.

## Mô hình Git

- **Repo workspace** (gốc, remote `github.com/tamtd91ht/rea-workspaces`): chỉ
  file workspace. Ignore `rea-core/`, `ecc-reference/`, `ui-ux-pro-max-reference/`,
  `projects/*`, `archive/*`, secret, capture. Không commit tên hay dữ liệu dự án.
- **Repo upstream**: clone độc lập, không submodule, không sửa.
- **Repo dự án**: tùy chọn (`--git`), không thêm remote khi chưa quyết định nơi
  lưu dữ liệu ([security-and-privacy.md](security-and-privacy.md)).

## Mô hình phiên làm việc

Khởi động Claude Code từ thư mục gốc workspace. Đã kiểm chứng (2026-10-16,
`claude mcp list`): `rea` kết nối được từ gốc và thư mục con thường (`docs/`),
**không** có khi đứng trong dự án có repo Git riêng. Claude Code không kế thừa
`.claude/settings.json` từ thư mục cha, và skill chỉ được tìm tới Git root gần
nhất — phiên khởi động trong dự án như vậy thiếu MCP, settings, skill và hook.
