import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Clock, ChevronLeft, ChevronRight, 
  Info, CalendarDays, Check, Loader2,
  ArrowRight, Sparkles
} from 'lucide-react';
import { 
  Reservation, 
  ScheduleBlock, 
  RESERVATION_TIME_SLOTS, 
  WEEKDAY_TIME_SLOTS,
  SATURDAY_TIME_SLOTS,
  TIME_SLOT_DETAILS 
} from '../types';

interface WeeklyScheduleCalendarProps {
  selectedDate?: string;
  selectedTime?: string;
  onSelectSlot?: (date: string, time: string) => void;
  formRef?: React.RefObject<HTMLDivElement | null>;
  variant?: 'reservation' | 'programs';
  title?: string;
  subtitle?: string;
  selectedProgramTitle?: string;
  className?: string;
}

const WEEKDAY_NAMES = ['월', '화', '수', '목', '금', '토', '일'];

type TimeFilterType = 'all' | 'morning' | 'afternoon' | 'evening';

export default function WeeklyScheduleCalendar({
  selectedDate,
  selectedTime,
  onSelectSlot,
  formRef,
  variant = 'reservation',
  title,
  subtitle,
  selectedProgramTitle,
  className = ''
}: WeeklyScheduleCalendarProps) {
  const navigate = useNavigate();
  const [weekOffset, setWeekOffset] = useState<number>(0);
  const [selectedMobileDayIndex, setSelectedMobileDayIndex] = useState<number>(0);
  const [timeFilter, setTimeFilter] = useState<TimeFilterType>('all');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [blocks, setBlocks] = useState<ScheduleBlock[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Internal state when not fully controlled
  const [internalDate, setInternalDate] = useState<string>(selectedDate || '');
  const [internalTime, setInternalTime] = useState<string>(selectedTime || '');

  useEffect(() => {
    if (selectedDate !== undefined) setInternalDate(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    if (selectedTime !== undefined) setInternalTime(selectedTime);
  }, [selectedTime]);

  const activeDate = selectedDate !== undefined ? selectedDate : internalDate;
  const activeTime = selectedTime !== undefined ? selectedTime : internalTime;

  // Fetch reservations and schedule blocks to determine booked/unavailable slots
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    
    Promise.all([
      fetch('/api/reservations').then(res => res.json()).catch(() => []),
      fetch('/api/schedule-blocks').then(res => res.json()).catch(() => [])
    ]).then(([resData, blockData]) => {
      if (isMounted) {
        if (Array.isArray(resData)) setReservations(resData);
        if (Array.isArray(blockData)) setBlocks(blockData);
      }
    }).finally(() => {
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Today's reference (in KST if applicable)
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const todayStr = useMemo(() => {
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, [today]);

  // Calculate Monday of the targeted week
  const weekDays = useMemo(() => {
    const base = new Date();
    const day = base.getDay(); // 0 is Sun, 1 is Mon...
    // diff to reach Monday: if Sun(0) -> -6, else -> 1 - day
    const diff = (day === 0 ? -6 : 1) - day;
    const monday = new Date(base);
    monday.setDate(base.getDate() + diff + weekOffset * 7);
    monday.setHours(0, 0, 0, 0);

    return Array.from({ length: 7 }, (_, i) => {
      const current = new Date(monday);
      current.setDate(monday.getDate() + i);
      const year = current.getFullYear();
      const month = String(current.getMonth() + 1).padStart(2, '0');
      const date = String(current.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${date}`;
      const dayOfWeekIndex = current.getDay(); // 0 is Sun, 6 is Sat

      const isSunday = dayOfWeekIndex === 0;
      const isSaturday = dayOfWeekIndex === 6;
      const isPast = current < today;
      const isToday = dateStr === todayStr;

      // Available slots per day rule:
      // 평일: 09:00, 10:30, 14:00, 15:30, 19:00 (5회)
      // 토요일: 09:00, 10:30, 14:00, 15:30 (4회 - 야간 미운영)
      // 일요일: 정기 휴무
      let availableSlots: string[] = [];
      if (isSunday) {
        availableSlots = []; // Sunday closed
      } else if (isSaturday) {
        availableSlots = [...SATURDAY_TIME_SLOTS]; // 4 slots
      } else {
        availableSlots = [...WEEKDAY_TIME_SLOTS]; // 5 slots
      }

      return {
        dateObj: current,
        dateStr,
        displayMonth: current.getMonth() + 1,
        displayDate: current.getDate(),
        dayName: WEEKDAY_NAMES[i],
        isSunday,
        isSaturday,
        isPast,
        isToday,
        availableSlots
      };
    });
  }, [weekOffset, today, todayStr]);

  // Set initial selected mobile day index to today or first available day
  useEffect(() => {
    if (weekOffset === 0) {
      const todayIdx = weekDays.findIndex(d => d.isToday);
      if (todayIdx !== -1) {
        setSelectedMobileDayIndex(todayIdx);
      }
    } else {
      setSelectedMobileDayIndex(0);
    }
  }, [weekOffset, weekDays]);

  // Booked slots map: "YYYY-MM-DD_HH:MM" -> true
  const bookedSlotsMap = useMemo(() => {
    const map = new Map<string, boolean>();
    reservations.forEach(r => {
      if (r.status !== 'cancelled' && r.preferred_date && r.preferred_time) {
        map.set(`${r.preferred_date}_${r.preferred_time}`, true);
      }
    });
    return map;
  }, [reservations]);

  // Filter time slots based on timeFilter (1일 5회 분류)
  const filterTimeSlots = (slots: string[]) => {
    return slots.filter(slot => {
      if (timeFilter === 'all') return true;
      if (timeFilter === 'morning') return slot === '09:00' || slot === '10:30';
      if (timeFilter === 'afternoon') return slot === '14:00' || slot === '15:30';
      if (timeFilter === 'evening') return slot === '19:00';
      return true;
    });
  };

  // Available slots count across the displayed week
  const availableSlotsCount = useMemo(() => {
    let count = 0;
    weekDays.forEach(day => {
      if (day.isSunday || (day.isPast && !day.isToday)) return;
      day.availableSlots.forEach(timeStr => {
        const isBooked = bookedSlotsMap.has(`${day.dateStr}_${timeStr}`);
        const isBlocked = blocks.some(b => b.block_date === day.dateStr && (!b.block_time || b.block_time === timeStr));
        if (!isBooked && !isBlocked) count++;
      });
    });
    return count;
  }, [weekDays, bookedSlotsMap, blocks]);

  const handleSlotClick = (dateStr: string, timeStr: string, isClickable: boolean, dayName: string) => {
    if (!isClickable) return;

    if (onSelectSlot) {
      onSelectSlot(dateStr, timeStr);
    }
    setInternalDate(dateStr);
    setInternalTime(timeStr);

    // If in reservation page and formRef is provided, gently scroll to it
    if (variant === 'reservation' && formRef?.current) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  };

  // Week range text
  const weekRangeText = useMemo(() => {
    if (weekDays.length < 7) return '';
    const first = weekDays[0];
    const last = weekDays[6];
    return `${first.dateObj.getFullYear()}년 ${first.displayMonth}월 ${first.displayDate}일 ~ ${last.displayMonth}월 ${last.displayDate}일`;
  }, [weekDays]);

  const defaultTitle = variant === 'programs' ? '실시간 주간 상담 가능 시간표' : '주간 상담 가능 시간표';
  const defaultSubtitle = variant === 'programs' 
    ? '상담 프로그램을 선택하기 전, 이번 주와 다음 주의 잔여 상담 슬롯을 한눈에 확인하고 희망 시간을 바로 예약할 수 있습니다.'
    : '희망하는 시간대를 클릭하면 예약 신청 폼에 자동으로 날짜와 시간이 반영됩니다.';

  return (
    <div className={`bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-brand-green/20 ${className}`}>
      {/* Calendar Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-brand-green/20">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-sage text-white flex items-center gap-1 shadow-xs">
              <CalendarDays className="w-3.5 h-3.5" />
              실시간 예약 현황
              {loading && <Loader2 className="w-3 h-3 animate-spin ml-0.5" />}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              잔여 {availableSlotsCount}개 슬롯
            </span>
            <span className="text-xs text-brand-brown/60 hidden sm:inline">
              {subtitle || defaultSubtitle}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-brand-brown flex items-center gap-2">
            <Clock className="w-6 h-6 text-brand-sage" />
            {title || defaultTitle}
          </h2>
          <p className="text-xs text-brand-brown/60 sm:hidden mt-1">
            {subtitle || defaultSubtitle}
          </p>
        </div>

        {/* Week Navigator Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setWeekOffset(prev => Math.max(0, prev - 1))}
            disabled={weekOffset === 0}
            className="p-2 sm:px-3 sm:py-2 rounded-xl border border-brand-green/30 text-brand-brown text-xs font-bold hover:bg-brand-beige/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer"
            title="이전 주"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">이전 주</span>
          </button>

          <div className="px-3.5 py-2 bg-brand-beige/30 border border-brand-green/20 rounded-xl text-xs sm:text-sm font-bold text-brand-brown text-center whitespace-nowrap">
            {weekRangeText}
            {weekOffset === 0 && (
              <span className="ml-1.5 px-2 py-0.5 bg-brand-sage/15 text-brand-sage rounded-md text-[11px] font-semibold">
                이번 주
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setWeekOffset(prev => prev + 1)}
            className="p-2 sm:px-3 sm:py-2 rounded-xl border border-brand-green/30 text-brand-brown text-xs font-bold hover:bg-brand-beige/40 transition-all flex items-center gap-1 cursor-pointer"
            title="다음 주"
          >
            <span className="hidden sm:inline">다음 주</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          {weekOffset > 0 && (
            <button
              type="button"
              onClick={() => setWeekOffset(0)}
              className="px-2.5 py-2 bg-white border border-brand-green/30 hover:border-brand-sage text-brand-sage text-xs font-bold rounded-xl transition-all cursor-pointer"
              title="이번 주로 돌아가기"
            >
              오늘
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 bg-brand-beige/20 p-3.5 rounded-2xl border border-brand-green/20">
        {/* Time of Day Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-semibold text-brand-brown/70 mr-1 shrink-0">시간대:</span>
          {(['all', 'morning', 'afternoon', 'evening'] as TimeFilterType[]).map((filter) => {
            const labels: Record<TimeFilterType, string> = {
              all: '전체 (1일 5회)',
              morning: '오전 (09:00, 10:30)',
              afternoon: '오후 (14:00, 15:30)',
              evening: '야간 (19:00)'
            };
            const isActive = timeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setTimeFilter(filter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive 
                    ? 'bg-brand-sage text-white shadow-xs' 
                    : 'bg-white/80 text-brand-brown/70 hover:bg-white border border-brand-green/20'
                }`}
              >
                {labels[filter]}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-brand-brown/70 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-emerald-50 border border-emerald-300"></span>
            <span>예약 가능</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-brand-sage text-white flex items-center justify-center">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </span>
            <span>선택됨</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-gray-100 border border-gray-200"></span>
            <span>마감/휴진</span>
          </div>
        </div>
      </div>

      {/* Selected Slot Feedback Banner */}
      <AnimatePresence>
        {activeDate && activeTime && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="p-4 bg-brand-green/20 border border-brand-sage/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-brand-brown shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-brand-sage text-white rounded-full flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-brand-brown">선택된 상담 일정:</span>
                    <strong className="text-brand-sage font-extrabold text-sm">
                      {activeDate} ({weekDays.find(d => d.dateStr === activeDate)?.dayName || ''}) {activeTime}
                    </strong>
                    <span className="px-2 py-0.5 bg-white/80 rounded-md text-[11px] font-semibold text-brand-brown/80 border border-brand-green/30">
                      {TIME_SLOT_DETAILS[activeTime]?.session || '상담 세션'} ({TIME_SLOT_DETAILS[activeTime]?.period || ''})
                    </span>
                  </div>
                  <p className="text-[11px] text-brand-brown/70 mt-0.5">
                    {variant === 'programs' 
                      ? '원하시는 일정이 확인되었습니다. 버튼을 누르시면 예약 신청서로 바로 연결됩니다.' 
                      : '아래 예약 신청 폼의 상담 희망일과 시간에 자동으로 반영되었습니다.'}
                  </p>
                </div>
              </div>

              {variant === 'programs' ? (
                <button
                  type="button"
                  onClick={() => {
                    const params = new URLSearchParams();
                    params.set('date', activeDate);
                    params.set('time', activeTime);
                    if (selectedProgramTitle) params.set('program', selectedProgramTitle);
                    navigate(`/reservation?${params.toString()}`);
                  }}
                  className="px-4 py-2.5 bg-brand-sage text-white font-bold rounded-xl hover:bg-brand-sage/90 transition-all shrink-0 text-xs sm:text-sm shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>이 시간으로 예약 신청하기</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    formRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="px-3 py-1.5 bg-brand-sage text-white font-bold rounded-xl hover:bg-brand-sage/90 transition-all shrink-0 text-xs shadow-xs cursor-pointer"
                >
                  예약 정보 입력하기 ↓
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Weekly Grid (md and up) */}
      <div className="hidden md:grid grid-cols-7 gap-3">
        {weekDays.map((day) => {
          const isDayPast = day.isPast && !day.isToday;
          const filteredSlots = filterTimeSlots(day.availableSlots);

          return (
            <div 
              key={day.dateStr}
              className={`rounded-2xl border p-3 flex flex-col transition-all ${
                day.isToday 
                  ? 'border-brand-sage ring-2 ring-brand-sage/20 bg-brand-sage/5' 
                  : day.isSunday
                  ? 'border-brand-green/15 bg-gray-50/50'
                  : 'border-brand-green/20 bg-white hover:border-brand-green/40'
              }`}
            >
              {/* Day Header */}
              <div className="text-center pb-2.5 mb-2.5 border-b border-brand-green/15">
                <div className="flex items-center justify-center gap-1">
                  <span className={`text-xs font-bold ${
                    day.isSunday ? 'text-red-500' : day.isSaturday ? 'text-blue-600' : 'text-brand-brown'
                  }`}>
                    {day.dayName}
                  </span>
                  {day.isToday && (
                    <span className="px-1.5 py-0.2 bg-brand-sage text-white text-[10px] font-bold rounded-full">
                      오늘
                    </span>
                  )}
                </div>
                <div className={`text-base font-bold mt-0.5 ${day.isSunday ? 'text-red-600' : 'text-brand-brown'}`}>
                  {day.displayMonth}/{day.displayDate}
                </div>
                <div className="text-[10px] text-brand-brown/50 mt-0.5">
                  {day.isSunday 
                    ? '정기 휴무' 
                    : `${filteredSlots.length}개 시간대`}
                </div>
              </div>

              {/* Time Slots */}
              <div className="flex-1 space-y-1.5">
                {day.isSunday ? (
                  <div className="h-full min-h-[140px] flex flex-col items-center justify-center p-2 text-center text-xs text-brand-brown/50">
                    <span className="text-gray-400 font-semibold mb-1">정기 휴진</span>
                    <p className="text-[11px] text-brand-brown/40 leading-relaxed">
                      일요일은 휴무입니다. <br />
                      (긴급 시 유선 문의)
                    </p>
                  </div>
                ) : filteredSlots.length === 0 ? (
                  <div className="py-6 text-center text-[11px] text-brand-brown/40">
                    {day.isSaturday && timeFilter === 'evening' ? '토요일 야간 미운영' : '해당 시간대 없음'}
                  </div>
                ) : (
                  filteredSlots.map((timeStr) => {
                    const isBooked = bookedSlotsMap.has(`${day.dateStr}_${timeStr}`);
                    const blockItem = blocks.find(b => b.block_date === day.dateStr && (!b.block_time || b.block_time === timeStr));
                    const isBlocked = !!blockItem;
                    const isSelected = activeDate === day.dateStr && activeTime === timeStr;
                    const isSlotPast = isDayPast;
                    const isAvailable = !isBooked && !isSlotPast && !isBlocked;

                    return (
                      <button
                        key={timeStr}
                        type="button"
                        onClick={() => handleSlotClick(day.dateStr, timeStr, isAvailable, day.dayName)}
                        disabled={!isAvailable}
                        className={`w-full py-2.5 px-2 rounded-xl text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-0.5 ${
                          isSelected
                            ? 'bg-brand-sage text-white shadow-md ring-2 ring-brand-sage/30 scale-[1.02]'
                            : isAvailable
                            ? 'bg-emerald-50/70 hover:bg-emerald-100 text-emerald-950 border border-emerald-200/80 hover:border-emerald-400 cursor-pointer shadow-2xs'
                            : 'bg-gray-100/70 text-gray-400 border border-gray-200/50 cursor-not-allowed line-through'
                        }`}
                        title={
                          isSelected 
                            ? '선택된 시간' 
                            : isAvailable 
                            ? `${day.dateStr} [${TIME_SLOT_DETAILS[timeStr]?.session || ''}] ${timeStr} 선택하기` 
                            : isBlocked
                            ? `예약 마감 / 사유: ${blockItem?.reason || '상담 불가'}`
                            : isBooked 
                            ? '이미 예약 완료된 시간' 
                            : '예약 불가'
                        }
                      >
                        <div className="flex items-center gap-1">
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          <span className="font-extrabold text-sm">{timeStr}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className={`text-[10px] font-semibold ${isSelected ? 'text-white/85' : 'text-brand-brown/60'}`}>
                            {TIME_SLOT_DETAILS[timeStr]?.session}
                          </span>
                          {!isAvailable && !isSelected && (
                            <span className="text-[9px] no-underline font-normal text-rose-500 font-semibold block ml-0.5">
                              {isBlocked ? (blockItem?.reason?.includes('휴진') ? '(휴진)' : '(마감)') : '(마감)'}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Weekly View (sm and down) */}
      <div className="block md:hidden">
        {/* Day Selector Buttons */}
        <div className="grid grid-cols-7 gap-1 mb-4 bg-brand-beige/30 p-1.5 rounded-2xl border border-brand-green/20">
          {weekDays.map((day, idx) => {
            const isSelected = selectedMobileDayIndex === idx;
            return (
              <button
                key={day.dateStr}
                type="button"
                onClick={() => setSelectedMobileDayIndex(idx)}
                className={`py-2 rounded-xl text-center transition-all ${
                  isSelected 
                    ? 'bg-brand-sage text-white shadow-xs font-bold' 
                    : 'text-brand-brown hover:bg-white/60'
                }`}
              >
                <div className={`text-[10px] ${
                  isSelected ? 'text-white' : day.isSunday ? 'text-red-500 font-bold' : day.isSaturday ? 'text-blue-600 font-bold' : 'text-brand-brown/70'
                }`}>
                  {day.dayName}
                </div>
                <div className="text-xs font-extrabold mt-0.5">
                  {day.displayDate}
                </div>
                {day.isToday && (
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mx-auto mt-0.5"></div>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Day Slots List */}
        {(() => {
          const day = weekDays[selectedMobileDayIndex] || weekDays[0];
          const isDayPast = day.isPast && !day.isToday;
          const filteredSlots = filterTimeSlots(day.availableSlots);

          return (
            <div className="p-4 bg-brand-beige/10 rounded-2xl border border-brand-green/20">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-brand-green/20">
                <div>
                  <span className={`text-xs font-bold mr-2 ${
                    day.isSunday ? 'text-red-500' : day.isSaturday ? 'text-blue-600' : 'text-brand-sage'
                  }`}>
                    {day.dayName}요일
                  </span>
                  <strong className="text-sm font-bold text-brand-brown">
                    {day.dateStr}
                  </strong>
                </div>
                <span className="text-xs text-brand-brown/60">
                  {day.isSunday ? '정기 휴무' : `${filteredSlots.length}개 시간대`}
                </span>
              </div>

              {day.isSunday ? (
                <div className="py-8 text-center text-xs text-brand-brown/50">
                  일요일은 정기 휴무입니다. 긴급 상담 문의는 유선 전화(052-254-0230)로 연락 바랍니다.
                </div>
              ) : filteredSlots.length === 0 ? (
                <div className="py-8 text-center text-xs text-brand-brown/50">
                  {day.isSaturday && timeFilter === 'evening' 
                    ? '토요일은 19:00 야간 상담을 운영하지 않습니다. (09:00, 10:30, 14:00, 15:30 4회 운영)' 
                    : '선택한 필터 조건에 해당하는 시간이 없습니다.'}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {filteredSlots.map((timeStr) => {
                    const isBooked = bookedSlotsMap.has(`${day.dateStr}_${timeStr}`);
                    const blockItem = blocks.find(b => b.block_date === day.dateStr && (!b.block_time || b.block_time === timeStr));
                    const isBlocked = !!blockItem;
                    const isSelected = activeDate === day.dateStr && activeTime === timeStr;
                    const isSlotPast = isDayPast;
                    const isAvailable = !isBooked && !isSlotPast && !isBlocked;

                    return (
                      <button
                        key={timeStr}
                        type="button"
                        onClick={() => handleSlotClick(day.dateStr, timeStr, isAvailable, day.dayName)}
                        disabled={!isAvailable}
                        className={`py-3 px-3 rounded-2xl text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-0.5 ${
                          isSelected
                            ? 'bg-brand-sage text-white shadow-md ring-2 ring-brand-sage/30'
                            : isAvailable
                            ? 'bg-white hover:bg-emerald-50 text-brand-brown border border-emerald-300 active:scale-98'
                            : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                        }`}
                      >
                        <span className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-brand-brown/60'}`}>
                          {TIME_SLOT_DETAILS[timeStr]?.session} ({TIME_SLOT_DETAILS[timeStr]?.period})
                        </span>
                        <span className="text-base font-extrabold">{timeStr}</span>
                        <span className={`text-[10px] ${
                          isSelected ? 'text-white/90' : isAvailable ? 'text-emerald-700 font-semibold' : isBlocked ? 'text-rose-600 font-bold' : 'text-gray-400'
                        }`}>
                          {isSelected ? '선택됨' : isAvailable ? '예약가능' : isBlocked ? (blockItem?.reason?.includes('휴진') ? '휴진' : '마감') : '마감'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* Calendar Footer Info */}
      <div className="mt-6 pt-4 border-t border-brand-green/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-brand-brown/60">
        <div className="flex items-center gap-1.5">
          <Info className="w-4 h-4 text-brand-sage shrink-0" />
          <span>
            상담 시간: <strong>평일 09:00, 10:30, 14:00, 15:30, 19:00 (5회)</strong> / <strong>토요일 09:00, 10:30, 14:00, 15:30 (4회)</strong>
          </span>
        </div>
        <div className="text-brand-brown/70 font-semibold">
          * 100% 사전 예약제 / 회기당 50분 기준 / 일요일 휴무
        </div>
      </div>
    </div>
  );
}
