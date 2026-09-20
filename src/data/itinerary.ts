import type { Itinerary } from '../types';

/**
 * Lịch trình mẫu 2 ngày ở Huế — đúng dữ liệu trong bản thiết kế.
 * `travelKmToNext` là quãng đường tới điểm kế tiếp; thời gian được tính lại
 * theo phương tiện trong `src/services/travel.ts`.
 * Khi có backend: thay bằng POST /api/itinerary/generate (PRD §7).
 */
export const SAMPLE_ITINERARY: Itinerary = {
  id: 'hue-a41c',
  city: 'Huế',
  days: [
    {
      dayIndex: 0,
      stops: [
        { orderIndex: 0, poiId: 'bun-bo-ba-tuyet', plannedTime: 7.5, stayDurationMin: 45, travelKmToNext: 2.1, reason: 'Hết hàng trước 10:00' },
        { orderIndex: 1, poiId: 'dai-noi', plannedTime: 8.75, stayDurationMin: 120, travelKmToNext: 3.0, reason: 'Vào trước 9:00 để tránh đoàn tour' },
        { orderIndex: 2, poiId: 'cho-dong-ba', plannedTime: 11.25, stayDurationMin: 60, travelKmToNext: 4.8, reason: 'Bánh bèo, nậm, lọc ở tầng 1' },
        { orderIndex: 3, poiId: 'nha-vuon-an-hien', plannedTime: 13.5, stayDurationMin: 60, travelKmToNext: 2.2, reason: 'Mát nhất đầu giờ chiều' },
        { orderIndex: 4, poiId: 'lang-huong-thuy-xuan', plannedTime: 15, stayDurationMin: 75, travelKmToNext: 6.4, reason: 'Khung giờ vắng nhất trong ngày' },
        { orderIndex: 5, poiId: 'doi-vong-canh', plannedTime: 16.75, stayDurationMin: 45, travelKmToNext: null, reason: 'Hoàng hôn khoảng 17:55' },
        { orderIndex: 6, poiId: 'com-hen-con-hen', plannedTime: 18.5, stayDurationMin: 60, travelKmToNext: null, reason: 'Ăn tối trên cồn giữa sông' },
      ],
    },
    {
      dayIndex: 1,
      stops: [
        { orderIndex: 0, poiId: 'chua-thien-mu', plannedTime: 8, stayDurationMin: 60, travelKmToNext: 7.6, reason: 'Còn tụng kinh sáng lúc 8:00' },
        { orderIndex: 1, poiId: 'lang-hoa-giay-thanh-tien', plannedTime: 9.5, stayDurationMin: 75, travelKmToNext: 6.2, reason: 'Nghệ nhân nhận dạy cắt cánh' },
        { orderIndex: 2, poiId: 'banh-khoai-lac-thien', plannedTime: 11.5, stayDurationMin: 50, travelKmToNext: 5.5, reason: 'Gần cửa Thượng Tứ' },
        { orderIndex: 3, poiId: 'lang-tu-duc', plannedTime: 13, stayDurationMin: 90, travelKmToNext: 11.3, reason: 'Nhiều bóng cây, chịu được nắng trưa' },
        { orderIndex: 4, poiId: 'lang-khai-dinh', plannedTime: 15, stayDurationMin: 80, travelKmToNext: null, reason: 'Đóng cửa 17:00, đi sớm' },
        { orderIndex: 5, poiId: 'pho-co-bao-vinh', plannedTime: 17, stayDurationMin: 60, travelKmToNext: null, reason: 'Thương cảng cũ bên sông' },
      ],
    },
  ],
};

/** Tổng số điểm của cả chuyến — dùng cho header màn Lịch trình. */
export const totalStops = (itinerary: Itinerary): number =>
  itinerary.days.reduce((sum, d) => sum + d.stops.length, 0);

/** Chặng chỉ đường mẫu cho màn 6 — khi có backend thay bằng GET /api/route. */
export const SAMPLE_ROUTE_STEPS = [
  { distanceLabel: '900 m', instruction: 'Đi thẳng qua cầu Bạch Hổ về phía nam sông Hương.' },
  { distanceLabel: '2,1 km', instruction: 'Rẽ trái vào đường Bùi Thị Xuân, đi dọc bờ sông.' },
  { distanceLabel: '3,7 km', instruction: 'Rẽ phải vào đường Huyền Trân Công Chúa, lên dốc.' },
  { distanceLabel: '4,8 km', instruction: 'Đến Đại Nội, cổng Ngọ Môn bên phải đường.', isFinal: true },
];

/** Chuyến nháp ở màn Đã lưu. */
export const DRAFT_TRIPS = [
  { id: 'hue-3d-draft', title: 'Huế · 3 ngày', meta: 'Chưa chọn chỗ ở · sửa 2 ngày trước' },
];

export const SHARE_LINK = 'localexplorer.vn/hue/a41c';
