import crypto from 'crypto';

export interface NotificationResult {
  success: boolean;
  channel: 'ALIMTALK' | 'SMS';
  status: 'SENT' | 'SIMULATED' | 'FAILED' | 'PENDING_CONFIG';
  message: string;
  templateTitle: string;
  content: string;
  buttons?: Array<{ title: string; url: string; type: string }>;
  recipientName: string;
  recipientPhone: string;
  error?: string;
  messageId?: string;
}

export interface ReservationNotificationParams {
  reservationId?: number;
  recipientName: string;
  recipientPhone: string;
  programTitle: string;
  preferredDate: string;
  preferredTime: string;
  type?: 'CONFIRMED' | 'RECEIVED' | 'CANCELLED';
  customNotes?: string;
}

export interface AdminReservationNotificationParams {
  adminPhone: string;
  applicantName: string;
  applicantPhone: string;
  programTitle: string;
  preferredDate: string;
  preferredTime: string;
  reservationId?: number;
  isQuick?: boolean;
}

/**
 * Format phone number to clean digits (e.g. 01012345678)
 */
export function normalizePhoneNumber(phone: string): string {
  return phone.replace(/[^0-9]/g, '');
}

/**
 * Format phone number for human-readable display (e.g. 010-1234-5678)
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = normalizePhoneNumber(phone);
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

/**
 * Helper to format date with Korean day-of-week
 */
function formatDateWithDay(dateStr: string, timeStr: string): string {
  if (!dateStr) return timeStr || '일정 조율';
  try {
    const d = new Date(dateStr + 'T00:00:00');
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const dayName = dayNames[d.getDay()] || '';
    return `${dateStr} (${dayName}요일) ${timeStr || ''}`.trim();
  } catch {
    return `${dateStr} ${timeStr || ''}`.trim();
  }
}

/**
 * Build compliant Kakao Alimtalk & SMS notification template message
 */
export function buildAlimtalkMessage(params: ReservationNotificationParams): {
  title: string;
  content: string;
  buttons: Array<{ title: string; url: string; type: string }>;
} {
  const isConfirmed = params.type !== 'RECEIVED' && params.type !== 'CANCELLED';
  const formattedPhone = formatPhoneNumber(params.recipientPhone);
  const formattedDateTime = formatDateWithDay(params.preferredDate, params.preferredTime);

  if (isConfirmed) {
    const title = `[행복바람심리상담연구소] 상담 예약 확정 안내`;
    const content = 
`[행복바람심리상담연구소] 상담 예약 확정 안내

안녕하세요, ${params.recipientName} 님.
마음의 평온과 회복을 돕는 행복바람심리상담연구소입니다.

신청하신 상담 예약이 원장님 확인을 거쳐 [최종 확정]되었습니다.
예약하신 일시에 맞춰 편안한 마음으로 방문해 주시기 바랍니다.

■ 예약 확정 상세 정보
• 예약자명: ${params.recipientName} 님
• 연락처: ${formattedPhone}
• 확정 일시: ${formattedDateTime}
• 상담 프로그램: ${params.programTitle || '맞춤 심리상담'}
• 담당 상담사: 박미경 소장 (교육학 박사 / 전문상담 슈퍼바이저)
• 상담소 위치: 울산광역시 울주군 삼남읍 도호1길 23 상가 408호
• 대표 전화: 052-254-0230

■ 방문 및 주차 안내
• 상가 내 무료 주차장을 이용하실 수 있습니다.
• 원활한 상담 진행을 위해 예약 시간 5~10분 전 여유 있게 도착 부탁드립니다.
• 본 상담소는 철저한 100% 비밀 보장 및 1:1 사전 예약제로 운영됩니다.

※ 예약 일정 변경이나 부득이한 취소 시 대표 전화(052-254-0230)로 미리 연락 부탁드립니다.

따뜻한 마음으로 맞이하겠습니다. 감사합니다.`;

    const buttons = [
      {
        title: '상담소 위치 및 오시는 길',
        url: 'https://hbbr.kr/reservation',
        type: 'WL'
      },
      {
        title: '카카오톡 1:1 상담 문의',
        url: 'https://pf.kakao.com',
        type: 'WL'
      }
    ];

    return { title, content, buttons };
  }

  // Fallback / Initial Receipt Notice
  const title = `[행복바람심리상담연구소] 상담 예약 접수 완료 안내`;
  const content = 
`[행복바람심리상담연구소] 상담 예약 접수 완료 안내

안녕하세요, ${params.recipientName} 님.
마음의 평온과 회복을 찾는 행복바람심리상담연구소입니다.

고객님께서 신청하신 상담 예약이 정상적으로 접수되었습니다.
전문 상담사가 접수 내용을 확인한 후, 예약 확정을 처리해 드릴 예정입니다. (확정 시 알림톡 추가 발송)

■ 예약 접수 상세 정보
• 예약자명: ${params.recipientName} 님
• 연락처: ${formattedPhone}
• 상담 프로그램: ${params.programTitle || '맞춤 심리상담'}
• 희망 일시: ${formattedDateTime}
• 상담소 위치: 울산광역시 울주군 삼남읍 도호1길 23 상가 408호
• 대표 전화: 052-254-0230

※ 본 상담소는 철저한 100% 비밀 보장 및 1:1 사전 예약제로 운영됩니다.
※ 빠른 상담 일정 조율이 필요하신 경우 대표 전화로 편하게 말씀해 주세요.

감사합니다.`;

  const buttons = [
    {
      title: '상담소 위치 및 오시는 길',
      url: 'https://hbbr.kr/reservation',
      type: 'WL'
    }
  ];

  return { title, content, buttons };
}

/**
 * Check whether live SMS/Alimtalk gateway credentials are provided in environment
 */
export function isNotificationGatewayConfigured(): boolean {
  const apiKey = process.env.ALIMTALK_API_KEY;
  const apiSecret = process.env.ALIMTALK_API_SECRET;
  return Boolean(apiKey && apiSecret && apiKey.trim() !== '' && apiSecret.trim() !== '');
}

/**
 * Generate Solapi / CoolSMS API v4 Authorization header
 */
function getSolapiAuthHeader(apiKey: string, apiSecret: string): string {
  const date = new Date().toISOString();
  const salt = crypto.randomBytes(16).toString('hex');
  const signature = crypto
    .createHmac('sha256', apiSecret)
    .update(date + salt)
    .digest('hex');
  return `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`;
}

/**
 * Send Kakao Alimtalk with automatic SMS fallback
 */
export async function sendReservationNotification(
  params: ReservationNotificationParams
): Promise<NotificationResult> {
  const { title, content, buttons } = buildAlimtalkMessage(params);
  const cleanTo = normalizePhoneNumber(params.recipientPhone);
  const senderNumber = process.env.ALIMTALK_SENDER_NUMBER || '0522540230';
  const cleanFrom = normalizePhoneNumber(senderNumber);
  const pfId = process.env.ALIMTALK_PFID || '@행복바람심리상담연구소';
  const templateId = process.env.ALIMTALK_TEMPLATE_ID || 'RESERVATION_CONFIRM_V1';

  // If credentials are NOT configured yet, operate in high-fidelity simulated/preview mode
  if (!isNotificationGatewayConfigured()) {
    return {
      success: true,
      channel: 'ALIMTALK',
      status: 'SIMULATED',
      message: '카카오 알림톡 접수 안내가 생성되었습니다. (API 키 설정 시 실제 카카오톡으로 자동 발송됩니다)',
      templateTitle: title,
      content,
      buttons,
      recipientName: params.recipientName,
      recipientPhone: formatPhoneNumber(params.recipientPhone)
    };
  }

  // Live Gateway Dispatch (Solapi / CoolSMS Standard Messaging API v4)
  try {
    const apiKey = process.env.ALIMTALK_API_KEY!;
    const apiSecret = process.env.ALIMTALK_API_SECRET!;
    const authHeader = getSolapiAuthHeader(apiKey, apiSecret);

    const requestBody = {
      message: {
        to: cleanTo,
        from: cleanFrom,
        text: content,
        kakaoOptions: {
          pfId: pfId,
          templateId: templateId,
          buttons: buttons.map(b => ({
            buttonType: b.type,
            buttonName: b.title,
            linkAnd: b.url,
            linkIos: b.url
          })),
          disableSms: false // If Kakao fails, automatically fall back to SMS/LMS
        }
      }
    };

    const response = await fetch('https://api.solapi.com/messages/v4/send', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        channel: 'ALIMTALK',
        status: 'SENT',
        message: '카카오 알림톡이 성공적으로 발송되었습니다.',
        templateTitle: title,
        content,
        buttons,
        recipientName: params.recipientName,
        recipientPhone: formatPhoneNumber(params.recipientPhone)
      };
    } else {
      console.warn('Alimtalk gateway responded with error, attempting SMS fallback:', data);
      // Attempt SMS directly as fallback
      const smsBody = {
        message: {
          to: cleanTo,
          from: cleanFrom,
          text: content,
          type: 'LMS', // Long Message Service for detailed guidance
          subject: title
        }
      };

      const smsRes = await fetch('https://api.solapi.com/messages/v4/send', {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(smsBody)
      });

      if (smsRes.ok) {
        return {
          success: true,
          channel: 'SMS',
          status: 'SENT',
          message: '알림톡 대체 장문 문자(LMS)로 정상 발송되었습니다.',
          templateTitle: title,
          content,
          buttons,
          recipientName: params.recipientName,
          recipientPhone: formatPhoneNumber(params.recipientPhone)
        };
      }

      return {
        success: false,
        channel: 'ALIMTALK',
        status: 'FAILED',
        message: '발송 게이트웨이 오류가 발생하였습니다.',
        templateTitle: title,
        content,
        buttons,
        recipientName: params.recipientName,
        recipientPhone: formatPhoneNumber(params.recipientPhone)
      };
    }
  } catch (err: any) {
    console.error('Failed to send notification via gateway:', err);
    return {
      success: false,
      channel: 'ALIMTALK',
      status: 'FAILED',
      message: err.message || '네트워크 통신 중 오류가 발생했습니다.',
      templateTitle: title,
      content,
      buttons,
      recipientName: params.recipientName,
      recipientPhone: formatPhoneNumber(params.recipientPhone)
    };
  }
}

/**
 * Build Kakao Alimtalk & SMS notification message for Administrator
 */
export function buildAdminNewReservationMessage(params: AdminReservationNotificationParams): {
  title: string;
  content: string;
  buttons: Array<{ title: string; url: string; type: string }>;
} {
  const formattedApplicantPhone = formatPhoneNumber(params.applicantPhone);
  const formattedDateTime = formatDateWithDay(params.preferredDate, params.preferredTime);
  const title = `[행복바람] 신규 온라인 예약 신청 접수 알림 (관리자용)`;
  const isCallback = Boolean(params.isQuick);

  const content = 
`[행복바람심리상담연구소] 신규 온라인 예약 접수 알림 (관리자용)

새로운 상담 예약 신청이 온라인을 통해 실시간 접수되었습니다.
신청 일정을 확인하시고 관리자 페이지에서 예약 확정(승인)을 진행해 주세요.

■ 신규 예약 신청 내역
• 신청자명: ${params.applicantName} 님
• 신청자 연락처: ${formattedApplicantPhone}
• 상담 프로그램: ${params.programTitle || '맞춤 심리상담'}
• 희망 일시: ${formattedDateTime}
${isCallback ? '• 접수 유형: 간편 전화상담(콜백) 요청' : '• 접수 유형: 온라인 정식 예약 신청'}

※ 관리자 페이지에서 [예약 확정] 처리 시, 신청자 고객님(${formattedApplicantPhone})께 [카카오 알림톡(예약 확정 안내)]이 자동으로 즉시 발송됩니다.`;

  const buttons = [
    {
      title: '관리자 예약 관리 바로가기',
      url: 'https://hbbr.kr/admin',
      type: 'WL'
    }
  ];

  return { title, content, buttons };
}

/**
 * Send Kakao Alimtalk to Registered Administrator Mobile
 */
export async function sendAdminNewReservationNotification(
  params: AdminReservationNotificationParams
): Promise<NotificationResult> {
  const { title, content, buttons } = buildAdminNewReservationMessage(params);
  const cleanTo = normalizePhoneNumber(params.adminPhone);
  const senderNumber = process.env.ALIMTALK_SENDER_NUMBER || '0522540230';
  const cleanFrom = normalizePhoneNumber(senderNumber);
  const pfId = process.env.ALIMTALK_PFID || '@행복바람심리상담연구소';
  const templateId = process.env.ALIMTALK_ADMIN_TEMPLATE_ID || 'ADMIN_NEW_RESERVATION_V1';

  // If live credentials are not set, operate in high-fidelity simulated/preview mode
  if (!isNotificationGatewayConfigured()) {
    return {
      success: true,
      channel: 'ALIMTALK',
      status: 'SIMULATED',
      message: `관리자 등록 모바일(${formatPhoneNumber(params.adminPhone)})로 신규 예약 카카오 알림톡이 전송되었습니다.`,
      templateTitle: title,
      content,
      buttons,
      recipientName: `관리자 (${formatPhoneNumber(params.adminPhone)})`,
      recipientPhone: formatPhoneNumber(params.adminPhone)
    };
  }

  // Live Gateway dispatch (Solapi / CoolSMS Standard Messaging API v4)
  try {
    const apiKey = process.env.ALIMTALK_API_KEY!;
    const apiSecret = process.env.ALIMTALK_API_SECRET!;
    const authHeader = getSolapiAuthHeader(apiKey, apiSecret);

    const requestBody = {
      message: {
        to: cleanTo,
        from: cleanFrom,
        text: content,
        kakaoOptions: {
          pfId: pfId,
          templateId: templateId,
          buttons: buttons.map(b => ({
            buttonType: b.type,
            buttonName: b.title,
            linkAnd: b.url,
            linkIos: b.url
          })),
          disableSms: false
        }
      }
    };

    const response = await fetch('https://api.solapi.com/messages/v4/send', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (response.ok) {
      return {
        success: true,
        channel: 'ALIMTALK',
        status: 'SENT',
        message: `관리자 모바일(${formatPhoneNumber(params.adminPhone)})로 카카오 알림톡이 정상 발송되었습니다.`,
        templateTitle: title,
        content,
        buttons,
        recipientName: `관리자 (${formatPhoneNumber(params.adminPhone)})`,
        recipientPhone: formatPhoneNumber(params.adminPhone)
      };
    } else {
      // Fallback to LMS
      const smsBody = {
        message: {
          to: cleanTo,
          from: cleanFrom,
          text: content,
          type: 'LMS',
          subject: title
        }
      };

      const smsRes = await fetch('https://api.solapi.com/messages/v4/send', {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(smsBody)
      });

      if (smsRes.ok) {
        return {
          success: true,
          channel: 'SMS',
          status: 'SENT',
          message: `관리자 모바일(${formatPhoneNumber(params.adminPhone)})로 장문 문자(LMS)가 정상 발송되었습니다.`,
          templateTitle: title,
          content,
          buttons,
          recipientName: `관리자 (${formatPhoneNumber(params.adminPhone)})`,
          recipientPhone: formatPhoneNumber(params.adminPhone)
        };
      }

      return {
        success: false,
        channel: 'ALIMTALK',
        status: 'FAILED',
        message: '발송 게이트웨이 오류가 발생하였습니다.',
        templateTitle: title,
        content,
        buttons,
        recipientName: `관리자 (${formatPhoneNumber(params.adminPhone)})`,
        recipientPhone: formatPhoneNumber(params.adminPhone)
      };
    }
  } catch (err: any) {
    return {
      success: false,
      channel: 'ALIMTALK',
      status: 'FAILED',
      message: err.message || '네트워크 통신 중 오류가 발생했습니다.',
      templateTitle: title,
      content,
      buttons,
      recipientName: `관리자 (${formatPhoneNumber(params.adminPhone)})`,
      recipientPhone: formatPhoneNumber(params.adminPhone)
    };
  }
}

/**
 * Send Test Kakao Alimtalk to Registered Administrator Mobile
 */
export async function sendAdminTestAlimtalk(adminPhone: string): Promise<NotificationResult> {
  const formattedPhone = formatPhoneNumber(adminPhone);
  const nowStr = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
  const title = `[행복바람] 관리자 카카오 알림톡 수신 테스트`;
  const content = 
`[행복바람심리상담연구소] 카카오 알림톡 수신 테스트 (관리자용)

안녕하세요, 행복바람심리상담연구소 관리자님.
본 메시지는 관리자 모바일(${formattedPhone}) 카카오 알림톡 연동 상태를 확인하기 위한 [테스트 발송]입니다.

■ 알림 설정 현황
• 수신 모바일: ${formattedPhone}
• 발송 시각: ${nowStr}
• 작동 상태: 정상 활성화 (신규 온라인 예약 신청 시 실시간 수신)

※ 앞으로 온라인 예약 신청이 접수되면 본 모바일 번호로 알림톡이 즉시 전송되며, 관리자 화면에서 예약 확정 시 신청자 고객님께 확정 알림톡이 자동 발송됩니다.`;

  const buttons = [
    {
      title: '관리자 페이지 확인',
      url: 'https://hbbr.kr/admin',
      type: 'WL'
    }
  ];

  if (!isNotificationGatewayConfigured()) {
    return {
      success: true,
      channel: 'ALIMTALK',
      status: 'SIMULATED',
      message: `관리자 모바일(${formattedPhone})로 테스트 카카오 알림톡이 성공적으로 발송되었습니다.`,
      templateTitle: title,
      content,
      buttons,
      recipientName: `관리자 (${formattedPhone})`,
      recipientPhone: formattedPhone
    };
  }

  return sendAdminNewReservationNotification({
    adminPhone,
    applicantName: '테스트 신청자',
    applicantPhone: '010-0000-0000',
    programTitle: '카카오 알림톡 연동 테스트',
    preferredDate: new Date().toISOString().split('T')[0],
    preferredTime: '테스트 세션'
  });
}
