import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { 
  sendReservationNotification, 
  isNotificationGatewayConfigured, 
  formatPhoneNumber 
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
`);

// Safe migration for admin_notes column in reservations table
try {
  db.exec("ALTER TABLE reservations ADD COLUMN admin_notes TEXT");
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

// Seed data
const existingCounselor = db.prepare("SELECT * FROM counselors WHERE name = ?").get("박미경") as any;
if (!existingCounselor) {
  const insertCounselor = db.prepare("INSERT INTO counselors (name, title, education, certifications, style, tags, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)");
  insertCounselor.run(
    "박미경", 
    "상담 소장", 
    "교육학 박사(상담 심리 및 교육 심리 전공)", 
    "한국상담학회 슈퍼바이저\n한국상담학회 전문상담사 1급\n여성가족부 청소년상담사 1급\n한국상담심리학회 정회원\n한국부부가족상담학회 정회원", 
    "개인 상담/기업 상담(EAP)/집단 상담/심리 검사/교육 전문", 
    "#개인상담 #기업상담 #집단상담 #심리검사 #교육전문", 
    "/images/counselor_park.jpg"
  );
} else {
  db.prepare("UPDATE counselors SET image_url = ? WHERE name = ?").run("/images/counselor_park.jpg", "박미경");
}

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
    const counselors = db.prepare("SELECT * FROM counselors").all();
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
        SELECT r.*, p.title as program_title 
        FROM reservations r 
        LEFT JOIN programs p ON r.program_id = p.id 
        ORDER BY r.id DESC
      `).all();
      res.json(reservations);
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

      // Initial Receipt Log (simulated/preview receipt notification)
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
        notification: notificationResult
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

      // Attempt receipt notification log
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
        notification: notificationResult
      });
    } catch (err: any) {
      console.error("Quick reservation error:", err);
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
      res.json({
        configured: isConfigured,
        channel: "카카오 알림톡 (SMS 자동 대체)",
        senderNumber: process.env.ALIMTALK_SENDER_NUMBER || "052-254-0230",
        pfId: process.env.ALIMTALK_PFID || "@행복바람심리상담연구소",
        templateId: process.env.ALIMTALK_TEMPLATE_ID || "RESERVATION_CONFIRM_V1",
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
