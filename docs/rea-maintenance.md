# Bảo trì REA

Có bốn thứ được cập nhật độc lập với nhau. Đừng nhầm lẫn chúng.

| Thành phần | Vị trí | Cập nhật bằng | Ảnh hưởng |
| --- | --- | --- | --- |
| Bản clone mã nguồn | `rea-core/` | `git pull --ff-only` | Tài liệu và hướng dẫn điều tra mà Claude đọc |
| Package | npm `rea-agents@<version>` | Đổi phiên bản đã ghim | Lệnh CLI và MCP server |
| Đăng ký MCP | `~/.claude.json` (local scope, thư mục này) | `claude mcp remove` + `add` | Phiên bản mà Claude Code khởi chạy |
| Engine phân tích | Bản cài Ghidra / IDA / JADX / Hopper | Bộ cài riêng của từng engine | Phân tích native / Android |

Phiên bản đang ghim: **6.5.0** (2026-10-16). Kiểm tra bản phát hành mới nhất bằng
`npm view rea-agents dist-tags.latest`.

## 1. Cập nhật bản clone mã nguồn

```bash
git -C rea-core status --short          # phải rỗng; không bao giờ xóa bỏ thay đổi để "sửa" điều này
git -C rea-core fetch origin
git -C rea-core log --oneline HEAD..origin/main | head -20
git -C rea-core pull --ff-only
```

`rea-core` theo nhánh `main`, nơi có thể mô tả tính năng mới hơn package đã
ghim. Danh sách tool thực tế của MCP là nguồn chuẩn. Để đọc tài liệu khớp với
bản đã ghim mà không di chuyển checkout:
`git -C rea-core show rea-agents-6.5.0:docs/cli.md`.

## 2. Chuyển sang phiên bản package mới

1. Đọc ghi chú phát hành: `rea-core/CHANGELOG.md` (sau bước 1) hoặc GitHub releases.
2. Chạy thử phiên bản mới mà không đụng tới đăng ký:
   ```bash
   npx -y rea-agents@<new> mcp doctor --json     # healthy: true
   npx -y rea-agents@<new> --help
   ```
3. Sao lưu đăng ký và ghi lại các giá trị `env` trên entry `rea`
   (mặc định chúng không phải secret):
   ```powershell
   Copy-Item $HOME\.claude.json "$HOME\.claude.json.bak-rea-$(Get-Date -Format yyyyMMdd)"
   ```
4. Đăng ký lại từ thư mục gốc workspace (PowerShell; `CLAUDE_CONFIG_DIR` chưa đặt):
   ```powershell
   claude mcp remove --scope local rea
   claude mcp add --scope local rea -- cmd.exe /d /c npx -y rea-agents@<new> mcp
   ```
   Áp lại các giá trị môi trường đã ghi bằng tùy chọn `-e NAME=value` (xem mục 4
   để biết cú pháp). Việc xóa đăng ký không giữ lại chúng. `rea update`,
   `rea doctor` và `rea uninstall` **không** nhìn thấy đăng ký local scope
   (`rea-core/docs/installation.md`).
5. Cập nhật phiên bản ghim trong workspace, rồi ghi lại vào `CHANGELOG.md`
   và `WORKSPACE_STATUS.md`:
   ```bash
   git grep -n "6\.5\.0" -- . ':!CHANGELOG.md'
   ```
   (`scripts/lib.mjs` `REA_VERSION`, `CLAUDE.md`, skill, tài liệu, `.claude/settings.json`.)
6. Khởi động lại Claude Code, chạy `node scripts/check.mjs` và `claude mcp list`.

Các dự án hiện có giữ `rea.version` trong `project.yaml`; đó là bản ghi về công
cụ đã tạo ra bằng chứng của chúng, không phải thứ cần viết lại.

## 3. Quay lui

Chạy lại bước 4 với phiên bản cũ, hoặc khôi phục bản sao lưu `~/.claude.json`
(chỉ khi không có gì khác trong file thay đổi kể từ đó — hãy so sánh trước).

<a id="analysis-engines"></a>

## 4. Engine phân tích (tùy chọn)

Chưa cài trên máy này. REA không bao giờ tự cài chúng.

| Engine | Cấu hình | Kiểm tra |
| --- | --- | --- |
| Ghidra 12.1.x (thử nghiệm trên Windows) | `GHIDRA_INSTALL_DIR` | `npx -y rea-agents@6.5.0 doctor --provider ghidra --json` |
| IDA (có license) | `REA_IDA_MCP_CONFIG` | `... doctor --provider ida --json` |
| JADX headless MCP 0.7.1 + JDK | `REA_JADX_MCP_JAR` | `... doctor --json` (providerInspections) |
| Hopper | chỉ macOS/Linux | `... doctor --provider hopper --json` |

Biến môi trường cho MCP server được đặt trên đăng ký. Đăng ký lại (PowerShell,
thư mục gốc workspace) theo dạng `claude mcp add -e KEY=value <name> -- <command>`
trong `claude mcp add --help` và tài liệu MCP của Claude Code; đường dẫn dưới
đây chỉ là ví dụ:

```powershell
claude mcp remove --scope local rea
claude mcp add --scope local -e GHIDRA_INSTALL_DIR=D:/tools/ghidra_12.1 rea -- cmd.exe /d /c npx -y rea-agents@6.5.0 mcp
```

Sau đó xác nhận bằng `claude mcp list` và lệnh doctor của provider.
Hướng dẫn: `rea-core/docs/installation.md#ghidra`, `rea-core/docs/ida-provider.md`,
`rea-core/docs/android-analysis.md`, `rea-core/docs/windows-ghidra-p0.md`.

## 5. Gỡ REA khỏi workspace này

```powershell
claude mcp remove --scope local rea      # từ thư mục gốc workspace
```

Có thể để nguyên cache của npx; `rea-core/` chỉ là một thư mục.
