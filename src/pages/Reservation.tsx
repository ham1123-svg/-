import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  MapPin, Phone, Mail, Clock, Send, CheckCircle, 
  CalendarCheck2, PhoneCall, HeartHandshake, Sparkles, ChevronRight, ShieldCheck,
  MessageSquareText, CheckCircle2, RotateCcw, Home as HomeIcon, BellRing, ExternalLink,
  CalendarDays, Check
} from 'lucide-react';
import { Program, NotificationResult, ScheduleBlock, Reservation as ReservationType, RESERVATION_TIME_SLOTS, TIME_SLOT_DETAILS } from '../types';
import WeeklyScheduleCalendar from '../components/WeeklyScheduleCalendar';

export default function Reservation() {
  const [searchParams] = useSearchParams();
  const formRef = useRef<HTMLDivElement>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    program_id: '',
    preferred_date: '',
    preferred_time: '',
  });
  const [sendKakaoNotify, setSendKakaoNotify] = useState<boolean>(true);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [notificationResult, setNotificationResult] = useState<NotificationResult | null>(null);
  const [scheduleBlocks, setScheduleBlocks] = useState<ScheduleBlock[]>([]);
  const [existingReservations, setExistingReservations] = useState<ReservationType[]>([]);
  const [formError, setFormError] = useState<string>('');

  const loadScheduleData = () => {
    fetch('/api/schedule-blocks')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setScheduleBlocks(data); })
      .catch(() => {});

    fetch('/api/reservations')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setExistingReservations(data); })
      .catch(() => {});
  };

  useEffect(() => {
    fetch('/api/programs')
      .then(res => res.json())
      .then((data: Program[]) => {
        setPrograms(data);
        const programQuery = searchParams.get('program');
        if (programQuery && data && data.length > 0) {
          const matched = data.find(p => 
            p.title.includes(programQuery) || programQuery.includes(p.title)
          );
          if (matched) {
            setFormData(prev => ({ ...prev, program_id: matched.id.toString() }));
          }
        }
      });

    loadScheduleData();
  }, [searchParams]);

  // Sunday & Saturday check for preferred_date
  const dayOfWeek = formData.preferred_date ? new Date(formData.preferred_date + 'T00:00:00').getDay() : -1;
  const isSunday = dayOfWeek === 0;
  const isSaturday = dayOfWeek === 6;

  // Check availability for each of the 5 slots
  const slotAvailability = React.useMemo(() => {
    const map = new Map<string, { available: boolean; reason: string }>();
    const dateStr = formData.preferred_date;

    RESERVATION_TIME_SLOTS.forEach(time => {
      if (!dateStr) {
        map.set(time, { available: true, reason: '' });
        return;
      }
      if (isSunday) {
        map.set(time, { available: false, reason: '일요일 정기휴무' });
        return;
      }
      if (isSaturday && time === '19:00') {
        map.set(time, { available: false, reason: '토요일 야간 미운영' });
        return;
      }

      // Check full-day block
      const dayBlock = scheduleBlocks.find(b => b.block_date === dateStr && !b.block_time);
      if (dayBlock) {
        map.set(time, { available: false, reason: dayBlock.reason || '전일 마감' });
        return;
      }

      // Check specific slot block
      const slotBlock = scheduleBlocks.find(b => b.block_date === dateStr && b.block_time === time);
      if (slotBlock) {
        map.set(time, { available: false, reason: slotBlock.reason || '마감' });
        return;
      }

      // Check booked
      const isBooked = existingReservations.some(
        r => r.preferred_date === dateStr && r.preferred_time === time && r.status !== 'cancelled'
      );
      if (isBooked) {
        map.set(time, { available: false, reason: '예약 완료' });
        return;
      }

      map.set(time, { available: true, reason: '' });
    });

    return map;
  }, [formData.preferred_date, scheduleBlocks, existingReservations, isSunday, isSaturday]);

  // Clear preferred_time if user changed date to one where that slot is closed
  useEffect(() => {
    if (formData.preferred_date && formData.preferred_time) {
      const status = slotAvailability.get(formData.preferred_time);
      if (status && !status.available) {
        setFormData(prev => ({ ...prev, preferred_time: '' }));
      }
    }
  }, [formData.preferred_date, slotAvailability]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Pre-validation
    if (formData.preferred_date && formData.preferred_time) {
      const slotStatus = slotAvailability.get(formData.preferred_time);
      if (slotStatus && !slotStatus.available) {
        setFormError(`선택하신 시간(${formData.preferred_time})은 [${slotStatus.reason}] 사유로 현재 예약이 불가합니다. 다른 일시를 선택해 주세요.`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          program_id: parseInt(formData.program_id)
        }),
      });
      if (response.ok) {
        const result = await response.json();
        if (result.notification) {
          setNotificationResult(result.notification);
        }
        setSubmitted(true);
        loadScheduleData();
      } else {
        const errData = await response.json().catch(() => ({}));
        setFormError(errData.error || '예약 신청 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    } catch (err) {
      console.error('Failed to submit reservation:', err);
      setFormError('서버 연결 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedProgram = programs.find(p => p.id.toString() === formData.program_id);

  const steps = [
    {
      step: '01',
      title: '온라인 간편 접수',
      desc: '희망하시는 상담 프로그램과 편안한 방문 일시를 선택하여 접수합니다.',
      icon: CalendarCheck2,
      tag: '소요시간 1분'
    },
    {
      step: '02',
      title: '일정 확인 및 확정',
      desc: '상담실에서 접수 내역 확인 후 안내 전화를 드려 세부 일정을 확정합니다.',
      icon: PhoneCall,
      tag: '전문 상담사 안내'
    },
    {
      step: '03',
      title: '내방 및 초기 면담',
      desc: '아늑하고 비밀이 철저히 보장되는 1:1 상담실에서 현재의 고민을 경청합니다.',
      icon: HeartHandshake,
      tag: '100% 비밀 보장'
    },
    {
      step: '04',
      title: '맞춤 치유 솔루션',
      desc: '내담자의 필요에 따른 정밀 심리평가 및 회복·성장 세션을 진행합니다.',
      icon: Sparkles,
      tag: '개인 맞춤 프로그램'
    }
  ];

  return (
    <div className="min-h-screen bg-brand-beige/20 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-green/40 text-brand-brown text-xs font-semibold rounded-full mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-sage" />
            100% 비밀 보장 전문 심리상담
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-brand-brown mb-3">
            예약 및 오시는 길
          </h1>
          <p className="text-brand-brown/70 text-sm sm:text-base max-w-2xl mx-auto">
            방문하시기 편안한 일정을 선택해 주시면 확인 후 친절하게 안내 전화를 드립니다.
          </p>
        </div>

        {/* Step-by-Step Reservation Guide */}
        <motion.section 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-14"
          aria-label="상담 예약 절차 안내"
        >
          <div className="bg-white/80 backdrop-blur-xs rounded-3xl p-6 sm:p-8 border border-brand-green/30 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-4 border-b border-brand-green/20 gap-2">
              <div>
                <span className="text-xs font-bold text-brand-sage tracking-wider uppercase">
                  Reservation Process
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-brand-brown">
                  상담 신청 절차 안내
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-brand-brown/60">
                처음 찾아오시는 분도 쉽고 편안하게 진행하실 수 있도록 단계별로 안내해 드립니다.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
              {steps.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div 
                    key={item.step} 
                    id={`reservation-step-${item.step}`}
                    className="relative bg-brand-beige/25 hover:bg-brand-beige/50 rounded-2xl p-5 border border-brand-green/20 transition-all group flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Header in Card */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-sage text-white shadow-xs">
                          STEP {item.step}
                        </span>
                        <span className="text-[11px] font-medium text-brand-brown/60 bg-white/80 px-2 py-0.5 rounded-md border border-brand-green/20">
                          {item.tag}
                        </span>
                      </div>

                      {/* Icon */}
                      <div className="w-12 h-12 rounded-xl bg-white border border-brand-green/30 text-brand-sage flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-xs">
                        <IconComponent className="w-6 h-6" />
                      </div>

                      {/* Title & Desc */}
                      <h3 className="text-base font-bold text-brand-brown mb-2 font-serif">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-brand-brown/75 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    {/* Step Flow Arrow on Desktop between cards */}
                    {idx < steps.length - 1 && (
                      <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white border border-brand-green/30 shadow-xs flex items-center justify-center text-brand-sage">
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* Weekly Schedule Availability Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <WeeklyScheduleCalendar
            selectedDate={formData.preferred_date}
            selectedTime={formData.preferred_time}
            onSelectSlot={(date, time) => {
              setFormData(prev => ({
                ...prev,
                preferred_date: date,
                preferred_time: time
              }));
            }}
            formRef={formRef}
          />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12" ref={formRef} id="reservation-form-section">
          {/* Reservation Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl p-8 shadow-xl border border-brand-green/10"
          >
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center py-8 text-center">
                <div className="w-16 h-16 bg-brand-green/30 rounded-full flex items-center justify-center text-brand-sage mb-4 ring-8 ring-brand-green/10">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-brand-brown mb-2">예약 신청이 정상 접수되었습니다!</h2>
                <p className="text-sm text-brand-brown/70 mb-6 max-w-md leading-relaxed">
                  소중한 마음을 나누어 주셔서 감사합니다. 담당 상담사가 접수 내용을 확인 후 <strong className="text-brand-brown">24시간 이내 유선 전화</strong>로 일정을 최종 확정해 드립니다.
                </p>

                {/* Kakao Alimtalk / SMS Notification Preview Card */}
                <div className="w-full max-w-md bg-amber-50/80 border border-amber-200/90 rounded-3xl p-5 text-left mb-6 shadow-sm">
                  <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-amber-200/60">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-[#FEE500] rounded-xl flex items-center justify-center text-[#371D1E] font-bold text-xs shadow-xs">
                        <MessageSquareText className="w-4 h-4 fill-[#371D1E]" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                          카카오 알림톡 & 문자 자동 발송
                          <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] font-semibold rounded-full">
                            전송 완료
                          </span>
                        </span>
                        <div className="text-[11px] text-amber-800/80">
                          수신 번호: {formData.phone} ({formData.name} 님)
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-amber-700/60 font-mono">
                      {new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Kakao Talk Speech Bubble Mockup */}
                  <div className="bg-white rounded-2xl p-4 border border-amber-100 shadow-xs space-y-3">
                    <div className="text-xs font-bold text-amber-900 border-b border-amber-100 pb-2 flex items-center justify-between">
                      <span>[행복바람심리상담연구소]</span>
                      <span className="text-[10px] text-amber-600 font-normal">알림톡 안내</span>
                    </div>

                    <p className="text-xs text-brand-brown/90 leading-relaxed">
                      안녕하세요, <strong className="text-brand-brown font-bold">{formData.name}</strong> 님.<br />
                      마음의 평온을 찾는 행복바람심리상담연구소입니다.<br />
                      신청하신 상담 예약이 안전하게 접수되었습니다.
                    </p>

                    <div className="bg-brand-beige/30 rounded-xl p-3 text-xs space-y-1.5 text-brand-brown/80 border border-brand-green/20">
                      <div className="flex justify-between">
                        <span className="text-brand-brown/60">신청 프로그램:</span>
                        <span className="font-semibold text-brand-brown">
                          {selectedProgram ? `[${selectedProgram.category}] ${selectedProgram.title}` : '맞춤 심리상담'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-brand-brown/60">희망 방문일:</span>
                        <span className="font-semibold text-brand-brown">{formData.preferred_date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-brand-brown/60">희망 시간:</span>
                        <span className="font-semibold text-brand-brown">{formData.preferred_time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-brand-brown/60">상담소 위치:</span>
                        <span className="font-semibold text-brand-brown text-[11px]">도호1길 23 상가 408호</span>
                      </div>
                    </div>

                    <div className="pt-1 space-y-1.5">
                      <a
                        href="tel:052-254-0230"
                        className="w-full py-2 bg-[#FEE500] hover:bg-[#FADB00] text-[#371D1E] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>상담소 유선 문의 (052-254-0230)</span>
                      </a>
                    </div>
                  </div>

                  <p className="mt-3 text-[11px] text-amber-900/70 leading-relaxed text-center">
                    💡 카카오톡 미설치 또는 알림 차단 시 <strong className="font-semibold">일반 장문 문자(LMS)</strong>로 자동 전환 발송됩니다.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button 
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        phone: '',
                        program_id: '',
                        preferred_date: '',
                        preferred_time: '',
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-brand-sage text-white text-xs font-bold rounded-xl hover:bg-brand-sage/90 transition-all shadow-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>새로운 예약 신청하기</span>
                  </button>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-brand-beige/50 text-brand-brown text-xs font-bold rounded-xl hover:bg-brand-beige/80 transition-all border border-brand-green/20"
                  >
                    <HomeIcon className="w-3.5 h-3.5" />
                    <span>홈페이지 메인으로</span>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-serif font-bold text-brand-brown flex items-center gap-2">
                    <Send className="w-6 h-6 text-brand-sage" /> 온라인 예약 신청
                  </h2>
                  <span className="px-2.5 py-1 bg-brand-green/30 text-brand-brown text-xs font-semibold rounded-full">
                    간편 1분 접수
                  </span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-brand-brown/70 ml-1">성함 (닉네임 가능)</label>
                      <input 
                        required
                        type="text" 
                        placeholder="성함을 입력해 주세요"
                        className="w-full px-4 py-3 rounded-xl border border-brand-green/30 focus:border-brand-sage outline-none bg-brand-beige/10 text-sm"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-brand-brown/70 ml-1">연락처</label>
                      <input 
                        required
                        type="tel" 
                        placeholder="010-0000-0000"
                        className="w-full px-4 py-3 rounded-xl border border-brand-green/30 focus:border-brand-sage outline-none bg-brand-beige/10 text-sm"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-brand-brown/70 ml-1">상담 프로그램 선택</label>
                    <select 
                      required
                      className="w-full px-4 py-3 rounded-xl border border-brand-green/30 focus:border-brand-sage outline-none bg-brand-beige/10 appearance-none text-sm"
                      value={formData.program_id}
                      onChange={e => setFormData({...formData, program_id: e.target.value})}
                    >
                      <option value="">프로그램을 선택해 주세요</option>
                      {programs.map(p => (
                        <option key={p.id} value={p.id}>{`[${p.category}] ${p.title}`}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-brand-brown/70 ml-1">희망 날짜</label>
                        {formData.preferred_date && (
                          <span className="text-[11px] font-semibold text-brand-sage bg-brand-sage/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Check className="w-3 h-3 stroke-[2.5]" />
                            시간표 연동됨
                          </span>
                        )}
                      </div>
                      <input 
                        required
                        type="date" 
                        className="w-full px-4 py-3 rounded-xl border border-brand-green/30 focus:border-brand-sage outline-none bg-brand-beige/10 text-sm"
                        value={formData.preferred_date}
                        onChange={e => setFormData({...formData, preferred_date: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-brand-brown/70 ml-1">
                          희망 시간 {isSaturday ? '(토요일 4회 운영)' : '(평일 5회 운영)'}
                        </label>
                        {formData.preferred_time && (
                          <span className="text-[11px] font-semibold text-brand-sage bg-brand-sage/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Check className="w-3 h-3 stroke-[2.5]" />
                            {formData.preferred_time}
                          </span>
                        )}
                      </div>

                      {/* 1일 5회 (토요일 4회) Quick Select Buttons */}
                      <div className="grid grid-cols-5 gap-1.5 pt-1">
                        {[
                          { time: '09:00', label: '1회차' },
                          { time: '10:30', label: '2회차' },
                          { time: '14:00', label: '3회차' },
                          { time: '15:30', label: '4회차' },
                          { time: '19:00', label: '5회차', isSatClosed: true }
                        ].map(slot => {
                          const slotInfo = slotAvailability.get(slot.time);
                          const isAvailable = slotInfo ? slotInfo.available : true;
                          const isSelected = formData.preferred_time === slot.time;
                          const isSatBlocked = isSaturday && slot.time === '19:00';

                          return (
                            <button
                              key={slot.time}
                              type="button"
                              disabled={!isAvailable}
                              onClick={() => {
                                if (isAvailable) {
                                  setFormData({ ...formData, preferred_time: slot.time });
                                }
                              }}
                              className={`py-1.5 px-1 rounded-xl text-center border transition-all ${
                                isSelected
                                  ? 'bg-brand-sage text-white border-brand-sage shadow-xs font-bold cursor-pointer'
                                  : isAvailable
                                  ? 'bg-white border-brand-green/25 text-brand-brown/80 hover:bg-brand-beige/40 text-xs cursor-pointer'
                                  : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60'
                              }`}
                              title={
                                !isAvailable
                                  ? `${slot.time} - [${slotInfo?.reason || (isSatBlocked ? '토요일 미운영' : '예약 마감')}]`
                                  : `${slot.time} 선택`
                              }
                            >
                              <div className="text-[10px] opacity-75">{slot.label}</div>
                              <div className="text-xs font-extrabold">{slot.time}</div>
                              {!isAvailable && (
                                <div className="text-[9px] text-rose-500 font-bold mt-0.5">
                                  {isSatBlocked ? '미운영' : slotInfo?.reason?.includes('휴진') ? '휴진' : '마감'}
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      <select 
                        required
                        className="w-full px-4 py-3 rounded-xl border border-brand-green/30 focus:border-brand-sage outline-none bg-brand-beige/10 appearance-none text-sm cursor-pointer mt-1"
                        value={formData.preferred_time}
                        onChange={e => setFormData({...formData, preferred_time: e.target.value})}
                      >
                        <option value="">상담 시간대 선택 {isSaturday ? '(토요일 4회: 09:00~15:30)' : '(평일 5회: 09:00~19:00)'}</option>
                        {[
                          { time: '09:00', label: '1회차 (09:00 ~ 10:00)' },
                          { time: '10:30', label: '2회차 (10:30 ~ 11:30)' },
                          { time: '14:00', label: '3회차 (14:00 ~ 15:00)' },
                          { time: '15:30', label: '4회차 (15:30 ~ 16:30)' },
                          { time: '19:00', label: '5회차 (19:00 ~ 20:00 - 평일만 운영)' }
                        ].map(slot => {
                          const slotInfo = slotAvailability.get(slot.time);
                          const isAvailable = slotInfo ? slotInfo.available : true;
                          return (
                            <option key={slot.time} value={slot.time} disabled={!isAvailable}>
                              {slot.label} {!isAvailable ? ` - [${slotInfo?.reason || '마감'}]` : ''}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>

                  {formError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0"></span>
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* Kakao Alimtalk & SMS notification agreement */}
                  <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-3">
                    <input 
                      type="checkbox"
                      id="kakao-notify-agreement"
                      checked={sendKakaoNotify}
                      onChange={e => setSendKakaoNotify(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                    />
                    <label htmlFor="kakao-notify-agreement" className="text-xs text-amber-950 cursor-pointer leading-relaxed">
                      <span className="font-bold flex items-center gap-1 text-amber-900">
                        <MessageSquareText className="w-4 h-4 text-amber-600 shrink-0" />
                        카카오 알림톡 및 문자(SMS) 접수 안내 수신 (무료)
                      </span>
                      <span className="text-amber-800/80 block mt-0.5">
                        예약 신청 완료 즉시 접수 상세 내역과 상담실 위치 안내가 고객님의 카카오톡(미설치 시 문자)으로 자동 전송됩니다.
                      </span>
                    </label>
                  </div>
                  
                  <p className="text-xs text-brand-brown/40 leading-relaxed">
                    * 온라인 가예약 신청 후 상담사가 확인 전화를 드려 일정이 최종 확정됩니다. <br />
                    * 당일 긴급 상담은 대표 전화(052-254-0230)로 문의해 주시기 바랍니다.
                  </p>
                  
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-brand-sage hover:bg-brand-sage/90 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>예약 접수 중...</span>
                    ) : (
                      <>
                        <span>예약 신청 완료하기</span>
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>

          {/* Map & Info */}
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl overflow-hidden shadow-xl border border-brand-green/10 h-[400px]"
            >
              {/* Google Maps Iframe */}
              <iframe 
                src="https://maps.google.com/maps?q=울산광역시%20울주군%20삼남읍%20도호1길%2023&t=&z=16&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-brand-green/20 rounded-3xl p-8 border border-brand-sage/20"
            >
              <h3 className="text-xl font-serif font-bold text-brand-brown mb-6">찾아오시는 길</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-brand-sage shrink-0 mt-1" />
                  <p className="text-brand-brown/80">울산광역시 울주군 삼남읍 도호1길 23 상가 408호</p>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-brand-sage shrink-0 mt-1" />
                  <p className="text-brand-brown/80">052-254-0230</p>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-brand-sage shrink-0 mt-1" />
                  <p className="text-brand-brown/80">mikypa@naver.com</p>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-brand-sage shrink-0 mt-1" />
                  <p className="text-brand-brown/80">1일 5회 사전 예약제 (09:00, 10:30, 14:00, 15:30, 19:00)</p>
                </div>
              </div>
              <div className="mt-8 p-4 bg-white/50 rounded-2xl">
                <p className="text-xs text-brand-brown/60 font-medium">
                  <span className="text-brand-sage font-bold">[대중교통 이용 시]</span> <br />
                  KTX 울산역(통도사)에서 대중교통 이용 시 편리하게 방문하실 수 있습니다.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
