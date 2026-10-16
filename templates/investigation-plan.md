# Kế hoạch điều tra — {{PROJECT_ID}}

## Câu hỏi → bằng chứng cần có

| ID | Câu hỏi | Bằng chứng sẽ trả lời câu hỏi | Trạng thái |
| --- | --- | --- | --- |
| Q1 | | | open |

Giá trị trạng thái: `open` (đang mở), `answered` (đã trả lời), `partial` (một
phần), `unresolved` (chưa giải quyết).

## Định tuyến target

| Mục | Giá trị |
| --- | --- |
| Loại target | {{TARGET_TYPE}} |
| Tool REA / lệnh CLI đầu tiên | <!-- ví dụ analyze_javascript_application / inspect_managed_artifact / open_binary --> |
| Hướng dẫn đã tham khảo | <!-- ví dụ rea-core/docs/javascript-application-workflows.md --> |
| Provider / công cụ cần | <!-- ví dụ không cần, Ghidra 12.1.x, JADX, Chrome --> |
| Đã kiểm tra sẵn sàng | <!-- lệnh + kết quả, hoặc "chưa" --> |
| Giới hạn đã biết | |

## Các bước

Làm bước nhỏ nhất mà hữu ích trước; chỉ mở rộng khi còn lỗ hổng cụ thể.

1. **Kiểm kê / tổng quan** — 
2. **Truy vết tập trung** — 
3. **Đối chứng** (chỉ dùng runtime khi bằng chứng tĩnh không trả lời được và phạm vi cho phép) — 
4. **Báo cáo** — 

## Tương tác runtime (chỉ khi cần)

- Đã được phép trong `scope/authorization.md`: có / không
- Hành động dự kiến (không phá hoại): 
- Tài khoản / môi trường test: 
- Dữ liệu cần che: 

## Nhật ký

| Ngày | Bước | Hành động | Kết quả / bằng chứng |
| --- | --- | --- | --- |
| {{CREATED}} | setup | Tạo dự án | — |
