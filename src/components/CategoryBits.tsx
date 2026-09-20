import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Display } from './Text';
import { categoryColors, colors, radius, type CategoryName } from '../theme/tokens';

/**
 * Ô chữ đầu tên điểm, tô theo màu loại điểm.
 * 56px trong danh sách lịch trình · 52px ở màn Đã lưu · 44px trong thẻ gợi ý thay thế.
 */
export const CategorySwatch: React.FC<{
  name: string;
  category: CategoryName;
  size?: number;
  style?: StyleProp<ViewStyle>;
}> = ({ name, category, size = 56, style }) => {
  const c = categoryColors[category];
  const initial = name.trim().charAt(0);
  const fontSize = size >= 56 ? 21 : size >= 52 ? 19 : 17;
  const corner = size >= 52 ? radius.small + 1 : radius.tiny;

  return (
    <View
      style={[
        styles.swatch,
        { width: size, height: size, backgroundColor: c.bg, borderRadius: corner },
        style,
      ]}
    >
      <Display size={fontSize} weight="extrabold" color={c.ink}>
        {initial}
      </Display>
    </View>
  );
};

/**
 * Nhãn loại điểm: chấm tròn + tên in hoa, Archivo 700 letter-spacing .07em.
 * Chấm luôn tô theo màu loại; chữ tô theo màu loại, trừ khi `muted` — trong
 * danh sách lịch trình chữ dùng màu phụ để tên điểm nổi hơn.
 */
export const CategoryLabel: React.FC<{
  category: CategoryName;
  /** Chữ thêm sau tên loại, vd. "2,1 KM" ở màn chi tiết. */
  suffix?: string;
  size?: number;
  muted?: boolean;
  style?: StyleProp<ViewStyle>;
}> = ({ category, suffix, size = 12, muted = false, style }) => {
  const c = categoryColors[category];
  const text = suffix ? `${category} · ${suffix}` : category;

  return (
    <View style={[styles.labelRow, style]}>
      <View style={[styles.dot, { backgroundColor: c.ink }, muted && styles.dotSmall]} />
      <Display size={size} weight="bold" color={muted ? colors.textSecondary : c.ink} tracking={0.07}>
        {text.toUpperCase()}
      </Display>
    </View>
  );
};

const styles = StyleSheet.create({
  swatch: { alignItems: 'center', justifyContent: 'center' },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotSmall: { width: 7, height: 7, borderRadius: 3.5 },
});
