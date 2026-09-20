import React from 'react';
import { StyleSheet, Text as RNText, type TextProps, type TextStyle } from 'react-native';
import { colors, fonts } from '../theme/tokens';

/**
 * Hai họ chữ của hệ thống:
 *  - Display (Archivo)   → tiêu đề, nhãn in hoa, số giờ
 *  - Body (Be Vietnam Pro) → đoạn văn, nhãn, chip
 * Dùng các component này thay cho <Text> trần để không lẫn font.
 */

type Weight = 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold';

const BODY_FONT: Record<Weight, string> = {
  regular: fonts.body,
  medium: fonts.bodyMedium,
  semibold: fonts.bodySemiBold,
  bold: fonts.bodyBold,
  extrabold: fonts.bodyBold,
};

const DISPLAY_FONT: Record<Weight, string> = {
  regular: fonts.displaySemiBold,
  medium: fonts.displaySemiBold,
  semibold: fonts.displaySemiBold,
  bold: fonts.displayBold,
  extrabold: fonts.displayExtraBold,
};

interface Props extends TextProps {
  size?: number;
  weight?: Weight;
  color?: string;
  /** letter-spacing tính theo em, giống CSS trong bản thiết kế */
  tracking?: number;
  lineHeight?: number;
  center?: boolean;
}

const build = (
  family: Record<Weight, string>,
  { size = 14.5, weight = 'regular', color = colors.ink, tracking, lineHeight, center }: Props,
): TextStyle => ({
  fontFamily: family[weight],
  fontSize: size,
  color,
  ...(tracking !== undefined ? { letterSpacing: tracking * size } : null),
  ...(lineHeight !== undefined ? { lineHeight: lineHeight * size } : null),
  ...(center ? { textAlign: 'center' as const } : null),
});

/** Chữ nội dung — Be Vietnam Pro. */
export const Text: React.FC<Props> = ({ style, ...props }) => (
  <RNText {...props} style={[build(BODY_FONT, props), style]} />
);

/** Tiêu đề — Archivo. */
export const Display: React.FC<Props> = ({ style, ...props }) => (
  <RNText {...props} style={[build(DISPLAY_FONT, { weight: 'bold', ...props }), style]} />
);

/**
 * Nhãn khối in hoa: Archivo 700, 12–13px, letter-spacing .08em, màu textSecondary.
 * Dùng cho "Ở BAO LÂU", "ĐIỂM LƯU RIÊNG", "MẤT MẠNG"…
 */
export const SectionLabel: React.FC<Props> = ({ style, ...props }) => (
  <RNText
    {...props}
    style={[
      build(DISPLAY_FONT, {
        size: 13,
        weight: 'bold',
        color: colors.textSecondary,
        tracking: 0.08,
        ...props,
      }),
      styles.upper,
      style,
    ]}
  />
);

const styles = StyleSheet.create({
  upper: { textTransform: 'uppercase' },
});
