import type { CategoryName } from '../theme/tokens';

export type { CategoryName };

export type TravelMode = 0 | 1 | 2; // đi bộ | xe máy | ô tô

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Review {
  author: string;
  rating: number;
  ago: string;
  text: string;
}

export interface CrowdBar {
  /** 0..1 — chiều cao cột */
  level: number;
  tone: 'quiet' | 'medium' | 'busy' | 'closed';
}

/** POI — khớp mô hình dữ liệu trong PRD §6.1 */
export interface Poi {
  id: string;
  name: string;
  category: CategoryName;
  lat: number;
  lng: number;
  openHours: string;
  stayDurationMin: number;
  description: string;
  /** Câu khuyên ngắn hiển thị trong danh sách lịch trình */
  hint: string;
  images: string[];
  audioGuide?: { url: string; durationLabel: string; sizeLabel: string; geofenceM: number };
  rating: number;
  reviewCount: number;
  reviews: Review[];
  /** Khối "nên đến lúc" ở màn chi tiết */
  bestTime?: { label: string; reason: string; bars: CrowdBar[]; note: string };
}

/** Chặng trong lịch trình — khớp PRD §6.1 itinerary_stop */
export interface ItineraryStop {
  orderIndex: number;
  poiId: string;
  /** Giờ dạng số thập phân: 8.75 = 08:45 */
  plannedTime: number;
  stayDurationMin: number;
  /** Quãng đường từ điểm này tới điểm kế tiếp (km); null nếu là điểm cuối ngày */
  travelKmToNext: number | null;
  reason: string;
}

export interface ItineraryDay {
  dayIndex: number;
  stops: ItineraryStop[];
}

export interface Itinerary {
  id: string;
  city: string;
  days: ItineraryDay[];
}

export interface City {
  name: string;
  ready: boolean;
  poiCountLabel: string;
  center: LatLng;
}

export interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  text: string;
}

/** Một chặng chỉ đường (Goong Directions step) */
export interface RouteStep {
  distanceLabel: string;
  instruction: string;
  isFinal?: boolean;
}
