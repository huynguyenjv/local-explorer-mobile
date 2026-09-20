import type { City } from '../types';

/** Thành phố hỗ trợ. Chỉ Huế có dữ liệu (design màn 1). */
export const CITIES: City[] = [
  { name: 'Huế', ready: true, poiCountLabel: '78 điểm · đủ dữ liệu', center: { lat: 16.4637, lng: 107.5909 } },
  { name: 'Đà Nẵng', ready: false, poiCountLabel: 'sắp có', center: { lat: 16.0544, lng: 108.2022 } },
  { name: 'Hội An', ready: false, poiCountLabel: 'sắp có', center: { lat: 15.8801, lng: 108.3380 } },
  { name: 'Quảng Trị', ready: false, poiCountLabel: 'sắp có', center: { lat: 16.7943, lng: 107.1855 } },
];

export const TRIP_LENGTHS = [1, 2, 3] as const;

export const INTERESTS = [
  { name: 'Di sản', example: 'Đại Nội, lăng, chùa' },
  { name: 'Ẩm thực', example: 'Bún bò, cơm hến, chợ' },
  { name: 'Làng nghề', example: 'Hương, hoa giấy, nón' },
  { name: 'Thiên nhiên', example: 'Đầm phá, đồi, sông' },
] as const;

/** Tốc độ dùng để tính lại thời gian chặng khi đổi phương tiện (handoff §Tương tác) */
export const MODES = [
  { label: 'Đi bộ', speedKmh: 4.8, word: 'đi bộ' },
  { label: 'Xe máy', speedKmh: 24, word: 'xe máy' },
  { label: 'Ô tô', speedKmh: 20, word: 'ô tô' },
] as const;

export const START_TIMES = ['07:00', '08:30', '10:00'] as const;

export const GROUPS = ['Một mình', 'Hai người', 'Có trẻ nhỏ', 'Nhóm 4+'] as const;
