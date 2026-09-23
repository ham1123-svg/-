import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, ShieldCheck, Users, Briefcase, FileText, CheckCircle2, 
  Phone, Mail, Award, Clock, ArrowRight, Sparkles, HelpCircle, 
  HeartHandshake, AlertCircle, ChevronDown, Check, Send, 
  BadgeCheck, Compass, MessageSquare, Laptop, MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useHighContrast } from '../context/HighContrastContext';

// Core EAP Services
const EAP_SERVICES = [
  {
    icon: <Users className="w-6 h-6 text-brand-sage" />,
    tag: "개인 & 심층 케어",
    title: "1:1 임직원 전문 심리상담",
    desc: "직무 스트레스, 조직 내 갈등, 번아웃, 우울·불안 및 가족/대인관계 갈등까지 1급 전문가가 깊이 있게 케어합니다.",
    features: [
      "프라이빗 힐링룸 1:1 대면 방문 상담",
      "전국 지사·원격 근무자를 위한 보안 비대면(화상/전화)",
      "일·가정 양립(WLB) 지원 및 부부·자녀 가족 상담 연계",
      "100% 철저한 익명성 보장 (인사고과 열람 절대 불가)"
    ]
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
    tag: "법정 의무 & 정밀 진단",
    title: "직무 스트레스 평가 & 감정노동자 보호",
    desc: "산업안전보건법 제41조(고객응대근로자 건강장해 예방) 법정 기준을 충족하는 표준화된 심리 진단과 솔루션을 제공합니다.",
    features: [
      "한국인 직무스트레스 척도(KOSS) 8개 하위영역 진단",
      "직무 소진(MBI) 및 감정노동 위험도 종합 분석",
      "고위험군 조기 스크리닝 및 심층 심리 연계",
      "기업 제출용 비식별 조직 멘탈 종합 분석 리포트 발급"
    ]
  },
  {
    icon: <Sparkles className="w-6 h-6 text-amber-600" />,
    tag: "조직 활력 & 역량 강화",
    title: "맞춤형 힐링 워크숍 & 멘탈헬스 특강",
    desc: "박미경 소장(교육학 박사)의 직강으로 임직원의 마음 면역력을 높이고 건강한 소통 문화를 구축합니다.",
    features: [
      "스트레스 해소 및 마음챙김(MBSR) 힐링 프로그램",
      "직장 내 감정조절 및 비폭력 대화(NVC) 갈등 관리",
      "중간관리자 및 리더십을 위한 감성 코칭 & 위기징후 감지",
      "사내 출장 오프라인 특강 또는 사내 온라인 웨비나"
    ]
  },
  {
    icon: <HeartHandshake className="w-6 h-6 text-rose-500" />,
    tag: "긴급 위기 지원",
    title: "조직 위기 개입 (CISD) & 긴급 디브리핑",
    desc: "사내 중대 재해, 급작스러운 사별, 외상적 사건 발생 시 24~72시간 내 전문 슈퍼바이저가 현장에 긴급 개입합니다.",
    features: [
      "사건 발생 골든타임 내 긴급 심리적 응급처치(PFA)",
      "충격 완화 집단 디브리핑(CISD) 세션 진행",
      "외상후 스트레스 장애(PTSD) 만성화 사전 예방",
      "사후 안정화 및 부서별 추적 관찰 케어"
    ]
  }
];

// Flexible Partnership Plans
const PARTNERSHIP_PLANS = [
  {
    id: "voucher",
    badge: "실속형 · 소기업 추천",
    title: "바우처(쿠폰)형 플랜",
    subtitle: "초기 고정비 없이 실제 이용한 만큼만 정산",
    target: "스타트업, 50인 미만 중소기업, 특정 부서 시범 도입",
    details: [
      "별도 월/연간 가입비 없는 합리적 후불제",
      "임직원이 실제 상담을 완료한 회기만 월별 정산",
      "원하는 회기 수만큼 자유롭게 쿠폰 발급/제한 설정",
      "상담 완료 통계 및 월별 정산 내역서 제공"
    ],
    highlight: false
  },
  {
    id: "membership",
    badge: "가장 인기 · 정기 케어",
    title: "연간 정기 멤버십 플랜",
    subtitle: "전사적 멘탈 복지와 종합 EAP 시스템 구축",
    target: "공공기관, 중견·대기업, 사내근로복지기금 운영 기업",
    details: [
      "임직원 1인당 연 N회 심리상담 지원 기준 수립",
      "전 직원 직무스트레스(KOSS) 온라인 진단 무료 제공",
      "연 1회 사내 힐링 특강 또는 워크숍 기본 포함",
      "전담 코디네이터 배정 및 분기별 비식별 조직 리포트",
      "사내 인트라넷 게시용 웹 리플릿 및 홍보물 제공"
    ],
    highlight: true
  },
  {
    id: "project",
    badge: "맞춤 프로젝트",
    title: "프로젝트 & 특강형 플랜",
    subtitle: "필요한 시기에 집중적으로 진행하는 테마 프로그램",
    target: "감정노동 집중 콜센터/민원부서, 조직 개편기, 사내 연수",
    details: [
      "4~8주 집중 감정관리 및 소진 예방 프로그램",
      "신규 입사자 온보딩 및 조직 적응 멘탈 교육",
      "사내 위기 사건 발생 시 집중 사후 개입",
      "주제별(번아웃, 회복탄력성, 소통) 맞춤 커리큘럼 설계"
    ],
    highlight: false
  }
];

// 4-Step Onboarding Roadmap
const ONBOARDING_STEPS = [
  {
    step: "01",
    title: "사전 니즈 분석 & 견적 상담",
    desc: "조직 규모, 직군별 특성(감정노동, 교대근무 등), 배정 예산 및 현안에 맞춘 최적의 EAP 모델을 1:1로 맞춤 설계합니다."
  },
  {
    step: "02",
    title: "업무협약(MOU) & 운영 기준 수립",
    desc: "1인당 지원 회기 수, 대상자 범위, 신청 절차를 확정하고 철저한 개인정보 보호 및 비밀보장 서약서를 체결합니다."
  },
  {
    step: "03",
    title: "임직원 공지 & 프라이빗 상담 개시",
    desc: "사내 인트라넷 홍보문 및 간편 온라인 신청 채널을 오픈하여 임직원이 안심하고 자율적으로 상담을 이용할 수 있도록 지원합니다."
  },
  {
    step: "04",
    title: "비식별 조직 분석 리포트 & 피드백",
    desc: "개인 식별 정보를 배제한 종합 통계와 조직 멘탈 트렌드를 분석하여, 건강한 조직 문화 구축을 위한 전문 피드백을 제공합니다."
  }
];

// EAP FAQ
const EAP_FAQS = [
  {
    q: "회사나 인사부서에서 직원의 개인 상담 내용을 열람할 수 있나요?",
    a: "절대 불가능합니다. 행복바람은 한국상담학회 윤리강령 및 개인정보보호법에 의거하여 100% 비밀보장 원칙을 철저히 준수합니다. 기업 측에는 '월간 총 상담 건수' 및 '비식별 통계'만 제공되며, 누가 어떤 내용으로 상담받았는지는 일체 공개되지 않습니다."
  },
  {
    q: "10인~30인 규모의 소기업이나 스타트업도 제휴가 가능한가요?",
    a: "네, 얼마든지 가능합니다. 행복바람은 소규모 기업도 부담 없이 도입할 수 있도록 '바우처(이용분 후불 정산) 플랜'을 운영하고 있어, 초기 고정 비용 없이 실제 직원이 상담받은 건에 대해서만 실비 정산하실 수 있습니다."
  },
  {
    q: "산업안전보건법 제41조 고객응대근로자 보호 조치 증빙이 가능한가요?",
    a: "네, 완벽히 가능합니다. 감정노동 근로자의 직무 스트레스 평가(KOSS) 및 심리상담·치유 프로그램 운영 내역에 대한 공식 증빙 리포트(개인정보 비식별화)를 발급하여 노동청 지도점검 및 안전보건 평가에 완벽 대응해 드립니다."
  },
  {
    q: "사내 출장 특강이나 단체 워크숍도 신청할 수 있나요?",
    a: "네, 박미경 소장(교육학 박사) 및 전문 강사진이 귀사 사내 교육장, 연수원 또는 외부 워크숍 장소로 직접 방문하여 실습 중심의 마음챙김(MBSR), 감정조절, 소통 워크숍을 진행합니다. 줌(Zoom) 등을 통한 실시간 비대면 웨비나도 가능합니다."
  },
  {
    q: "공식 제안서나 협약서(MOU 안)는 어떻게 받아볼 수 있나요?",
    a: "아래 온라인 문의 폼을 작성해 주시거나 대표전화(052-254-0230) 또는 이메일(mikypa@naver.com)로 요청해 주시면, 접수 후 영업일 기준 24시간 이내에 기관 맞춤형 상세 제안서와 표준 협약서(안)를 송부해 드립니다."
  }
];

export default function CorporateEAP() {
  const { isHighContrast } = useHighContrast();

  // Form State
  const [formData, setFormData] = useState({
    company_name: '',
    contact_name: '',
    department: '',
    phone: '',
    email: '',
    employee_count: '10인~50인',
    interests: [] as string[],
    preferred_format: '센터 방문 대면',
    message: '',
    privacy_agreed: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string; id?: number } | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Interest toggles
  const interestOptions = [
    "1:1 임직원 전문 심리상담",
    "감정노동자 보호 & 직무스트레스 평가",
    "사내 힐링 워크숍 & 멘탈헬스 특강",
    "조직 위기 개입(사내 외상사건 디브리핑)",
    "연간 종합 EAP 멤버십 협약",
    "바우처(쿠폰제) 시범 도입"
  ];

  const handleInterestToggle = (item: string) => {
    setFormData(prev => {
      const exists = prev.interests.includes(item);
      return {
        ...prev,
        interests: exists 
          ? prev.interests.filter(i => i !== item)
          : [...prev.interests, item]
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company_name.trim()) {
      alert("기관 및 기업명을 입력해 주세요.");
      return;
    }
    if (!formData.contact_name.trim()) {
      alert("담당자 성함을 입력해 주세요.");
      return;
    }
    if (!formData.phone.trim()) {
      alert("담당자 연락처를 입력해 주세요.");
      return;
    }
    if (!formData.privacy_agreed) {
      alert("개인정보 수집 및 이용에 동의해 주세요.");
      return;
    }

    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const res = await fetch("/api/eap/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitResult({
          success: true,
          message: data.message || "제휴 문의가 정상 접수되었습니다.",
          id: data.id
        });
        // Reset form
        setFormData({
          company_name: '',
          contact_name: '',
          department: '',
          phone: '',
          email: '',
          employee_count: '10인~50인',
          interests: [],
          preferred_format: '센터 방문 대면',
          message: '',
          privacy_agreed: false
        });
      } else {
        setSubmitResult({
          success: false,
          message: data.error || "문의 접수에 실패했습니다. 잠시 후 다시 시도해 주세요."
        });
      }
    } catch (err: any) {
      setSubmitResult({
        success: false,
        message: "네트워크 오류로 문의를 전송하지 못했습니다. 대표전화(052-254-0230)로 문의 바랍니다."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    const el = document.getElementById("eap-inquiry-form");
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={cn("min-h-screen", isHighContrast ? "bg-black text-white" : "bg-brand-beige/40")}>
      
      {/* 1. HERO SECTION */}
      <section className={cn(
        "relative py-16 md:py-24 overflow-hidden border-b",
        isHighContrast ? "bg-zinc-950 border-zinc-800 text-white" : "bg-gradient-to-b from-brand-beige via-white to-brand-beige/50 border-brand-green/20"
      )}>
        {/* Soft Background Accent */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-sage/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-sage/10 border border-brand-sage/20 text-brand-sage text-xs sm:text-sm font-bold tracking-wide">
              <Building2 className="w-4 h-4" />
              <span>행복바람 맞춤형 근로자 지원 프로그램 (EAP)</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-brand-brown leading-tight tracking-tight">
              건강한 임직원이 <span className="text-brand-sage">건강한 조직</span>을 만듭니다
            </h1>

            <p className="text-base sm:text-lg text-brand-brown/80 max-w-3xl mx-auto leading-relaxed">
              교육학 박사 및 1급 슈퍼바이저가 총괄하는 공인 EAP 솔루션.<br className="hidden sm:inline" />
              산업안전보건법 감정노동자 보호 조치 준수, 직무 스트레스 평가(KOSS), 1:1 비밀보장 심리상담부터 
              조직 위기 개입까지 귀사의 조직 문화에 최적화된 맞춤형 멘탈 복지를 설계합니다.
            </p>

            {/* Quick Trust Pillars */}
            <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
              <div className="p-3.5 rounded-2xl bg-white/80 border border-brand-green/30 shadow-2xs text-center">
                <ShieldCheck className="w-6 h-6 text-brand-sage mx-auto mb-1.5" />
                <div className="text-xs font-bold text-brand-brown">100% 철저한 비밀보장</div>
                <div className="text-[11px] text-brand-brown/60 mt-0.5">인사고과 열람 절대 불가</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/80 border border-brand-green/30 shadow-2xs text-center">
                <Award className="w-6 h-6 text-emerald-600 mx-auto mb-1.5" />
                <div className="text-xs font-bold text-brand-brown">1급 수퍼바이저 직강</div>
                <div className="text-[11px] text-brand-brown/60 mt-0.5">교육학 박사 직접 총괄</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/80 border border-brand-green/30 shadow-2xs text-center">
                <Building2 className="w-6 h-6 text-amber-600 mx-auto mb-1.5" />
                <div className="text-xs font-bold text-brand-brown">공공기관 검증 실적</div>
                <div className="text-[11px] text-brand-brown/60 mt-0.5">교육청·공단·센터 협력</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/80 border border-brand-green/30 shadow-2xs text-center">
                <Sparkles className="w-6 h-6 text-rose-500 mx-auto mb-1.5" />
                <div className="text-xs font-bold text-brand-brown">유연한 바우처 플랜</div>
                <div className="text-[11px] text-brand-brown/60 mt-0.5">실제 이용분만 후불 정산</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={scrollToForm}
                className="px-6 py-3.5 rounded-2xl bg-brand-sage text-white font-bold text-sm sm:text-base hover:bg-brand-sage/90 shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>온라인 제휴 문의 & 견적 신청</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="tel:052-254-0230"
                className="px-5 py-3.5 rounded-2xl bg-white border border-brand-brown/20 text-brand-brown font-bold text-sm sm:text-base hover:bg-brand-beige transition-all flex items-center gap-2 shadow-2xs"
              >
                <Phone className="w-4 h-4 text-brand-sage" />
                <span>직통 상담: 052-254-0230</span>
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CORE SPECIALIZED EAP SERVICES */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-green/40 text-brand-sage text-xs font-bold mb-3 border border-brand-green">
            <Briefcase className="w-3.5 h-3.5" />
            <span>맞춤형 4대 특화 서비스</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-brand-brown mb-4">
            조직의 니즈와 상황에 맞춘 다각도 케어
          </h2>
          <p className="text-sm sm:text-base text-brand-brown/70 leading-relaxed">
            단순 일회성 상담에 그치지 않고, 법정 의무 준수부터 개인 치유, 조직 활성화 및 위기 대응까지 
            빈틈없는 기업 멘탈헬스 종합 안전망을 구축해 드립니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {EAP_SERVICES.map((srv, idx) => (
            <div
              key={idx}
              className={cn(
                "rounded-3xl p-7 sm:p-8 border transition-all duration-300 flex flex-col justify-between group",
                isHighContrast 
                  ? "bg-zinc-900 border-zinc-700" 
                  : "bg-white border-brand-green/40 shadow-xs hover:shadow-md hover:border-brand-sage/40"
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-green/30 flex items-center justify-center shrink-0">
                    {srv.icon}
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-brand-beige border border-brand-brown/10 text-brand-brown font-semibold">
                    {srv.tag}
                  </span>
                </div>

                <h3 className="text-xl font-bold font-serif text-brand-brown mb-2.5 group-hover:text-brand-sage transition-colors">
                  {srv.title}
                </h3>
                <p className="text-sm text-brand-brown/75 leading-relaxed mb-6">
                  {srv.desc}
                </p>

                <div className="space-y-2.5 pt-4 border-t border-brand-green/20">
                  {srv.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-brand-brown/85">
                      <CheckCircle2 className="w-4 h-4 text-brand-sage shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4">
                <button
                  type="button"
                  onClick={scrollToForm}
                  className="w-full py-2.5 px-4 rounded-xl bg-brand-green/20 hover:bg-brand-sage hover:text-white text-brand-sage font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>이 프로그램 견적 문의하기</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. 3 PARTNERSHIP PLANS */}
      <section className={cn(
        "py-20 border-y",
        isHighContrast ? "bg-zinc-950 border-zinc-800" : "bg-white border-brand-green/20"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-sage/10 text-brand-sage text-xs font-bold mb-3 border border-brand-sage/20">
              <Compass className="w-3.5 h-3.5" />
              <span>기업 규모 & 예산 맞춤 모델</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-brand-brown mb-4">
              불필요한 고정비 없는 유연한 제휴 플랜
            </h2>
            <p className="text-sm sm:text-base text-brand-brown/70 leading-relaxed">
              임직원 10인의 소규모 스타트업부터 수백 명의 공공기관까지, 조직의 규모와 운영 목적에 가장 경제적이고 
              실효성 있는 도입 방식을 제안해 드립니다.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {PARTNERSHIP_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  "rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 relative",
                  plan.highlight 
                    ? "bg-gradient-to-b from-brand-sage/5 via-white to-brand-green/10 border-2 border-brand-sage shadow-md ring-4 ring-brand-sage/10" 
                    : isHighContrast 
                      ? "bg-zinc-900 border border-zinc-700" 
                      : "bg-white border border-brand-brown/15 shadow-2xs hover:shadow-md"
                )}
              >
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-brand-sage text-white text-[11px] font-bold tracking-wider uppercase shadow-sm">
                    RECOMMENDED PARTNERSHIP
                  </div>
                )}

                <div>
                  <div className="inline-block px-2.5 py-1 rounded-md bg-brand-beige border border-brand-brown/10 text-brand-brown/80 text-[11px] font-semibold mb-3">
                    {plan.badge}
                  </div>
                  <h3 className="text-2xl font-bold font-serif text-brand-brown mb-1">
                    {plan.title}
                  </h3>
                  <p className="text-xs text-brand-sage font-medium mb-4">
                    {plan.subtitle}
                  </p>

                  <div className="p-3 rounded-xl bg-brand-beige/50 border border-brand-brown/10 text-xs text-brand-brown/80 mb-6">
                    <span className="font-bold text-brand-brown">추천 대상: </span>
                    {plan.target}
                  </div>

                  <ul className="space-y-3 pt-2">
                    {plan.details.map((item, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-brand-brown/85">
                        <Check className="w-4 h-4 text-brand-sage shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-brand-brown/10">
                  <button
                    type="button"
                    onClick={scrollToForm}
                    className={cn(
                      "w-full py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                      plan.highlight
                        ? "bg-brand-sage text-white hover:bg-brand-sage/90 shadow-sm"
                        : "bg-brand-green/30 hover:bg-brand-sage hover:text-white text-brand-brown"
                    )}
                  >
                    <span>{plan.title} 제안서 신청</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. 4-STEP ONBOARDING ROADMAP */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-green/40 text-brand-sage text-xs font-bold mb-3 border border-brand-green">
            <Clock className="w-3.5 h-3.5" />
            <span>체계적인 4단계 도입 절차</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-brand-brown mb-4">
            상담부터 운영 리포트까지 원스톱 프로세스
          </h2>
          <p className="text-sm sm:text-base text-brand-brown/70 leading-relaxed">
            복잡한 행정 절차 없이 담당자님의 업무 부담을 최소화하며 신속하고 정확하게 도입을 지원합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {ONBOARDING_STEPS.map((step, idx) => (
            <div
              key={idx}
              className={cn(
                "p-6 rounded-3xl border flex flex-col justify-between relative",
                isHighContrast ? "bg-zinc-900 border-zinc-700" : "bg-white border-brand-green/40 shadow-2xs"
              )}
            >
              <div>
                <span className="font-serif text-3xl font-extrabold text-brand-sage/30 block mb-2">
                  {step.step}
                </span>
                <h3 className="text-base sm:text-lg font-bold font-serif text-brand-brown mb-2.5">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-brand-brown/70 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. VERIFIED PUBLIC & CORPORATE PARTNERS */}
      <section className={cn(
        "py-16 border-y",
        isHighContrast ? "bg-zinc-950 border-zinc-800" : "bg-brand-sage/5 border-brand-sage/20"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-sm font-bold uppercase tracking-wider text-brand-sage mb-2">
            PROVEN TRACK RECORD & PARTNERSHIPS
          </h3>
          <p className="text-xl sm:text-2xl font-serif font-bold text-brand-brown mb-8">
            다양한 공공기관과 기업이 행복바람의 전문성을 신뢰하고 함께합니다
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-white border border-brand-green/40 shadow-2xs">
              <div className="font-bold text-sm text-brand-brown">울산광역시교육청</div>
              <div className="text-xs text-brand-brown/60 mt-0.5">Wee센터 교원·학생 심리상담</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-brand-green/40 shadow-2xs">
              <div className="font-bold text-sm text-brand-brown">부산교원힐링센터</div>
              <div className="text-xs text-brand-brown/60 mt-0.5">교육활동 침해 교원 심리치유</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-brand-green/40 shadow-2xs">
              <div className="font-bold text-sm text-brand-brown">울산노동인권센터</div>
              <div className="text-xs text-brand-brown/60 mt-0.5">감정노동자 권익 & 멘탈 케어</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-brand-green/40 shadow-2xs">
              <div className="font-bold text-sm text-brand-brown">중구도시관리공단</div>
              <div className="text-xs text-brand-brown/60 mt-0.5">임직원 스트레스 관리 EAP</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE INQUIRY & QUOTE FORM */}
      <section id="eap-inquiry-form" className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className={cn(
          "rounded-3xl p-6 sm:p-10 md:p-12 border shadow-lg",
          isHighContrast ? "bg-zinc-900 border-zinc-700" : "bg-white border-brand-green/40"
        )}>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-sage/10 text-brand-sage text-xs font-bold mb-3 border border-brand-sage/20">
              <Send className="w-3.5 h-3.5" />
              <span>실시간 제휴 & 견적 문의 접수</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-brown mb-3">
              기관 및 기업 EAP 맞춤 제안서 신청
            </h2>
            <p className="text-xs sm:text-sm text-brand-brown/70 leading-relaxed">
              아래 양식을 남겨주시면 영업일 기준 24시간 이내에 전담 수퍼바이저가<br className="hidden sm:inline" />
              귀사 요구사항에 맞춘 맞춤형 제안서와 상세 견적을 신속히 송부해 드립니다.
            </p>
          </div>

          {/* Success Notification Alert */}
          {submitResult && (
            <div className={cn(
              "p-5 rounded-2xl mb-8 flex items-start gap-3 border animate-in fade-in",
              submitResult.success 
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-rose-50 border-rose-200 text-rose-800"
            )}>
              {submitResult.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="font-bold text-sm mb-0.5">
                  {submitResult.success ? "제휴 문의 접수 완료 (신청번호: #" + submitResult.id + ")" : "접수 처리 안내"}
                </div>
                <div className="text-xs sm:text-sm leading-relaxed">
                  {submitResult.message}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* ROW 1: Company & Contact Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-brown mb-1.5">
                  기관 및 기업명 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="예: (주)행복컴퍼니, 울산시청 등"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-brand-brown/20 bg-brand-beige/20 text-brand-brown text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-sage"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-brown mb-1.5">
                  담당자 성함 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="예: 홍길동 팀장"
                  value={formData.contact_name}
                  onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-brand-brown/20 bg-brand-beige/20 text-brand-brown text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-sage"
                />
              </div>
            </div>

            {/* ROW 2: Department & Contact Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-brown mb-1.5">
                  부서 / 직급
                </label>
                <input
                  type="text"
                  placeholder="예: 인사총무팀, 복지후생과"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-brand-brown/20 bg-brand-beige/20 text-brand-brown text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-sage"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-brown mb-1.5">
                  담당자 연락처 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="예: 010-1234-5678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-brand-brown/20 bg-brand-beige/20 text-brand-brown text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-sage"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-brown mb-1.5">
                  제안서 수신 이메일 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="예: hr@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-brand-brown/20 bg-brand-beige/20 text-brand-brown text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-sage"
                />
              </div>
            </div>

            {/* ROW 3: Employee Count & Format */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-brown mb-1.5">
                  임직원 규모
                </label>
                <select
                  value={formData.employee_count}
                  onChange={(e) => setFormData({ ...formData, employee_count: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-brand-brown/20 bg-white text-brand-brown text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-sage"
                >
                  <option value="10인 미만">10인 미만 (초기 스타트업)</option>
                  <option value="10인~50인">10인 ~ 50인 (소기업/중소기업)</option>
                  <option value="50인~100인">50인 ~ 100인</option>
                  <option value="100인~300인">100인 ~ 300인 (중견기업/공공기관)</option>
                  <option value="300인 이상">300인 이상 (대기업/지자체)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-brown mb-1.5">
                  희망 상담 형태
                </label>
                <select
                  value={formData.preferred_format}
                  onChange={(e) => setFormData({ ...formData, preferred_format: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-brand-brown/20 bg-white text-brand-brown text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-sage"
                >
                  <option value="센터 방문 대면">센터 방문 대면 (프라이빗 룸)</option>
                  <option value="온라인 비대면 (화상/전화)">온라인 비대면 (화상/전화 1:1)</option>
                  <option value="사내 방문 출장 파견">사내 방문 출장 파견 (특강/워크숍)</option>
                  <option value="대면 + 비대면 혼합형">대면 + 비대면 혼합형 (하이브리드)</option>
                  <option value="상담 후 결정">상담 후 결정</option>
                </select>
              </div>
            </div>

            {/* ROW 4: Interests Checkboxes */}
            <div>
              <label className="block text-xs font-bold text-brand-brown mb-2">
                관심 제휴 프로그램 (복수 선택 가능)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {interestOptions.map((opt, iIdx) => {
                  const checked = formData.interests.includes(opt);
                  return (
                    <button
                      key={iIdx}
                      type="button"
                      onClick={() => handleInterestToggle(opt)}
                      className={cn(
                        "p-3 rounded-xl border text-xs font-medium text-left transition-all flex items-center justify-between cursor-pointer",
                        checked 
                          ? "bg-brand-sage text-white border-brand-sage shadow-2xs" 
                          : "bg-white border-brand-brown/20 text-brand-brown hover:bg-brand-beige"
                      )}
                    >
                      <span>{opt}</span>
                      {checked && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ROW 5: Detailed Message */}
            <div>
              <label className="block text-xs font-bold text-brand-brown mb-1.5">
                세부 문의 및 요청 사항
              </label>
              <textarea
                rows={4}
                placeholder="예: 콜센터 직원 30명 감정노동 스트레스 진단 및 연간 바우처 예산 견적 문의드립니다. 희망 도입 일정은 다음 달부터입니다."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-brand-brown/20 bg-brand-beige/20 text-brand-brown text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-sage"
              />
            </div>

            {/* Privacy Agreement */}
            <div className="p-3.5 rounded-xl bg-brand-beige/50 border border-brand-brown/15 flex items-start gap-2.5">
              <input
                type="checkbox"
                id="eap-privacy"
                required
                checked={formData.privacy_agreed}
                onChange={(e) => setFormData({ ...formData, privacy_agreed: e.target.checked })}
                className="mt-0.5 rounded text-brand-sage focus:ring-brand-sage"
              />
              <label htmlFor="eap-privacy" className="text-xs text-brand-brown/80 leading-relaxed cursor-pointer">
                <span className="font-bold text-brand-brown">[필수] 개인정보 수집 및 이용 동의: </span>
                제휴 상담 및 견적 송부를 위해 기관명, 담당자명, 연락처, 이메일 정보를 수집하며, 상담 목적 달성 시까지 안전하게 보관됩니다.
              </label>
            </div>

            {/* Submit Button */}
            <div className="text-center pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto min-w-[280px] px-8 py-4 rounded-2xl bg-brand-sage text-white font-bold text-base hover:bg-brand-sage/90 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>제휴 문의 전송 중...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>EAP 맞춤 제안서 & 견적 신청하기</span>
                  </>
                )}
              </button>
              <p className="text-[11px] text-brand-brown/60 mt-2.5">
                신청 즉시 전담팀에 알림이 전송되며, 24시간(영업일 기준) 이내에 이메일과 전화로 안내드립니다.
              </p>
            </div>

          </form>
        </div>
      </section>

      {/* 7. FAQ SECTION */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-green/40 text-brand-sage text-xs font-bold mb-3 border border-brand-green">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>자주 묻는 질문 (FAQ)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-brown">
            기업 및 기관 EAP 도입 FAQ
          </h2>
        </div>

        <div className="space-y-3.5">
          {EAP_FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className={cn(
                  "rounded-2xl border transition-all overflow-hidden",
                  isOpen 
                    ? "bg-white border-brand-sage/40 shadow-xs" 
                    : "bg-white/70 border-brand-green/30 hover:bg-white"
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-brand-brown flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-brand-sage font-serif">Q.</span>
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown className={cn(
                    "w-4 h-4 text-brand-brown/60 transition-transform duration-200 shrink-0",
                    isOpen && "rotate-180 text-brand-sage"
                  )} />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-brand-brown/80 leading-relaxed border-t border-brand-green/20"
                    >
                      <div className="p-3.5 rounded-xl bg-brand-beige/40">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. DIRECT CONTACT CARD */}
      <section className="pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 bg-brand-brown text-brand-beige shadow-xl text-center space-y-4">
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
            제안요청서(RFP) 송부 및 공문 수신처 안내
          </h3>
          <p className="text-xs sm:text-sm text-brand-beige/80 max-w-xl mx-auto leading-relaxed">
            기관 내부 공문 발송, 사내 입찰 제안요청서(RFP) 송부 또는 긴급 위기개입 상담이 필요하신 경우 아래 직통 연락처로 문의해 주시기 바랍니다.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-sm font-medium">
            <a 
              href="tel:052-254-0230" 
              className="px-4 py-2.5 rounded-xl bg-brand-sage text-white font-bold hover:bg-brand-sage/90 transition-colors flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>직통 상담: 052-254-0230</span>
            </a>

            <a 
              href="mailto:mikypa@naver.com" 
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-2"
            >
              <Mail className="w-4 h-4 text-brand-sage" />
              <span>공문 수신: mikypa@naver.com</span>
            </a>
          </div>

          <div className="pt-3 text-xs text-brand-beige/60 flex items-center justify-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-brand-sage" />
            <span>울산광역시 울주군 삼남읍 도호1길 23 상가 408호 행복바람심리상담연구소</span>
          </div>
        </div>
      </section>

    </div>
  );
}
