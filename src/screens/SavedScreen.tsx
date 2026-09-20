import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Button, IconButton } from '../components/Button';
import { CategorySwatch } from '../components/CategoryBits';
import { ImageSlot } from '../components/ImageSlot';
import { ScreenHeader } from '../components/ScreenHeader';
import { Display, SectionLabel, Text } from '../components/Text';
import { DRAFT_TRIPS, SHARE_LINK, totalStops } from '../data/itinerary';
import { getPoi, SAVED_POI_IDS } from '../data/pois';
import { formatKm } from '../services/travel';
import { useTrip } from '../state/TripContext';
import { borderWidth, colors, radius, shadows, sizes, spacing } from '../theme/tokens';

/**
 * Màn 7 — Đã lưu & chia sẻ.
 * Ba trạng thái rõ ràng: đang đi, nháp, đã xong. Link mở được trên web.
 */
export const SavedScreen: React.FC<{
  onNewTrip: () => void;
  onOpenTrip: () => void;
  onOpenPoi: (poiId: string) => void;
}> = ({ onNewTrip, onOpenTrip, onOpenPoi }) => {
  const { cityName, itinerary, day, lenLabel, modeLabel, savedPoiIds } = useTrip();
  const [tab, setTab] = useState<'trips' | 'pois'>('trips');

  // Điểm lẻ = điểm mẫu trong bản thiết kế + điểm người dùng tự lưu, không trùng nhau.
  const loosePoiIds = [...new Set([...SAVED_POI_IDS, ...savedPoiIds])];

  return (
    <View style={styles.screen}>
      <ScreenHeader>
        <View style={styles.titleRow}>
          <Display size={26} weight="extrabold" tracking={-0.025} style={styles.title}>
            Đã lưu
          </Display>
          <Pressable
            onPress={onNewTrip}
            accessibilityRole="button"
            style={({ pressed }) => [styles.newTrip, pressed && styles.pressed]}
          >
            <Display size={13} weight="bold" color={colors.white}>+ Chuyến mới</Display>
          </Pressable>
        </View>

        <View style={styles.tabs}>
          <FilterTab
            label={`Lịch trình ${1 + DRAFT_TRIPS.length}`}
            active={tab === 'trips'}
            onPress={() => setTab('trips')}
          />
          <FilterTab
            label={`Điểm lẻ ${loosePoiIds.length}`}
            active={tab === 'pois'}
            onPress={() => setTab('pois')}
          />
        </View>
      </ScreenHeader>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Thẻ chuyến đang đi */}
        <View style={styles.tripCard}>
          <View style={styles.tripImages}>
            <ImageSlot label=" " style={styles.tripImage} />
            <ImageSlot label=" " style={styles.tripImage} />
          </View>
          <View style={styles.tripBody}>
            <View style={styles.tripTitleRow}>
              <Display size={20} weight="extrabold" tracking={-0.02}>
                {cityName} · {lenLabel}
              </Display>
              <View style={styles.badgeLive}>
                <Text size={12} weight="bold" color={colors.white}>
                  Đang đi · ngày {day + 1}/{itinerary.days.length}
                </Text>
              </View>
            </View>
            <Text size={13} color={colors.textSecondary} style={styles.tripMeta}>
              {totalStops(itinerary)} điểm · làng nghề & ẩm thực · {modeLabel.toLowerCase()}
            </Text>
            <View style={styles.tripActions}>
              <Button label="Mở" height={sizes.buttonTiny} fontSize={14} onPress={onOpenTrip} style={styles.flex} />
              <Button label="Chia sẻ" variant="outline" height={sizes.buttonTiny} fontSize={14} style={styles.flex} />
              <IconButton
                glyph="⋯"
                size={sizes.buttonTiny}
                bordered={false}
                accessibilityLabel="Thêm tuỳ chọn"
                style={styles.moreBtn}
              />
            </View>
          </View>
        </View>

        {/* Hàng chuyến nháp */}
        {DRAFT_TRIPS.map((d) => (
          <Pressable
            key={d.id}
            accessibilityRole="button"
            style={({ pressed }) => [styles.draftRow, pressed && styles.pressed]}
          >
            <View style={styles.badgeDraft}>
              <Text size={12} weight="bold" color={colors.onWarn}>Nháp</Text>
            </View>
            <View style={styles.flexMin}>
              <Display size={15.5} weight="bold">{d.title}</Display>
              <Text size={12.5} color={colors.textSecondary}>{d.meta}</Text>
            </View>
            <Text size={12.5} weight="bold" color={colors.primary}>Tiếp tục</Text>
          </Pressable>
        ))}

        {/* Khối chia sẻ */}
        <View style={styles.shareCard}>
          <Display size={17} weight="extrabold" tracking={-0.015} color={colors.onDark}>
            Gửi cho bạn đi cùng
          </Display>
          <Text size={13} color={colors.onDarkMuted} style={styles.shareSub}>
            Người nhận mở được lịch trình trên web, không cần cài gì.
          </Text>
          <View style={styles.linkBox}>
            <Text size={13} color="#E8E0D4" numberOfLines={1} style={styles.flexMin}>
              {SHARE_LINK}
            </Text>
            <Pressable accessibilityRole="button" hitSlop={8}>
              <Text size={12.5} weight="bold" color={colors.accent}>Sao chép</Text>
            </Pressable>
          </View>
          <View style={styles.shareChips}>
            <View style={styles.shareChipAccent}>
              <Text size={13} weight="bold" color={colors.ink}>Zalo</Text>
            </View>
            <View style={styles.shareChip}>
              <Text size={13} weight="semibold" color={colors.onDark}>Messenger</Text>
            </View>
            <View style={styles.shareChip}>
              <Text size={13} weight="semibold" color={colors.onDark}>Mã QR</Text>
            </View>
          </View>
        </View>

        {/* Điểm lưu riêng */}
        <View>
          <SectionLabel style={styles.looseLabel}>Điểm lưu riêng</SectionLabel>
          <View style={styles.looseList}>
            {loosePoiIds.map((id) => {
              const poi = getPoi(id);
              return (
                <Pressable
                  key={id}
                  onPress={() => onOpenPoi(id)}
                  accessibilityRole="button"
                  style={({ pressed }) => [styles.looseRow, pressed && styles.pressed]}
                >
                  <CategorySwatch name={poi.name} category={poi.category} size={52} />
                  <View style={styles.flexMin}>
                    <Display size={15.5} weight="bold" numberOfLines={1}>{poi.name}</Display>
                    <Text size={12.5} color={colors.textSecondary} numberOfLines={1}>
                      {poi.category} · {formatKm(poi.rating)} ★ · {poi.openHours.toLowerCase()}
                    </Text>
                  </View>
                  <Text size={12.5} weight="bold" color={colors.primary}>Thêm</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const FilterTab: React.FC<{ label: string; active: boolean; onPress: () => void }> = ({
  label, active, onPress,
}) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityState={{ selected: active }}
    style={({ pressed }) => [
      styles.filterTab,
      active ? styles.filterOn : styles.filterOff,
      pressed && styles.pressed,
    ]}
  >
    <Text size={13} weight={active ? 'bold' : 'semibold'} color={active ? colors.onDark : colors.ink}>
      {label}
    </Text>
  </Pressable>
);

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bgScreen },
  flex: { flex: 1 },
  flexMin: { flex: 1, minWidth: 0 },

  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  title: { flex: 1 },
  newTrip: {
    backgroundColor: colors.primary,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
  },

  tabs: { flexDirection: 'row', gap: 8, marginTop: 14 },
  filterTab: {
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: radius.pill,
    borderWidth: borderWidth.accent,
  },
  filterOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  filterOff: { backgroundColor: colors.white, borderColor: colors.border },

  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.screenX, paddingTop: 18, paddingBottom: 24, gap: 16 },

  tripCard: { backgroundColor: colors.bgCard, borderRadius: radius.cardLarge, ...shadows.card },
  tripImages: {
    flexDirection: 'row',
    gap: 3,
    height: 108,
    overflow: 'hidden',
    borderTopLeftRadius: radius.cardLarge,
    borderTopRightRadius: radius.cardLarge,
  },
  tripImage: { flex: 1, height: 108 },
  tripBody: { padding: 16 },
  tripTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 10,
  },
  badgeLive: {
    backgroundColor: colors.positive,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
  },
  tripMeta: { marginTop: 6 },
  tripActions: { flexDirection: 'row', gap: 8, marginTop: 14 },
  moreBtn: { borderWidth: borderWidth.accent, borderColor: colors.border },

  draftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.bgCard,
    borderRadius: radius.cardSmall,
    paddingVertical: 13,
    paddingHorizontal: 15,
  },
  badgeDraft: {
    backgroundColor: colors.warnSoft,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
  },

  shareCard: { backgroundColor: colors.ink, borderRadius: radius.cardLarge, padding: 18 },
  shareSub: { marginTop: 6 },
  linkBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
    backgroundColor: colors.bgDarkElevated,
    borderRadius: radius.small,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  shareChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  shareChipAccent: {
    backgroundColor: colors.accent,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
  },
  shareChip: {
    borderWidth: borderWidth.accent,
    borderColor: colors.borderOnDark,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
  },

  looseLabel: { marginBottom: 10 },
  looseList: { gap: 10 },
  looseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.bgCard,
    borderRadius: radius.cardSmall,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  pressed: { opacity: 0.8 },
});
