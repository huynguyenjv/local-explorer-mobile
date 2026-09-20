import type { Poi } from '../types';

/**
 * Dữ liệu POI mock cho Huế — 13 điểm trong lịch trình 2 ngày của bản thiết kế.
 * Toạ độ thật để bản đồ Goong render đúng vị trí.
 * Khi có backend: thay bằng GET /api/poi?category=&region= (PRD §7).
 */
export const POIS: Poi[] = [
  {
    id: 'bun-bo-ba-tuyet',
    name: 'Bún bò Huế Bà Tuyết',
    category: 'Ẩm thực',
    lat: 16.4712, lng: 107.5795,
    openHours: 'Mở 06:00–10:30',
    stayDurationMin: 45,
    description:
      'Quán bún bò gia truyền trong kiệt nhỏ, nước dùng nấu từ 4 giờ sáng. Hết hàng sớm nên đi trước 9:00.',
    hint: 'Hết hàng trước 10:00',
    images: [],
    rating: 4.6,
    reviewCount: 214,
    reviews: [
      { author: 'Trang N.', rating: 5, ago: '2 tuần', text: 'Đi sớm lúc 7h thì còn chỗ ngồi, nước dùng đậm vừa.' },
      { author: 'Hoàng M.', rating: 4, ago: '1 tháng', text: 'Quán nhỏ, gửi xe ở đầu kiệt rồi đi bộ vào.' },
    ],
  },
  {
    id: 'dai-noi',
    name: 'Đại Nội — Hoàng thành Huế',
    category: 'Di sản',
    lat: 16.4698, lng: 107.5776,
    openHours: 'Mở 07:00–17:30',
    stayDurationMin: 120,
    description:
      'Kinh thành triều Nguyễn, xây năm 1804. Tử Cấm Thành và điện Thái Hòa vừa trùng tu xong.',
    hint: 'Vào trước 9:00 để tránh đoàn tour',
    images: [],
    audioGuide: { url: '', durationLabel: '4 phút 12', sizeLabel: 'Đã tải 3,2 MB', geofenceM: 150 },
    rating: 4.7,
    reviewCount: 38,
    reviews: [
      { author: 'Trang N.', rating: 5, ago: '2 tuần', text: 'Đi 15:00 như app gợi ý thì vắng hẳn, cô chủ dạy se hương thật.' },
      { author: 'Hoàng M.', rating: 4, ago: '1 tháng', text: 'Gửi xe ở đầu đường rồi đi bộ vào, trong làng đường hẹp.' },
    ],
    bestTime: {
      label: 'NÊN ĐẾN LÚC 8:45',
      reason:
        'Trước 9:00 là tránh được đoàn tour và nắng ở sân Đại Triều Nghi. Cửa Ngọ Môn gần bãi xe nhất.',
      bars: [
        { level: 0.30, tone: 'closed' }, { level: 0.24, tone: 'closed' },
        { level: 0.38, tone: 'quiet' }, { level: 0.82, tone: 'busy' },
        { level: 1.00, tone: 'busy' }, { level: 0.74, tone: 'busy' },
        { level: 0.50, tone: 'medium' }, { level: 0.44, tone: 'medium' },
        { level: 0.36, tone: 'closed' }, { level: 0.28, tone: 'closed' },
      ],
      note: 'bạn đến 8:45 — vắng',
    },
  },
  {
    id: 'cho-dong-ba',
    name: 'Chợ Đông Ba',
    category: 'Ẩm thực',
    lat: 16.4746, lng: 107.5862,
    openHours: 'Mở 06:00–19:00',
    stayDurationMin: 60,
    description: 'Chợ trung tâm Huế từ 1899. Khu hàng ăn tầng 1 có bánh bèo, nậm, lọc làm tại chỗ.',
    hint: 'Bánh bèo, nậm, lọc ở tầng 1',
    images: [],
    rating: 4.3,
    reviewCount: 512,
    reviews: [
      { author: 'Linh P.', rating: 4, ago: '3 tuần', text: 'Hỏi giá trước khi mua, hàng ăn thì ngon và rẻ.' },
      { author: 'Đức T.', rating: 5, ago: '2 tháng', text: 'Bánh lọc gói lá ở góc trong cùng là ngon nhất chợ.' },
    ],
  },
  {
    id: 'nha-vuon-an-hien',
    name: 'Nhà vườn An Hiên',
    category: 'Di sản',
    lat: 16.4836, lng: 107.5556,
    openHours: 'Mở 08:00–17:00 · nghỉ thứ 2',
    stayDurationMin: 60,
    description:
      'Nhà rường Huế điển hình với vườn cây ăn trái và bình phong đá. Mát nhất vào đầu giờ chiều.',
    hint: 'Mát nhất đầu giờ chiều',
    images: [],
    rating: 4.5,
    reviewCount: 87,
    reviews: [
      { author: 'Mai H.', rating: 5, ago: '1 tuần', text: 'Vườn rộng, ngồi uống trà ở hiên rất yên.' },
      { author: 'Nam V.', rating: 4, ago: '1 tháng', text: 'Nhớ kiểm tra lịch nghỉ, thứ 2 đóng cửa.' },
    ],
  },
  {
    id: 'lang-huong-thuy-xuan',
    name: 'Làng hương Thủy Xuân',
    category: 'Làng nghề',
    lat: 16.4385, lng: 107.5540,
    openHours: 'Mở 07:00–18:00',
    stayDurationMin: 75,
    description:
      'Làng làm hương trầm truyền thống, các bó hương phơi thành dải màu dọc đường lên đồi Vọng Cảnh.',
    hint: 'Khung giờ vắng nhất trong ngày',
    images: [],
    audioGuide: { url: '', durationLabel: '3 phút 28', sizeLabel: 'Đã tải 2,4 MB', geofenceM: 120 },
    rating: 4.4,
    reviewCount: 163,
    reviews: [
      { author: 'Thu A.', rating: 5, ago: '2 tuần', text: 'Chiều muộn ít đoàn, các cô cho thử se hương.' },
      { author: 'Khoa L.', rating: 4, ago: '3 tuần', text: 'Nên mua ủng hộ một bó, đừng chỉ chụp ảnh rồi đi.' },
    ],
  },
  {
    id: 'doi-vong-canh',
    name: 'Đồi Vọng Cảnh',
    category: 'Thiên nhiên',
    lat: 16.4271, lng: 107.5556,
    openHours: 'Mở cả ngày',
    stayDurationMin: 45,
    description:
      'Đồi thông nhìn xuống khúc sông Hương uốn quanh, điểm ngắm hoàng hôn quen thuộc của người Huế.',
    hint: 'Hoàng hôn khoảng 17:55',
    images: [],
    rating: 4.6,
    reviewCount: 298,
    reviews: [
      { author: 'Bảo Q.', rating: 5, ago: '1 tuần', text: 'Lên trước 17:30 để chọn chỗ ngồi đẹp.' },
      { author: 'Hà T.', rating: 4, ago: '1 tháng', text: 'Đường lên dốc nhẹ, xe máy đi được tới sát đỉnh.' },
    ],
  },
  {
    id: 'com-hen-con-hen',
    name: 'Cơm hến Cồn Hến',
    category: 'Ẩm thực',
    lat: 16.4715, lng: 107.5989,
    openHours: 'Mở 06:00–21:00',
    stayDurationMin: 60,
    description: 'Cơm hến ăn ngay trên cồn giữa sông Hương — nơi ra đời của món này.',
    hint: 'Ăn tối trên cồn giữa sông',
    images: [],
    rating: 4.5,
    reviewCount: 176,
    reviews: [
      { author: 'Vy N.', rating: 5, ago: '2 tuần', text: 'Ăn ở cồn đúng vị hơn hẳn trong phố.' },
      { author: 'Sơn K.', rating: 4, ago: '1 tháng', text: 'Qua cầu nhỏ, buổi tối hơi tối đường.' },
    ],
  },
  {
    id: 'chua-thien-mu',
    name: 'Chùa Thiên Mụ',
    category: 'Di sản',
    lat: 16.4533, lng: 107.5450,
    openHours: 'Mở 07:00–18:00',
    stayDurationMin: 60,
    description:
      'Chùa cổ nhất Huế, dựng năm 1601, tháp Phước Duyên bảy tầng nhìn thẳng ra sông Hương.',
    hint: 'Còn tụng kinh sáng lúc 8:00',
    images: [],
    audioGuide: { url: '', durationLabel: '5 phút 04', sizeLabel: 'Đã tải 3,8 MB', geofenceM: 150 },
    rating: 4.7,
    reviewCount: 421,
    reviews: [
      { author: 'An N.', rating: 5, ago: '1 tuần', text: 'Đi sớm nghe được thời kinh, rất đáng.' },
      { author: 'Phúc D.', rating: 5, ago: '2 tháng', text: 'Đi thuyền rồng từ bến Toà Khâm lên cũng hay.' },
    ],
  },
  {
    id: 'lang-hoa-giay-thanh-tien',
    name: 'Làng hoa giấy Thanh Tiên',
    category: 'Làng nghề',
    lat: 16.5218, lng: 107.6155,
    openHours: 'Mở 08:00–17:00 · nên hẹn trước',
    stayDurationMin: 75,
    description:
      'Làng làm hoa giấy thờ hơn 300 năm, nghệ nhân nhận dạy cắt và nhuộm cánh cho khách.',
    hint: 'Nghệ nhân nhận dạy cắt cánh',
    images: [],
    rating: 4.5,
    reviewCount: 64,
    reviews: [
      { author: 'Quyên T.', rating: 5, ago: '3 tuần', text: 'Gọi trước một hôm thì được xếp lớp làm thử.' },
      { author: 'Hùng P.', rating: 4, ago: '1 tháng', text: 'Đường vào làng nhỏ, đi xe máy tiện hơn ô tô.' },
    ],
  },
  {
    id: 'banh-khoai-lac-thien',
    name: 'Bánh khoái Lạc Thiện',
    category: 'Ẩm thực',
    lat: 16.4706, lng: 107.5818,
    openHours: 'Mở 09:00–21:00',
    stayDurationMin: 50,
    description:
      'Quán bánh khoái lâu năm ngay cửa Thượng Tứ, nước lèo đậu phộng là thứ làm nên tên tuổi.',
    hint: 'Gần cửa Thượng Tứ',
    images: [],
    rating: 4.4,
    reviewCount: 389,
    reviews: [
      { author: 'Diệu L.', rating: 4, ago: '2 tuần', text: 'Nước lèo ngon, bánh hơi nhiều dầu.' },
      { author: 'Tú A.', rating: 5, ago: '1 tháng', text: 'Ăn trưa ở đây rồi đi bộ vào Đại Nội rất tiện.' },
    ],
  },
  {
    id: 'lang-tu-duc',
    name: 'Lăng Tự Đức',
    category: 'Di sản',
    lat: 16.4569, lng: 107.5527,
    openHours: 'Mở 07:00–17:30',
    stayDurationMin: 90,
    description:
      'Lăng có hồ Lưu Khiêm và nhiều bóng thông — nơi vua Tự Đức từng làm thơ, đọc sách.',
    hint: 'Nhiều bóng cây, chịu được nắng trưa',
    images: [],
    rating: 4.6,
    reviewCount: 356,
    reviews: [
      { author: 'Ngọc B.', rating: 5, ago: '1 tuần', text: 'Mát nhất trong các lăng, đi trưa vẫn chịu được.' },
      { author: 'Hải Đ.', rating: 4, ago: '2 tháng', text: 'Khuôn viên rộng, nên dành ít nhất 1 tiếng rưỡi.' },
    ],
  },
  {
    id: 'lang-khai-dinh',
    name: 'Lăng Khải Định',
    category: 'Di sản',
    lat: 16.3995, lng: 107.5789,
    openHours: 'Mở 07:00–17:00',
    stayDurationMin: 80,
    description:
      'Lăng pha trộn kiến trúc Đông–Tây, cung Thiên Định khảm sành sứ kín trần và tường.',
    hint: 'Đóng cửa 17:00, đi sớm',
    images: [],
    rating: 4.7,
    reviewCount: 402,
    reviews: [
      { author: 'Minh C.', rating: 5, ago: '2 tuần', text: 'Phần khảm sành trong cung Thiên Định đẹp không tả được.' },
      { author: 'Yến V.', rating: 4, ago: '1 tháng', text: 'Nhiều bậc thang, đi giày thoải mái vào.' },
    ],
  },
  {
    id: 'pho-co-bao-vinh',
    name: 'Phố cổ Bao Vinh',
    category: 'Di sản',
    lat: 16.5054, lng: 107.5836,
    openHours: 'Mở cả ngày',
    stayDurationMin: 60,
    description:
      'Thương cảng cũ bên sông Hương, còn lại vài chục ngôi nhà gỗ hơn trăm năm tuổi.',
    hint: 'Thương cảng cũ bên sông',
    images: [],
    rating: 4.2,
    reviewCount: 118,
    reviews: [
      { author: 'Thảo M.', rating: 4, ago: '3 tuần', text: 'Chiều muộn ánh sáng đẹp, ít khách du lịch.' },
      { author: 'Lộc H.', rating: 4, ago: '2 tháng', text: 'Nhà cổ còn ít nhưng đi dạo bờ sông thì thích.' },
    ],
  },
];

export const POI_BY_ID: Record<string, Poi> = Object.fromEntries(POIS.map((p) => [p.id, p]));

export const getPoi = (id: string): Poi => {
  const poi = POI_BY_ID[id];
  if (!poi) throw new Error(`Không tìm thấy POI: ${id}`);
  return poi;
};

/** Điểm người dùng lưu riêng (màn 7). */
export const SAVED_POI_IDS = ['lang-hoa-giay-thanh-tien', 'doi-vong-canh', 'banh-khoai-lac-thien'];
