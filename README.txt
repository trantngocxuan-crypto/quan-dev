QUÂN DEV — PRO V5

Mục tiêu V5:
Biến website từ bản giới thiệu thành bản gần production để bắt đầu nhận lead thật.

Đã thêm:
- Client Brief gửi thật qua FormSubmit AJAX tới: minhquanhangtran@gmail.com
- Tên, email, điện thoại/Zalo là trường bắt buộc
- Brief tự đính kèm dự toán hiện tại: gói, số trang, add-on, giá
- Loading / success / error state
- Honeypot chống spam cơ bản
- Nút sao chép brief làm fallback
- Mobile menu
- Focus state + prefers-reduced-motion
- SEO meta, Open Graph, canonical
- favicon.svg
- robots.txt + sitemap.xml
- Link live cho Lam Handmade
- Dòng Sử Việt được ghi "Đang phát triển", không bịa link
- Bỏ cam kết "phản hồi trong 24 giờ" chưa được xác nhận
- Tiếp tục UTF-8 để hạn chế lỗi tiếng Việt

QUAN TRỌNG VỀ FORM:
Website dùng dịch vụ FormSubmit (bên thứ ba) để chuyển form tới Gmail.
Lần gửi đầu tiên có thể yêu cầu xác nhận email minhquanhangtran@gmail.com trước khi các lead tiếp theo được chuyển.
Nên test form sau khi deploy GitHub Pages; mở bằng file:// có thể bị trình duyệt hạn chế request mạng.

URL mục tiêu:
https://trantngocxuan-crypto.github.io/quan-dev/

Trước khi quảng bá:
1. Deploy GitHub Pages.
2. Gửi thử 1 lead.
3. Kiểm tra email xác nhận FormSubmit nếu có.
4. Test điện thoại.
5. Test calculator -> brief -> submit.


V5.1 MOBILE FIX:
- Chặn horizontal overflow ở html/body
- Fix honeypot không còn left:-9999px
- Bổ sung min-width:0 cho grid/flex children
- Ép media/content không vượt viewport
- Thêm overflow-wrap cho nội dung dài/email


V6 — PORTFOLIO PROOF UPDATE
- Based on V5.1 mobile-stable build.
- Added Bánh Bèo Bà Ba as the second LIVE case study.
- Kept Lam Handmade as LIVE case study #1.
- Reframed Dòng Sử Việt as a full-width IN DEVELOPMENT / COMING SOON case study.
- Added proof strip: 02 website live / 01 in development / 100% hand-built.
- New Bánh Bèo visual mock created with CSS only — no external image dependency.
- Preserved existing pricing, estimator, brief form, contacts, SEO, mobile overflow fixes and existing public links.
- Bánh Bèo live URL:
  https://banhbeobaba.github.io/banh-beo-ba-ba-v1/
