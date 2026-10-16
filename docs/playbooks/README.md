# Playbook theo loại target

Bài học dùng lại được, rút ra khi đóng dự án (`/rea-project-closeout`, bước
"Lessons learned"). Mỗi loại target một file, tên trùng `target.type` trong
`project.yaml`: `javascript-electron.md`, `native-binary.md`, `dotnet.md`,
`android-apk.md`, `website.md`, `network-capture.md`, `firmware.md`, `other.md`.
`/rea-investigation` đọc file tương ứng trước khi lập kế hoạch.

**Repo workspace được push lên GitHub:** không ghi tên target bí mật, secret,
giá trị bằng chứng hay dữ liệu cá nhân. Chỉ ghi kiến thức chuyển giao được.

## Định dạng mỗi mục

```markdown
## YYYY-MM-DD — <chủ đề ngắn> (từ dự án <project-id>)

- **Tình huống:** loại target, câu hỏi điều tra (khái quát)
- **Cách hiệu quả:** route/tool REA, tham số, view, truy vấn
- **Ngõ cụt:** cách đã thử và vì sao không được (mã lỗi, giới hạn)
- **Giới hạn REA/provider gặp phải:** phiên bản liên quan
- **Lần sau:** làm gì đầu tiên
```
