/**
 * Design tokens — Local Explorer AI mobile.
 * Giá trị lấy nguyên từ design handoff (.claude/design/design_handoff_local_explorer/README.md).
 * Không hard-code màu/cỡ chữ ở chỗ khác; luôn tham chiếu file này.
 */

export const colors = {
  // Mực & chữ
  ink: '#16130F',
  inkSoft: '#3A342C',
  inkMuted: '#4A4238',
  textSecondary: '#6B5F52',
  textFaint: '#8A7D6D',
  textFainter: '#9A8F80',
  onDark: '#FFF7EE',
  onDarkMuted: '#C9BFB1',

  // Nền
  bgPage: '#FFE7CE',
  bgScreen: '#FFF7EE',
  bgCard: '#FFFFFF',
  bgSubtle: '#FBF6EF',
  bgInput: '#F5EFE6',
  bgDarkElevated: '#2A251F',

  // Đường kẻ & viền
  line: '#F1EBE2',
  border: '#E7DFD4',
  borderOnDark: '#4A443C',

  // CTA cam đất
  primary: '#D93A14',
  primaryHover: '#B92F0E',
  primarySoft: '#F3CFC5',

  // Xanh rêu — tích cực, "vắng người"
  positive: '#0B6E5F',
  positiveSoft: '#E4F0EC',
  positiveSoftAlt: '#E9F1EC',

  // Vàng nghệ — chọn / nhấn
  accent: '#FFD66B',
  warnSoft: '#FFE7CE',
  onWarn: '#7A4A12',
  onWarnFaint: '#7A6A55',

  white: '#FFFFFF',
} as const;

/** Màu theo loại điểm (POI category) */
export const categoryColors = {
  'Di sản': { ink: '#C9861B', bg: '#FDF0D9' },
  'Ẩm thực': { ink: '#D93A14', bg: '#FAE6E0' },
  'Làng nghề': { ink: '#0B6E5F', bg: '#E4F0EC' },
  'Thiên nhiên': { ink: '#3F7D20', bg: '#EBF2E1' },
} as const;

/** Biểu đồ đông người */
export const crowdColors = {
  quiet: '#0B6E5F',
  medium: '#E9A62B',
  busy: '#D93A14',
  closed: '#E2C9A6',
} as const;

export const fonts = {
  displayBold: 'Archivo_700Bold',
  displayExtraBold: 'Archivo_800ExtraBold',
  displaySemiBold: 'Archivo_600SemiBold',
  body: 'BeVietnamPro_400Regular',
  bodyMedium: 'BeVietnamPro_500Medium',
  bodySemiBold: 'BeVietnamPro_600SemiBold',
  bodyBold: 'BeVietnamPro_700Bold',
} as const;

export const radius = {
  screen: 28,
  sheet: 26,
  cardLarge: 20,
  card: 18,
  cardSmall: 16,
  small: 13,
  tiny: 11,
  button: 16,
  buttonSmall: 13,
  pill: 999,
} as const;

export const spacing = {
  screenX: 20,
  screenXWide: 22,
  screenXNarrow: 18,
} as const;

/** Chiều cao mục tiêu bấm */
export const sizes = {
  ctaPrimary: 56,
  ctaSecondary: 54,
  buttonMedium: 52,
  buttonSmall: 48,
  buttonTiny: 46,
  chip: 40,
  chipSmall: 38,
  tabBar: 78,
} as const;

/** Bóng đổ — iOS dùng shadow*, Android dùng elevation */
export const shadows = {
  card: {
    shadowColor: colors.ink,
    shadowOpacity: 0.16,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardFloating: {
    shadowColor: colors.ink,
    shadowOpacity: 0.2,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  sheet: {
    shadowColor: colors.ink,
    shadowOpacity: 0.22,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: -10 },
    elevation: 14,
  },
  pillFloating: {
    shadowColor: colors.ink,
    shadowOpacity: 0.28,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  darkBar: {
    shadowColor: colors.ink,
    shadowOpacity: 0.5,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
} as const;

/** Viền nhấn: 2px solid ink (nút phụ, thẻ được chọn) */
export const borderWidth = { accent: 2, hairline: 1 } as const;

export type CategoryName = keyof typeof categoryColors;
