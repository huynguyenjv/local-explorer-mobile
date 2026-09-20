import { MODES } from '../data/cities';
import type { TravelMode } from '../types';

/**
 * Tính lại thời gian di chuyển khi đổi phương tiện.
 * Quy tắc từ handoff: đi bộ 4,8 km/h · xe máy 24 km/h · ô tô 20 km/h,
 * làm tròn phút, tối thiểu 3 phút.
 */
export const travelMinutes = (km: number, mode: TravelMode): number =>
  Math.max(3, Math.round((km / MODES[mode].speedKmh) * 60));

/** Số thập phân giờ → "HH:MM". 8.75 → "08:45" */
export const formatHour = (hour: number): string => {
  const hh = Math.floor(hour);
  const mm = Math.round((hour - hh) * 60);
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
};

/** Định dạng số kiểu Việt Nam: 2.1 → "2,1" */
export const formatKm = (km: number): string => String(km).replace('.', ',');

/** Dòng nối chặng giữa hai thẻ: "8 phút xe máy · 2,1 km" hoặc "Kết thúc ngày". */
export const travelLabel = (km: number | null, mode: TravelMode): string => {
  if (km === null) return 'Kết thúc ngày';
  return `${travelMinutes(km, mode)} phút ${MODES[mode].word} · ${formatKm(km)} km`;
};

/** Giờ kết thúc ngày = giờ điểm cuối + thời gian ở lại. */
export const endOfDay = (lastPlannedTime: number, lastStayMin: number): string =>
  formatHour(lastPlannedTime + lastStayMin / 60);
