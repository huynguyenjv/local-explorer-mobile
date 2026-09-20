import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { ImageSlot } from '../components/ImageSlot';
import { ScreenHeader } from '../components/ScreenHeader';
import { Display, Text } from '../components/Text';
import { SAMPLE_ITINERARY, totalStops } from '../data/itinerary';
import { useTrip } from '../state/TripContext';
import type { ChatMessage } from '../types';
import { borderWidth, colors, radius, shadows, sizes, spacing } from '../theme/tokens';

/** Hội thoại mở đầu — khi nối backend thì thay bằng POST /api/chat/message (PRD §7). */
const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    role: 'assistant',
    text: 'Bạn có mấy ngày ở Huế, và muốn nghiêng về di sản, làng nghề hay ăn uống?',
  },
  {
    id: '2',
    role: 'user',
    text: '2 ngày, thích làng nghề và ăn uống. Mình đi xe máy, không muốn đi xa buổi trưa.',
  },
  {
    id: '3',
    role: 'assistant',
    text: 'Rồi. Mình xếp 13 điểm trong 2 ngày, giữ buổi trưa ở khu trung tâm và đẩy làng nghề về chiều cho mát.',
  },
];

const SUGGESTIONS = ['Đổi bữa trưa ngày 1', 'Thêm buổi đi thuyền', 'Chỗ ở gần điểm ngày 2'];

/**
 * Màn 2 — Trợ lý (chat).
 * Kết quả trả về là một thẻ bấm được, không phải khối văn bản.
 */
export const ChatScreen: React.FC<{
  onBackToOnboarding: () => void;
  onOpenItinerary: () => void;
}> = ({ onBackToOnboarding, onOpenItinerary }) => {
  const insets = useSafeAreaInsets();
  const { cityName, lenLabel, modeLabel } = useTrip();
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [draft, setDraft] = useState('');

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: String(Date.now()), role: 'user', text }]);
    setDraft('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenHeader style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.logo}>
            <Display size={15} weight="extrabold" color={colors.accent}>LE</Display>
          </View>
          <View style={styles.headerText}>
            <Display size={17} weight="bold" tracking={-0.01}>Trợ lý</Display>
            <Text size={12.5} color={colors.textFaint} numberOfLines={1}>
              {cityName} · {lenLabel} · {modeLabel}
            </Text>
          </View>
          <Pressable
            onPress={onBackToOnboarding}
            accessibilityRole="button"
            accessibilityLabel="Về màn tạo lịch trình"
            hitSlop={12}
          >
            <Text size={22} color={colors.ink}>→</Text>
          </Pressable>
        </View>
      </ScreenHeader>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((m) => (
          <View
            key={m.id}
            style={[
              styles.bubble,
              m.role === 'assistant' ? styles.bubbleAssistant : styles.bubbleUser,
            ]}
          >
            <Text
              size={14.5}
              lineHeight={1.55}
              color={m.role === 'assistant' ? colors.ink : colors.onDark}
            >
              {m.text}
            </Text>
          </View>
        ))}

        {/* Thẻ kết quả — hàng 3 ảnh + tóm tắt + CTA */}
        <View style={styles.resultCard}>
          <View style={styles.resultImages}>
            {[0, 1, 2].map((i) => (
              <ImageSlot key={i} label=" " style={styles.resultImage} />
            ))}
          </View>
          <View style={styles.resultBody}>
            <View style={styles.resultTitleRow}>
              <Display size={19} weight="extrabold" tracking={-0.015}>
                {cityName} · {lenLabel}
              </Display>
              <Text size={12.5} weight="semibold" color={colors.primary}>
                {totalStops(SAMPLE_ITINERARY)} điểm
              </Text>
            </View>
            <Text size={13.5} lineHeight={1.5} color={colors.inkMuted} style={styles.resultSummary}>
              Ngày 1 quanh Đại Nội và Thủy Xuân · Ngày 2 lên cụm lăng phía nam, về Bao Vinh lúc chiều muộn.
            </Text>
            <Button
              label="Xem lịch trình"
              height={sizes.buttonSmall}
              fontSize={15}
              onPress={onOpenItinerary}
              style={styles.resultCta}
            />
          </View>
        </View>

        {/* Chip gợi ý hành động tiếp — chip đầu có viền đen */}
        <View style={styles.suggestions}>
          {SUGGESTIONS.map((s, i) => (
            <Pressable
              key={s}
              accessibilityRole="button"
              onPress={() => setDraft(s)}
              style={({ pressed }) => [
                styles.suggestion,
                i === 0 ? styles.suggestionLead : styles.suggestionRest,
                pressed && styles.pressed,
              ]}
            >
              <Text size={13} weight="semibold">{s}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Thanh nhập cố định */}
      <View style={[styles.composer, { paddingBottom: insets.bottom + 14 }]}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={send}
          placeholder="Nhắn cho trợ lý…"
          placeholderTextColor={colors.textFaint}
          style={styles.input}
          returnKeyType="send"
        />
        <Pressable
          onPress={send}
          accessibilityRole="button"
          accessibilityLabel="Gửi"
          style={({ pressed }) => [styles.send, pressed && styles.pressed]}
        >
          <Text size={17} color={colors.white}>↑</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bgScreen },
  header: { paddingHorizontal: spacing.screenX },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logo: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: colors.positive,
    alignItems: 'center', justifyContent: 'center',
  },
  headerText: { flex: 1, minWidth: 0 },

  scroll: { flex: 1 },
  content: { padding: spacing.screenXWide, gap: 14 },

  bubble: { maxWidth: '88%', paddingVertical: 14, paddingHorizontal: 16 },
  bubbleAssistant: {
    alignSelf: 'flex-start',
    backgroundColor: colors.bgCard,
    borderRadius: radius.cardLarge,
    borderBottomLeftRadius: 6,
    ...shadows.card,
  },
  bubbleUser: {
    alignSelf: 'flex-end',
    backgroundColor: colors.ink,
    borderRadius: radius.cardLarge,
    borderBottomRightRadius: 6,
  },

  resultCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.cardLarge,
    ...shadows.cardFloating,
  },
  resultImages: {
    flexDirection: 'row',
    gap: 3,
    height: 96,
    overflow: 'hidden',
    borderTopLeftRadius: radius.cardLarge,
    borderTopRightRadius: radius.cardLarge,
  },
  resultImage: { flex: 1, height: 96 },
  resultBody: { padding: 16 },
  resultTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 10,
  },
  resultSummary: { marginTop: 10 },
  resultCta: { marginTop: 14 },

  suggestions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  suggestion: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: borderWidth.accent,
    backgroundColor: colors.bgCard,
  },
  suggestionLead: { borderColor: colors.ink },
  suggestionRest: { borderColor: colors.border },

  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.bgCard,
    borderTopWidth: borderWidth.hairline,
    borderTopColor: colors.line,
  },
  input: {
    flex: 1,
    height: sizes.buttonSmall,
    borderRadius: 24,
    backgroundColor: colors.bgInput,
    paddingHorizontal: 16,
    fontSize: 14,
    color: colors.ink,
  },
  send: {
    width: sizes.buttonSmall,
    height: sizes.buttonSmall,
    borderRadius: sizes.buttonSmall / 2,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.8 },
});
