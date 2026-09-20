import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, IconButton } from '../components/Button';
import { CategoryLabel } from '../components/CategoryBits';
import { StatusChip } from '../components/Chip';
import { ImageSlot } from '../components/ImageSlot';
import { Display, Text } from '../components/Text';
import { TripMap, type MapPoint } from '../components/TripMap';
import { CITIES } from '../data/cities';
import { getPoi } from '../data/pois';
import { fetchRoute } from '../services/goong';
import { formatKm, travelMinutes } from '../services/travel';
import { useTrip } from '../state/TripContext';
import { colors, radius, shadows, sizes, spacing } from '../theme/tokens';

/**
 * Màn 3 — Hôm nay.
 * Bản đồ là nền toàn khung, một bảng trượt cho điểm kế tiếp.
 */
export const TodayScreen: React.FC<{
  onOpenPoi: (poiId: string) => void;
  onOpenDirections: (poiId: string) => void;
}> = ({ onOpenPoi, onOpenDirections }) => {
  const insets = useSafeAreaInsets();
  const { city, cityName, day, itinerary, mode, modeLabel, savedPoiIds, toggleSavedPoi } = useTrip();

  const stops = itinerary.days[day]?.stops ?? [];
  // Điểm đang tới — trong demo là điểm thứ 2 của ngày, khớp bản thiết kế ("điểm 2/8").
  const activeIndex = Math.min(1, stops.length - 1);
  const activeStop = stops[activeIndex];
  const activePoi = activeStop ? getPoi(activeStop.poiId) : null;
  const prevPoi = activeIndex > 0 ? getPoi(stops[activeIndex - 1].poiId) : null;

  const points = useMemo<MapPoint[]>(
    () =>
      stops.map((s, i) => {
        const poi = getPoi(s.poiId);
        return { id: poi.id, lat: poi.lat, lng: poi.lng, active: i === activeIndex };
      }),
    [stops, activeIndex],
  );

  /**
   * Tuyến của cả ngày: gọi Goong cho từng chặng rồi nối lại.
   * Chặng nào không lấy được (mất mạng / chưa có key) thì nối thẳng hai đầu,
   * nên tuyến luôn liền mạch qua đủ các điểm trong ngày.
   */
  const [routeCoords, setRouteCoords] = useState<[number, number][]>(() =>
    stops.map((s) => {
      const p = getPoi(s.poiId);
      return [p.lng, p.lat] as [number, number];
    }),
  );

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const legs = await Promise.all(
        stops.slice(0, -1).map(async (s, i) => {
          const from = getPoi(s.poiId);
          const to = getPoi(stops[i + 1].poiId);
          const route = await fetchRoute(from, to, mode);
          return (
            route?.coordinates ?? [
              [from.lng, from.lat] as [number, number],
              [to.lng, to.lat] as [number, number],
            ]
          );
        }),
      );
      if (cancelled) return;

      // Bỏ điểm đầu của mỗi chặng sau để không lặp toạ độ nối.
      const stitched = legs.flatMap((leg, i) => (i === 0 ? leg : leg.slice(1)));
      setRouteCoords(stitched);
    };

    void load();
    return () => { cancelled = true; };
  }, [stops, mode]);

  if (!activePoi || !activeStop) return null;

  const etaMinutes = prevPoi
    ? travelMinutes(stops[activeIndex - 1].travelKmToNext ?? 2.1, mode)
    : 8;
  const saved = savedPoiIds.includes(activePoi.id);

  return (
    <View style={styles.screen}>
      <TripMap
        points={points}
        routeCoordinates={routeCoords}
        userLocation={prevPoi}
        center={CITIES[city].center}
        onPressPoint={onOpenPoi}
        style={StyleSheet.absoluteFill}
      />

      {/* Thẻ hướng dẫn trên cùng */}
      <View style={[styles.topStack, { top: insets.top + 12 }]} pointerEvents="box-none">
        <View style={styles.guideCard}>
          <View style={styles.guideGlyph}>
            <Text size={16} weight="bold" color={colors.ink}>↑</Text>
          </View>
          <View style={styles.guideText}>
            <Display size={15} weight="bold" color={colors.onDark}>
              Đang tới {activePoi.name.split(' — ')[0]} · {etaMinutes} phút
            </Display>
            <Text size={12.5} color={colors.onDarkMuted} numberOfLines={1}>
              Rẽ phải vào Nguyễn Phúc Nguyên sau 400 m
            </Text>
          </View>
        </View>

        <View style={styles.chipRow}>
          <View style={[styles.floatChip, styles.floatChipDark]}>
            <Text size={12.5} weight="bold" color={colors.onDark}>
              {cityName} · {itinerary.days.length} ngày ▾
            </Text>
          </View>
          <View style={styles.floatChip}>
            <Text size={12.5} weight="bold">
              Ngày {day + 1} · điểm {activeIndex + 1}/{stops.length}
            </Text>
          </View>
          <View style={styles.floatChip}>
            <Text size={12.5} weight="bold">{modeLabel}</Text>
          </View>
        </View>
      </View>

      {/* Bảng trượt điểm kế tiếp */}
      <View style={styles.sheet}>
        <View style={styles.handle} />

        <Pressable style={styles.sheetHead} onPress={() => onOpenPoi(activePoi.id)}>
          <ImageSlot style={styles.sheetImage} borderRadius={radius.cardSmall} />
          <View style={styles.sheetHeadText}>
            <CategoryLabel category={activePoi.category} />
            <Display size={22} weight="extrabold" tracking={-0.02} lineHeight={1.15} style={styles.sheetTitle}>
              {activePoi.name}
            </Display>
            <Text size={13} color={colors.textSecondary}>
              {activePoi.openHours} · ở khoảng {Math.round(activePoi.stayDurationMin / 60)} tiếng
            </Text>
          </View>
        </Pressable>

        <Text size={14.5} lineHeight={1.55} color={colors.inkSoft} style={styles.sheetBody}>
          {activePoi.description}
        </Text>

        <View style={styles.statusRow}>
          <StatusChip label="Giờ này vắng" background={colors.positive} color={colors.white} />
          {activePoi.audioGuide && (
            <StatusChip
              label={`Audio ${activePoi.audioGuide.durationLabel.replace(' phút ', ':')}`}
              background={colors.warnSoft}
              color={colors.onWarn}
            />
          )}
          <StatusChip
            label={`${formatKm(activePoi.rating)} ★ · ${activePoi.reviewCount}`}
            background={colors.bgInput}
            color="#5A5148"
          />
        </View>

        <View style={styles.actions}>
          <Button
            label="Chỉ đường"
            height={sizes.buttonMedium}
            onPress={() => onOpenDirections(activePoi.id)}
            style={styles.actionMain}
          />
          <IconButton
            glyph={saved ? '♥' : '♡'}
            size={sizes.buttonMedium}
            onPress={() => toggleSavedPoi(activePoi.id)}
            accessibilityLabel={saved ? 'Bỏ lưu điểm' : 'Lưu điểm'}
          />
          <IconButton
            glyph="▶"
            size={sizes.buttonMedium}
            onPress={() => onOpenPoi(activePoi.id)}
            accessibilityLabel="Nghe audio guide"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bgCard },

  topStack: { position: 'absolute', left: 16, right: 16, gap: 10 },
  guideCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.ink,
    borderRadius: radius.card,
    paddingVertical: 14,
    paddingHorizontal: 16,
    ...shadows.darkBar,
  },
  guideGlyph: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: colors.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  guideText: { flex: 1, minWidth: 0 },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  floatChip: {
    paddingVertical: 8,
    paddingHorizontal: 13,
    borderRadius: radius.pill,
    backgroundColor: colors.bgCard,
    ...shadows.pillFloating,
  },
  floatChipDark: { backgroundColor: colors.ink },

  sheet: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    backgroundColor: colors.bgCard,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    paddingTop: 10,
    paddingHorizontal: spacing.screenX,
    paddingBottom: 20,
    ...shadows.sheet,
  },
  handle: {
    width: 46, height: 5, borderRadius: 3,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetHead: { flexDirection: 'row', gap: 14 },
  sheetImage: { width: 104, height: 104 },
  sheetHeadText: { flex: 1, minWidth: 0 },
  sheetTitle: { marginTop: 5, marginBottom: 6 },
  sheetBody: { marginTop: 14 },

  statusRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 16 },
  actionMain: { flex: 1 },
});
