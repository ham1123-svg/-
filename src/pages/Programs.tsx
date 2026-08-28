import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, User, Users, BookOpen, CheckCircle2, X, Clock, ShieldCheck, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Program } from '../types';
import { cn } from '../lib/utils';

interface ProgramDetail {
  overview: string;
  targets: {
    group: string;
    items: string[];
  }[];
  steps: {
    step: string;
    name: string;
    desc: string;
  }[];
  guidelines: {
    format: string;
    duration: string;
    confidentiality: string;
  };
}

const PROGRAM_DETAILS: Record<string, ProgramDetail> = {
  "청소년 및 성인 상담": {
    overview: "학업, 진로, 대인관계, 정서적 혼란 등 생애주기별로 마주하는 다양한 심리적 갈등을 전문적으로 다룹니다. 안전하고 비밀이 보장되는 공간에서 자신의 내면을 깊이 탐색하고, 건강한 자아 존중감과 심리적 탄력성을 회복하도록 돕습니다.",
    targets: [
      {
        group: "청소년 (만 13세 ~ 18세)",
        items: [
          "학업 스트레스, 시험 불안 및 진로 고민",
          "또래 관계 갈등, 따돌림 및 학교 부적응",
          "부모-자녀 간 소통 단절 및 갈등",
          "우울, 무기력, 분노 조절의 어려움 및 충동성"
        ]
      },
      {
        group: "성인 (만 19세 이상)",
        items: [
          "우울, 공황, 만성적인 불안 및 스트레스 관리",
          "직장 내 갈등, 번아웃(Burnout), 이직/경력 전환 고민",
          "연인, 배우자, 가족 등 친밀한 대인관계 갈등",
          "자존감 저하, 정체성 혼란, 트라우마(외상 후 스트레스) 치유"
        ]
      }
    ],
    steps: [
      { step: "01", name: "초기 접수 & 면담", desc: "주 호소 문제 파악, 상담 목표 설정 (필요시 심리검사 병행)" },
      { step: "02", name: "심리 평가 & 탐색", desc: "인지적·정서적 패턴 분석, 문제의 근본 원인 탐색" },
      { step: "03", name: "집중 상담 & 개입", desc: "개인 맞춤형 상담 기법 적용, 대처 전략 습득 및 행동 변화" },
      { step: "04", name: "종결 & 사후 관리", desc: "상담 목표 달성도 평가, 변화 유지 및 재발 방지 전략 점검" }
    ],
    guidelines: {
      format: "1:1 개인 상담 (대면 원칙 / 필요시 비대면 화상 상담 가능)",
      duration: "1회 50분 진행 (주 1회 정기 진행 권장)",
      confidentiality: "상담 내용 및 개인정보는 전문 상담 윤리 규정에 따라 철저히 비밀이 보장됩니다."
    }
  },
  "부부 및 가족 관계 개선": {
    overview: "부부 및 가족 구성원 간의 의사소통 단절, 성격 차이, 갈등을 심층적으로 다루어 서로에 대한 이해와 신뢰를 회복하고 건강한 가족 역동을 구축하도록 돕습니다.",
    targets: [
      {
        group: "부부 및 커플",
        items: [
          "반복되는 부부 갈등 및 성격·가치관 차이",
          "대화 단절 및 정서적 거리감",
          "외도, 신뢰 훼손 후 관계 회복",
          "결혼 전 예비부부 관계 준비 및 탐색"
        ]
      },
      {
        group: "가족 전체",
        items: [
          "부모-자녀 간 극심한 갈등 및 대화 부재",
          "원가족과의 갈등 및 경계 설정 문제",
          "가족 구성원의 위기 상황 극복 지원"
        ]
      }
    ],
    steps: [
      { step: "01", name: "초기 가족 접수", desc: "가족 관계 역동 파악 및 주요 갈등 요인 탐색" },
      { step: "02", name: "상호작용 평가", desc: "의사소통 패턴 및 관계 구조 정밀 분석" },
      { step: "03", name: "관계 회복 개입", desc: "공감적 대화 훈련 및 갈등 해결 모델 적용" },
      { step: "04", name: "통합 및 종결", desc: "건강한 소통 정착 확인 및 가족 탄력성 강화" }
    ],
    guidelines: {
      format: "부부/가족 동반 상담 (필요시 개별 상담 병행)",
      duration: "1회 80분 진행 (격주 또는 주 1회 권장)",
      confidentiality: "상담 내 모든 발언과 정보는 철저한 비밀 유지를 준수합니다."
    }
  },
  "종합 심리검사 및 해석": {
    overview: "표준화된 전문 심리검사 도구를 통해 현재의 인지적, 정서적, 성격적 특성을 객관적이고 다각도로 파악하여 자기 이해와 맞춤형 성장을 안내합니다.",
    targets: [
      {
        group: "검사 대상",
        items: [
          "자신의 성격 구조 및 정서 상태를 정확히 알고 싶은 분",
          "우울, 불안, 집중력 저하의 객관적 원인을 파악하고 싶은 분",
          "적성과 진로 방향을 구체적으로 탐색하고자 하는 분",
          "결혼 전 서로의 성향과 소통 방식을 객관화하고 싶은 커플"
        ]
      }
    ],
    steps: [
      { step: "01", name: "사전 인터뷰", desc: "검사 목적 확인 및 적합한 검사 패키지 선정" },
      { step: "02", name: "검사 실시", desc: "MMPI-2, TCI, SCT 등 표준화 지필/온라인 검사 진행" },
      { step: "03", name: "채점 및 프로파일링", desc: "임상 전문가의 정밀 분석 및 종합 결과 보고서 작성" },
      { step: "04", name: "해석 상담", desc: "결과 설명 및 개인별 성장 솔루션 제시 (1회 50분)" }
    ],
    guidelines: {
      format: "개별 검사 실시 + 1:1 심층 해석 상담",
      duration: "검사 소요시간 약 60~90분 / 해석 상담 50분",
      confidentiality: "검사 결과 보고서는 본인 외 절대 외부에 유출되지 않습니다."
    }
  },
  "EAP (근로자 지원 프로그램)": {
    overview: "기업 및 기관 임직원의 직무 스트레스, 조직 내 대인관계 갈등, 번아웃, 일과 삶의 균형(워라밸)을 지원하여 업무 몰입도와 마음 건강을 함께 지킵니다.",
    targets: [
      {
        group: "임직원 및 관리자",
        items: [
          "업무 과중 및 번아웃 증후군 극복",
          "직장 내 상사/동료 간 커뮤니케이션 갈등",
          "리더십 스트레스 및 감정노동 회복",
          "이직 및 커리어 전환 스트레스 관리"
        ]
      }
    ],
    steps: [
      { step: "01", name: "EAP 신청", desc: "임직원 개별 신청 및 비밀 보장 등록" },
      { step: "02", name: "직무 스트레스 진단", desc: "업무 환경 및 개인 심리 상태 복합 진단" },
      { step: "03", name: "솔루션 코칭", desc: "감정 조절, 스트레스 해소법, 소통 스킬 습득" },
      { step: "04", name: "사후 모니터링", desc: "업무 복귀 및 스트레스 관리 지속 점검" }
    ],
    guidelines: {
      format: "1:1 EAP 전문 상담 (대면 또는 온라인 비대면)",
      duration: "1회 50분 (기업 계약 회기 기준)",
      confidentiality: "회사 인사팀 등에 상담 내용이 절대 공개되지 않는 100% 비밀보장제"
    }
  },
  "집단상담 및 심리교육": {
    overview: "유사한 고민을 가진 사람들과의 안전한 상호작용을 통해 고립감을 해소하고, 공감과 연대의 경험을 통해 함께 성장하는 소그룹 프로그램입니다.",
    targets: [
      {
        group: "소그룹 및 단체",
        items: [
          "대인관계 불안 및 사회성 증진을 원하는 분",
          "자기표현 및 감정 조절 워크숍이 필요한 분",
          "부모 교육 및 긍정 훈육법을 배우고 싶은 양육자",
          "마인드풀니스(마음챙김) 및 스트레스 완화 훈련"
        ]
      }
    ],
    steps: [
      { step: "01", name: "주제별 모집", desc: "소규모 정원(4~8명) 구성 및 사전 오리엔테이션" },
      { step: "02", name: "안전한 라포 형성", desc: "집단 규칙 설정 및 자기소개/공감대 형성" },
      { step: "03", name: "구조화된 활동", desc: "주제별 워크숍, 역할극, 나눔 및 피드백" },
      { step: "04", name: "집단 종결 및 나눔", desc: "경험 통합 및 일상 적용 다짐" }
    ],
    guidelines: {
      format: "소규모 집단 워크숍 (4~8인 내외)",
      duration: "회기당 90~120분 (총 4~8회기 코스)",
      confidentiality: "집단 내 모든 대화에 대한 상호 비밀유지 서약 필수"
    }
  }
};

const categories = [
  { id: 'all', name: '전체', icon: null },
  { id: '개인상담', name: '개인상담', icon: <User className="w-5 h-5" /> },
  { id: '부부상담', name: '부부상담', icon: <Users className="w-5 h-5" /> },
  { id: '심리검사', name: '심리검사', icon: <BookOpen className="w-5 h-5" /> },
  { id: '기업상담', name: '기업상담', icon: <Heart className="w-5 h-5" /> },
  { id: '집단/교육', name: '집단/교육', icon: <Users className="w-5 h-5" /> },
];

export default function Programs() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  useEffect(() => {
    fetch('/api/programs')
      .then(res => res.json())
      .then(data => {
        setPrograms(data);
        setLoading(false);
      });
  }, []);

  const filteredPrograms = activeCategory === 'all' 
    ? programs 
    : programs.filter(p => p.category === activeCategory);

  const currentDetail = selectedProgram ? PROGRAM_DETAILS[selectedProgram.title] : null;

  return (
    <div className="min-h-screen bg-brand-beige/20 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Featured Guide Banner for 청소년 및 성인 상담 */}
        <div className="mb-16 bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-brand-green/40 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-brand-green/20 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-sage/10 text-brand-sage text-xs font-bold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>대표 프로그램 안내</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-brown mb-4">
              청소년 및 성인 상담 프로그램 안내
            </h2>
            <p className="text-brand-brown/80 font-serif leading-relaxed mb-6 text-base sm:text-lg">
              학업, 진로, 대인관계, 정서적 혼란 등 생애주기별로 마주하는 다양한 심리적 갈등을 전문적으로 다룹니다. 
              안전하고 비밀이 보장되는 공간에서 자신의 내면을 깊이 탐색하고, 건강한 자아 존중감과 심리적 탄력성을 회복하도록 돕습니다.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => {
                  const target = programs.find(p => p.title === "청소년 및 성인 상담") || {
                    id: 1,
                    category: "개인상담",
                    title: "청소년 및 성인 상담",
                    description: "우울, 불안, 스트레스 등 개인이 마주한 심리적 어려움을 심층적으로 다루고 성장을 지원합니다.",
                    tags: "#청소년 #성인 #심리성장"
                  };
                  setSelectedProgram(target);
                }}
                className="bg-brand-sage text-white px-7 py-3.5 rounded-xl font-bold hover:bg-brand-sage/90 transition-all shadow-sm flex items-center gap-2"
              >
                상세 안내 및 진행과정 보기 <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                to="/reservation"
                className="bg-brand-green/30 text-brand-sage border border-brand-sage/30 px-7 py-3.5 rounded-xl font-bold hover:bg-brand-green/50 transition-all flex items-center gap-2"
              >
                상담 예약하기
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-brown mb-3">전체 상담 프로그램</h1>
          <p className="text-brand-brown/60">개인, 부부, 가족, 기업을 위한 전문적이고 체계적인 심리 솔루션을 제공합니다.</p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all",
                activeCategory === cat.id 
                  ? "bg-brand-sage text-white shadow-md" 
                  : "bg-white text-brand-brown/70 hover:bg-brand-green/30 border border-brand-green/30"
              )}
            >
              {cat.icon}
              {cat.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-sage"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrograms.map((program) => (
              <motion.div
                key={program.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl p-8 border border-brand-green/30 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="px-3.5 py-1 bg-brand-green/30 text-brand-sage text-xs font-bold rounded-full border border-brand-green/40">
                      {program.category}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-brand-brown mb-3 group-hover:text-brand-sage transition-colors">
                    {program.title}
                  </h3>
                  <p className="text-brand-brown/70 mb-6 line-clamp-3 text-sm leading-relaxed">
                    {program.description}
                  </p>
                </div>
                
                <div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {program.tags.split(' ').map(tag => (
                      <span key={tag} className="text-xs text-brand-brown/60 bg-brand-beige px-2.5 py-1 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <button 
                    onClick={() => setSelectedProgram(program)}
                    className="w-full py-3.5 bg-brand-beige/50 text-brand-sage font-bold rounded-xl border border-brand-sage/40 hover:bg-brand-sage hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm text-sm"
                  >
                    상세보기 <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Program Detail Modal */}
      <AnimatePresence>
        {selectedProgram && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProgram(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-brand-green/40 overflow-hidden z-10 my-8 max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="p-6 sm:p-8 bg-brand-beige/50 border-b border-brand-green/30 flex justify-between items-start shrink-0">
                <div>
                  <span className="px-3 py-1 rounded-full bg-brand-sage/10 text-brand-sage text-xs font-bold mb-3 inline-block">
                    {selectedProgram.category}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-brown">
                    {selectedProgram.title} 프로그램 안내
                  </h2>
                </div>
                <button 
                  onClick={() => setSelectedProgram(null)}
                  className="p-2 rounded-full hover:bg-white text-brand-brown/60 hover:text-brand-brown transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-8 text-brand-brown">
                
                {/* 1. 상담 개요 */}
                <div>
                  <h3 className="text-lg font-bold text-brand-sage mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-sage"></span>
                    상담 개요
                  </h3>
                  <div className="p-5 rounded-2xl bg-brand-beige/40 border border-brand-green/30 text-sm sm:text-base leading-relaxed text-brand-brown/90 font-serif">
                    {currentDetail?.overview || selectedProgram.description}
                  </div>
                </div>

                {/* 2. 주요 상담 대상 */}
                {currentDetail?.targets && (
                  <div>
                    <h3 className="text-lg font-bold text-brand-sage mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-brand-sage"></span>
                      주요 상담 대상
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {currentDetail.targets.map((target, idx) => (
                        <div key={idx} className="p-5 rounded-2xl bg-white border border-brand-green/50 shadow-sm">
                          <h4 className="font-bold text-base text-brand-brown mb-3 pb-2 border-b border-brand-green/30">
                            {target.group}
                          </h4>
                          <ul className="space-y-2 text-sm text-brand-brown/80">
                            {target.items.map((item, iIdx) => (
                              <li key={iIdx} className="flex items-start gap-2">
                                <span className="text-brand-sage mt-1">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. 상담 진행 과정 */}
                {currentDetail?.steps && (
                  <div>
                    <h3 className="text-lg font-bold text-brand-sage mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-brand-sage"></span>
                      상담 진행 과정
                    </h3>
                    <div className="border border-brand-green/40 rounded-2xl overflow-hidden">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-brand-green/30 text-brand-brown font-bold border-b border-brand-green/30">
                          <tr>
                            <th className="py-3 px-4 w-20 text-center">단계</th>
                            <th className="py-3 px-4 w-36 sm:w-44">구분</th>
                            <th className="py-3 px-4">주요 내용</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-green/20">
                          {currentDetail.steps.map((st, sIdx) => (
                            <tr key={sIdx} className="hover:bg-brand-beige/20 transition-colors">
                              <td className="py-3.5 px-4 text-center font-bold text-brand-sage">{st.step}</td>
                              <td className="py-3.5 px-4 font-bold text-brand-brown">{st.name}</td>
                              <td className="py-3.5 px-4 text-brand-brown/80">{st.desc}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 4. 상담 안내 및 유의사항 */}
                {currentDetail?.guidelines && (
                  <div>
                    <h3 className="text-lg font-bold text-brand-sage mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-brand-sage"></span>
                      상담 안내 및 유의사항
                    </h3>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-2xl bg-brand-beige/40 border border-brand-green/30">
                        <div className="flex items-center gap-2 text-brand-sage font-bold text-xs uppercase mb-2">
                          <Users className="w-4 h-4" /> 진행 방식
                        </div>
                        <p className="text-xs sm:text-sm text-brand-brown/80 leading-relaxed">
                          {currentDetail.guidelines.format}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-brand-beige/40 border border-brand-green/30">
                        <div className="flex items-center gap-2 text-brand-sage font-bold text-xs uppercase mb-2">
                          <Clock className="w-4 h-4" /> 상담 시간
                        </div>
                        <p className="text-xs sm:text-sm text-brand-brown/80 leading-relaxed">
                          {currentDetail.guidelines.duration}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-brand-beige/40 border border-brand-green/30">
                        <div className="flex items-center gap-2 text-brand-sage font-bold text-xs uppercase mb-2">
                          <ShieldCheck className="w-4 h-4" /> 비밀 보장
                        </div>
                        <p className="text-xs sm:text-sm text-brand-brown/80 leading-relaxed">
                          {currentDetail.guidelines.confidentiality}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Footer CTA */}
              <div className="p-6 bg-brand-beige/50 border-t border-brand-green/30 flex flex-wrap justify-between items-center gap-4 shrink-0">
                <p className="text-xs sm:text-sm text-brand-brown/70">
                  전화 문의: <strong className="text-brand-brown">052-254-0230</strong>
                </p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setSelectedProgram(null)}
                    className="px-5 py-2.5 rounded-xl border border-brand-brown/20 text-brand-brown font-medium hover:bg-white text-sm"
                  >
                    닫기
                  </button>
                  <Link
                    to="/reservation"
                    className="px-6 py-2.5 rounded-xl bg-brand-sage text-white font-bold hover:bg-brand-sage/90 transition-all text-sm flex items-center gap-2 shadow-sm"
                  >
                    <Calendar className="w-4 h-4" />
                    상담 예약하기
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

