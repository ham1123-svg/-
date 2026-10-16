import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Calendar, 
  FileText, 
  Activity, 
  Clock, 
  Phone, 
  HelpCircle,
  Brain,
  Layers,
  Heart,
  ChevronRight,
  ClipboardList,
  Target
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useHighContrast } from '../context/HighContrastContext';

export default function Assessment() {
  const { isHighContrast } = useHighContrast();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState<'full-battery' | 'personality' | 'stress' | 'process'>('full-battery');

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    }
  }, [location.hash]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-brand-beige/20 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-sage/10 text-brand-sage text-xs font-bold border border-brand-sage/20 mb-3.5">
            <BookOpen className="w-4 h-4" />
            <span>PSYCHOLOGICAL ASSESSMENT</span>
            <span className="text-brand-brown/40">·</span>
            <span>심리평가 및 표준화 검사</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-brand-brown mb-4 tracking-tight">
            내 마음을 객관적으로 마주하는 <br className="hidden sm:inline" />
            <span className="text-brand-sage">전문 표준화 심리평가</span>
          </h1>

          <p className="text-sm sm:text-base text-brand-brown/75 font-serif leading-relaxed max-w-2xl mx-auto">
            표준화된 검사 도구를 통해 현재의 인지 기능, 타고난 기질과 성격, 
            무의식적 정서와 스트레스 상태를 정밀하게 분석하여 나 자신을 온전히 이해하고 
            명확한 치유 솔루션을 찾도록 돕습니다.
          </p>

          {/* Quick Jump Anchor Tabs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={() => scrollTo('full-battery')}
              className="px-4 py-2 rounded-xl bg-white hover:bg-brand-green/20 text-xs sm:text-sm font-semibold text-brand-brown border border-brand-green/30 transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
            >
              <Brain className="w-4 h-4 text-brand-sage" />
              <span>종합심리평가 (풀배터리)</span>
            </button>
            <button
              onClick={() => scrollTo('personality')}
              className="px-4 py-2 rounded-xl bg-white hover:bg-brand-green/20 text-xs sm:text-sm font-semibold text-brand-brown border border-brand-green/30 transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
            >
              <Layers className="w-4 h-4 text-brand-sage" />
              <span>성격 및 기질 검사</span>
            </button>
            <button
              onClick={() => scrollTo('stress')}
              className="px-4 py-2 rounded-xl bg-white hover:bg-brand-green/20 text-xs sm:text-sm font-semibold text-brand-brown border border-brand-green/30 transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
            >
              <Activity className="w-4 h-4 text-brand-sage" />
              <span>정서 및 스트레스 평가</span>
            </button>
            <button
              onClick={() => scrollTo('process')}
              className="px-4 py-2 rounded-xl bg-brand-sage hover:bg-brand-sage/90 text-white text-xs sm:text-sm font-semibold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
            >
              <ClipboardList className="w-4 h-4 text-white" />
              <span>검사 진행 절차 (4단계)</span>
            </button>
          </div>
        </div>

        {/* 1. 종합심리평가 (풀배터리 검사 안내) */}
        <section id="full-battery" className="mb-20 scroll-mt-24">
          <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-brand-green/30 shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-sage/15 text-brand-sage font-bold text-xs">
                  <Brain className="w-3.5 h-3.5" />
                  <span>Comprehensive Full Battery</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-brown leading-tight">
                  종합심리평가 <br />
                  <span className="text-brand-sage">(풀배터리 종합 검사)</span>
                </h2>
                <p className="text-xs sm:text-sm text-brand-brown/75 font-serif leading-relaxed">
                  임상 심리학에서 가장 신뢰받는 최고 수준의 종합 검사 패키지입니다. 
                  지능, 인지 처리 과정, 정서적 통제력, 대인관계 양식, 방어 기제 등 
                  개인의 심리 전반을 다면적이고 입체적으로 분석합니다.
                </p>
                <div className="p-4 rounded-2xl bg-brand-green/20 border border-brand-sage/20 text-xs text-brand-brown/80 space-y-1.5">
                  <div className="font-bold text-brand-sage flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>추천 대상</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-xs text-brand-brown/70">
                    <li>자신의 지적 잠재력과 정서 패턴을 총체적으로 파악하고 싶은 분</li>
                    <li>지속되는 우울, 불안, 집중력 저하의 복합적인 근본 원인을 알고 싶은 분</li>
                    <li>진로, 학업, 직업적 의사결정을 앞두고 객관적 지표가 필요한 분</li>
                    <li>전문적인 종합 심리 평가서(결과보고서)가 필요한 분</li>
                  </ul>
                </div>
              </div>

              {/* Sub-tests included in Full Battery */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    name: "한국판 웩슬러 지능검사 (K-WAIS/K-WISC)",
                    desc: "언어이해, 지각추론, 작업기억, 처리속도 등 4대 인지 지표와 종합 지능(IQ) 정밀 측정"
                  },
                  {
                    name: "로샤 검사 (Rorschach Test)",
                    desc: "잉크 반점 카드를 통해 무의식적 갈등, 정서적 충동 조절력 및 인지적 왜곡 평가"
                  },
                  {
                    name: "다면적 인성검사 (MMPI-2 / MMPI-A)",
                    desc: "567문항의 표준화된 객관적 질문지를 통해 성격 특성과 임상적 정서 상태 측정"
                  },
                  {
                    name: "문장완성검사 (SCT)",
                    desc: "미완성된 문장을 완성하며 부모, 이성, 친구, 자아에 대한 내면의 핵심 신념 탐색"
                  },
                  {
                    name: "그림투사검사 (HTP & KFD)",
                    desc: "집, 나무, 사람, 동적 가족화를 그리며 무의식적 자아상과 가족 역동을 안전하게 투사"
                  },
                  {
                    name: "벤더-게슈탈트 검사 (BGT)",
                    desc: "도형 모사 과제를 통해 시각-운동 협응 능력 및 기질적 신경심리 결함 스크리닝"
                  }
                ].map((test, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-2xl bg-brand-beige/30 border border-brand-green/25 hover:border-brand-sage/40 transition-colors"
                  >
                    <div className="font-bold text-sm text-brand-brown mb-1.5 font-serif">
                      {test.name}
                    </div>
                    <p className="text-xs text-brand-brown/70 leading-relaxed font-serif">
                      {test.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 2. 성격 및 기질 검사 */}
        <section id="personality" className="mb-20 scroll-mt-24">
          <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-brand-green/30 shadow-md">
            <div className="max-w-3xl mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs mb-2.5">
                <Layers className="w-3.5 h-3.5 text-amber-700" />
                <span>Personality &amp; Temperament</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-brown mb-2.5">
                성격 및 기질 검사 <span className="text-brand-sage">(TCI · MBTI · MMPI-2)</span>
              </h2>
              <p className="text-xs sm:text-sm text-brand-brown/75 font-serif leading-relaxed">
                타고난 유전적 기질(Temperament)과 생애 환경 속에서 형성된 성숙한 성격(Character)을 분리하여 
                "나는 왜 이런 상황에서 스트레스를 받을까?", "나에게 가장 자연스러운 소통 방식은 무엇일까?"를 규명합니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* TCI */}
              <div className="p-6 rounded-3xl bg-brand-beige/25 border border-brand-green/30 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-brand-sage text-white mb-3 inline-block">
                    기질 및 성격 검사
                  </span>
                  <h3 className="text-lg font-serif font-bold text-brand-brown mb-2">TCI 검사</h3>
                  <p className="text-xs text-brand-brown/70 font-serif leading-relaxed mb-4">
                    유전적으로 타고난 신경생물학적 기질(자극추구, 위험회피, 보상의존성, 끈기)과 
                    자율성, 연대감, 자기초월 등 성숙한 성격 차원을 구체적으로 분석합니다.
                  </p>
                  <ul className="text-xs text-brand-brown/80 space-y-1.5 border-t border-brand-green/20 pt-3 font-serif">
                    <li>✓ 부부 및 연인 성격 차이 분석</li>
                    <li>✓ 자녀의 타고난 기질 맞춤 훈육법</li>
                    <li>✓ 자기 이해 및 내적 갈등 해소</li>
                  </ul>
                </div>
                <div className="mt-6 pt-3 text-xs text-brand-sage font-bold flex items-center justify-between">
                  <span>온라인 또는 지필 실시</span>
                  <span>약 30~40분</span>
                </div>
              </div>

              {/* MMPI-2 */}
              <div className="p-6 rounded-3xl bg-brand-beige/25 border border-brand-green/30 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-blue-600 text-white mb-3 inline-block">
                    다면적 인성 검사
                  </span>
                  <h3 className="text-lg font-serif font-bold text-brand-brown mb-2">MMPI-2 검사</h3>
                  <p className="text-xs text-brand-brown/70 font-serif leading-relaxed mb-4">
                    세계적으로 가장 널리 사용되는 표준화 인성검사로, 수검 태도의 타당도(솔직성, 방어성)와 
                    우울, 불안, 신체화, 대인관계 민감성 등 임상적 심리 상태를 과학적으로 측정합니다.
                  </p>
                  <ul className="text-xs text-brand-brown/80 space-y-1.5 border-t border-brand-green/20 pt-3 font-serif">
                    <li>✓ 정서적 고통 및 위기 척도 파악</li>
                    <li>✓ 스트레스 취약성 정밀 진단</li>
                    <li>✓ 신뢰도 높은 객관적 프로파일</li>
                  </ul>
                </div>
                <div className="mt-6 pt-3 text-xs text-blue-700 font-bold flex items-center justify-between">
                  <span>정밀 567문항 검사</span>
                  <span>약 60~80분</span>
                </div>
              </div>

              {/* MBTI Form M/Q */}
              <div className="p-6 rounded-3xl bg-brand-beige/25 border border-brand-green/30 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-purple-600 text-white mb-3 inline-block">
                    성격유형 정밀 검사
                  </span>
                  <h3 className="text-lg font-serif font-bold text-brand-brown mb-2">정식 MBTI 정밀검사</h3>
                  <p className="text-xs text-brand-brown/70 font-serif leading-relaxed mb-4">
                    인터넷 약식 검사와 다른 한국MBTI연구소 공인 정식 검사(Form M/Form Q)입니다. 
                    16가지 성격 유형과 하위 다면 척도를 통해 선호 경향성과 갈등 소통 양식을 입체 분석합니다.
                  </p>
                  <ul className="text-xs text-brand-brown/80 space-y-1.5 border-t border-brand-green/20 pt-3 font-serif">
                    <li>✓ 진로 및 직업 적성 탐색</li>
                    <li>✓ 커플·부부 간 소통 코드 해석</li>
                    <li>✓ 팀 빌딩 및 직장 내 대인관계</li>
                  </ul>
                </div>
                <div className="mt-6 pt-3 text-xs text-purple-700 font-bold flex items-center justify-between">
                  <span>공인 정식 프로파일 리포트</span>
                  <span>약 25~35분</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. 정서 및 스트레스 평가 (자가진단 연계) */}
        <section id="stress" className="mb-20 scroll-mt-24">
          <div className="bg-gradient-to-br from-brand-brown to-stone-900 text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-emerald-300 font-bold text-xs">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Emotion &amp; Stress Scale</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white leading-tight">
                  정서 및 스트레스 평가 <br />
                  <span className="text-emerald-300">스트레스 지수 · 우울 · 불안 척도</span>
                </h2>
                <p className="text-xs sm:text-sm text-stone-200 font-serif leading-relaxed">
                  임상 척도인 스트레스 반응 척도(SRI), 벡 우울 척도(BDI), 벡 불안 척도(BAI)를 통해 
                  일상에서 누적된 신체적 피로, 정서적 고갈, 공황 및 번아웃 위험 수위를 수치화하여 점검합니다.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15">
                    <div className="font-bold text-sm text-emerald-300 mb-1">벡 우울 척도 (BDI)</div>
                    <div className="text-xs text-stone-300 font-serif">무기력감, 자기비하, 인지적 침체 수준 평가</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15">
                    <div className="font-bold text-sm text-emerald-300 mb-1">벡 불안 척도 (BAI)</div>
                    <div className="text-xs text-stone-300 font-serif">과긴장, 호흡 곤란, 공황 불안 증상 수치화</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15">
                    <div className="font-bold text-sm text-emerald-300 mb-1">스트레스 반응 척도 (SRI)</div>
                    <div className="text-xs text-stone-300 font-serif">신체화, 분노, 공격성, 인지적 피로도 종합 진단</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15">
                    <div className="font-bold text-sm text-emerald-300 mb-1">번아웃 척도 (MBI)</div>
                    <div className="text-xs text-stone-300 font-serif">직무 소진, 감정 고갈, 성취감 저하 상태 파악</div>
                  </div>
                </div>
              </div>

              {/* Instant Online Self-Diagnosis Card */}
              <div className="lg:col-span-5 bg-white text-brand-brown rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/20">
                <span className="inline-block px-2.5 py-1 rounded-full bg-brand-sage/15 text-brand-sage text-xs font-bold mb-3">
                  즉시 확인 (100% 무료 &amp; 익명)
                </span>
                <h3 className="text-xl font-serif font-bold text-brand-brown mb-2">
                  간이 심리 자가진단 바로가기
                </h3>
                <p className="text-xs text-brand-brown/70 font-serif leading-relaxed mb-6">
                  연구소 방문 전, 웹에서 3분 만에 우울·불안·스트레스·번아웃·관계 갈등을 
                  스스로 체크해 볼 수 있는 인터랙티브 자가진단 도구입니다.
                </p>

                <div className="space-y-3">
                  <Link
                    to="/self-diagnosis"
                    className="w-full py-3.5 px-4 bg-brand-sage hover:bg-brand-sage/90 text-white font-bold rounded-2xl text-center text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <Activity className="w-4 h-4" />
                    <span>3분 간이 자가진단 시작하기</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/mood-tracker"
                    className="w-full py-3 px-4 bg-brand-beige/50 hover:bg-brand-beige text-brand-brown font-semibold rounded-2xl text-center text-xs transition-all border border-brand-green/30 flex items-center justify-center gap-1.5"
                  >
                    <span>데일리 무드 트래커 (감정 일기)</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. 검사 진행 절차 (4단계 프로세스) */}
        <section id="process" className="mb-20 scroll-mt-24">
          <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-brand-green/30 shadow-md">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-sage/10 text-brand-sage font-bold text-xs mb-2">
                <ClipboardList className="w-3.5 h-3.5" />
                <span>ASSESSMENT ROADMAP</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-brown mb-2.5">
                검사 진행 절차 (4단계)
              </h2>
              <p className="text-xs sm:text-sm text-brand-brown/70 font-serif">
                접수부터 심층 해석 상담까지, 전문 임상 프로세스를 통해 체계적이고 따뜻하게 진행됩니다.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: "01",
                  title: "접수 & 사전 인터뷰",
                  badge: "Step 1",
                  desc: "상담 또는 온라인 예약 후, 내담자의 주 호소 문제와 검사 목적에 적합한 개별 검사 패키지를 선정합니다.",
                  icon: <Target className="w-6 h-6 text-brand-sage" />
                },
                {
                  step: "02",
                  title: "표준화 심리검사 본 실시",
                  badge: "Step 2",
                  desc: "독립된 조용한 검사실에서 표준화 지침에 따라 1:1 대면 검사 또는 온라인 검사를 실시합니다.",
                  icon: <FileText className="w-6 h-6 text-brand-sage" />
                },
                {
                  step: "03",
                  title: "채점 & 종합 보고서 작성",
                  badge: "Step 3",
                  desc: "임상 심리 전문가가 규준에 맞춰 과학적으로 채점하고 다각도의 종합 심리 평가 보고서를 작성합니다.",
                  icon: <Brain className="w-6 h-6 text-brand-sage" />
                },
                {
                  step: "04",
                  title: "1:1 심층 해석 상담",
                  badge: "Step 4",
                  desc: "검사 결과 보고서를 직접 열람하며 50분간 상세한 해석과 개인 맞춤형 성장/치유 가이드를 제공합니다.",
                  icon: <Heart className="w-6 h-6 text-brand-sage" />
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl p-6 bg-brand-beige/20 border border-brand-green/30 flex flex-col justify-between hover:bg-brand-green/10 transition-colors relative"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-serif font-bold text-brand-sage/40">
                      {item.step}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-brand-sage/15 text-brand-sage text-[10px] font-bold">
                      {item.badge}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-2xs border border-brand-green/30 mb-3">
                      {item.icon}
                    </div>
                    <h3 className="font-serif font-bold text-base text-brand-brown mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-brand-brown/70 font-serif leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-brand-green/20 text-[11px] text-brand-sage font-medium">
                    비밀보장 윤리원칙 준수
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Conversion Call to Action */}
            <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-brand-sage text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
              <div className="space-y-1.5 text-center md:text-left">
                <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold inline-block">
                  사전 예약제 운영
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold">
                  나를 위한 심리검사, 지금 신청해 보세요
                </h3>
                <p className="text-xs sm:text-sm text-white/85 font-serif max-w-xl">
                  희망하는 검사 종류와 편안한 일정을 선택하시면 상담사가 확인 전화를 드려 확정해 드립니다.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                <Link
                  to="/reservation"
                  className="px-6 py-3.5 bg-white text-brand-sage hover:bg-white/95 font-bold rounded-2xl text-center text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>심리검사 예약 신청하기</span>
                </Link>
                <a
                  href="tel:052-254-0230"
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl text-center text-xs sm:text-sm transition-all border border-white/20 flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>052-254-0230</span>
                </a>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
