import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { borderWidth, colors, spacing } from '../theme/tokens';

/**
 * Header trắng cố định trên cùng, kẻ dưới 1px.
 * Tự chừa chỗ cho notch/status bar bằng safe-area inset.
 */
export const ScreenHeader: React.FC<{
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}> = ({ children, style }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 14 }, style]}>{children}</View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.bgCard,
    paddingHorizontal: spacing.screenXWide,
    paddingBottom: 14,
    borderBottomWidth: borderWidth.hairline,
    borderBottomColor: colors.line,
  },
});
