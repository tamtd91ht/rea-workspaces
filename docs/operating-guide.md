# Hướng dẫn vận hành

## Quy trình hằng ngày

1. Mở terminal ở thư mục gốc workspace và chạy `claude` tại đó.
2. `node scripts/check.mjs projects` — xem các dự án đang thực hiện.
3. Tiếp tục một dự án: `/rea-investigation <project-id> <câu hỏi>`.
4. Cuối phiên: đảm bảo `notes/log.md`, `findings/findings.md` và
   `project.yaml` (`status`, `updated`) phản ánh đúng chỗ bạn dừng lại.

<a id="create-a-project"></a>

## Tạo dự án

Trong Claude Code: `/rea-project-init <tên-ngắn> <mục tiêu>` — skill sẽ hỏi loại
target, vị trí và cơ sở được phép, sau đó xem trước rồi tạo dự án.

Thủ công:

```bash
node scripts/new-project.mjs --name auth-flow-study \
  --objective "Explain how the desktop client refreshes sessions" \
  --target-type javascript-electron --dry-run
# xem lại bản xem trước, rồi chạy lại không có --dry-run (thêm --git nếu muốn repo riêng cho dự án)
```

| Tùy chọn | Ý nghĩa |
| --- | --- |
| `--name` | 3–48 ký tự gồm chữ thường/số/gạch nối; tiền tố ngày được thêm tự động (`20261016-auth-flow-study`) |
| `--objective` | Một dòng, không chứa secret |
| `--target-type` | `javascript-electron`, `native-binary`, `dotnet`, `android-apk`, `website`, `network-capture`, `firmware`, `other` |
| `--title`, `--date` | Ghi đè tùy chọn |
| `--git` | `git init` bên trong dự án (không remote, không commit) |
| `--dry-run` | Chỉ xem trước |

Script từ chối nếu thư mục đích đã tồn tại, dựng dự án trong một thư mục tạm
và chỉ chuyển vào vị trí khi đã hoàn chỉnh. Sau đó điền `scope/target.md` và
`scope/authorization.md` (xem [project-lifecycle.md](project-lifecycle.md)).

## Thực hiện điều tra

Dùng `/rea-investigation <project-id>`. Skill làm theo phương pháp trong
`rea-core/.agents/skills/reverse-engineer-anything/SKILL.md`:

1. Câu hỏi → bằng chứng cần có, ghi vào `plans/investigation-plan.md`.
2. Định tuyến target tới tool REA đầu tiên (tĩnh trước, runtime sau).
3. Phân tích nhỏ nhất mà hữu ích trước; chỉ làm tiếp khi còn lỗ hổng cụ thể.
4. Ghi bằng chứng (`E-###`) và phát hiện (`F-###`) ngay trong quá trình làm.
5. Trả lời từng câu hỏi với nhãn **Verified / Inferred / Unknown**.

<a id="cli-usage"></a>

### Dùng CLI

```bash
npx -y rea-agents@6.5.0 --help
npx -y rea-agents@6.5.0 <command> --help
npx -y rea-agents@6.5.0 analyze-javascript-application "<đường dẫn tuyệt đối>" --json > projects/<id>/artifacts/app-evidence.json
```

Evidence lớn: tạo view tóm tắt thay vì đọc cả file (không cần `jq`):

```bash
node -e "const fs=require('fs');fs.writeFileSync(process.argv[2],JSON.stringify({source:{kind:'inline',evidence:JSON.parse(fs.readFileSync(process.argv[1],'utf8'))},view:{kind:'summary'}}))" projects/<id>/artifacts/app-evidence.json projects/<id>/artifacts/app-view.json
npx -y rea-agents@6.5.0 inspect-analysis-view projects/<id>/artifacts/app-view.json --json
```

Để xem một trang module, dùng
`view: {kind: "page", collection: "modules", offset: 0, limit: 32}`
(xem `rea-core/docs/cli.md`). Mã thoát: `0` hoàn thành (có thể chỉ một phần),
`1` thất bại, `130`/`143` bị hủy.

<a id="evidence-management"></a>

## Quản lý bằng chứng

| Loại | Vị trí | Trong Git? |
| --- | --- | --- |
| Sổ đăng ký bằng chứng (ID, nguồn gốc, hash) | `evidence/register.md` | có |
| Trích đoạn nhỏ đã che dữ liệu nhạy cảm | `evidence/E-###-*.txt` | có |
| Output gốc chưa che, giữ lại để truy nguồn | `evidence/raw/` | không |
| Evidence JSON đầy đủ của REA, app đã giải nén, bundle, capture, ảnh chụp | `artifacts/` | không |

- Tính hash file: `node scripts/check.mjs hash <file>`.
- Ghi các giá trị `evidence_id` của REA vào sổ đăng ký để có thể truy vết kết quả.
- Trước khi ghi bất cứ thứ gì vào `evidence/`, `findings/` hoặc `reports/`, che
  thông tin đăng nhập và dữ liệu cá nhân không liên quan (`[REDACTED:<loại>]`).
- Rà soát bằng `/rea-evidence-review <project-id>`.

<a id="workspace-checks"></a>

## Kiểm tra workspace

```bash
node scripts/check.mjs            # health: Node, Git, rea-core, file, đăng ký MCP
node scripts/check.mjs projects   # danh sách: id, status, updated, git, title
node scripts/check.mjs sensitive  # tên file nhạy cảm, nội dung giống secret, secret đã bị track
node scripts/check.mjs all
```

Mọi kiểm tra đều chỉ đọc và che mọi thứ trông giống secret.
Exit 0 = sạch, 1 = có vấn đề, 2 = sai cú pháp. `sensitive` dựa trên mẫu —
kết quả sạch không phải là bảo đảm.

## Cập nhật REA

Xem [rea-maintenance.md](rea-maintenance.md). Tóm tắt: `git -C rea-core
pull --ff-only` cho mã nguồn; đăng ký lại MCP server với phiên bản ghim mới cho
phần tool.

## Đóng và lưu trữ dự án

`/rea-project-closeout <project-id>` tạo `reports/final-report.md` từ template,
kiểm tra các tham chiếu bằng chứng và đặt `status: completed`. Việc lưu trữ
(chuyển sang `archive/`) chỉ thực hiện khi có yêu cầu rõ ràng. Xem
[project-lifecycle.md](project-lifecycle.md).
