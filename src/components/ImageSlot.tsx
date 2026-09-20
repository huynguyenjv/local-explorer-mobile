import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  type ImageStyle,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Text } from './Text';
import { colors } from '../theme/tokens';

/**
 * Ô ảnh. Bản thiết kế chưa có ảnh thật (`<image-slot>` là placeholder),
 * nên component này hiện nền nhạt + nhãn khi `uri` rỗng.
 * Khi có ảnh Huế thật, chỉ cần truyền `uri` — không phải sửa layout.
 */
interface Props {
  uri?: string;
  label?: string;
  /** Nhận cả ViewStyle lẫn ImageStyle vì ô ảnh render ra <Image> hoặc <View>. */
  style?: StyleProp<ViewStyle & ImageStyle>;
  borderRadius?: number;
}

export const ImageSlot: React.FC<Props> = ({ uri, label = 'Ảnh', style, borderRadius = 0 }) => {
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[styles.base, { borderRadius }, style]}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      />
    );
  }

  return (
    <View style={[styles.base, styles.empty, { borderRadius }, style]}>
      <Text size={12} weight="medium" color={colors.textFainter}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: { backgroundColor: colors.bgSubtle },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
});
