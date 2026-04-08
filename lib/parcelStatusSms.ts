import prisma from '@/lib/prisma';
import { sendSms, normalizePhone } from '@/lib/sms';

/** სტატუსები, რომლებზეც მფლობელს SMS-ს ვუგზავნით */
const SMS_ON_STATUSES = new Set([
  'in_warehouse',
  'in_transit',
  'arrived',
  'delivered',
  'stopped',
]);

function smsBodyForStatus(status: string, trackingNumber: string): string | null {
  const code = trackingNumber.trim();
  switch (status) {
    case 'in_warehouse':
      return `კომპანია Postifly გაცნობებთ, რომ თქვენი ამანათი კოდით ${code} მიღებულია საწყობში`;
    case 'in_transit':
      return `კომპანია Postifly გაცნობებთ, რომ თქვენი ამანათი კოდით ${code} გზაშია`;
    case 'arrived':
      return `კომპანია Postifly გაცნობებთ, რომ თქვენი ამანათი კოდით ${code} ჩამოსულია`;
    case 'delivered':
      return `კომპანია Postifly გაცნობებთ, რომ თქვენი ამანათი კოდით ${code} გატანილია`;
    case 'stopped':
      return `კომპანია Postifly გაცნობებთ, რომ თქვენი ამანათი კოდით ${code} გაჩერდა საბაჟოზე`;
    default:
      return null;
  }
}

/**
 * სტატუსის ცვლილებისას SMS მფლობელის ნომერზე (თუ არის). ინახავს smsSent-ს წარმატების მიხედვით.
 */
export async function notifyParcelOwnerStatusSms(params: {
  parcelId: string;
  previousStatus: string;
  newStatus: string;
  trackingNumber: string;
  ownerPhone: string | null | undefined;
}): Promise<void> {
  const { parcelId, previousStatus, newStatus, trackingNumber, ownerPhone } = params;
  if (previousStatus === newStatus) return;
  if (!SMS_ON_STATUSES.has(newStatus)) return;

  const text = smsBodyForStatus(newStatus, trackingNumber);
  if (!text) return;

  const raw = ownerPhone?.trim();
  if (!raw) {
    return;
  }

  const to = normalizePhone(raw);
  const result = await sendSms(to, text);

  await prisma.parcel.update({
    where: { id: parcelId },
    data: { smsSent: result.ok },
  });

  if (result.ok) {
    console.log('[parcelStatusSms] SMS sent', {
      parcelId,
      newStatus,
      to,
      text,
      messageId: result.messageId,
    });
  } else {
    console.warn('[parcelStatusSms] SMS failed', {
      parcelId,
      newStatus,
      code: 'code' in result ? result.code : undefined,
      message: 'message' in result ? result.message : undefined,
    });
  }
}
