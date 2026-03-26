import { beforeEach, describe, expect, it } from 'vitest';
import { checkEmailAvailability, checkUsernameAvailability, loginFanAccount, registerFanAccount } from '../services/authService';

const buildRegisterInput = (overrides?: Partial<Parameters<typeof registerFanAccount>[0]>) => ({
  internalUserId: 'USR_TEST_01',
  email: 'fan@example.com',
  phone: '+15551234567',
  password: 'Senha123',
  username: '@fan_teste',
  nickname: '@fan_teste',
  profileImageUrl: 'https://example.com/avatar.png',
  emailVerified: true,
  phoneVerified: true,
  demographics: {
    birthDate: '1995-01-10',
    city: 'Sao Paulo',
    gender: 'Outro',
  },
  ...overrides,
});

describe('authService (local fallback)', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('registers and logs in with local credentials', async () => {
    const registerResult = await registerFanAccount(buildRegisterInput());
    expect(registerResult.success).toBe(true);
    expect(registerResult.profile?.email).toBe('fan@example.com');

    const loginSuccess = await loginFanAccount({
      email: 'fan@example.com',
      password: 'Senha123',
    });
    expect(loginSuccess.success).toBe(true);
    expect(loginSuccess.profile?.internalUserId).toBe('USR_TEST_01');

    const loginFailure = await loginFanAccount({
      email: 'fan@example.com',
      password: 'senha_errada',
    });
    expect(loginFailure.success).toBe(false);
  });

  it('enforces uniqueness for email, phone and username', async () => {
    const first = await registerFanAccount(buildRegisterInput());
    expect(first.success).toBe(true);

    const duplicatedEmail = await registerFanAccount(
      buildRegisterInput({
        internalUserId: 'USR_TEST_02',
        phone: '+15550001111',
        username: '@outro_nome',
      })
    );
    expect(duplicatedEmail.success).toBe(false);

    const duplicatedPhone = await registerFanAccount(
      buildRegisterInput({
        internalUserId: 'USR_TEST_03',
        email: 'novo@example.com',
        phone: '+15551234567',
        username: '@novo_nome',
      })
    );
    expect(duplicatedPhone.success).toBe(false);

    const duplicatedUsername = await registerFanAccount(
      buildRegisterInput({
        internalUserId: 'USR_TEST_04',
        email: 'usuario4@example.com',
        phone: '+15558887777',
        username: '@fan_teste',
      })
    );
    expect(duplicatedUsername.success).toBe(false);
  });

  it('checks username availability', async () => {
    const availableBefore = await checkUsernameAvailability('@nome_disponivel');
    expect(availableBefore.available).toBe(true);

    await registerFanAccount(buildRegisterInput({ username: '@nome_ocupado' }));

    const availableAfter = await checkUsernameAvailability('@nome_ocupado');
    expect(availableAfter.available).toBe(false);
  });

  it('checks email availability before submit', async () => {
    const availableBefore = await checkEmailAvailability('novo-email@example.com');
    expect(availableBefore.available).toBe(true);

    await registerFanAccount(buildRegisterInput({ email: 'ocupado@example.com' }));

    const availableAfter = await checkEmailAvailability('ocupado@example.com');
    expect(availableAfter.available).toBe(false);
  });
});
