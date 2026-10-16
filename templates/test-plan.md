# Kế hoạch kiểm thử và kiểm chứng — {{PROJECT_ID}}

Chỉ ghi những gì **thực sự đã chạy**. Kiểm tra chưa chạy là "not run", không
bao giờ là "passed".

## Kiểm tra

| Hạng mục | Tool / lệnh | Bắt buộc? | Kết quả | Ngày | Bằng chứng |
| --- | --- | --- | --- | --- | --- |
| Unit test | | | not run | | |
| Integration test | | | not run | | |
| Build | | | not run | | |
| Lint / phân tích tĩnh | | | not run | | |
| Review bảo mật | agent `security-reviewer` / scanner | | not run | | |
| Tương tác UI | browser-qa / e2e (Playwright) | chỉ khi có UI | not run | | |
| Layout responsive | | chỉ khi có UI | not run | | |
| Accessibility | | chỉ khi có UI | not run | | |
| Trạng thái loading / empty / error / success | | chỉ khi có UI | not run | | |
| Nhất quán với thiết kế | so với `design/design-system.md` | chỉ khi có UI | not run | | |
| Hồi quy (regression) | | | not run | | |

Giá trị kết quả: `pass`, `fail`, `partial`, `not run`, `not applicable`.

## Độ phủ tiêu chí chấp nhận

| Yêu cầu | Test | Kết quả |
| --- | --- | --- |

## Vấn đề đã biết

- 
