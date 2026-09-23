import { Counselor, CounselorDetailedProfile } from '../types';

export const parkMiKyeongDetailedProfile: CounselorDetailedProfile = {
  greeting: "상처 입은 마음에 따뜻한 바람이 불어오도록, 내담자 고유의 회복탄력성을 일깨우는 안전한 동행을 약속드립니다.",
  philosophy: "상담은 일방적인 조언이나 훈계가 아닙니다. 내담자가 살아온 고유한 삶의 무게를 깊이 공감하고, 그 마음에 억눌려 있던 본연의 치유력과 회복탄력성(Resilience)을 함께 발견해 나가는 안전한 동행입니다. 100% 철저한 비밀보장 속에서 판단 없는 온전한 수용을 약속드립니다.",
  clinicalHours: "10,000+ 시간",
  supervisionCount: "한국상담학회 공인 1급 수련감독자",
  academicBackground: [
    "교육학 박사 (상담심리 및 교육심리 전공)",
    "교육대학원 상담심리학 석사",
    "상담 및 심리치료 관련 다수 학술 논문 게재 및 학회 발표",
    "한국상담학회 및 한국상담심리학회 정기 학술대회 슈퍼비전 및 워크숍 지도"
  ],
  licenseHighlights: [
    {
      name: "수련감독자 (슈퍼바이저)",
      issuer: "한국상담학회",
      level: "최고 지도 등급",
      isSupervisor: true
    },
    {
      name: "전문상담사 1급",
      issuer: "한국상담학회",
      level: "공인 1급",
      isSupervisor: false
    },
    {
      name: "청소년상담사 1급",
      issuer: "여성가족부 (한국산업인력공단)",
      level: "국가공인 1급",
      isSupervisor: false
    },
    {
      name: "한국상담심리학회 정회원",
      issuer: "사단법인 한국상담심리학회",
      level: "정회원",
      isSupervisor: false
    },
    {
      name: "한국부부가족상담학회 정회원",
      issuer: "한국부부가족상담학회",
      level: "정회원",
      isSupervisor: false
    }
  ],
  certificationsList: [
    "한국상담학회 수련감독자 (슈퍼바이저, 공인 1급 상담사 양성 지도 자격)",
    "한국상담학회 공인 1급 전문상담사 (Accredited Professional Counselor)",
    "여성가족부 국가공인 청소년상담사 1급 (국가 공인 최고 등급 자격증)",
    "한국상담심리학회 정회원 (윤리규정 준수)",
    "한국부부가족상담학회 정회원",
    "MMPI-2 / TCI / K-WAIS 임상 심리평가 워크숍 및 슈퍼비전 이수"
  ],
  specialtyTagsDetailed: [
    {
      tag: "#교육학박사",
      label: "교육학 박사",
      description: "상담심리 및 교육심리를 깊이 전공하여 학술적 엄밀성과 풍부한 이론적 지평을 갖추고 있습니다.",
      approach: "발달심리 및 심층 인지심리 기반의 다차원적 인간 이해"
    },
    {
      tag: "#1급슈퍼바이저",
      label: "공인 1급 슈퍼바이저",
      description: "한국상담학회가 인정한 수련감독자로서 현직 전문상담사들의 임상 수련을 지도·감독합니다.",
      approach: "엄격한 윤리 강령과 표준화된 임상 지도 체계 적용"
    },
    {
      tag: "#10000시간임상",
      label: "10,000+ 임상 경험",
      description: "울산 및 영남권에서 수많은 위기 내담자의 회복을 이끌어온 독보적인 임상 누적 시간입니다.",
      approach: "내담자 맞춤형 실전 통합 임상 솔루션 제공"
    },
    {
      tag: "#성인개인상담",
      label: "성인 개인 심층상담",
      description: "우울감, 만성 무기력, 자아 존중감 저하, 인생 전환기 정체성 위기를 심층 치유합니다.",
      targetSymptoms: ["우울감", "만성 번아웃", "불안 및 초조", "자존감 결여"],
      approach: "인지행동치료(CBT) & 수용전념치료(ACT)"
    },
    {
      tag: "#부부상담",
      label: "부부 및 커플 관계 회복",
      description: "반복되는 갈등, 대화 단절, 성격 차이, 외도 후 신뢰 상실 등 관계의 위기를 재건합니다.",
      targetSymptoms: ["감정적 단절", "비난과 방어의 대화", "이혼 위기"],
      approach: "정서중심 부부치료(EFT) & 비폭력 대화법(NVC)"
    },
    {
      tag: "#청소년심리",
      label: "청소년 및 부모 양육 코칭",
      description: "학업 스트레스, 시험불안, 등교 거부, 사춘기 자녀와 부모 간 소통 단절을 해결합니다.",
      targetSymptoms: ["학업 무기력", "학교 부적응", "부모-자녀 갈등"],
      approach: "해결중심 단기치료(SFBT) & 감정코칭"
    },
    {
      tag: "#심리검사",
      label: "종합 심리평가 및 해석",
      description: "다면적 인성검사(MMPI-2), 기질성격검사(TCI), SCT를 통한 과학적 자기 탐색을 돕습니다.",
      approach: "객관적 검사 프로파일 분석 및 1:1 심층 해석 상담"
    },
    {
      tag: "#기업EAP",
      label: "기업 EAP 및 임직원 멘탈케어",
      description: "직무 스트레스, 직장 내 대인관계 소진, 관리자 감정 조절 및 웰니스 프로그램을 진행합니다.",
      approach: "조직심리 진단 및 직무소진 예방 솔루션"
    }
  ],
  philosophyPrinciples: [
    {
      title: "무조건적 긍정적 존중 (Unconditional Acceptance)",
      subtitle: "판단이나 평가 없이 온전히 있는 그대로 품는 마음",
      description: "상담실에 들어서는 순간, 어떤 사회적 지위나 실수, 과거의 상처와 관계없이 인간 본연의 존엄성을 온전히 인정받는 안전한 피난처를 제공합니다."
    },
    {
      title: "100% 비의료 비밀보장 (Strict Confidentiality)",
      subtitle: "기록이 외부 어디에도 남지 않는 철저한 윤리 준수",
      description: "국민건강보험 전산 및 의료기록에 전혀 남지 않는 순수 비의료 상담기관으로서, 한국상담학회 윤리강령 제1조에 따라 상담 내용은 절대 외부에 유출되지 않습니다."
    },
    {
      title: "내면의 회복탄력성 일깨움 (Awakening Resilience)",
      subtitle: "내담자 스스로 삶의 주인이 되는 자립적 치유",
      description: "상담사에게 의존하게 만드는 것이 아니라, 내담자 내면에 잠들어 있는 문제 해결 능력과 마음의 면역력을 스스로 작동시켜 일상으로 힘차게 복귀하도록 돕습니다."
    }
  ],
  careers: [
    {
      role: "연구소장",
      organization: "행복바람심리상담연구소 대표",
      period: "현재"
    },
    {
      role: "공인 슈퍼바이저",
      organization: "한국상담학회 공인 수련감독자 (전문상담사 1급 지도)",
      period: "현재"
    },
    {
      role: "EAP 전문 자문위원",
      organization: "울산 및 영남권 공공기관·대기업 임직원 상담 자문",
      period: "역임 및 진행"
    },
    {
      role: "외래교수 / 겸임교수",
      organization: "대학교 상담심리학과 및 평생교육원 심리학 강의",
      period: "역임"
    },
    {
      role: "청소년 및 가족 전문상담원",
      organization: "청소년상담복지센터 및 건강가정지원센터 전문 위원",
      period: "역임"
    }
  ],
  specialties: [
    {
      title: "성인 개인상담 & 정서 치유",
      description: "우울감, 불안 장애, 공황, 성인 ADHD, 번아웃 증후군, 직무 스트레스 및 대인관계 갈등",
      methods: ["인지행동치료 (CBT)", "수용전념치료 (ACT)", "정서중심치료 (EFT)", "마음챙김(MBSR)"]
    },
    {
      title: "부부 및 커플·가족 관계 회복",
      description: "대화 단절, 만성적 부부 싸움, 외도 및 신뢰 상실, 고부/처가 갈등, 이혼 위기 극복 및 성격 차이 조율",
      methods: ["가족체계이론", "비폭력 대화법 (NVC)", "이마고(Imago) 부부관계 치료"]
    },
    {
      title: "청소년 심리 & 부모 양육 코칭",
      description: "학업 무기력, 시험 불안, 등교 거부, 또래 관계 따돌림, 사춘기 반항, 부모-자녀 소통 부재",
      methods: ["해결중심 단기치료 (SFBT)", "감정코칭", "성격유형별 맞춤 양육 솔루션"]
    },
    {
      title: "종합심리평가 & 심층 해석상담",
      description: "다면적 인성검사(MMPI-2), 기질 및 성격검사(TCI), 문장완성검사(SCT), 투사검사(HTP/KFD)를 통한 객관적 자기 이해",
      methods: ["표준화 심리도구", "다차원 심리 프로파일 분석", "1:1 통합 심층 해석 세션"]
    },
    {
      title: "기업 EAP & 리더십 심리 코칭",
      description: "임직원 멘탈 헬스케어, 직장 내 괴롭힘 피해 회복, 관리자 감정관리 및 조직 커뮤니케이션 워크숍",
      methods: ["조직심리 진단", "직무소진 예방 코칭", "그룹 다이내믹스 집단상담"]
    }
  ],
  recommendedFor: [
    "반복되는 우울, 무기력, 만성 피로로 일상생활 유지가 힘드신 분",
    "마음속 깊은 불안과 공황, 지나친 완벽주의로 숨이 막히시는 분",
    "배우자나 가족과 대화만 시작하면 상처로 끝나 답답하신 분",
    "학업이나 대인관계로 힘들어하는 자녀와의 소통 해법을 찾고 계신 학부모님",
    "자신의 타고난 기질과 성격을 과학적으로 파악해 삶의 방향을 세우고 싶으신 분",
    "전문적이고 엄격한 비밀보장 기준을 갖춘 공인 1급 수련감독자를 찾으시는 분"
  ],
  sessionProcedure: [
    {
      step: "01",
      title: "초기 접수 면담 (Intake Session)",
      desc: "내담자가 겪고 계신 주 호소 문제를 온전히 경청하고, 현재 겪는 고통의 맥락과 심리적 상태를 다각도로 평가합니다."
    },
    {
      step: "02",
      title: "상담 목표 수립 & 맞춤 계획",
      desc: "내담자와 합의하여 단기/중기 심리 치유 목표를 설정하고, 과학적인 심리검사 도구 적용 여부를 논의합니다."
    },
    {
      step: "03",
      title: "심층 상담 및 치유 작업",
      desc: "인지·정서적 왜곡과 상처를 탐색하고, 구체적인 감정 조절 기술 및 관계 개선 훈련을 체계적으로 실천합니다."
    },
    {
      step: "04",
      title: "자율적 성장 & 종결 세션",
      desc: "새로운 대처 방식을 내면화하고, 미래의 위기 상황에서도 스스로를 돌볼 수 있는 심리적 면역력을 다진 후 건강하게 종결합니다."
    }
  ]
};

export const kimJiHyunDetailedProfile: CounselorDetailedProfile = {
  greeting: "관계 속에서 입은 상처는 진실하고 안전한 소통을 통해 치유됩니다. 서로의 마음이 온전히 닿도록 다리가 되어 드리겠습니다.",
  philosophy: "부부와 가족 간의 갈등은 사랑이 부족해서가 아니라, 상처받지 않으려는 방어와 소통 방식의 어긋남에서 비롯됩니다. 비난과 회피의 악순환을 멈추고 서로의 연약한 속마음(원초적 정서)을 안전하게 드러낼 때, 관계는 비로소 새로운 친밀감으로 다시 피어납니다.",
  clinicalHours: "5,800+ 시간",
  supervisionCount: "한국상담심리학회 1급 전문 상담",
  academicBackground: [
    "상담심리학 석사 (부부 및 가족상담 전공)",
    "한국상담심리학회 공인 연수과정 이수",
    "이마고(Imago) 부부관계치료 임상 수료",
    "비폭력대화(NVC) 중재자 트레이닝 수련"
  ],
  licenseHighlights: [
    {
      name: "상담심리사 1급",
      issuer: "한국상담심리학회",
      level: "공인 1급",
      isSupervisor: false
    },
    {
      name: "부부상담전문가",
      issuer: "한국부부가족상담학회",
      level: "전문가 등급",
      isSupervisor: false
    },
    {
      name: "청소년상담사 2급",
      issuer: "여성가족부",
      level: "국가공인 2급",
      isSupervisor: false
    },
    {
      name: "이마고 부부치료 수료증",
      issuer: "국제 이마고 협회 (IRI)",
      level: "임상 전문가",
      isSupervisor: false
    }
  ],
  certificationsList: [
    "한국상담심리학회 공인 상담심리사 1급",
    "한국부부가족상담학회 부부상담전문가 자격",
    "여성가족부 국가공인 청소년상담사 2급",
    "국제공인 이마고(Imago) 부부관계치료 임상 프랙티셔너",
    "한국비폭력대화센터 중재자 과정 수료",
    "MBTI / Strong 직업흥미검사 일반강사 자격"
  ],
  specialtyTagsDetailed: [
    {
      tag: "#부부갈등회복",
      label: "부부 갈등 및 소통 단절",
      description: "만성적인 다툼, 냉전, 대화 차단 문제를 해결하고 상호 공감 대화를 회복합니다.",
      targetSymptoms: ["반복되는 말다툼", "감정적 벽", "서운함 누적"],
      approach: "정서중심 부부치료(EFT) 및 이마고 부부대화법"
    },
    {
      tag: "#이혼위기극복",
      label: "이혼 위기 및 신뢰 상실",
      description: "외도 후 신뢰 붕괴, 성격 차이, 가치관 충돌로 파탄 위기에 놓인 가정을 안전하게 돕습니다.",
      approach: "외상 후 신뢰 재구축 프로토콜 및 가족 체계적 개입"
    },
    {
      tag: "#비폭력대화(NVC)",
      label: "비폭력 대화 훈련",
      description: "비난과 방어 대신 자신의 진정한 욕구와 느낌을 솔직하게 표현하는 건강한 화법을 훈련합니다.",
      approach: "관찰-느낌-욕구-부탁 4단계 대화 체득 훈련"
    },
    {
      tag: "#가족관계개선",
      label: "원가족 및 고부/처가 갈등",
      description: "원가족의 미해결 과제와 세대 간 전수된 갈등 패턴을 객관화하고 건강한 심리적 경계를 세웁니다.",
      approach: "보웬 다세대 가족치료 & 심리적 분화 촉진"
    },
    {
      tag: "#대인관계예민성",
      label: "대인관계 불안 및 애착 손상",
      description: "타인의 시선에 극도로 예민하거나 거절에 대한 공포로 관계를 맺기 힘든 분을 위한 개인 세션입니다.",
      approach: "애착 중심 심리치료 및 자기 자비(Self-Compassion) 실습"
    }
  ],
  philosophyPrinciples: [
    {
      title: "비난 뒤에 숨은 애착 욕구 발견 (Beneath the Anger)",
      subtitle: "화와 냉소 뒤에 숨은 '연결되고 싶은 간절함'을 봅니다",
      description: "상대방을 향한 날카로운 비난은 사실 '나를 알아달라'는 깊은 외로움의 신호입니다. 겉으로 드러난 분노를 넘어 진정한 연결의 욕구를 함께 읽어냅니다."
    },
    {
      title: "안전한 대화의 심리적 컨테이너 (Safe Container)",
      subtitle: "서로에게 상처 주지 않고 솔직해질 수 있는 중재 공간",
      description: "가정에서는 감정이 격해져 싸움으로 번지던 대화도, 상담사의 안전하고 중립적인 개입 속에서는 상대를 위협하지 않는 치유적 나눔이 됩니다."
    },
    {
      title: "일상에서 작동하는 구체적 소통 룰 (Practical Home Rules)",
      subtitle: "상담실을 나선 후에도 지속 가능한 둘만의 대화법",
      description: "감정이 폭발하려 할 때 멈추는 '타임아웃 규칙'과 감정을 전하는 '속마음 전달법' 등 현실 생활에 즉시 적용되는 실용적 툴을 선물합니다."
    }
  ],
  careers: [
    {
      role: "수석 상담사",
      organization: "행복바람심리상담연구소",
      period: "현재"
    },
    {
      role: "부부 및 가족상담 전문위원",
      organization: "건강가정다문화가족지원센터",
      period: "역임"
    },
    {
      role: "기업 EAP 전문상담사",
      organization: "울산 공공기관 및 협력사 임직원 관계상담",
      period: "역임 및 진행"
    },
    {
      role: "전문 강사",
      organization: "지자체 부모교육 및 부부 의사소통 워크숍 출강",
      period: "진행 중"
    }
  ],
  specialties: [
    {
      title: "부부 및 커플 관계 개선",
      description: "의사소통 단절, 만성적 싸움, 외도 및 신뢰 상실, 이혼 위기 중재",
      methods: ["정서중심 부부치료 (EFT)", "이마고(Imago) 대화법", "비폭력 대화(NVC)"]
    },
    {
      title: "가족 갈등 및 원가족 상처 치유",
      description: "부모-성인 자녀 갈등, 고부 갈등, 원가족 애착 손상 및 세대 간 트라우마 전수 차단",
      methods: ["다세대 가족체계치료", "경계선 설정 훈련", "내면아이 치유"]
    },
    {
      title: "성인 대인관계 & 불안 완화",
      description: "회피형/불안형 애착 패턴 수정, 타인의 평가에 대한 과도한 불안 및 거절 민감성 해소",
      methods: ["애착이론 기반 상담", "자기자비 명상", "사회적 기술 훈련"]
    }
  ],
  recommendedFor: [
    "대화만 시작하면 사소한 일로 싸움이 커져 서로에게 깊은 상처를 남기는 부부",
    "서로에 대한 애정이 식었다고 느끼거나 감정적 단절로 남처럼 살아가시는 분",
    "시댁이나 처가 등 원가족 문제로 부부 사이에 심각한 균열이 생기신 분",
    "이혼이라는 극단적 선택 전 마지막으로 관계를 객관적으로 돌아보고 싶은 분",
    "늘 남의 기분을 맞추느라 정작 내 마음은 억누르고 살아오신 분"
  ],
  sessionProcedure: [
    {
      step: "01",
      title: "부부 합동 및 개별 탐색 면담",
      desc: "두 사람의 상호작용 패턴을 관찰하고, 필요 시 1:1 개별 세션을 통해 각자의 원가족 배경과 억압된 감정을 살핍니다."
    },
    {
      step: "02",
      title: "갈등의 악순환 고리 객관화",
      desc: "'비난자'와 '후퇴자'로 굳어진 역기능적 상호작용 지도를 함께 그리며, 문제의 원인이 상대방 자체가 아니라 '어긋난 패턴'임을 인식합니다."
    },
    {
      step: "03",
      title: "심층 정서 나눔 & 안전한 재연결",
      desc: "분노 뒤에 숨겨진 서운함과 애착의 두려움을 털어놓고, 상대방이 이를 방어 없이 수용할 수 있도록 촉진합니다."
    },
    {
      step: "04",
      title: "새로운 소통 문화 정착 및 유지",
      desc: "위기 시 사용할 안전 신호(Safe Signal)와 일상 대화 루틴을 확립하여 스스로 화합할 수 있는 힘을 완성합니다."
    }
  ]
};

export const leeJinWooDetailedProfile: CounselorDetailedProfile = {
  greeting: "생각의 안경을 바꾸면 마음의 세상이 달라집니다. 어떤 비바람에도 흔들리지 않는 단단한 마음 근육을 선물하겠습니다.",
  philosophy: "인간을 고통스럽게 하는 것은 일어난 사건 자체가 아니라, 사건에 부여하는 비합리적인 신념과 파국적 해석입니다. 머릿속을 맴도는 왜곡된 자동적 사고를 포착하고 과학적 행동실험을 통해 생각의 유연성을 기르면, 불안과 강박의 안개는 걷히고 자신감 넘치는 나를 만나게 됩니다.",
  clinicalHours: "4,600+ 시간",
  supervisionCount: "정신건강임상심리사 / 청소년상담사 1급",
  academicBackground: [
    "임상 및 상담심리학 석사",
    "한국인지행동치료학회 정규 전문가 수련과정 이수",
    "대학병원 정신건강의학과 임상심리 수련",
    "청소년 학습 및 진로 상담 프로토콜 개발 참여"
  ],
  licenseHighlights: [
    {
      name: "정신건강임상심리사 2급",
      issuer: "보건복지부",
      level: "국가전문자격",
      isSupervisor: false
    },
    {
      name: "청소년상담사 1급",
      issuer: "여성가족부",
      level: "국가공인 1급",
      isSupervisor: false
    },
    {
      name: "인지행동치료(CBT) 전문가 수련",
      issuer: "한국인지행동치료학회",
      level: "전문가",
      isSupervisor: false
    },
    {
      name: "한국임상심리학회 정회원",
      issuer: "한국임상심리학회",
      level: "정회원",
      isSupervisor: false
    }
  ],
  certificationsList: [
    "보건복지부 국가공인 정신건강임상심리사 2급",
    "여성가족부 국가공인 청소년상담사 1급",
    "한국인지행동치료학회 정규 수련 이수 (CBT Specialist)",
    "한국임상심리학회 정회원",
    "청소년 진로 및 학습상담 전문가 (Strong / K-WAIS 검사 공인 해석)",
    "마음챙김 기반 인지치료(MBCT) 워크숍 수료"
  ],
  specialtyTagsDetailed: [
    {
      tag: "#청소년심리",
      label: "청소년 심리 및 위기 상담",
      description: "등교 거부, 또래 관계 단절, 무기력증, 자해 충동, 부모와의 소통 단절을 전문적으로 다룹니다.",
      targetSymptoms: ["학교 부적응", "게임/스마트폰 과몰입", "감정 조절 곤란"],
      approach: "청소년 친화적 라포 형성 및 단기 문제해결 개입"
    },
    {
      tag: "#학업스트레스",
      label: "학업 압박 및 시험불안",
      description: "공부할 때 찾아오는 집중 곤란, 시험 직전의 신체적 떨림과 패닉을 체계적으로 조절합니다.",
      targetSymptoms: ["시험 전 복통/두통", "수행 불안", "학습된 무기력"],
      approach: "생체이완 훈련 & 점진적 노출 기법"
    },
    {
      tag: "#성인ADHD",
      label: "성인 ADHD 및 실행기능 코칭",
      description: "지속적인 미루기, 집중력 결핍, 업무상 잦은 실수, 충동성으로 고통받는 성인을 돕습니다.",
      approach: "행동 수정 플래너, 외부 자극 통제, 시간 관리 인지코칭"
    },
    {
      tag: "#불안·공황장애",
      label: "공황 발작 및 광장공포증",
      description: "지하철, 엘리베이터, 밀폐된 공간에서 찾아오는 심장 두근거림과 질식감을 안전하게 완화합니다.",
      approach: "파국화 인지 교정, 복식호흡 훈련, 체감각 노출치료"
    },
    {
      tag: "#인지행동치료(CBT)",
      label: "근거기반 인지행동치료",
      description: "부정적 자동사고를 기록하고 객관적인 대안 사고를 도출하는 가장 과학적인 심리치료 접근법입니다.",
      approach: "생각기록지 작성, 행동실험, 인지 재구조화"
    }
  ],
  philosophyPrinciples: [
    {
      title: "과학적 근거와 구체적 실천 (Evidence-Based Action)",
      subtitle: "막연한 위로가 아닌, 검증된 심리 기법과 단계적 훈련",
      description: "마음의 고통을 뇌 과학과 인지심리학의 체계적 프레임으로 설명해 드리고, 오늘 당장 실천할 수 있는 구체적인 생각 바꾸기와 행동 과제를 제시합니다."
    },
    {
      title: "생각과 나를 분리하는 힘 (Cognitive Defusion)",
      subtitle: "'불안한 생각'은 사실이 아니라 뇌가 보낸 신호일 뿐입니다",
      description: "머릿속에 떠오르는 부정적인 생각에 휩쓸리지 않고, 한 걸음 물러서서 생각의 실체를 관찰할 수 있는 메타인지(Meta-Cognition) 역량을 길러냅니다."
    },
    {
      title: "자조적 마음 근육의 단련 (Self-Empowerment)",
      subtitle: "내담자 자신이 스스로의 가장 훌륭한 치료자가 되도록",
      description: "상담이 종결된 후에도 미래의 스트레스 상황을 스스로 분석하고 극복할 수 있도록 내담자만의 '마음 비상약 키트'를 완성해 드립니다."
    }
  ],
  careers: [
    {
      role: "전문 상담사",
      organization: "행복바람심리상담연구소",
      period: "현재"
    },
    {
      role: "임상심리 수련 레지던트",
      organization: "대학병원 정신건강의학과 임상심리실",
      period: "수료"
    },
    {
      role: "청소년 전문상담사",
      organization: "시립 청소년상담복지센터",
      period: "역임"
    },
    {
      role: "ADHD 및 학습클리닉 연구원",
      organization: "아동청소년 두뇌발달 연구소",
      period: "역임"
    }
  ],
  specialties: [
    {
      title: "청소년 심리 & 학업·진로 코칭",
      description: "학업 무기력, 시험 불안, 등교 거부, 사춘기 감정 기복, 스마트폰 과의존 개선",
      methods: ["인지행동치료 (CBT)", "동기강화상담 (MI)", "학습 메타인지 훈련"]
    },
    {
      title: "성인 ADHD & 실행기능 개선",
      description: "과제 지연(미루기), 집중력 결핍, 정리정돈 곤란, 충동성 조절",
      methods: ["행동수정요법", "시간 관리 프레임워크", "외부 단서 시스템 구축"]
    },
    {
      title: "불안장애 · 공황 · 강박증 치유",
      description: "예기불안, 공황 발작, 사회불안(발표 공포), 완벽주의 및 강박 사고 완화",
      methods: ["노출 및 반응방지(ERP)", "신체 감각 적응 훈련", "마음챙김(MBSR)"]
    }
  ],
  recommendedFor: [
    "시험이나 발표 때만 되면 심장이 터질 듯 뛰고 백지상태가 되는 수험생 및 청소년",
    "머리로는 해야 함을 알면서도 끊임없이 일을 미루고 자책하는 성인 ADHD 성향인 분",
    "지하철, 영화관 등 갇힌 공간에 가면 숨이 가빠지는 공황 증상을 겪으시는 분",
    "자녀의 등교 거부와 스마트폰 중독으로 애가 타는 학부모님",
    "막연한 공감보다는 명확한 원인 분석과 실질적인 행동 솔루션을 원하시는 분"
  ],
  sessionProcedure: [
    {
      step: "01",
      title: "문제 행동 및 인지 왜곡 정밀 진단",
      desc: "내담자를 괴롭히는 구체적 상황(Situation)과 그때 스치는 자동적 사고(Thought), 신체 반응(Physiology)을 구조화합니다."
    },
    {
      step: "02",
      title: "인지 재구조화 & 생각 기록지 실습",
      desc: "비합리적 흑백논리나 파국화 오류를 찾아내고, 현실적이고 유연한 대안적 사고로 교체하는 훈련을 시작합니다."
    },
    {
      step: "03",
      title: "행동 실험 및 점진적 노출 훈련",
      desc: "두려워하던 상황을 안전한 단계별 사다리로 나누어 직접 마주하며, 뇌의 편도체가 불안을 안전하게 재학습하도록 이끕니다."
    },
    {
      step: "04",
      title: "재발 방지 플랜 & 나만의 매뉴얼 완성",
      desc: "스트레스가 재발했을 때 대처할 수 있는 나만의 SOS 대처 카드를 작성하고 성공적으로 종결합니다."
    }
  ]
};

export const counselorProfilesById: Record<number | string, CounselorDetailedProfile> = {
  1: parkMiKyeongDetailedProfile,
  2: kimJiHyunDetailedProfile,
  3: leeJinWooDetailedProfile,
  "박미경": parkMiKyeongDetailedProfile,
  "김지현": kimJiHyunDetailedProfile,
  "이진우": leeJinWooDetailedProfile
};

export const defaultCounselorsList: Counselor[] = [
  {
    id: 1,
    name: "박미경",
    title: "상담 소장 (대표 원장)",
    education: "교육학 박사 (상담 심리 및 교육 심리 전공)",
    certifications: "한국상담학회 공인 1급 수련감독자(슈퍼바이저)\n한국상담학회 전문상담사 1급\n여성가족부 청소년상담사 1급 (국가공인)\n한국상담심리학회 정회원\n한국부부가족상담학회 정회원",
    style: "개인 심층 치유 / 기업 EAP / 부부·가족 갈등 / 종합심리평가 / 전문가 수련 지도",
    tags: "#교육학박사 #1급슈퍼바이저 #10000시간임상 #성인개인상담 #부부상담 #청소년심리 #심리검사 #기업EAP",
    image_url: "/images/counselor_park.jpg",
    detailedProfile: parkMiKyeongDetailedProfile
  },
  {
    id: 2,
    name: "김지현",
    title: "수석 상담사 (부부·가족 전문)",
    education: "상담심리학 석사 (부부 및 가족상담 전공)",
    certifications: "한국상담심리학회 상담심리사 1급\n한국부부가족상담학회 부부상담전문가\n여성가족부 청소년상담사 2급\n국제 이마고(Imago) 부부치료 임상 수료\n한국비폭력대화(NVC) 중재자 과정",
    style: "부부 갈등 회복 / 이혼 위기 극복 / 비폭력 대화(NVC) / 가족 관계 개선 / 대인관계 불안",
    tags: "#부부갈등회복 #이혼위기극복 #비폭력대화(NVC) #가족관계개선 #정서중심치료(EFT) #커플소통단절 #대인관계예민성",
    image_url: "/images/counselor_park.jpg",
    detailedProfile: kimJiHyunDetailedProfile
  },
  {
    id: 3,
    name: "이진우",
    title: "전문 상담사 (청소년·CBT 전문)",
    education: "임상 및 상담심리학 석사",
    certifications: "보건복지부 정신건강임상심리사 2급\n여성가족부 청소년상담사 1급 (국가공인)\n한국인지행동치료학회(CBT) 전문가 수련\n한국임상심리학회 정회원\n청소년 진로 및 학습상담 전문가",
    style: "청소년 심리 위기 / 학업 스트레스 & 시험불안 / 성인 ADHD 코칭 / 공황 및 강박 / 인지행동치료(CBT)",
    tags: "#청소년심리 #학업스트레스 #성인ADHD #불안·공황장애 #인지행동치료(CBT) #강박증 #진로코칭",
    image_url: "/images/counselor_park.jpg",
    detailedProfile: leeJinWooDetailedProfile
  }
];
