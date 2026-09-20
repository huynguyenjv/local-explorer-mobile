import type { LatLng, RouteStep, TravelMode } from '../types';

/**
 * Tích hợp Goong Maps.
 *
 * Hai key khác nhau, lấy ở https://account.goong.io:
 *  - MAPTILES key  → dùng cho style bản đồ vector (MapLibre)
 *  - API key       → dùng cho Directions / Geocoding REST API
 *
 * Đặt trong file `.env` ở gốc dự án (xem `.env.example`), Expo đọc biến có
 * tiền tố EXPO_PUBLIC_ và inline vào bundle lúc build.
 *
 * Lưu ý bảo mật (PRD §4): trong bản production, Directions nên gọi qua backend
 * để không lộ API key trong bundle. Ở đây gọi thẳng cho tiện demo hackathon.
 */

export const GOONG_MAPTILES_KEY = process.env.EXPO_PUBLIC_GOONG_MAPTILES_KEY ?? '';
export const GOONG_API_KEY = process.env.EXPO_PUBLIC_GOONG_API_KEY ?? '';

export const hasMapKey = GOONG_MAPTILES_KEY.length > 0;
export const hasApiKey = GOONG_API_KEY.length > 0;

/** Style JSON tương thích MapLibre do Goong phục vụ. */
export const GOONG_STYLE_URL = `https://tiles.goong.io/assets/goong_map_web.json?api_key=${GOONG_MAPTILES_KEY}`;

/** Tên phương tiện theo cách Goong Directions gọi. */
const GOONG_VEHICLE: Record<TravelMode, string> = {
  0: 'bike', // Goong không có "foot" riêng; bike là gần nhất cho đường nhỏ
  1: 'bike',
  2: 'car',
};

export interface RouteResult {
  /** Toạ độ tuyến đường theo thứ tự [lng, lat] — định dạng GeoJSON. */
  coordinates: [number, number][];
  distanceM: number;
  durationS: number;
  steps: RouteStep[];
}

/** Giải mã polyline của Goong/Google (precision 5). */
export const decodePolyline = (encoded: string): [number, number][] => {
  const points: [number, number][] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let result = 0;
    let shift = 0;
    let byte: number;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    lat += result & 1 ? ~(result >> 1) : result >> 1;

    result = 0;
    shift = 0;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    lng += result & 1 ? ~(result >> 1) : result >> 1;

    points.push([lng / 1e5, lat / 1e5]);
  }
  return points;
};

const metersLabel = (m: number): string =>
  m >= 1000 ? `${String((m / 1000).toFixed(1)).replace('.', ',')} km` : `${Math.round(m)} m`;

/** Bỏ thẻ HTML trong `html_instructions` của Goong. */
const stripHtml = (html: string): string => html.replace(/<[^>]*>/g, '').trim();

/**
 * Gọi Goong Directions API cho tuyến A→B.
 * Trả về null nếu chưa có API key hoặc request lỗi — màn hình sẽ dùng
 * đường thẳng nối hai điểm làm fallback, demo vẫn chạy được khi mất mạng.
 */
export const fetchRoute = async (
  origin: LatLng,
  destination: LatLng,
  mode: TravelMode,
): Promise<RouteResult | null> => {
  if (!hasApiKey) return null;

  const url =
    `https://rsapi.goong.io/Direction?origin=${origin.lat},${origin.lng}` +
    `&destination=${destination.lat},${destination.lng}` +
    `&vehicle=${GOONG_VEHICLE[mode]}&api_key=${GOONG_API_KEY}`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    const route = json?.routes?.[0];
    const leg = route?.legs?.[0];
    if (!route?.overview_polyline?.points || !leg) return null;

    const rawSteps = Array.isArray(leg.steps) ? leg.steps : [];
    const steps: RouteStep[] = rawSteps.map((s: any, i: number) => ({
      distanceLabel: s?.distance?.text ?? metersLabel(s?.distance?.value ?? 0),
      instruction: stripHtml(s?.html_instructions ?? ''),
      isFinal: i === rawSteps.length - 1,
    }));

    return {
      coordinates: decodePolyline(route.overview_polyline.points),
      distanceM: leg.distance?.value ?? 0,
      durationS: leg.duration?.value ?? 0,
      steps,
    };
  } catch {
    return null;
  }
};
