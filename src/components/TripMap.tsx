import { Camera, GeoJSONSource, Layer, Map, Marker } from '@maplibre/maplibre-react-native';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Text } from './Text';
import { GOONG_STYLE_URL, hasMapKey } from '../services/goong';
import type { LatLng } from '../types';
import { colors } from '../theme/tokens';

export interface MapPoint extends LatLng {
  id: string;
  /** Điểm đang tới — marker vàng viền đen 3px, to hơn các điểm khác. */
  active?: boolean;
}

interface Props {
  points: MapPoint[];
  /** Toạ độ tuyến đường dạng [lng, lat]. Ít hơn 2 điểm thì không vẽ. */
  routeCoordinates?: [number, number][];
  userLocation?: LatLng | null;
  center: LatLng;
  zoom?: number;
  /** Stroke của tuyến: 5px ở màn Hôm nay, 7px ở màn Chỉ đường. */
  routeWidth?: number;
  style?: StyleProp<ViewStyle>;
  onPressPoint?: (id: string) => void;
}

/**
 * Bản đồ chuyến đi — MapLibre RN v11 với style vector của Goong.
 *
 * Nếu chưa cấu hình EXPO_PUBLIC_GOONG_MAPTILES_KEY thì hiện khung hướng dẫn
 * thay vì bản đồ trắng, để các màn còn lại vẫn xem được.
 */
export const TripMap: React.FC<Props> = ({
  points,
  routeCoordinates = [],
  userLocation,
  center,
  zoom = 12.4,
  routeWidth = 5,
  style,
  onPressPoint,
}) => {
  if (!hasMapKey) return <MissingKeyNotice style={style} />;

  const hasRoute = routeCoordinates.length > 1;

  return (
    <View style={[styles.fill, style]}>
      <Map style={styles.fill} mapStyle={GOONG_STYLE_URL} logo={false} attribution={false} compass={false}>
        <Camera center={[center.lng, center.lat]} zoom={zoom} duration={600} />

        {hasRoute && (
          <GeoJSONSource
            id="route"
            data={{
              type: 'Feature',
              properties: {},
              geometry: { type: 'LineString', coordinates: routeCoordinates },
            }}
          >
            <Layer
              id="route-line"
              type="line"
              style={{
                lineColor: colors.primary,
                lineWidth: routeWidth,
                lineJoin: 'round',
                lineCap: 'round',
              }}
            />
          </GeoJSONSource>
        )}

        {points.map((p) => (
          <Marker
            key={p.id}
            id={p.id}
            lngLat={[p.lng, p.lat]}
            onPress={onPressPoint ? () => onPressPoint(p.id) : undefined}
          >
            <View style={p.active ? styles.markerActive : styles.marker} />
          </Marker>
        ))}

        {userLocation && (
          <Marker id="user" lngLat={[userLocation.lng, userLocation.lat]}>
            <UserDot />
          </Marker>
        )}
      </Map>
    </View>
  );
};

/** Vị trí người dùng: chấm xanh rêu + vòng pulse (scale 1→2.6, opacity .55→0, 2.4s). */
const UserDot: React.FC = () => {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(pulse, {
        toValue: 1,
        duration: 2400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <View style={styles.userWrap}>
      <Animated.View
        style={[
          styles.pulseRing,
          {
            opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0] }),
            transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 2.6] }) }],
          },
        ]}
      />
      <View style={styles.userDot} />
    </View>
  );
};

const MissingKeyNotice: React.FC<{ style?: StyleProp<ViewStyle> }> = ({ style }) => (
  <View style={[styles.fill, styles.notice, style]}>
    <Text size={14} weight="semibold" color={colors.textSecondary} center>
      Chưa cấu hình bản đồ Goong
    </Text>
    <Text size={12.5} color={colors.textFainter} center lineHeight={1.5} style={styles.noticeBody}>
      Thêm EXPO_PUBLIC_GOONG_MAPTILES_KEY vào file .env rồi khởi động lại (xem .env.example).
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
  noticeBody: { maxWidth: 280 },
  marker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.white,
    borderWidth: 3,
    borderColor: colors.ink,
  },
  markerActive: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.accent,
    borderWidth: 3,
    borderColor: colors.ink,
  },
  userWrap: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  pulseRing: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: colors.positive,
  },
  userDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.positive,
    borderWidth: 3,
    borderColor: colors.white,
  },
});
