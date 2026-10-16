# Quy trình kết hợp: điều tra → thiết kế → triển khai

Ba công cụ không tự tích hợp với nhau. Workspace nối chúng bằng file trong dự
án: mỗi giai đoạn đọc đầu ra đã được ghi lại của giai đoạn trước.

```
README (yêu cầu) ─┬─> [Điều tra: REA] ── findings F-### / evidence E-###
                  │                              │
                  ├─> [Thiết kế: UI UX Pro Max] <┘ design/design-system.md (đã chấp nhận)
                  │                              │
                  └─> [Kỹ thuật: ECC] <──────────┘ plans/implementation-plan.md (R-###)
                                 │
                       tests/test-plan.md ── reports/final-report.md
```

## Chọn công cụ

| Câu hỏi | Nếu "có" |
| --- | --- |
| Cần hiểu hành vi của một app/binary/website đã phát hành mà không có mã nguồn? | Giai đoạn điều tra (REA). Cần cơ sở được phép. |
| Có giao diện người dùng cần thiết kế/thiết kế lại? | Giai đoạn thiết kế (UI UX Pro Max). |
| Cần viết/sửa code? | Giai đoạn kỹ thuật (ECC). |
| Chỉ phân tích mã nguồn có sẵn? | Không dùng REA — dùng công cụ đọc code thường, `code-explorer`. |

Chọn loại dự án nhỏ nhất phù hợp: `investigation`, `ui-design`, `engineering`,
hoặc `combined`. Việc nhỏ, rủi ro thấp không cần đủ mọi giai đoạn.

## Các giai đoạn

| # | Giai đoạn | Lệnh | Đầu vào | Đầu ra | Trạng thái |
| --- | --- | --- | --- | --- | --- |
| 1 | Tiếp nhận và phạm vi | `/rea-project-init` | Yêu cầu người dùng | `README.md`, `project.yaml`, `scope/` | initialized |
| 2 | Điều tra | `/rea-investigation` | `scope/`, câu hỏi | `findings/`, `evidence/` | investigating |
| 3 | Sản phẩm và thiết kế | `/rea-ui-design` | `design/design-brief.md`, F-### liên quan | `design/design-system.md`, `design/design-system/` | design |
| 4 | Kế hoạch kỹ thuật | `/rea-engineering` (planner/architect) | Yêu cầu, thiết kế đã chấp nhận, F-### | `plans/implementation-plan.md` (R-###) | implementation |
| 5 | Triển khai | `/rea-engineering` (TDD, build resolver) | Kế hoạch đã duyệt | Code trong repo của bạn | implementation |
| 6 | Kiểm chứng | `/rea-engineering` (verification-loop, reviewer, browser-qa) | Code, thiết kế | `tests/test-plan.md` | review |
| 7 | Review và báo cáo | `/rea-evidence-review`, `/rea-project-closeout` | Tất cả | `reports/final-report.md` | completed |

Quay lại giai đoạn trước khi có bằng chứng hoặc câu hỏi mới.
`/rea-session-save` / `/rea-session-resume` giữ mạch giữa các phiên.

## Quy tắc chuyển giao

- **Điều tra → thiết kế/kỹ thuật:** chỉ hành vi có nhãn **Verified** mới được
  coi là "đã quan sát". **Inferred** phải ghi rõ là suy luận khi thành yêu cầu.
  Tái hiện tính năng ≠ sao chép: thiết kế lại theo yêu cầu của bạn, ghi
  `D-###` cho lựa chọn thiết kế; không sao chép mã, tài sản hay thương hiệu của target.
- **Thiết kế → kỹ thuật:** chỉ dùng quyết định trong `design/design-system.md`
  (đã chấp nhận); file `MASTER.md` sinh tự động là đề xuất.
- **Kỹ thuật → báo cáo:** chỉ ghi kết quả kiểm tra thực sự đã chạy; "not run"
  giữ nguyên.

## Ví dụ: tái hiện tính năng đồng bộ ghi chú

```text
/rea-project-init notes-sync-feature Rebuild a notes-sync feature for our app, inspired by an Electron app we are licensed to examine
   → type: combined, target-type: javascript-electron
/rea-investigation <id> How does the app detect and merge conflicting edits?
/rea-ui-design <id> Conflict-resolution dialog for our web app (react)
/rea-engineering <id> Implement R-001..R-003 in <repo path>
/rea-project-closeout <id>
```

## Kiểm chứng và bàn giao

Trước khi báo "xong": `tests/test-plan.md` có kết quả thật cho các mục bắt
buộc; `report-sanitizer` đã chạy nếu báo cáo được chia sẻ; `project.yaml`
đúng trạng thái; bài học chuyển giao được ghi vào `docs/playbooks/`.
