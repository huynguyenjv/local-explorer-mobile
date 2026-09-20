import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, IconButton } from '../components/Button';
import { Display, Text } from '../components/Text';
import { TripMap } from '../components/TripMap';
import { SAMPLE_ROUTE_STEPS } from '../data/itinerary';
import { getPoi } from '../data/pois';
import { fetchRoute } from '../services/goong';
import { formatKm, travelMinutes } from '../services/travel';
import { useTrip } from '../state/TripContext';
import type { RouteStep } from '../types';
import { borderWidth, colors, radius, sizes, spacing } from '../theme/tokens';

/**
 * Màn 6 — Chỉ đường.
 * Một hướng dẫn to ở trên, các chặng còn lại nhỏ bên dưới.
 * Dữ liệu chặng lấy từ Goong Directions; mất mạng thì dùng bản mẫu đã tải.
 */
export const DirectionsScreen: React.FC<{
  /** Điểm đích. Điểm xuất phát lấy từ điểm trước đó trong ngày. */
  poiId: string;
  onBack: () => void;
}> = ({ poiId, onBack }) => {
  const insets = useSafeAreaInsets();
  const { itinerary, day, mode, modeLabel, cycleMode } = useTrip();

  const destination = getPoi(poiId);
  const stops = itinerary.days[day]?.stops ?? [];
  const destIndex = stops.findIndex((s) => s.poiId === poiId);
  const origin = destIndex > 0 ? getPoi(stops[destIndex - 1].poiId) : getPoi(stops[0].poiId);
  const legKm = destIndex > 0 ? (stops[destIndex - 1].travelKmToNext ?? 2.1) : 2.1;

  const [steps, setSteps] = useState<RouteStep[]>(SAMPLE_ROUTE_STEPS);
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([
    [origin.lng, origin.lat],
    [destination.lng, destination.lat],
  ]);
  const [distanceKm, setDistanceKm] = useState(legKm);
  const [minutes, setMinutes] = useState(travelMinutes(legKm, mode));

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const route = await fetchRoute(origin, destination, mode);
      if (cancelled) return;

      if (route) {
        setRouteCoords(route.coordinates);
        setDistanceKm(Number((route.distanceM / 1000).toFixed(1)));
        setMinutes(Math.max(3, Math.round(route.durationS / 60)));
        if (route.steps.length > 0) setSteps(route.steps);
      } else {
        // Không có mạng hoặc chưa cấu hình key: giữ bản mẫu, tính thời gian theo phương tiện.
        setRouteCoords([
          [origin.lng, origin.lat],
          [destination.lng, destination.lat],
        ]);
        setDistanceKm(legKm);
        setMinutes(travelMinutes(legKm, mode));
        setSteps(SAMPLE_ROUTE_STEPS);
      }
    };

    void load();
    return () => { cancelled = true; };
  }, [origin, destination, mode, legKm]);

  const current = steps[0];

  return (
    <View style={styles.screen}>
      <View style={styles.mapWrap}>
        <TripMap
          points={[
            { id: origin.id, lat: origin.lat, lng: origin.lng },
            { id: destination.id, lat: destination.lat, lng: destination.lng, active: true },
          ]}
          routeCoordinates={routeCoords}
          userLocation={origin}
          center={{
            lat: (origin.lat + destination.lat) / 2,
            lng: (origin.lng + destination.lng) / 2,
          }}
          zoom={13}
          routeWidth={7}
        />
        <IconButton
          glyph="←"
          size={42}
          bordered={false}
          onPress={onBack}
          accessibilityLabel="Quay lại"
          style={[styles.backBtn, { top: insets.top + 12 }]}
        />
      </View>

      {/* Panel trắng kéo lên đè bản đồ -26px */}
      <ScrollView
        style={styles.panel}
        contentContainerStyle={styles.panelContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.currentStep}>
          <Text size={42} color={colors.primary} style={styles.glyph}>↱</Text>
          <View style={styles.currentText}>
            <Display size={23} weight="extrabold" tracking={-0.02} lineHeight={1.15}>
              {current?.instruction ?? 'Đang tính tuyến…'}
            </Display>
            <Text size={13} color={colors.textSecondary} style={styles.remaining}>
              còn {current?.distanceLabel ?? '—'}
            </Text>
          </View>
        </View>

        <View style={styles.summaryBar}>
          <Display size={13.5} weight="extrabold">{formatKm(distanceKm)} km</Display>
          <Text size={13.5} color="#C9A986">·</Text>
          <Display size={13.5} weight="extrabold">{minutes} phút</Display>
          <Text size={13.5} color="#C9A986">·</Text>
          <Text size={13.5} color={colors.onWarn}>
            tới {destination.name.split(' — ')[0]} trước 8:45
          </Text>
          <View style={styles.spacer} />
          <View style={styles.readAloud}>
            <Text size={12.5} weight="bold" color={colors.accent}>Đọc to ✓</Text>
          </View>
        </View>

        <View>
          {steps.map((s, i) => (
            <View key={`${s.distanceLabel}-${i}`} style={styles.stepRow}>
              <Text
                size={12}
                weight="semibold"
                color={s.isFinal ? colors.textSecondary : colors.textFainter}
                style={styles.stepDistance}
              >
                {s.distanceLabel}
              </Text>
              <Text
                size={14.5}
                lineHeight={1.5}
                weight={s.isFinal ? 'bold' : 'regular'}
                color={s.isFinal ? colors.positive : colors.ink}
                style={styles.stepText}
              >
                {s.instruction}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Thanh cố định: bắt đầu dẫn đường + nút phương tiện */}
      <View style={[styles.cta, { paddingBottom: insets.bottom + 16 }]}>
        <Button label="Bắt đầu dẫn đường" variant="dark" style={styles.ctaMain} />
        <Pressable
          onPress={cycleMode}
          accessibilityRole="button"
          accessibilityLabel={`Phương tiện: ${modeLabel}, bấm để đổi`}
          style={({ pressed }) => [styles.modeBtn, pressed && styles.pressed]}
        >
          <Display size={14} weight="bold">{modeLabel}</Display>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bgCard },
  mapWrap: { height: 320 },
  backBtn: {
    position: 'absolute',
    left: 16,
    borderRadius: radius.small,
    shadowColor: colors.ink,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  panel: {
    flex: 1,
    marginTop: -26,
    backgroundColor: colors.bgCard,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
  },
  panelContent: { padding: spacing.screenXWide, paddingBottom: 110 },

  currentStep: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  glyph: { lineHeight: 46 },
  currentText: { flex: 1, minWidth: 0 },
  remaining: { marginTop: 4 },

  summaryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 18,
    paddingVertical: 13,
    paddingHorizontal: 15,
    backgroundColor: colors.warnSoft,
    borderRadius: radius.cardSmall,
  },
  spacer: { flex: 1 },
  readAloud: {
    backgroundColor: colors.ink,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
  },

  stepRow: {
    flexDirection: 'row',
    gap: 14,
    paddingVertical: 13,
    borderTopWidth: borderWidth.hairline,
    borderTopColor: colors.line,
  },
  stepDistance: { width: 54, paddingTop: 2 },
  stepText: { flex: 1 },

  cta: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    flexDirection: 'row',
    gap: 10,
    paddingTop: 16,
    paddingHorizontal: spacing.screenX,
    backgroundColor: colors.bgCard,
    borderTopWidth: borderWidth.hairline,
    borderTopColor: colors.line,
  },
  ctaMain: { flex: 1 },
  modeBtn: {
    width: 104,
    height: sizes.ctaSecondary,
    borderRadius: radius.button,
    borderWidth: borderWidth.accent,
    borderColor: colors.ink,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.8 },
});
