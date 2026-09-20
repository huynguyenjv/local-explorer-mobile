import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, IconButton } from '../components/Button';
import { CategoryLabel } from '../components/CategoryBits';
import { ImageSlot } from '../components/ImageSlot';
import { Display, Text } from '../components/Text';
import { getPoi } from '../data/pois';
import { formatKm } from '../services/travel';
import { useTrip } from '../state/TripContext';
import type { CrowdBar, Review } from '../types';
import { borderWidth, colors, crowdColors, radius, sizes, spacing } from '../theme/tokens';

/**
 * Màn 5 — Chi tiết điểm.
 * Dự báo đông người kể thành một câu kèm biểu đồ giờ, không phải bảng số.
 */
export const PoiDetailScreen: React.FC<{
  poiId: string;
  /** Khoảng cách tới điểm, hiển thị cạnh nhãn loại. */
  distanceKm?: number;
  onBack: () => void;
  onAddToItinerary: () => void;
}> = ({ poiId, distanceKm = 2.1, onBack, onAddToItinerary }) => {
  const insets = useSafeAreaInsets();
  const { savedPoiIds, toggleSavedPoi } = useTrip();
  const poi = getPoi(poiId);
  const saved = savedPoiIds.includes(poi.id);
  const [autoPlay, setAutoPlay] = useState(true);

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Ảnh hero full-bleed 300px + 3 nút nổi */}
        <View style={styles.hero}>
          <ImageSlot uri={poi.images[0]} label="Ảnh" style={StyleSheet.absoluteFill} />
          <IconButton
            glyph="←"
            size={42}
            bordered={false}
            onPress={onBack}
            accessibilityLabel="Quay lại"
            style={[styles.heroBtn, { left: 16, top: insets.top + 12 }]}
          />
          <View style={[styles.heroActions, { top: insets.top + 12 }]}>
            <IconButton
              glyph={saved ? '♥' : '♡'}
              size={42}
              bordered={false}
              onPress={() => toggleSavedPoi(poi.id)}
              accessibilityLabel={saved ? 'Bỏ lưu điểm' : 'Lưu điểm'}
              style={styles.heroBtn}
            />
            <IconButton
              glyph="↗"
              size={42}
              bordered={false}
              accessibilityLabel="Chia sẻ"
              style={styles.heroBtn}
            />
          </View>
        </View>

        <View style={styles.body}>
          <CategoryLabel category={poi.category} suffix={`${formatKm(distanceKm)} km`} />
          <Display size={29} weight="extrabold" tracking={-0.03} lineHeight={1.1} style={styles.title}>
            {poi.name}
          </Display>
          <Text size={14.5} lineHeight={1.6} color={colors.inkSoft} style={styles.desc}>
            {poi.description}
          </Text>

          {poi.bestTime && <BestTimeBlock {...poi.bestTime} />}

          {poi.audioGuide && (
            <>
              <View style={styles.audio}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Phát audio guide, ${poi.audioGuide.durationLabel}`}
                  style={({ pressed }) => [styles.play, pressed && styles.pressed]}
                >
                  <Text size={15} color={colors.white}>▶</Text>
                </Pressable>
                <View style={styles.audioText}>
                  <Display size={14.5} weight="bold">
                    Audio guide · {poi.audioGuide.durationLabel}
                  </Display>
                  <Text size={12.5} color={colors.textSecondary}>
                    {poi.audioGuide.sizeLabel} · dùng được khi mất mạng
                  </Text>
                </View>
              </View>

              <View style={styles.toggleRow}>
                <Text size={13} color={colors.inkMuted} style={styles.toggleLabel}>
                  Tự phát khi tới cổng
                </Text>
                <Switch
                  value={autoPlay}
                  onValueChange={setAutoPlay}
                  trackColor={{ false: colors.border, true: colors.positive }}
                  thumbColor={colors.white}
                  ios_backgroundColor={colors.border}
                />
              </View>
            </>
          )}

          <View style={styles.reviewHead}>
            <Display size={18} weight="extrabold" tracking={-0.02}>Người đi trước nói</Display>
            <Text size={12.5} color={colors.textSecondary}>
              {formatKm(poi.rating)} ★ · {poi.reviewCount} đánh giá
            </Text>
          </View>
          <View style={styles.reviews}>
            {poi.reviews.map((r) => (
              <ReviewRow key={r.author} review={r} />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Thanh CTA cố định */}
      <View style={[styles.cta, { paddingBottom: insets.bottom + 16 }]}>
        <Button label="Thêm vào lịch trình" onPress={onAddToItinerary} style={styles.ctaMain} />
        <IconButton glyph="↗" size={sizes.ctaSecondary} accessibilityLabel="Chia sẻ điểm" />
      </View>
    </View>
  );
};

/** Khối "nên đến lúc" — câu khuyên + biểu đồ 10 cột giờ. */
const BestTimeBlock: React.FC<{
  label: string;
  reason: string;
  bars: CrowdBar[];
  note: string;
}> = ({ label, reason, bars, note }) => (
  <View style={styles.bestTime}>
    <Display size={12.5} weight="extrabold" tracking={0.08} color={colors.onWarn}>
      {label}
    </Display>
    <Text size={14} lineHeight={1.55} color={colors.inkSoft} style={styles.bestReason}>
      {reason}
    </Text>

    <View style={styles.chart} accessibilityLabel="Biểu đồ mức đông người theo giờ">
      {bars.map((b, i) => (
        <View
          key={i}
          style={[
            styles.bar,
            { height: `${b.level * 100}%`, backgroundColor: crowdColors[b.tone] },
          ]}
        />
      ))}
    </View>

    <View style={styles.chartLegend}>
      <Text size={11.5} color={colors.onWarnFaint}>7h</Text>
      <Text size={11.5} weight="bold" color={colors.positive}>{note}</Text>
      <Text size={11.5} color={colors.onWarnFaint}>17h</Text>
    </View>
  </View>
);

const ReviewRow: React.FC<{ review: Review }> = ({ review }) => (
  <View>
    <Text size={13} weight="bold">
      {review.author}{' '}
      <Text size={13} color={crowdColors.medium}>{'★'.repeat(review.rating)}</Text>
      <Text size={13} color={colors.border}>{'★'.repeat(5 - review.rating)}</Text>
      {'  '}
      <Text size={13} color={colors.textFainter}>{review.ago}</Text>
    </Text>
    <Text size={13.5} lineHeight={1.5} color={colors.inkSoft} style={styles.reviewText}>
      {review.text}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bgCard },
  scroll: { flex: 1 },
  content: { paddingBottom: 110 },

  hero: { height: 300 },
  heroBtn: {
    position: 'absolute',
    borderRadius: radius.small,
    shadowColor: colors.ink,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  heroActions: { position: 'absolute', right: 16, flexDirection: 'row', gap: 8 },

  body: { paddingHorizontal: spacing.screenXWide, paddingTop: 20 },
  title: { marginTop: 8 },
  desc: { marginTop: 12 },

  bestTime: {
    marginTop: 18,
    borderRadius: radius.card,
    backgroundColor: colors.warnSoft,
    padding: 16,
  },
  bestReason: { marginTop: 8 },
  chart: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: 46, marginTop: 14 },
  bar: { flex: 1, borderRadius: 3 },
  chartLegend: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 7 },

  audio: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    borderWidth: borderWidth.accent,
    borderColor: colors.ink,
    borderRadius: radius.card,
    paddingVertical: 13,
    paddingHorizontal: 15,
  },
  play: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.positive,
    alignItems: 'center', justifyContent: 'center',
  },
  audioText: { flex: 1, minWidth: 0 },

  toggleRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 4,
  },
  toggleLabel: { flex: 1 },

  reviewHead: { marginTop: 22, flexDirection: 'row', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' },
  reviews: { marginTop: 10, gap: 13 },
  reviewText: { marginTop: 4 },

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
  pressed: { opacity: 0.8 },
});
