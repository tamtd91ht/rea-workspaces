# Bắt đầu

Thiết lập workspace này trên một máy và kiểm chứng REA từ đầu đến cuối. Các lệnh
đã được kiểm chứng trên Windows 11 với Node.js 22.22.2, npm 10.9.7, Git 2.44 và
Claude Code 2.1.301, dùng `rea-agents@6.5.0` (2026-10-16).

## 1. Yêu cầu

| Công cụ | Yêu cầu | Kiểm tra |
| --- | --- | --- |
| Node.js + npm | 22.x ≥ 22.19, 24.x ≥ 24.11, hoặc 26+ (không hỗ trợ 23/25) | `node --version` |
| Git | bản gần đây bất kỳ | `git --version` |
| Claude Code | đã cài và đăng nhập | `claude --version` |
| Python 3 | cho UI UX Pro Max `search.py` (thư viện chuẩn) | `python --version` |
| Trình duyệt họ Chrome | chỉ cần cho điều tra website | — |
| Ghidra / IDA / JADX + JDK | chỉ cần cho phân tích native hoặc Android (tự cung cấp) | `npx -y rea-agents@6.5.0 doctor --provider ghidra --json` |

REA không bao giờ tự cài hoặc nâng cấp Node.js, Java, Ghidra, IDA hay JADX.

## 2. Lấy workspace và mã nguồn REA

```bash
git clone https://github.com/tamtd91ht/rea-workspaces.git
cd rea-workspaces
git clone https://github.com/morluto/rea.git rea-core
```

Nếu `rea-core/` đã tồn tại, đừng clone lại: kiểm tra bằng
`git -C rea-core remote -v` và `git -C rea-core status`.

Repo tham chiếu (tùy chọn, chỉ để đọc và cập nhật thành phần đã copy):

```bash
git clone https://github.com/affaan-m/ECC.git ecc-reference
git -C ecc-reference checkout 76aaa77df6adc5b889e689007bf99b9a4f74af34   # commit nguồn của bản copy
git clone https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.git ui-ux-pro-max-reference
```

Các skill/agent ECC và UI UX Pro Max đã được commit trong `.claude/` của repo
workspace — clone workspace là có, không cần cài thêm. Nguồn gốc:
[ecc-guide.md](ecc-guide.md), [ui-ux-pro-max-guide.md](ui-ux-pro-max-guide.md).

<a id="register-rea-with-claude-code"></a>

## 3. Đăng ký REA với Claude Code (chỉ cho workspace này)

MCP server của REA được đăng ký ở **local scope** của Claude Code, gắn với thư
mục này, nên các dự án khác không nạp 207 tool của REA.

Chạy từ thư mục gốc workspace, **trong PowerShell** (Git Bash tự đổi `/d` và
`/c` thành đường dẫn ổ đĩa và tạo ra một đăng ký hỏng):

```powershell
claude mcp add --scope local rea -- cmd.exe /d /c npx -y rea-agents@6.5.0 mcp
```

macOS / Linux:

```bash
claude mcp add --scope local rea -- npx -y rea-agents@6.5.0 mcp
```

Giữ `CLAUDE_CONFIG_DIR` ở trạng thái chưa đặt trong suốt vòng đời của đăng ký
local scope (thêm, liệt kê, cập nhật, xóa). Nguồn: `rea-core/docs/installation.md`,
mục "Limit REA to one project or agent profile".

Cách này không cài skill cấp user của REA; skill `/rea-investigation` của
workspace đọc hướng dẫn chính thức từ
`rea-core/.agents/skills/reverse-engineer-anything/`.

Cách khác (không dùng ở đây): `npx rea-agents setup` đăng ký REA cho **mọi**
dự án Claude Code (user scope) và cài skill vào `~/.claude/skills`.

## 4. Kiểm chứng

```bash
node scripts/check.mjs                         # file, repo, đăng ký MCP, chạy thử search.py
node scripts/test-guard.mjs                    # hook guard
npx -y rea-agents@6.5.0 mcp doctor --json      # server khởi động; 207 tool, 6 prompt
claude mcp list                                # "rea: ... - ✓ Connected"
```

Khi mở `claude` lần đầu ở thư mục gốc, chấp nhận hộp thoại trust folder (hook
chỉ chạy sau khi trust). Gõ `/` để thấy các skill `rea-*`, `ui-ux-pro-max`, …

Sau đó chạy `claude` ở thư mục gốc workspace và yêu cầu nó dùng tool `rea`
(ví dụ "call binary_session with {}"). `check.mjs` không kiểm tra được phiên
đang chạy.

## 5. Quy trình thử đầu tiên (tĩnh, không có target bên ngoài)

Tạo một dự án dùng thử và một app Electron tổng hợp rất nhỏ do bạn sở hữu:

```bash
node scripts/new-project.mjs --name rea-smoke-test --objective "Verify REA static JavaScript analysis" --target-type javascript-electron
```

Đặt các file sau vào `projects/<id>/artifacts/sample-app/`:

- `package.json`: `{ "name": "rea-sample-app", "version": "1.0.0", "main": "main.js" }`
- `main.js`:
  ```js
  const { app, BrowserWindow, ipcMain } = require("electron");
  const path = require("path");
  ipcMain.handle("notes:save", async (_e, text) => ({ saved: text.length }));
  app.whenReady().then(() => {
    const win = new BrowserWindow({ webPreferences: { preload: path.join(__dirname, "preload.js") } });
    win.loadFile("index.html");
  });
  ```
- `preload.js`:
  ```js
  const { contextBridge, ipcRenderer } = require("electron");
  contextBridge.exposeInMainWorld("notes", { save: (t) => ipcRenderer.invoke("notes:save", t) });
  ```

Chạy (bắt buộc dùng đường dẫn tuyệt đối):

```bash
npx -y rea-agents@6.5.0 analyze-javascript-application "D:/…/projects/<id>/artifacts/sample-app" --json > "projects/<id>/artifacts/sample-evidence.json"
```

Kết quả mong đợi: exit 0, một bản ghi Evidence có `evidence_id`, và kênh IPC
`notes:save` xuất hiện trong kết quả. Hoặc trong Claude Code:
`/rea-investigation <id> How does the renderer save notes?`

Xóa dự án thử sau đó nếu không cần nữa.

## 6. Quy trình thử thiết kế (UI UX Pro Max, offline)

```bash
node scripts/new-project.mjs --name ui-smoke-test --type ui-design --objective "Verify the design workflow"
python .claude/skills/ui-ux-pro-max/scripts/search.py "internal operations dashboard" --design-system -f markdown -p "Ops Console" --persist --output-dir projects/<id>/design
```

Kết quả mong đợi: `projects/<id>/design/design-system/ops-console/MASTER.md`.
Trong Claude Code: `/rea-ui-design <id>`. Quy trình kết hợp đầy đủ:
[combined-workflows.md](combined-workflows.md).

## Tiếp theo

- Sử dụng hằng ngày: [operating-guide.md](operating-guide.md)
- Gặp sự cố: [troubleshooting.md](troubleshooting.md)
