import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, Clock, ChevronLeft, ChevronRight, Plus, 
  User, Phone, Edit3, Trash2, CheckCircle2, AlertCircle, 
  CalendarDays, Filter, RefreshCw, Send, ShieldAlert, X,
  Check, MessageSquareText, HelpCircle, Ban, CalendarCheck,
  Lock, Unlock, CalendarRange, CheckSquare, Square, Search
} from 'lucide-react';
import { Reservation, Program, ScheduleBlock, RESERVATION_TIME_SLOTS, TIME_SLOT_DETAILS } from '../types';

interface AdminScheduleManagerProps {
  reservations: Reservation[];
  programs: Program[];
  onRefresh: () => void;
  onShowNotice: (msg: string) => void;
}

const WEEKDAYS = ['월', '화', '수', '목', '금', '토', '일'];

const TIME_SLOTS = [...RESERVATION_TIME_SLOTS];

export default function AdminScheduleManager({
  reservations,
  programs,
  onRefresh,
  onShowNotice
}: AdminScheduleManagerProps) {
  const [weekOffset, setWeekOffset] = useState<number>(0);
  const [blocks, setBlocks] = useState<ScheduleBlock[]>([]);
  const [loadingBlocks, setLoadingBlocks] = useState<boolean>(false);

  // Edit / Reschedule Modal State
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [editDate, setEditDate] = useState<string>('');
  const [editTime, setEditTime] = useState<string>('');
  const [editStatus, setEditStatus] = useState<string>('confirmed');
  const [editNotes, setEditNotes] = useState<string>('');
  const [notifyOnEdit, setNotifyOnEdit] = useState<boolean>(true);
  const [savingEdit, setSavingEdit] = useState<boolean>(false);

  // New Appointment Modal State
  const [showNewModal, setShowNewModal] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [newPhone, setNewPhone] = useState<string>('');
  const [newProgramId, setNewProgramId] = useState<string>('');
  const [newDate, setNewDate] = useState<string>('');
  const [newTime, setNewTime] = useState<string>('09:00');
  const [newStatus, setNewStatus] = useState<string>('confirmed');
  const [newNotes, setNewNotes] = useState<string>('');
  const [notifyOnCreate, setNotifyOnCreate] = useState<boolean>(true);
  const [creatingAppt, setCreatingAppt] = useState<boolean>(false);

  // Block Slot Modal State
  const [showBlockModal, setShowBlockModal] = useState<boolean>(false);
  const [blockTab, setBlockTab] = useState<'dates' | 'weekly' | 'monthly' | 'range'>('weekly');

  // Dates tab
  const [multiDateMode, setMultiDateMode] = useState<boolean>(false);
  const [singleBlockDate, setSingleBlockDate] = useState<string>('');
  const [multiSelectedDates, setMultiSelectedDates] = useState<string[]>([]);
  const [dateInputVal, setDateInputVal] = useState<string>('');

  // Weekly tab
  const [weekBaseDate, setWeekBaseDate] = useState<string>('');
  const [weekDaysFilter, setWeekDaysFilter] = useState<number[]>([1, 2, 3, 4, 5, 6]);

  // Monthly tab
  const [monthYear, setMonthYear] = useState<number>(2026);
  const [monthMonth, setMonthMonth] = useState<number>(9);
  const [monthDaysFilter, setMonthDaysFilter] = useState<number[]>([1, 2, 3, 4, 5, 6]);

  // Range tab
  const [rangeStartDate, setRangeStartDate] = useState<string>('');
  const [rangeEndDate, setRangeEndDate] = useState<string>('');
  const [rangeDaysFilter, setRangeDaysFilter] = useState<number[]>([1, 2, 3, 4, 5, 6]);
  const [excludeSundays, setExcludeSundays] = useState<boolean>(true);

  // Time Slot Selection (Common)
  const [isAllDay, setIsAllDay] = useState<boolean>(true);
  const [selectedSlotTimes, setSelectedSlotTimes] = useState<string[]>([]);

  // Reason & saving
  const [blockReason, setBlockReason] = useState<string>('예약 마감');
  const [savingBlock, setSavingBlock] = useState<boolean>(false);

  // All Blocks Management Modal State
  const [showAllBlocksModal, setShowAllBlocksModal] = useState<boolean>(false);
  const [selectedBlockIds, setSelectedBlockIds] = useState<number[]>([]);
  const [blockSearchTerm, setBlockSearchTerm] = useState<string>('');
  const [deletingBlocks, setDeletingBlocks] = useState<boolean>(false);

  // Bulk Unblock Modal State (주간/월간/기간 및 타임별 일괄 마감 해제)
  const [showBulkUnblockModal, setShowBulkUnblockModal] = useState<boolean>(false);
  const [unblockTab, setUnblockTab] = useState<'weekly' | 'monthly' | 'range' | 'dates'>('weekly');
  const [unblockWeekBaseDate, setUnblockWeekBaseDate] = useState<string>('');
  const [unblockWeekDaysFilter, setUnblockWeekDaysFilter] = useState<number[]>([1, 2, 3, 4, 5, 6]);
  const [unblockMonthYear, setUnblockMonthYear] = useState<number>(2026);
  const [unblockMonthMonth, setUnblockMonthMonth] = useState<number>(9);
  const [unblockMonthDaysFilter, setUnblockMonthDaysFilter] = useState<number[]>([1, 2, 3, 4, 5, 6]);
  const [unblockRangeStartDate, setUnblockRangeStartDate] = useState<string>('');
  const [unblockRangeEndDate, setUnblockRangeEndDate] = useState<string>('');
  const [unblockRangeDaysFilter, setUnblockRangeDaysFilter] = useState<number[]>([1, 2, 3, 4, 5, 6]);
  const [unblockMultiDates, setUnblockMultiDates] = useState<string[]>([]);
  const [unblockDateInputVal, setUnblockDateInputVal] = useState<string>('');
  const [unblockIsAllDay, setUnblockIsAllDay] = useState<boolean>(true);
  const [unblockSelectedSlotTimes, setUnblockSelectedSlotTimes] = useState<string[]>([]);
  const [executingUnblock, setExecutingUnblock] = useState<boolean>(false);
  const [unblockingSlot, setUnblockingSlot] = useState<string | null>(null);
  const [confirmingApptId, setConfirmingApptId] = useState<number | null>(null);

  // Direct reservation confirmation with KakaoTalk dispatch
  const handleDirectConfirmReservation = async (resv: Reservation) => {
    if (!resv.id) return;
    setConfirmingApptId(resv.id);
    try {
      const res = await fetch(`/api/reservations/${resv.id}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notify_client: true })
      });
      if (res.ok) {
        onShowNotice(`[${resv.name}] 님의 예약이 확정되었습니다. 카카오톡 알림톡이 자동 발송되었습니다.`);
        onRefresh();
      } else {
        onShowNotice('예약 확정 처리에 실패했습니다.');
      }
    } catch (err) {
      console.error(err);
      onShowNotice('서버 통신 오류가 발생했습니다.');
    } finally {
      setConfirmingApptId(null);
    }
  };

  // Fetch schedule blocks
  const loadBlocks = async () => {
    setLoadingBlocks(true);
    try {
      const res = await fetch('/api/schedule-blocks');
      if (res.ok) {
        const data = await res.json();
        setBlocks(data);
      }
    } catch (err) {
      console.error('Failed to load schedule blocks:', err);
    } finally {
      setLoadingBlocks(false);
    }
  };

  useEffect(() => {
    loadBlocks();
  }, []);

  // Today reference
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

  // Compute Monday for the given weekOffset
  const weekDays = useMemo(() => {
    const base = new Date();
    const day = base.getDay();
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
      const dayOfWeekIndex = current.getDay();

      return {
        dateObj: current,
        dateStr,
        displayMonth: current.getMonth() + 1,
        displayDate: current.getDate(),
        dayName: WEEKDAYS[i],
        isSunday: dayOfWeekIndex === 0,
        isSaturday: dayOfWeekIndex === 6,
        isToday: dateStr === todayStr,
        isPast: current < today
      };
    });
  }, [weekOffset, today, todayStr]);

  // Week range string
  const weekRangeText = useMemo(() => {
    if (weekDays.length < 7) return '';
    const first = weekDays[0];
    const last = weekDays[6];
    return `${first.dateObj.getFullYear()}년 ${first.displayMonth}월 ${first.displayDate}일 ~ ${last.displayMonth}월 ${last.displayDate}일`;
  }, [weekDays]);

  // Group reservations by "YYYY-MM-DD_HH:MM"
  const reservationsMap = useMemo(() => {
    const map = new Map<string, Reservation[]>();
    reservations.forEach(r => {
      if (r.preferred_date && r.preferred_time) {
        const key = `${r.preferred_date}_${r.preferred_time}`;
        const list = map.get(key) || [];
        list.push(r);
        map.set(key, list);
      }
    });
    return map;
  }, [reservations]);

  // Group blocks by "YYYY-MM-DD_HH:MM" or "YYYY-MM-DD_ALL"
  const blocksMap = useMemo(() => {
    const map = new Map<string, ScheduleBlock>();
    blocks.forEach(b => {
      if (b.block_date) {
        const key = b.block_time ? `${b.block_date}_${b.block_time}` : `${b.block_date}_ALL`;
        map.set(key, b);
      }
    });
    return map;
  }, [blocks]);

  // Open edit modal for reservation
  const handleOpenEdit = (res: Reservation) => {
    setEditingReservation(res);
    setEditDate(res.preferred_date || todayStr);
    setEditTime(res.preferred_time || '09:00');
    setEditStatus(res.status || 'confirmed');
    setEditNotes(res.admin_notes || '');
    setNotifyOnEdit(true);
  };

  // Open create modal prefilled with date and time
  const handleOpenCreateWithSlot = (dateStr: string, timeStr: string) => {
    setNewDate(dateStr);
    setNewTime(timeStr);
    setNewName('');
    setNewPhone('');
    setNewProgramId(programs.length > 0 ? String(programs[0].id) : '');
    setNewStatus('confirmed');
    setNewNotes('');
    setNotifyOnCreate(true);
    setShowNewModal(true);
  };

  // Open block modal with prefilled options
  const handleOpenBlockModal = (
    tab: 'dates' | 'weekly' | 'monthly' | 'range' = 'weekly',
    dateStr?: string,
    timeStr?: string
  ) => {
    const targetDate = dateStr || todayStr;
    setBlockTab(tab);
    setSingleBlockDate(targetDate);
    setMultiSelectedDates([targetDate]);
    setDateInputVal(targetDate);
    setWeekBaseDate(targetDate);

    const d = new Date(targetDate + 'T00:00:00');
    if (!isNaN(d.getTime())) {
      setMonthYear(d.getFullYear());
      setMonthMonth(d.getMonth() + 1);
    } else {
      setMonthYear(today.getFullYear());
      setMonthMonth(today.getMonth() + 1);
    }

    setRangeStartDate(targetDate);
    setRangeEndDate(targetDate);

    // Reset day filters to Mon~Sat
    setWeekDaysFilter([1, 2, 3, 4, 5, 6]);
    setMonthDaysFilter([1, 2, 3, 4, 5, 6]);
    setRangeDaysFilter([1, 2, 3, 4, 5, 6]);
    setExcludeSundays(true);

    if (timeStr) {
      setIsAllDay(false);
      setSelectedSlotTimes([timeStr]);
    } else {
      setIsAllDay(true);
      setSelectedSlotTimes([]);
    }

    setBlockReason('예약 마감');
    setShowBlockModal(true);
  };

  // Open Bulk Unblock Modal
  const handleOpenBulkUnblockModal = (
    tab: 'weekly' | 'monthly' | 'range' | 'dates' = 'weekly',
    dateStr?: string,
    timeStr?: string
  ) => {
    const viewingMondayStr = weekDays.length > 0 ? weekDays[0].dateStr : todayStr;
    const targetDate = dateStr || viewingMondayStr;
    setUnblockTab(tab);
    setUnblockWeekBaseDate(targetDate);
    const d = new Date(targetDate + 'T00:00:00');
    if (!isNaN(d.getTime())) {
      setUnblockMonthYear(d.getFullYear());
      setUnblockMonthMonth(d.getMonth() + 1);
    } else {
      setUnblockMonthYear(today.getFullYear());
      setUnblockMonthMonth(today.getMonth() + 1);
    }
    setUnblockRangeStartDate(targetDate);
    setUnblockRangeEndDate(targetDate);
    setUnblockMultiDates([targetDate]);
    setUnblockDateInputVal(targetDate);

    // Reset day filters to Mon~Sat
    setUnblockWeekDaysFilter([1, 2, 3, 4, 5, 6]);
    setUnblockMonthDaysFilter([1, 2, 3, 4, 5, 6]);
    setUnblockRangeDaysFilter([1, 2, 3, 4, 5, 6]);

    if (timeStr) {
      setUnblockIsAllDay(false);
      setUnblockSelectedSlotTimes([timeStr]);
    } else {
      setUnblockIsAllDay(true);
      setUnblockSelectedSlotTimes([]);
    }

    setShowBulkUnblockModal(true);
  };

  // Open block modal prefilled with date and time
  const handleOpenBlockWithSlot = (dateStr: string, timeStr?: string, defaultMode: 'single' | 'range' = 'single') => {
    handleOpenBlockModal(defaultMode === 'range' ? 'weekly' : 'dates', dateStr, timeStr);
  };

  // Quick toggle a single slot's block/close state
  const handleQuickToggleBlock = async (dateStr: string, timeStr: string, currentBlock?: ScheduleBlock) => {
    try {
      const res = await fetch('/api/schedule-blocks/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          block_date: dateStr,
          block_time: timeStr,
          reason: '예약 마감'
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.action === 'blocked') {
          onShowNotice(`[${dateStr} ${timeStr}] 예약 마감 처리되었습니다.`);
        } else {
          onShowNotice(`[${dateStr} ${timeStr}] 마감이 해제되어 예약 가능합니다.`);
        }
        loadBlocks();
      } else {
        alert('마감 설정 변경 중 오류가 발생했습니다.');
      }
    } catch (err) {
      console.error(err);
      alert('서버 통신 오류가 발생했습니다.');
    }
  };

  // Unblock a single slot directly (handles both slot block and whole-day block split)
  const handleUnblockSlot = async (dateStr: string, timeStr: string, blockItem?: ScheduleBlock) => {
    const slotKey = `${dateStr}_${timeStr}`;
    setUnblockingSlot(slotKey);
    try {
      const res = await fetch('/api/schedule-blocks/unblock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          block_date: dateStr,
          block_time: timeStr
        })
      });

      if (res.ok) {
        onShowNotice(`[${dateStr} ${timeStr}] 예약 마감이 정상적으로 해제되었습니다.`);
        await loadBlocks();
        if (onRefresh) onRefresh();
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || '마감 해제 처리 중 오류가 발생했습니다.');
      }
    } catch (err) {
      console.error(err);
      alert('서버 통신 오류가 발생했습니다.');
    } finally {
      setUnblockingSlot(null);
    }
  };

  // Toggle full day block directly (unblock or block)
  const handleToggleDayBlock = async (dateStr: string, isCurrentlyBlocked?: boolean) => {
    try {
      if (isCurrentlyBlocked) {
        const res = await fetch('/api/schedule-blocks/unblock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            block_date: dateStr,
            unblock_all_day: true
          })
        });
        if (res.ok) {
          onShowNotice(`[${dateStr}] 전일 마감이 정상적으로 해제되었습니다.`);
          await loadBlocks();
          if (onRefresh) onRefresh();
        } else {
          alert('전일 마감 해제 중 오류가 발생했습니다.');
        }
      } else {
        const res = await fetch('/api/schedule-blocks/toggle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            block_date: dateStr,
            block_time: null,
            reason: '예약 마감 (전일)'
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.action === 'blocked') {
            onShowNotice(`[${dateStr}] 전일 모든 회차가 예약 마감 처리되었습니다.`);
          } else {
            onShowNotice(`[${dateStr}] 전일 마감이 해제되었습니다.`);
          }
          await loadBlocks();
          if (onRefresh) onRefresh();
        } else {
          alert('전일 마감 설정 중 오류가 발생했습니다.');
        }
      }
    } catch (err) {
      console.error(err);
      alert('서버 통신 오류가 발생했습니다.');
    }
  };

  // Submit Edit Reservation
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReservation?.id) return;
    setSavingEdit(true);

    try {
      const res = await fetch(`/api/reservations/${editingReservation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferred_date: editDate,
          preferred_time: editTime,
          status: editStatus,
          admin_notes: editNotes,
          notify_client: notifyOnEdit
        })
      });

      if (res.ok) {
        const data = await res.json();
        onShowNotice(`예약 일정이 성공적으로 수정되었습니다.${data.notification ? ' (고객 알림톡/문자 발송됨)' : ''}`);
        setEditingReservation(null);
        onRefresh();
      } else {
        alert('예약 수정에 실패했습니다.');
      }
    } catch (err) {
      console.error(err);
      alert('서버 통신 중 오류가 발생했습니다.');
    } finally {
      setSavingEdit(false);
    }
  };

  // Submit Create Reservation
  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim() || !newDate || !newTime) {
      alert('신청자명, 연락처, 희망 일시를 모두 입력해 주세요.');
      return;
    }

    setCreatingAppt(true);
    try {
      const res = await fetch('/api/reservations/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          phone: newPhone.trim(),
          program_id: newProgramId ? parseInt(newProgramId, 10) : null,
          preferred_date: newDate,
          preferred_time: newTime,
          status: newStatus,
          admin_notes: newNotes,
          notify_client: notifyOnCreate
        })
      });

      if (res.ok) {
        onShowNotice(`새 상담 일정이 등록되었습니다.${notifyOnCreate ? ' (고객 알림톡/문자 발송됨)' : ''}`);
        setShowNewModal(false);
        onRefresh();
      } else {
        alert('일정 등록에 실패했습니다.');
      }
    } catch (err) {
      console.error(err);
      alert('서버 통신 오류가 발생했습니다.');
    } finally {
      setCreatingAppt(false);
    }
  };

  // Helper to format Date to YYYY-MM-DD
  const formatDateStr = (d: Date): string => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Helper to get Monday of a week
  const getMondayOfDate = (d: Date): Date => {
    const copy = new Date(d);
    const day = copy.getDay();
    const diff = copy.getDate() - day + (day === 0 ? -6 : 1);
    copy.setDate(diff);
    copy.setHours(0, 0, 0, 0);
    return copy;
  };

  // Toggle helper for weekdays
  const handleToggleWeekday = (day: number, current: number[], setFn: React.Dispatch<React.SetStateAction<number[]>>) => {
    if (current.includes(day)) {
      if (current.length > 1) {
        setFn(prev => prev.filter(d => d !== day));
      } else {
        alert('최소 1개 이상의 요일을 선택해야 합니다.');
      }
    } else {
      setFn(prev => [...prev, day].sort());
    }
  };

  // Toggle helper for slot times
  const handleToggleSlotTime = (timeVal: string) => {
    setIsAllDay(false);
    setSelectedSlotTimes(prev => {
      if (prev.includes(timeVal)) {
        return prev.filter(t => t !== timeVal);
      } else {
        return [...prev, timeVal].sort();
      }
    });
  };

  // Specific Dates Handlers
  const handleAddSpecificDate = (val?: string) => {
    const dateStr = val || dateInputVal;
    if (!dateStr) return;
    if (multiSelectedDates.includes(dateStr)) {
      alert('이미 추가된 날짜입니다.');
      return;
    }
    setMultiSelectedDates(prev => [...prev, dateStr].sort());
  };

  const handleRemoveSpecificDate = (dateStr: string) => {
    setMultiSelectedDates(prev => prev.filter(d => d !== dateStr));
  };

  // Computed target dates based on active tab and filters
  const computedTargetDates = useMemo<string[]>(() => {
    if (blockTab === 'dates') {
      if (multiDateMode) {
        return Array.from(new Set(multiSelectedDates)).filter(Boolean).sort();
      } else {
        return singleBlockDate ? [singleBlockDate] : [];
      }
    }

    if (blockTab === 'weekly') {
      if (!weekBaseDate) return [];
      const base = new Date(weekBaseDate + 'T00:00:00');
      if (isNaN(base.getTime())) return [];
      const mon = getMondayOfDate(base);
      const res: string[] = [];
      for (let i = 0; i < 7; i++) {
        const cur = new Date(mon);
        cur.setDate(mon.getDate() + i);
        const dayOfWeek = cur.getDay(); // 0 is Sun, 1 is Mon...
        if (weekDaysFilter.includes(dayOfWeek)) {
          res.push(formatDateStr(cur));
        }
      }
      return res.sort();
    }

    if (blockTab === 'monthly') {
      const res: string[] = [];
      const daysInMonth = new Date(monthYear, monthMonth, 0).getDate();
      for (let d = 1; d <= daysInMonth; d++) {
        const cur = new Date(monthYear, monthMonth - 1, d);
        const dayOfWeek = cur.getDay();
        if (monthDaysFilter.includes(dayOfWeek)) {
          res.push(formatDateStr(cur));
        }
      }
      return res.sort();
    }

    if (blockTab === 'range') {
      if (!rangeStartDate || !rangeEndDate || rangeStartDate > rangeEndDate) return [];
      const start = new Date(rangeStartDate + 'T00:00:00');
      const end = new Date(rangeEndDate + 'T00:00:00');
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return [];
      const res: string[] = [];
      const cur = new Date(start);
      while (cur <= end) {
        const dayOfWeek = cur.getDay();
        const isSunExcluded = excludeSundays && dayOfWeek === 0;
        if (!isSunExcluded && rangeDaysFilter.includes(dayOfWeek)) {
          res.push(formatDateStr(cur));
        }
        cur.setDate(cur.getDate() + 1);
      }
      return res.sort();
    }

    return [];
  }, [
    blockTab,
    multiDateMode,
    singleBlockDate,
    multiSelectedDates,
    weekBaseDate,
    weekDaysFilter,
    monthYear,
    monthMonth,
    monthDaysFilter,
    rangeStartDate,
    rangeEndDate,
    rangeDaysFilter,
    excludeSundays
  ]);

  // Computed target dates for bulk UNBLOCK
  const computedUnblockTargetDates = useMemo<string[]>(() => {
    if (unblockTab === 'dates') {
      return Array.from(new Set(unblockMultiDates)).filter(Boolean).sort();
    }

    if (unblockTab === 'weekly') {
      if (!unblockWeekBaseDate) return [];
      const base = new Date(unblockWeekBaseDate + 'T00:00:00');
      if (isNaN(base.getTime())) return [];
      const mon = getMondayOfDate(base);
      const res: string[] = [];
      for (let i = 0; i < 7; i++) {
        const cur = new Date(mon);
        cur.setDate(mon.getDate() + i);
        const dayOfWeek = cur.getDay();
        if (unblockWeekDaysFilter.includes(dayOfWeek)) {
          res.push(formatDateStr(cur));
        }
      }
      return res.sort();
    }

    if (unblockTab === 'monthly') {
      const res: string[] = [];
      const daysInMonth = new Date(unblockMonthYear, unblockMonthMonth, 0).getDate();
      for (let d = 1; d <= daysInMonth; d++) {
        const cur = new Date(unblockMonthYear, unblockMonthMonth - 1, d);
        const dayOfWeek = cur.getDay();
        if (unblockMonthDaysFilter.includes(dayOfWeek)) {
          res.push(formatDateStr(cur));
        }
      }
      return res.sort();
    }

    if (unblockTab === 'range') {
      if (!unblockRangeStartDate || !unblockRangeEndDate || unblockRangeStartDate > unblockRangeEndDate) return [];
      const start = new Date(unblockRangeStartDate + 'T00:00:00');
      const end = new Date(unblockRangeEndDate + 'T00:00:00');
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return [];
      const res: string[] = [];
      const cur = new Date(start);
      while (cur <= end) {
        const dayOfWeek = cur.getDay();
        if (dayOfWeek !== 0 && unblockRangeDaysFilter.includes(dayOfWeek)) {
          res.push(formatDateStr(cur));
        }
        cur.setDate(cur.getDate() + 1);
      }
      return res.sort();
    }

    return [];
  }, [
    unblockTab,
    unblockMultiDates,
    unblockWeekBaseDate,
    unblockWeekDaysFilter,
    unblockMonthYear,
    unblockMonthMonth,
    unblockMonthDaysFilter,
    unblockRangeStartDate,
    unblockRangeEndDate,
    unblockRangeDaysFilter
  ]);

  // Execute Batch Unblock by criteria (주간, 월간, 기간 등 일괄 마감 해제)
  const handleExecuteBatchUnblock = async () => {
    if (computedUnblockTargetDates.length === 0) {
      onShowNotice('마감을 해제할 대상 날짜가 없습니다. 날짜 및 요일 설정을 확인해 주세요.');
      return;
    }

    if (!unblockIsAllDay && unblockSelectedSlotTimes.length === 0) {
      onShowNotice('마감을 해제할 시간대를 최소 1개 이상 선택해 주세요. (또는 하루 종일 전체 마감 해제 선택)');
      return;
    }

    const slotDesc = unblockIsAllDay
      ? '전체 회차(하루 종일)'
      : `${unblockSelectedSlotTimes.length}개 회차 (${unblockSelectedSlotTimes.join(', ')})`;

    setExecutingUnblock(true);
    try {
      const payload: any = {
        dates: computedUnblockTargetDates,
        block_times: unblockIsAllDay ? null : unblockSelectedSlotTimes
      };

      const res = await fetch('/api/schedule-blocks/batch-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        onShowNotice(`[총 ${computedUnblockTargetDates.length}일간 / ${slotDesc}] 마감이 성공적으로 일괄 해제되었습니다. (해제 건수: ${data.deleted || 0}건)`);
        setShowBulkUnblockModal(false);
        await loadBlocks();
        if (onRefresh) onRefresh();
      } else {
        const errData = await res.json().catch(() => ({}));
        onShowNotice(errData.error || '마감 일괄 해제 중 오류가 발생했습니다.');
      }
    } catch (err) {
      console.error(err);
      onShowNotice('서버 통신 오류가 발생했습니다.');
    } finally {
      setExecutingUnblock(false);
    }
  };

  // Submit Schedule Block
  const handleSaveBlock = async (e: React.FormEvent) => {
    e.preventDefault();

    if (computedTargetDates.length === 0) {
      alert('마감할 대상 날짜가 없습니다. 날짜 및 요일 설정을 확인해 주세요.');
      return;
    }

    if (!isAllDay && selectedSlotTimes.length === 0) {
      alert('마감할 시간대를 최소 1개 이상 선택해 주세요. (또는 하루 종일 전체 마감 선택)');
      return;
    }

    setSavingBlock(true);

    try {
      const payload = {
        dates: computedTargetDates,
        block_times: isAllDay ? [null] : selectedSlotTimes,
        reason: blockReason || '예약 마감'
      };

      const res = await fetch('/api/schedule-blocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        const slotText = isAllDay ? '하루 종일 5회차 전체' : `${selectedSlotTimes.length}개 회차 (${selectedSlotTimes.join(', ')})`;
        onShowNotice(`[총 ${computedTargetDates.length}일간 / ${slotText}] 마감 설정이 성공적으로 등록되었습니다.`);
        setShowBlockModal(false);
        loadBlocks();
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || '마감 일정 설정에 실패했습니다.');
      }
    } catch (err) {
      console.error(err);
      alert('서버 통신 오류가 발생했습니다.');
    } finally {
      setSavingBlock(false);
    }
  };

  // Batch Delete Schedule Blocks
  const handleBatchDeleteBlocks = async (ids: number[]) => {
    if (!ids.length) return;

    setDeletingBlocks(true);
    try {
      const res = await fetch('/api/schedule-blocks/batch-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids })
      });
      if (res.ok) {
        onShowNotice(`${ids.length}건의 마감 일정이 성공적으로 해제되었습니다.`);
        setSelectedBlockIds([]);
        await loadBlocks();
        if (onRefresh) onRefresh();
      } else {
        onShowNotice('마감 일정 삭제 중 오류가 발생했습니다.');
      }
    } catch (err) {
      console.error(err);
      onShowNotice('서버 통신 오류가 발생했습니다.');
    } finally {
      setDeletingBlocks(false);
    }
  };

  // Clear past expired blocks
  const handleClearPastBlocks = async () => {
    const pastBlocks = blocks.filter(b => b.block_date < todayStr);
    if (!pastBlocks.length) {
      onShowNotice('오늘 이전의 지난 마감 일정이 없습니다.');
      return;
    }

    const ids = pastBlocks.map(b => b.id!).filter(Boolean);
    await handleBatchDeleteBlocks(ids);
  };

  // Delete Single Schedule Block
  const handleDeleteBlock = async (id: number) => {
    try {
      const res = await fetch(`/api/schedule-blocks/${id}`, { method: 'DELETE' });
      if (res.ok) {
        onShowNotice('마감 설정이 정상적으로 해제되었습니다.');
        await loadBlocks();
        if (onRefresh) onRefresh();
      } else {
        onShowNotice('마감 해제 중 오류가 발생했습니다.');
      }
    } catch (err) {
      console.error(err);
      onShowNotice('서버 통신 오류가 발생했습니다.');
    }
  };

  // Status Badge Helper
  const getStatusBadge = (st: string = 'pending') => {
    switch (st) {
      case 'confirmed':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">예약 확정</span>;
      case 'completed':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">상담 완료</span>;
      case 'cancelled':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-100 text-gray-600 border border-gray-300 line-through">취소됨</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">접수 대기</span>;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-brand-green/20 shadow-md p-6 sm:p-8">
      {/* Schedule Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-brand-green/20 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-sage text-white flex items-center gap-1 shadow-xs">
              <CalendarCheck className="w-3.5 h-3.5" />
              스마트 상담 일정표
            </span>
            <span className="text-xs text-brand-brown/60">
              슬롯을 클릭하여 예약을 수정하거나 전화/방문 상담을 즉시 등록할 수 있습니다.
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-serif text-brand-brown flex items-center gap-2">
            <Clock className="w-6 h-6 text-brand-sage" />
            주간 상담 일정 관리 매트릭스
          </h3>
        </div>

        {/* Action Buttons & Week Navigator */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              setNewDate(todayStr);
              setNewTime('09:00');
              setNewName('');
              setNewPhone('');
              setNewNotes('');
              setShowNewModal(true);
            }}
            className="px-4 py-2 bg-brand-sage hover:bg-brand-sage/90 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>새 예약 직접 등록</span>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleOpenBlockModal('weekly')}
              className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              title="주간, 월간, 특정 기간 및 특정 시간대 예약 마감"
            >
              <CalendarRange className="w-3.5 h-3.5" />
              <span>마감 설정</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenBulkUnblockModal('weekly')}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              title="주간, 월간 또는 회차별 일괄 마감 해제"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>일괄 마감 해제</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenBlockModal('dates')}
              className="px-3 py-2 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              title="원하는 특정 날짜와 시간대 마감"
            >
              <Lock className="w-3.5 h-3.5 text-rose-600" />
              <span>특정일 마감</span>
            </button>
          </div>

          {/* Week Selector */}
          <div className="flex items-center gap-1 bg-brand-beige/30 p-1 rounded-xl border border-brand-green/20">
            <button
              type="button"
              onClick={() => setWeekOffset(prev => prev - 1)}
              className="p-1.5 hover:bg-white rounded-lg text-brand-brown transition-all"
              title="이전 주"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 text-xs font-bold text-brand-brown whitespace-nowrap">
              {weekRangeText}
            </span>
            <button
              type="button"
              onClick={() => setWeekOffset(prev => prev + 1)}
              className="p-1.5 hover:bg-white rounded-lg text-brand-brown transition-all"
              title="다음 주"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            {weekOffset !== 0 && (
              <button
                type="button"
                onClick={() => setWeekOffset(0)}
                className="ml-1 px-2 py-0.5 bg-white text-brand-sage font-bold text-[11px] rounded-md border border-brand-green/30"
              >
                이번 주
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active Schedule Blocks Summary Bar */}
      {blocks.length > 0 && (
        <div className="mb-6 p-3.5 bg-rose-50/80 border border-rose-200 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-rose-950 flex-wrap">
            <Lock className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-bold">설정된 예약 마감 및 휴진 ({blocks.length}건):</span>
            <div className="flex flex-wrap gap-1.5">
              {blocks.slice(0, 5).map(b => (
                <span key={b.id} className="inline-flex items-center gap-1 px-2.5 py-1 bg-white text-rose-900 rounded-lg border border-rose-200 text-[11px] shadow-2xs">
                  <strong>{b.block_date}</strong> {b.block_time || '전일마감'} <span className="text-rose-600 font-medium">({b.reason})</span>
                  <button 
                    onClick={() => b.id && handleDeleteBlock(b.id)}
                    className="hover:text-rose-700 ml-1.5 font-extrabold cursor-pointer text-rose-400 hover:text-rose-900"
                    title="마감 해제"
                  >
                    ×
                  </button>
                </span>
              ))}
              {blocks.length > 5 && (
                <button
                  type="button"
                  onClick={() => setShowAllBlocksModal(true)}
                  className="text-[11px] text-rose-700 font-bold hover:underline cursor-pointer self-center"
                >
                  외 {blocks.length - 5}건 더보기...
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleOpenBulkUnblockModal('weekly')}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] cursor-pointer flex items-center gap-1 shadow-2xs"
              title="조건별 일괄 마감 해제"
            >
              <Unlock className="w-3 h-3" />
              <span>일괄 해제</span>
            </button>
            <button
              type="button"
              onClick={() => setShowAllBlocksModal(true)}
              className="px-2.5 py-1 bg-white hover:bg-rose-100 text-rose-800 font-bold rounded-lg border border-rose-200 text-[11px] cursor-pointer shadow-2xs"
            >
              마감 목록 관리 ({blocks.length})
            </button>
            <button
              type="button"
              onClick={() => handleOpenBlockModal('weekly')}
              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-[11px] cursor-pointer flex items-center gap-1 shadow-2xs"
            >
              <CalendarRange className="w-3 h-3" />
              <span>+ 마감 설정 추가</span>
            </button>
          </div>
        </div>
      )}

      {/* Timetable Grid (Desktop: 7 days, Mobile: Scrollable table) */}
      <div className="overflow-x-auto border border-brand-green/20 rounded-2xl bg-white shadow-2xs">
        <table className="w-full min-w-[900px] text-left border-collapse">
          <thead>
            <tr className="bg-brand-beige/40 border-b border-brand-green/20">
              <th className="py-3 px-3 w-20 text-center text-xs font-bold text-brand-brown/70 uppercase">
                시간
              </th>
              {weekDays.map(day => (
                <th 
                  key={day.dateStr} 
                  className={`py-3 px-3 text-center border-l border-brand-green/15 ${
                    day.isToday ? 'bg-brand-sage/15' : ''
                  }`}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span className={`text-xs font-bold ${
                      day.isSunday ? 'text-red-500' : day.isSaturday ? 'text-blue-600' : 'text-brand-brown'
                    }`}>
                      {day.dayName}
                    </span>
                    {day.isToday && (
                      <span className="px-1.5 py-0.2 bg-brand-sage text-white text-[9px] font-bold rounded-full">
                        오늘
                      </span>
                    )}
                  </div>
                  <div className={`text-sm font-extrabold ${day.isSunday ? 'text-red-600' : 'text-brand-brown'}`}>
                    {day.displayMonth}/{day.displayDate}
                  </div>
                  {!day.isSunday && (
                    <div className="mt-1 flex justify-center">
                      {blocksMap.has(`${day.dateStr}_ALL`) || TIME_SLOTS.every(t => blocksMap.has(`${day.dateStr}_${t}`)) ? (
                        <button
                          type="button"
                          onClick={() => handleToggleDayBlock(day.dateStr, true)}
                          className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-800 hover:bg-rose-200 transition-colors cursor-pointer border border-rose-300 flex items-center gap-0.5"
                          title="이 날의 전일 마감을 해제합니다"
                        >
                          <Unlock className="w-2.5 h-2.5" />
                          <span>전일마감 해제</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleToggleDayBlock(day.dateStr, false)}
                          className="px-1.5 py-0.5 rounded text-[9px] font-medium text-brand-brown/50 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer border border-brand-green/20 hover:border-rose-300"
                          title="이 날 전체 5개 회차를 모두 마감합니다"
                        >
                          전일 마감
                        </button>
                      )}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-green/15 text-xs">
            {TIME_SLOTS.map((timeStr) => (
              <tr key={timeStr} className="hover:bg-brand-beige/5 transition-colors">
                {/* Time Label Column */}
                <td className="py-3.5 px-2 text-center text-brand-brown/80 bg-brand-beige/10 border-r border-brand-green/15">
                  <div className="text-[10px] text-brand-sage font-bold">{TIME_SLOT_DETAILS[timeStr]?.session}</div>
                  <div className="font-mono text-xs font-extrabold text-brand-brown">{timeStr}</div>
                </td>

                {/* Day Columns */}
                {weekDays.map(day => {
                  const key = `${day.dateStr}_${timeStr}`;
                  const appts = reservationsMap.get(key) || [];
                  const isDayBlocked = blocksMap.has(`${day.dateStr}_ALL`);
                  const isSlotBlocked = isDayBlocked || blocksMap.has(key);
                  const blockItem = isDayBlocked ? blocksMap.get(`${day.dateStr}_ALL`) : blocksMap.get(key);

                  // Sunday rule
                  if (day.isSunday) {
                    return (
                      <td key={day.dateStr} className="p-2 border-l border-brand-green/10 bg-gray-50/60 text-center align-middle">
                        <span className="text-[10px] text-gray-400 font-semibold">정기휴무</span>
                      </td>
                    );
                  }

                  // Saturday 19:00 rule (Saturday operates 09:00, 10:30, 14:00, 15:30 only)
                  if (day.isSaturday && timeStr === '19:00') {
                    return (
                      <td key={day.dateStr} className="p-2 border-l border-brand-green/10 bg-gray-50/50 text-center align-middle">
                        <span className="text-[10px] text-gray-400 font-semibold">토요일 미운영</span>
                      </td>
                    );
                  }

                  // Blocked slot
                  if (isSlotBlocked) {
                    const isClosed = blockItem?.reason?.includes('마감') || !blockItem?.reason || blockItem?.reason === '예약 마감';
                    const isCurrentSlotUnblocking = unblockingSlot === key;

                    return (
                      <td key={day.dateStr} className="p-1.5 border-l border-brand-green/10 bg-rose-50/40 align-top">
                        <div className="p-2 rounded-xl border border-rose-200 bg-white text-rose-900 text-[11px] flex flex-col justify-between h-full min-h-[68px] shadow-2xs">
                          <div>
                            <div className="font-bold flex items-center justify-between gap-1">
                              <span className="flex items-center gap-1 text-rose-800">
                                <Lock className="w-3 h-3 text-rose-600 shrink-0" />
                                <span>{isClosed ? '예약 마감' : '휴진/불가'}</span>
                              </span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 font-bold">
                                {isDayBlocked ? '전일마감' : '마감'}
                              </span>
                            </div>
                            <div className="text-[10px] text-rose-700/80 truncate mt-1">
                              {blockItem?.reason || '예약 마감'}
                            </div>
                          </div>

                          <div className="mt-2 space-y-1">
                            <button
                              type="button"
                              disabled={isCurrentSlotUnblocking}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUnblockSlot(day.dateStr, timeStr, blockItem);
                              }}
                              className="w-full py-1 text-[11px] bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white font-bold rounded-lg border border-emerald-300 hover:border-emerald-600 transition-all cursor-pointer text-center flex items-center justify-center gap-1 shadow-2xs active:scale-95 disabled:opacity-50"
                              title="이 시간대 마감을 해제하고 예약을 다시 오픈합니다"
                            >
                              {isCurrentSlotUnblocking ? (
                                <RefreshCw className="w-3 h-3 animate-spin text-emerald-600" />
                              ) : (
                                <Unlock className="w-3 h-3 text-emerald-600 group-hover:text-white" />
                              )}
                              <span>{isCurrentSlotUnblocking ? '해제 중...' : '마감 해제'}</span>
                            </button>

                            {isDayBlocked && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleDayBlock(day.dateStr, true);
                                }}
                                className="w-full py-0.5 text-[10px] text-rose-700 hover:text-rose-900 hover:underline text-center cursor-pointer font-medium"
                                title="이 날 5회차 전체 마감을 일괄 해제합니다"
                              >
                                날짜 전체(5회차) 해제
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                    );
                  }

                  // Appointments booked in this slot
                  return (
                    <td key={day.dateStr} className="p-1.5 border-l border-brand-green/10 align-top">
                      {appts.length > 0 ? (
                        <div className="space-y-1.5">
                          {appts.map(a => (
                            <div
                              key={a.id}
                              onClick={() => handleOpenEdit(a)}
                              className={`p-2.5 rounded-xl border transition-all cursor-pointer shadow-2xs hover:shadow-sm hover:scale-[1.01] ${
                                a.status === 'confirmed'
                                  ? 'bg-emerald-50/90 border-emerald-200 hover:border-emerald-400'
                                  : a.status === 'completed'
                                  ? 'bg-blue-50/90 border-blue-200 hover:border-blue-400'
                                  : a.status === 'cancelled'
                                  ? 'bg-gray-100 border-gray-200 opacity-60'
                                  : 'bg-amber-50/90 border-amber-300 hover:border-amber-400'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-1 mb-1">
                                {getStatusBadge(a.status)}
                                <button
                                  type="button"
                                  className="text-brand-brown/40 hover:text-brand-sage"
                                  title="일정 수정"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                              </div>
                              <div className="font-bold text-brand-brown text-xs flex items-center gap-1">
                                <User className="w-3 h-3 text-brand-sage" />
                                <span>{a.name}</span>
                              </div>
                              <div className="text-[11px] text-brand-brown/70 font-mono">
                                {a.phone}
                              </div>
                              <div className="text-[10px] text-brand-sage font-medium truncate mt-0.5">
                                {a.program_title || '맞춤상담'}
                              </div>
                              {a.admin_notes && (
                                <div className="mt-1 p-1 bg-white/70 rounded text-[9px] text-brand-brown/70 italic line-clamp-1">
                                  "{a.admin_notes}"
                                </div>
                              )}

                              {a.status === 'pending' && (
                                <button
                                  type="button"
                                  disabled={confirmingApptId === a.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDirectConfirmReservation(a);
                                  }}
                                  className="mt-2 w-full py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[10px] flex items-center justify-center gap-1 shadow-xs cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                                  title="예약 확정 승인 (고객에게 카카오톡 알림톡 즉시 자동 발송)"
                                >
                                  {confirmingApptId === a.id ? (
                                    <RefreshCw className="w-3 h-3 animate-spin text-white" />
                                  ) : (
                                    <CheckCircle2 className="w-3 h-3 text-white" />
                                  )}
                                  <span>{confirmingApptId === a.id ? '확정 처리 중...' : '예약 확정 승인 (알림톡)'}</span>
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="w-full h-full min-h-[58px] flex flex-col justify-center gap-1 p-1 rounded-xl border border-dashed border-brand-green/25 hover:border-brand-sage bg-white/70 hover:bg-brand-sage/5 transition-all">
                          <button
                            type="button"
                            onClick={() => handleOpenCreateWithSlot(day.dateStr, timeStr)}
                            className="w-full py-1 px-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                            title={`${day.dateStr} ${timeStr} 새 예약 등록`}
                          >
                            <Plus className="w-3 h-3 text-emerald-600" />
                            <span>예약 등록</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickToggleBlock(day.dateStr, timeStr)}
                            className="w-full py-1 px-1.5 rounded-lg bg-gray-50 hover:bg-rose-50 text-gray-600 hover:text-rose-700 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer border border-gray-200/70 hover:border-rose-300"
                            title={`${day.dateStr} ${timeStr} 예약 마감 처리`}
                          >
                            <Lock className="w-3 h-3 text-gray-500 hover:text-rose-600" />
                            <span>마감 설정</span>
                          </button>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit / Reschedule Modal */}
      <AnimatePresence>
        {editingReservation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-brand-green/30"
            >
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-brand-green/20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-brand-sage text-white rounded-xl flex items-center justify-center shadow-xs">
                    <Edit3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-brown text-base">상담 일정 변경 및 관리</h3>
                    <p className="text-xs text-brand-brown/60">내담자: {editingReservation.name} ({editingReservation.phone})</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingReservation(null)}
                  className="p-1.5 text-brand-brown/40 hover:text-brand-brown rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-brand-brown/70 block mb-1">상담 날짜</label>
                    <input
                      type="date"
                      required
                      value={editDate}
                      onChange={e => setEditDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-brand-green/30 text-xs font-medium bg-brand-beige/10 focus:border-brand-sage outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-brand-brown/70 block mb-1">상담 시간</label>
                    <select
                      value={editTime}
                      onChange={e => setEditTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-brand-green/30 text-xs font-medium bg-brand-beige/10 focus:border-brand-sage outline-none"
                    >
                      {TIME_SLOTS.map(t => (
                        <option key={t} value={t}>
                          {TIME_SLOT_DETAILS[t]?.session ? `${TIME_SLOT_DETAILS[t].session} (${t})` : t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-brand-brown/70 block mb-1">예약 상태</label>
                  <select
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-brand-green/30 text-xs font-bold bg-brand-beige/10 focus:border-brand-sage outline-none"
                  >
                    <option value="pending">⏳ 접수 대기</option>
                    <option value="confirmed">✅ 예약 확정</option>
                    <option value="completed">🎉 상담 완료</option>
                    <option value="cancelled">❌ 예약 취소</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-brand-brown/70 block mb-1">상담 관리 메모 (내부용)</label>
                  <textarea
                    rows={2}
                    value={editNotes}
                    onChange={e => setEditNotes(e.target.value)}
                    placeholder="내담자 특이사항, 배정 상담사, 진행 내용 등"
                    className="w-full px-3 py-2 rounded-xl border border-brand-green/30 text-xs bg-brand-beige/10 focus:border-brand-sage outline-none"
                  />
                </div>

                {/* Auto Notification Checkbox */}
                <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start gap-2 text-xs">
                  <input
                    type="checkbox"
                    id="notifyOnEdit"
                    checked={notifyOnEdit}
                    onChange={e => setNotifyOnEdit(e.target.checked)}
                    className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                  <label htmlFor="notifyOnEdit" className="text-amber-950 leading-relaxed cursor-pointer">
                    <span className="font-bold flex items-center gap-1 text-amber-900">
                      <MessageSquareText className="w-3.5 h-3.5 text-amber-600" />
                      고객에게 변경된 일정 카카오 알림톡/문자 자동 발송
                    </span>
                    <span className="text-[11px] text-amber-800/80 block">
                      수정된 날짜 및 시간으로 고객 단말기에 일정 변경 확인 안내를 즉시 전송합니다.
                    </span>
                  </label>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingReservation(null)}
                    className="px-4 py-2 border border-brand-green/30 rounded-xl text-xs font-bold text-brand-brown/70 hover:bg-brand-beige/30"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={savingEdit}
                    className="px-5 py-2 bg-brand-sage hover:bg-brand-sage/90 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-1.5 disabled:opacity-60 cursor-pointer"
                  >
                    {savingEdit && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                    <span>일정 변경 저장하기</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* New Appointment Modal */}
      <AnimatePresence>
        {showNewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-brand-green/30"
            >
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-brand-green/20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-brand-sage text-white rounded-xl flex items-center justify-center shadow-xs">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-brown text-base">새 상담 일정 직접 등록</h3>
                    <p className="text-xs text-brand-brown/60">전화 또는 방문 접수 건을 바로 등록합니다.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="p-1.5 text-brand-brown/40 hover:text-brand-brown rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateAppointment} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-brand-brown/70 block mb-1">내담자 성함 *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="예: 홍길동"
                    className="w-full px-3 py-2 rounded-xl border border-brand-green/30 text-xs bg-brand-beige/10 focus:border-brand-sage outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-brand-brown/70 block mb-1">연락처 *</label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={e => setNewPhone(e.target.value)}
                    placeholder="예: 010-1234-5678"
                    className="w-full px-3 py-2 rounded-xl border border-brand-green/30 text-xs bg-brand-beige/10 focus:border-brand-sage outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-brand-brown/70 block mb-1">상담 프로그램</label>
                  <select
                    value={newProgramId}
                    onChange={e => setNewProgramId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-brand-green/30 text-xs bg-brand-beige/10 focus:border-brand-sage outline-none"
                  >
                    <option value="">프로그램 선택 안 함 (맞춤상담)</option>
                    {programs.map(p => (
                      <option key={p.id} value={p.id}>[{p.category}] {p.title}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-brand-brown/70 block mb-1">상담 날짜 *</label>
                    <input
                      type="date"
                      required
                      value={newDate}
                      onChange={e => setNewDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-brand-green/30 text-xs bg-brand-beige/10 focus:border-brand-sage outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-brand-brown/70 block mb-1">상담 시간 *</label>
                    <select
                      value={newTime}
                      onChange={e => setNewTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-brand-green/30 text-xs bg-brand-beige/10 focus:border-brand-sage outline-none"
                    >
                      {TIME_SLOTS.map(t => (
                        <option key={t} value={t}>
                          {TIME_SLOT_DETAILS[t]?.session ? `${TIME_SLOT_DETAILS[t].session} (${t})` : t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-brand-brown/70 block mb-1">관리 메모 (상담 특이사항 등)</label>
                  <input
                    type="text"
                    value={newNotes}
                    onChange={e => setNewNotes(e.target.value)}
                    placeholder="전화 접수 / 추천인 / 주 호소 문제 등"
                    className="w-full px-3 py-2 rounded-xl border border-brand-green/30 text-xs bg-brand-beige/10 focus:border-brand-sage outline-none"
                  />
                </div>

                {/* Auto Notification Checkbox */}
                <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start gap-2 text-xs">
                  <input
                    type="checkbox"
                    id="notifyOnCreate"
                    checked={notifyOnCreate}
                    onChange={e => setNotifyOnCreate(e.target.checked)}
                    className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                  <label htmlFor="notifyOnCreate" className="text-amber-950 leading-relaxed cursor-pointer">
                    <span className="font-bold flex items-center gap-1 text-amber-900">
                      <MessageSquareText className="w-3.5 h-3.5 text-amber-600" />
                      등록 즉시 고객에게 알림톡/문자 확정 발송
                    </span>
                    <span className="text-[11px] text-amber-800/80 block">
                      상담소 위치 및 확정 일정 안내가 고객 휴대폰으로 전송됩니다.
                    </span>
                  </label>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNewModal(false)}
                    className="px-4 py-2 border border-brand-green/30 rounded-xl text-xs font-bold text-brand-brown/70 hover:bg-brand-beige/30"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={creatingAppt}
                    className="px-5 py-2 bg-brand-sage hover:bg-brand-sage/90 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-1.5 disabled:opacity-60 cursor-pointer"
                  >
                    {creatingAppt && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                    <span>예약 일정 등록하기</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Block Slot Modal (Supports Weekly, Monthly, Specific Dates, Custom Range & Multiple Slots) */}
      <AnimatePresence>
        {showBlockModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl w-full bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-rose-200 max-h-[92vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-rose-100">
                <div className="flex items-center gap-2.5 text-rose-950">
                  <div className="w-10 h-10 bg-rose-100 text-rose-700 rounded-xl flex items-center justify-center shadow-2xs shrink-0">
                    <CalendarRange className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-brand-brown">
                      예약 마감 및 휴진 상세 설정
                    </h3>
                    <p className="text-xs text-rose-700/80">
                      주간, 월간, 특정일 및 시간대를 자유롭게 지정하여 예약을 일괄 마감합니다.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBlockModal(false)}
                  className="p-1.5 text-brand-brown/40 hover:text-brand-brown rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 1. Mode Switcher Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-rose-50/70 border border-rose-200/80 rounded-2xl mb-5">
                <button
                  type="button"
                  onClick={() => setBlockTab('weekly')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    blockTab === 'weekly'
                      ? 'bg-rose-600 text-white shadow-2xs'
                      : 'text-rose-900/70 hover:text-rose-900 hover:bg-rose-100/50'
                  }`}
                >
                  <CalendarDays className="w-3.5 h-3.5" />
                  <span>주간 마감</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBlockTab('monthly')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    blockTab === 'monthly'
                      ? 'bg-rose-600 text-white shadow-2xs'
                      : 'text-rose-900/70 hover:text-rose-900 hover:bg-rose-100/50'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>월간 마감</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBlockTab('dates')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    blockTab === 'dates'
                      ? 'bg-rose-600 text-white shadow-2xs'
                      : 'text-rose-900/70 hover:text-rose-900 hover:bg-rose-100/50'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>특정일 마감</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBlockTab('range')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    blockTab === 'range'
                      ? 'bg-rose-600 text-white shadow-2xs'
                      : 'text-rose-900/70 hover:text-rose-900 hover:bg-rose-100/50'
                  }`}
                >
                  <CalendarRange className="w-3.5 h-3.5" />
                  <span>기간 직접지정</span>
                </button>
              </div>

              <form onSubmit={handleSaveBlock} className="space-y-5">
                {/* TAB 1: 주간 마감 (Weekly) */}
                {blockTab === 'weekly' && (
                  <div className="p-4 bg-brand-beige/10 border border-brand-green/20 rounded-2xl space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-brand-brown flex items-center gap-1.5">
                        <CalendarDays className="w-4 h-4 text-rose-600" />
                        마감할 주(Week) 및 기준 날짜 선택
                      </span>
                      <span className="text-[11px] text-brand-brown/60">해당 주의 월~토 일정 일괄 설정</span>
                    </div>

                    {/* Quick Week Selectors */}
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => setWeekBaseDate(todayStr)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer border ${
                          weekBaseDate === todayStr
                            ? 'bg-rose-600 text-white border-rose-600'
                            : 'bg-white text-brand-brown border-brand-green/30 hover:bg-rose-50'
                        }`}
                      >
                        이번 주
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const nextW = new Date(today);
                          nextW.setDate(today.getDate() + 7);
                          setWeekBaseDate(formatDateStr(nextW));
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer bg-white text-brand-brown border border-brand-green/30 hover:bg-rose-50"
                      >
                        다음 주
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const afterW = new Date(today);
                          afterW.setDate(today.getDate() + 14);
                          setWeekBaseDate(formatDateStr(afterW));
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer bg-white text-brand-brown border border-brand-green/30 hover:bg-rose-50"
                      >
                        다다음 주
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                      <div>
                        <label className="text-[11px] font-bold text-brand-brown/70 block mb-1">기준 날짜</label>
                        <input
                          type="date"
                          required
                          value={weekBaseDate}
                          onChange={e => setWeekBaseDate(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-brand-green/30 text-xs bg-white focus:border-brand-sage outline-none font-medium"
                        />
                      </div>
                      <div className="pt-4 text-xs text-brand-brown/70">
                        {weekBaseDate && (
                          <div className="p-2 bg-white rounded-xl border border-brand-green/20">
                            <span className="text-[11px] text-brand-brown/60 block">선택된 주차 범위:</span>
                            <span className="font-bold text-rose-900">
                              {formatDateStr(getMondayOfDate(new Date(weekBaseDate + 'T00:00:00')))} (월) ~{' '}
                              {(() => {
                                const m = getMondayOfDate(new Date(weekBaseDate + 'T00:00:00'));
                                m.setDate(m.getDate() + 5);
                                return `${formatDateStr(m)} (토)`;
                              })()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Weekday filters */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[11px] font-bold text-brand-brown/70">주간 적용 요일 선택</label>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setWeekDaysFilter([1, 2, 3, 4, 5, 6])}
                            className="text-[10px] text-rose-700 font-bold hover:underline cursor-pointer"
                          >
                            전체(월~토)
                          </button>
                          <span className="text-[10px] text-gray-400">|</span>
                          <button
                            type="button"
                            onClick={() => setWeekDaysFilter([1, 2, 3, 4, 5])}
                            className="text-[10px] text-rose-700 font-bold hover:underline cursor-pointer"
                          >
                            평일만(월~금)
                          </button>
                          <span className="text-[10px] text-gray-400">|</span>
                          <button
                            type="button"
                            onClick={() => setWeekDaysFilter([6])}
                            className="text-[10px] text-rose-700 font-bold hover:underline cursor-pointer"
                          >
                            토요일만
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {[
                          { day: 1, name: '월' },
                          { day: 2, name: '화' },
                          { day: 3, name: '수' },
                          { day: 4, name: '목' },
                          { day: 5, name: '금' },
                          { day: 6, name: '토' },
                        ].map(d => {
                          const isSel = weekDaysFilter.includes(d.day);
                          return (
                            <button
                              key={d.day}
                              type="button"
                              onClick={() => handleToggleWeekday(d.day, weekDaysFilter, setWeekDaysFilter)}
                              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                                isSel
                                  ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                                  : 'bg-white text-gray-500 border-gray-200 hover:border-rose-300'
                              }`}
                            >
                              {d.name}
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-[10px] text-brand-brown/50 mt-1">
                        * 일요일은 정기 휴무일이므로 자동 제외됩니다.
                      </p>
                    </div>
                  </div>
                )}

                {/* TAB 2: 월간 마감 (Monthly) */}
                {blockTab === 'monthly' && (
                  <div className="p-4 bg-brand-beige/10 border border-brand-green/20 rounded-2xl space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-brand-brown flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-rose-600" />
                        마감할 연월(Year / Month) 선택
                      </span>
                      <span className="text-[11px] text-brand-brown/60">당월 전체 또는 특정 요일 반복 마감</span>
                    </div>

                    {/* Quick Month Selectors */}
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: '이번 달 (9월)', y: 2026, m: 9 },
                        { label: '다음 달 (10월)', y: 2026, m: 10 },
                        { label: '11월', y: 2026, m: 11 },
                        { label: '12월', y: 2026, m: 12 },
                      ].map(item => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => {
                            setMonthYear(item.y);
                            setMonthMonth(item.m);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer border ${
                            monthYear === item.y && monthMonth === item.m
                              ? 'bg-rose-600 text-white border-rose-600'
                              : 'bg-white text-brand-brown border-brand-green/30 hover:bg-rose-50'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-brand-brown/70 block mb-1">연도</label>
                        <select
                          value={monthYear}
                          onChange={e => setMonthYear(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-brand-green/30 text-xs bg-white focus:border-brand-sage outline-none font-medium cursor-pointer"
                        >
                          {[2026, 2027].map(y => (
                            <option key={y} value={y}>{y}년</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-brand-brown/70 block mb-1">월</label>
                        <select
                          value={monthMonth}
                          onChange={e => setMonthMonth(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-brand-green/30 text-xs bg-white focus:border-brand-sage outline-none font-medium cursor-pointer"
                        >
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                            <option key={m} value={m}>{m}월</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Month Days Filter */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[11px] font-bold text-brand-brown/70">
                          {monthYear}년 {monthMonth}월 내 적용 요일 선택
                        </label>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setMonthDaysFilter([1, 2, 3, 4, 5, 6])}
                            className="text-[10px] text-rose-700 font-bold hover:underline cursor-pointer"
                          >
                            전체(월~토)
                          </button>
                          <span className="text-[10px] text-gray-400">|</span>
                          <button
                            type="button"
                            onClick={() => setMonthDaysFilter([1, 2, 3, 4, 5])}
                            className="text-[10px] text-rose-700 font-bold hover:underline cursor-pointer"
                          >
                            평일만
                          </button>
                          <span className="text-[10px] text-gray-400">|</span>
                          <button
                            type="button"
                            onClick={() => setMonthDaysFilter([6])}
                            className="text-[10px] text-rose-700 font-bold hover:underline cursor-pointer"
                          >
                            매주 토요일만
                          </button>
                          <span className="text-[10px] text-gray-400">|</span>
                          <button
                            type="button"
                            onClick={() => setMonthDaysFilter([3])}
                            className="text-[10px] text-rose-700 font-bold hover:underline cursor-pointer"
                          >
                            매주 수요일만
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {[
                          { day: 1, name: '월' },
                          { day: 2, name: '화' },
                          { day: 3, name: '수' },
                          { day: 4, name: '목' },
                          { day: 5, name: '금' },
                          { day: 6, name: '토' },
                        ].map(d => {
                          const isSel = monthDaysFilter.includes(d.day);
                          return (
                            <button
                              key={d.day}
                              type="button"
                              onClick={() => handleToggleWeekday(d.day, monthDaysFilter, setMonthDaysFilter)}
                              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                                isSel
                                  ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                                  : 'bg-white text-gray-500 border-gray-200 hover:border-rose-300'
                              }`}
                            >
                              {d.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: 특정일 마감 (Dates) */}
                {blockTab === 'dates' && (
                  <div className="p-4 bg-brand-beige/10 border border-brand-green/20 rounded-2xl space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-brand-brown flex items-center gap-1.5">
                        <Lock className="w-4 h-4 text-rose-600" />
                        마감할 특정 날짜 지정
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setMultiDateMode(!multiDateMode)}
                          className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold border cursor-pointer transition-all ${
                            multiDateMode
                              ? 'bg-rose-100 text-rose-800 border-rose-300'
                              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {multiDateMode ? '✓ 다중 날짜 선택 모드 (ON)' : '+ 다중 날짜 선택 모드 (OFF)'}
                        </button>
                      </div>
                    </div>

                    {!multiDateMode ? (
                      /* Single Date Mode */
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1.5 mb-1">
                          <button
                            type="button"
                            onClick={() => setSingleBlockDate(todayStr)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer bg-white text-brand-brown border border-brand-green/30 hover:bg-rose-50"
                          >
                            오늘 ({todayStr})
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const tm = new Date(today);
                              tm.setDate(today.getDate() + 1);
                              setSingleBlockDate(formatDateStr(tm));
                            }}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer bg-white text-brand-brown border border-brand-green/30 hover:bg-rose-50"
                          >
                            내일
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const af = new Date(today);
                              af.setDate(today.getDate() + 2);
                              setSingleBlockDate(formatDateStr(af));
                            }}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer bg-white text-brand-brown border border-brand-green/30 hover:bg-rose-50"
                          >
                            모레
                          </button>
                        </div>
                        <input
                          type="date"
                          required
                          value={singleBlockDate}
                          onChange={e => setSingleBlockDate(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-brand-green/30 text-xs bg-white focus:border-brand-sage outline-none font-medium"
                        />
                      </div>
                    ) : (
                      /* Multiple Specific Dates Mode */
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="date"
                            value={dateInputVal}
                            onChange={e => setDateInputVal(e.target.value)}
                            className="flex-1 px-3 py-2 rounded-xl border border-brand-green/30 text-xs bg-white focus:border-brand-sage outline-none font-medium"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddSpecificDate()}
                            className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-2xs whitespace-nowrap"
                          >
                            + 날짜 추가
                          </button>
                        </div>

                        {/* Selected Dates Chips */}
                        <div>
                          <div className="text-[11px] font-bold text-brand-brown/70 mb-1.5">
                            선택된 날짜 목록 ({multiSelectedDates.length}일):
                          </div>
                          {multiSelectedDates.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 bg-white rounded-xl border border-brand-green/20">
                              {multiSelectedDates.map(dStr => (
                                <span
                                  key={dStr}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 text-rose-900 border border-rose-200 rounded-lg text-xs font-bold shadow-2xs"
                                >
                                  <span>{dStr}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveSpecificDate(dStr)}
                                    className="text-rose-400 hover:text-rose-800 font-black cursor-pointer text-sm"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-brand-brown/50 italic p-2 bg-white/60 rounded-lg">
                              날짜를 지정한 후 [+ 날짜 추가] 버튼을 눌러주세요.
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 4: 기간 직접 지정 (Range) */}
                {blockTab === 'range' && (
                  <div className="p-4 bg-brand-beige/10 border border-brand-green/20 rounded-2xl space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-brand-brown flex items-center gap-1.5">
                        <CalendarRange className="w-4 h-4 text-rose-600" />
                        시작일 ~ 종료일 기간 설정
                      </span>
                      <span className="text-[11px] text-brand-brown/60">연휴 / 휴가 / 시설 보수 등</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-brand-brown/70 block mb-1">시작일 *</label>
                        <input
                          type="date"
                          required
                          value={rangeStartDate}
                          onChange={e => {
                            setRangeStartDate(e.target.value);
                            if (!rangeEndDate || rangeEndDate < e.target.value) {
                              setRangeEndDate(e.target.value);
                            }
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-brand-green/30 text-xs bg-white focus:border-brand-sage outline-none font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-brand-brown/70 block mb-1">종료일 *</label>
                        <input
                          type="date"
                          required
                          min={rangeStartDate}
                          value={rangeEndDate}
                          onChange={e => setRangeEndDate(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-brand-green/30 text-xs bg-white focus:border-brand-sage outline-none font-medium"
                        />
                      </div>
                    </div>

                    {/* Range Days Filter */}
                    <div>
                      <label className="text-[11px] font-bold text-brand-brown/70 block mb-1.5">
                        기간 내 적용 요일 선택
                      </label>
                      <div className="flex items-center gap-1.5">
                        {[
                          { day: 1, name: '월' },
                          { day: 2, name: '화' },
                          { day: 3, name: '수' },
                          { day: 4, name: '목' },
                          { day: 5, name: '금' },
                          { day: 6, name: '토' },
                        ].map(d => {
                          const isSel = rangeDaysFilter.includes(d.day);
                          return (
                            <button
                              key={d.day}
                              type="button"
                              onClick={() => handleToggleWeekday(d.day, rangeDaysFilter, setRangeDaysFilter)}
                              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                                isSel
                                  ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                                  : 'bg-white text-gray-500 border-gray-200 hover:border-rose-300'
                              }`}
                            >
                              {d.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Exclude Sunday Option */}
                    <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-brand-green/20 cursor-pointer text-xs text-brand-brown">
                      <input
                        type="checkbox"
                        checked={excludeSundays}
                        onChange={e => setExcludeSundays(e.target.checked)}
                        className="w-4 h-4 text-rose-600 rounded border-gray-300 focus:ring-rose-500 cursor-pointer"
                      />
                      <span className="font-semibold">일요일(정기 휴무일)은 마감 등록에서 자동 제외</span>
                    </label>
                  </div>
                )}

                {/* 2. TIME SLOT SELECTION (Multi-Slot Selection) */}
                <div className="p-4 bg-brand-beige/10 border border-brand-green/20 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-brown flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-rose-600" />
                      마감할 시간대 선택 (1일 5회차 다중 선택 가능)
                    </span>
                    <span className="text-[11px] text-brand-brown/60">
                      {isAllDay ? '하루 종일 (5개 회차 전체 마감)' : `${selectedSlotTimes.length}개 특정 회차 마감`}
                    </span>
                  </div>

                  {/* Preset Buttons */}
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAllDay(true);
                        setSelectedSlotTimes([]);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        isAllDay
                          ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                          : 'bg-white text-rose-900 border-rose-200 hover:bg-rose-50'
                      }`}
                    >
                      ✓ 하루 종일 (전체 5회차)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAllDay(false);
                        setSelectedSlotTimes(['09:00', '10:30']);
                      }}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer bg-white text-brand-brown border border-brand-green/30 hover:bg-rose-50"
                    >
                      오전 회차만 (1·2회)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAllDay(false);
                        setSelectedSlotTimes(['14:00', '15:30']);
                      }}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer bg-white text-brand-brown border border-brand-green/30 hover:bg-rose-50"
                    >
                      오후 회차만 (3·4회)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAllDay(false);
                        setSelectedSlotTimes(['19:00']);
                      }}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer bg-white text-brand-brown border border-brand-green/30 hover:bg-rose-50"
                    >
                      야간 회차만 (5회 19:00)
                    </button>
                  </div>

                  {/* Individual Slot Checkbox Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
                    {TIME_SLOTS.map(t => {
                      const isChecked = isAllDay || selectedSlotTimes.includes(t);
                      const detail = TIME_SLOT_DETAILS[t];
                      return (
                        <div
                          key={t}
                          onClick={() => handleToggleSlotTime(t)}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                            isChecked
                              ? 'bg-rose-50/90 border-rose-300 text-rose-950 font-bold shadow-2xs'
                              : 'bg-white border-gray-200 text-gray-500 hover:border-rose-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}} // handled by parent onClick
                              className="w-4 h-4 text-rose-600 rounded border-gray-300 focus:ring-rose-500 cursor-pointer pointer-events-none"
                            />
                            <div>
                              <div className="text-xs font-bold leading-tight">
                                {detail?.session || t}
                              </div>
                              <div className="text-[11px] opacity-75 font-mono">
                                {detail?.duration || t} ({detail?.period || '상담'})
                              </div>
                            </div>
                          </div>
                          {isChecked && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-200/80 text-rose-800 font-bold shrink-0">
                              마감 대상
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Reason Presets & Custom Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-brand-brown/70">마감 사유 / 유형</label>
                    <span className="text-[10px] text-brand-brown/50">빠른 태그 클릭</span>
                  </div>

                  {/* Preset quick buttons */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {['예약 마감', '출장상담', '외부일정', '휴가', '출장 및 외부강의', '하계 휴가', '추석/명절 연휴', '원장님 외부 일정', '학회/연구 세미나', '정기 휴진', '센터 시설정비', '개인 사정'].map(preset => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setBlockReason(preset)}
                        className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                          blockReason === preset
                            ? 'bg-rose-600 text-white shadow-2xs'
                            : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    required
                    value={blockReason}
                    onChange={e => setBlockReason(e.target.value)}
                    placeholder="예: 하계 휴가, 예약 마감, 학회 참석 등"
                    className="w-full px-3 py-2 rounded-xl border border-brand-green/30 text-xs bg-white focus:border-brand-sage outline-none"
                  />
                </div>

                {/* 4. Live Calculation & Preview Box */}
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs space-y-2">
                  <div className="flex items-center justify-between text-rose-950 font-bold">
                    <span className="flex items-center gap-1.5">
                      <CheckSquare className="w-4 h-4 text-rose-600" />
                      실시간 마감 대상 계산 미리보기
                    </span>
                    <span className="text-rose-700 font-extrabold bg-white px-2.5 py-0.5 rounded-lg border border-rose-200 text-xs shadow-2xs">
                      총 {computedTargetDates.length}일간 적용
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-1 border-y border-rose-200/60 text-[11px]">
                    <div>
                      <span className="text-rose-800/70 block">마감 일수:</span>
                      <strong className="text-rose-900 font-bold text-xs">{computedTargetDates.length}일</strong>
                    </div>
                    <div>
                      <span className="text-rose-800/70 block">적용 시간대:</span>
                      <strong className="text-rose-900 font-bold text-xs">
                        {isAllDay ? '전일 5회차 전체' : `${selectedSlotTimes.length}개 회차`}
                      </strong>
                    </div>
                    <div>
                      <span className="text-rose-800/70 block">차단될 총 슬롯:</span>
                      <strong className="text-rose-700 font-extrabold text-xs">
                        총 {computedTargetDates.length * (isAllDay ? 5 : selectedSlotTimes.length)}개 슬롯
                      </strong>
                    </div>
                  </div>

                  {/* Target Dates preview chips */}
                  {computedTargetDates.length > 0 ? (
                    <div>
                      <span className="text-[10px] text-rose-800/80 font-semibold block mb-1">
                        적용 대상 날짜 ({computedTargetDates.length}일):
                      </span>
                      <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto p-1.5 bg-white/80 rounded-xl border border-rose-200">
                        {computedTargetDates.map(d => {
                          const dateObj = new Date(d + 'T00:00:00');
                          const dayChar = ['일', '월', '화', '수', '목', '금', '토'][dateObj.getDay()];
                          return (
                            <span
                              key={d}
                              className="px-1.5 py-0.5 bg-rose-100 text-rose-900 rounded text-[10px] font-bold"
                            >
                              {d}({dayChar})
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-rose-700 font-semibold italic">
                      선택된 조건에 해당하는 유효한 날짜가 없습니다. 날짜 및 요일 설정을 확인해 주세요.
                    </p>
                  )}
                </div>

                {/* Submit Actions */}
                <div className="pt-2 flex items-center justify-end gap-2 border-t border-rose-100">
                  <button
                    type="button"
                    onClick={() => setShowBlockModal(false)}
                    className="px-4 py-2.5 border border-brand-green/30 rounded-xl text-xs font-bold text-brand-brown/70 hover:bg-brand-beige/30 cursor-pointer"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={savingBlock || computedTargetDates.length === 0 || (!isAllDay && selectedSlotTimes.length === 0)}
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                  >
                    {savingBlock ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>마감 저장 중...</span>
                      </>
                    ) : (
                      <>
                        <CalendarCheck className="w-4 h-4" />
                        <span>
                          {computedTargetDates.length}개 일자 ({isAllDay ? '전일' : selectedSlotTimes.length + '회차'}) 마감 일괄 적용
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* All Blocks Management Modal */}
      <AnimatePresence>
        {showAllBlocksModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl w-full bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-rose-200 flex flex-col max-h-[85vh]"
            >
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-rose-100 shrink-0">
                <div className="flex items-center gap-2.5 text-rose-950">
                  <div className="w-9 h-9 bg-rose-100 text-rose-700 rounded-xl flex items-center justify-center shadow-2xs">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-brand-brown">
                      전체 마감 및 휴진 일정 관리 ({blocks.length}건)
                    </h3>
                    <p className="text-xs text-rose-700/80">
                      등록된 마감 일정을 검색하거나 선택하여 일괄 해제할 수 있습니다.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowAllBlocksModal(false);
                    setSelectedBlockIds([]);
                  }}
                  className="p-1.5 text-brand-brown/40 hover:text-brand-brown rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Action and Filter Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4 shrink-0">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-brand-brown/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={blockSearchTerm}
                    onChange={e => setBlockSearchTerm(e.target.value)}
                    placeholder="날짜(2026-09), 사유(휴가, 연휴), 시간으로 검색..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-brand-green/30 text-xs bg-brand-beige/10 focus:border-brand-sage outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAllBlocksModal(false);
                      handleOpenBulkUnblockModal('weekly');
                    }}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    title="주간, 월간, 특정 기간 및 회차별 일괄 마감 해제"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>주간/월간 일괄 해제</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClearPastBlocks}
                    className="px-3 py-2 bg-brand-beige/40 hover:bg-brand-beige text-brand-brown font-semibold rounded-xl text-xs border border-brand-green/20 cursor-pointer"
                  >
                    지난 마감 정리
                  </button>

                  {selectedBlockIds.length > 0 && (
                    <button
                      type="button"
                      disabled={deletingBlocks}
                      onClick={() => handleBatchDeleteBlocks(selectedBlockIds)}
                      className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-sm cursor-pointer flex items-center gap-1.5 disabled:opacity-60"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>선택 해제 ({selectedBlockIds.length})</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Blocks Table List */}
              <div className="flex-1 overflow-y-auto border border-brand-green/20 rounded-2xl">
                {blocks.length === 0 ? (
                  <div className="p-8 text-center text-brand-brown/60 text-xs">
                    등록된 예약 마감 및 휴진 일정이 없습니다.
                  </div>
                ) : (
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-brand-beige/40 sticky top-0 border-b border-brand-green/20 z-10">
                      <tr>
                        <th className="py-2.5 px-3 w-10 text-center">
                          <input
                            type="checkbox"
                            checked={blocks.length > 0 && selectedBlockIds.length === blocks.length}
                            onChange={e => {
                              if (e.target.checked) {
                                setSelectedBlockIds(blocks.map(b => b.id!).filter(Boolean));
                              } else {
                                setSelectedBlockIds([]);
                              }
                            }}
                            className="w-4 h-4 text-rose-600 rounded cursor-pointer"
                          />
                        </th>
                        <th className="py-2.5 px-3 font-bold text-brand-brown/70">마감 일자</th>
                        <th className="py-2.5 px-3 font-bold text-brand-brown/70">마감 시간대</th>
                        <th className="py-2.5 px-3 font-bold text-brand-brown/70">사유</th>
                        <th className="py-2.5 px-3 font-bold text-brand-brown/70 text-right">해제</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-green/10">
                      {blocks
                        .filter(b => {
                          if (!blockSearchTerm) return true;
                          const t = blockSearchTerm.toLowerCase();
                          return (
                            b.block_date.includes(t) ||
                            (b.reason && b.reason.toLowerCase().includes(t)) ||
                            (b.block_time && b.block_time.includes(t))
                          );
                        })
                        .map(b => {
                          const isSelected = b.id ? selectedBlockIds.includes(b.id) : false;
                          const isPast = b.block_date < todayStr;
                          return (
                            <tr
                              key={b.id}
                              className={`hover:bg-rose-50/40 transition-colors ${
                                isSelected ? 'bg-rose-50/60' : ''
                              }`}
                            >
                              <td className="py-2.5 px-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={e => {
                                    if (!b.id) return;
                                    if (e.target.checked) {
                                      setSelectedBlockIds(prev => [...prev, b.id!]);
                                    } else {
                                      setSelectedBlockIds(prev => prev.filter(id => id !== b.id));
                                    }
                                  }}
                                  className="w-4 h-4 text-rose-600 rounded cursor-pointer"
                                />
                              </td>
                              <td className="py-2.5 px-3 font-medium text-brand-brown whitespace-nowrap">
                                <span className={isPast ? 'line-through text-brand-brown/50' : 'font-bold'}>
                                  {b.block_date}
                                </span>
                                {isPast && (
                                  <span className="ml-1.5 px-1.5 py-0.2 bg-gray-100 text-gray-500 text-[10px] rounded border border-gray-200">
                                    지난 일정
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 px-3 text-rose-900 whitespace-nowrap font-medium">
                                {b.block_time ? (
                                  <span className="px-2 py-0.5 bg-rose-100/80 rounded-md border border-rose-200 text-[11px]">
                                    {TIME_SLOT_DETAILS[b.block_time]?.session || b.block_time} ({b.block_time})
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 bg-rose-200 text-rose-950 rounded-md font-bold text-[11px]">
                                    하루 종일 (전일)
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 px-3 text-brand-brown/80 font-medium">
                                {b.reason || '예약 마감'}
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => b.id && handleDeleteBlock(b.id)}
                                  className="px-2 py-1 text-rose-600 hover:text-rose-800 hover:bg-rose-100 rounded-md font-bold transition-all cursor-pointer text-[11px]"
                                >
                                  해제
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="pt-4 flex items-center justify-between gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setShowAllBlocksModal(false);
                    handleOpenBlockWithSlot(todayStr, undefined, 'range');
                  }}
                  className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold rounded-xl text-xs border border-rose-200 cursor-pointer flex items-center gap-1.5"
                >
                  <CalendarRange className="w-3.5 h-3.5" />
                  <span>+ 새 기간 마감 추가</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowAllBlocksModal(false)}
                  className="px-5 py-2 bg-brand-brown text-white font-bold rounded-xl text-xs hover:bg-brand-brown/90 cursor-pointer"
                >
                  닫기
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bulk Unblock Modal (주간, 월간, 기간 등 동일 예약 건 및 타임별 일괄 마감 해제) */}
      <AnimatePresence>
        {showBulkUnblockModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl w-full bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-emerald-200 flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-emerald-100 shrink-0">
                <div className="flex items-center gap-2.5 text-emerald-950">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center shadow-2xs">
                    <Unlock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-brand-brown flex items-center gap-2">
                      예약 마감 일괄 해제
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
                        주간/월간/회차별 해제
                      </span>
                    </h3>
                    <p className="text-xs text-emerald-700/80">
                      설정된 마감을 주간, 월간, 기간 또는 특정 회차별로 일괄 해제합니다.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBulkUnblockModal(false)}
                  className="p-1.5 text-brand-brown/40 hover:text-brand-brown rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {/* 1. Range Mode Tabs */}
                <div>
                  <label className="block text-xs font-bold text-brand-brown/70 mb-2">
                    해제 대상 기간 유형 선택
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 p-1 bg-emerald-50/70 rounded-2xl border border-emerald-200">
                    <button
                      type="button"
                      onClick={() => setUnblockTab('weekly')}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        unblockTab === 'weekly'
                          ? 'bg-white text-emerald-800 shadow-2xs border border-emerald-200'
                          : 'text-emerald-900/60 hover:text-emerald-900 hover:bg-emerald-100/50'
                      }`}
                    >
                      <CalendarDays className="w-3.5 h-3.5" />
                      <span>주간 일괄 해제</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setUnblockTab('monthly')}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        unblockTab === 'monthly'
                          ? 'bg-white text-emerald-800 shadow-2xs border border-emerald-200'
                          : 'text-emerald-900/60 hover:text-emerald-900 hover:bg-emerald-100/50'
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>월간 일괄 해제</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setUnblockTab('range')}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        unblockTab === 'range'
                          ? 'bg-white text-emerald-800 shadow-2xs border border-emerald-200'
                          : 'text-emerald-900/60 hover:text-emerald-900 hover:bg-emerald-100/50'
                      }`}
                    >
                      <CalendarRange className="w-3.5 h-3.5" />
                      <span>기간 지정 해제</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setUnblockTab('dates')}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        unblockTab === 'dates'
                          ? 'bg-white text-emerald-800 shadow-2xs border border-emerald-200'
                          : 'text-emerald-900/60 hover:text-emerald-900 hover:bg-emerald-100/50'
                      }`}
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                      <span>개별 날짜 선택</span>
                    </button>
                  </div>
                </div>

                {/* Sub-panels for Tab selection */}
                {/* A. Weekly Tab */}
                {unblockTab === 'weekly' && (
                  <div className="p-3.5 bg-emerald-50/50 border border-emerald-200 rounded-2xl space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <label className="text-xs font-bold text-brand-brown">
                        기준 날짜가 포함된 1주간 (월~일)
                      </label>
                      <input
                        type="date"
                        value={unblockWeekBaseDate}
                        onChange={e => setUnblockWeekBaseDate(e.target.value)}
                        className="px-3 py-1.5 rounded-xl border border-emerald-300 text-xs bg-white font-medium"
                      />
                    </div>
                    {/* Weekday check pills */}
                    <div>
                      <span className="text-[11px] font-bold text-brand-brown/70 block mb-1.5">
                        해제할 요일 선택 (기본: 월~토)
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { val: 1, label: '월' },
                          { val: 2, label: '화' },
                          { val: 3, label: '수' },
                          { val: 4, label: '목' },
                          { val: 5, label: '금' },
                          { val: 6, label: '토' },
                          { val: 0, label: '일' }
                        ].map(d => {
                          const active = unblockWeekDaysFilter.includes(d.val);
                          return (
                            <button
                              key={d.val}
                              type="button"
                              onClick={() => {
                                setUnblockWeekDaysFilter(prev =>
                                  prev.includes(d.val) ? prev.filter(x => x !== d.val) : [...prev, d.val]
                                );
                              }}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                active
                                  ? 'bg-emerald-600 text-white shadow-2xs'
                                  : 'bg-white text-brand-brown/60 hover:bg-emerald-100/50 border border-emerald-200'
                              }`}
                            >
                              {d.label}요일
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* B. Monthly Tab */}
                {unblockTab === 'monthly' && (
                  <div className="p-3.5 bg-emerald-50/50 border border-emerald-200 rounded-2xl space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <div>
                        <span className="text-[11px] font-bold text-brand-brown/70 block mb-1">연도</span>
                        <select
                          value={unblockMonthYear}
                          onChange={e => setUnblockMonthYear(Number(e.target.value))}
                          className="px-3 py-1.5 rounded-xl border border-emerald-300 text-xs bg-white font-bold"
                        >
                          {[2025, 2026, 2027].map(y => (
                            <option key={y} value={y}>{y}년</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-brand-brown/70 block mb-1">월</span>
                        <select
                          value={unblockMonthMonth}
                          onChange={e => setUnblockMonthMonth(Number(e.target.value))}
                          className="px-3 py-1.5 rounded-xl border border-emerald-300 text-xs bg-white font-bold"
                        >
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                            <option key={m} value={m}>{m}월</option>
                          ))}
                        </select>
                      </div>
                      <div className="self-end pb-1 text-xs text-emerald-800 font-semibold">
                        해당 월 전체 일자 중 선택된 요일의 마감을 일괄 해제합니다.
                      </div>
                    </div>
                    {/* Weekday check pills */}
                    <div>
                      <span className="text-[11px] font-bold text-brand-brown/70 block mb-1.5">
                        해제할 요일 선택
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { val: 1, label: '월' },
                          { val: 2, label: '화' },
                          { val: 3, label: '수' },
                          { val: 4, label: '목' },
                          { val: 5, label: '금' },
                          { val: 6, label: '토' },
                          { val: 0, label: '일' }
                        ].map(d => {
                          const active = unblockMonthDaysFilter.includes(d.val);
                          return (
                            <button
                              key={d.val}
                              type="button"
                              onClick={() => {
                                setUnblockMonthDaysFilter(prev =>
                                  prev.includes(d.val) ? prev.filter(x => x !== d.val) : [...prev, d.val]
                                );
                              }}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                active
                                  ? 'bg-emerald-600 text-white shadow-2xs'
                                  : 'bg-white text-brand-brown/60 hover:bg-emerald-100/50 border border-emerald-200'
                              }`}
                            >
                              {d.label}요일
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* C. Range Tab */}
                {unblockTab === 'range' && (
                  <div className="p-3.5 bg-emerald-50/50 border border-emerald-200 rounded-2xl space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-brand-brown/70 block mb-1">
                          시작일
                        </label>
                        <input
                          type="date"
                          value={unblockRangeStartDate}
                          onChange={e => setUnblockRangeStartDate(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl border border-emerald-300 text-xs bg-white font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-brand-brown/70 block mb-1">
                          종료일
                        </label>
                        <input
                          type="date"
                          value={unblockRangeEndDate}
                          onChange={e => setUnblockRangeEndDate(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl border border-emerald-300 text-xs bg-white font-medium"
                        />
                      </div>
                    </div>
                    {/* Weekday check pills */}
                    <div>
                      <span className="text-[11px] font-bold text-brand-brown/70 block mb-1.5">
                        포함할 요일
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { val: 1, label: '월' },
                          { val: 2, label: '화' },
                          { val: 3, label: '수' },
                          { val: 4, label: '목' },
                          { val: 5, label: '금' },
                          { val: 6, label: '토' }
                        ].map(d => {
                          const active = unblockRangeDaysFilter.includes(d.val);
                          return (
                            <button
                              key={d.val}
                              type="button"
                              onClick={() => {
                                setUnblockRangeDaysFilter(prev =>
                                  prev.includes(d.val) ? prev.filter(x => x !== d.val) : [...prev, d.val]
                                );
                              }}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                active
                                  ? 'bg-emerald-600 text-white shadow-2xs'
                                  : 'bg-white text-brand-brown/60 hover:bg-emerald-100/50 border border-emerald-200'
                              }`}
                            >
                              {d.label}요일
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* D. Individual Dates Tab */}
                {unblockTab === 'dates' && (
                  <div className="p-3.5 bg-emerald-50/50 border border-emerald-200 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={unblockDateInputVal}
                        onChange={e => setUnblockDateInputVal(e.target.value)}
                        className="px-3 py-1.5 rounded-xl border border-emerald-300 text-xs bg-white font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (unblockDateInputVal && !unblockMultiDates.includes(unblockDateInputVal)) {
                            setUnblockMultiDates(prev => [...prev, unblockDateInputVal].sort());
                          }
                        }}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-2xs"
                      >
                        + 날짜 추가
                      </button>
                    </div>
                    {/* Selected dates chips */}
                    <div className="flex flex-wrap gap-1.5">
                      {unblockMultiDates.map(d => (
                        <span
                          key={d}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-emerald-300 rounded-lg text-xs font-bold text-emerald-950 shadow-2xs"
                        >
                          {d}
                          <button
                            type="button"
                            onClick={() => setUnblockMultiDates(prev => prev.filter(x => x !== d))}
                            className="text-emerald-500 hover:text-emerald-900 font-extrabold cursor-pointer ml-1"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Target Time Slots / Sessions (각 타임별/회차별 마감 해제) */}
                <div className="p-3.5 bg-white border border-emerald-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-xs font-bold text-brand-brown flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        해제할 상담 회차 / 시간대 선택
                      </label>
                      <p className="text-[11px] text-brand-brown/60">
                        전일 마감뿐 아니라 특정 시간대(회차)만 골라서 마감을 해제할 수 있습니다.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const next = !unblockIsAllDay;
                        setUnblockIsAllDay(next);
                        if (next) setUnblockSelectedSlotTimes([]);
                        else setUnblockSelectedSlotTimes([...TIME_SLOTS]);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        unblockIsAllDay
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                          : 'bg-white text-emerald-800 border-emerald-300 hover:bg-emerald-50'
                      }`}
                    >
                      {unblockIsAllDay ? '✓ 전체 회차(전일) 해제' : '특정 회차만 해제'}
                    </button>
                  </div>

                  {/* Individual Time Slot Buttons */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                    {TIME_SLOTS.map(t => {
                      const isSelected = unblockIsAllDay || unblockSelectedSlotTimes.includes(t);
                      const detail = TIME_SLOT_DETAILS[t];

                      return (
                        <div
                          key={t}
                          onClick={() => {
                            if (unblockIsAllDay) {
                              setUnblockIsAllDay(false);
                              setUnblockSelectedSlotTimes([t]);
                            } else {
                              setUnblockSelectedSlotTimes(prev =>
                                prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
                              );
                            }
                          }}
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col justify-center items-center ${
                            isSelected
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-2xs ring-1 ring-emerald-500'
                              : 'bg-white border-brand-green/20 text-brand-brown/60 hover:bg-emerald-50/30'
                          }`}
                        >
                          <div className="text-[10px] font-bold text-emerald-700/80 mb-0.5">
                            {detail?.session || '회차'}
                          </div>
                          <div className="font-extrabold text-xs">
                            {t}
                          </div>
                          <span className="text-[10px] text-brand-brown/60">
                            {detail?.period || ''}
                          </span>
                          {isSelected && (
                            <span className="mt-1 text-[9px] px-1.5 py-0.2 rounded-md bg-emerald-600 text-white font-bold">
                              해제 대상
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Quick slot selections */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
                    <span className="text-brand-brown/60 font-medium">빠른 회차 선택:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setUnblockIsAllDay(false);
                        setUnblockSelectedSlotTimes([...TIME_SLOTS]);
                      }}
                      className="px-2 py-0.5 rounded-lg border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-800 font-semibold cursor-pointer"
                    >
                      모든 회차
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUnblockIsAllDay(false);
                        setUnblockSelectedSlotTimes(['09:00', '10:30']);
                      }}
                      className="px-2 py-0.5 rounded-lg border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-800 font-semibold cursor-pointer"
                    >
                      오전 회차만(09:00, 10:30)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUnblockIsAllDay(false);
                        setUnblockSelectedSlotTimes(['14:00', '15:30', '19:00']);
                      }}
                      className="px-2 py-0.5 rounded-lg border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-800 font-semibold cursor-pointer"
                    >
                      오후 회차만(14:00, 15:30, 19:00)
                    </button>
                  </div>
                </div>

                {/* 3. Live Preview & Calculation Box */}
                <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-xs space-y-2">
                  <div className="flex items-center justify-between text-emerald-950 font-bold">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      일괄 해제 대상 요약
                    </span>
                    <span className="text-emerald-700 font-extrabold bg-white px-2.5 py-0.5 rounded-lg border border-emerald-200 text-xs shadow-2xs">
                      총 {computedUnblockTargetDates.length}일간 해제
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 py-1 border-y border-emerald-200/60 text-[11px]">
                    <div>
                      <span className="text-emerald-800/70 block">해제 대상 날짜 수:</span>
                      <strong className="text-emerald-900 font-bold text-xs">{computedUnblockTargetDates.length}일</strong>
                    </div>
                    <div>
                      <span className="text-emerald-800/70 block">해제할 상담 회차:</span>
                      <strong className="text-emerald-900 font-bold text-xs">
                        {unblockIsAllDay ? '전체 회차 (전일 마감 해제)' : `${unblockSelectedSlotTimes.length}개 회차 (${unblockSelectedSlotTimes.join(', ')})`}
                      </strong>
                    </div>
                  </div>

                  {/* Dates preview chips */}
                  {computedUnblockTargetDates.length > 0 ? (
                    <div>
                      <span className="text-[10px] text-emerald-800/80 font-semibold block mb-1">
                        대상 날짜 미리보기 ({computedUnblockTargetDates.length}일):
                      </span>
                      <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto pr-1">
                        {computedUnblockTargetDates.map(d => (
                          <span
                            key={d}
                            className="px-2 py-0.5 bg-white text-emerald-900 rounded-md border border-emerald-200 text-[11px] font-bold shadow-2xs"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-[11px] text-rose-600 font-semibold">
                      선택된 조건에 해당하는 날짜가 없습니다. 날짜 및 요일 필터를 확인해 주세요.
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 mt-3 border-t border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                <div className="text-xs text-brand-brown/70">
                  {computedUnblockTargetDates.length === 0 ? (
                    <span className="text-rose-600 font-bold flex items-center gap-1">
                      ⚠️ 해제 대상 날짜가 0일입니다. 상단 필터를 확인해 주세요.
                    </span>
                  ) : (!unblockIsAllDay && unblockSelectedSlotTimes.length === 0) ? (
                    <span className="text-amber-700 font-bold flex items-center gap-1">
                      ⚠️ 해제할 회차(시간대)를 1개 이상 선택해 주세요.
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-medium">
                      ✓ 실행 시 대상 날짜의 설정된 마감이 즉시 해제됩니다.
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowBulkUnblockModal(false)}
                    className="px-4 py-2 bg-brand-beige/50 hover:bg-brand-beige text-brand-brown font-semibold rounded-xl text-xs cursor-pointer"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    disabled={executingUnblock}
                    onClick={handleExecuteBatchUnblock}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {executingUnblock ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>마감 해제 처리 중...</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3.5 h-3.5" />
                        <span>
                          {computedUnblockTargetDates.length}일간 ({unblockIsAllDay ? '전일' : unblockSelectedSlotTimes.length + '회차'}) 마감 일괄 해제 실행
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
