import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

  CREATE TABLE IF NOT EXISTS self_diagnosis (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nickname TEXT NOT NULL,
    test_type TEXT NOT NULL,
    score INTEGER,
    result TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed data
db.exec("DELETE FROM counselors");
const insertCounselor = db.prepare("INSERT INTO counselors (name, title, education, certifications, style, tags, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)");
insertCounselor.run(
  "박미경", 
  "상담 소장", 
  "교육학 박사(상담 심리 및 교육 심리 전공)", 
  "한국상담학회 슈퍼바이저\n한국상담학회 전문상담사 1급\n여성가족부 청소년상담사 1급\n한국상담심리학회 정회원\n한국부부가족상담학회 정회원", 
  "개인 상담/기업 상담(EAP)/집단 상담/심리 검사/교육 전문", 
  "#개인상담 #기업상담 #집단상담 #심리검사 #교육전문", 
  "https://images.unsplash.com/photo-1559839734-2b71f1536783?q=80&w=600&auto=format&fit=crop"
);

// Seed data
db.exec("DELETE FROM programs");
const insertProgram = db.prepare("INSERT INTO programs (category, title, description, tags) VALUES (?, ?, ?, ?)");
insertProgram.run("개인상담", "청소년 및 성인 상담", "우울, 불안, 스트레스, 대인관계 등 개인의 심리적 성장을 돕는 1:1 맞춤형 상담입니다.", "#청소년 #성인 #심리성장");
insertProgram.run("부부상담", "부부 및 가족 관계 개선", "부부 갈등 해결, 의사소통 개선 및 관계 회복을 위한 전문적인 심리 지원을 제공합니다.", "#부부갈등 #관계회복 #의사소통");
insertProgram.run("심리검사", "종합 심리검사 및 해석", "객관적인 검사를 통해 자기 이해를 돕고 현재의 심리적 상태를 정밀하게 파악합니다.", "#자기이해 #정밀진단 #성격검사");
insertProgram.run("기업상담", "EAP (근로자 지원 프로그램)", "직장 내 스트레스 관리 및 조직 적응을 위한 임직원 맞춤형 상담 서비스를 제공합니다.", "#직장스트레스 #조직적응 #EAP");
insertProgram.run("집단/교육", "집단상담 및 심리교육", "특정 주제를 가진 소그룹 상담과 마음 건강을 위한 다양한 교육 프로그램을 운영합니다.", "#집단상담 #심리교육 #워크숍");

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/counselors", (req, res) => {
    const counselors = db.prepare("SELECT * FROM counselors").all();
    res.json(counselors);
  });

  app.get("/api/programs", (req, res) => {
    const programs = db.prepare("SELECT * FROM programs").all();
    res.json(programs);
  });

  app.post("/api/reservations", (req, res) => {
    const { name, phone, program_id, preferred_date, preferred_time } = req.body;
    const info = db.prepare("INSERT INTO reservations (name, phone, program_id, preferred_date, preferred_time) VALUES (?, ?, ?, ?, ?)").run(name, phone, program_id, preferred_date, preferred_time);
    res.json({ id: info.lastInsertRowid, status: "success" });
  });

  app.post("/api/self-diagnosis", (req, res) => {
    const { nickname, test_type, score, result } = req.body;
    const info = db.prepare("INSERT INTO self_diagnosis (nickname, test_type, score, result) VALUES (?, ?, ?, ?)").run(nickname, test_type, score, result);
    res.json({ id: info.lastInsertRowid, status: "success" });
  });

  app.get("/standalone", (req, res) => {
    res.sendFile(path.join(__dirname, "standalone.html"));
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
