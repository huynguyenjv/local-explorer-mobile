import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { CategorySwatch } from '../components/CategoryBits';
import { ScreenHeader } from '../components/ScreenHeader';
import { Display, Text } from '../components/Text';
import { getPoi } from '../data/pois';
import { borderWidth, colors, radius, spacing } from '../theme/tokens';

/**
 * Màn 8 — Trạng thái ngoài đường.
 * Mất mạng, GPS lệch, điểm đóng cửa, trợ lý chậm — mỗi trạng thái có đường đi tiếp.
 *
 * Ở bản production, mỗi khối sẽ được kích hoạt bởi điều kiện thật
 * (NetInfo, độ chính xác GPS, open_hours, timeout gọi LLM) và hiện lên
 * như một lớp phủ trên màn tương ứng, không nằm chung một trang.
 * Trang này gom lại để kiểm tra giao diện của cả bốn.
 */
export const FieldStatesScreen: React.FC = () => (
  <View style={styles.screen}>
    <ScreenHeader>
      <Display size={26} weight="extrabold" tracking={-0.025}>
        Khi ngoài đường không như kế hoạch
      </Display>
      <Text size={13} color={colors.textSecondary} style={styles.sub}>
        Bốn trạng thái thường gặp — thiết kế sẵn, không để trống.
      </Text>
    </ScreenHeader>

    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Mất mạng — nền đen */}
      <View style={[styles.card, styles.cardDark]}>
        <Display size={12} weight="extrabold" tracking={0.08} color={colors.accent}>
          MẤT MẠNG
        </Display>
        <Display size={17} weight="bold" color={colors.onDark} style={styles.cardTitle}>
          Vẫn xem được cả lịch trình
        </Display>
        <Text size={13.5} lineHeight={1.5} color={colors.onDarkMuted} style={styles.cardBody}>
          Bản đồ, chỉ đường và audio của 2 ngày đã tải sẵn 18 MB. Chỉ đánh giá và ảnh mới cần mạng.
        </Text>
        <View style={styles.actions}>
          <ActionChip label="Dùng bản đã tải" tone="accent" />
          <ActionChip label="Thử lại" tone="onDark" />
        </View>
      </View>

      {/* Vị trí lệch */}
      <View style={[styles.card, styles.cardWarn]}>
        <Display size={12} weight="extrabold" tracking={0.08} color={colors.onWarn}>
          VỊ TRÍ LỆCH
        </Display>
        <Display size={17} weight="bold" style={styles.cardTitle}>
          Chưa chắc bạn đang ở đâu
        </Display>
        <Text size={13.5} lineHeight={1.5} color={colors.inkMuted} style={styles.cardBody}>
          Sai số khoảng 300 m trong khu nhà cao. Bạn chỉ điểm mình đang đứng, mình tính lại chặng.
        </Text>
        <View style={styles.actions}>
          <ActionChip label="Chọn trên bản đồ" tone="dark" />
          <ActionChip label="Bỏ qua" tone="outline" />
        </View>
      </View>

      {/* Điểm đóng cửa hôm nay */}
      <View style={[styles.card, styles.cardDanger]}>
        <Display size={12} weight="extrabold" tracking={0.08} color={colors.primary}>
          ĐIỂM ĐÓNG CỬA HÔM NAY
        </Display>
        <Display size={17} weight="bold" style={styles.cardTitle}>
          Nhà vườn An Hiên nghỉ thứ 2
        </Display>
        <Text size={13.5} lineHeight={1.5} color={colors.inkMuted} style={styles.cardBody}>
          Hai chỗ thay thế cùng hướng, cùng khung 13:30–14:30:
        </Text>
        <View style={styles.alternatives}>
          <AlternativeRow poiId="dai-noi" name="Phủ thờ Ngọc Sơn" meta="1,2 km · mở tới 17:00" />
          <AlternativeRow
            poiId="lang-huong-thuy-xuan"
            name="Làng đúc đồng Phường Đúc"
            meta="2,0 km · mở tới 17:00"
          />
        </View>
      </View>

      {/* Trợ lý chậm */}
      <View style={[styles.card, styles.cardNeutral]}>
        <Display size={12} weight="extrabold" tracking={0.08} color={colors.textSecondary}>
          TRỢ LÝ CHẬM
        </Display>
        <Display size={17} weight="bold" style={styles.cardTitle}>
          Mình xếp bằng quy tắc trước
        </Display>
        <Text size={13.5} lineHeight={1.5} color={colors.inkMuted} style={styles.cardBody}>
          Trợ lý chưa trả lời sau 8 giây. Đây là lịch trình theo khoảng cách và giờ mở cửa —
          dùng được ngay, tinh chỉnh sau.
        </Text>
        <View style={styles.actions}>
          <ActionChip label="Dùng bản này" tone="primary" />
          <ActionChip label="Chờ trợ lý" tone="outline" />
        </View>
      </View>
    </ScrollView>
  </View>
);

type Tone = 'accent' | 'onDark' | 'dark' | 'outline' | 'primary';

const ActionChip: React.FC<{ label: string; tone: Tone }> = ({ label, tone }) => {
  const filled = tone === 'accent' || tone === 'dark' || tone === 'primary';
  const background =
    tone === 'accent' ? colors.accent
      : tone === 'dark' ? colors.ink
        : tone === 'primary' ? colors.primary
          : 'transparent';
  const labelColor =
    tone === 'accent' ? colors.ink
      : tone === 'dark' ? colors.onDark
        : tone === 'primary' ? colors.white
          : tone === 'onDark' ? colors.onDark
            : colors.ink;
  const borderColor = tone === 'onDark' ? colors.borderOnDark : colors.border;

  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.chip,
        filled
          ? [styles.chipFilled, { backgroundColor: background }]
          : [styles.chipOutline, { borderColor }],
        pressed && styles.pressed,
      ]}
    >
      <Text size={12.5} weight={filled ? 'bold' : 'semibold'} color={labelColor}>
        {label}
      </Text>
    </Pressable>
  );
};

/** Gợi ý điểm thay thế — tên/meta lấy từ nội dung thiết kế, màu ô lấy từ loại của POI. */
const AlternativeRow: React.FC<{ poiId: string; name: string; meta: string }> = ({
  poiId, name, meta,
}) => (
  <View style={styles.altRow}>
    <CategorySwatch name={name} category={getPoi(poiId).category} size={44} />
    <View style={styles.altText}>
      <Display size={14.5} weight="bold" numberOfLines={1}>{name}</Display>
      <Text size={12} color={colors.textSecondary}>{meta}</Text>
    </View>
    <Pressable accessibilityRole="button" hitSlop={8}>
      <Text size={12.5} weight="bold" color={colors.primary}>Thay</Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bgScreen },
  sub: { marginTop: 8 },

  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.screenX, paddingTop: 18, paddingBottom: 24, gap: 14 },

  card: { borderRadius: radius.card, padding: 16 },
  cardDark: { backgroundColor: colors.ink },
  cardWarn: { backgroundColor: colors.bgCard, borderWidth: borderWidth.accent, borderColor: colors.warnSoft },
  cardDanger: { backgroundColor: colors.bgCard, borderWidth: borderWidth.accent, borderColor: colors.primarySoft },
  cardNeutral: { backgroundColor: colors.bgCard, borderWidth: borderWidth.accent, borderColor: colors.border },
  cardTitle: { marginTop: 7 },
  cardBody: { marginTop: 6 },

  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 13 },
  chip: { borderRadius: radius.pill },
  chipFilled: { paddingVertical: 8, paddingHorizontal: 13 },
  chipOutline: { paddingVertical: 6, paddingHorizontal: 13, borderWidth: borderWidth.accent },

  alternatives: { gap: 8, marginTop: 12 },
  altRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    backgroundColor: colors.bgSubtle,
    borderRadius: radius.small,
    paddingVertical: 11,
    paddingHorizontal: 12,
  },
  altText: { flex: 1, minWidth: 0 },
  pressed: { opacity: 0.8 },
});
