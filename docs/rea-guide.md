# Hướng dẫn REA (Lớp A — điều tra và dịch ngược)

REA (https://github.com/morluto/rea) cung cấp công cụ phân tích cục bộ cho
binary native, app JavaScript/Electron, assembly .NET, APK, website và file
capture, qua MCP và CLI. Chỉ dùng cho target bạn sở hữu hoặc được phép kiểm tra.

## Trạng thái trong workspace này

| Thành phần | Vị trí | Cập nhật bằng | Ảnh hưởng |
| --- | --- | --- | --- |
| Bản clone mã nguồn | `rea-core/` (`main`) | `git pull --ff-only` | Tài liệu và hướng dẫn điều tra Claude đọc |
| Package | npm `rea-agents@6.5.0` qua `npx` | Đổi phiên bản ghim | Lệnh CLI và MCP server |
| Đăng ký MCP | `~/.claude.json`, local scope cho thư mục workspace | `claude mcp remove` + `add` | Phiên bản Claude Code khởi chạy |
| Skill hướng dẫn | Đọc từ `rea-core/.agents/skills/reverse-engineer-anything/` | Theo `rea-core` | Phương pháp `/rea-investigation` dùng |
| Engine phân tích | Chưa cài (Ghidra / IDA / JADX tự cung cấp) | Bộ cài riêng | Phân tích native / Android |

Clone ≠ cài đặt ≠ đăng ký ≠ đã chạy được: mỗi thứ được kiểm chứng riêng
(xem [WORKSPACE_STATUS.md](../WORKSPACE_STATUS.md)).

## Khả năng đã kiểm chứng (2026-10-16)

| Khả năng | Cách kiểm chứng | Kết quả |
| --- | --- | --- |
| MCP server khởi động, 207 tool, 6 prompt | `npx -y rea-agents@6.5.0 mcp doctor --json` | healthy |
| Kết nối với Claude Code từ thư mục gốc | `claude mcp list` | Connected |
| Phân tích tĩnh JS/Electron | `analyze-javascript-application` trên app mẫu tự tạo | exit 0, có Evidence, thấy kênh IPC |
| View tóm tắt Evidence | `inspect-analysis-view` | 272 KB → 11.7 KB |

Chưa kiểm chứng: gọi tool từ trong phiên Claude Code mới; phân tích native,
Android, browser/Electron runtime (thiếu engine hoặc target).

## Điều tra

Dùng `/rea-investigation <project-id>`; quy trình chi tiết ở
[operating-guide.md](operating-guide.md) và skill chính thức trong
`rea-core/.agents/skills/reverse-engineer-anything/SKILL.md` (mục "Route the
target first"). Danh sách tool thực tế của server luôn là nguồn chuẩn.

CLI:

```bash
npx -y rea-agents@6.5.0 --help
npx -y rea-agents@6.5.0 <command> --help
npx -y rea-agents@6.5.0 analyze-javascript-application "<đường dẫn tuyệt đối>" --json > projects/<id>/artifacts/app-evidence.json
```

Kiểm tra sẵn sàng (chỉ đọc): `npx -y rea-agents@6.5.0 doctor --provider ghidra --json`
(hoặc `hopper`, `ida`). Lưu ý `rea doctor` không thấy đăng ký local scope —
dùng `node scripts/check.mjs` và `claude mcp list`.

## Cập nhật bản clone mã nguồn

```bash
git -C rea-core status --short          # phải rỗng; không bao giờ xóa bỏ thay đổi để "sửa" điều này
git -C rea-core fetch origin
git -C rea-core log --oneline HEAD..origin/main | head -20
git -C rea-core pull --ff-only
```

`rea-core` theo `main`, có thể mô tả tính năng mới hơn package đã ghim. Đọc
tài liệu khớp bản đã ghim: `git -C rea-core show rea-agents-6.5.0:docs/cli.md`.

<a id="new-package-version"></a>

## Chuyển sang phiên bản package mới

1. Đọc ghi chú phát hành (`rea-core/CHANGELOG.md` hoặc GitHub releases).
   Bản mới nhất: `npm view rea-agents dist-tags.latest`.
2. Chạy thử mà không đụng đăng ký:
   ```bash
   npx -y rea-agents@<new> mcp doctor --json     # healthy: true
   ```
3. Sao lưu cấu hình và ghi lại các giá trị `env` của entry `rea`:
   ```powershell
   Copy-Item $HOME\.claude.json "$HOME\.claude.json.bak-rea-$(Get-Date -Format yyyyMMdd)"
   ```
4. Đăng ký lại từ thư mục gốc workspace (PowerShell; `CLAUDE_CONFIG_DIR` chưa đặt):
   ```powershell
   claude mcp remove --scope local rea
   claude mcp add --scope local rea -- cmd.exe /d /c npx -y rea-agents@<new> mcp
   ```
   Áp lại biến môi trường bằng `-e NAME=value` (xem mục engine bên dưới).
   `rea update`/`doctor`/`uninstall` **không** thấy đăng ký local scope.
5. Cập nhật phiên bản ghim trong workspace (`git grep -n "6\.5\.0"`: `scripts/lib.mjs`
   `REA_VERSION`, `CLAUDE.md`, skill, tài liệu, `.claude/settings.json`), ghi
   `CHANGELOG.md` và `WORKSPACE_STATUS.md`.
6. Khởi động lại Claude Code; chạy `node scripts/check.mjs`, `claude mcp list`.

Quay lui: chạy lại bước 4 với phiên bản cũ, hoặc khôi phục bản sao lưu
`~/.claude.json` (chỉ khi file không có thay đổi nào khác — so sánh trước).
Dự án cũ giữ `tools.rea` trong `project.yaml` làm bản ghi, không viết lại.

<a id="analysis-engines"></a>

## Engine phân tích (tùy chọn)

REA không tự cài engine.

| Engine | Cấu hình | Kiểm tra |
| --- | --- | --- |
| Ghidra 12.1.x (thử nghiệm trên Windows) | `GHIDRA_INSTALL_DIR` | `npx -y rea-agents@6.5.0 doctor --provider ghidra --json` |
| IDA (có license) | `REA_IDA_MCP_CONFIG` | `... doctor --provider ida --json` |
| JADX headless MCP 0.7.1 + JDK | `REA_JADX_MCP_JAR` | `... doctor --json` (providerInspections) |
| Hopper | chỉ macOS/Linux | `... doctor --provider hopper --json` |

Biến môi trường đặt trên đăng ký (PowerShell, thư mục gốc; đường dẫn ví dụ):

```powershell
claude mcp remove --scope local rea
claude mcp add --scope local -e GHIDRA_INSTALL_DIR=D:/tools/ghidra_12.1 rea -- cmd.exe /d /c npx -y rea-agents@6.5.0 mcp
```

Hướng dẫn: `rea-core/docs/installation.md#ghidra`, `rea-core/docs/ida-provider.md`,
`rea-core/docs/android-analysis.md`, `rea-core/docs/windows-ghidra-p0.md`.

## Gỡ REA khỏi workspace

```powershell
claude mcp remove --scope local rea      # từ thư mục gốc workspace
```

Có thể để nguyên cache npx; `rea-core/` chỉ là một thư mục.
