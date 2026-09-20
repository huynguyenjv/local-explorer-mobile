# Local Explorer AI — Mobile

Ứng dụng di động (Android + iOS) cho trợ lý AI lập lịch trình khám phá văn hoá
địa phương tại Huế. UI dựng theo bản thiết kế trong
`.claude/design/design_handoff_local_explorer/`, phạm vi và mô hình dữ liệu theo
`.claude/docs/PRD_Local_Explorer_AI.docx`.

**React Native + Expo (TypeScript)** — một codebase chạy cả Android lẫn iOS.

## Chạy thử

```bash
npm install
cp .env.example .env     # điền 2 key Goong, xem mục dưới
npx expo start
```

Bản đồ dùng native module (MapLibre) nên **không chạy được trong Expo Go**.
Cần một development build:

```bash
npx expo run:android      # cần Android Studio + SDK
npx expo run:ios          # cần macOS + Xcode
```

Muốn xem nhanh các màn không có bản đồ thì `npx expo start` với Expo Go vẫn mở
được; màn Hôm nay và Chỉ đường sẽ hiện khung báo thiếu cấu hình thay vì map.

## Cấu hình Goong Maps

Lấy key tại https://account.goong.io — **hai key khác nhau**:

| Biến môi trường | Dùng cho |
|---|---|
| `EXPO_PUBLIC_GOONG_MAPTILES_KEY` | Style bản đồ vector (MapLibre render) |
| `EXPO_PUBLIC_GOONG_API_KEY` | Directions API (chỉ đường, khoảng cách) |

Đặt trong `.env` ở gốc dự án rồi khởi động lại Metro (`npx expo start --clear`).
Thiếu key thì app vẫn chạy: bản đồ hiện khung hướng dẫn, chỉ đường dùng dữ liệu
chặng mẫu đã tải sẵn.

> **Bảo mật:** `EXPO_PUBLIC_*` được inline vào bundle. Với bản production nên
> chuyển Directions về gọi qua backend như PRD §4 yêu cầu, chỉ giữ maptiles key
> ở client.

## Cấu trúc

```
src/
  theme/tokens.ts       Design tokens — màu, font, bo góc, bóng, kích thước
  types/                Kiểu dữ liệu POI / Itinerary, khớp PRD §6
  data/                 Dữ liệu mock: 13 POI Huế (toạ độ thật), lịch trình 2 ngày
  services/
    travel.ts           Tính lại thời gian chặng theo phương tiện
    goong.ts            Style bản đồ + Directions API + giải mã polyline
  state/TripContext.tsx State toàn cục (city/len/interests/mode/start/group/day/editing)
  components/           Text, Chip, Button, ImageSlot, CategoryBits, TripMap, ScreenHeader
  screens/              8 màn hình
  navigation/           Tab 4 mục + stack cho Chi tiết điểm / Chỉ đường
```

## Tám màn hình

| # | Màn | File |
|---|---|---|
| 1 | Tạo lịch trình (onboarding) | `screens/OnboardingScreen.tsx` |
| 2 | Trợ lý (chat) | `screens/ChatScreen.tsx` |
| 3 | Hôm nay (bản đồ) | `screens/TodayScreen.tsx` |
| 4 | Lịch trình | `screens/ItineraryScreen.tsx` |
| 5 | Chi tiết điểm | `screens/PoiDetailScreen.tsx` |
| 6 | Chỉ đường | `screens/DirectionsScreen.tsx` |
| 7 | Đã lưu & chia sẻ | `screens/SavedScreen.tsx` |
| 8 | Trạng thái ngoài đường | `screens/FieldStatesScreen.tsx` |

Màn 3/4/2/7 là tab gốc. Màn 5 và 6 mở chồng lên bằng stack.

Màn 8 hiện gom bốn trạng thái vào một trang để kiểm tra giao diện. Ở bản
production, mỗi khối được kích hoạt bởi điều kiện thật (NetInfo, độ chính xác
GPS, `open_hours`, timeout gọi LLM) và hiện như lớp phủ trên màn tương ứng —
chưa nối vào điều hướng tab.

## Hành vi đã implement

- **Đổi phương tiện tính lại mọi chặng** — đi bộ 4,8 km/h · xe máy 24 km/h ·
  ô tô 20 km/h, làm tròn phút, tối thiểu 3 phút (`services/travel.ts`).
- **Chọn thành phố** — chỉ Huế có dữ liệu; thành phố khác đổi dải ghi chú và
  khoá nút tạo lịch trình.
- **Chọn sở thích** đa chọn, **đổi ngày** đổi toàn bộ danh sách điểm.
- **Chế độ Sửa** — hiện hàng chip Đổi giờ / Chèn điểm / Bỏ trên mỗi thẻ, đổi nội
  dung thanh tổng kết.
- **Tuyến đường thật** — gọi Goong Directions cho từng chặng trong ngày rồi nối
  lại; chặng nào lỗi thì nối thẳng hai đầu.

## Chưa làm

- **Kéo thả đổi thứ tự điểm** — bản thiết kế ghi rõ chưa implement, cần
  `react-native-draggable-flatlist` hoặc Reanimated.
- **Ảnh thật** — mọi ô ảnh là placeholder (`components/ImageSlot.tsx`). Truyền
  `uri` là hiện ảnh, không phải sửa layout.
- **Nối backend** — hiện chạy hoàn toàn trên mock data. Các endpoint cần nối
  theo PRD §7: `/api/chat/message`, `/api/itinerary/generate`, `/api/poi`,
  `/api/route`, `/api/crowd-forecast`.
- **Audio guide phát thật + geofencing** (FR-26) và **cache offline IndexedDB**
  (FR-25) — UI đã có, phần chạy nền chưa.

## Kiểm tra

```bash
npm run typecheck                    # tsc --noEmit
npx expo export --platform android   # dựng bundle
npx expo export --platform ios
```
