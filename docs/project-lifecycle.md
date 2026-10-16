# Vòng đời dự án

```
proposed → initialized → investigating → design → implementation → review → completed → archived
```

Bỏ qua giai đoạn không áp dụng (dự án `ui-design` không có `investigating`;
dự án `investigation` thường đi thẳng từ `investigating` sang `review`). Quay
lại giai đoạn trước khi có bằng chứng hoặc câu hỏi mới là bình thường. Không
thêm thủ tục không mang lại giá trị.

## Loại dự án

| Loại | Module | Giai đoạn thường gặp | Skill chính |
| --- | --- | --- | --- |
| `investigation` | investigation | investigating → review | `/rea-investigation` |
| `ui-design` | design | design → review | `/rea-ui-design` |
| `engineering` | engineering | implementation → review | `/rea-engineering` |
| `combined` | cả ba | investigating → design → implementation → review | cả ba, theo [combined-workflows.md](combined-workflows.md) |

## Giai đoạn

| Giai đoạn | Điều kiện vào | Công việc | Điều kiện ra / sản phẩm |
| --- | --- | --- | --- |
| proposed | Mới là ý tưởng; chưa có thư mục | Làm rõ mục tiêu, loại dự án | Đã biết tên, mục tiêu, loại |
| initialized | `new-project.mjs` đã tạo thư mục | README: câu hỏi/yêu cầu, tiêu chí thành công; `scope/` nếu có điều tra | Có câu hỏi/yêu cầu; cơ sở được phép (nếu điều tra) |
| investigating | Có câu hỏi và cơ sở được phép | REA, sổ bằng chứng, phát hiện | Mọi câu hỏi: trả lời / một phần / chưa giải quyết |
| design | Có design brief | UI UX Pro Max đề xuất, người dùng duyệt | `design/design-system.md` đã chấp nhận |
| implementation | Kế hoạch có R-### đã duyệt | TDD, code trong repo của bạn, sửa build | Yêu cầu đã triển khai; test-plan có kết quả |
| review | Có phát hiện / thiết kế / code | `/rea-evidence-review`, reviewer agent, người dùng đọc | Nhãn có căn cứ; không secret; lỗ hổng nêu rõ |
| completed | Đã qua review | `/rea-project-closeout` | `reports/final-report.md`; README "Current state" |
| archived | Người dùng yêu cầu | Chuyển sang `archive/<id>/` | `status: archived` |

Cập nhật `status` và `updated` trong `project.yaml` ở mỗi lần chuyển giai đoạn
và thêm một dòng vào `notes/log.md`. Xem trạng thái mọi dự án:
`node scripts/check.mjs projects`.

## Đặt tên

`YYYYMMDD-ten-mo-ta-ngan`, ví dụ `20261016-auth-flow-study`,
`20261016-electron-app-analysis`, `20261016-ops-dashboard-redesign`.
Không đưa tên tài khoản, tên khách hàng, hostname hay secret vào tên.

## Schema metadata (`project.yaml`, schema_version 2)

| Khóa | Kiểu | Ghi chú |
| --- | --- | --- |
| `schema_version` | int | `2` (dự án cũ có `1`, không có `type` = investigation) |
| `id` | string | Trùng tên thư mục |
| `title`, `objective` | string | Một dòng, không secret |
| `type` | enum | `investigation`, `ui-design`, `engineering`, `combined` |
| `modules` | list | Module đã tạo |
| `status` | enum | Giai đoạn ở trên |
| `created`, `updated` | date | `YYYY-MM-DD` |
| `owner` | string | Vai trò/nhóm, không phải tên đăng nhập |
| `target.type` | enum | `javascript-electron`, `native-binary`, `dotnet`, `android-apk`, `website`, `network-capture`, `firmware`, `other`, `none` |
| `target.location` | string | Đường dẫn/URL không chứa thông tin đăng nhập |
| `authorization.basis` | enum | `owned`, `employer-owned`, `written-permission`, `open-source-license`, `ctf`, `other` |
| `authorization.confirmed` | bool | `true` chỉ sau khi người dùng xác nhận; bắt buộc cho tương tác runtime |
| `design.ui` | bool | Dự án có giao diện |
| `design.existing_system` | string | Design system hiện có phải tôn trọng |
| `implementation.repository`, `.stack` | string | Repo nơi viết code; stack |
| `tools.rea`, `.ui_ux_pro_max`, `.ecc_commit` | string | Phiên bản công cụ lúc tạo |
| `git`, `tags` | bool, list | Repo riêng; nhãn tự do |

`scripts/check.mjs` chỉ đọc khóa scalar cấp cao nhất (`id`, `title`, `type`,
`status`, `updated`); giữ chúng trên một dòng.

## Nội dung dự án

| Đường dẫn | Module | Mục đích |
| --- | --- | --- |
| `README.md` | chung | Mục tiêu, câu hỏi/yêu cầu, tiêu chí thành công, trạng thái |
| `CLAUDE.md` | chung | Ngữ cảnh dự án cho Claude Code |
| `project.yaml` | chung | Metadata |
| `plans/decisions.md` | chung | Sổ quyết định `D-###` |
| `notes/log.md`, `notes/sessions/` | chung | Nhật ký; phiên đã lưu |
| `artifacts/` | chung | Output lớn/nhạy cảm (Git ignore) |
| `reports/` | chung | Tạo khi đóng dự án |
| `scope/target.md`, `scope/authorization.md` | investigation | Target, cơ sở được phép, loại trừ |
| `plans/investigation-plan.md` | investigation | Câu hỏi → bằng chứng, định tuyến |
| `evidence/`, `findings/` | investigation | Sổ bằng chứng `E-###`, sổ phát hiện `F-###` |
| `design/design-brief.md` | design | Người dùng, tác vụ, ràng buộc |
| `design/design-system.md`, `design/design-system/` | design | Quyết định đã chấp nhận; output UI UX Pro Max |
| `plans/implementation-plan.md` | engineering | Yêu cầu `R-###`, bước, rủi ro, vị trí code |
| `tests/test-plan.md` | engineering | Kiểm tra và kết quả thực tế |
