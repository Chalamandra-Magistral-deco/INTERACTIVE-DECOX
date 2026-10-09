import { apiUrl } from "@/config/api";
export type VerifiedService = "discovery" | "magistral";

interface PaymentVerificationResponse {
  verified?: boolean;
  service?: VerifiedService;
  error?: string;
}

export async function verifyPaymentSession(
  sessionId: string,
): Promise<VerifiedService | null> {
  const response = await fetch(
    apiUrl(`/api/verify-payment?session_id=${encodeURIComponent(sessionId)}`),
    { headers: { accept: "application/json" } },
  );

  let data: PaymentVerificationResponse = {};
  try {
    data = (await response.json()) as PaymentVerificationResponse;
  } catch {
    return null;
  }

  if (!response.ok || !data.verified || !data.service) {
    return null;
  }

  return data.service;
}
