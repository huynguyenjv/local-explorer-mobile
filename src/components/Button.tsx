import React from 'react';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { Display } from './Text';
import { borderWidth, colors, radius, sizes } from '../theme/tokens';

type Variant = 'primary' | 'dark' | 'outline' | 'accent';

interface Props {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  /** Chiều cao mục tiêu bấm — mặc định 54px (nút phụ trong thanh CTA). */
  height?: number;
  fontSize?: number;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

const BACKGROUNDS: Record<Variant, string> = {
  primary: colors.primary,
  dark: colors.ink,
  outline: colors.white,
  accent: colors.accent,
};

const LABEL_COLORS: Record<Variant, string> = {
  primary: colors.white,
  dark: colors.onDark,
  outline: colors.ink,
  accent: colors.ink,
};

/** Nút chữ nhật bo góc — Archivo bold, dùng cho CTA và hàng nút trong thẻ. */
export const Button: React.FC<Props> = ({
  label,
  onPress,
  variant = 'primary',
  height = sizes.ctaSecondary,
  fontSize = 16,
  style,
  disabled = false,
}) => {
  const bordered = variant === 'outline' || variant === 'accent';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.base,
        {
          height,
          backgroundColor: BACKGROUNDS[variant],
          borderRadius: height >= sizes.buttonMedium ? radius.button : radius.buttonSmall,
        },
        bordered && styles.bordered,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Display size={fontSize} weight="bold" color={LABEL_COLORS[variant]}>
        {label}
      </Display>
    </Pressable>
  );
};

/** Nút vuông chỉ có một glyph (♡ ▶ ↗ ←) — viền ink 2px, nền trắng. */
export const IconButton: React.FC<{
  glyph: string;
  onPress?: () => void;
  size?: number;
  background?: string;
  bordered?: boolean;
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
}> = ({
  glyph,
  onPress,
  size = sizes.buttonMedium,
  background = colors.white,
  bordered = true,
  accessibilityLabel,
  style,
}) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel}
    style={({ pressed }) => [
      styles.icon,
      { width: size, height: size, backgroundColor: background, borderRadius: radius.button },
      bordered && styles.bordered,
      pressed && styles.pressed,
      style,
    ]}
  >
    <Display size={17} weight="bold" color={colors.ink}>
      {glyph}
    </Display>
  </Pressable>
);

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bordered: { borderWidth: borderWidth.accent, borderColor: colors.ink },
  icon: { alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.45 },
});
