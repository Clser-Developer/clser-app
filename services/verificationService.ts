import { readStorageItem, writeStorageItem } from '../lib/storage';
import { getSupabaseClient, hasSupabaseConfig } from '../lib/supabase/client';

type VerificationChannel = 'email' | 'phone';
type VerificationProvider = 'supabase' | 'local';
type VerificationPurpose = 'onboarding_primary' | 'onboarding_backup';

interface LocalVerificationRecord {
  channel: VerificationChannel;
  destination: string;
  expiresAt: string;
  purpose: VerificationPurpose;
  provider: 'local';
  sessionId: string;
  verificationCode: string;
}

export interface VerificationSession {
  channel: VerificationChannel;
  destination: string;
  expiresAt: string;
  provider: VerificationProvider;
  sessionId: string;
}

export interface StartVerificationInput {
  channel: VerificationChannel;
  destination: string;
  purpose: VerificationPurpose;
}

export interface VerifyCodeInput {
  session: VerificationSession;
  code: string;
}

export interface VerificationResponse {
  success: boolean;
  reason?: string;
  session?: VerificationSession;
  developmentCodeHint?: string;
}

const LOCAL_VERIFICATIONS_STORAGE_KEY = 'clser:verification-codes:v1';
const VERIFICATION_CODE_LENGTH = 6;
const VERIFICATION_TTL_MS = 10 * 60 * 1000;

const normalizeEmail = (value: string) => value.trim().toLowerCase();
const normalizePhone = (value: string) => value.trim().replace(/\s+/g, '');

const normalizeDestination = (channel: VerificationChannel, destination: string) => {
  if (channel === 'email') {
    return normalizeEmail(destination);
  }
  return normalizePhone(destination);
};

const generateVerificationCode = () =>
  Array.from({ length: VERIFICATION_CODE_LENGTH }, () => Math.floor(Math.random() * 10)).join('');

const generateSessionId = () => `ver-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const canExposeDebugCode =
  typeof import.meta !== 'undefined' && Boolean(import.meta.env?.DEV || import.meta.env?.MODE !== 'production');

const readLocalVerifications = (): LocalVerificationRecord[] => {
  const raw = readStorageItem(LOCAL_VERIFICATIONS_STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeLocalVerifications = (records: LocalVerificationRecord[]) => {
  writeStorageItem(LOCAL_VERIFICATIONS_STORAGE_KEY, JSON.stringify(records));
};

const cleanupExpiredLocalVerifications = (records: LocalVerificationRecord[]) => {
  const now = Date.now();
  return records.filter((record) => {
    const expiresAtTime = new Date(record.expiresAt).getTime();
    return Number.isFinite(expiresAtTime) && expiresAtTime > now;
  });
};

const startSupabaseVerification = async (
  input: StartVerificationInput
): Promise<VerificationResponse> => {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, reason: 'Supabase indisponível para envio de código.' };
  }

  if (input.channel === 'email') {
    const { error } = await client.auth.signInWithOtp({
      email: normalizeEmail(input.destination),
      options: {
        shouldCreateUser: false,
      },
    });

    if (error) {
      return { success: false, reason: error.message };
    }

    return {
      success: true,
      session: {
        channel: 'email',
        destination: normalizeEmail(input.destination),
        expiresAt: new Date(Date.now() + VERIFICATION_TTL_MS).toISOString(),
        provider: 'supabase',
        sessionId: generateSessionId(),
      },
    };
  }

  const { error } = await client.auth.signInWithOtp({
    phone: normalizePhone(input.destination),
  });

  if (error) {
    return { success: false, reason: error.message };
  }

  return {
    success: true,
    session: {
      channel: 'phone',
      destination: normalizePhone(input.destination),
      expiresAt: new Date(Date.now() + VERIFICATION_TTL_MS).toISOString(),
      provider: 'supabase',
      sessionId: generateSessionId(),
    },
  };
};

const startLocalVerification = (input: StartVerificationInput): VerificationResponse => {
  const records = cleanupExpiredLocalVerifications(readLocalVerifications());
  const normalizedDestination = normalizeDestination(input.channel, input.destination);
  const verificationCode = generateVerificationCode();
  const sessionId = generateSessionId();
  const nextRecord: LocalVerificationRecord = {
    channel: input.channel,
    destination: normalizedDestination,
    purpose: input.purpose,
    provider: 'local',
    verificationCode,
    sessionId,
    expiresAt: new Date(Date.now() + VERIFICATION_TTL_MS).toISOString(),
  };

  const nextRecords = [
    ...records.filter(
      (record) =>
        !(
          record.channel === input.channel &&
          record.destination === normalizedDestination &&
          record.purpose === input.purpose
        )
    ),
    nextRecord,
  ];
  writeLocalVerifications(nextRecords);

  return {
    success: true,
    session: {
      channel: input.channel,
      destination: normalizedDestination,
      expiresAt: nextRecord.expiresAt,
      provider: 'local',
      sessionId,
    },
    developmentCodeHint: canExposeDebugCode ? verificationCode : undefined,
  };
};

export const startVerification = async (
  input: StartVerificationInput
): Promise<VerificationResponse> => {
  if (hasSupabaseConfig) {
    const supabaseResult = await startSupabaseVerification(input);
    if (supabaseResult.success) {
      return supabaseResult;
    }
  }

  return startLocalVerification(input);
};

const verifySupabaseCode = async (input: VerifyCodeInput): Promise<VerificationResponse> => {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, reason: 'Supabase indisponível para validação do código.' };
  }

  const normalizedCode = input.code.trim();
  const destination = normalizeDestination(input.session.channel, input.session.destination);

  if (input.session.channel === 'email') {
    const { error } = await client.auth.verifyOtp({
      email: destination,
      token: normalizedCode,
      type: 'email',
    });

    if (error) {
      return { success: false, reason: error.message };
    }

    return { success: true };
  }

  const { error } = await client.auth.verifyOtp({
    phone: destination,
    token: normalizedCode,
    type: 'sms',
  });

  if (error) {
    return { success: false, reason: error.message };
  }

  return { success: true };
};

const verifyLocalCode = (input: VerifyCodeInput): VerificationResponse => {
  const now = Date.now();
  const normalizedCode = input.code.trim();
  const records = cleanupExpiredLocalVerifications(readLocalVerifications());
  const match = records.find((record) => record.sessionId === input.session.sessionId);

  if (!match) {
    writeLocalVerifications(records);
    return { success: false, reason: 'Código expirado. Solicite um novo código.' };
  }

  const expiresAtTime = new Date(match.expiresAt).getTime();
  if (!Number.isFinite(expiresAtTime) || expiresAtTime <= now) {
    writeLocalVerifications(records.filter((record) => record.sessionId !== match.sessionId));
    return { success: false, reason: 'Código expirado. Solicite um novo código.' };
  }

  if (match.verificationCode !== normalizedCode) {
    return { success: false, reason: 'Código inválido. Confira os 6 dígitos e tente novamente.' };
  }

  writeLocalVerifications(records.filter((record) => record.sessionId !== match.sessionId));
  return { success: true };
};

export const verifyCode = async (input: VerifyCodeInput): Promise<VerificationResponse> => {
  if (input.session.provider === 'supabase') {
    return verifySupabaseCode(input);
  }

  return verifyLocalCode(input);
};
