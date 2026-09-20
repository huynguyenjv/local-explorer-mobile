import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Text } from './Text';
import type { LatLng } from '../types';
import { colors } from '../theme/tokens';

/**
 * Bản web của TripMap.
 *
 * MapLibre RN là native module (Android/iOS), không chạy trong trình duyệt.
 * Metro tự chọn file `.web.tsx` này khi build web, nên bản xem trước không vỡ —
 * hai màn có bản đồ hiện khung giải thích thay vì map.
 *
 * Giữ nguyên props của bản native để hai bên thay thế được cho nhau.
 */

export interface MapPoint extends LatLng {
  id: string;
  active?: boolean;
}

interface Props {
  points: MapPoint[];
  routeCoordinates?: [number, number][];
  userLocation?: LatLng | null;
  center: LatLng;
  zoom?: number;
  routeWidth?: number;
  style?: StyleProp<ViewStyle>;
  onPressPoint?: (id: string) => void;
}

export const TripMap: React.FC<Props> = ({ points, style }) => (
  <View style={[styles.fill, styles.notice, style]}>
    <Text size={14} weight="semibold" color={colors.textSecondary} center>
      Bản đồ chỉ chạy trên Android / iOS
    </Text>
    <Text size={12.5} color={colors.textFainter} center lineHeight={1.5} style={styles.body}>
      MapLibre là native module nên không render được trong trình duyệt.
      Bản xem trước web dùng để duyệt giao diện; chạy `npx expo run:android`
      để thấy bản đồ thật.
    </Text>
    <Text size={12} color={colors.textFainter} center style={styles.count}>
      {points.length} điểm trong ngày
    </Text>
  </View>
);

const styles = StyleSheet.create({
  fill: { flex: 1 },
  notice: {
    backgroundColor: '#E4EBDC',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 6,
  },
  body: { maxWidth: 300 },
  count: { marginTop: 4 },
});
