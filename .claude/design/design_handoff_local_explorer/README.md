# Handoff: Local Explorer AI — bản mobile web cho du khách

## Tổng quan
Ứng dụng web mobile gợi ý và dẫn đường theo lịch trình cho du khách tại Huế. Người dùng nhập điều kiện (thành phố, số ngày, sở thích, phương tiện, giờ bắt đầu, nhóm đi cùng) → trợ lý sinh lịch trình nhiều ngày → theo dõi từng điểm trên bản đồ, nghe audio guide, chỉ đường từng chặng, lưu và chia sẻ.

## Về các file trong gói này
Các file HTML ở đây là **bản thiết kế tham chiếu**, không phải mã production để copy. Việc cần làm là **dựng lại các màn hình này trong codebase đích** (React / Vue / React Native / Flutter…) theo pattern và thư viện sẵn có của dự án. Nếu chưa có codebase, chọn framework phù hợp rồi implement theo mô tả dưới.

File `Local Explorer AI - Mobile.dc.html` mở trực tiếp bằng trình duyệt để xem và bấm thử.

## Fidelity
**High-fidelity.** Màu, chữ, khoảng cách, bán kính bo, trạng thái đã chốt — dựng lại đúng theo các giá trị trong mục Design tokens.

## Design tokens

Màu:
- Mực chính `#16130F` · chữ phụ `#6B5F52` · chữ mờ `#8A7D6D` / `#9A8F80`
- Nền trang `#FFE7CE` · nền màn phụ `#FFF7EE` · nền thẻ `#FFFFFF` · nền nhạt `#FBF6EF`
- Đường kẻ `#F1EBE2` · viền nút phụ `#E7DFD4`
- CTA chính (cam đất) `#D93A14`, hover `#B92F0E`, viền nhạt `#F3CFC5`
- Xanh rêu (tích cực, "vắng người") `#0B6E5F`, nền nhạt `#E4F0EC`
- Vàng nghệ (chọn/nhấn) `#FFD66B`, nền cảnh báo `#FFE7CE`, chữ trên nền vàng `#7A4A12`
- Màu theo loại điểm: Di sản `#C9861B` / nền `#FDF0D9` · Ẩm thực `#D93A14` / `#FAE6E0` · Làng nghề `#0B6E5F` / `#E4F0EC` · Thiên nhiên `#3F7D20` / `#EBF2E1`
- Biểu đồ đông người: vắng `#0B6E5F`, vừa `#E9A62B`, đông `#D93A14`, ngoài giờ `#E2C9A6`

Chữ:
- Tiêu đề: **Archivo** 700/800, letter-spacing -0.015 đến -0.03em. Cỡ: 34px (câu hỏi onboarding), 26–29px (tiêu đề màn), 17–23px (tiêu đề thẻ), 15–16px (tên điểm trong danh sách)
- Nội dung: **Be Vietnam Pro** 400/500/600/700. Cỡ: 14.5px (đoạn văn, line-height 1.55–1.6), 13px (phụ), 12–12.5px (nhãn, chip), 11px (nhãn tab)
- Nhãn khối in hoa: Archivo 700, 12–13px, letter-spacing .08em, màu `#6B5F52`

Khoảng cách và hình khối:
- Padding màn: 18–22px ngang
- Bo góc: khung màn 28px · thẻ lớn 18–20px · thẻ nhỏ 13–16px · nút 13–16px · chip 999px
- Bóng: thẻ `0 3px 12px -8px rgba(22,19,15,.4)` · thẻ nổi `0 8px 24px -14px rgba(22,19,15,.45)` · bảng trượt `0 -16px 40px -18px rgba(22,19,15,.45)`
- Chiều cao mục tiêu bấm: nút chính 52–56px · nút phụ 46px · chip 38–40px · thanh tab 78px
- Viền nhấn: `2px solid #16130F` (nút phụ, thẻ được chọn)

## Các màn hình

### 1. Tạo lịch trình (onboarding)
Mục đích: thu điều kiện đầu vào trong một màn, không tài khoản.
- Logo + tên sản phẩm trên cùng
- H1 "Bạn đi đâu?" + phụ đề "Bốn câu, rồi mình xếp lịch trình."
- **Thành phố**: grid 2 cột, mỗi ô là nút 2 dòng (tên + tình trạng dữ liệu). Huế = `78 điểm · đủ dữ liệu` (chọn được, viền đen); Đà Nẵng / Hội An / Quảng Trị = `sắp có` (nền `#FBF6EF`, chữ `#9A8F80`). Dưới grid là dải ghi chú: xanh rêu nếu thành phố có dữ liệu, cam nhạt nếu chưa ("Chưa có dữ liệu điểm đến cho X. Chọn để mình báo khi mở.")
- **Ở bao lâu**: chip 1 / 2 / 3 ngày (mặc định 2)
- **Bạn nghiêng về điều gì**: grid 2 cột, 4 thẻ đa chọn (Di sản / Ẩm thực / Làng nghề / Thiên nhiên), mỗi thẻ có tên + ví dụ. Thẻ chọn: nền `#FFD66B`, viền đen. Mặc định chọn Ẩm thực + Làng nghề
- **Đi lại bằng**: chip Đi bộ / Xe máy / Ô tô (mặc định Xe máy)
- **Mỗi ngày bắt đầu lúc**: chip 07:00 / 08:30 / 10:00 (mặc định 08:30)
- **Đi cùng**: chip Một mình / Hai người / Có trẻ nhỏ / Nhóm 4+ · ghi chú "Có trẻ nhỏ thì mình giảm số điểm và chèn quãng nghỉ buổi trưa."
- Footer cố định: CTA "Tạo lịch trình →" (56px, `#D93A14`) + dòng tóm tắt "Bắt đầu 08:30 · một mình · đổi được sau"

### 2. Trợ lý (chat)
- Header: logo LE (40px, `#0B6E5F`, chữ `#FFD66B`) + "Trợ lý" + dòng ngữ cảnh "Huế · 2 ngày · Xe máy"; mũi tên → ở góc phải trả về màn 1
- Bong bóng trợ lý: nền trắng, bo `20px 20px 20px 6px`. Bong bóng người dùng: nền `#16130F`, chữ `#FFF7EE`, bo `20px 20px 6px 20px`, canh phải
- **Thẻ kết quả**: hàng 3 ảnh cao 96px (bo trên 20px) + tiêu đề "Huế · 2 ngày" + số điểm + một câu tóm tắt + nút "Xem lịch trình"
- Dải chip gợi ý hành động tiếp ("Đổi bữa trưa ngày 1", "Thêm buổi đi thuyền", "Chỗ ở gần điểm ngày 2"); chip đầu có viền đen
- Thanh nhập cố định dưới cùng: input giả 48px bo tròn + nút gửi tròn 48px `#D93A14`

### 3. Hôm nay (bản đồ)
- Bản đồ chiếm toàn khung (production: Goong Maps SDK). Marker điểm đang tới: vàng `#FFD66B` viền đen 3px; marker khác: trắng viền đen; vị trí người dùng: `#0B6E5F` + vòng `pulseRing` (scale 1→2.6, opacity .55→0, 2.4s ease-out infinite). Tuyến đường: `#D93A14`, stroke 5px, linejoin/linecap round
- Thẻ hướng dẫn trên cùng: nền `#16130F`, icon mũi tên vàng 34px, "Đang tới Đại Nội · 8 phút" + hướng dẫn kế tiếp
- Chip: "Huế · 2 ngày ▾" (mở danh sách chuyến / tạo chuyến mới), "Ngày 1 · điểm 2/8", "Xe máy"
- **Bảng trượt điểm kế tiếp**: ảnh 104px + nhãn loại điểm + tên + giờ mở & thời gian ở + câu khuyên giờ đến + chip trạng thái ("Giờ này vắng" nền `#0B6E5F`, "Audio 4:12", "4,7 ★ · 38") + hàng nút Chỉ đường / ♡ / ▶
- Thanh tab 4 mục: Hôm nay · Lịch trình · Trợ lý · Đã lưu (mục đang mở màu `#D93A14`)

### 4. Lịch trình
- Header: "Lịch trình {thành phố}" + "2 ngày · 13 điểm"; chip Ngày 1 / Ngày 2; nút phương tiện (nền vàng, bấm để xoay vòng); nút "Sửa"
- Danh sách cuộn: cột giờ trái 48px (Archivo 800 15px + thời lượng 11px), thẻ điểm bên phải gồm ô chữ đầu 56px (màu theo loại điểm), nhãn loại, tên điểm, một câu lý do
- Giữa hai thẻ là nối chặng: vạch dọc 2px + "8 phút xe máy · 2,1 km"; điểm cuối ngày ghi "Kết thúc ngày"
- **Chế độ Sửa**: mỗi thẻ hiện hàng chip Đổi giờ / Chèn điểm / Bỏ (Bỏ màu `#D93A14`); thanh dưới đổi nội dung thành "Đang sửa ngày N" + "Kéo thẻ để đổi thứ tự · thay đổi lưu ngay"
- Thanh tổng kết nổi (nền `#16130F`, cách đáy 96px): "N điểm · Ngày N" + "Kết thúc khoảng HH:MM" + chip vàng "Nhờ trợ lý"

### 5. Chi tiết điểm
- Ảnh hero 300px full-bleed + nút ← / ♡ / ↗ (42px, bo 13px, nền trắng)
- Nhãn "DI SẢN · 2,1 KM" → H1 29px → mô tả
- **Khối khuyên giờ đến** (nền `#FFE7CE`): "NÊN ĐẾN LÚC 8:45" + lý do + biểu đồ 10 cột giờ (cao 46px, bo 3px) + chú thích "7h — bạn đến 8:45 — vắng — 17h"
- **Audio guide**: viền đen 2px, nút play tròn 44px `#0B6E5F`, "Audio guide · 4 phút 12", "Đã tải 3,2 MB · dùng được khi mất mạng"; dưới đó là công tắc "Tự phát khi tới cổng" (50×30px, bật = `#0B6E5F`)
- **Đánh giá**: tiêu đề + "4,7 ★ · 38 đánh giá" + 2 đánh giá (tên, sao, thời gian, nội dung)
- Thanh CTA cố định: "Thêm vào lịch trình" + nút ↗

### 6. Chỉ đường
- Bản đồ 320px trên cùng với tuyến `#D93A14` stroke 7px; nút ← góc trên trái
- Panel trắng bo trên 26px, kéo lên đè bản đồ -26px
- Hướng dẫn hiện tại: glyph ↱ 42px màu `#D93A14` + câu hướng dẫn Archivo 800 23px + "còn 400 m"
- Dải thông tin nền `#FFE7CE`: "2,1 km · 8 phút · tới Đại Nội trước 8:45" + chip "Đọc to ✓" (nền đen, chữ vàng)
- Danh sách chặng: cột khoảng cách 54px + câu hướng dẫn 14.5px, kẻ trên `#F1EBE2`; chặng cuối in đậm màu `#0B6E5F`
- Thanh cố định: "Bắt đầu dẫn đường" (nền `#16130F`) + nút phương tiện (nền vàng, viền đen)

### 7. Đã lưu & chia sẻ
- Header: "Đã lưu" + nút "+ Chuyến mới" (`#D93A14`) → về màn 1; chip "Lịch trình 1" / "Điểm lẻ 6"
- **Thẻ chuyến đang đi**: hàng 2 ảnh cao 108px + "Huế · 2 ngày" + badge "Đang đi · ngày 1/2" (nền `#0B6E5F`) + dòng mô tả + nút Mở / Chia sẻ / ⋯
- **Hàng chuyến nháp**: badge "Nháp" (nền `#FFE7CE`) + "Huế · 3 ngày" + "Chưa chọn chỗ ở · sửa 2 ngày trước" + "Tiếp tục"
- **Khối chia sẻ** (nền `#16130F`): tiêu đề, giải thích link mở được trên web, ô link + "Sao chép", chip Zalo (nền vàng) / Messenger / Mã QR
- **Điểm lưu riêng**: 3 hàng, ô chữ đầu 52px theo màu loại điểm + tên + meta + "Thêm"

### 8. Trạng thái ngoài đường
Bốn thẻ, mỗi thẻ có nhãn in hoa, tiêu đề, giải thích, và hành động tiếp:
- **MẤT MẠNG** (nền `#16130F`): "Vẫn xem được cả lịch trình" · 18 MB đã tải sẵn · nút "Dùng bản đã tải" / "Thử lại"
- **VỊ TRÍ LỆCH** (viền `#FFE7CE`): sai số ~300 m · "Chọn trên bản đồ" / "Bỏ qua"
- **ĐIỂM ĐÓNG CỬA HÔM NAY** (viền `#F3CFC5`): nêu điểm đóng + 2 gợi ý thay thế cùng khung giờ, mỗi gợi ý có nút "Thay"
- **TRỢ LÝ CHẬM** (viền `#E7DFD4`): quá 8 giây → lịch trình xếp bằng quy tắc (khoảng cách + giờ mở cửa) · "Dùng bản này" / "Chờ trợ lý"

## Tương tác & hành vi
- Chọn thành phố: đổi tên thành phố ở mọi tiêu đề; thành phố chưa có dữ liệu chỉ đổi dải ghi chú, không tạo được lịch trình
- Chọn sở thích: đa chọn, bật/tắt
- Đổi ngày: đổi toàn bộ danh sách điểm
- Đổi phương tiện: **tính lại thời gian mọi chặng** theo tốc độ đi bộ 4,8 km/h · xe máy 24 km/h · ô tô 20 km/h, làm tròn phút, tối thiểu 3 phút
- Nút Sửa: bật/tắt chế độ sửa (hiện hàng hành động mỗi thẻ, đổi nội dung thanh tổng kết). Kéo thả đổi thứ tự **chưa implement trong bản thiết kế** — cần làm ở codebase
- Mũi tên → ở màn Trợ lý: về màn tạo lịch trình. Màn 3/4/7 là tab gốc, điều hướng bằng tab và chip đổi chuyến, không dùng back stack
- Cuộn: mỗi màn có một vùng cuộn duy nhất giữa header và thanh cố định

## State
```
city: 0..3            // index thành phố
len: 1|2|3            // số ngày
interests: number[]   // index sở thích, đa chọn
mode: 0|1|2           // đi bộ | xe máy | ô tô
start: 0|1|2          // 07:00 | 08:30 | 10:00
group: 0..3           // một mình | hai người | có trẻ nhỏ | nhóm 4+
day: 0|1              // ngày đang xem
editing: boolean      // chế độ sửa lịch trình
```

## Dữ liệu và API cần có
Mô hình điểm (POI): `id, name, category, lat, lng, open_hours, stay_duration_min, description, images[], audio_guide{url, duration, geofence_m}, source, rating, reviews[]`
Mô hình chặng trong lịch trình: `order_index, poi_id, planned_time, stay_duration_min, travel_km_from_prev, travel_min_from_prev, reason`

Cần từ backend:
- Sinh lịch trình theo điều kiện người dùng (có đường lui bằng quy tắc khi LLM chậm/lỗi — xem màn 8)
- Tìm POI theo thành phố, loại, bán kính
- Chỉ đường và ma trận khoảng cách theo phương tiện (dự kiến Goong Directions)
- Dự báo đông người theo điểm + giờ + ngày trong tuần
- Lưu / chia sẻ lịch trình bằng link công khai
- Tải trước gói offline cho chuyến (bản đồ, chỉ đường, audio)

Mọi truy vấn phải nhận `city` làm tham số; cần thêm `city.bounds` cho khung bản đồ và `city.timezone`.

## Assets
- Không có ảnh thật. Mọi ô ảnh trong bản thiết kế là placeholder (`<image-slot>`) — cần ảnh Huế thật khi implement.
- Font: Archivo và Be Vietnam Pro (Google Fonts), có dấu tiếng Việt đầy đủ.
- Không dùng icon font; các glyph (← → ↱ ▶ ♡ ✳ ◉ ≡) nên thay bằng icon set của codebase.

## Files
- `Local Explorer AI - Mobile.dc.html` — toàn bộ 8 màn hình, mở trực tiếp bằng trình duyệt
- `image-slot.js`, `support.js` — runtime cho bản thiết kế, **không** đưa vào production
