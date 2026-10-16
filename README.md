# REA Workspace

Workspace cục bộ, dùng lâu dài cho các dự án độc lập kết hợp ba công cụ mã
nguồn mở, do Claude Code điều phối:

| Lớp | Công cụ | Vai trò |
| --- | --- | --- |
| A — Điều tra | [REA](https://github.com/morluto/rea) | Dịch ngược có cho phép, thu thập bằng chứng (MCP + CLI) |
| B — Kỹ thuật | [ECC](https://github.com/affaan-m/ECC) (thành phần chọn lọc) | Lập kế hoạch, TDD, sửa lỗi build, review code/bảo mật, kiểm chứng |
| C — Thiết kế | [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | Design system, style, bảng màu, font, hướng dẫn UX |
| D — Điều phối | Claude Code + workspace này | Dự án, template, chọn công cụ, bằng chứng, kiểm chứng |

Các công cụ không tự tích hợp với nhau; workspace này định nghĩa cách chúng
phối hợp. Tài liệu chi tiết nằm trong [docs/](docs/).

## Kiến trúc

```
rea-workspaces/
├── CLAUDE.md                  Chỉ dẫn Claude Code nạp ở mỗi phiên
├── .claude/                   settings, rules, skills (workspace + ECC + UI UX Pro Max), agents, hook guard
├── rea-core/                  Bản clone morluto/rea (tham chiếu, không track)
├── ecc-reference/             Bản clone affaan-m/ECC (tham chiếu, không track)
├── ui-ux-pro-max-reference/   Bản clone ui-ux-pro-max-skill (tham chiếu, không track)
├── projects/                  Mỗi dự án một thư mục (không track)
├── templates/                 Bộ khung dự án + template tài liệu
├── docs/                      Hướng dẫn
├── scripts/                   new-project, check, active-project, test-guard
└── archive/                   Dự án đã đóng
```

Chi tiết: [docs/architecture.md](docs/architecture.md).

## Bắt đầu nhanh

Yêu cầu: Node.js 22.19+/24.11+/26+, npm, Git, Python 3, Claude Code.
Thiết lập lần đầu (đăng ký REA, clone repo tham chiếu): [docs/getting-started.md](docs/getting-started.md).

```bash
node scripts/check.mjs                      # môi trường, repo, MCP, UI UX Pro Max
node scripts/new-project.mjs --help         # tạo dự án
node scripts/check.mjs projects             # liệt kê dự án
```

## Dự án đầu tiên

Khởi động Claude Code **từ thư mục này**, rồi:

```text
/rea-project-init notes-sync-feature Rebuild a notes-sync feature for our app
/rea-investigation <id>      # REA: app tham chiếu làm thế nào? (target được phép)
/rea-ui-design <id>          # UI UX Pro Max: design system, được duyệt và chấp nhận
/rea-engineering <id>        # ECC: lập kế hoạch, TDD, review, kiểm chứng
/rea-project-closeout <id>
```

Chỉ dùng các giai đoạn dự án cần (`--type investigation | ui-design | engineering | combined`).
Quy trình: [docs/combined-workflows.md](docs/combined-workflows.md).

## Tài liệu

| Hướng dẫn | Dùng cho |
| --- | --- |
| [getting-started](docs/getting-started.md) | Yêu cầu, thiết lập, kiểm chứng, quy trình thử đầu tiên |
| [operating-guide](docs/operating-guide.md) | Làm việc hằng ngày, dự án, bằng chứng, CLI |
| [combined-workflows](docs/combined-workflows.md) | Điều tra → thiết kế → triển khai; chọn công cụ |
| [rea-guide](docs/rea-guide.md) | Khả năng của REA, kiểm tra sẵn sàng, cập nhật |
| [ecc-guide](docs/ecc-guide.md) | Thành phần ECC và chiến lược cài đặt |
| [ui-ux-pro-max-guide](docs/ui-ux-pro-max-guide.md) | Quy trình và lệnh thiết kế |
| [project-lifecycle](docs/project-lifecycle.md) | Loại dự án, giai đoạn, schema metadata |
| [security-and-privacy](docs/security-and-privacy.md) | Quyền được phép, thông tin đăng nhập, hook, luồng dữ liệu |
| [maintenance](docs/maintenance.md) | Cập nhật độc lập, sao lưu, quay lui |
| [claude-code-guide](docs/claude-code-guide.md) | Cấu hình `.claude/` và hook guard |
| [troubleshooting](docs/troubleshooting.md) | Sự cố thường gặp |

## Sử dụng có trách nhiệm

Chỉ phân tích phần mềm và hệ thống bạn sở hữu hoặc được phép kiểm tra. Xem
[docs/security-and-privacy.md](docs/security-and-privacy.md) và
[DISCLAIMER](https://github.com/morluto/rea/blob/main/DISCLAIMER.md) của REA.
Thành phần bên thứ ba: [.claude/THIRD_PARTY_NOTICES.md](.claude/THIRD_PARTY_NOTICES.md).
