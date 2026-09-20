import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { Display, SectionLabel, Text } from '../components/Text';
import { CITIES, INTERESTS, START_TIMES, GROUPS, TRIP_LENGTHS } from '../data/cities';
import { useTrip } from '../state/TripContext';
import { borderWidth, colors, radius, sizes, spacing } from '../theme/tokens';

/**
 * Màn 1 — Tạo lịch trình (onboarding).
 * Thu toàn bộ điều kiện đầu vào trong một màn, không cần tài khoản.
 */
export const OnboardingScreen: React.FC<{ onSubmit: () => void }> = ({ onSubmit }) => {
  const insets = useSafeAreaInsets();
  const {
    city, setCity, cityReady, cityNote,
    len, setLen,
    interests, toggleInterest,
    mode, setMode,
    start, setStart,
    group, setGroup,
    startNote,
  } = useTrip();

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brand}>
          <View style={styles.logo}>
            <Display size={15} weight="extrabold" color={colors.white}>LE</Display>
          </View>
          <Display size={16} weight="bold" tracking={-0.01}>Local Explorer</Display>
        </View>

        <Display size={34} weight="extrabold" tracking={-0.025} lineHeight={1.08} style={styles.h1}>
          Bạn đi đâu?
        </Display>
        <Text size={14.5} color={colors.textSecondary} style={styles.sub}>
          Bốn câu, rồi mình xếp lịch trình.
        </Text>

        {/* Thành phố — grid 2 cột, nút 2 dòng */}
        <View style={styles.grid}>
          {CITIES.map((c, i) => {
            const selected = city === i;
            return (
              <Pressable
                key={c.name}
                onPress={() => setCity(i)}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                style={({ pressed }) => [
                  styles.cityBtn,
                  selected
                    ? styles.cityOn
                    : c.ready
                      ? styles.cityReady
                      : styles.citySoon,
                  pressed && styles.pressed,
                ]}
              >
                <Display
                  size={16}
                  weight="bold"
                  color={selected ? colors.onDark : c.ready ? colors.ink : colors.textFainter}
                >
                  {c.name}
                </Display>
                <Text
                  size={11.5}
                  weight="semibold"
                  color={selected ? colors.onDark : c.ready ? colors.ink : colors.textFainter}
                  style={styles.cityMeta}
                >
                  {c.poiCountLabel}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Dải ghi chú: xanh rêu nếu có dữ liệu, cam nhạt nếu chưa */}
        <View style={[styles.note, cityReady ? styles.noteReady : styles.noteSoon]}>
          <Text
            size={12.5}
            lineHeight={1.5}
            color={cityReady ? colors.positive : colors.onWarn}
          >
            {cityNote}
          </Text>
        </View>

        <SectionLabel style={styles.label}>Ở bao lâu</SectionLabel>
        <View style={styles.row}>
          {TRIP_LENGTHS.map((n) => (
            <Chip key={n} label={`${n} ngày`} selected={len === n} onPress={() => setLen(n)} />
          ))}
        </View>

        <SectionLabel style={styles.label}>Bạn nghiêng về điều gì</SectionLabel>
        <View style={styles.gridWide}>
          {INTERESTS.map((it, i) => {
            const selected = interests.includes(i);
            return (
              <Pressable
                key={it.name}
                onPress={() => toggleInterest(i)}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                style={({ pressed }) => [
                  styles.interestCard,
                  selected ? styles.interestOn : styles.interestOff,
                  pressed && styles.pressed,
                ]}
              >
                <Display size={15} weight="bold" color={colors.ink}>{it.name}</Display>
                <Text size={12} color={selected ? colors.ink : colors.inkMuted} style={styles.interestMeta}>
                  {it.example}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <SectionLabel style={styles.label}>Đi lại bằng</SectionLabel>
        <View style={styles.row}>
          {['Đi bộ', 'Xe máy', 'Ô tô'].map((label, i) => (
            <Chip
              key={label}
              label={label}
              selected={mode === i}
              onPress={() => setMode(i as 0 | 1 | 2)}
            />
          ))}
        </View>

        <SectionLabel style={styles.label}>Mỗi ngày bắt đầu lúc</SectionLabel>
        <View style={styles.rowWrap}>
          {START_TIMES.map((t, i) => (
            <Chip
              key={t}
              label={t}
              variant="soft"
              selected={start === i}
              onPress={() => setStart(i as 0 | 1 | 2)}
            />
          ))}
        </View>

        <SectionLabel style={styles.label}>Đi cùng</SectionLabel>
        <View style={styles.rowWrap}>
          {GROUPS.map((g, i) => (
            <Chip
              key={g}
              label={g}
              variant="soft"
              selected={group === i}
              onPress={() => setGroup(i as 0 | 1 | 2 | 3)}
            />
          ))}
        </View>
        <Text size={12.5} color={colors.textSecondary} style={styles.groupNote}>
          Có trẻ nhỏ thì mình giảm số điểm và chèn quãng nghỉ buổi trưa.
        </Text>
      </ScrollView>

      {/* Footer cố định — CTA 56px + dòng tóm tắt */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}>
        <Button
          label="Tạo lịch trình →"
          height={sizes.ctaPrimary}
          onPress={onSubmit}
          disabled={!cityReady}
        />
        <Text size={12.5} color={colors.textFaint} center style={styles.footerNote}>
          {startNote} · đổi được sau
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bgScreen },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.screenXWide, paddingBottom: 28 },

  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logo: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },

  h1: { marginTop: 26 },
  sub: { marginTop: 10 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 20 },
  cityBtn: {
    width: '48%', flexGrow: 1,
    gap: 3,
    paddingVertical: 13, paddingHorizontal: 15,
    borderRadius: radius.cardSmall,
    borderWidth: borderWidth.accent,
  },
  cityOn: { borderColor: colors.ink, backgroundColor: colors.ink },
  cityReady: { borderColor: colors.ink, backgroundColor: colors.white },
  citySoon: { borderColor: colors.border, backgroundColor: colors.bgSubtle },
  cityMeta: { opacity: 0.8 },

  note: { marginTop: 12, paddingVertical: 11, paddingHorizontal: 13, borderRadius: radius.small },
  noteReady: { backgroundColor: colors.positiveSoft },
  noteSoon: { backgroundColor: colors.warnSoft },

  label: { marginTop: 28, marginBottom: 12 },
  row: { flexDirection: 'row', gap: 10 },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },

  gridWide: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  interestCard: {
    width: '47%', flexGrow: 1,
    gap: 5,
    padding: 15,
    borderRadius: radius.card,
    borderWidth: borderWidth.accent,
  },
  interestOn: { borderColor: colors.ink, backgroundColor: colors.accent },
  interestOff: { borderColor: colors.border, backgroundColor: colors.white },
  interestMeta: { opacity: 0.75 },

  groupNote: { marginTop: 12 },
  pressed: { opacity: 0.8 },

  footer: {
    paddingTop: 16,
    paddingHorizontal: spacing.screenXWide,
    borderTopWidth: borderWidth.hairline,
    borderTopColor: colors.line,
    backgroundColor: colors.bgScreen,
  },
  footerNote: { marginTop: 12 },
});
