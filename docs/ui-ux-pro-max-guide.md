# Hướng dẫn UI UX Pro Max (Lớp C — thiết kế UI/UX)

UI UX Pro Max (https://github.com/nextlevelbuilder/ui-ux-pro-max-skill, MIT)
là skill cung cấp cơ sở dữ liệu tìm kiếm cục bộ về style, bảng màu, cặp font,
mẫu layout, biểu đồ, hướng dẫn UX/khả năng tiếp cận cho 22 stack, và bộ sinh
design system.

## Cài đặt

| Phương án | Đánh giá | Quyết định |
| --- | --- | --- |
| Marketplace plugin | Mặc định phạm vi user (mọi dự án) | Không dùng |
| CLI `--global` | Ghi vào `~/.claude/skills/` | Không dùng |
| **CLI phạm vi dự án** | Ghi vào `.claude/skills/` của workspace | **Chọn** |

```bash
npx -y ui-ux-pro-max-cli@2.15.0 init --ai claude     # tại thư mục gốc workspace
```

- Gói npm là `ui-ux-pro-max-cli` (lệnh `uipro`); không dùng `uipro-cli` cũ.
- Bản 2.15.0 **không có** `--dry-run` (README trên `main` mô tả cờ này nhưng
  chưa phát hành). Đã chạy thử trong thư mục trống trước khi cài.
- Cài 7 skill (172 file), commit vào repo workspace nguyên trạng.
- Yêu cầu: Python 3 (thư viện chuẩn) cho `search.py`; không gọi mạng.

| Skill | Nội dung | Luồng dữ liệu |
| --- | --- | --- |
| `ui-ux-pro-max` | Tìm kiếm + sinh design system (`.claude/skills/ui-ux-pro-max/scripts/search.py`) | Cục bộ |
| `design-system` | Token 3 lớp, CSS variables, sinh slide | Cục bộ; `fetch-background.py` chứa URL ảnh Pexels (trang sinh ra sẽ tải ảnh từ internet) |
| `ui-styling` | shadcn/ui + Tailwind | `shadcn_add.py` chạy `npx shadcn` (mạng) — cần duyệt |
| `design` | Nhận diện thương hiệu, logo/icon/CIP | Generator gọi **Gemini API** (`GEMINI_API_KEY`) — cần duyệt |
| `brand`, `banner-design`, `slides` | Thương hiệu, banner, slide HTML | Chủ yếu cục bộ; rà trước khi chạy script |

## Sử dụng

Trong Claude Code: `/rea-ui-design <project-id>` (điều phối) — hoặc yêu cầu UI
tự nhiên, skill tự kích hoạt. Lệnh trực tiếp (đã kiểm chứng với bản cài):

```bash
# Design system đầy đủ, lưu vào thư mục design của dự án
python .claude/skills/ui-ux-pro-max/scripts/search.py "internal operations dashboard" \
  --design-system -f markdown -p "Ops Console" --persist --output-dir projects/<id>/design

# Ghi đè cho một trang
python .claude/skills/ui-ux-pro-max/scripts/search.py "internal operations dashboard" \
  --design-system -p "Ops Console" --persist --page "dashboard" --output-dir projects/<id>/design

# Tra cứu theo lĩnh vực / stack
python .claude/skills/ui-ux-pro-max/scripts/search.py "form validation error summary" --domain ux
python .claude/skills/ui-ux-pro-max/scripts/search.py "data table" --stack react
```

Luôn truyền `--output-dir` khi `--persist` (mặc định ghi vào thư mục hiện tại,
tức gốc workspace). Kết quả nằm ở `projects/<id>/design/design-system/<slug>/MASTER.md`
(+ `pages/<trang>.md`). Domain: `style, color, chart, landing, product, ux,
typography, icons, gsap, react, web, google-fonts`; dial `--density`,
`--motion`, `--variance` (1–10).

## Quy trình design system

1. Điền `design/design-brief.md` (người dùng, tác vụ, stack, ràng buộc, design
   system sẵn có, mục tiêu accessibility).
2. Sinh đề xuất (lệnh trên). Nếu dự án đã có design system: **không thay thế**
   khi chưa được duyệt; chỉ dùng tra cứu UX/accessibility cho phần còn thiếu.
3. Duyệt với người dùng từng mảng: style, màu (cặp tương phản), font, mật độ,
   layout, component, motion, các trạng thái.
4. Ghi quyết định đã chấp nhận và phương án bị loại vào `design/design-system.md`,
   quyết định lớn vào `plans/decisions.md`.
5. Bàn giao cho `/rea-engineering`.

## Kiểm chứng

Đề xuất của UI UX Pro Max **không phải** bằng chứng giao diện đạt chuẩn. UI đã
triển khai phải được kiểm tra thực tế (browser-qa / Playwright, tương phản,
bàn phím/focus, responsive, các trạng thái loading/empty/error/success) và ghi
vào `tests/test-plan.md`.

## Cập nhật / gỡ

- Cập nhật: [maintenance.md](maintenance.md#ui-ux-pro-max).
- Gỡ: `npx -y ui-ux-pro-max-cli@2.15.0 uninstall --ai claude` tại gốc workspace,
  hoặc xóa 7 thư mục skill liệt kê ở trên; cập nhật `THIRD_PARTY_NOTICES.md`.
