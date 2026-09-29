import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { 
  sendReservationNotification, 
  isNotificationGatewayConfigured, 
  formatPhoneNumber,
  sendAdminNewReservationNotification,
  sendAdminTestAlimtalk
} from "./src/server/notificationService.ts";
import nodemailer from "nodemailer";

const rootDir = process.cwd();

const db = new Database("counseling.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS counselors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    title TEXT,
    education TEXT,
    certifications TEXT,
    style TEXT,
    tags TEXT,
    image_url TEXT
  );

  CREATE TABLE IF NOT EXISTS programs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    tags TEXT
  );

  CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    program_id INTEGER,
    preferred_date TEXT,
    preferred_time TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS notification_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reservation_id INTEGER,
    recipient_name TEXT NOT NULL,
    recipient_phone TEXT NOT NULL,
    channel TEXT DEFAULT 'ALIMTALK',
    template_title TEXT,
    message_content TEXT,
    status TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS self_diagnosis (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nickname TEXT NOT NULL,
    test_type TEXT NOT NULL,
    score INTEGER,
    result TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS admin_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS schedule_blocks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    block_date TEXT NOT NULL,
    block_time TEXT,
    reason TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS admin_recovery_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS eap_inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    department TEXT,
    phone TEXT NOT NULL,
    email TEXT,
    employee_count TEXT,
    interests TEXT,
    preferred_format TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS community_notices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author TEXT DEFAULT '행복바람 운영팀',
    views INTEGER DEFAULT 0,
    is_pinned INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS community_qna (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    category TEXT DEFAULT '상담신청',
    phone TEXT,
    password TEXT NOT NULL,
    content TEXT NOT NULL,
    reply TEXT,
    replied_at DATETIME,
    status TEXT DEFAULT 'waiting',
    is_private INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS counseling_insights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    summary TEXT NOT NULL,
    content TEXT,
    author TEXT DEFAULT '박미경 소장',
    author_title TEXT DEFAULT '교육학 박사 · 한국상담학회 1급 슈퍼바이저',
    read_time TEXT DEFAULT '5분 읽기',
    image_url TEXT,
    tags TEXT,
    featured INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    takeaways TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    interest_topic TEXT DEFAULT '전체',
    subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'active'
  );

  CREATE TABLE IF NOT EXISTS quick_poll_votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mood_id TEXT NOT NULL,
    voted_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Safe migration for admin_notes column in reservations table
try {
  db.exec("ALTER TABLE reservations ADD COLUMN admin_notes TEXT");
} catch (e) {
  // Column already exists
}

// Safe migration for updated_at column in community_notices table
try {
  db.exec("ALTER TABLE community_notices ADD COLUMN updated_at DATETIME");
} catch (e) {
  // Column already exists
}

// Seed default admin password to 3485 (or migrate old 1234 to 3485)
const defaultPw = db.prepare("SELECT value FROM admin_settings WHERE key = 'admin_password'").get() as any;
if (!defaultPw || defaultPw.value === '1234') {
  db.prepare("INSERT OR REPLACE INTO admin_settings (key, value) VALUES ('admin_password', '3485')").run();
  db.prepare("INSERT OR REPLACE INTO admin_settings (key, value) VALUES ('is_default_password', '1')").run();
}

// Seed registered admin emails for password recovery
const adminEmailRow = db.prepare("SELECT value FROM admin_settings WHERE key = 'admin_email'").get() as any;
if (!adminEmailRow) {
  db.prepare("INSERT OR REPLACE INTO admin_settings (key, value) VALUES ('admin_email', 'hahm1123@gmail.com, mikypa@naver.com')").run();
}

// Seed registered admin mobile phone for Kakao Alimtalk reception
const adminPhoneRow = db.prepare("SELECT value FROM admin_settings WHERE key = 'admin_phone'").get() as any;
if (!adminPhoneRow || adminPhoneRow.value === '010-8588-4663') {
  db.prepare("INSERT OR REPLACE INTO admin_settings (key, value) VALUES ('admin_phone', '010-7322-5676')").run();
}

// Seed data
const existingCounselor = db.prepare("SELECT * FROM counselors WHERE name = ?").get("박미경") as any;
if (!existingCounselor) {
  const insertCounselor = db.prepare("INSERT INTO counselors (name, title, education, certifications, style, tags, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)");
  insertCounselor.run(
    "박미경", 
    "상담 소장 (대표 원장)", 
    "교육학 박사 (상담 심리 및 교육 심리 전공)", 
    "한국상담학회 공인 1급 수련감독자(슈퍼바이저)\n한국상담학회 전문상담사 1급 (No. 818)\n여성가족부 청소년상담사 1급 (국가공인)\n한국상담심리학회 정회원\n한국부부가족상담학회 정회원", 
    "개인 심층 치유 / 기업 EAP / 부부·가족 갈등 / 종합심리평가 / 전문가 수련 지도", 
    "#교육학박사 #1급슈퍼바이저 #총상담30000시간 #성인개인상담 #부부상담 #청소년심리 #심리검사 #기업EAP", 
    "/images/counselor_park.jpg"
  );
} else {
  db.prepare("UPDATE counselors SET title = ?, education = ?, certifications = ?, style = ?, tags = ?, image_url = ? WHERE name = ?").run(
    "상담 소장 (대표 원장)",
    "교육학 박사 (상담 심리 및 교육 심리 전공)",
    "한국상담학회 공인 1급 수련감독자(슈퍼바이저)\n한국상담학회 전문상담사 1급 (No. 818)\n여성가족부 청소년상담사 1급 (국가공인)\n한국상담심리학회 정회원\n한국부부가족상담학회 정회원",
    "개인 심층 치유 / 기업 EAP / 부부·가족 갈등 / 종합심리평가 / 전문가 수련 지도",
    "#교육학박사 #1급슈퍼바이저 #총상담30000시간 #성인개인상담 #부부상담 #청소년심리 #심리검사 #기업EAP",
    "/images/counselor_park.jpg",
    "박미경"
  );
}

// Keep only Director Park Mi-kyeong
db.prepare("DELETE FROM counselors WHERE name != ?").run("박미경");

// Seed data
const programCount = (db.prepare("SELECT COUNT(*) as count FROM programs").get() as any).count;
if (programCount === 0) {
  const insertProgram = db.prepare("INSERT INTO programs (category, title, description, tags) VALUES (?, ?, ?, ?)");
  insertProgram.run("개인상담", "청소년 및 성인 상담", "우울, 불안, 스트레스, 대인관계 등 개인의 심리적 성장을 돕는 1:1 맞춤형 상담입니다.", "#청소년 #성인 #심리성장");
  insertProgram.run("부부상담", "부부 및 가족 관계 개선", "부부 갈등 해결, 의사소통 개선 및 관계 회복을 위한 전문적인 심리 지원을 제공합니다.", "#부부갈등 #관계회복 #의사소통");
  insertProgram.run("심리검사", "종합 심리검사 및 해석", "객관적인 검사를 통해 자기 이해를 돕고 현재의 심리적 상태를 정밀하게 파악합니다.", "#자기이해 #정밀진단 #성격검사");
  insertProgram.run("기업상담", "EAP (근로자 지원 프로그램)", "직장 내 스트레스 관리 및 조직 적응을 위한 임직원 맞춤형 상담 서비스를 제공합니다.", "#직장스트레스 #조직적응 #EAP");
  insertProgram.run("집단/교육", "집단상담 및 심리교육", "특정 주제를 가진 소그룹 상담과 마음 건강을 위한 다양한 교육 프로그램을 운영합니다.", "#집단상담 #심리교육 #워크숍");
}

// Seed 6-month historical reservation data for analytics if reservations count is low
const reservationCount = (db.prepare("SELECT COUNT(*) as count FROM reservations").get() as any).count;
if (reservationCount < 40) {
  const programMap: { [cat: string]: number } = {};
  const currentPrograms = db.prepare("SELECT id, category FROM programs").all() as Array<{ id: number; category: string }>;
  currentPrograms.forEach(p => {
    programMap[p.category] = p.id;
  });

  const sampleClients = [
    { name: '이지원', phone: '010-2345-6789' },
    { name: '박서준', phone: '010-3456-7891' },
    { name: '김도윤', phone: '010-4567-8912' },
    { name: '최유진', phone: '010-5678-9123' },
    { name: '정하은', phone: '010-6789-1234' },
    { name: '강민재', phone: '010-7890-2345' },
    { name: '윤서연', phone: '010-8901-3456' },
    { name: '임준서', phone: '010-9012-4567' },
    { name: '송예린', phone: '010-1123-5678' },
    { name: '오지후', phone: '010-2234-6789' },
    { name: '황수빈', phone: '010-3345-7890' },
    { name: '한우진', phone: '010-4456-8901' },
    { name: '신아린', phone: '010-5567-9012' },
    { name: '배도현', phone: '010-6678-0123' },
    { name: '권지우', phone: '010-7789-1234' },
    { name: '조은서', phone: '010-8890-2345' },
    { name: '문태양', phone: '010-9901-3456' },
    { name: '유다온', phone: '010-1234-4567' },
    { name: '홍준혁', phone: '010-2345-5678' },
    { name: '백서아', phone: '010-3456-6789' }
  ];

  const timeSlots = ['09:00', '10:30', '14:00', '15:30', '17:00', '18:30', '20:00'];
  const insertRes = db.prepare(`
    INSERT INTO reservations (name, phone, program_id, preferred_date, preferred_time, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const monthlyDistributions = [
    { year: 2026, month: 4, days: 30, counts: { '개인상담': 22, '부부상담': 12, '심리검사': 7, '기업상담': 5, '집단/교육': 2 } },
    { year: 2026, month: 5, days: 31, counts: { '개인상담': 25, '부부상담': 18, '심리검사': 8, '기업상담': 5, '집단/교육': 3 } },
    { year: 2026, month: 6, days: 30, counts: { '개인상담': 29, '부부상담': 15, '심리검사': 10, '기업상담': 7, '집단/교육': 3 } },
    { year: 2026, month: 7, days: 31, counts: { '개인상담': 33, '부부상담': 16, '심리검사': 13, '기업상담': 6, '집단/교육': 4 } },
    { year: 2026, month: 8, days: 31, counts: { '개인상담': 37, '부부상담': 17, '심리검사': 14, '기업상담': 7, '집단/교육': 4 } },
    { year: 2026, month: 9, days: 28, counts: { '개인상담': 42, '부부상담': 21, '심리검사': 12, '기업상담': 8, '집단/교육': 5 } }
  ];

  let clientIdx = 0;
  monthlyDistributions.forEach(mDist => {
    Object.entries(mDist.counts).forEach(([cat, targetCount]) => {
      const pid = programMap[cat] || (currentPrograms[0]?.id ?? 1);
      for (let i = 0; i < targetCount; i++) {
        const client = sampleClients[clientIdx % sampleClients.length];
        clientIdx++;

        const day = 1 + Math.floor((i / targetCount) * (mDist.days - 2)) + (i % 2);
        const dayStr = String(Math.min(day, mDist.days)).padStart(2, '0');
        const monthStr = String(mDist.month).padStart(2, '0');
        const dateStr = `${mDist.year}-${monthStr}-${dayStr}`;
        const timeStr = timeSlots[(i + clientIdx) % timeSlots.length];
        
        let status = 'completed';
        if (mDist.month === 9) {
          status = i % 5 === 0 ? 'pending' : (i % 2 === 0 ? 'confirmed' : 'completed');
        } else if (mDist.month === 8) {
          status = i % 10 === 0 ? 'confirmed' : 'completed';
        }

        const createdAt = `${dateStr} ${timeStr}:00`;
        insertRes.run(client.name, client.phone, pid, dateStr, timeStr, status, createdAt);
      }
    });
  });
}

// Seed community notices
const noticeCount = (db.prepare("SELECT COUNT(*) as count FROM community_notices").get() as any).count;
if (noticeCount === 0) {
  const insertNotice = db.prepare("INSERT INTO community_notices (category, title, content, author, views, is_pinned, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)");
  insertNotice.run(
    "운영안내",
    "2026년 하반기 평일 야간(20시) 및 토요일 특별 상담 일정 안내",
    "안녕하세요, 행복바람 심리상담연구소입니다.\n\n바쁜 직장인, 맞벌이 부부, 학생분들을 위하여 2026년 하반기에도 평일 야간 및 토요일 특별 상담 일정을 정상 운영합니다.\n\n• 평일 운영: 10:00 ~ 20:00 (마지막 상담 시작 19:00)\n• 토요일 운영: 10:00 ~ 17:00 (100% 사전 예약제)\n• 일요일 및 공휴일: 휴진 (사전 협의된 기업 EAP 특강 제외)\n\n상담소 내에는 사생활이 철저히 보호되는 프라이빗 1:1 대기실과 따뜻한 웰컴 티가 준비되어 있으니 편안한 마음으로 발걸음해 주시기 바랍니다.\n\n문의 전화: 052-254-0230 / 온라인 예약 메뉴 이용 가능",
    "행복바람 운영팀",
    184,
    1,
    "2026-09-18 10:00:00"
  );
  insertNotice.run(
    "프로그램모집",
    "[소수정예 6인] 제8기 마음챙김(MBSR) 기반 감정조절 주말 힐링 워크숍 모집",
    "끝없는 스트레스와 불안, 감정 기복으로 지친 분들을 위한 소수정예 힐링 그룹 프로그램입니다.\n\n• 일정: 2026년 10월 둘째 주 토요일 (오후 2시 ~ 5시, 총 3시간)\n• 장소: 행복바람 대그룹 상담실 (울산 삼산동)\n• 정원: 선착순 6인 (깊이 있는 나눔과 밀도 높은 피드백을 위해 엄격히 인원 제한)\n• 대상: 번아웃 극복, 감정조절 훈련 및 자기 자비(Self-Compassion) 실습을 원하는 성인 누구나\n• 지도: 박미경 소장 (교육학 박사, 한국상담학회 1급 슈퍼바이저)\n• 문의 및 신청: 온라인 예약 메뉴 > 집단 프로그램 선택 또는 연구소 유선 접수",
    "박미경 소장",
    256,
    1,
    "2026-09-12 14:30:00"
  );
  insertNotice.run(
    "소식/특강",
    "박미경 소장, 울산 관내 교육기관 대상 '교직 스트레스 치유와 회복탄력성' 초청 특강 진행",
    "지난 9월, 박미경 소장(교육학 박사)은 울산 관내 초·중등 교원 및 전문상담교사를 대상으로 '감정노동 스트레스 예방 및 소진 극복을 위한 마음챙김 대화법'을 주제로 한 특별 강연을 성황리에 마쳤습니다.\n\n행복바람 심리상담연구소는 앞으로도 교육계와 공공기관, 지역사회 임직원의 건강한 마음 회복을 위해 전문적인 심리지원을 아끼지 않겠습니다.",
    "행복바람 소식팀",
    342,
    0,
    "2026-09-05 11:20:00"
  );
  insertNotice.run(
    "공지",
    "내담자 권익 보호 및 비의료기관 100% 비밀보장 서약 원칙 안내",
    "행복바람 심리상담연구소는 국민건강보험공단 및 의료보험 전산에 진료 기록이 전혀 남지 않는 순수 비의료 전문 심리상담기관입니다.\n\n한국상담심리학회 및 한국상담학회 윤리강령 제1조에 의거하여, 내담자의 모든 상담 내용과 개인정보는 철저한 이중 암호화 시스템으로 보관되며 본인의 법적 동의 없이 어떠한 외부 기관(가족, 회사, 국가기관)에도 공개되지 않습니다.\n\n안심하시고 온전히 나 자신을 마주하는 시간을 가져보세요.",
    "개인정보보호책임자",
    419,
    0,
    "2026-08-20 09:00:00"
  );
}

// Seed sample Q&A
const qnaCount = (db.prepare("SELECT COUNT(*) as count FROM community_qna").get() as any).count;
if (qnaCount === 0) {
  const insertQna = db.prepare("INSERT INTO community_qna (title, author, category, phone, password, content, reply, replied_at, status, is_private, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
  insertQna.run(
    "처음 상담을 받아보려는데 어떤 프로그램을 선택해야 할지 고민입니다.",
    "김*은",
    "상담신청",
    "010-****-1234",
    "1111",
    "일상에서 이유 없이 불안하고 가슴이 답답해서 상담을 고민 중입니다. 개인상담을 바로 신청해야 하는지, 종합심리검사를 먼저 받아야 하는지 궁금합니다.",
    "안녕하세요, 은 님. 용기 내어 소중한 문의 남겨주셔서 감사드립니다.\n\n처음 방문하시는 경우, 1회기 초기 상담(접수면접)을 통해 현재 겪고 계신 불편감의 양상과 우선순위를 상담사와 함께 안전하게 탐색합니다. 그 후 심층 심리평가가 필요한지, 혹은 1:1 대화 중심의 개인 상담을 진행할지 내담자의 속도와 상황에 맞추어 맞춤 결정하게 되오니 부담 갖지 마시고 편안한 마음으로 방문하셔도 좋습니다. 언제든 기다리고 있겠습니다.",
    "2026-09-20 15:40:00",
    "answered",
    1,
    "2026-09-20 10:15:00"
  );
  insertQna.run(
    "부부상담을 진행할 때 배우자와 반드시 함께 방문해야 하나요?",
    "박*호",
    "부부/가족",
    "010-****-5678",
    "2222",
    "부부 갈등이 심한데 배우자가 상담에 소극적입니다. 저 혼자 먼저 방문해도 관계 개선에 도움이 될까요?",
    "안녕하세요, 호 님. 네, 물론입니다.\n\n부부상담의 경우 두 분이 함께 오시는 것이 가장 이상적이지만, 한 분이 먼저 오셔서 현재의 갈등 패턴과 나의 반응 방식을 객관적으로 점검하는 것만으로도 부부 관계에 매우 긍정적인 변화의 파동이 시작됩니다.\n\n1~2회기 개인 상담을 진행한 후 배우자분이 심리적 거부감 없이 자연스럽게 동참하실 수 있도록 안전한 대화 접근법도 함께 안내해 드립니다.",
    "2026-09-19 11:15:00",
    "answered",
    1,
    "2026-09-19 09:30:00"
  );
  insertQna.run(
    "상담 기록이나 방문 사실이 직장이나 보험사에 알려질 우려는 없나요?",
    "이*수",
    "비밀보장",
    "010-****-9012",
    "3333",
    "공공기관 재직 중인데 개인 상담을 이용했을 때 인사고과나 보험 가입 시 불이익이 생길까 염려됩니다.",
    "안녕하세요, 수 님. 전혀 염려하지 않으셔도 됩니다.\n\n행복바람 심리상담연구소는 병의원이 아닌 순수 민간 전문 심리상담기관으로 국민건강보험공단에 전산 코드가 일절 등록되지 않습니다.\n\n또한 한국상담학회 윤리강령 제1조(비밀보장의 의무)에 의거하여 본인의 법적 서면 동의 없이 회사나 보험사에 어떠한 방문 기록이나 상담 정보도 제공되지 않음을 법적으로 보장해 드립니다.",
    "2026-09-17 18:20:00",
    "answered",
    1,
    "2026-09-17 14:00:00"
  );
}

// Seed counseling insights (Clinical expert blog posts to build trust & authority)
const insightsCount = (db.prepare("SELECT COUNT(*) as count FROM counseling_insights").get() as any).count;
if (insightsCount === 0) {
  const insertInsight = db.prepare(`
    INSERT INTO counseling_insights (title, category, summary, content, author, author_title, read_time, image_url, tags, featured, views, takeaways, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertInsight.run(
    "우리 아이의 산만함, 정말 ADHD일까요? 감별의 핵심 3대 기준과 부모의 양육 태도",
    "아동·청소년",
    "아이의 산만함은 발달적 특성일까요, 아니면 전문가의 개입이 필요한 ADHD일까요? 감별의 3대 핵심 기준(장소 일관성, 지속 기간, 기능적 손상)과 숨겨진 심리적 원인, 가정에서 실천하는 단계적 양육 솔루션을 제시합니다.",
    "상담소를 찾는 학부모 열 분 중 세네 분은 비슷한 염려를 안고 찾아옵니다. \"선생님, 아이가 5분도 가만히 앉아 있질 못해요\", \"수업 시간에 멍하니 딴청만 피운다는데 혹시 ADHD는 아닐까요?\" 불안과 자책이 뒤섞인 목소리 뒤에는, 내 아이의 산만함을 어떤 시선으로 바라봐야 할지 막막한 부모의 마음이 자리 잡고 있습니다.\n\n아이들은 본래 세상에 대한 호기심이 넘치고, 신체 에너지를 발산하며 주의 통제력을 서서히 발달시켜 나가는 과정 중에 있습니다. 단순히 에너지가 넘치거나 흥미 없는 과제에 집중하지 못한다고 해서 모두 ADHD인 것은 아닙니다.\n\n■ 임상 현장에서 감별의 핵심으로 두는 3대 기준\n1. 상황의 일관성: 가정뿐 아니라 학교, 학원 등 최소 2곳 이상의 환경에서 일관되게 주의력 통제 어려움이 나타나는가?\n2. 지속 기간: 새 학기 적응기나 환경 변화에 따른 일시적 반응이 아닌 6개월 이상 지속되는가?\n3. 기능적 손상: 지적 능력에 비해 과도하게 학업 성취가 떨어지거나 친구 관계에서 반복적으로 배제·거절을 겪고 있는가?\n\n■ 겉모습 너머의 심리적 원인\n아이의 산만함은 뇌의 전두엽 발달 지연뿐만 아니라 마음속 깊은 불안과 긴장, 혹은 소아기 가면성 우울의 표현일 수 있습니다. '너는 왜 맨날 그래?'라는 인격적 비난 대신, 구체적이고 작은 행동 지시와 즉각적인 긍정 강화를 통해 자존감을 지켜주어야 합니다.",
    "박미경 소장",
    "교육학 박사 · 한국상담학회 1급 수련감독자",
    "5분 읽기",
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800&h=500",
    "#아동청소년 #ADHD감별 #집중력코칭 #부모양육태도 #인지발달",
    1,
    384,
    JSON.stringify([
      "장소 일관성(최소 2곳)과 6개월 이상의 지속성 확인 필수",
      "산만함의 기저에 깔린 내면의 불안과 가면성 우울 감별",
      "행동과 인격을 분리하는 비폭력 양육 피드백과 성공 강화"
    ]),
    "2026-09-22 10:00:00"
  );

  insertInsight.run(
    "번아웃 증후군을 극복하는 마음챙김과 자기 자비(Self-Compassion) 5단계",
    "성인·번아웃",
    "끝없는 피로감과 정서적 고갈에 지친 직장인을 위한 심리학적 처방전. 신체 감각 인지부터 엄격한 자기비판을 내려놓는 자기 자비 연습까지, 일상 회복의 5단계를 전합니다.",
    "열심히 달려온 삶에서 어느 날 문득 모든 에너지가 소진된 듯한 무기력을 마주할 때가 있습니다. 아침에 눈을 뜨는 것이 버겁고, 좋아하던 취미조차 무미건조해지며, 사소한 일에도 날카로운 짜증이 솟구칩니다. 번아웃 증후군은 단순히 나약함의 문제가 아니라, 심리적 배터리가 완전히 방전되어 영혼이 보내는 강력한 쉼의 신호입니다.\n\n현대인들은 '더 잘해야 한다', '뒤처지면 안 된다'는 가혹한 내면의 비판자(Inner Critic)를 지니고 살아갑니다. 이 악순환의 고리를 끊기 위해 필요한 것이 바로 크리스틴 네프(Kristin Neff) 박사가 주창한 '자기 자비(Self-Compassion)'입니다.\n\n■ 일상 회복을 위한 마음챙김 5단계 실천법\n1단계: 신체 적신호 자각 (어깨 뭉침, 불면, 두통을 억누르지 않고 알아차림)\n2단계: 내면 비판 멈추기 (\"너는 왜 이것밖에 못해?\" 대신 \"그동안 참 많이 애썼구나\"로 전환)\n3단계: 정서적 호흡 공간 확보 (하루 3분, 오롯이 나의 들숨과 날숨에만 머무르기)\n4단계: 심리적 경계선(Boundary) 구축 (퇴근 후 메신저와 일 분리, 정중한 거절 연습)\n5단계: 회복을 위한 1:1 심층 상담 (방전된 원인 탐색 및 안전한 심리적 울타리 재건)",
    "박미경 소장",
    "교육학 박사 · 한국상담학회 1급 수련감독자",
    "4분 읽기",
    "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=800&h=500",
    "#성인상담 #번아웃극복 #마음챙김 #자기자비 #직장인스트레스",
    1,
    462,
    JSON.stringify([
      "몸이 보내는 피로 신호와 과도한 자기비판 멈춤이 첫 단추",
      "하루 3분 정서적 호흡 공간 확보 및 일·휴식의 경계선 설정",
      "소진의 근본 원인을 해소하는 전문 심리상담의 조력"
    ]),
    "2026-09-18 14:30:00"
  );

  insertInsight.run(
    "반복되는 부부 갈등과 침묵의 벽, 정서중심치료(EFT)로 대화 복원하기",
    "부부·가족",
    "다툼 끝에 찾아오는 침묵과 냉담은 포기가 아닌 ‘상처받기 두려운 방어기제’입니다. 비난과 회피의 악순환 고리를 끊고 서로의 근원적 애착 욕구를 안전하게 전달하는 법을 안내합니다.",
    "\"대화를 시작하면 결국 5분도 안 돼서 싸움으로 끝나요.\" \"남편은 말문이 막히면 방으로 들어가 버리고, 저는 그 문을 두드리며 소리를 지릅니다.\" 부부상담실을 찾는 수많은 커플들이 겪는 전형적인 '추적자(Pursuer) - 도망자(Withdrawer)' 갈등의 춤입니다.\n\n정서중심 부부치료(Emotionally Focused Therapy, EFT) 관점에서 보면, 겉으로 드러나는 비난과 분노는 '2차 정서(Secondary Emotion)'에 불과합니다. 그 깊은 바닥에는 \"당신에게 내가 아직 소중한 사람인가요?\", \"내가 힘들 때 곁에 있어줄 건가요?\"라는 버림받을지 모른다는 두려움과 고립감이라는 '1차 정서(Primary Emotion)'가 숨어 있습니다.\n\n도망자는 상처를 더 주기 싫고 갈등이 커질까 두려워 숨는 것이며, 추적자는 관계의 연결이 끊어질까 두려워 격렬히 흔드는 것입니다. 서로의 숨겨진 취약한 감정을 이해하고 인정하는 순간, 굳게 닫혔던 침묵의 벽이 열리고 진정한 소통이 다시 시작됩니다.",
    "박미경 소장",
    "교육학 박사 · 한국상담학회 1급 수련감독자",
    "6분 읽기",
    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=800&h=500",
    "#부부갈등 #정서중심치료 #비폭력대화 #애착손상 #관계회복",
    1,
    528,
    JSON.stringify([
      "비난과 침묵은 관계 단절의 두려움에서 비롯된 2차 방어기제",
      "서로의 깊은 애착 욕구와 취약성을 안전하게 드러내는 훈련",
      "이마고(Imago) 대화법과 중재를 통한 정서적 유대감 재건"
    ]),
    "2026-09-14 11:20:00"
  );

  insertInsight.run(
    "갑작스러운 공황발작과 엄습하는 불안, 몸의 신호와 인지행동치료(CBT) 대처법",
    "불안·공황",
    "심장이 터질 듯 뛰고 숨이 턱 막힐 때, '이것은 죽을 병이 아니라 뇌의 일시적 오경보'임을 인지하는 것이 핵심입니다. 복식호흡과 왜곡된 파국화 인지 재구조화 기법을 소개합니다.",
    "엘리베이터 안에서, 지하철 안에서, 혹은 평화롭게 쉬던 주말 오후에 갑자기 가슴이 조여오고 숨이 가빠지며 온몸이 떨리는 경험을 해보셨나요? \"이러다 심장마비로 죽는 것은 아닐까\", \"미쳐버리는 것은 아닐까\"라는 극심한 공포가 엄습합니다.\n\n응급실로 달려가 심전도와 피검사를 받아도 \"신체적으로는 아무 이상이 없습니다\"라는 말을 듣고 나면 막막함은 더 커집니다. 이것이 바로 공황발작(Panic Attack)의 특징입니다.\n\n인지행동치료(CBT)에서는 공황발작을 뇌의 편도체(Amygdala)가 울리는 '화재경보기 오작동'으로 설명합니다. 불이 나지 않았는데도 센서가 과민해져 경보를 울린 것뿐입니다. 발작은 통상 10분~20분 내에 정점을 찍고 자율신경계에 의해 반드시 가라앉습니다. 4-4-6 복식호흡과 함께 '몸의 감각을 위험으로 파국화하지 않는 인지 훈련'을 통해 불안의 통제력을 되찾을 수 있습니다.",
    "박미경 소장",
    "교육학 박사 · 한국상담학회 1급 수련감독자",
    "5분 읽기",
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800&h=500",
    "#공황장애 #인지행동치료 #과호흡대처 #예기불안 #신체화증상",
    0,
    312,
    JSON.stringify([
      "공황발작은 신체적 치명상이 아닌 뇌의 자율신경계 과민 오경보",
      "신체 감각을 위험으로 확대해석하는 파국화 사고 재구조화",
      "4-4-6 복식호흡과 점진적 근육이완을 통한 신체 안정화"
    ]),
    "2026-09-08 09:30:00"
  );

  insertInsight.run(
    "상처 입은 내면아이와 화해하기: 성인 애착과 자존감 회복의 여정",
    "심층치유",
    "어른이 되어서도 타인의 인정에 목매거나 쉽게 불안해진다면, 어린 시절 충족되지 못한 정서적 결핍을 살펴볼 때입니다. 온전한 수용 속에서 내면의 치유력을 되찾는 과정.",
    "사회적으로 성공하고 남부러울 것 없이 살아가는 성인들 중에도 가슴 한구석이 텅 빈 것 같은 공허함과 불완전감을 호소하는 분들이 많습니다. 사소한 비판에도 자존감이 바닥으로 곤두박질치거나, 거절당할까 봐 자신의 욕구를 숨긴 채 타인에게만 맞추는 '착한 아이 콤플렉스'에 시달리기도 합니다.\n\n심층 심리상담에서는 이를 '상처받은 내면아이(Wounded Inner Child)'의 부름으로 봅니다. 어린 시절 충분한 정서적 지지와 지지적 수용을 받지 못했던 내면의 아이가 여전히 어른의 마음속에서 울고 있는 것입니다.\n\n상담은 그 울고 있는 아이에게 \"이제는 괜찮다, 내가 너를 지켜줄게\"라고 말해줄 수 있는 '건강한 내면의 성인 부모'를 세우는 과정입니다. 100% 비밀이 보장되는 안전한 상담실에서 판단 없는 온전한 공감을 경험할 때, 내담자는 비로소 가면을 벗고 자기 자신과의 평화로운 화해를 이뤄냅니다.",
    "박미경 소장",
    "교육학 박사 · 한국상담학회 1급 수련감독자",
    "6분 읽기",
    "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&q=80&w=800&h=500",
    "#내면아이치유 #자존감회복 #원가족상처 #성인애착 #심층상담",
    0,
    295,
    JSON.stringify([
      "타인 인정 욕구와 거절 불안 이면에 숨겨진 내면아이의 결핍 탐색",
      "과거의 상처를 있는 그대로 수용하는 안전한 심리적 지지 기반",
      "자의식 과잉을 걷어내고 스스로를 품는 자기수용(Self-Acceptance)"
    ]),
    "2026-09-01 16:10:00"
  );

  insertInsight.run(
    "비의료 심리상담의 100% 비밀보장과 객관적 심리평가(MMPI-2/TCI)의 의미",
    "심리검사",
    "국민건강보험공단 진료 기록이 남지 않는 순수 심리상담의 윤리적 원칙과, 표준화된 심리검사를 통해 타고난 기질과 후천적 성격을 객관적으로 파악하는 가치를 설명합니다.",
    "많은 분들이 심리상담을 망설이는 가장 큰 이유 중 하나는 '혹시 기록이 남아 회사나 보험 가입 시 불이익을 받지 않을까'하는 염려 때문입니다.\n\n행복바람 심리상담연구소는 병의원이 아닌 순수 민간 심리상담 연구기관으로, 국민건강보험공단에 전산 코드가 일절 등록되지 않습니다. 한국상담학회 및 한국상담심리학회 윤리강령 제1조에 의거하여, 내담자의 모든 상담 내용과 개인정보는 법적으로 철저히 비밀이 보장됩니다.\n\n또한 효과적인 상담을 위해서는 나의 마음 상태를 객관적인 지표로 확인하는 과정이 큰 도움이 됩니다. 전 세계적으로 표준화된 객관적 다면적 인성검사(MMPI-2)와 기질 및 성격검사(TCI)는 내가 타고난 유전적 기질(자극추구, 위험회피, 사회적 민감성)과 환경 속에서 성숙해 온 성격(자율성, 연대감)을 정밀하게 분석하여, 왜곡된 죄책감에서 벗어나 나다운 삶의 방향을 설정할 수 있도록 돕습니다.",
    "박미경 소장",
    "교육학 박사 · 한국상담학회 1급 수련감독자",
    "4분 읽기",
    "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800&h=500",
    "#비의료상담 #비밀보장 #MMPI2 #TCI기질검사 #자기이해",
    0,
    440,
    JSON.stringify([
      "건강보험공단 전산 미등재로 100% 비밀보장되는 안심 비의료기관",
      "MMPI-2와 TCI를 통한 기질(유전)과 성격(환경)의 입체적 분석",
      "공인 1급 슈퍼바이저의 정밀한 1:1 심리평가 결과 해석 상담"
    ]),
    "2026-08-25 15:00:00"
  );
}

// Ensure diverse topic seeds (Psychology Tips, Parenting, Stress Management) exist for rich category filtering
try {
  const checkExtra = db.prepare("SELECT COUNT(*) as count FROM counseling_insights WHERE category IN ('심리학 팁', '자녀 양육', '스트레스 관리')").get() as any;
  if (!checkExtra || checkExtra.count === 0) {
    const insertInsight = db.prepare(`
      INSERT INTO counseling_insights (title, category, summary, content, author, author_title, read_time, image_url, tags, featured, views, takeaways, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertInsight.run(
      "사소한 말 한마디에도 며칠간 마음이 다치는 분들을 위한 3가지 심리학 팁 (Psychology Tips)",
      "심리학 팁",
      "타인의 표정이나 말투에 상처받고 밤새 자책하는 ‘거절 민감성(Rejection Sensitivity)’. 인지 왜곡을 교정하고 타인의 평가와 나의 존재 가치를 안전하게 분리하는 실전 심리학 팁 3가지를 전합니다.",
      "직장 동료의 짧은 단답이나 상사의 미묘한 눈빛 하나에 온종일 마음이 곤두박질치는 경험이 있으신가요? '내가 뭘 잘못했나?', '나를 싫어하나?' 꼬리를 무는 부정적 생각은 뇌의 ‘확증 편향’과 ‘독심술의 오류(Mind Reading)’가 빚어낸 인지 왜곡입니다.\n\n심리학에서는 이를 거절 민감성(Rejection Sensitivity Dysphoria)이라고 부릅니다. 이 고통의 쳇바퀴를 멈추기 위해 다음과 같은 3가지 심리학적 기법을 일상에서 실천해 보세요.\n\n1. 객관적 사실과 주관적 해석의 분리: ‘상사가 인사를 건성으로 했다’(사실)와 ‘나를 무시한다’(해석)를 종이에 적어 엄격히 구분합니다.\n2. 타인의 감정에 대한 책임 내려놓기: 상대방의 기분 저하는 그 사람의 개인적 스트레스나 수면 부족일 확률이 90% 이상입니다. 타인의 감정 쓰레기통이 되지 마세요.\n3. 내면의 든든한 자기 자비(Self-Compassion): 타인에게 기대했던 인정의 말을 오늘 밤 스스로에게 직접 건네주세요. '오늘도 힘든 하루 버텨내느라 참 고생 많았다.'",
      "박미경 소장",
      "교육학 박사 · 한국상담학회 1급 수련감독자",
      "5분 읽기",
      "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&q=80&w=800&h=500",
      "#심리학팁 #PsychologyTips #거절민감성 #독심술오류 #자기자비 #감정분리",
      1,
      512,
      JSON.stringify([
        "객관적 사건(사실)과 내 머릿속의 불안한 추측(해석) 명확히 분리",
        "타인의 나쁜 기분을 내 탓으로 돌리지 않는 심리적 독립",
        "자가 비난을 멈추고 자존감을 보호하는 자기 자비 언어 습관"
      ]),
      "2026-09-26 09:00:00"
    );

    insertInsight.run(
      "화내지 않고 자녀의 자율성을 키우는 긍정적 훈육 4원칙 (Parenting)",
      "자녀 양육",
      "아이의 고집과 반항에 언성을 높이게 되는 부모님들을 위한 감정코칭 양육법. 감정은 100% 수용하되 행동의 한계는 명확히 긋는 지혜로운 부모의 대화 기술을 안내합니다.",
      "\"몇 번을 말해야 알아듣니?\" 오늘도 아이에게 소리를 지르고 난 뒤, 잠든 아이의 얼굴을 보며 후회와 죄책감에 눈물짓는 부모님들이 많습니다. 하지만 분노에 찬 체벌이나 언어적 압박은 아이의 뇌에서 편도체(공포 중추)만을 자극할 뿐, 전두엽(자기 조절 및 학습 중추)의 성장을 가로막습니다.\n\n세계적 심리학자 존 가트맨(John Gottman) 박사의 감정코칭 훈육법은 명확합니다. '아이의 모든 감정은 옳다. 하지만 모든 행동이 허용되는 것은 아니다.'\n\n■ 긍정적 부모 양육(Parenting) 4대 원칙\n1. 감정 읽어주기: '숙제하기 싫어서 짜증이 많이 났구나' (감정 수용)\n2. 공감의 울타리: '엄마도 어릴 때 숙제하기 정말 싫었단다' (유대감 형성)\n3. 행동의 한계 긋기: '하지만 화가 난다고 물건을 던지는 건 안 돼' (명확한 규칙)\n4. 스스로 대안 찾기: '그럼 10분만 쉬고 시작할까, 아니면 쉬운 과목부터 먼저 해볼까?' (자율적 선택 부여)",
      "박미경 소장",
      "교육학 박사 · 한국상담학회 1급 수련감독자",
      "5분 읽기",
      "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&q=80&w=800&h=500",
      "#자녀양육 #Parenting #아동청소년 #부모코칭 #감정코칭 #긍정훈육",
      1,
      438,
      JSON.stringify([
        "아동의 감정은 100% 수용하되 공격적 행동의 한계는 단호하게 설정",
        "분노 표출 대신 공감과 존중으로 아이의 자기통제 전두엽 발달 촉진",
        "부모의 일관된 태도와 자율적 대안 선택권을 통한 주체성 확립"
      ]),
      "2026-09-24 16:30:00"
    );

    insertInsight.run(
      "만성 긴장과 두통을 줄이는 5분 직장인 스트레스 관리 루틴 (Stress Management)",
      "스트레스 관리",
      "컴퓨터 앞 경직된 몸, 쉴 새 없이 밀려오는 업무 카톡에 지친 직장인을 위한 신체 안정화 테크닉. 점진적 근육이완법과 미주신경 활성화 호흡법을 공유합니다.",
      "스트레스는 단순히 머릿속의 생각이 아닙니다. 스트레스 호르몬인 코르티솔과 아드레날린은 교감신경을 과항진시켜 승모근을 뭉치게 하고, 호흡을 얕게 만들며, 만성 소화불량과 긴장성 두통을 유발합니다.\n\n진정한 스트레스 관리(Stress Management)는 머리가 아닌 '몸의 신호'를 진정시키는 것에서 출발합니다.\n\n■ 책상에서 실천하는 5분 스트레스 완화 루틴\n1. 4-7-8 미주신경 자극 호흡: 4초간 코로 숨을 들이마시고, 7초간 숨을 참은 뒤, 8초간 입으로 길게 내쉽니다. 부교감신경이 즉각 활성화되어 심박수가 안정됩니다.\n2. 점진적 근육 수축-이완법: 양어깨를 귀까지 한껏 움츠려 5초간 꽉 쥐었다가, 한순간에 툭 하고 긴장을 바닥으로 떨어뜨립니다.\n3. 디지털 디톡스 안구 휴식: 모니터에서 눈을 떼고 창밖의 먼 산이나 하늘을 1분간 바라보며 시야각을 넓혀줍니다.",
      "박미경 소장",
      "교육학 박사 · 한국상담학회 1급 수련감독자",
      "4분 읽기",
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800&h=500",
      "#스트레스관리 #StressManagement #성인번아웃 #호흡이완 #직장인힐링",
      1,
      476,
      JSON.stringify([
        "신체 신호(승모근 뭉침, 두통)를 인지하고 부교감신경 이완 활성화",
        "4-7-8 호흡법과 점진적 근육이완법을 통한 즉각적인 과긴장 완화",
        "퇴근 후 업무 메신저 알림 끄기를 통한 심리적 회복 환경 구축"
      ]),
      "2026-09-20 11:00:00"
    );
  }
} catch (e) {
  console.error("Error seeding extra insights:", e);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "30mb" }));
  app.use(express.urlencoded({ extended: true, limit: "30mb" }));

  // Static images route with aggressive cache control for global high-speed delivery
  const publicImagesPath = fs.existsSync(path.join(process.cwd(), "public", "images"))
    ? path.join(process.cwd(), "public", "images")
    : path.join(__dirname, "images");
  if (fs.existsSync(publicImagesPath)) {
    app.use("/images", express.static(publicImagesPath, {
      maxAge: "7d",
      setHeaders: (res) => {
        res.setHeader("Cache-Control", "public, max-age=604800, stale-while-revalidate=86400");
      }
    }));
  }

  // API Routes
  app.get("/api/counselors", (req, res) => {
    const counselors = db.prepare("SELECT * FROM counselors WHERE name = ?").all("박미경");
    res.json(counselors);
  });

  app.post("/api/counselors/:id/image", (req, res) => {
    const { id } = req.params;
    const { imageBase64, filename } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "이미지 데이터가 전달되지 않았습니다." });
    }

    try {
      const publicDir = path.join(process.cwd(), "public");
      const imagesDir = path.join(publicDir, "images");
      if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
      }

      const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      const buffer = matches ? Buffer.from(matches[2], "base64") : Buffer.from(imageBase64, "base64");

      const safeFilename = filename ? filename.replace(/[^a-zA-Z0-9._-]/g, "_") : "counselor_park.jpg";
      const filePath = path.join(imagesDir, safeFilename);
      fs.writeFileSync(filePath, buffer);

      // Also ensure standard counselor_park.jpg is updated
      const defaultPath = path.join(imagesDir, "counselor_park.jpg");
      fs.writeFileSync(defaultPath, buffer);

      const imageUrl = `/images/${safeFilename}`;
      db.prepare("UPDATE counselors SET image_url = ? WHERE id = ?").run(imageUrl, id);

      res.json({ success: true, image_url: imageUrl });
    } catch (err: any) {
      console.error("Failed to save image:", err);
      res.status(500).json({ error: "이미지 저장에 실패했습니다." });
    }
  });

  // Welcome tea image upload endpoint
  app.post("/api/welcome-tea/image", (req, res) => {
    const { imageBase64, filename } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "이미지 데이터가 전달되지 않았습니다." });
    }

    try {
      const publicDir = path.join(process.cwd(), "public");
      const imagesDir = path.join(publicDir, "images");
      if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
      }

      const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      const buffer = matches ? Buffer.from(matches[2], "base64") : Buffer.from(imageBase64, "base64");

      const safeFilename = filename ? filename.replace(/[^a-zA-Z0-9._-]/g, "_") : "welcome_tea.jpg";
      const filePath = path.join(imagesDir, safeFilename);
      fs.writeFileSync(filePath, buffer);

      // Also ensure standard welcome_tea.jpg is updated
      const defaultPath = path.join(imagesDir, "welcome_tea.jpg");
      fs.writeFileSync(defaultPath, buffer);

      // If dist/images exists, update it too
      const distImagesDir = path.join(process.cwd(), "dist", "images");
      if (fs.existsSync(distImagesDir)) {
        fs.writeFileSync(path.join(distImagesDir, safeFilename), buffer);
        fs.writeFileSync(path.join(distImagesDir, "welcome_tea.jpg"), buffer);
      }

      res.json({ success: true, image_url: `/images/${safeFilename}` });
    } catch (err: any) {
      console.error("Failed to save welcome tea image:", err);
      res.status(500).json({ error: "이미지 저장에 실패했습니다." });
    }
  });

  // Counseling room image upload endpoint
  app.post("/api/counseling-room/image", (req, res) => {
    const { imageBase64, filename } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "이미지 데이터가 전달되지 않았습니다." });
    }

    try {
      const publicDir = path.join(process.cwd(), "public");
      const imagesDir = path.join(publicDir, "images");
      if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
      }

      const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      const buffer = matches ? Buffer.from(matches[2], "base64") : Buffer.from(imageBase64, "base64");

      const safeFilename = filename ? filename.replace(/[^a-zA-Z0-9._-]/g, "_") : "counseling_room.jpg";
      const filePath = path.join(imagesDir, safeFilename);
      fs.writeFileSync(filePath, buffer);

      // Also ensure standard counseling_room.jpg is updated
      const defaultPath = path.join(imagesDir, "counseling_room.jpg");
      fs.writeFileSync(defaultPath, buffer);

      // If dist/images exists, update it too
      const distImagesDir = path.join(process.cwd(), "dist", "images");
      if (fs.existsSync(distImagesDir)) {
        fs.writeFileSync(path.join(distImagesDir, safeFilename), buffer);
        fs.writeFileSync(path.join(distImagesDir, "counseling_room.jpg"), buffer);
      }

      res.json({ success: true, image_url: `/images/${safeFilename}` });
    } catch (err: any) {
      console.error("Failed to save counseling room image:", err);
      res.status(500).json({ error: "이미지 저장에 실패했습니다." });
    }
  });

  // Healing space image upload endpoint
  app.post("/api/healing-space/image", (req, res) => {
    const { imageBase64, filename } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "이미지 데이터가 전달되지 않았습니다." });
    }

    try {
      const publicDir = path.join(process.cwd(), "public");
      const imagesDir = path.join(publicDir, "images");
      if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
      }

      const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      const buffer = matches ? Buffer.from(matches[2], "base64") : Buffer.from(imageBase64, "base64");

      const safeFilename = filename ? filename.replace(/[^a-zA-Z0-9._-]/g, "_") : "healing_space.jpg";
      const filePath = path.join(imagesDir, safeFilename);
      fs.writeFileSync(filePath, buffer);

      // Also ensure standard healing_space.jpg is updated
      const defaultPath = path.join(imagesDir, "healing_space.jpg");
      fs.writeFileSync(defaultPath, buffer);

      // If dist/images exists, update it too
      const distImagesDir = path.join(process.cwd(), "dist", "images");
      if (fs.existsSync(distImagesDir)) {
        fs.writeFileSync(path.join(distImagesDir, safeFilename), buffer);
        fs.writeFileSync(path.join(distImagesDir, "healing_space.jpg"), buffer);
      }

      res.json({ success: true, image_url: `/images/${safeFilename}` });
    } catch (err: any) {
      console.error("Failed to save healing space image:", err);
      res.status(500).json({ error: "이미지 저장에 실패했습니다." });
    }
  });

  app.get("/api/programs", (req, res) => {
    const programs = db.prepare("SELECT * FROM programs").all();
    res.json(programs);
  });

  app.get("/api/reservations", (req, res) => {
    try {
      const reservations = db.prepare(`
        SELECT r.*, p.title as program_title, p.category as program_category 
        FROM reservations r 
        LEFT JOIN programs p ON r.program_id = p.id 
        ORDER BY r.id DESC
      `).all();
      res.json(reservations);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Admin Data Visualization Analytics: 6-month reservation trends by category
  app.get("/api/admin/analytics/reservations-trend", (req, res) => {
    try {
      const baseYear = 2026;
      const baseMonth = 8; // September (0-indexed)

      const months: string[] = [];
      const monthLabels: { [key: string]: string } = {};

      for (let i = 5; i >= 0; i--) {
        const d = new Date(baseYear, baseMonth - i, 1);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const key = `${yyyy}-${mm}`;
        months.push(key);
        monthLabels[key] = `${d.getMonth() + 1}월`;
      }

      const rows = db.prepare(`
        SELECT 
          strftime('%Y-%m', r.preferred_date) as month,
          COALESCE(p.category, '개인상담') as category,
          COUNT(*) as count
        FROM reservations r
        LEFT JOIN programs p ON r.program_id = p.id
        WHERE strftime('%Y-%m', r.preferred_date) IN (${months.map(m => `'${m}'`).join(',')})
        GROUP BY month, category
      `).all() as Array<{ month: string; category: string; count: number }>;

      const categories = ['개인상담', '부부상담', '심리검사', '기업상담', '집단/교육'];
      
      const monthlyDataMap: { [month: string]: any } = {};
      months.forEach(m => {
        monthlyDataMap[m] = {
          month: m,
          monthLabel: monthLabels[m],
          '개인상담': 0,
          '부부상담': 0,
          '심리검사': 0,
          '기업상담': 0,
          '집단/교육': 0,
          total: 0
        };
      });

      rows.forEach(row => {
        if (monthlyDataMap[row.month]) {
          const cat = categories.includes(row.category) ? row.category : '개인상담';
          monthlyDataMap[row.month][cat] = (monthlyDataMap[row.month][cat] || 0) + Number(row.count);
          monthlyDataMap[row.month].total += Number(row.count);
        }
      });

      const monthlyData = months.map(m => monthlyDataMap[m]);

      const categoryCounts: { [cat: string]: number } = {
        '개인상담': 0,
        '부부상담': 0,
        '심리검사': 0,
        '기업상담': 0,
        '집단/교육': 0
      };

      let grandTotal = 0;
      monthlyData.forEach(md => {
        categories.forEach(cat => {
          categoryCounts[cat] += md[cat];
        });
        grandTotal += md.total;
      });

      const categoryStyles: { [cat: string]: { color: string; secondaryColor: string; iconName: string } } = {
        '개인상담': { color: '#4B6354', secondaryColor: '#EDF2EE', iconName: 'User' },
        '부부상담': { color: '#C87D55', secondaryColor: '#FDF4EF', iconName: 'Users' },
        '심리검사': { color: '#4A6984', secondaryColor: '#EEF3F8', iconName: 'ClipboardCheck' },
        '기업상담': { color: '#8C6D46', secondaryColor: '#F8F4EE', iconName: 'Building2' },
        '집단/교육': { color: '#795B78', secondaryColor: '#F7F2F6', iconName: 'GraduationCap' }
      };

      const categoryTotals = categories.map(cat => ({
        category: cat,
        count: categoryCounts[cat],
        percentage: grandTotal > 0 ? Math.round((categoryCounts[cat] / grandTotal) * 1000) / 10 : 0,
        color: categoryStyles[cat].color,
        secondaryColor: categoryStyles[cat].secondaryColor,
        iconName: categoryStyles[cat].iconName
      }));

      let topCategory = categoryTotals[0];
      categoryTotals.forEach(ct => {
        if (ct.count > topCategory.count) {
          topCategory = ct;
        }
      });

      const prevMonth = monthlyData[monthlyData.length - 2]?.total || 0;
      const currentMonth = monthlyData[monthlyData.length - 1]?.total || 0;
      const momGrowth = prevMonth > 0 
        ? Math.round(((currentMonth - prevMonth) / prevMonth) * 1000) / 10 
        : 0;

      let highestMonth = { monthLabel: monthlyData[0]?.monthLabel || '', count: monthlyData[0]?.total || 0 };
      monthlyData.forEach(md => {
        if (md.total > highestMonth.count) {
          highestMonth = { monthLabel: md.monthLabel, count: md.total };
        }
      });

      res.json({
        months,
        monthlyData,
        categoryTotals,
        summary: {
          totalReservations: grandTotal,
          monthlyAverage: Math.round(grandTotal / (months.length || 1)),
          topCategory: {
            category: topCategory.category,
            count: topCategory.count,
            percentage: topCategory.percentage
          },
          momGrowth,
          highestMonth
        }
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/reservations", async (req, res) => {
    try {
      const { name, phone, program_id, preferred_date, preferred_time } = req.body;

      if (!preferred_date || !preferred_time) {
        return res.status(400).json({ error: "희망 날짜와 시간을 모두 선택해 주세요." });
      }

      // 1. Day of week & Saturday / Sunday checks
      const dateParts = preferred_date.split('-');
      if (dateParts.length === 3) {
        const d = new Date(parseInt(dateParts[0], 10), parseInt(dateParts[1], 10) - 1, parseInt(dateParts[2], 10));
        const dayOfWeek = d.getDay();
        if (dayOfWeek === 0) {
          return res.status(400).json({ error: "일요일은 센터 정기 휴무일입니다." });
        }
        if (dayOfWeek === 6 && preferred_time === '19:00') {
          return res.status(400).json({ 
            error: "토요일은 09:00, 10:30, 14:00, 15:30 (4회차)만 운영되며 19:00 야간 상담은 운영하지 않습니다." 
          });
        }
      }

      // Check if blocked or closed by admin
      const blocked = db.prepare(`
        SELECT * FROM schedule_blocks 
        WHERE block_date = ? AND (block_time IS NULL OR block_time = ?)
      `).get(preferred_date, preferred_time) as any;
      if (blocked) {
        return res.status(400).json({ 
          error: `선택하신 일시(${preferred_date} ${preferred_time})는 [${blocked.reason || '예약 마감'}] 상태입니다. 다른 시간을 선택해 주세요.` 
        });
      }

      // Check if duplicate booking exists
      const existing = db.prepare(`
        SELECT id FROM reservations 
        WHERE preferred_date = ? AND preferred_time = ? AND status != 'cancelled'
      `).get(preferred_date, preferred_time) as any;
      if (existing) {
        return res.status(400).json({ 
          error: `선택하신 일시(${preferred_date} ${preferred_time})는 이미 다른 예약이 접수되어 마감되었습니다. 다른 시간을 선택해 주세요.` 
        });
      }

      // Initial status is 'pending' waiting for admin confirmation
      const info = db.prepare("INSERT INTO reservations (name, phone, program_id, preferred_date, preferred_time, status) VALUES (?, ?, ?, ?, ?, 'pending')").run(name, phone, program_id, preferred_date, preferred_time);
      const reservationId = Number(info.lastInsertRowid);

      // Look up program title for notification template
      let programTitle = "맞춤 심리상담";
      if (program_id) {
        const prog = db.prepare("SELECT title, category FROM programs WHERE id = ?").get(program_id) as any;
        if (prog) {
          programTitle = `[${prog.category}] ${prog.title}`;
        }
      }

      // 1. Dispatch Kakao Alimtalk to Registered Administrator Mobile
      let adminNotifyResult = null;
      try {
        const adminPhoneRow = db.prepare("SELECT value FROM admin_settings WHERE key = 'admin_phone'").get() as any;
        const registeredAdminPhone = adminPhoneRow?.value || process.env.ADMIN_PHONE || '010-7322-5676';

        adminNotifyResult = await sendAdminNewReservationNotification({
          adminPhone: registeredAdminPhone,
          applicantName: name,
          applicantPhone: phone,
          programTitle,
          preferredDate: preferred_date,
          preferredTime: preferred_time,
          reservationId,
          isQuick: false
        });

        db.prepare(`
          INSERT INTO notification_logs 
          (reservation_id, recipient_name, recipient_phone, channel, template_title, message_content, status) 
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(
          reservationId,
          `관리자 (${formatPhoneNumber(registeredAdminPhone)})`,
          registeredAdminPhone,
          adminNotifyResult.channel,
          adminNotifyResult.templateTitle,
          adminNotifyResult.content,
          adminNotifyResult.status
        );
      } catch (adminNotifyErr) {
        console.error("Failed to process admin Alimtalk notification:", adminNotifyErr);
      }

      // 2. Dispatch Kakao Alimtalk Receipt Notice to Applicant Mobile
      let notificationResult = null;
      try {
        notificationResult = await sendReservationNotification({
          reservationId,
          recipientName: name,
          recipientPhone: phone,
          programTitle,
          preferredDate: preferred_date,
          preferredTime: preferred_time,
          type: 'RECEIVED'
        });

        db.prepare(`
          INSERT INTO notification_logs 
          (reservation_id, recipient_name, recipient_phone, channel, template_title, message_content, status) 
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(
          reservationId,
          name,
          phone,
          notificationResult.channel,
          notificationResult.templateTitle,
          notificationResult.content,
          notificationResult.status
        );
      } catch (notifyErr) {
        console.error("Failed to process receipt notification log:", notifyErr);
      }

      res.json({ 
        id: reservationId, 
        status: "pending",
        message: "예약 신청이 정상 접수되었습니다. 관리자 확인 후 예약이 확정되며 카카오톡 알림톡이 발송됩니다.",
        notification: notificationResult,
        adminNotification: adminNotifyResult
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Dedicated endpoint: Quick Reservation / Callback request (성함과 연락처만으로 간편 콜백 예약)
  app.post("/api/quick-reservations", async (req, res) => {
    try {
      const { name, phone, preferred_time, notes } = req.body;

      if (!name || !name.trim()) {
        return res.status(400).json({ error: "성함을 입력해 주세요." });
      }

      if (!phone || !phone.trim()) {
        return res.status(400).json({ error: "연락처(전화번호)를 입력해 주세요." });
      }

      const cleanPhone = phone.trim();
      const cleanName = name.trim();
      const todayStr = new Date().toISOString().split('T')[0];
      const callbackSlot = preferred_time?.trim() || '빠른 시간 내';
      const adminNoteText = notes 
        ? `[간편 전화상담(콜백) 요청] 희망시간: ${callbackSlot} / 메모: ${notes.trim()}`
        : `[간편 전화상담(콜백) 요청] 희망시간: ${callbackSlot}`;

      const info = db.prepare(`
        INSERT INTO reservations (name, phone, program_id, preferred_date, preferred_time, status, admin_notes)
        VALUES (?, ?, NULL, ?, ?, 'pending', ?)
      `).run(cleanName, cleanPhone, todayStr, callbackSlot, adminNoteText);

      const reservationId = Number(info.lastInsertRowid);

      // 1. Dispatch Kakao Alimtalk to Registered Administrator Mobile
      let adminNotifyResult = null;
      try {
        const adminPhoneRow = db.prepare("SELECT value FROM admin_settings WHERE key = 'admin_phone'").get() as any;
        const registeredAdminPhone = adminPhoneRow?.value || process.env.ADMIN_PHONE || '010-7322-5676';

        adminNotifyResult = await sendAdminNewReservationNotification({
          adminPhone: registeredAdminPhone,
          applicantName: cleanName,
          applicantPhone: cleanPhone,
          programTitle: "간편 전화상담(콜백) 요청",
          preferredDate: todayStr,
          preferredTime: callbackSlot,
          reservationId,
          isQuick: true
        });

        db.prepare(`
          INSERT INTO notification_logs 
          (reservation_id, recipient_name, recipient_phone, channel, template_title, message_content, status) 
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(
          reservationId,
          `관리자 (${formatPhoneNumber(registeredAdminPhone)})`,
          registeredAdminPhone,
          adminNotifyResult.channel,
          adminNotifyResult.templateTitle,
          adminNotifyResult.content,
          adminNotifyResult.status
        );
      } catch (adminNotifyErr) {
        console.error("Failed to process admin quick-reservation notification:", adminNotifyErr);
      }

      // 2. Dispatch Kakao Alimtalk Receipt Notice to Applicant Mobile
      let notificationResult = null;
      try {
        notificationResult = await sendReservationNotification({
          reservationId,
          recipientName: cleanName,
          recipientPhone: cleanPhone,
          programTitle: "간편 전화상담(콜백) 요청",
          preferredDate: todayStr,
          preferredTime: callbackSlot,
          type: 'RECEIVED'
        });

        db.prepare(`
          INSERT INTO notification_logs 
          (reservation_id, recipient_name, recipient_phone, channel, template_title, message_content, status) 
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(
          reservationId,
          cleanName,
          cleanPhone,
          notificationResult.channel,
          notificationResult.templateTitle,
          notificationResult.content,
          notificationResult.status
        );
      } catch (notifyErr) {
        console.error("Failed to process receipt notification for quick reservation:", notifyErr);
      }

      res.json({
        success: true,
        id: reservationId,
        message: "간편 전화상담(콜백) 예약이 정상 접수되었습니다. 전문 상담사가 확인 후 빠르게 연락드리겠습니다.",
        notification: notificationResult,
        adminNotification: adminNotifyResult
      });
    } catch (err: any) {
      console.error("Quick reservation error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // Dedicated endpoint: Corporate & Institutional EAP Inquiry submission
  app.post("/api/eap/inquiries", async (req, res) => {
    try {
      const {
        company_name,
        contact_name,
        department,
        phone,
        email,
        employee_count,
        interests,
        preferred_format,
        message
      } = req.body;

      if (!company_name || !company_name.trim()) {
        return res.status(400).json({ error: "기관 및 기업명을 입력해 주세요." });
      }

      if (!contact_name || !contact_name.trim()) {
        return res.status(400).json({ error: "담당자 성함을 입력해 주세요." });
      }

      if (!phone || !phone.trim()) {
        return res.status(400).json({ error: "담당자 연락처를 입력해 주세요." });
      }

      const interestsStr = Array.isArray(interests) ? interests.join(", ") : (interests || "");

      const info = db.prepare(`
        INSERT INTO eap_inquiries 
        (company_name, contact_name, department, phone, email, employee_count, interests, preferred_format, message)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        company_name.trim(),
        contact_name.trim(),
        (department || "").trim(),
        phone.trim(),
        (email || "").trim(),
        (employee_count || "").trim(),
        interestsStr,
        (preferred_format || "").trim(),
        (message || "").trim()
      );

      const inquiryId = Number(info.lastInsertRowid);

      // Log notification entry for administrator tracking
      try {
        db.prepare(`
          INSERT INTO notification_logs 
          (reservation_id, recipient_name, recipient_phone, channel, template_title, message_content, status) 
          VALUES (?, ?, ?, 'ADMIN_ALERT', 'EAP 제휴 문의 접수', ?, 'SUCCESS')
        `).run(
          inquiryId,
          `${contact_name.trim()} (${company_name.trim()})`,
          phone.trim(),
          `[EAP 제휴 문의] ${company_name} / ${contact_name} (${employee_count || '규모 미정'}) / 희망: ${interestsStr || '맞춤상담'}`
        );
      } catch (logErr) {
        console.error("Failed to log EAP admin notification:", logErr);
      }

      res.json({
        success: true,
        id: inquiryId,
        message: "EAP 제휴 및 상담 문의가 정상 접수되었습니다. 담당자 검토 후 24시간 이내에 맞춤 제안서와 함께 연락드리겠습니다."
      });
    } catch (err: any) {
      console.error("EAP inquiry error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // Dedicated endpoint: Get all EAP inquiries (Admin)
  app.get("/api/eap/inquiries", (req, res) => {
    try {
      const inquiries = db.prepare("SELECT * FROM eap_inquiries ORDER BY created_at DESC").all();
      res.json(inquiries);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Dedicated endpoint: Update EAP inquiry status (Admin)
  app.patch("/api/eap/inquiries/:id/status", (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      db.prepare("UPDATE eap_inquiries SET status = ? WHERE id = ?").run(status, id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- Community Notices Endpoints ---
  app.get("/api/community/notices", (req, res) => {
    try {
      const notices = db.prepare("SELECT * FROM community_notices ORDER BY is_pinned DESC, id DESC").all();
      res.json(notices);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/community/notices/:id", (req, res) => {
    try {
      const { id } = req.params;
      db.prepare("UPDATE community_notices SET views = views + 1 WHERE id = ?").run(id);
      const notice = db.prepare("SELECT * FROM community_notices WHERE id = ?").get(id);
      if (!notice) {
        return res.status(404).json({ error: "공지사항을 찾을 수 없습니다." });
      }
      res.json(notice);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- Counseling Insights (Expert Blog Posts) Endpoints ---
  app.get("/api/insights/categories", (req, res) => {
    try {
      const rows = db.prepare("SELECT category, tags FROM counseling_insights").all() as any[];
      res.json({ total: rows.length, rows });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/insights", (req, res) => {
    try {
      const { category, search, featured, limit } = req.query;
      let query = "SELECT * FROM counseling_insights WHERE 1=1";
      const params: any[] = [];

      if (category && category !== 'all' && category !== '전체') {
        const catStr = String(category).trim();
        // Support flexible topic keywords matching
        const keywords = [catStr];
        if (catStr.includes('Psychology') || catStr.includes('심리학')) {
          keywords.push('심리학', 'Psychology', '내면아이');
        } else if (catStr.includes('Parenting') || catStr.includes('양육') || catStr.includes('아동')) {
          keywords.push('양육', 'Parenting', '아동', '청소년');
        } else if (catStr.includes('Stress') || catStr.includes('스트레스') || catStr.includes('번아웃')) {
          keywords.push('스트레스', 'Stress', '번아웃');
        } else if (catStr.includes('Couple') || catStr.includes('부부') || catStr.includes('가족')) {
          keywords.push('부부', '가족', 'Couple');
        } else if (catStr.includes('Anxiety') || catStr.includes('불안') || catStr.includes('공황')) {
          keywords.push('불안', '공황', 'Anxiety');
        } else if (catStr.includes('Self') || catStr.includes('자존감') || catStr.includes('심층')) {
          keywords.push('자존감', '심층', '내면아이');
        } else if (catStr.includes('Assessment') || catStr.includes('검사')) {
          keywords.push('검사', '평가', 'MMPI', 'TCI');
        }

        const conditions = keywords.map(() => "(category = ? OR category LIKE ? OR tags LIKE ? OR title LIKE ?)");
        query += ` AND (${conditions.join(" OR ")})`;
        keywords.forEach(kw => {
          const term = `%${kw}%`;
          params.push(kw, term, term, term);
        });
      }

      if (featured === '1' || featured === 'true') {
        query += " AND featured = 1";
      }

      if (search && typeof search === 'string' && search.trim()) {
        query += " AND (title LIKE ? OR summary LIKE ? OR tags LIKE ? OR category LIKE ?)";
        const term = `%${search.trim()}%`;
        params.push(term, term, term, term);
      }

      query += " ORDER BY featured DESC, id DESC";

      if (limit && !isNaN(Number(limit))) {
        query += ` LIMIT ${Number(limit)}`;
      }

      const rows = db.prepare(query).all(...params);
      const parsed = rows.map((r: any) => ({
        ...r,
        takeaways: r.takeaways ? JSON.parse(r.takeaways) : []
      }));
      res.json(parsed);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/insights/:id", (req, res) => {
    try {
      const { id } = req.params;
      db.prepare("UPDATE counseling_insights SET views = views + 1 WHERE id = ?").run(id);
      const insight = db.prepare("SELECT * FROM counseling_insights WHERE id = ?").get(id) as any;
      if (!insight) {
        return res.status(404).json({ error: "칼럼을 찾을 수 없습니다." });
      }
      res.json({
        ...insight,
        takeaways: insight.takeaways ? JSON.parse(insight.takeaways) : []
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- Mental Health Quick Poll Endpoints ---
  const BASELINE_POLL_COUNTS: Record<string, number> = {
    peaceful: 62,
    happy: 48,
    tired: 104,
    anxious: 78,
    heavy: 56,
    confused: 41,
  };

  const getPollStats = () => {
    const counts: Record<string, number> = { ...BASELINE_POLL_COUNTS };
    const rows = db.prepare("SELECT mood_id, COUNT(*) as count FROM quick_poll_votes GROUP BY mood_id").all() as any[];
    for (const r of rows) {
      if (counts[r.mood_id] !== undefined) {
        counts[r.mood_id] += r.count;
      } else {
        counts[r.mood_id] = r.count;
      }
    }
    const totalVotes = Object.values(counts).reduce((acc, c) => acc + c, 0);
    const percentages: Record<string, number> = {};
    for (const [key, count] of Object.entries(counts)) {
      percentages[key] = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
    }
    return { counts, percentages, totalVotes };
  };

  app.get("/api/poll/stats", (req, res) => {
    try {
      const stats = getPollStats();
      res.json(stats);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/poll/vote", (req, res) => {
    try {
      const { mood_id } = req.body;
      const validMoods = ['peaceful', 'happy', 'tired', 'anxious', 'heavy', 'confused'];
      if (!mood_id || !validMoods.includes(mood_id)) {
        return res.status(400).json({ error: "올바른 감정 항목을 선택해 주세요." });
      }
      db.prepare("INSERT INTO quick_poll_votes (mood_id) VALUES (?)").run(mood_id);
      const stats = getPollStats();
      res.json({
        success: true,
        userVotedMood: mood_id,
        ...stats,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- Newsletter Subscription Endpoints ---
  app.post("/api/newsletter/subscribe", (req, res) => {
    try {
      const { email, name, interest_topic } = req.body;
      if (!email || !email.trim()) {
        return res.status(400).json({ error: "이메일 주소를 입력해 주세요." });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return res.status(400).json({ error: "올바른 이메일 형식을 입력해 주세요 (예: user@example.com)." });
      }

      const cleanEmail = email.trim().toLowerCase();
      const topic = interest_topic || '전체';
      const cleanName = name ? name.trim() : null;

      const existing = db.prepare("SELECT * FROM newsletter_subscriptions WHERE email = ?").get(cleanEmail) as any;
      if (existing) {
        db.prepare("UPDATE newsletter_subscriptions SET status = 'active', interest_topic = ?, name = COALESCE(?, name) WHERE email = ?")
          .run(topic, cleanName, cleanEmail);
        return res.json({ 
          success: true, 
          message: "이미 구독 중인 이메일입니다. 구독 정보(관심 주제)가 최신으로 업데이트되었습니다." 
        });
      }

      db.prepare(`
        INSERT INTO newsletter_subscriptions (email, name, interest_topic)
        VALUES (?, ?, ?)
      `).run(cleanEmail, cleanName, topic);

      res.status(201).json({
        success: true,
        message: "행복바람 마음 건강 레터 구독이 완료되었습니다. 격주 화요일 아침 따뜻한 치유 팁을 보내드립니다."
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "구독 처리 중 오류가 발생했습니다." });
    }
  });

  app.get("/api/newsletter/stats", (req, res) => {
    try {
      const count = (db.prepare("SELECT COUNT(*) as count FROM newsletter_subscriptions WHERE status = 'active'").get() as any).count;
      res.json({ subscriberCount: count + 1420 }); // Base readers count for positive social proof
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Create new community notice/post (Admin)
  app.post("/api/community/notices", (req, res) => {
    try {
      const { category, title, content, author, is_pinned } = req.body;
      if (!title || !title.trim()) {
        return res.status(400).json({ error: "제목을 입력해 주세요." });
      }
      if (!content || !content.trim()) {
        return res.status(400).json({ error: "내용을 입력해 주세요." });
      }

      const stmt = db.prepare(`
        INSERT INTO community_notices (category, title, content, author, views, is_pinned, created_at, updated_at)
        VALUES (?, ?, ?, ?, 0, ?, datetime('now', 'localtime'), datetime('now', 'localtime'))
      `);

      const pinVal = is_pinned ? 1 : 0;
      const authorVal = (author && author.trim()) ? author.trim() : "행복바람 운영팀";
      const catVal = (category && category.trim()) ? category.trim() : "공지사항";

      const info = stmt.run(catVal, title.trim(), content.trim(), authorVal, pinVal);
      const newId = Number(info.lastInsertRowid);
      const createdItem = db.prepare("SELECT * FROM community_notices WHERE id = ?").get(newId);

      res.status(201).json({
        success: true,
        message: "게시글이 성공적으로 등록되었습니다.",
        notice: createdItem
      });
    } catch (err: any) {
      console.error("Failed to create community notice:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // Update community notice/post (Admin)
  const updateCommunityNoticeHandler = (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const { category, title, content, author, is_pinned } = req.body;

      const existing = db.prepare("SELECT * FROM community_notices WHERE id = ?").get(id);
      if (!existing) {
        return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });
      }

      if (!title || !title.trim()) {
        return res.status(400).json({ error: "제목을 입력해 주세요." });
      }
      if (!content || !content.trim()) {
        return res.status(400).json({ error: "내용을 입력해 주세요." });
      }

      const pinVal = is_pinned ? 1 : 0;
      const authorVal = (author && author.trim()) ? author.trim() : (existing as any).author;
      const catVal = (category && category.trim()) ? category.trim() : (existing as any).category;

      db.prepare(`
        UPDATE community_notices 
        SET category = ?, title = ?, content = ?, author = ?, is_pinned = ?, updated_at = datetime('now', 'localtime')
        WHERE id = ?
      `).run(catVal, title.trim(), content.trim(), authorVal, pinVal, id);

      const updated = db.prepare("SELECT * FROM community_notices WHERE id = ?").get(id);

      res.json({
        success: true,
        message: "게시글이 성공적으로 수정되었습니다.",
        notice: updated
      });
    } catch (err: any) {
      console.error("Failed to update community notice:", err);
      res.status(500).json({ error: err.message });
    }
  };

  app.put("/api/community/notices/:id", updateCommunityNoticeHandler);
  app.patch("/api/community/notices/:id", updateCommunityNoticeHandler);

  // Delete community notice/post (Admin)
  app.delete("/api/community/notices/:id", (req, res) => {
    try {
      const { id } = req.params;
      const existing = db.prepare("SELECT * FROM community_notices WHERE id = ?").get(id);
      if (!existing) {
        return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });
      }

      db.prepare("DELETE FROM community_notices WHERE id = ?").run(id);

      res.json({
        success: true,
        message: "게시글이 삭제되었습니다."
      });
    } catch (err: any) {
      console.error("Failed to delete community notice:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // Toggle is_pinned on community notice (Admin)
  app.patch("/api/community/notices/:id/pin", (req, res) => {
    try {
      const { id } = req.params;
      const existing = db.prepare("SELECT is_pinned FROM community_notices WHERE id = ?").get(id) as any;
      if (!existing) {
        return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });
      }

      const newPinned = existing.is_pinned === 1 ? 0 : 1;
      db.prepare("UPDATE community_notices SET is_pinned = ?, updated_at = datetime('now', 'localtime') WHERE id = ?").run(newPinned, id);

      res.json({
        success: true,
        is_pinned: newPinned,
        message: newPinned === 1 ? "상단 중요 공지로 고정되었습니다." : "상단 고정이 해제되었습니다."
      });
    } catch (err: any) {
      console.error("Failed to toggle pin on notice:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // --- Community 1:1 Secret Q&A Endpoints ---
  app.get("/api/community/qna", (req, res) => {
    try {
      // Returns list without exposing password or phone, and hides private content
      const list = db.prepare(`
        SELECT id, title, author, category, status, is_private, created_at, replied_at,
               CASE WHEN is_private = 0 THEN content ELSE NULL END as content,
               CASE WHEN is_private = 0 THEN reply ELSE NULL END as reply
        FROM community_qna 
        ORDER BY id DESC
      `).all();
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/community/qna", (req, res) => {
    try {
      const { title, author, category, phone, password, content, is_private } = req.body;
      if (!title || !author || !password || !content) {
        return res.status(400).json({ error: "제목, 작성자, 비밀번호(4자리), 문의 내용을 모두 입력해 주세요." });
      }

      const stmt = db.prepare(`
        INSERT INTO community_qna (title, author, category, phone, password, content, status, is_private)
        VALUES (?, ?, ?, ?, ?, ?, 'waiting', ?)
      `);

      const isPriv = is_private === false ? 0 : 1;
      const info = stmt.run(
        title.trim(),
        author.trim(),
        category || '상담신청',
        phone ? phone.trim() : null,
        password.trim(),
        content.trim(),
        isPriv
      );

      const qnaId = Number(info.lastInsertRowid);

      // Notification log for admin
      try {
        db.prepare(`
          INSERT INTO notification_logs 
          (recipient_name, recipient_phone, channel, template_title, message_content, status) 
          VALUES (?, ?, 'ADMIN_ALERT', '1:1 비밀상담 문의 접수', ?, 'SUCCESS')
        `).run(
          author.trim(),
          phone ? phone.trim() : '비공개',
          `[1:1 비밀상담 문의] ${title.trim()} (${category}) - 작성자: ${author.trim()}`
        );
      } catch (logErr) {
        console.error("Failed to log QnA admin notification:", logErr);
      }

      res.json({
        success: true,
        id: qnaId,
        message: "비밀 문의가 정상 등록되었습니다. 전문 상담사가 검토 후 정성껏 답변을 남겨드립니다."
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/community/qna/:id/verify", (req, res) => {
    try {
      const { id } = req.params;
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({ error: "비밀번호를 입력해 주세요." });
      }

      const item = db.prepare("SELECT * FROM community_qna WHERE id = ?").get(id) as any;
      if (!item) {
        return res.status(404).json({ error: "문의글을 찾을 수 없습니다." });
      }

      // Check admin password override or user password match
      const adminPw = db.prepare("SELECT value FROM admin_settings WHERE key = 'admin_password'").get() as any;
      const isAdminPw = adminPw && adminPw.value === password.trim();

      if (item.password === password.trim() || isAdminPw) {
        return res.json({
          verified: true,
          id: item.id,
          title: item.title,
          author: item.author,
          category: item.category,
          content: item.content,
          reply: item.reply,
          replied_at: item.replied_at,
          status: item.status,
          created_at: item.created_at,
          is_private: item.is_private
        });
      } else {
        return res.status(401).json({ verified: false, error: "비밀번호가 일치하지 않습니다." });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/community/qna/:id/reply", (req, res) => {
    try {
      const { id } = req.params;
      const { reply } = req.body;

      if (!reply || !reply.trim()) {
        return res.status(400).json({ error: "답변 내용을 입력해 주세요." });
      }

      db.prepare(`
        UPDATE community_qna 
        SET reply = ?, replied_at = CURRENT_TIMESTAMP, status = 'answered' 
        WHERE id = ?
      `).run(reply.trim(), id);

      res.json({ success: true, message: "답변이 정상 등록되었습니다." });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Admin endpoint: Get all community Q&A including content and contacts
  app.get("/api/admin/community/qna", (req, res) => {
    try {
      const list = db.prepare("SELECT * FROM community_qna ORDER BY id DESC").all();
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Admin endpoint: Delete community Q&A
  app.delete("/api/admin/community/qna/:id", (req, res) => {
    try {
      const { id } = req.params;
      db.prepare("DELETE FROM community_qna WHERE id = ?").run(id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Dedicated endpoint: Lookup reservations by phone number
  app.post("/api/reservations/lookup", (req, res) => {
    try {
      const { phone, name } = req.body;
      if (!phone || typeof phone !== 'string') {
        return res.status(400).json({ error: "조회할 연락처(전화번호)를 입력해 주세요." });
      }

      const cleanDigits = phone.replace(/[^0-9]/g, '');
      if (cleanDigits.length < 8) {
        return res.status(400).json({ error: "전화번호를 8자리 이상 정확히 입력해 주세요." });
      }

      // Query reservations matching cleaned phone digits
      const reservations = db.prepare(`
        SELECT r.*, p.title as program_title, p.category as program_category 
        FROM reservations r 
        LEFT JOIN programs p ON r.program_id = p.id 
        WHERE REPLACE(REPLACE(REPLACE(r.phone, '-', ''), ' ', ''), '.', '') = ?
        ORDER BY r.id DESC
      `).all(cleanDigits) as any[];

      // Optional name filtering if user provided name
      let filtered = reservations;
      if (name && typeof name === 'string' && name.trim()) {
        const cleanName = name.trim().toLowerCase();
        filtered = reservations.filter(r => r.name.toLowerCase().includes(cleanName));
      }

      // Also get notification logs for each reservation
      const resultsWithLogs = filtered.map(item => {
        const logs = db.prepare(`
          SELECT channel, template_title, status, created_at 
          FROM notification_logs 
          WHERE reservation_id = ? 
          ORDER BY id DESC
        `).all(item.id);
        return {
          ...item,
          logs
        };
      });

      res.json({
        success: true,
        count: resultsWithLogs.length,
        reservations: resultsWithLogs
      });
    } catch (err: any) {
      console.error("Reservation lookup error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // Dedicated endpoint: Cancel pending reservation by client with phone verification
  app.post("/api/reservations/:id/cancel-request", (req, res) => {
    try {
      const { id } = req.params;
      const { phone, reason } = req.body;
      if (!phone) {
        return res.status(400).json({ error: "본인 확인을 위한 연락처를 입력해 주세요." });
      }
      const cleanDigits = phone.replace(/[^0-9]/g, '');
      const reservation = db.prepare("SELECT * FROM reservations WHERE id = ?").get(id) as any;
      if (!reservation) {
        return res.status(404).json({ error: "예약 내역을 찾을 수 없습니다." });
      }
      const resPhoneDigits = reservation.phone.replace(/[^0-9]/g, '');
      if (resPhoneDigits !== cleanDigits) {
        return res.status(403).json({ error: "예약 접수 시 입력한 연락처와 일치하지 않습니다." });
      }
      if (reservation.status === 'cancelled') {
        return res.status(400).json({ error: "이미 취소 처리된 예약입니다." });
      }

      const cancelReason = reason ? `[내담자 취소요청] ${reason}` : '[내담자 온라인 취소요청]';
      const updatedNotes = reservation.admin_notes ? `${reservation.admin_notes} | ${cancelReason}` : cancelReason;

      db.prepare("UPDATE reservations SET status = 'cancelled', admin_notes = ? WHERE id = ?").run(updatedNotes, id);

      res.json({ success: true, message: "예약 취소 요청이 정상 처리되었습니다." });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Dedicated endpoint: Confirm reservation and send KakaoTalk notification
  app.post("/api/reservations/:id/confirm", async (req, res) => {
    try {
      const reservationId = req.params.id;
      const reservation = db.prepare(`
        SELECT r.*, p.title as program_title, p.category as program_category 
        FROM reservations r 
        LEFT JOIN programs p ON r.program_id = p.id 
        WHERE r.id = ?
      `).get(reservationId) as any;

      if (!reservation) {
        return res.status(404).json({ error: "예약 내역을 찾을 수 없습니다." });
      }

      // Update status to 'confirmed'
      db.prepare("UPDATE reservations SET status = 'confirmed' WHERE id = ?").run(reservationId);

      const programTitle = reservation.program_title 
        ? `[${reservation.program_category}] ${reservation.program_title}` 
        : "맞춤 심리상담";

      // Send KakaoTalk Confirmation Notification automatically
      const notificationResult = await sendReservationNotification({
        reservationId: Number(reservationId),
        recipientName: reservation.name,
        recipientPhone: reservation.phone,
        programTitle,
        preferredDate: reservation.preferred_date,
        preferredTime: reservation.preferred_time,
        type: 'CONFIRMED'
      });

      // Record in notification logs
      db.prepare(`
        INSERT INTO notification_logs 
        (reservation_id, recipient_name, recipient_phone, channel, template_title, message_content, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        reservationId,
        reservation.name,
        reservation.phone,
        notificationResult.channel,
        notificationResult.templateTitle,
        notificationResult.content,
        notificationResult.status
      );

      res.json({ 
        success: true, 
        status: 'confirmed',
        message: `예약이 성공적으로 확정되었습니다. 고객님(${reservation.phone})께 카카오톡 알림톡이 자동 발송되었습니다.`,
        notification: notificationResult 
      });
    } catch (err: any) {
      console.error("Failed to confirm reservation:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // Notification status and logs API
  app.get("/api/notifications/config", (req, res) => {
    try {
      const isConfigured = isNotificationGatewayConfigured();
      const adminPhoneRow = db.prepare("SELECT value FROM admin_settings WHERE key = 'admin_phone'").get() as any;
      const adminPhone = adminPhoneRow ? adminPhoneRow.value : '010-7322-5676';

      res.json({
        configured: isConfigured,
        channel: "카카오 알림톡 (SMS 자동 대체)",
        senderNumber: process.env.ALIMTALK_SENDER_NUMBER || "052-254-0230",
        adminPhone: adminPhone,
        adminPhoneFormatted: formatPhoneNumber(adminPhone),
        pfId: process.env.ALIMTALK_PFID || "@행복바람심리상담연구소",
        templateId: process.env.ALIMTALK_TEMPLATE_ID || "RESERVATION_CONFIRM_V1",
        adminTemplateId: process.env.ALIMTALK_ADMIN_TEMPLATE_ID || "ADMIN_NEW_RESERVATION_V1",
        mode: isConfigured ? "LIVE_GATEWAY" : "SIMULATED_PREVIEW"
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/notifications", (req, res) => {
    try {
      const logs = db.prepare(`
        SELECT * FROM notification_logs ORDER BY id DESC LIMIT 50
      `).all();
      res.json(logs);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/notifications/resend/:id", async (req, res) => {
    try {
      const reservationId = req.params.id;
      const reservation = db.prepare(`
        SELECT r.*, p.title as program_title, p.category as program_category 
        FROM reservations r 
        LEFT JOIN programs p ON r.program_id = p.id 
        WHERE r.id = ?
      `).get(reservationId) as any;

      if (!reservation) {
        return res.status(404).json({ error: "예약 정보를 찾을 수 없습니다." });
      }

      const programTitle = reservation.program_title 
        ? `[${reservation.program_category}] ${reservation.program_title}` 
        : "맞춤 심리상담";

      const notificationResult = await sendReservationNotification({
        reservationId: reservation.id,
        recipientName: reservation.name,
        recipientPhone: reservation.phone,
        programTitle,
        preferredDate: reservation.preferred_date,
        preferredTime: reservation.preferred_time
      });

      db.prepare(`
        INSERT INTO notification_logs 
        (reservation_id, recipient_name, recipient_phone, channel, template_title, message_content, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        reservation.id,
        reservation.name,
        reservation.phone,
        notificationResult.channel,
        notificationResult.templateTitle,
        notificationResult.content,
        notificationResult.status
      );

      res.json({ success: true, notification: notificationResult });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.patch("/api/reservations/:id", async (req, res) => {
    try {
      const reservationId = req.params.id;
      const current = db.prepare("SELECT * FROM reservations WHERE id = ?").get(reservationId) as any;
      if (!current) {
        return res.status(404).json({ error: "예약 내역을 찾을 수 없습니다." });
      }

      const {
        status = current.status,
        preferred_date = current.preferred_date,
        preferred_time = current.preferred_time,
        name = current.name,
        phone = current.phone,
        program_id = current.program_id,
        admin_notes = current.admin_notes,
        notify_client = false
      } = req.body;

      db.prepare(`
        UPDATE reservations 
        SET status = ?, preferred_date = ?, preferred_time = ?, name = ?, phone = ?, program_id = ?, admin_notes = ? 
        WHERE id = ?
      `).run(status, preferred_date, preferred_time, name, phone, program_id, admin_notes, reservationId);

      const isNewlyConfirmed = status === 'confirmed' && current.status !== 'confirmed';
      const shouldNotify = notify_client || isNewlyConfirmed;

      let notificationResult = null;
      if (shouldNotify) {
        let progTitle = "맞춤 심리상담";
        if (program_id) {
          const prog = db.prepare("SELECT title, category FROM programs WHERE id = ?").get(program_id) as any;
          if (prog) progTitle = `[${prog.category}] ${prog.title}`;
        }

        try {
          notificationResult = await sendReservationNotification({
            reservationId: Number(reservationId),
            recipientName: name,
            recipientPhone: phone,
            programTitle: isNewlyConfirmed ? progTitle : `${progTitle} (일정 변경 안내)`,
            preferredDate: preferred_date,
            preferredTime: preferred_time,
            type: 'CONFIRMED'
          });

          db.prepare(`
            INSERT INTO notification_logs 
            (reservation_id, recipient_name, recipient_phone, channel, template_title, message_content, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `).run(
            reservationId,
            name,
            phone,
            notificationResult.channel,
            notificationResult.templateTitle,
            notificationResult.content,
            notificationResult.status
          );
        } catch (e) {
          console.error("Failed to send notification on reservation patch:", e);
        }
      }

      res.json({ success: true, notification: notificationResult });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Admin manually creates appointment (phone/walk-in)
  app.post("/api/reservations/admin", async (req, res) => {
    try {
      const { name, phone, program_id, preferred_date, preferred_time, status = 'confirmed', admin_notes = '', notify_client = false } = req.body;
      const info = db.prepare(`
        INSERT INTO reservations (name, phone, program_id, preferred_date, preferred_time, status, admin_notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(name, phone, program_id, preferred_date, preferred_time, status, admin_notes);

      const reservationId = Number(info.lastInsertRowid);
      let notificationResult = null;

      if (notify_client) {
        let progTitle = "맞춤 심리상담";
        if (program_id) {
          const prog = db.prepare("SELECT title, category FROM programs WHERE id = ?").get(program_id) as any;
          if (prog) progTitle = `[${prog.category}] ${prog.title}`;
        }

        try {
          notificationResult = await sendReservationNotification({
            reservationId,
            recipientName: name,
            recipientPhone: phone,
            programTitle: progTitle,
            preferredDate: preferred_date,
            preferredTime: preferred_time
          });

          db.prepare(`
            INSERT INTO notification_logs 
            (reservation_id, recipient_name, recipient_phone, channel, template_title, message_content, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `).run(
            reservationId,
            name,
            phone,
            notificationResult.channel,
            notificationResult.templateTitle,
            notificationResult.content,
            notificationResult.status
          );
        } catch (e) {
          console.error("Failed to notify on admin reservation create:", e);
        }
      }

      res.json({ success: true, id: reservationId, notification: notificationResult });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Schedule Blocks (holiday/workshop/break times)
  app.get("/api/schedule-blocks", (req, res) => {
    try {
      const blocks = db.prepare("SELECT * FROM schedule_blocks ORDER BY block_date ASC, block_time ASC").all();
      res.json(blocks);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/schedule-blocks", (req, res) => {
    try {
      const { 
        block_date, 
        start_date, 
        end_date, 
        dates,
        days_of_week, 
        block_time, 
        block_times, 
        reason, 
        exclude_sundays 
      } = req.body;
      const blockReason = reason || "예약 마감";

      const timesToBlock: (string | null)[] = Array.isArray(block_times) && block_times.length > 0
        ? block_times
        : [block_time || null];

      let targetDates: string[] = [];

      // 1. Explicit dates array provided
      if (Array.isArray(dates) && dates.length > 0) {
        targetDates = Array.from(new Set(dates)).sort();
      }
      // 2. Period / Date Range Mode
      else if (start_date && end_date) {
        const start = new Date(start_date + "T00:00:00");
        const end = new Date(end_date + "T00:00:00");
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          return res.status(400).json({ error: "유효하지 않은 날짜 형식입니다." });
        }
        if (start > end) {
          return res.status(400).json({ error: "종료일은 시작일보다 빠를 수 없습니다." });
        }

        // Limit range to max 365 days to prevent excessive loops
        const diffDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        if (diffDays > 365) {
          return res.status(400).json({ error: "기간 설정은 최대 1년(365일)까지 가능합니다." });
        }

        const allowedDaysOfWeek: number[] | null = Array.isArray(days_of_week) && days_of_week.length > 0
          ? days_of_week.map(Number)
          : null;

        const cur = new Date(start);
        while (cur <= end) {
          const dayOfWeek = cur.getDay(); // 0 = Sunday
          const isSundayExcluded = (exclude_sundays !== false) && dayOfWeek === 0;

          if (!isSundayExcluded) {
            if (!allowedDaysOfWeek || allowedDaysOfWeek.includes(dayOfWeek)) {
              const y = cur.getFullYear();
              const m = String(cur.getMonth() + 1).padStart(2, "0");
              const d = String(cur.getDate()).padStart(2, "0");
              targetDates.push(`${y}-${m}-${d}`);
            }
          }
          cur.setDate(cur.getDate() + 1);
        }
      }
      // 3. Single Date Mode
      else if (block_date) {
        targetDates = [block_date];
      } else {
        return res.status(400).json({ error: "마감할 날짜 또는 기간을 지정해 주세요." });
      }

      if (targetDates.length === 0) {
        return res.status(400).json({ error: "조건에 해당하는 유효한 마감 대상 날짜가 없습니다." });
      }

      let insertedCount = 0;
      const insertStmt = db.prepare(`
        INSERT INTO schedule_blocks (block_date, block_time, reason)
        VALUES (?, ?, ?)
      `);
      const checkSlotStmt = db.prepare(`
        SELECT id FROM schedule_blocks WHERE block_date = ? AND block_time = ?
      `);
      const checkDayStmt = db.prepare(`
        SELECT id FROM schedule_blocks WHERE block_date = ? AND block_time IS NULL
      `);

      db.transaction(() => {
        for (const curDateStr of targetDates) {
          for (const timeVal of timesToBlock) {
            if (timeVal) {
              const dayBlocked = checkDayStmt.get(curDateStr);
              const slotBlocked = checkSlotStmt.get(curDateStr, timeVal);
              if (!dayBlocked && !slotBlocked) {
                insertStmt.run(curDateStr, timeVal, blockReason);
                insertedCount++;
              }
            } else {
              // Whole day block: clear individual slot blocks for this date and set full day block
              const dayBlocked = checkDayStmt.get(curDateStr);
              if (!dayBlocked) {
                db.prepare("DELETE FROM schedule_blocks WHERE block_date = ?").run(curDateStr);
                insertStmt.run(curDateStr, null, blockReason);
                insertedCount++;
              }
            }
          }
        }
      })();

      res.json({ success: true, count: insertedCount, days: targetDates.length, dates: targetDates });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Batch delete schedule blocks (Supports ID list, Date range, Target Dates list, Specific Time filter, and Weekday filter)
  app.post("/api/schedule-blocks/batch-delete", (req, res) => {
    try {
      const { ids, start_date, end_date, dates, block_times, days_of_week } = req.body;

      if (Array.isArray(ids) && ids.length > 0) {
        const placeholders = ids.map(() => "?").join(",");
        db.prepare(`DELETE FROM schedule_blocks WHERE id IN (${placeholders})`).run(...ids);
        return res.json({ success: true, deleted: ids.length });
      }

      // If explicit dates array is provided
      let targetDates: string[] = [];
      if (Array.isArray(dates) && dates.length > 0) {
        targetDates = Array.from(new Set(dates)).sort();
      } else if (start_date && end_date) {
        const start = new Date(start_date + "T00:00:00");
        const end = new Date(end_date + "T00:00:00");
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          return res.status(400).json({ error: "유효하지 않은 날짜 형식입니다." });
        }
        if (start > end) {
          return res.status(400).json({ error: "종료일은 시작일보다 빠를 수 없습니다." });
        }

        const allowedDaysOfWeek: number[] | null = Array.isArray(days_of_week) && days_of_week.length > 0
          ? days_of_week.map(Number)
          : null;

        const cur = new Date(start);
        while (cur <= end) {
          const dayOfWeek = cur.getDay();
          if (!allowedDaysOfWeek || allowedDaysOfWeek.includes(dayOfWeek)) {
            const y = cur.getFullYear();
            const m = String(cur.getMonth() + 1).padStart(2, "0");
            const d = String(cur.getDate()).padStart(2, "0");
            targetDates.push(`${y}-${m}-${d}`);
          }
          cur.setDate(cur.getDate() + 1);
        }
      }

      if (targetDates.length > 0) {
        let totalDeleted = 0;
        db.transaction(() => {
          for (const curDateStr of targetDates) {
            if (Array.isArray(block_times) && block_times.length > 0) {
              // 1. Delete specific time slot blocks matching the requested block_times
              for (const timeVal of block_times) {
                const res1 = db.prepare("DELETE FROM schedule_blocks WHERE block_date = ? AND block_time = ?").run(curDateStr, timeVal);
                totalDeleted += res1.changes;
              }

              // 2. If a whole day block existed, delete it and recreate blocks for remaining unselected slots
              const dayBlocked = db.prepare("SELECT * FROM schedule_blocks WHERE block_date = ? AND block_time IS NULL").get(curDateStr) as any;
              if (dayBlocked) {
                db.prepare("DELETE FROM schedule_blocks WHERE id = ?").run(dayBlocked.id);
                totalDeleted++;

                // Saturday operates: 09:00, 10:30, 14:00, 15:30 (19:00 is closed)
                const dateObj = new Date(curDateStr + "T00:00:00");
                const isSaturday = dateObj.getDay() === 6;
                const standardSlots = isSaturday 
                  ? ["09:00", "10:30", "14:00", "15:30"] 
                  : ["09:00", "10:30", "14:00", "15:30", "19:00"];

                for (const slot of standardSlots) {
                  if (!block_times.includes(slot)) {
                    db.prepare("INSERT INTO schedule_blocks (block_date, block_time, reason) VALUES (?, ?, ?)").run(curDateStr, slot, dayBlocked.reason || "예약 마감");
                  }
                }
              }
            } else {
              // Delete all blocks for this date (both whole-day and slot blocks)
              const res2 = db.prepare("DELETE FROM schedule_blocks WHERE block_date = ?").run(curDateStr);
              totalDeleted += res2.changes;
            }
          }
        })();
        return res.json({ success: true, deleted: totalDeleted, days: targetDates.length });
      }

      res.status(400).json({ error: "삭제할 대상 ID 또는 기간/날짜를 지정해 주세요." });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/schedule-blocks/toggle", (req, res) => {
    try {
      const { block_date, block_time, reason } = req.body;
      let existing: any = null;
      if (block_time) {
        existing = db.prepare("SELECT * FROM schedule_blocks WHERE block_date = ? AND block_time = ?").get(block_date, block_time);
        
        // If whole day block existed and we want to unblock this specific time slot
        if (!existing) {
          const wholeDay = db.prepare("SELECT * FROM schedule_blocks WHERE block_date = ? AND block_time IS NULL").get(block_date) as any;
          if (wholeDay) {
            // Remove whole day block and add blocks for all other slots EXCEPT this one
            db.transaction(() => {
              db.prepare("DELETE FROM schedule_blocks WHERE id = ?").run(wholeDay.id);
              const allSlots = ["09:00", "10:30", "14:00", "15:30", "19:00"];
              for (const slot of allSlots) {
                if (slot !== block_time) {
                  db.prepare("INSERT INTO schedule_blocks (block_date, block_time, reason) VALUES (?, ?, ?)").run(block_date, slot, wholeDay.reason || "예약 마감");
                }
              }
            })();
            return res.json({ success: true, action: "unblocked", id: wholeDay.id });
          }
        }
      } else {
        existing = db.prepare("SELECT * FROM schedule_blocks WHERE block_date = ? AND block_time IS NULL").get(block_date);
        // Also if individual slot blocks existed and toggle whole day is requested, clear all slot blocks
        if (!existing) {
          const individualSlots = db.prepare("SELECT count(*) as cnt FROM schedule_blocks WHERE block_date = ?").get(block_date) as any;
          if (individualSlots && individualSlots.cnt > 0) {
            db.prepare("DELETE FROM schedule_blocks WHERE block_date = ?").run(block_date);
            return res.json({ success: true, action: "unblocked", cleared_count: individualSlots.cnt });
          }
        }
      }

      if (existing) {
        db.prepare("DELETE FROM schedule_blocks WHERE id = ?").run(existing.id);
        res.json({ success: true, action: "unblocked", id: existing.id });
      } else {
        const info = db.prepare(`
          INSERT INTO schedule_blocks (block_date, block_time, reason)
          VALUES (?, ?, ?)
        `).run(block_date, block_time || null, reason || "예약 마감");
        res.json({ success: true, action: "blocked", id: info.lastInsertRowid });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Explicit Unblock endpoint for single slot, entire day, or by ID
  app.post("/api/schedule-blocks/unblock", (req, res) => {
    try {
      const { block_date, block_time, id, unblock_all_day } = req.body;

      // 1. If explicit ID is provided and no specific slot splitting requested
      if (id && !block_date && !block_time) {
        db.prepare("DELETE FROM schedule_blocks WHERE id = ?").run(id);
        return res.json({ success: true, action: "unblocked_by_id" });
      }

      if (!block_date) {
        if (id) {
          db.prepare("DELETE FROM schedule_blocks WHERE id = ?").run(id);
          return res.json({ success: true, action: "unblocked_by_id" });
        }
        return res.status(400).json({ error: "block_date가 필요합니다." });
      }

      // 2. If unblock_all_day or block_time is null/empty: unblock the whole day (remove ALL blocks on this date)
      if (unblock_all_day || !block_time) {
        const result = db.prepare("DELETE FROM schedule_blocks WHERE block_date = ?").run(block_date);
        return res.json({ success: true, action: "unblocked_all", deleted: result.changes });
      }

      // 3. Unblock a specific slot (e.g. "09:00", "14:00") on block_date
      let deleted = 0;
      db.transaction(() => {
        // A. Delete any direct slot block on that date and time
        const res1 = db.prepare("DELETE FROM schedule_blocks WHERE block_date = ? AND block_time = ?").run(block_date, block_time);
        deleted += res1.changes;

        // B. If a whole-day block (block_time IS NULL) exists for this date, remove it and insert blocks for the remaining 4 slots
        const wholeDay = db.prepare("SELECT * FROM schedule_blocks WHERE block_date = ? AND block_time IS NULL").get(block_date) as any;
        if (wholeDay) {
          db.prepare("DELETE FROM schedule_blocks WHERE id = ?").run(wholeDay.id);
          deleted++;
          const allSlots = ["09:00", "10:30", "14:00", "15:30", "19:00"];
          for (const slot of allSlots) {
            if (slot !== block_time) {
              db.prepare("INSERT INTO schedule_blocks (block_date, block_time, reason) VALUES (?, ?, ?)").run(
                block_date,
                slot,
                wholeDay.reason || "예약 마감"
              );
            }
          }
        }
      })();

      res.json({ success: true, action: "unblocked_slot", deleted });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/schedule-blocks/:id", (req, res) => {
    try {
      db.prepare("DELETE FROM schedule_blocks WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/reservations/:id", (req, res) => {
    try {
      db.prepare("DELETE FROM reservations WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Helper function to send recovery verification email or log to notifications
  async function sendAdminRecoveryEmail(toEmail: string, verificationCode: string) {
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: `"${process.env.SMTP_FROM_NAME || '행복바람심리상담연구소'}" <${process.env.SMTP_USER}>`,
          to: toEmail,
          subject: '[행복바람심리상담연구소] 관리자 비밀번호 확인 인증코드',
          text: `안녕하세요, 행복바람심리상담연구소 관리자님.\n\n요청하신 관리자 비밀번호 확인 인증코드입니다.\n\n■ 인증코드: ${verificationCode}\n\n15분 이내에 관리자 페이지에서 입력해 주시기 바랍니다.`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 28px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff;">
              <h2 style="color: #4a3e3d; font-size: 20px; margin-bottom: 8px;">행복바람심리상담연구소</h2>
              <p style="color: #64748b; font-size: 14px; margin-bottom: 24px;">관리자 전용 비밀번호 확인 및 본인 인증 안내</p>
              
              <p style="color: #334155; font-size: 14px; line-height: 1.6;">안녕하세요. 요청하신 관리자 비밀번호 확인을 위한 6자리 인증코드입니다.</p>
              
              <div style="background-color: #f7f9f8; border: 1.5px dashed #6B8E7B; border-radius: 14px; padding: 22px; text-align: center; margin: 24px 0;">
                <div style="font-size: 12px; font-weight: bold; color: #6B8E7B; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">Security Verification Code</div>
                <div style="font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #4a3e3d; font-family: monospace;">${verificationCode}</div>
                <div style="font-size: 12px; color: #94a3b8; margin-top: 8px;">본 코드는 발송 시점으로부터 15분간 유효합니다.</div>
              </div>

              <p style="font-size: 12px; color: #94a3b8; line-height: 1.5;">본 메일은 행복바람 웹사이트 관리자 로그인 화면에서 '비밀번호 찾기'를 요청하여 발송되었습니다. 본인이 요청하지 않은 경우 즉시 관리자 비밀번호를 변경해 주세요.</p>
            </div>
          `
        });
      } catch (err: any) {
        console.error("Failed to send recovery email via SMTP:", err);
      }
    }

    // Record in notification_logs table as EMAIL log
    try {
      db.prepare(`
        INSERT INTO notification_logs (
          recipient_name, recipient_phone, channel, template_title, content, status
        ) VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        '관리자',
        toEmail,
        'EMAIL',
        '[행복바람] 관리자 비밀번호 확인 인증코드',
        `[행복바람심리상담연구소] 관리자 비밀번호 확인 인증코드: ${verificationCode} (15분간 유효)`,
        'SUCCESS'
      );
    } catch (logErr) {
      console.error("Failed to log recovery email:", logErr);
    }
  }

  // Admin authentication and password management
  app.get("/api/admin/status", (req, res) => {
    try {
      const row = db.prepare("SELECT value FROM admin_settings WHERE key = 'is_default_password'").get() as any;
      const isDefault = row ? row.value === '1' : true;
      res.json({ isDefaultPassword: isDefault });
    } catch (err: any) {
      res.json({ isDefaultPassword: true });
    }
  });

  app.post("/api/admin/login", (req, res) => {
    try {
      const { password } = req.body;
      const row = db.prepare("SELECT value FROM admin_settings WHERE key = 'admin_password'").get() as any;
      const currentPw = row ? row.value : '3485';

      if (password && password.trim() === currentPw) {
        res.json({ success: true });
      } else {
        res.status(401).json({ success: false, error: '비밀번호가 일치하지 않습니다.' });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/change-password", (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!newPassword || newPassword.trim().length < 4) {
        return res.status(400).json({ success: false, error: '새 비밀번호는 최소 4자 이상이어야 합니다.' });
      }

      const row = db.prepare("SELECT value FROM admin_settings WHERE key = 'admin_password'").get() as any;
      const currentPw = row ? row.value : '3485';

      if (currentPassword !== currentPw) {
        return res.status(400).json({ success: false, error: '현재 비밀번호가 올바르지 않습니다.' });
      }

      db.prepare("UPDATE admin_settings SET value = ? WHERE key = 'admin_password'").run(newPassword.trim());
      db.prepare("UPDATE admin_settings SET value = '0' WHERE key = 'is_default_password'").run();

      res.json({ success: true, message: '비밀번호가 성공적으로 변경되었습니다.' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Password Recovery via Registered Admin Email
  app.post("/api/admin/forgot-password/request", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ success: false, error: '이메일 주소를 입력해 주세요.' });
      }

      const cleanInputEmail = email.trim().toLowerCase();

      // Check registered admin emails
      const row = db.prepare("SELECT value FROM admin_settings WHERE key = 'admin_email'").get() as any;
      const registeredEmailsStr = row ? row.value : 'hahm1123@gmail.com, mikypa@naver.com';
      const registeredList = registeredEmailsStr.split(',').map((e: string) => e.trim().toLowerCase());

      const isMatch = registeredList.includes(cleanInputEmail);
      if (!isMatch) {
        return res.status(400).json({ 
          success: false, 
          error: '등록된 관리자 이메일과 일치하지 않습니다. 연구소에 등록된 관리자 이메일을 입력해 주세요.' 
        });
      }

      // Generate 6-digit random code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

      // Store in DB
      db.prepare("INSERT INTO admin_recovery_codes (email, code, expires_at) VALUES (?, ?, ?)").run(cleanInputEmail, code, expiresAt);

      // Send email & log
      await sendAdminRecoveryEmail(cleanInputEmail, code);

      // Mask email for display
      const parts = cleanInputEmail.split('@');
      const maskedUser = parts[0].length > 3 ? `${parts[0].slice(0, 2)}***${parts[0].slice(-1)}` : `${parts[0].slice(0, 1)}**`;
      const maskedEmail = `${maskedUser}@${parts[1]}`;

      res.json({
        success: true,
        email: maskedEmail,
        message: '등록된 관리자 이메일로 6자리 인증코드가 전송되었습니다.',
        // Dev convenience if SMTP is not set
        devCode: (!process.env.SMTP_HOST || process.env.NODE_ENV !== 'production') ? code : undefined
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post("/api/admin/forgot-password/verify", (req, res) => {
    try {
      const { email, code } = req.body;
      if (!email || !code) {
        return res.status(400).json({ success: false, error: '이메일과 인증코드를 모두 입력해 주세요.' });
      }

      const cleanEmail = email.trim().toLowerCase();
      const cleanCode = code.trim();

      const record = db.prepare(`
        SELECT * FROM admin_recovery_codes 
        WHERE LOWER(email) = ? AND code = ? 
        ORDER BY id DESC LIMIT 1
      `).get(cleanEmail, cleanCode) as any;

      if (!record) {
        return res.status(400).json({ success: false, error: '인증코드가 올바르지 않습니다.' });
      }

      const isExpired = new Date(record.expires_at).getTime() < Date.now();
      if (isExpired) {
        return res.status(400).json({ success: false, error: '인증코드 유효 시간(15분)이 만료되었습니다. 다시 요청해 주세요.' });
      }

      // Retrieve current admin password
      const pwRow = db.prepare("SELECT value FROM admin_settings WHERE key = 'admin_password'").get() as any;
      const currentPw = pwRow ? pwRow.value : '3485';

      res.json({
        success: true,
        password: currentPw,
        message: '관리자 인증이 완료되었습니다.'
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post("/api/admin/forgot-password/reset", (req, res) => {
    try {
      const { email, code, newPassword } = req.body;
      if (!email || !code || !newPassword || newPassword.trim().length < 4) {
        return res.status(400).json({ success: false, error: '유효한 인증코드와 4자 이상의 새 비밀번호를 입력해 주세요.' });
      }

      const cleanEmail = email.trim().toLowerCase();
      const cleanCode = code.trim();

      const record = db.prepare(`
        SELECT * FROM admin_recovery_codes 
        WHERE LOWER(email) = ? AND code = ? 
        ORDER BY id DESC LIMIT 1
      `).get(cleanEmail, cleanCode) as any;

      if (!record || new Date(record.expires_at).getTime() < Date.now()) {
        return res.status(400).json({ success: false, error: '인증코드가 올바르지 않거나 만료되었습니다.' });
      }

      // Update password
      db.prepare("UPDATE admin_settings SET value = ? WHERE key = 'admin_password'").run(newPassword.trim());
      db.prepare("UPDATE admin_settings SET value = '0' WHERE key = 'is_default_password'").run();

      // Clean up used recovery codes for this email
      db.prepare("DELETE FROM admin_recovery_codes WHERE LOWER(email) = ?").run(cleanEmail);

      res.json({
        success: true,
        message: '비밀번호가 성공적으로 재설정되었습니다.'
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get("/api/admin/registered-email", (req, res) => {
    try {
      const row = db.prepare("SELECT value FROM admin_settings WHERE key = 'admin_email'").get() as any;
      const emails = row ? row.value : 'hahm1123@gmail.com, mikypa@naver.com';
      res.json({ email: emails });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/registered-email", (req, res) => {
    try {
      const { email } = req.body;
      if (!email || typeof email !== 'string' || !email.includes('@')) {
        return res.status(400).json({ success: false, error: '유효한 이메일 주소를 입력해 주세요.' });
      }
      db.prepare("INSERT OR REPLACE INTO admin_settings (key, value) VALUES ('admin_email', ?)").run(email.trim());
      res.json({ success: true, message: '관리자 이메일이 성공적으로 저장되었습니다.' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Registered Administrator Phone Management for Kakao Alimtalk
  app.get("/api/admin/registered-phone", (req, res) => {
    try {
      const row = db.prepare("SELECT value FROM admin_settings WHERE key = 'admin_phone'").get() as any;
      const phone = row ? row.value : '010-7322-5676';
      res.json({ phone, formattedPhone: formatPhoneNumber(phone) });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/registered-phone", (req, res) => {
    try {
      const { phone } = req.body;
      if (!phone || typeof phone !== 'string' || !phone.trim()) {
        return res.status(400).json({ success: false, error: '관리자 모바일 번호를 입력해 주세요.' });
      }
      const cleanPhone = phone.trim();
      db.prepare("INSERT OR REPLACE INTO admin_settings (key, value) VALUES ('admin_phone', ?)").run(cleanPhone);
      res.json({ 
        success: true, 
        phone: cleanPhone, 
        formattedPhone: formatPhoneNumber(cleanPhone), 
        message: '관리자 카카오 알림톡 수신 모바일 번호가 저장되었습니다.' 
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post("/api/admin/notifications/test-admin", async (req, res) => {
    try {
      const row = db.prepare("SELECT value FROM admin_settings WHERE key = 'admin_phone'").get() as any;
      const targetPhone = req.body.phone?.trim() || (row ? row.value : '010-7322-5676');
      const result = await sendAdminTestAlimtalk(targetPhone);

      db.prepare(`
        INSERT INTO notification_logs 
        (reservation_id, recipient_name, recipient_phone, channel, template_title, message_content, status) 
        VALUES (NULL, ?, ?, ?, ?, ?, ?)
      `).run(
        `관리자 (${formatPhoneNumber(targetPhone)})`,
        targetPhone,
        result.channel,
        result.templateTitle,
        result.content,
        result.status
      );

      res.json({ 
        success: true, 
        notification: result, 
        message: `관리자 모바일(${formatPhoneNumber(targetPhone)})로 알림톡 테스트가 발송되었습니다.` 
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get("/api/self-diagnosis", (req, res) => {
    try {
      const records = db.prepare("SELECT * FROM self_diagnosis ORDER BY created_at DESC LIMIT 50").all();
      res.json(records);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/self-diagnosis", (req, res) => {
    const { nickname, test_type, score, result } = req.body;
    const info = db.prepare("INSERT INTO self_diagnosis (nickname, test_type, score, result) VALUES (?, ?, ?, ?)").run(nickname, test_type, score, result);
    res.json({ id: info.lastInsertRowid, status: "success" });
  });

  app.get("/standalone", (req, res) => {
    const standalonePath = fs.existsSync(path.join(rootDir, "standalone.html"))
      ? path.join(rootDir, "standalone.html")
      : path.join(__dirname, "standalone.html");
    if (fs.existsSync(standalonePath)) {
      res.sendFile(standalonePath);
    } else {
      res.redirect("/");
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = fs.existsSync(path.join(__dirname, "index.html"))
      ? __dirname
      : path.join(rootDir, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
