import React from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Text } from './Text';
import { borderWidth, colors, fonts, radius, sizes } from '../theme/tokens';

/**
 * Chip chọn kiểu "pill" — hai biến thể trong bản thiết kế:
 *  - `solid` (Archivo 13px, cao 40px): Ngày 1/2, số ngày, phương tiện.
 *    Chọn → nền ink, chữ onDark.
 *  - `soft` (Be Vietnam Pro 13px, cao 38px): giờ bắt đầu, nhóm đi cùng.
 *    Chọn → nền accent (vàng nghệ), viền ink.
 */
interface Props {
  label: string;
  selected?: boolean;
  variant?: 'solid' | 'soft';
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const Chip: React.FC<Props> = ({
  label,
  selected = false,
  variant = 'solid',
  onPress,
  style,
}) => {
  const solid = variant === 'solid';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.base,
        solid ? styles.solidSize : styles.softSize,
        selected
          ? solid
            ? styles.solidOn
            : styles.softOn
          : styles.off,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          { fontFamily: solid ? fonts.displayBold : fonts.bodySemiBold },
          selected
            ? solid
              ? styles.labelSolidOn
              : styles.labelSoftOn
            : styles.labelOff,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

/** Chip chỉ để hiển thị trạng thái, không bấm được (vd. "Giờ này vắng", "Audio 4:12"). */
export const StatusChip: React.FC<{
  label: string;
  background: string;
  color: string;
  style?: StyleProp<ViewStyle>;
}> = ({ label, background, color, style }) => (
  <View style={[styles.status, { backgroundColor: background }, style]}>
    <Text size={12.5} weight="bold" color={color}>
      {label}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    borderWidth: borderWidth.accent,
  },
  solidSize: { height: sizes.chip, paddingHorizontal: 18 },
  softSize: { height: sizes.chipSmall, paddingHorizontal: 15 },
  off: { borderColor: colors.border, backgroundColor: colors.white },
  solidOn: { borderColor: colors.ink, backgroundColor: colors.ink },
  softOn: { borderColor: colors.ink, backgroundColor: colors.accent },
  pressed: { opacity: 0.75 },
  label: { fontSize: 13 },
  labelOff: { color: colors.textSecondary },
  labelSolidOn: { color: colors.onDark },
  labelSoftOn: { color: colors.ink },
  status: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.pill,
  },
});
