# Hướng dẫn ECC (Lớp B — quy trình kỹ thuật)

ECC — Everything Claude Code (https://github.com/affaan-m/ECC) là bộ skill,
agent, command, rule và hook cho agent lập trình. Workspace này chỉ dùng một
phần nhỏ, được chọn lọc.

## Chiến lược cài đặt: copy chọn lọc, ghim commit

| Phương án | Đánh giá | Quyết định |
| --- | --- | --- |
| Plugin Claude Code | Mặc định phạm vi user, kéo toàn bộ bộ ECC | Không dùng |
| Installer đầy đủ (`install.sh --profile ...`) | Hàng trăm skill, 28 hook ở mọi sự kiện | Không dùng |
| Installer chọn lọc (`npx ecc-universal@2.2.3 install --target claude-project --skills ...`) | Dry-run: xin 2 skill → 114 thao tác file, ~40 skill, có script hook | Không dùng |
| **Copy từng thành phần** (README ECC: "Each component is fully independent") | Đúng thứ cần, xem lại được từng file | **Chọn** |

Nguồn: `ecc-reference/` @ `76aaa77` (v2.2.3). Danh sách đầy đủ, giấy phép MIT
và quy trình cập nhật: [`.claude/THIRD_PARTY_NOTICES.md`](../.claude/THIRD_PARTY_NOTICES.md).
**Không cài:** hook, command, rule, installer, plugin của ECC — workspace có hook
guard riêng ([claude-code-guide.md](claude-code-guide.md#guard-hook)).

## Thành phần đang có

| Nhóm | Thành phần | Dùng khi |
| --- | --- | --- |
| Lập kế hoạch / kiến trúc | agent `planner`, `architect`, `code-explorer`; skill `codebase-onboarding` | Lập kế hoạch tính năng, chọn cấu trúc, hiểu code có sẵn |
| TDD | skill `tdd-workflow`, agent `tdd-guide`; `springboot-tdd`, `golang-testing` | Viết test trước khi code |
| Sửa lỗi build | agent `java-build-resolver`, `go-build-resolver` | Build/biên dịch lỗi |
| Review | agent `code-reviewer`, `java-reviewer`, `go-reviewer`, `security-reviewer` | Sau khi viết hoặc sửa code |
| Kiểm chứng | skill `verification-loop`, `springboot-verification` | Trước khi bàn giao |
| UI test | skill `browser-qa`, `e2e-testing` (Playwright) | Kiểm tra UI đã triển khai |
| Tham khảo stack | `api-design`, `springboot-patterns`, `springboot-security`, `jpa-patterns`, `java-coding-standards`, `golang-patterns` | Java/Spring Boot, Go |

Agent gọi bằng cách yêu cầu Claude dùng tên agent (ví dụ "use the planner
agent for …"); skill được tự kích hoạt theo mô tả hoặc gọi `/tên-skill`.
Skill điều phối `/rea-engineering` nối các thành phần này với dự án.

Không copy command `/plan`, `/code-review`, `/build-fix`: chúng ghi vào
`.claude/plans` / `.claude/reviews` ở gốc workspace (trộn dữ liệu dự án vào
cấu hình), trỏ tới command không có ở đây (`/plan-prd`, `/prp-plan`), và
`/code-review` đăng review lên GitHub qua `gh`.

## Lưu ý

- Agent copy giữ nguyên `model:` gốc (`planner`/`architect`: `opus`; còn lại `sonnet`).
- Agent có `Bash` chạy build/test — chỉ trên code của bạn, không trên artifact của target.
- `tdd-workflow` nhắc tới `node scripts/setup-package-manager.js` (script của ECC, không có ở đây) — bỏ qua bước đó.

## Cập nhật / thêm / gỡ

- Cập nhật: xem [maintenance.md](maintenance.md#ecc).
- Thêm thành phần: tìm trong `ecc-reference/skills|agents`, rà nội dung (lệnh
  mạng, kết nối dịch vụ ngoài, tham chiếu script ECC), xin duyệt, copy, ghi vào
  `THIRD_PARTY_NOTICES.md`, chạy `node scripts/check.mjs sensitive`.
- Gỡ: xóa file/thư mục tương ứng trong `.claude/` và dòng trong `THIRD_PARTY_NOTICES.md`.
