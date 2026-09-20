import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { CategoryLabel, CategorySwatch } from '../components/CategoryBits';
import { Chip } from '../components/Chip';
import { ScreenHeader } from '../components/ScreenHeader';
import { Display, Text } from '../components/Text';
import { getPoi } from '../data/pois';
import { totalStops } from '../data/itinerary';
import { endOfDay, formatHour, travelLabel } from '../services/travel';
import { useTrip } from '../state/TripContext';
import type { ItineraryStop } from '../types';
import { borderWidth, colors, radius, shadows, sizes, spacing } from '../theme/tokens';

/**
 * Màn 4 — Lịch trình.
 * Bấm nút phương tiện thì thời gian mọi chặng trong ngày được tính lại.
 * Chế độ Sửa hiện hàng hành động trên mỗi thẻ và đổi nội dung thanh tổng kết.
 */
export const ItineraryScreen: React.FC<{
  onOpenPoi: (poiId: string) => void;
  onAskAssistant: () => void;
}> = ({ onOpenPoi, onAskAssistant }) => {
  const {
    cityName, itinerary, day, setDay, mode, modeLabel, cycleMode, editing, toggleEditing,
  } = useTrip();

  const stops = itinerary.days[day]?.stops ?? [];
  const last = stops[stops.length - 1];

  return (
    <View style={styles.screen}>
      <ScreenHeader>
        <View style={styles.titleRow}>
          <Display size={26} weight="extrabold" tracking={-0.025}>
            Lịch trình {cityName}
          </Display>
          <Text size={13} weight="semibold" color={colors.textSecondary}>
            {itinerary.days.length} ngày · {totalStops(itinerary)} điểm
          </Text>
        </View>

        <View style={styles.controls}>
          {itinerary.days.map((d) => (
            <Chip
              key={d.dayIndex}
              label={`Ngày ${d.dayIndex + 1}`}
              selected={day === d.dayIndex}
              onPress={() => setDay(d.dayIndex)}
            />
          ))}
          <View style={styles.spacer} />
          <Pressable
            onPress={cycleMode}
            accessibilityRole="button"
            accessibilityLabel={`Phương tiện: ${modeLabel}, bấm để đổi`}
            style={({ pressed }) => [styles.modeBtn, pressed && styles.pressed]}
          >
            <Display size={13} weight="bold">{modeLabel}</Display>
          </Pressable>
          <Pressable
            onPress={toggleEditing}
            accessibilityRole="button"
            accessibilityState={{ selected: editing }}
            style={({ pressed }) => [
              styles.editBtn,
              editing ? styles.editBtnOn : styles.editBtnOff,
              pressed && styles.pressed,
            ]}
          >
            <Display size={13} weight="bold" color={editing ? colors.onDark : colors.ink}>
              {editing ? 'Xong' : 'Sửa'}
            </Display>
          </Pressable>
        </View>
      </ScreenHeader>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {stops.map((stop) => (
          <StopRow key={stop.poiId} stop={stop} editing={editing} onPress={() => onOpenPoi(stop.poiId)} />
        ))}
      </ScrollView>

      {/* Thanh tổng kết nổi — cách đáy 96px để không đè thanh tab */}
      <View style={styles.summary}>
        <View style={styles.summaryText}>
          <Display size={15} weight="bold" color={colors.onDark}>
            {editing ? `Đang sửa ngày ${day + 1}` : `${stops.length} điểm · Ngày ${day + 1}`}
          </Display>
          <Text size={12.5} color={colors.onDarkMuted}>
            {editing
              ? 'Kéo thẻ để đổi thứ tự · thay đổi lưu ngay'
              : last
                ? `Kết thúc khoảng ${endOfDay(last.plannedTime, last.stayDurationMin)}`
                : ''}
          </Text>
        </View>
        <Pressable
          onPress={onAskAssistant}
          accessibilityRole="button"
          style={({ pressed }) => [styles.askChip, pressed && styles.pressed]}
        >
          <Text size={12.5} weight="bold" color={colors.ink}>Nhờ trợ lý</Text>
        </Pressable>
      </View>
    </View>
  );
};

/** Một điểm trong ngày: cột giờ bên trái + thẻ điểm + dòng nối chặng. */
const StopRow: React.FC<{
  stop: ItineraryStop;
  editing: boolean;
  onPress: () => void;
}> = ({ stop, editing, onPress }) => {
  const { mode } = useTrip();
  const poi = getPoi(stop.poiId);

  return (
    <View style={styles.stopRow}>
      <View style={styles.timeCol}>
        <Display size={15} weight="extrabold">{formatHour(stop.plannedTime)}</Display>
        <Text size={11} color={colors.textFainter}>{stop.stayDurationMin} phút</Text>
      </View>

      <View style={styles.stopBody}>
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          style={({ pressed }) => [styles.card, pressed && styles.pressed]}
        >
          <CategorySwatch name={poi.name} category={poi.category} />
          <View style={styles.cardText}>
            <CategoryLabel category={poi.category} size={11} muted />
            <Display size={17} weight="bold" tracking={-0.015} lineHeight={1.22} style={styles.cardTitle}>
              {poi.name}
            </Display>
            <Text size={12.5} color={colors.textSecondary} style={styles.cardHint}>
              {stop.reason}
            </Text>

            {editing && (
              <View style={styles.editRow}>
                <EditAction label="Đổi giờ" />
                <EditAction label="Chèn điểm" />
                <EditAction label="Bỏ" destructive />
              </View>
            )}
          </View>
        </Pressable>

        {/* Nối chặng: vạch dọc + thời gian tính theo phương tiện đang chọn */}
        <View style={styles.travelRow}>
          <View style={styles.travelTick} />
          <Text size={12} weight="medium" color={colors.textFainter}>
            {travelLabel(stop.travelKmToNext, mode)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const EditAction: React.FC<{ label: string; destructive?: boolean }> = ({ label, destructive }) => (
  <Pressable
    accessibilityRole="button"
    style={({ pressed }) => [
      styles.editAction,
      destructive ? styles.editActionDanger : styles.editActionNeutral,
      pressed && styles.pressed,
    ]}
  >
    <Text size={12.5} weight="bold" color={destructive ? colors.primary : colors.ink}>
      {label}
    </Text>
  </Pressable>
);

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bgScreen },

  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 10 },
  controls: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  spacer: { flex: 1 },
  modeBtn: {
    height: sizes.chip,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    borderWidth: borderWidth.accent,
    borderColor: colors.ink,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtn: {
    height: sizes.chip,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    borderWidth: borderWidth.accent,
    borderColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtnOn: { backgroundColor: colors.ink },
  editBtnOff: { backgroundColor: colors.white },

  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.screenX, paddingTop: 16, paddingBottom: 190 },

  stopRow: { flexDirection: 'row', gap: 12 },
  timeCol: { width: 48, alignItems: 'flex-end', paddingTop: 15 },
  stopBody: { flex: 1, minWidth: 0 },

  card: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.bgCard,
    borderRadius: radius.card,
    padding: 14,
    ...shadows.card,
  },
  cardText: { flex: 1, minWidth: 0 },
  cardTitle: { marginTop: 3 },
  cardHint: { marginTop: 4 },

  editRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingTop: 10, paddingBottom: 2 },
  editAction: {
    paddingVertical: 6,
    paddingHorizontal: 11,
    borderRadius: radius.pill,
    borderWidth: borderWidth.accent,
  },
  editActionNeutral: { borderColor: colors.border },
  editActionDanger: { borderColor: colors.primarySoft },

  travelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingVertical: 9,
    paddingLeft: 14,
    paddingRight: 4,
  },
  travelTick: { width: 2, height: 18, backgroundColor: colors.border },

  summary: {
    position: 'absolute',
    left: spacing.screenX,
    right: spacing.screenX,
    bottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.ink,
    borderRadius: radius.card,
    paddingVertical: 14,
    paddingHorizontal: 16,
    ...shadows.darkBar,
  },
  summaryText: { flex: 1, minWidth: 0 },
  askChip: {
    backgroundColor: colors.accent,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
  },
  pressed: { opacity: 0.8 },
});
