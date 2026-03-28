import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4173';
const runDate = new Date().toISOString().slice(0, 10);

const viewportMatrix = [
  { name: '320x568', width: 320, height: 568 },
  { name: '360x640', width: 360, height: 640 },
  { name: '375x667', width: 375, height: 667 },
  { name: '390x844', width: 390, height: 844 },
  { name: '412x915', width: 412, height: 915 },
  { name: '430x932', width: 430, height: 932 },
];

const orientations = ['portrait', 'landscape'];
const results = [];

const artifactsDir = path.resolve('docs/qa-artifacts', runDate);
const reportsDir = path.resolve('docs');

const seedAuthenticatedStorage = async (context) => {
  const internalUserId = 'USR_QA_AUTOMATION';
  const seed = {
    globalUserState: {
      internalUserId,
      emailVerified: true,
      phoneVerified: true,
      username: '@qa_user',
      nickname: '@qa_user',
      profileImageUrl: 'https://picsum.photos/seed/qa-user/200/200',
      isAccountCreated: true,
      email: 'qa.user@example.com',
      fullName: 'QA User',
      taxId: '',
      phone: { ddi: '+55', number: '+5511999998888' },
      address: { cep: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '' },
      demographics: { birthDate: '1990-01-01', city: 'Sao Paulo', gender: 'Outro' },
    },
    accounts: [
      {
        internalUserId,
        email: 'qa.user@example.com',
        phone: '+5511999998888',
        emailVerified: true,
        phoneVerified: true,
        username: '@qa_user',
        nickname: '@qa_user',
        profileImageUrl: 'https://picsum.photos/seed/qa-user/200/200',
        demographics: { birthDate: '1990-01-01', city: 'Sao Paulo', gender: 'Outro' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    credentials: [
      {
        email: 'qa.user@example.com',
        password: 'Senha123',
        internalUserId,
      },
    ],
    memberships: [
      {
        artistId: 'lia',
        joinedAt: new Date().toISOString(),
        status: 'active',
      },
    ],
    currentArtistId: 'lia',
  };

  await context.addInitScript((payload) => {
    window.localStorage.setItem('globalUserState', JSON.stringify(payload.globalUserState));
    window.localStorage.setItem('clser:accounts:v1', JSON.stringify(payload.accounts));
    window.localStorage.setItem('clser:auth-credentials:v1', JSON.stringify(payload.credentials));
    window.localStorage.setItem(
      `clser:artist-memberships:v1:${payload.globalUserState.internalUserId}`,
      JSON.stringify(payload.memberships)
    );
    window.localStorage.setItem('currentArtistId', JSON.stringify(payload.currentArtistId));
  }, seed);
};

const waitForAppReady = async (page) => {
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: /Sou Fã/i }).waitFor({ timeout: 15000 });
};

const runGuestEntryFlow = async (page) => {
  await page.getByRole('button', { name: /Sou Fã/i }).click();
  await page.getByRole('button', { name: /Cadastrar/i }).waitFor({ timeout: 12000 });
  await page.getByRole('button', { name: /Já tem uma conta\? Entre/i }).waitFor({ timeout: 12000 });
  await page.getByRole('button', { name: /Entrar sem login/i }).waitFor({ timeout: 12000 });

  await page.getByRole('button', { name: /Entrar sem login/i }).click();
  await page.getByText('Explore artistas e clubes').waitFor({ timeout: 12000 });

  const popularArtist = page.locator('button').filter({ hasText: /Official/i }).first();
  await popularArtist.waitFor({ timeout: 12000 });
  await popularArtist.click();

  await page.getByText('Qual é seu e-mail de acesso?').waitFor({ timeout: 12000 });
};

const runInvalidLoginFlow = async (page) => {
  await page.getByRole('button', { name: /Sou Fã/i }).click();
  await page.getByRole('button', { name: /Já tem uma conta\? Entre/i }).click();

  await page.getByPlaceholder('seu@email.com').fill('nao.existe@example.com');
  await page.getByPlaceholder('••••••••').fill('Senha123');
  await page.getByRole('button', { name: /^Entrar$/i }).click();

  await page.getByText('Conta não encontrada').waitFor({ timeout: 12000 });
};

const runAuthenticatedShellFlow = async (page, dims) => {
  await page.getByRole('button', { name: /Sou Fã/i }).click();
  await page.getByRole('button', { name: /Já tem uma conta\? Entre/i }).click();

  await page.getByPlaceholder('seu@email.com').fill('qa.user@example.com');
  await page.getByPlaceholder('••••••••').fill('Senha123');
  await page.getByRole('button', { name: /^Entrar$/i }).click();

  await page.getByRole('button', { name: /Loja/i }).waitFor({ timeout: 15000 });

  const navLocator = page.locator('div.safe-bottom-pad.fixed.bottom-0').first();
  await navLocator.waitFor({ timeout: 10000 });
  const navBefore = await navLocator.boundingBox();
  if (!navBefore) {
    throw new Error('Bottom nav bounding box not found.');
  }

  await page.getByRole('button', { name: /Loja/i }).click();
  await page.getByText(/^Loja$/).first().waitFor({ timeout: 12000 });

  await page.$eval('main', (element) => {
    element.scrollTo({ top: 900, behavior: 'auto' });
  });
  await page.getByRole('button', { name: /Feed/i }).click();
  await page.waitForTimeout(200);

  const scrollTopAfter = await page.$eval('main', (element) => element.scrollTop);
  if (scrollTopAfter > 40) {
    throw new Error(`Expected scroll reset to top after section switch, got ${scrollTopAfter}.`);
  }

  const navAfter = await navLocator.boundingBox();
  if (!navAfter) {
    throw new Error('Bottom nav bounding box disappeared after scroll.');
  }

  const deltaY = Math.abs(navAfter.y - navBefore.y);
  if (deltaY > 2) {
    throw new Error(`Bottom nav moved after interactions. DeltaY=${deltaY}`);
  }

  if (navAfter.y + navAfter.height < dims.height - 4) {
    throw new Error('Bottom nav is not anchored near viewport bottom.');
  }
};

const executeCase = async (browser, viewportName, orientation, testName, options = {}) => {
  const dims = orientation === 'portrait'
    ? { width: options.width, height: options.height }
    : { width: options.height, height: options.width };
  const caseId = `${viewportName}-${orientation}-${testName}`.replace(/[^a-zA-Z0-9_-]/g, '_');

  const context = await browser.newContext({
    viewport: dims,
    deviceScaleFactor: 2,
    colorScheme: 'light',
  });

  try {
    if (options.authenticated) {
      await seedAuthenticatedStorage(context);
    }

    const page = await context.newPage();
    page.setDefaultTimeout(15000);

    await waitForAppReady(page);

    if (testName === 'guest-entry') {
      await runGuestEntryFlow(page);
    } else if (testName === 'invalid-login') {
      await runInvalidLoginFlow(page);
    } else if (testName === 'auth-shell') {
      await runAuthenticatedShellFlow(page, dims);
    }

    results.push({
      viewport: viewportName,
      orientation,
      test: testName,
      status: 'pass',
      notes: '',
      screenshot: '',
    });
  } catch (error) {
    const page = context.pages()[0];
    const screenshotPath = path.join(artifactsDir, `${caseId}.png`);
    if (page) {
      await page.screenshot({ path: screenshotPath, fullPage: true }).catch(() => {});
    }

    results.push({
      viewport: viewportName,
      orientation,
      test: testName,
      status: 'fail',
      notes: error instanceof Error ? error.message : String(error),
      screenshot: screenshotPath,
    });
  } finally {
    await context.close();
  }
};

const writeReport = async () => {
  const passCount = results.filter((result) => result.status === 'pass').length;
  const failCount = results.length - passCount;

  const lines = [];
  lines.push(`# Mobile QA Smoke Report (${runDate})`);
  lines.push('');
  lines.push(`Base URL: \`${baseUrl}\``);
  lines.push(`Total checks: **${results.length}**`);
  lines.push(`Passed: **${passCount}**`);
  lines.push(`Failed: **${failCount}**`);
  lines.push('');
  lines.push('| Viewport | Orientation | Check | Status | Notes |');
  lines.push('|---|---|---|---|---|');

  for (const result of results) {
    const status = result.status === 'pass' ? 'PASS' : 'FAIL';
    const notes = result.status === 'pass'
      ? '-'
      : `${result.notes}${result.screenshot ? ` ([screenshot](${result.screenshot.replace(process.cwd() + '/', '')}))` : ''}`;
    lines.push(`| ${result.viewport} | ${result.orientation} | ${result.test} | ${status} | ${notes} |`);
  }

  lines.push('');
  lines.push('## Coverage');
  lines.push('- `guest-entry`: Sou Fã -> Entrar sem login -> seleção de artista -> onboarding.');
  lines.push('- `invalid-login`: Sou Fã -> Login com conta inválida -> modal de erro.');
  lines.push('- `auth-shell`: login com conta seed -> bottom nav fixa -> clique Loja/Feed + scroll reset.');
  lines.push('');
  lines.push('## Manual Follow-up Required');
  lines.push('- Confirmar aparência visual fina em dispositivos reais iOS/Android.');
  lines.push('- Validar teclado virtual e safe-area com notch/dynamic island.');
  lines.push('- Validar autofill OTP em iOS Safari e Android Chrome.');

  const reportPath = path.join(reportsDir, `mobile-qa-report-${runDate}.md`);
  await fs.mkdir(reportsDir, { recursive: true });
  await fs.writeFile(reportPath, `${lines.join('\n')}\n`, 'utf8');
  return reportPath;
};

const main = async () => {
  await fs.rm(artifactsDir, { recursive: true, force: true });
  await fs.mkdir(artifactsDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });

  try {
    for (const viewport of viewportMatrix) {
      for (const orientation of orientations) {
        await executeCase(browser, viewport.name, orientation, 'guest-entry', {
          width: viewport.width,
          height: viewport.height,
        });
        await executeCase(browser, viewport.name, orientation, 'invalid-login', {
          width: viewport.width,
          height: viewport.height,
        });
        await executeCase(browser, viewport.name, orientation, 'auth-shell', {
          width: viewport.width,
          height: viewport.height,
          authenticated: true,
        });
      }
    }
  } finally {
    await browser.close();
  }

  const reportPath = await writeReport();
  const failed = results.some((result) => result.status === 'fail');
  console.log(`Mobile QA report written to: ${reportPath}`);

  if (failed) {
    process.exitCode = 1;
  }
};

await main();
