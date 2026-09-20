import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '../components/Text';
import { borderWidth, colors, sizes } from '../theme/tokens';

/**
 * Thanh tab 4 mục. Glyph tạm dùng ký tự như bản thiết kế
 * (◉ ≡ ✳ ♡) — thay bằng icon set của dự án khi có.
 */
const GLYPHS: Record<string, string> = {
  Today: '◉',
  Itinerary: '≡',
  Chat: '✳',
  Saved: '♡',
};

const LABELS: Record<string, string> = {
  Today: 'Hôm nay',
  Itinerary: 'Lịch trình',
  Chat: 'Trợ lý',
  Saved: 'Đã lưu',
};

export const TabBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { height: sizes.tabBar + insets.bottom, paddingBottom: insets.bottom }]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={LABELS[route.name]}
            style={styles.tab}
          >
            <Text size={19} color={focused ? colors.primary : colors.textFainter}>
              {GLYPHS[route.name]}
            </Text>
            <Text
              size={11}
              weight={focused ? 'bold' : 'medium'}
              color={focused ? colors.primary : colors.textFainter}
            >
              {LABELS[route.name]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.bgCard,
    borderTopWidth: borderWidth.hairline,
    borderTopColor: colors.line,
    paddingTop: 11,
  },
  tab: { flex: 1, alignItems: 'center', gap: 4 },
});
