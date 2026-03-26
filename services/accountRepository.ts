import { getSupabaseClient, hasSupabaseConfig } from '../lib/supabase/client';
import { readStorageItem, writeStorageItem } from '../lib/storage';

const LOCAL_ACCOUNT_STORAGE_KEY = 'clser:accounts:v1';

export interface AccountProfileRecord {
  internalUserId: string;
  email: string;
  phone: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  username: string;
  nickname: string;
  profileImageUrl: string;
  demographics: {
    birthDate: string;
    city: string;
    gender: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AccountRepository {
  findByEmail(email: string): Promise<AccountProfileRecord | null>;
  findByPhone(phone: string): Promise<AccountProfileRecord | null>;
  findByUsername(username: string): Promise<AccountProfileRecord | null>;
  upsert(record: AccountProfileRecord): Promise<void>;
}

const normalizeEmail = (value: string) => value.trim().toLowerCase();
const normalizePhone = (value: string) => value.trim();
const normalizeUsername = (value: string) => {
  const normalizedValue = value.trim().toLowerCase();
  if (!normalizedValue) return '';
  return normalizedValue.startsWith('@') ? normalizedValue : `@${normalizedValue}`;
};

const readLocalAccounts = (): AccountProfileRecord[] => {
  const raw = readStorageItem(LOCAL_ACCOUNT_STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeLocalAccounts = (records: AccountProfileRecord[]) => {
  writeStorageItem(LOCAL_ACCOUNT_STORAGE_KEY, JSON.stringify(records));
};

class LocalAccountRepository implements AccountRepository {
  async findByEmail(email: string): Promise<AccountProfileRecord | null> {
    const normalizedEmail = normalizeEmail(email);
    const allAccounts = readLocalAccounts();
    return allAccounts.find((record) => normalizeEmail(record.email) === normalizedEmail) ?? null;
  }

  async findByPhone(phone: string): Promise<AccountProfileRecord | null> {
    const normalizedPhone = normalizePhone(phone);
    const allAccounts = readLocalAccounts();
    return allAccounts.find((record) => normalizePhone(record.phone) === normalizedPhone) ?? null;
  }

  async findByUsername(username: string): Promise<AccountProfileRecord | null> {
    const normalizedUsername = normalizeUsername(username);
    const allAccounts = readLocalAccounts();
    return allAccounts.find((record) => normalizeUsername(record.username) === normalizedUsername) ?? null;
  }

  async upsert(record: AccountProfileRecord): Promise<void> {
    const allAccounts = readLocalAccounts();
    const normalizedEmail = normalizeEmail(record.email);
    const now = new Date().toISOString();
    const index = allAccounts.findIndex(
      (item) =>
        item.internalUserId === record.internalUserId ||
        normalizeEmail(item.email) === normalizedEmail
    );

    if (index >= 0) {
      allAccounts[index] = {
        ...allAccounts[index],
        ...record,
        updatedAt: now,
      };
    } else {
      allAccounts.push({
        ...record,
        createdAt: record.createdAt || now,
        updatedAt: now,
      });
    }

    writeLocalAccounts(allAccounts);
  }
}

class SupabaseAccountRepository implements AccountRepository {
  async findByEmail(email: string): Promise<AccountProfileRecord | null> {
    const client = getSupabaseClient();
    if (!client) return null;

    const normalizedEmail = normalizeEmail(email);
    const { data, error } = await client
      .from('accounts')
      .select('*')
      .ilike('email', normalizedEmail)
      .maybeSingle();

    if (error || !data) return null;

    return {
      internalUserId: data.internal_user_id,
      email: data.email,
      phone: data.phone,
      emailVerified: Boolean(data.email_verified),
      phoneVerified: Boolean(data.phone_verified),
      username: data.username,
      nickname: data.nickname,
      profileImageUrl: data.profile_image_url,
      demographics: {
        birthDate: data.birth_date ?? '',
        city: data.city ?? '',
        gender: data.gender ?? '',
      },
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async findByPhone(phone: string): Promise<AccountProfileRecord | null> {
    const client = getSupabaseClient();
    if (!client) return null;

    const normalizedPhone = normalizePhone(phone);
    const { data, error } = await client
      .from('accounts')
      .select('*')
      .eq('phone', normalizedPhone)
      .maybeSingle();

    if (error || !data) return null;

    return {
      internalUserId: data.internal_user_id,
      email: data.email,
      phone: data.phone,
      emailVerified: Boolean(data.email_verified),
      phoneVerified: Boolean(data.phone_verified),
      username: data.username,
      nickname: data.nickname,
      profileImageUrl: data.profile_image_url,
      demographics: {
        birthDate: data.birth_date ?? '',
        city: data.city ?? '',
        gender: data.gender ?? '',
      },
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async findByUsername(username: string): Promise<AccountProfileRecord | null> {
    const client = getSupabaseClient();
    if (!client) return null;

    const normalizedUsername = normalizeUsername(username);
    const { data, error } = await client
      .from('accounts')
      .select('*')
      .ilike('username', normalizedUsername)
      .maybeSingle();

    if (error || !data) return null;

    return {
      internalUserId: data.internal_user_id,
      email: data.email,
      phone: data.phone,
      emailVerified: Boolean(data.email_verified),
      phoneVerified: Boolean(data.phone_verified),
      username: data.username,
      nickname: data.nickname,
      profileImageUrl: data.profile_image_url,
      demographics: {
        birthDate: data.birth_date ?? '',
        city: data.city ?? '',
        gender: data.gender ?? '',
      },
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async upsert(record: AccountProfileRecord): Promise<void> {
    const client = getSupabaseClient();
    if (!client) return;

    const { error } = await client.from('accounts').upsert({
      internal_user_id: record.internalUserId,
      email: normalizeEmail(record.email),
      phone: normalizePhone(record.phone),
      email_verified: record.emailVerified,
      phone_verified: record.phoneVerified,
      username: normalizeUsername(record.username),
      nickname: record.nickname,
      profile_image_url: record.profileImageUrl,
      birth_date: record.demographics.birthDate,
      city: record.demographics.city,
      gender: record.demographics.gender,
      created_at: record.createdAt,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      throw error;
    }
  }
}

export const createAccountRepository = (): AccountRepository => {
  if (hasSupabaseConfig) {
    return new SupabaseAccountRepository();
  }

  return new LocalAccountRepository();
};
