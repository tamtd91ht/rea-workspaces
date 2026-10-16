# Vòng đời dự án

```
proposed → initialized → investigating → review → completed → archived
                              ↑______________|
```

Quay lại từ `review → investigating` là bình thường khi phát sinh câu hỏi mới.
Dự án nhỏ có thể đi thẳng từ `investigating` sang `completed`; bỏ qua các thủ
tục không mang lại giá trị.

| Giai đoạn | Điều kiện vào | Công việc | Điều kiện ra / sản phẩm |
| --- | --- | --- | --- |
| proposed | Mới là ý tưởng; chưa có thư mục (theo dõi ở nơi bạn quản lý ý tưởng) | Làm rõ mục tiêu và target | Đã biết tên, mục tiêu, loại target |
| initialized | `new-project.mjs` đã tạo thư mục | Điền `scope/target.md`, `scope/authorization.md`, câu hỏi | Đã ghi cơ sở được phép; kế hoạch có câu hỏi |
| investigating | Kế hoạch có ít nhất một câu hỏi | Phân tích bằng REA, sổ bằng chứng, phát hiện | Mọi câu hỏi đã trả lời / một phần / chưa giải quyết |
| review | Đã có bản nháp phát hiện | `/rea-evidence-review`; người dùng đọc phát hiện | Nhãn có căn cứ; không có secret; lỗ hổng được nêu rõ |
| completed | Đã qua review | `/rea-project-closeout` | `reports/final-report.md`; mục "Current state" trong README được cập nhật |
| archived | Người dùng yêu cầu lưu trữ | Chuyển sang `archive/<id>/`; quyết định việc giữ artifact | `status: archived` |

Cập nhật `status` và `updated` trong `project.yaml` ở mỗi lần chuyển giai đoạn
và thêm một dòng vào `notes/log.md`.

## Đặt tên

`YYYYMMDD-ten-mo-ta-ngan`, ví dụ `20261016-auth-flow-study`,
`20261016-electron-app-analysis`, `20261016-legacy-binary-review`.
Không đưa tên tài khoản, tên khách hàng, hostname hay secret vào tên.

## Schema metadata (`project.yaml`, schema_version 1)

| Khóa | Kiểu | Ghi chú |
| --- | --- | --- |
| `schema_version` | int | `1` |
| `id` | string | Trùng với tên thư mục |
| `title`, `objective` | string | Một dòng, không chứa secret |
| `status` | enum | Giai đoạn vòng đời ở trên |
| `created`, `updated` | date | `YYYY-MM-DD` |
| `owner` | string | Vai trò hoặc nhóm, không phải tên đăng nhập |
| `target.type` | enum | `javascript-electron`, `native-binary`, `dotnet`, `android-apk`, `website`, `network-capture`, `firmware`, `other` |
| `target.location` | string | Đường dẫn hoặc URL không chứa thông tin đăng nhập/token |
| `authorization.basis` | enum | `owned`, `employer-owned`, `written-permission`, `open-source-license`, `ctf`, `other` |
| `authorization.confirmed` | bool | Chỉ `true` sau khi người dùng xác nhận; bắt buộc cho tương tác runtime |
| `authorization.record` | path | `scope/authorization.md` |
| `rea.version` | string | Phiên bản REA đã dùng |
| `rea.providers` | list | ví dụ `[ghidra-12.1.2]` |
| `git` | bool | Dự án có repo riêng |
| `tags` | list | Tự do |

`scripts/check.mjs` chỉ đọc các khóa scalar cấp cao nhất (`id`, `title`,
`status`, `updated`, …); hãy giữ chúng trên một dòng.

## Nội dung một dự án

| Đường dẫn | Mục đích |
| --- | --- |
| `README.md` | Tóm tắt: mục tiêu, câu hỏi, sản phẩm, trạng thái hiện tại |
| `CLAUDE.md` | Ngữ cảnh dự án cho Claude Code |
| `project.yaml` | Metadata (ở trên) |
| `scope/target.md`, `scope/authorization.md` | Cái gì, ở đâu, vì sao được phép, phần loại trừ |
| `plans/investigation-plan.md` | Câu hỏi → bằng chứng, định tuyến, các bước, nhật ký |
| `evidence/register.md`, `evidence/README.md` | Sổ đăng ký bằng chứng và quy tắc lưu trữ |
| `findings/findings.md` | Sổ phát hiện |
| `reports/` | Sản phẩm bàn giao (`final-report.md` khi đóng dự án) |
| `notes/log.md` | Nhật ký làm việc theo ngày |
| `artifacts/` | Output lớn/nhạy cảm (bị Git ignore) |
| `.gitignore` | Áp dụng nếu dự án có repo riêng |
