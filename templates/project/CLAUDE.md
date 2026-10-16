# Dự án {{PROJECT_ID}}

Ngữ cảnh cho Claude Code khi làm việc trong dự án này. Quy tắc chung của
workspace trong `CLAUDE.md` gốc và `.claude/rules/` vẫn áp dụng. Khởi động
Claude Code từ thư mục gốc workspace, không phải từ thư mục này: MCP server
REA, settings và skill của workspace không có trong phiên khởi động tại đây.

- Loại: {{PROJECT_TYPE}} — quy trình: {{WORKFLOWS}}
- Mục tiêu: {{OBJECTIVE}}
- Metadata và trạng thái: `project.yaml` (cập nhật `status`/`updated` khi đổi giai đoạn).
- Quyết định: `plans/decisions.md`. Nhật ký: `notes/log.md`.
- Mọi output của dự án ghi trong thư mục này, trừ code thuộc repository ghi ở
  `project.yaml` `implementation.repository`. Output lớn hoặc tái tạo được
  để trong `artifacts/`.
- Giai đoạn điều tra: đọc `scope/` trước; tương tác runtime cần
  `authorization.confirmed: true`.
- Giai đoạn thiết kế: quyết định đã chấp nhận nằm trong `design/design-system.md`;
  output sinh từ UI UX Pro Max chỉ là đề xuất cho tới khi được chấp nhận.

## Ghi chú riêng của dự án

<!-- Thêm quy ước ở đây (ví dụ định danh build, cách đặt tên module, phiên bản stack). -->
