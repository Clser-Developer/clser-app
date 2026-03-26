import { readStorageItem, writeStorageItem } from '../lib/storage';
import { createAccountRepository, type AccountProfileRecord } from './accountRepository';
import { getSupabaseClient, hasSupabaseConfig } from '../lib/supabase/client';

const LOCAL_CREDENTIALS_STORAGE_KEY = 'clser:auth-credentials:v1';

interface LocalCredentialRecord {
  email: string;
  passwordHash?: string;
  password?: string;
  internalUserId: string;
}

export interface RegisterFanInput {
  internalUserId: string;
  email: string;
  phone: string;
  password: string;
  username: string;
  nickname: string;
  profileImageUrl: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  demographics: {
    birthDate: string;
    city: string;
    gender: string;
  };
}

export interface LoginFanInput {
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  reason?: string;
  profile?: AccountProfileRecord;
}

const normalizeEmail = (value: string) => value.trim().toLowerCase();
const normalizePhone = (value: string) => value.trim();
const normalizeUsername = (value: string) => {
  const normalizedValue = value.trim().toLowerCase();
  if (!normalizedValue) return '';
  return normalizedValue.startsWith('@') ? normalizedValue : `@${normalizedValue}`;
};

const readLocalCredentials = (): LocalCredentialRecord[] => {
  const raw = readStorageItem(LOCAL_CREDENTIALS_STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeLocalCredentials = (records: LocalCredentialRecord[]) => {
  writeStorageItem(LOCAL_CREDENTIALS_STORAGE_KEY, JSON.stringify(records));
};

const hashPassword = async (password: string): Promise<string> => {
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);
    const digest = await window.crypto.subtle.digest('SHA-256', passwordBuffer);
    const hashArray = Array.from(new Uint8Array(digest));
    return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  return btoa(password);
};

const registerLocalCredential = async (email: string, password: string, internalUserId: string) => {
  const normalizedEmail = normalizeEmail(email);
  const passwordHash = await hashPassword(password);
  const credentials = readLocalCredentials();
  const index = credentials.findIndex((credential) => normalizeEmail(credential.email) === normalizedEmail);
  const nextRecord = { email: normalizedEmail, passwordHash, internalUserId };

  if (index >= 0) {
    credentials[index] = nextRecord;
  } else {
    credentials.push(nextRecord);
  }
  writeLocalCredentials(credentials);
};

const validateLocalCredential = async (email: string, password: string): Promise<LocalCredentialRecord | null> => {
  const normalizedEmail = normalizeEmail(email);
  const passwordHash = await hashPassword(password);
  const credentials = readLocalCredentials();
  return credentials.find(
    (credential) =>
      normalizeEmail(credential.email) === normalizedEmail &&
      (credential.passwordHash === passwordHash || credential.password === password)
  ) ?? null;
};

export const registerFanAccount = async (input: RegisterFanInput): Promise<AuthResult> => {
  const accountRepository = createAccountRepository();
  const normalizedEmail = normalizeEmail(input.email);
  const normalizedPhone = normalizePhone(input.phone);
  const normalizedUsername = normalizeUsername(input.username);

  const existingByEmail = await accountRepository.findByEmail(normalizedEmail);
  if (existingByEmail && existingByEmail.internalUserId !== input.internalUserId) {
    return { success: false, reason: 'Já existe uma conta cadastrada com este e-mail.' };
  }

  const existingByPhone = await accountRepository.findByPhone(normalizedPhone);
  if (existingByPhone && existingByPhone.internalUserId !== input.internalUserId) {
    return { success: false, reason: 'Já existe uma conta cadastrada com este telefone.' };
  }

  const existingByUsername = await accountRepository.findByUsername(normalizedUsername);
  if (existingByUsername && existingByUsername.internalUserId !== input.internalUserId) {
    return { success: false, reason: 'Este nome de usuário já está em uso.' };
  }

  if (hasSupabaseConfig) {
    const client = getSupabaseClient();
    if (!client) {
      return { success: false, reason: 'Supabase indisponivel.' };
    }

    const { error } = await client.auth.signUp({
      email: normalizedEmail,
      password: input.password,
      phone: normalizedPhone || undefined,
    });

    if (error) {
      return { success: false, reason: error.message };
    }
  } else {
    await registerLocalCredential(normalizedEmail, input.password, input.internalUserId);
  }

  const profile: AccountProfileRecord = {
    internalUserId: input.internalUserId,
    email: normalizedEmail,
    phone: normalizedPhone,
    emailVerified: input.emailVerified,
    phoneVerified: input.phoneVerified,
    username: normalizedUsername,
    nickname: input.nickname,
    profileImageUrl: input.profileImageUrl,
    demographics: input.demographics,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    await accountRepository.upsert(profile);
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'Falha ao salvar perfil da conta.';
    return { success: false, reason };
  }

  return { success: true, profile };
};

export const loginFanAccount = async (input: LoginFanInput): Promise<AuthResult> => {
  const accountRepository = createAccountRepository();
  const normalizedEmail = normalizeEmail(input.email);

  if (hasSupabaseConfig) {
    const client = getSupabaseClient();
    if (!client) {
      return { success: false, reason: 'Supabase indisponivel.' };
    }

    const { error } = await client.auth.signInWithPassword({
      email: normalizedEmail,
      password: input.password,
    });

    if (error) {
      return { success: false, reason: error.message };
    }
  } else {
    const credential = await validateLocalCredential(normalizedEmail, input.password);
    if (!credential) {
      return { success: false, reason: 'Conta nao encontrada para e-mail/senha informados.' };
    }
  }

  const profile = await accountRepository.findByEmail(normalizedEmail);
  if (!profile) {
    return { success: false, reason: 'Perfil da conta nao encontrado.' };
  }

  return { success: true, profile };
};

export const checkUsernameAvailability = async (
  username: string
): Promise<{ available: boolean; reason?: string }> => {
  const normalizedUsername = normalizeUsername(username);
  const usernameWithoutPrefix = normalizedUsername.replace('@', '');

  if (usernameWithoutPrefix.length < 3) {
    return { available: false, reason: 'Use pelo menos 3 caracteres no nome de usuário.' };
  }

  const accountRepository = createAccountRepository();
  const existingByUsername = await accountRepository.findByUsername(normalizedUsername);
  if (existingByUsername) {
    return { available: false, reason: 'Este nome de usuário já está em uso. Tente outro.' };
  }

  return { available: true };
};

export const checkEmailAvailability = async (
  email: string,
  options?: { excludeInternalUserId?: string }
): Promise<{ available: boolean; reason?: string }> => {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail.includes('@')) {
    return { available: false, reason: 'Informe um e-mail válido para continuar.' };
  }

  const accountRepository = createAccountRepository();
  const existingByEmail = await accountRepository.findByEmail(normalizedEmail);
  if (existingByEmail && existingByEmail.internalUserId !== options?.excludeInternalUserId) {
    return { available: false, reason: 'Já existe uma conta cadastrada com este e-mail.' };
  }

  return { available: true };
};
