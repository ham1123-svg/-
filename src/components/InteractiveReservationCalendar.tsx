import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Info, 
  ArrowDown, 
  Check, 
  RotateCcw,
  ShieldCheck,
  CalendarDays
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  Reservation, 
  ScheduleBlock, 
  RESERVATION_TIME_SLOTS, 
  WEEKDAY_TIME_SLOTS, 
  SATURDAY_TIME_SLOTS, 
  TIME_SLOT_DETAILS,
  getTimeSlotsForDay 
} from '../types';

interface InteractiveReservationCalendarProps {
  selectedDate?: string;
  selectedTime?: string;
  onSelectSlot: (date: string, time: string) => void;
  onSelectDate?: (date: string) => void;
  formRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export default function InteractiveReservationCalendar({
  selectedDate,
  selectedTime,
  onSelectSlot,
  onSelectDate,
  formRef,
  className
}: InteractiveReservationCalendarProps) {
  // Today's reference date
  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const todayStr = useMemo(() => {
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, [today]);

  // Calendar year and month navigation state
  const [viewYear, setViewYear] = useState<number>(() => {
    if (selectedDate) {
      const parts = selectedDate.split('-');
      if (parts.length === 3) return parseInt(parts[0], 10);
    }
    return today.getFullYear();
  });

  const [viewMonth, setViewMonth] = useState<number>(() => {
    if (selectedDate) {
      const parts = selectedDate.split('-');
      if (parts.length === 3) return parseInt(parts[1], 10) - 1;
    }
    return today.getMonth();
  });

  // Active clicked date for time slot viewing
  const [activeDate, setActiveDate] = useState<string>(() => {
    if (selectedDate) return selectedDate;
    // Default to tomorrow or next weekday if today is Sunday
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 1);
    if (nextDay.getDay() === 0) {
      nextDay.setDate(nextDay.getDate() + 1); // Skip Sunday
    }
    const y = nextDay.getFullYear();
    const m = String(nextDay.getMonth() + 1).padStart(2, '0');
    const d = String(nextDay.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  });

  // Real-time Reservations and Admin Schedule Blocks
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [scheduleBlocks, setScheduleBlocks] = useState<ScheduleBlock[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch reservations and schedule blocks
  const loadScheduleData = useCallback(() => {
    setLoading(true);
    Promise.all([
      fetch('/api/reservations').then(res => res.json()).catch(() => []),
      fetch('/api/schedule-blocks').then(res => res.json()).catch(() => [])
    ]).then(([resData, blockData]) => {
      if (Array.isArray(resData)) setReservations(resData);
      if (Array.isArray(blockData)) setScheduleBlocks(blockData);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    loadScheduleData();
  }, [loadScheduleData]);

  // Sync external selectedDate if provided
  useEffect(() => {
    if (selectedDate) {
      setActiveDate(selectedDate);
      const parts = selectedDate.split('-');
      if (parts.length === 3) {
        setViewYear(parseInt(parts[0], 10));
        setViewMonth(parseInt(parts[1], 10) - 1);
      }
    }
  }, [selectedDate]);

  // Month navigation handlers
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewYear(prev => prev - 1);
      setViewMonth(11);
    } else {
      setViewMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear(prev => prev + 1);
      setViewMonth(0);
    } else {
      setViewMonth(prev => prev + 1);
    }
  };

  const handleJumpToToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setActiveDate(todayStr);
  };

  // Check if previous month is in the past
  const isPrevMonthDisabled = useMemo(() => {
    const currentViewDate = new Date(viewYear, viewMonth, 1);
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    return currentViewDate <= thisMonthStart;
  }, [viewYear, viewMonth, today]);

  // Monthly Days Matrix Generation
  const calendarDays = useMemo(() => {
    const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sun
    const totalDaysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    
    // Previous month tail days for grid alignment
    const prevMonthDaysCount = new Date(viewYear, viewMonth, 0).getDate();
    const days: Array<{
      dateStr: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      dayOfWeek: number;
    }> = [];

    // Fill leading days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(viewYear, viewMonth - 1, prevMonthDaysCount - i);
      const y = prevDate.getFullYear();
      const m = String(prevDate.getMonth() + 1).padStart(2, '0');
      const d = String(prevDate.getDate()).padStart(2, '0');
      days.push({
        dateStr: `${y}-${m}-${d}`,
        dayNumber: prevMonthDaysCount - i,
        isCurrentMonth: false,
        dayOfWeek: prevDate.getDay()
      });
    }

    // Fill current month days
    for (let day = 1; day <= totalDaysInMonth; day++) {
      const currDate = new Date(viewYear, viewMonth, day);
      const y = currDate.getFullYear();
      const m = String(currDate.getMonth() + 1).padStart(2, '0');
      const d = String(currDate.getDate()).padStart(2, '0');
      days.push({
        dateStr: `${y}-${m}-${d}`,
        dayNumber: day,
        isCurrentMonth: true,
        dayOfWeek: currDate.getDay()
      });
    }

    // Fill trailing days to complete grid (up to multiple of 7)
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const nextDate = new Date(viewYear, viewMonth + 1, i);
      const y = nextDate.getFullYear();
      const m = String(nextDate.getMonth() + 1).padStart(2, '0');
      const d = String(nextDate.getDate()).padStart(2, '0');
      days.push({
        dateStr: `${y}-${m}-${d}`,
        dayNumber: i,
        isCurrentMonth: false,
        dayOfWeek: nextDate.getDay()
      });
    }

    return days;
  }, [viewYear, viewMonth]);

  // Compute availability summary for any given date
  const getDateAvailability = useCallback((dateStr: string, dayOfWeek: number) => {
    const isPast = dateStr < todayStr;
    const isSunday = dayOfWeek === 0;

    if (isSunday) {
      return { status: 'closed', label: '휴진', availableSlots: 0, totalSlots: 0, reason: '일요일 정기 휴진' };
    }

    if (isPast) {
      return { status: 'past', label: '종료', availableSlots: 0, totalSlots: 0, reason: '지난 일정' };
    }

    // Full day block check
    const fullDayBlock = scheduleBlocks.find(b => b.block_date === dateStr && (!b.block_time || b.block_time === 'all'));
    if (fullDayBlock) {
      return { status: 'blocked', label: '휴진', availableSlots: 0, totalSlots: 0, reason: fullDayBlock.reason || '상담소 휴진' };
    }

    // Available slots calculation
    const allowedSlots = getTimeSlotsForDay(dayOfWeek);
    let availableCount = 0;

    allowedSlots.forEach(slot => {
      // Check block
      const isBlocked = scheduleBlocks.some(b => b.block_date === dateStr && b.block_time === slot);
      // Check booked reservation
      const isBooked = reservations.some(r => r.preferred_date === dateStr && r.preferred_time === slot && r.status !== 'cancelled');

      if (!isBlocked && !isBooked) {
        availableCount++;
      }
    });

    if (availableCount === 0) {
      return { status: 'full', label: '마감', availableSlots: 0, totalSlots: allowedSlots.length, reason: '예약 마감' };
    }

    return { 
      status: 'available', 
      label: `${availableCount}타임`, 
      availableSlots: availableCount, 
      totalSlots: allowedSlots.length 
    };
  }, [todayStr, scheduleBlocks, reservations]);

  // Current active date detail & day of week
  const activeDateInfo = useMemo(() => {
    if (!activeDate) return null;
    const parts = activeDate.split('-');
    if (parts.length !== 3) return null;
    const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    const dayOfWeek = d.getDay();
    const isSaturday = dayOfWeek === 6;
    const isSunday = dayOfWeek === 0;
    const isPast = activeDate < todayStr;
    const allowedSlots = getTimeSlotsForDay(dayOfWeek);

    return {
      dateStr: activeDate,
      year: parseInt(parts[0], 10),
      month: parseInt(parts[1], 10),
      day: parseInt(parts[2], 10),
      dayOfWeekName: WEEKDAYS[dayOfWeek],
      isSaturday,
      isSunday,
      isPast,
      allowedSlots
    };
  }, [activeDate, todayStr]);

  // Time slot availability for the active selected date
  const activeTimeSlots = useMemo(() => {
    if (!activeDateInfo || activeDateInfo.isSunday || activeDateInfo.isPast) return [];

    const dateStr = activeDateInfo.dateStr;

    return RESERVATION_TIME_SLOTS.map(slotTime => {
      const details = TIME_SLOT_DETAILS[slotTime];
      const isSaturday = activeDateInfo.isSaturday;
      const isSatNight = isSaturday && slotTime === '19:00';

      // Check admin block
      const block = scheduleBlocks.find(b => 
        b.block_date === dateStr && 
        (!b.block_time || b.block_time === 'all' || b.block_time === slotTime)
      );

      // Check booked reservation
      const existingRes = reservations.find(r => 
        r.preferred_date === dateStr && 
        r.preferred_time === slotTime && 
        r.status !== 'cancelled'
      );

      let isAvailable = true;
      let reason = '예약 가능';

      if (isSatNight) {
        isAvailable = false;
        reason = '토요일 미운영 (16:30 종료)';
      } else if (block) {
        isAvailable = false;
        reason = block.reason ? `일정 제외 (${block.reason})` : '상담소 휴진';
      } else if (existingRes) {
        isAvailable = false;
        reason = '예약 마감 (상담 진행중)';
      }

      const isSelected = selectedDate === dateStr && selectedTime === slotTime;

      return {
        time: slotTime,
        session: details.session,
        period: details.period,
        duration: details.duration,
        isAvailable,
        reason,
        isSelected
      };
    });
  }, [activeDateInfo, scheduleBlocks, reservations, selectedDate, selectedTime]);

  const handleSelectDate = (dateStr: string, dayOfWeek: number) => {
    const isPast = dateStr < todayStr;
    const isSunday = dayOfWeek === 0;
    if (isPast || isSunday) return;
    setActiveDate(dateStr);
    if (onSelectDate) {
      onSelectDate(dateStr);
    }
  };

  const handleSelectSlotTime = (time: string) => {
    if (!activeDate) return;
    onSelectSlot(activeDate, time);

    // Smoothly scroll down to form section so user can proceed
    if (formRef?.current) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  return (
    <div className={cn("bg-white rounded-3xl p-5 sm:p-8 border border-brand-green/20 shadow-md", className)}>
      
      {/* 1. Header & Guidance Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-5 border-b border-brand-green/15">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/30 text-brand-sage text-xs font-serif font-bold mb-2">
            <CalendarDays className="w-3.5 h-3.5 text-brand-sage" />
            <span>Interactive Booking Calendar</span>
            <span aria-hidden="true" className="text-brand-brown/30">·</span>
            <span className="text-brand-brown/80 font-normal">실시간 예약 가능 일정 확인</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-brand-brown leading-tight">
            희망 날짜와 <span className="text-brand-sage">가능한 시간 슬롯</span>을 직접 선택해 주세요
          </h3>
          <p className="text-xs sm:text-sm text-brand-brown/70 font-serif mt-1">
            달력에서 원하는 날짜를 클릭하시면, 해당 일자의 <strong>1일 5회(토요일 4회) 한정 상담 가능 시간대</strong>가 실시간으로 표시됩니다.
          </p>
        </div>

        {/* Legend Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-serif text-brand-brown/75">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-emerald-900 text-[11px]">예약 가능</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200">
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
            <span className="font-semibold text-rose-900 text-[11px]">마감 / 휴진</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-sage/15 border border-brand-sage/30">
            <span className="w-2 h-2 rounded-full bg-brand-sage"></span>
            <span className="font-semibold text-brand-sage text-[11px]">선택됨</span>
          </div>
        </div>
      </div>

      {/* 2. Main Two-Column Layout: Calendar Grid (Left) + Available Time Slots (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* Left: Monthly Interactive Calendar (7 Cols on LG) */}
        <div className="lg:col-span-7 bg-brand-beige/25 rounded-3xl p-4 sm:p-6 border border-brand-green/20 shadow-2xs">
          
          {/* Month Navigation Bar */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-brand-green/15">
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-serif font-bold text-brand-brown tracking-tight">
                {viewYear}년 {viewMonth + 1}월
              </span>
              <button
                type="button"
                onClick={handleJumpToToday}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-brand-sage hover:text-white text-brand-brown/70 text-[11px] font-serif font-semibold border border-brand-green/30 transition-colors shadow-2xs cursor-pointer"
                title="오늘로 이동"
              >
                오늘
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrevMonth}
                disabled={isPrevMonthDisabled}
                aria-label="이전 달 보기"
                className={cn(
                  "p-2 rounded-xl border transition-all cursor-pointer",
                  isPrevMonthDisabled
                    ? "bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed"
                    : "bg-white text-brand-brown hover:bg-brand-sage hover:text-white border-brand-green/30 shadow-2xs"
                )}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleNextMonth}
                aria-label="다음 달 보기"
                className="p-2 rounded-xl bg-white text-brand-brown hover:bg-brand-sage hover:text-white border-brand-green/30 transition-all shadow-2xs cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Header (일 ~ 토) */}
          <div className="grid grid-cols-7 gap-1 sm:gap-1.5 text-center mb-2">
            {WEEKDAYS.map((dayName, idx) => {
              const isSun = idx === 0;
              const isSat = idx === 6;
              return (
                <div 
                  key={dayName}
                  className={cn(
                    "py-1.5 text-xs font-serif font-bold",
                    isSun && "text-rose-600",
                    isSat && "text-sky-600",
                    !isSun && !isSat && "text-brand-brown/70"
                  )}
                >
                  {dayName}
                </div>
              );
            })}
          </div>

          {/* Calendar 7xN Day Cells */}
          <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
            {calendarDays.map((dayItem, idx) => {
              const { dateStr, dayNumber, isCurrentMonth, dayOfWeek } = dayItem;
              const isSunday = dayOfWeek === 0;
              const isSaturday = dayOfWeek === 6;
              const isToday = dateStr === todayStr;
              const isPast = dateStr < todayStr;
              const isSelectedDate = activeDate === dateStr;
              const isFormSelected = selectedDate === dateStr;

              // Calculate slot availability for this date
              const avail = isCurrentMonth ? getDateAvailability(dateStr, dayOfWeek) : null;
              const isAvailable = avail?.status === 'available';
              const isClosed = isSunday || avail?.status === 'closed' || avail?.status === 'blocked';
              const isFull = avail?.status === 'full';
              const isClickable = isCurrentMonth && !isPast && !isClosed;

              return (
                <button
                  key={`${dateStr}-${idx}`}
                  type="button"
                  disabled={!isClickable}
                  onClick={() => handleSelectDate(dateStr, dayOfWeek)}
                  className={cn(
                    "min-h-[58px] sm:min-h-[64px] p-1 sm:p-1.5 rounded-2xl flex flex-col justify-between items-center transition-all relative border cursor-pointer select-none",
                    // Current month vs other months
                    !isCurrentMonth && "opacity-25 bg-transparent border-transparent cursor-not-allowed",
                    isCurrentMonth && isPast && "bg-gray-50/70 border-gray-100 text-gray-400 cursor-not-allowed opacity-60",
                    // Sunday / Closed styling
                    isCurrentMonth && !isPast && isClosed && "bg-rose-50/40 border-rose-100/60 text-rose-300 cursor-not-allowed",
                    // Full booked styling
                    isCurrentMonth && !isPast && !isClosed && isFull && "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300",
                    // Normal available styling
                    isCurrentMonth && !isPast && !isClosed && !isFull && !isSelectedDate && "bg-white border-brand-green/25 text-brand-brown hover:border-brand-sage hover:shadow-xs active:scale-95",
                    // Active Selected Date
                    isSelectedDate && "bg-brand-sage text-white border-brand-sage shadow-md ring-2 ring-brand-sage/40 scale-102 z-10 font-bold",
                    // Form selected indicator
                    !isSelectedDate && isFormSelected && "ring-2 ring-emerald-500/70 border-emerald-500"
                  )}
                  title={
                    isClosed ? `${dateStr} 휴진` :
                    isPast ? `${dateStr} (종료됨)` :
                    isFull ? `${dateStr} 전체 마감` :
                    `${dateStr} (${avail?.availableSlots || 0}타임 가능)`
                  }
                >
                  {/* Top: Day Number & Today Pill */}
                  <div className="w-full flex items-center justify-between px-0.5">
                    <span className={cn(
                      "text-xs sm:text-sm font-serif font-bold leading-none",
                      isSelectedDate ? "text-white" :
                      isSunday ? "text-rose-600" :
                      isSaturday ? "text-sky-600" :
                      "text-brand-brown"
                    )}>
                      {dayNumber}
                    </span>

                    {isToday && (
                      <span className={cn(
                        "text-[9px] px-1 py-0.2 rounded font-sans font-bold leading-none",
                        isSelectedDate ? "bg-white/25 text-white" : "bg-emerald-100 text-emerald-800"
                      )}>
                        오늘
                      </span>
                    )}
                  </div>

                  {/* Bottom: Availability Badge Indicator */}
                  {isCurrentMonth && (
                    <div className="w-full mt-1">
                      {isSunday ? (
                        <span className="text-[9px] sm:text-[10px] text-rose-400 font-serif block truncate text-center">
                          휴진
                        </span>
                      ) : isPast ? (
                        <span className="text-[9px] text-gray-300 font-serif block truncate text-center">
                          종료
                        </span>
                      ) : isClosed ? (
                        <span className="text-[9px] sm:text-[10px] text-rose-500 font-serif font-bold block truncate text-center">
                          {avail?.label || '휴진'}
                        </span>
                      ) : isFull ? (
                        <span className="text-[9px] sm:text-[10px] text-slate-500 font-serif font-medium block truncate text-center">
                          마감
                        </span>
                      ) : (
                        <div className="flex items-center justify-center gap-1">
                          <span className={cn(
                            "w-1.5 h-1.5 rounded-full shrink-0",
                            isSelectedDate ? "bg-white" : "bg-emerald-500"
                          )} />
                          <span className={cn(
                            "text-[9px] sm:text-[10px] font-mono leading-none truncate",
                            isSelectedDate ? "text-white font-bold" : "text-emerald-800 font-semibold"
                          )}>
                            {avail?.label}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Notice at bottom of Calendar */}
          <div className="mt-3.5 pt-3 border-t border-brand-green/15 flex items-center justify-between text-[11px] text-brand-brown/65 font-serif">
            <span>* 평일: 09:00~20:00 (5회기) · 토요일: 09:00~16:30 (4회기)</span>
            <span className="text-rose-600 font-medium">매주 일요일 휴진</span>
          </div>
        </div>

        {/* Right: Available Time Slots Panel for Selected Date (5 Cols on LG) */}
        <div id="calendar-available-slots" className="lg:col-span-5 flex flex-col justify-between h-full space-y-4 scroll-mt-20">
          
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-brand-green/30 shadow-sm relative">
            
            {/* Active Date Header */}
            <div className="pb-4 mb-4 border-b border-brand-green/15">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-serif font-bold text-brand-sage uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>예약 가능 시간대</span>
                </span>
                
                {activeDateInfo?.isSaturday && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 font-bold border border-sky-200">
                    토요 4회 운영
                  </span>
                )}
                {!activeDateInfo?.isSaturday && !activeDateInfo?.isSunday && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                    평일 5회 운영
                  </span>
                )}
              </div>

              {activeDateInfo ? (
                <div className="mt-1.5 flex items-baseline gap-2">
                  <h4 className="text-lg sm:text-xl font-serif font-bold text-brand-brown">
                    {activeDateInfo.year}년 {activeDateInfo.month}월 {activeDateInfo.day}일
                  </h4>
                  <span className={cn(
                    "text-sm font-serif font-bold",
                    activeDateInfo.isSaturday ? "text-sky-600" :
                    activeDateInfo.isSunday ? "text-rose-600" :
                    "text-brand-sage"
                  )}>
                    ({activeDateInfo.dayOfWeekName}요일)
                  </span>
                </div>
              ) : (
                <h4 className="text-lg font-serif font-bold text-brand-brown">
                  날짜를 선택해 주세요
                </h4>
              )}
            </div>

            {/* Time Slot Cards List */}
            {activeDateInfo?.isSunday ? (
              <div className="py-8 text-center bg-rose-50/50 rounded-2xl border border-rose-100 p-4 space-y-2">
                <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
                <h5 className="text-sm font-serif font-bold text-rose-900">
                  일요일은 상담소 정기 휴진일입니다
                </h5>
                <p className="text-xs text-rose-800/80 font-serif leading-relaxed">
                  평일(월~금) 또는 토요일 일정을 선택해 주시기 바랍니다.
                </p>
              </div>
            ) : activeDateInfo?.isPast ? (
              <div className="py-8 text-center bg-gray-50 rounded-2xl border border-gray-200 p-4 space-y-2">
                <Info className="w-8 h-8 text-gray-400 mx-auto" />
                <h5 className="text-sm font-serif font-bold text-gray-600">
                  이미 지난 날짜입니다
                </h5>
                <p className="text-xs text-gray-500 font-serif">
                  오늘 이후의 날짜를 선택해 주세요.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {activeTimeSlots.map((slot) => {
                  const { time, session, period, duration, isAvailable, reason, isSelected } = slot;

                  return (
                    <button
                      key={time}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => handleSelectSlotTime(time)}
                      className={cn(
                        "w-full p-3.5 rounded-2xl border transition-all flex items-center justify-between text-left relative cursor-pointer group",
                        isSelected
                          ? "bg-brand-sage text-white border-brand-sage shadow-md ring-2 ring-brand-sage/40 scale-101"
                          : isAvailable
                          ? "bg-white border-brand-green/30 hover:border-brand-sage hover:bg-brand-beige/30 hover:shadow-2xs text-brand-brown active:scale-98"
                          : "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed opacity-65"
                      )}
                    >
                      {/* Left: Session Number & Time Duration */}
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-9 h-9 rounded-xl flex flex-col items-center justify-center text-xs font-serif font-bold shrink-0 shadow-2xs",
                          isSelected ? "bg-white/20 text-white" :
                          isAvailable ? "bg-brand-beige/80 text-brand-sage border border-brand-green/20" :
                          "bg-gray-200 text-gray-400"
                        )}>
                          <span className="text-[10px] leading-tight opacity-75">{period}</span>
                          <span className="leading-tight font-extrabold">{session}</span>
                        </div>

                        <div>
                          <div className={cn(
                            "text-sm font-mono font-extrabold tracking-tight",
                            isSelected ? "text-white" : "text-brand-brown"
                          )}>
                            {time}
                          </div>
                          <div className={cn(
                            "text-[11px] font-serif",
                            isSelected ? "text-white/80" : "text-brand-brown/60"
                          )}>
                            {duration}
                          </div>
                        </div>
                      </div>

                      {/* Right: Availability Badge / Selected Checkmark */}
                      <div className="flex items-center gap-2">
                        {isSelected ? (
                          <span className="px-3 py-1 rounded-full bg-white text-brand-sage text-xs font-serif font-bold shadow-2xs flex items-center gap-1 animate-pulse">
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>선택됨</span>
                          </span>
                        ) : isAvailable ? (
                          <span className="px-2.5 py-1 rounded-xl bg-emerald-50 group-hover:bg-brand-sage group-hover:text-white text-emerald-800 text-xs font-serif font-bold border border-emerald-200 transition-colors flex items-center gap-1">
                            <span>예약 가능</span>
                            <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-lg bg-gray-200/80 text-gray-500 text-[10px] font-serif font-medium">
                            {reason}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Currently Selected Summary Banner */}
            {selectedDate && selectedTime && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-serif space-y-2 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-xs font-bold text-emerald-900">
                      선택된 상담 일정 안내
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md font-semibold">
                    신청서 자동 연동됨
                  </span>
                </div>

                <div className="text-sm font-bold text-emerald-950 pl-6">
                  {selectedDate} ({TIME_SLOT_DETAILS[selectedTime]?.session || ''} {selectedTime})
                </div>

                <p className="text-[11px] text-emerald-800/80 pl-6 leading-relaxed">
                  아래 신청서로 이동하여 성함과 연락처를 입력하시면 예약 신청이 완료됩니다.
                </p>

                {formRef?.current && (
                  <div className="pt-1 pl-6">
                    <button
                      type="button"
                      onClick={() => {
                        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900 bg-white px-3 py-1.5 rounded-xl border border-emerald-300 hover:bg-emerald-100/50 transition-colors shadow-2xs cursor-pointer"
                    >
                      <span>신청서 작성하러 가기</span>
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </motion.div>
            )}

          </div>

          {/* Clinical Commitment Card */}
          <div className="p-4 rounded-2xl bg-brand-beige/40 border border-brand-green/20 flex items-start gap-3 text-xs text-brand-brown/80 font-serif leading-relaxed">
            <ShieldCheck className="w-5 h-5 text-brand-sage shrink-0 mt-0.5" />
            <div>
              <strong className="block text-brand-brown font-bold mb-0.5">
                1일 5회기 한정 심층 상담 원칙
              </strong>
              <span>
                상담사의 온전한 집중력과 정서적 에너지를 유지하기 위해 하루 최대 5회기로 예약을 한정 운영합니다.
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
