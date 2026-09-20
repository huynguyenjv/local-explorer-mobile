import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CITIES, GROUPS, START_TIMES } from '../data/cities';
import { SAMPLE_ITINERARY } from '../data/itinerary';
import type { Itinerary, TravelMode } from '../types';

/**
 * State toàn cục của chuyến đi — đúng hình dạng mô tả trong handoff §State.
 *
 *   city: 0..3 · len: 1|2|3 · interests: number[] · mode: 0|1|2
 *   start: 0|1|2 · group: 0..3 · day: 0|1 · editing: boolean
 */
interface TripState {
  city: number;
  len: 1 | 2 | 3;
  interests: number[];
  mode: TravelMode;
  start: 0 | 1 | 2;
  group: 0 | 1 | 2 | 3;
  day: number;
  editing: boolean;
  savedPoiIds: string[];
  itinerary: Itinerary;
}

interface TripActions {
  setCity: (i: number) => void;
  setLen: (n: 1 | 2 | 3) => void;
  toggleInterest: (i: number) => void;
  setMode: (m: TravelMode) => void;
  cycleMode: () => void;
  setStart: (s: 0 | 1 | 2) => void;
  setGroup: (g: 0 | 1 | 2 | 3) => void;
  setDay: (d: number) => void;
  toggleEditing: () => void;
  toggleSavedPoi: (poiId: string) => void;
}

interface TripDerived {
  cityName: string;
  cityReady: boolean;
  cityNote: string;
  lenLabel: string;
  modeLabel: string;
  startLabel: string;
  groupLabel: string;
  /** Dòng tóm tắt dưới CTA màn 1: "Bắt đầu 08:30 · một mình" */
  startNote: string;
}

type TripContextValue = TripState & TripActions & TripDerived;

const TripContext = createContext<TripContextValue | null>(null);

const MODE_LABELS = ['Đi bộ', 'Xe máy', 'Ô tô'] as const;

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Mặc định theo bản thiết kế: Huế · 2 ngày · Ẩm thực + Làng nghề · Xe máy · 08:30 · Một mình
  const [city, setCityState] = useState(0);
  const [len, setLen] = useState<1 | 2 | 3>(2);
  const [interests, setInterests] = useState<number[]>([1, 2]);
  const [mode, setMode] = useState<TravelMode>(1);
  const [start, setStart] = useState<0 | 1 | 2>(1);
  const [group, setGroup] = useState<0 | 1 | 2 | 3>(0);
  const [day, setDay] = useState(0);
  const [editing, setEditing] = useState(false);
  const [savedPoiIds, setSavedPoiIds] = useState<string[]>([]);

  const setCity = useCallback((i: number) => {
    setCityState(i);
    setDay(0);
  }, []);

  const toggleInterest = useCallback((i: number) => {
    setInterests((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));
  }, []);

  const cycleMode = useCallback(() => {
    setMode((m) => ((m + 1) % 3) as TravelMode);
  }, []);

  const toggleEditing = useCallback(() => setEditing((e) => !e), []);

  const toggleSavedPoi = useCallback((poiId: string) => {
    setSavedPoiIds((prev) =>
      prev.includes(poiId) ? prev.filter((x) => x !== poiId) : [...prev, poiId],
    );
  }, []);

  const value = useMemo<TripContextValue>(() => {
    const c = CITIES[city];
    return {
      city, len, interests, mode, start, group, day, editing, savedPoiIds,
      itinerary: SAMPLE_ITINERARY,

      setCity, setLen, toggleInterest, setMode, cycleMode, setStart, setGroup,
      setDay, toggleEditing, toggleSavedPoi,

      cityName: c.name,
      cityReady: c.ready,
      cityNote: c.ready
        ? `Dữ liệu ${c.name} do nhóm tự thu thập, cập nhật tháng này.`
        : `Chưa có dữ liệu điểm đến cho ${c.name}. Chọn để mình báo khi mở.`,
      lenLabel: `${len} ngày`,
      modeLabel: MODE_LABELS[mode],
      startLabel: START_TIMES[start],
      groupLabel: GROUPS[group],
      startNote: `Bắt đầu ${START_TIMES[start]} · ${GROUPS[group].toLowerCase()}`,
    };
  }, [
    city, len, interests, mode, start, group, day, editing, savedPoiIds,
    setCity, toggleInterest, cycleMode, toggleEditing, toggleSavedPoi,
  ]);

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
};

export const useTrip = (): TripContextValue => {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error('useTrip phải nằm trong <TripProvider>');
  return ctx;
};
