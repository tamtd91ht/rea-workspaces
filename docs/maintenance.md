# Bảo trì

Mỗi công cụ được cập nhật **độc lập**, theo cơ chế sở hữu nó. Kiểm tra tổng
thể sau mọi thay đổi: `node scripts/check.mjs all` và `node scripts/test-guard.mjs`.

| Thành phần | Phạm vi cài đặt | Cập nhật bằng |
| --- | --- | --- |
| REA (package, MCP, `rea-core`) | npx ghim phiên bản; MCP local scope; clone | [rea-guide.md](rea-guide.md) |
| ECC (thành phần đã copy) | `.claude/skills|agents` của workspace | [mục ECC](#ecc) |
| UI UX Pro Max | `.claude/skills` của workspace (CLI) | [mục UI UX Pro Max](#ui-ux-pro-max) |
| Thành phần riêng của workspace | `.claude/`, `scripts/`, `templates/`, `docs/` | Sửa + `CHANGELOG.md` |
| Repo tham chiếu | `ecc-reference/`, `ui-ux-pro-max-reference/` | `git pull --ff-only` |

## Sao lưu trước khi thay đổi

- Workspace: `git status` phải sạch hoặc đã hiểu rõ; mọi thay đổi xem lại bằng `git diff`.
- Cấu hình Claude Code cá nhân (khi đụng tới MCP): sao chép `~/.claude.json`
  như trong [rea-guide.md](rea-guide.md#new-package-version).
- Không bao giờ sửa file trong repo tham chiếu hoặc `rea-core`.

<a id="ecc"></a>

## ECC

1. `git -C ecc-reference status --short` (phải rỗng), `git -C ecc-reference pull --ff-only`.
2. So sánh từng file đã copy (danh sách trong `.claude/THIRD_PARTY_NOTICES.md`):
   ```bash
   git diff --no-index ecc-reference/agents/planner.md .claude/agents/planner.md
   git diff --no-index ecc-reference/skills/tdd-workflow .claude/skills/tdd-workflow
   ```
3. Rà thay đổi (lệnh mạng mới, dịch vụ ngoài, tham chiếu script ECC). Copy đè
   các file đã duyệt.
4. Cập nhật commit trong `THIRD_PARTY_NOTICES.md`, `scripts/lib.mjs`
   (`ECC_COMMIT`), `templates/project/project.yaml` (`ecc_commit`), `CHANGELOG.md`.
5. `node scripts/check.mjs sensitive` (ví dụ minh họa mới có thể cần allowlist).

Quay lui: `git checkout -- .claude/` cho các file chưa commit, hoặc `git revert`.

<a id="ui-ux-pro-max"></a>

## UI UX Pro Max

1. Xem phiên bản mới: `npm view ui-ux-pro-max-cli version`; đọc release notes
   (`git -C ui-ux-pro-max-reference pull --ff-only`, `git log`).
2. Chạy thử trong một thư mục trống ngoài workspace:
   `npx -y ui-ux-pro-max-cli@<new> init --ai claude`, xem các file sinh ra.
3. Tại gốc workspace: `npx -y ui-ux-pro-max-cli@<new> init --ai claude --force`
   (ghi đè skill đã cài), rồi `git diff --stat .claude/skills` và rà thay đổi.
4. Cập nhật phiên bản trong `scripts/lib.mjs` (`UIUX_VERSION`), `CLAUDE.md`,
   tài liệu, `THIRD_PARTY_NOTICES.md`, `CHANGELOG.md`.
5. `node scripts/check.mjs` (chạy thử `search.py`), `node scripts/check.mjs sensitive`.

Quay lui: `git checkout -- .claude/skills` (hoặc `git revert` commit cập nhật).
Không cài thêm bản global hay marketplace — `check.mjs` cảnh báo nếu có bản trùng
trong `~/.claude/skills`.

## Thành phần riêng của workspace

- Hook guard: sau khi sửa, `node scripts/test-guard.mjs`.
- Template: tạo thử mỗi loại dự án với `--date 19990101`, kiểm tra không còn
  `{{...}}`, rồi xóa đúng thư mục thử.
- Tài liệu: giữ một tài liệu chuẩn cho mỗi quy trình; lệnh trong tài liệu phải
  được kiểm chứng (`--help` hoặc chạy thử).

## Phụ thuộc

| Phụ thuộc | Dùng cho | Ghi chú |
| --- | --- | --- |
| Node.js 22.19+/24.11+/26+ | REA, script workspace, các CLI npx | REA không tự nâng cấp Node |
| Python 3 | UI UX Pro Max `search.py` | Thư viện chuẩn |
| Git | Mọi repo | — |
| Chrome / Playwright | Quan sát website, browser-qa, e2e | Tùy dự án |
| Ghidra / IDA / JADX + JDK | Phân tích native / Android | Tự cung cấp |
