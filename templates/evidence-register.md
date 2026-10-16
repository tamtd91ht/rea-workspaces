# Sổ đăng ký bằng chứng — {{PROJECT_ID}}

Mỗi bằng chứng một dòng. File lớn hơn vài trăm KB, capture gốc và output tool
có thể tái tạo nằm trong `artifacts/` hoặc `evidence/raw/` (đều bị Git ignore);
tham chiếu chúng bằng đường dẫn và SHA-256.

Tính SHA-256: `node scripts/check.mjs hash <file>` (từ thư mục gốc workspace),
`certutil -hashfile <file> SHA256` (Windows) hoặc `shasum -a 256 <file>`.

| ID | Ngày | Mô tả | Nguồn (tool, lệnh / MCP tool, đầu vào) | Vị trí | SHA-256 | REA Evidence ID | Đã che? |
| --- | --- | --- | --- | --- | --- | --- | --- |

## Ghi chú nguồn gốc

- Định danh target (đường dẫn, phiên bản, SHA-256): 
- Phiên bản REA: rea-agents@{{REA_VERSION}}
- Provider đã dùng và phiên bản: 
