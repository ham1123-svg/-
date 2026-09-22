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
