import React, { useEffect, useMemo, useRef, useState } from 'react';
import Icon from './Icon';
import { UserDemographics } from '../types';
import { OnboardingDraft } from '../hooks/useGlobalUserState';
import { checkEmailAvailability, checkUsernameAvailability } from '../services/authService';
import { startVerification, verifyCode, type VerificationSession } from '../services/verificationService';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ModalBody, ModalFooter, ModalShell, ModalTitle } from './ui/modal-shell';

interface OnboardingProps {
    internalUserId: string;
    onComplete: (details: {
        email: string;
        phone: string;
        password: string;
        emailVerified: boolean;
        phoneVerified: boolean;
        fullName: string;
        username: string;
        nickname: string;
        profileImageUrl: string;
        demographics: UserDemographics;
    }) => void | Promise<void>;
    draft?: OnboardingDraft | null;
    onUpdateDraft: (draft: OnboardingDraft) => void;
    artistId: string;
    onCancel: () => void;
    onDiscard: () => void;
}

const onboardingInputClassName =
    'h-14 rounded-2xl border-2 border-gray-100 bg-gray-50 px-5 text-base font-bold text-gray-900 shadow-sm focus-visible:border-rose-300 focus-visible:ring-rose-500/30 md:text-base';
const onboardingLabelClassName =
    'ml-2 block text-[10px] font-black uppercase tracking-widest text-gray-400';

const formatPrettyDate = (value: string) => {
    if (!value) {
        return 'Ainda não informado';
    }

    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) {
        return 'Ainda não informado';
    }

    return date.toLocaleDateString('pt-BR');
};

const genderOptions: UserDemographics['gender'][] = ['Masculino', 'Feminino', 'Outro', 'Prefiro não dizer'];

const Onboarding: React.FC<OnboardingProps> = ({
    internalUserId,
    onComplete,
    draft,
    onUpdateDraft,
    artistId,
    onCancel,
    onDiscard,
}) => {
    const normalizedDraftStep = draft?.step === 1.5 ? 1 : draft?.step === 5 ? 4 : draft?.step ?? 1;
    const initialIdentifier = draft?.identifierType === 'phone' ? draft?.backupIdentifier || '' : draft?.identifier || '';
    const initialBackupIdentifier = draft?.identifierType === 'phone' ? draft?.identifier || '' : draft?.backupIdentifier || '';

    const [step, setStep] = useState<number>(normalizedDraftStep);
    const [identifier, setIdentifier] = useState(initialIdentifier);
    const [isPrimaryIdentifierVerified, setPrimaryIdentifierVerified] = useState(draft?.identifierVerified || false);
    const [isBackupIdentifierVerified, setBackupIdentifierVerified] = useState(draft?.backupIdentifierVerified || false);
    const [primaryVerificationSession, setPrimaryVerificationSession] = useState<VerificationSession | null>(null);
    const [backupVerificationSession, setBackupVerificationSession] = useState<VerificationSession | null>(null);
    const [primaryVerificationError, setPrimaryVerificationError] = useState('');
    const [backupVerificationError, setBackupVerificationError] = useState('');
    const [primaryVerificationHint, setPrimaryVerificationHint] = useState<string | null>(null);
    const [backupVerificationHint, setBackupVerificationHint] = useState<string | null>(null);
    const [isSendingPrimaryCode, setSendingPrimaryCode] = useState(false);
    const [isSendingBackupCode, setSendingBackupCode] = useState(false);
    const [isVerifyingPrimaryCode, setVerifyingPrimaryCode] = useState(false);
    const [isVerifyingBackupCode, setVerifyingBackupCode] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [username, setUsername] = useState(draft?.username || '');
    const [fullName, setFullName] = useState(draft?.nickname || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [backupId, setBackupId] = useState(initialBackupIdentifier);
    const [profileImageUrl, setProfileImageUrl] = useState(draft?.profileImageUrl || '');
    const initialLocationParts = (draft?.demographics?.city || '')
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean);
    const [city, setCity] = useState(initialLocationParts[0] || '');
    const [country, setCountry] = useState(initialLocationParts.slice(1).join(', '));
    const [birthDate, setBirthDate] = useState(draft?.demographics?.birthDate || '');
    const [gender, setGender] = useState<UserDemographics['gender']>(draft?.demographics?.gender || '');
    const [isExitConfirmVisible, setExitConfirmVisible] = useState(false);

    const [isVerifyingUsername, setIsVerifyingUsername] = useState(false);
    const [usernameStatus, setUsernameStatus] = useState<'idle' | 'available' | 'taken'>('idle');
    const [usernameError, setUsernameError] = useState('');
    const [isCheckingPrimaryEmail, setCheckingPrimaryEmail] = useState(false);
    const [primaryEmailStatus, setPrimaryEmailStatus] = useState<'idle' | 'available' | 'taken'>('idle');
    const [primaryEmailError, setPrimaryEmailError] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const passwordSectionRef = useRef<HTMLDivElement>(null);
    const hasAutoScrolledToPasswordRef = useRef(false);
    const hasInitializedPrimaryVerificationRef = useRef(false);
    const hasInitializedBackupVerificationRef = useRef(false);

    const ensurePrimaryEmailAvailability = async (rawEmail: string) => {
        const normalizedEmail = rawEmail.trim().toLowerCase();
        if (!normalizedEmail.includes('@')) {
            setPrimaryEmailStatus('idle');
            setPrimaryEmailError('');
            return false;
        }

        setCheckingPrimaryEmail(true);
        setPrimaryEmailError('');
        try {
            const result = await checkEmailAvailability(normalizedEmail, {
                excludeInternalUserId: internalUserId,
            });
            if (!result.available) {
                setPrimaryEmailStatus('taken');
                setPrimaryEmailError(result.reason ?? 'Já existe uma conta cadastrada com este e-mail.');
                return false;
            }

            setPrimaryEmailStatus('available');
            setPrimaryEmailError('');
            return true;
        } catch {
            setPrimaryEmailStatus('idle');
            setPrimaryEmailError('Não foi possível validar este e-mail agora. Tente novamente.');
            return false;
        } finally {
            setCheckingPrimaryEmail(false);
        }
    };

    useEffect(() => {
        const currentDraft: OnboardingDraft = {
            step,
            artistId,
            identifier,
            identifierType: 'email',
            identifierVerified: isPrimaryIdentifierVerified,
            backupIdentifierVerified: isBackupIdentifierVerified,
            username,
            nickname: fullName,
            profileImageUrl,
            backupIdentifier: backupId,
            demographics: {
                city: [city, country].filter(Boolean).join(', '),
                birthDate,
                gender,
            },
        };
        onUpdateDraft(currentDraft);
    }, [artistId, backupId, birthDate, city, country, fullName, gender, identifier, isBackupIdentifierVerified, isPrimaryIdentifierVerified, onUpdateDraft, profileImageUrl, step, username]);

    useEffect(() => {
        if (!hasInitializedPrimaryVerificationRef.current) {
            hasInitializedPrimaryVerificationRef.current = true;
            return;
        }
        setPrimaryIdentifierVerified(false);
        setPrimaryVerificationSession(null);
        setPrimaryVerificationHint(null);
        setPrimaryVerificationError('');
        setPrimaryEmailStatus('idle');
        setPrimaryEmailError('');
        setOtp(['', '', '', '', '', '']);
    }, [identifier]);

    useEffect(() => {
        if (!hasInitializedBackupVerificationRef.current) {
            hasInitializedBackupVerificationRef.current = true;
            return;
        }
        setBackupIdentifierVerified(false);
        setBackupVerificationSession(null);
        setBackupVerificationHint(null);
        setBackupVerificationError('');
        setOtp(['', '', '', '', '', '']);
    }, [backupId]);

    useEffect(() => {
        const cleanName = username.replace('@', '').toLowerCase();
        if (cleanName.length < 3) {
            setUsernameStatus('idle');
            setUsernameError('');
            return;
        }

        setIsVerifyingUsername(true);
        const timer = window.setTimeout(() => {
            void checkUsernameAvailability(cleanName)
                .then((result) => {
                    setIsVerifyingUsername(false);
                    if (!result.available) {
                        setUsernameStatus('taken');
                        setUsernameError(result.reason ?? 'Este nome de usuário já está em uso.');
                        return;
                    }

                    setUsernameStatus('available');
                    setUsernameError('');
                })
                .catch(() => {
                    setIsVerifyingUsername(false);
                    setUsernameStatus('idle');
                    setUsernameError('Não foi possível validar o nome agora. Tente novamente.');
                });
        }, 700);

        return () => window.clearTimeout(timer);
    }, [username]);

    useEffect(() => {
        const normalizedEmail = identifier.trim().toLowerCase();
        if (!normalizedEmail.includes('@')) {
            setPrimaryEmailStatus('idle');
            setPrimaryEmailError('');
            return;
        }

        let isCurrent = true;
        setCheckingPrimaryEmail(true);
        setPrimaryEmailError('');
        const timer = window.setTimeout(() => {
            void checkEmailAvailability(normalizedEmail, { excludeInternalUserId: internalUserId })
                .then((result) => {
                    if (!isCurrent) return;
                    if (!result.available) {
                        setPrimaryEmailStatus('taken');
                        setPrimaryEmailError(result.reason ?? 'Já existe uma conta cadastrada com este e-mail.');
                        return;
                    }
                    setPrimaryEmailStatus('available');
                    setPrimaryEmailError('');
                })
                .catch(() => {
                    if (!isCurrent) return;
                    setPrimaryEmailStatus('idle');
                    setPrimaryEmailError('Não foi possível validar este e-mail agora. Tente novamente.');
                })
                .finally(() => {
                    if (!isCurrent) return;
                    setCheckingPrimaryEmail(false);
                });
        }, 450);

        return () => {
            isCurrent = false;
            window.clearTimeout(timer);
        };
    }, [identifier, internalUserId]);

    useEffect(() => {
        if (step === 2 || step === 4) {
            setOtp(['', '', '', '', '', '']);
        }
    }, [step]);

    useEffect(() => {
        if (step !== 3) {
            hasAutoScrolledToPasswordRef.current = false;
            return;
        }

        if (usernameStatus !== 'available') {
            hasAutoScrolledToPasswordRef.current = false;
            return;
        }

        if (hasAutoScrolledToPasswordRef.current) {
            return;
        }

        const timer = window.setTimeout(() => {
            passwordSectionRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
            hasAutoScrolledToPasswordRef.current = true;
        }, 180);

        return () => window.clearTimeout(timer);
    }, [step, usernameStatus]);

    const sendPrimaryVerificationCode = async (): Promise<boolean> => {
        const normalizedDestination = identifier.trim();
        if (!primaryIdentifierIsValid) {
            setPrimaryVerificationError('Informe um e-mail válido para continuar.');
            return false;
        }

        const isEmailAvailable = await ensurePrimaryEmailAvailability(normalizedDestination);
        if (!isEmailAvailable) {
            return false;
        }

        setSendingPrimaryCode(true);
        setPrimaryVerificationError('');
        setPrimaryVerificationHint(null);
        try {
            const result = await startVerification({
                channel: 'email',
                destination: normalizedDestination,
                purpose: 'onboarding_primary',
            });

            if (!result.success || !result.session) {
                setPrimaryVerificationError(result.reason ?? 'Não foi possível enviar o código agora.');
                return false;
            }

            setPrimaryVerificationSession(result.session);
            setPrimaryVerificationHint(result.developmentCodeHint ?? null);
            return true;
        } catch {
            setPrimaryVerificationError('Erro ao enviar código. Tente novamente em instantes.');
            return false;
        } finally {
            setSendingPrimaryCode(false);
        }
    };

    const verifyPrimaryCode = async (): Promise<boolean> => {
        if (!primaryVerificationSession) {
            setPrimaryVerificationError('Solicite um novo código para validar seu acesso.');
            return false;
        }

        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            setPrimaryVerificationError('Digite os 6 dígitos do código para continuar.');
            return false;
        }

        setVerifyingPrimaryCode(true);
        setPrimaryVerificationError('');
        try {
            const result = await verifyCode({
                session: primaryVerificationSession,
                code: otpCode,
            });

            if (!result.success) {
                setPrimaryVerificationError(result.reason ?? 'Código inválido. Tente novamente.');
                return false;
            }

            setPrimaryIdentifierVerified(true);
            setPrimaryVerificationHint(null);
            setStep(3);
            setOtp(['', '', '', '', '', '']);
            return true;
        } catch {
            setPrimaryVerificationError('Erro ao validar código. Tente novamente.');
            return false;
        } finally {
            setVerifyingPrimaryCode(false);
        }
    };

    const sendBackupVerificationCode = async (): Promise<boolean> => {
        if (!secondaryIdentifierIsValid) {
            setBackupVerificationError('Informe um celular válido para continuar.');
            return false;
        }

        setSendingBackupCode(true);
        setBackupVerificationError('');
        setBackupVerificationHint(null);
        try {
            const result = await startVerification({
                channel: 'phone',
                destination: backupId.trim(),
                purpose: 'onboarding_backup',
            });

            if (!result.success || !result.session) {
                setBackupVerificationError(result.reason ?? 'Não foi possível enviar o código agora.');
                return false;
            }

            setBackupVerificationSession(result.session);
            setBackupVerificationHint(result.developmentCodeHint ?? null);
            setOtp(['', '', '', '', '', '']);
            return true;
        } catch {
            setBackupVerificationError('Erro ao enviar código. Tente novamente em instantes.');
            return false;
        } finally {
            setSendingBackupCode(false);
        }
    };

    const verifyBackupCode = async (): Promise<boolean> => {
        if (!backupVerificationSession) {
            setBackupVerificationError('Solicite um novo código para validar este canal.');
            return false;
        }

        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            setBackupVerificationError('Digite os 6 dígitos do código para continuar.');
            return false;
        }

        setVerifyingBackupCode(true);
        setBackupVerificationError('');
        try {
            const result = await verifyCode({
                session: backupVerificationSession,
                code: otpCode,
            });

            if (!result.success) {
                setBackupVerificationError(result.reason ?? 'Código inválido. Tente novamente.');
                return false;
            }

            setBackupIdentifierVerified(true);
            setBackupVerificationHint(null);
            setStep(6);
            setOtp(['', '', '', '', '', '']);
            return true;
        } catch {
            setBackupVerificationError('Erro ao validar código. Tente novamente.');
            return false;
        } finally {
            setVerifyingBackupCode(false);
        }
    };

    const handleNext = async () => {
        if (step === 1) {
            const hasSent = await sendPrimaryVerificationCode();
            if (hasSent) {
                setStep(2);
            }
            return;
        }

        if (step === 2) {
            await verifyPrimaryCode();
            return;
        }

        if (step === 4) {
            if (backupVerificationSession) {
                await verifyBackupCode();
            } else {
                await sendBackupVerificationCode();
            }
            return;
        }

        setStep((previousStep) => previousStep + 1);
    };

    const handleBack = () => {
        if (step === 1) {
            setExitConfirmVisible(true);
            return;
        }

        setStep((previousStep) => previousStep - 1);
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) {
            return;
        }

        const nextOtp = [...otp];
        nextOtp[index] = value.slice(-1);
        setOtp(nextOtp);

        if (!value || index >= 5) {
            return;
        }

        const nextInputId = step === 4 ? `otp-secondary-${index + 1}` : `otp-${index + 1}`;
        document.getElementById(nextInputId)?.focus();
    };

    const handleFinalSubmit = () => {
        const normalizedUsername = `@${username.replace('@', '')}`;
        const finalEmail = identifier;
        const finalPhone = backupId;
        const finalEmailVerified = isPrimaryIdentifierVerified;
        const finalPhoneVerified = isBackupIdentifierVerified;

        onComplete({
            email: finalEmail,
            phone: finalPhone,
            password,
            emailVerified: finalEmailVerified,
            phoneVerified: finalPhoneVerified,
            fullName: fullName.trim(),
            username: normalizedUsername,
            nickname: normalizedUsername,
            profileImageUrl: profileImageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username || 'clser-user'}`,
            demographics: {
                city: [city, country].filter(Boolean).join(', '),
                birthDate,
                gender,
            },
        });
    };

    const cleanUsername = username.replace('@', '');
    const previewUsername = cleanUsername || 'seu_nome';
    const previewHandle = `@${previewUsername}`;
    const previewAvatar = profileImageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${previewUsername}`;
    const secondaryIdentifierLabel = 'Celular de segurança';
    const secondaryIdentifierPlaceholder = '+55 11 99999-9999';
    const secondaryIdentifierIsValid = backupId.replace(/\D/g, '').length >= 10;
    const primaryIdentifierIsValid = identifier.includes('@');
    const isPrimaryEmailBlocked = isCheckingPrimaryEmail || primaryEmailStatus === 'taken';
    const hasMinLength = password.length >= 6;
    const hasNumber = /\d/.test(password);
    const passwordsMatch = password.length > 0 && password === confirmPassword;
    const isProfileReady = Boolean(fullName.trim() && country.trim() && city.trim() && birthDate);
    const hasBothIdentifiersVerified = isPrimaryIdentifierVerified && isBackupIdentifierVerified;

    const onboardingPhases = useMemo(
        () => [
            { label: 'Acesso', description: 'Confirme seu e-mail principal para proteger sua conta.', steps: [1, 2] },
            { label: 'Conta', description: 'Escolha o @username que será visível no app e crie sua senha.', steps: [3] },
            { label: 'Segurança', description: 'Vincule e valide seu celular para recuperação de acesso.', steps: [4] },
            { label: 'Perfil', description: 'Complete seus dados privados e ajuste sua foto.', steps: [6, 7] },
            { label: 'Finalização', description: 'Revise a conta, confirme o preview e conclua o cadastro.', steps: [8] },
        ],
        []
    );

    const currentPhaseIndex = onboardingPhases.findIndex((phase) => phase.steps.includes(step));
    const currentPhase = onboardingPhases[Math.max(currentPhaseIndex, 0)];
    const remainingPhases = Math.max(onboardingPhases.length - currentPhaseIndex - 1, 0);
    const progressPercent = ((currentPhaseIndex + 1) / onboardingPhases.length) * 100;

    return (
        <>
            <div className="bg-white text-gray-900 w-full min-h-[100dvh] flex flex-col px-6 pb-8 animate-fade-in overflow-y-auto no-scrollbar relative">
                <div className="sticky top-0 z-20 -mx-6 mb-6 border-b border-rose-100 bg-white/95 px-6 pb-4 pt-5 backdrop-blur-xl">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handleBack}
                            className="rounded-2xl p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-900"
                            aria-label="Voltar"
                        >
                            <Icon name="arrowLeft" className="w-7 h-7" />
                        </button>
                        <div className="text-center">
                            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-rose-500">
                                Etapa {currentPhaseIndex + 1} de {onboardingPhases.length}
                            </p>
                            <p className="mt-1 text-sm font-black text-gray-900">{currentPhase.label}</p>
                        </div>
                        <button
                            onClick={() => setExitConfirmVisible(true)}
                            className="rounded-2xl p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-900"
                            aria-label="Sair do cadastro"
                        >
                            <Icon name="close" className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="mt-4">
                        <div className="h-1.5 overflow-hidden rounded-full bg-rose-100">
                            <div
                                className="h-full rounded-full bg-[linear-gradient(90deg,#ff8a1f,#ff5f44,#ff4d63)] transition-all duration-500 ease-out"
                                style={{ width: `${progressPercent}%` }}
                            ></div>
                        </div>
                        <div className="mt-2 flex items-center justify-between gap-3 text-[11px] font-medium text-gray-500">
                            <span>{currentPhase.description}</span>
                            <span className="whitespace-nowrap">
                                {remainingPhases === 0 ? 'Última etapa' : `Faltam ${remainingPhases}`}
                            </span>
                        </div>
                    </div>
                </div>

                {step === 1 && (
                    <div className="flex flex-col flex-grow animate-fade-in">
                        <h1 className="mt-8 text-3xl font-black leading-tight">Qual é seu e-mail de acesso?</h1>
                        <p className="mt-2 mb-10 text-gray-500 font-medium">
                            O cadastro sempre começa pelo e-mail. Depois vamos vincular e validar seu celular como segundo fator de segurança.
                        </p>

                        <div className="space-y-4">
                            <label className={onboardingLabelClassName}>Seu melhor e-mail</label>
                            <Input
                                type="email"
                                value={identifier}
                                onChange={(event) => setIdentifier(event.target.value)}
                                onBlur={() => {
                                    if (identifier.trim().includes('@')) {
                                        void ensurePrimaryEmailAvailability(identifier);
                                    }
                                }}
                                placeholder="voce@email.com"
                                className={onboardingInputClassName}
                            />
                        </div>

                        {(isCheckingPrimaryEmail || primaryEmailStatus !== 'idle' || primaryEmailError) && (
                            <div
                                className={`mt-4 rounded-2xl border p-4 ${
                                    primaryEmailStatus === 'taken' || primaryEmailError
                                        ? 'border-rose-100 bg-rose-50'
                                        : primaryEmailStatus === 'available'
                                            ? 'border-green-100 bg-green-50'
                                            : 'border-blue-100 bg-blue-50'
                                }`}
                            >
                                <p
                                    className={`text-sm font-semibold leading-relaxed ${
                                        primaryEmailStatus === 'taken' || primaryEmailError
                                            ? 'text-rose-700'
                                            : primaryEmailStatus === 'available'
                                                ? 'text-green-700'
                                                : 'text-blue-700'
                                    }`}
                                >
                                    {isCheckingPrimaryEmail
                                        ? 'Verificando disponibilidade do e-mail...'
                                        : primaryEmailStatus === 'taken'
                                            ? primaryEmailError || 'Já existe uma conta cadastrada com este e-mail.'
                                            : primaryEmailStatus === 'available'
                                                ? 'E-mail disponível. Você pode continuar.'
                                                : primaryEmailError}
                                </p>
                            </div>
                        )}

                        <div className="mt-6 rounded-3xl border border-amber-100 bg-amber-50/80 p-5">
                            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-600">O que acontece depois</p>
                            <p className="mt-2 text-sm font-medium leading-relaxed text-amber-950">
                                Você valida seu e-mail, define seu @username e senha, e finaliza a segurança com celular no mesmo bloco da etapa seguinte.
                            </p>
                        </div>

                        <Button
                            onClick={handleNext}
                            disabled={!primaryIdentifierIsValid || isSendingPrimaryCode || isPrimaryEmailBlocked}
                            className="mt-auto h-14 w-full rounded-2xl bg-gray-900 text-sm font-black text-white shadow-xl hover:bg-gray-900/95"
                        >
                            {isSendingPrimaryCode ? 'Enviando...' : 'Continuar'}
                        </Button>
                    </div>
                )}

                {step === 2 && (
                    <div className="flex flex-col flex-grow animate-fade-in">
                        <h1 className="mt-8 text-3xl font-black leading-tight">Validando seu acesso</h1>
                        <p className="mt-2 mb-8 text-gray-500 font-medium">
                            Enviamos um código de 6 dígitos para <span className="font-black text-rose-500">{identifier}</span>.
                        </p>

                        <div className="mb-8 flex justify-center gap-2">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    inputMode="numeric"
                                    value={digit}
                                    onChange={(event) => handleOtpChange(index, event.target.value)}
                                    className="h-14 w-11 rounded-xl border-2 border-gray-100 bg-gray-50 text-center text-2xl font-black shadow-sm outline-none focus:ring-2 focus:ring-rose-500"
                                />
                            ))}
                        </div>

                        <div className="rounded-3xl border border-blue-100 bg-blue-50 p-5">
                            <p className="text-sm font-medium leading-relaxed text-blue-900">
                                Esse código confirma que o canal é seu e evita a criação de contas duplicadas.
                            </p>
                        </div>

                        {primaryVerificationError && (
                            <div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 p-4">
                                <p className="text-sm font-semibold leading-relaxed text-rose-700">{primaryVerificationError}</p>
                            </div>
                        )}

                        {primaryVerificationHint && (
                            <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4">
                                <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-600">Código de teste</p>
                                <p className="mt-2 text-2xl font-black tracking-[0.22em] text-amber-900">{primaryVerificationHint}</p>
                            </div>
                        )}

                        <div className="mt-6 space-y-4 text-center">
                            <button
                                onClick={() => {
                                    void sendPrimaryVerificationCode();
                                }}
                                className="text-xs font-black uppercase tracking-widest text-rose-500 hover:underline disabled:opacity-50"
                                disabled={isSendingPrimaryCode}
                            >
                                {isSendingPrimaryCode ? 'Reenviando...' : 'Reenviar código'}
                            </button>
                            <button
                                onClick={() => setStep(1)}
                                className="block w-full text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-600"
                            >
                                Alterar e-mail
                            </button>
                        </div>

                        <Button
                            onClick={handleNext}
                            disabled={otp.some((digit) => !digit) || isVerifyingPrimaryCode || isSendingPrimaryCode}
                            className="mt-auto h-14 w-full rounded-2xl bg-gray-900 text-sm font-black text-white shadow-xl hover:bg-gray-900/95"
                        >
                            {isVerifyingPrimaryCode ? 'Validando...' : 'Verificar código'}
                        </Button>
                    </div>
                )}

                {step === 3 && (
                    <div className="flex flex-col flex-grow animate-fade-in">
                        <h1 className="mt-8 text-3xl font-black leading-tight">Escolha seu nome de usuário</h1>
                        <p className="mt-2 mb-6 text-gray-500 font-medium">
                            É assim que artistas e fãs vão encontrar você na Clser. Seu nome real continua privado.
                        </p>

                        <div className="space-y-6">
                            <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl font-black text-rose-500">@</span>
                                <Input
                                    type="text"
                                    value={cleanUsername}
                                    onChange={(event) => setUsername(event.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ''))}
                                    placeholder="seu_nome"
                                    className={`w-full rounded-2xl border-2 bg-gray-50 p-5 pl-11 pr-12 text-xl font-bold outline-none transition-all ${
                                        usernameStatus === 'taken'
                                            ? 'border-rose-300 focus-visible:ring-rose-500'
                                            : usernameStatus === 'available'
                                                ? 'border-green-300 focus-visible:ring-green-500'
                                                : 'border-gray-100 focus-visible:border-rose-300 focus-visible:ring-rose-500/30'
                                    }`}
                                />
                                {isVerifyingUsername && (
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2">
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-rose-500 border-t-transparent"></div>
                                    </div>
                                )}
                                {usernameStatus === 'available' && !isVerifyingUsername && (
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-green-500">
                                        <Icon name="check-circle" className="h-6 w-6" />
                                    </div>
                                )}
                            </div>

                            {usernameError ? (
                                <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4">
                                    <p className="text-sm font-bold leading-relaxed text-rose-600">{usernameError}</p>
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                                    <p className="text-sm font-bold leading-relaxed text-blue-700">
                                        Apenas o {previewHandle} será visível para artistas e outros fãs. Seu nome real não aparece publicamente.
                                    </p>
                                </div>
                            )}

                            <div className="overflow-hidden rounded-[1.75rem] border border-gray-100 bg-white shadow-lg shadow-rose-100/40">
                                <div className="border-b border-gray-100 bg-gradient-to-r from-[#ff8a1f] via-[#ff5f44] to-[#ff4d63] px-5 py-4 text-white">
                                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/75">Preview público</p>
                                    <p className="mt-1 text-lg font-black">É assim que você vai aparecer no app</p>
                                </div>
                                <div className="flex items-center gap-4 px-5 py-5">
                                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-4 border-rose-50 bg-gray-100">
                                        <img src={previewAvatar} alt="Preview do avatar" className="h-full w-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="text-base font-black text-gray-900">{previewHandle}</p>
                                        <p className="mt-1 text-sm font-medium text-gray-500">Fã da comunidade Clser</p>
                                    </div>
                                </div>
                            </div>

                            {usernameStatus === 'available' ? (
                                <div ref={passwordSectionRef} className="space-y-6 rounded-[1.75rem] border border-rose-100 bg-rose-50/40 p-5 animate-fade-in">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-rose-500">Próximo passo</p>
                                        <h2 className="mt-2 text-xl font-black text-gray-900">Agora crie sua senha</h2>
                                        <p className="mt-1 text-sm font-medium text-gray-500">
                                            Seu {previewHandle} já está livre. Falta só proteger a conta para continuar.
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="relative">
                                            <label className={`${onboardingLabelClassName} mb-2`}>Crie uma senha</label>
                                            <Input
                                                type={showPassword ? 'text' : 'password'}
                                                value={password}
                                                onChange={(event) => setPassword(event.target.value)}
                                                placeholder="Use pelo menos 6 caracteres"
                                                className={`${onboardingInputClassName} pr-14`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((current) => !current)}
                                                className="absolute right-4 top-[2.2rem] -translate-y-1/2 p-2 text-gray-400"
                                            >
                                                <Icon name={showPassword ? 'eye-slash' : 'eye'} className="h-6 w-6" />
                                            </button>
                                        </div>

                                        <div className="relative">
                                            <label className={`${onboardingLabelClassName} mb-2`}>Confirme a senha</label>
                                            <Input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                value={confirmPassword}
                                                onChange={(event) => setConfirmPassword(event.target.value)}
                                                placeholder="Repita a mesma senha"
                                                className={`${onboardingInputClassName} pr-14 ${
                                                    confirmPassword.length > 0
                                                        ? passwordsMatch
                                                            ? 'border-green-100 focus-visible:border-green-300 focus-visible:ring-green-500/30'
                                                            : 'border-rose-100 focus-visible:border-rose-300 focus-visible:ring-rose-500/30'
                                                        : ''
                                                }`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword((current) => !current)}
                                                className="absolute right-4 top-[2.2rem] -translate-y-1/2 p-2 text-gray-400"
                                            >
                                                <Icon name={showConfirmPassword ? 'eye-slash' : 'eye'} className="h-6 w-6" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-3 rounded-2xl border border-gray-100 bg-white p-5">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sua senha precisa ter</p>
                                        <div className="flex items-center gap-2">
                                            <div className={`flex h-4 w-4 items-center justify-center rounded-full ${hasMinLength ? 'bg-green-500' : 'bg-gray-200'}`}>
                                                <Icon name="check" className="h-2.5 w-2.5 text-white stroke-[4]" />
                                            </div>
                                            <span className={`text-xs font-bold ${hasMinLength ? 'text-green-600' : 'text-gray-400'}`}>Pelo menos 6 caracteres</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className={`flex h-4 w-4 items-center justify-center rounded-full ${hasNumber ? 'bg-green-500' : 'bg-gray-200'}`}>
                                                <Icon name="check" className="h-2.5 w-2.5 text-white stroke-[4]" />
                                            </div>
                                            <span className={`text-xs font-bold ${hasNumber ? 'text-green-600' : 'text-gray-400'}`}>Pelo menos um número</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className={`flex h-4 w-4 items-center justify-center rounded-full ${passwordsMatch ? 'bg-green-500' : 'bg-gray-200'}`}>
                                                <Icon name="check" className="h-2.5 w-2.5 text-white stroke-[4]" />
                                            </div>
                                            <span className={`text-xs font-bold ${passwordsMatch ? 'text-green-600' : 'text-gray-400'}`}>As duas senhas coincidem</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/70 p-5">
                                    <p className="text-sm font-medium leading-relaxed text-gray-500">
                                        Assim que o {previewHandle} estiver válido e disponível, a etapa de criação de senha aparece aqui automaticamente.
                                    </p>
                                </div>
                            )}
                        </div>

                        <Button
                            onClick={handleNext}
                            disabled={usernameStatus !== 'available' || !hasMinLength || !hasNumber || !passwordsMatch}
                            className="mt-8 h-14 w-full rounded-2xl bg-gray-900 text-sm font-black text-white shadow-xl hover:bg-gray-900/95"
                        >
                            Continuar
                        </Button>
                    </div>
                )}

                {step === 4 && (
                    <div className="flex flex-col flex-grow animate-fade-in">
                        <h1 className="mt-8 text-3xl font-black leading-tight">Adicione e valide seu celular</h1>
                        <p className="mt-2 mb-10 text-gray-500 font-medium">
                            Para manter sua conta única e recuperável, precisamos vincular um celular válido e confirmar por SMS.
                        </p>

                        <div className="space-y-4">
                            <label className={onboardingLabelClassName}>{secondaryIdentifierLabel}</label>
                            <Input
                                type="tel"
                                value={backupId}
                                onChange={(event) => setBackupId(event.target.value)}
                                placeholder={secondaryIdentifierPlaceholder}
                                className={onboardingInputClassName}
                            />
                        </div>

                        <div className="mt-6 rounded-3xl border border-gray-100 bg-gray-50 p-5">
                            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-gray-400">Pilar da conta</p>
                            <p className="mt-2 text-sm font-medium leading-relaxed text-gray-700">
                                A identidade da sua conta na Clser é formada por três pilares: <span className="font-black text-gray-900">ID interno</span>, <span className="font-black text-gray-900">e-mail</span> e <span className="font-black text-gray-900">telefone</span>.
                            </p>
                        </div>

                        {backupVerificationSession && (
                            <div className="mt-6 rounded-3xl border border-blue-100 bg-blue-50 p-5">
                                <p className="text-sm font-medium leading-relaxed text-blue-900">
                                    Enviamos um código de 6 dígitos para <span className="font-black text-rose-500">{backupId}</span>. Digite abaixo para concluir a segurança da conta.
                                </p>

                                <div className="mt-5 flex justify-center gap-2">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={`otp-secondary-${index}`}
                                            type="text"
                                            inputMode="numeric"
                                            autoComplete={index === 0 ? 'one-time-code' : undefined}
                                            value={digit}
                                            onChange={(event) => handleOtpChange(index, event.target.value)}
                                            className="h-14 w-11 rounded-xl border-2 border-gray-100 bg-white text-center text-2xl font-black shadow-sm outline-none focus:ring-2 focus:ring-rose-500"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {backupVerificationError && (
                            <div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 p-4">
                                <p className="text-sm font-semibold leading-relaxed text-rose-700">{backupVerificationError}</p>
                            </div>
                        )}

                        {backupVerificationHint && (
                            <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4">
                                <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-600">Código de teste</p>
                                <p className="mt-2 text-2xl font-black tracking-[0.22em] text-amber-900">{backupVerificationHint}</p>
                            </div>
                        )}

                        {backupVerificationSession && (
                            <div className="mt-6 space-y-4 text-center">
                                <button
                                    onClick={() => {
                                        void sendBackupVerificationCode();
                                    }}
                                    className="text-xs font-black uppercase tracking-widest text-rose-500 hover:underline disabled:opacity-50"
                                    disabled={isSendingBackupCode}
                                >
                                    {isSendingBackupCode ? 'Reenviando...' : 'Reenviar código'}
                                </button>
                                <button
                                    onClick={() => {
                                        setBackupVerificationSession(null);
                                        setBackupVerificationError('');
                                        setOtp(['', '', '', '', '', '']);
                                    }}
                                    className="block w-full text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-600"
                                >
                                    Alterar telefone
                                </button>
                            </div>
                        )}

                        <Button
                            onClick={handleNext}
                            disabled={
                                backupVerificationSession
                                    ? otp.some((digit) => !digit) || isVerifyingBackupCode || isSendingBackupCode
                                    : !secondaryIdentifierIsValid || isSendingBackupCode
                            }
                            className="mt-auto h-14 w-full rounded-2xl bg-gray-900 text-sm font-black text-white shadow-xl hover:bg-gray-900/95"
                        >
                            {backupVerificationSession
                                ? isVerifyingBackupCode
                                    ? 'Validando...'
                                    : 'Confirmar verificação'
                                : isSendingBackupCode
                                    ? 'Enviando...'
                                    : 'Enviar código por SMS'}
                        </Button>
                    </div>
                )}

                {step === 6 && (
                    <div className="flex flex-col flex-grow animate-fade-in">
                        <h1 className="mt-8 text-3xl font-black leading-tight">Complete seu perfil privado</h1>
                        <p className="mt-2 mb-8 text-gray-500 font-medium">
                            Estes dados ajudam na segurança da conta e no suporte. Eles não aparecem para artistas nem para outros fãs.
                        </p>

                        <div className="space-y-5">
                            <div>
                                <label className={`${onboardingLabelClassName} mb-2`}>Nome completo privado</label>
                                <Input
                                    type="text"
                                    value={fullName}
                                    onChange={(event) => setFullName(event.target.value)}
                                    placeholder="Seu nome real"
                                    className={onboardingInputClassName}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`${onboardingLabelClassName} mb-2`}>País</label>
                                    <Input
                                        type="text"
                                        value={country}
                                        onChange={(event) => setCountry(event.target.value)}
                                        placeholder="Brasil"
                                        className={onboardingInputClassName}
                                    />
                                </div>
                                <div>
                                    <label className={`${onboardingLabelClassName} mb-2`}>Cidade</label>
                                    <Input
                                        type="text"
                                        value={city}
                                        onChange={(event) => setCity(event.target.value)}
                                        placeholder="São Paulo"
                                        className={onboardingInputClassName}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={`${onboardingLabelClassName} mb-2`}>Data de nascimento</label>
                                <Input
                                    type="date"
                                    value={birthDate}
                                    onChange={(event) => setBirthDate(event.target.value)}
                                    className={onboardingInputClassName}
                                />
                            </div>

                            <div>
                                <label className={`${onboardingLabelClassName} mb-3`}>Como isso aparece para você</label>
                                <div className="rounded-[1.75rem] border border-gray-100 bg-gray-50 p-5">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="rounded-2xl border border-white bg-white px-4 py-4 shadow-sm">
                                            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-400">Público</p>
                                            <p className="mt-2 text-lg font-black text-gray-900">{previewHandle}</p>
                                            <p className="mt-1 text-sm font-medium text-gray-500">É isso que artistas e fãs verão.</p>
                                        </div>
                                        <div className="rounded-2xl border border-white bg-white px-4 py-4 shadow-sm">
                                            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-400">Privado</p>
                                            <p className="mt-2 text-lg font-black text-gray-900">{fullName || 'Seu nome real'}</p>
                                            <p className="mt-1 text-sm font-medium text-gray-500">Só você e o suporte da Clser veem isso.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className={`${onboardingLabelClassName} mb-3`}>Gênero opcional</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {genderOptions.map((option) => (
                                        <button
                                            key={option}
                                            type="button"
                                            onClick={() => setGender(option)}
                                            className={`rounded-2xl border px-4 py-3 text-sm font-bold transition-colors ${
                                                gender === option
                                                    ? 'border-rose-300 bg-rose-50 text-rose-600'
                                                    : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-rose-200 hover:text-gray-900'
                                            }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={handleNext}
                            disabled={!isProfileReady}
                            className="mt-8 h-14 w-full rounded-2xl bg-gray-900 text-sm font-black text-white shadow-xl hover:bg-gray-900/95"
                        >
                            Continuar
                        </Button>
                    </div>
                )}

                {step === 7 && (
                    <div className="flex flex-col flex-grow animate-fade-in">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h1 className="mt-8 text-3xl font-black">Sua foto de perfil</h1>
                                <p className="mt-2 text-gray-500 font-medium">
                                    Você já vê o preview em tempo real. Se preferir, pode concluir agora e trocar depois.
                                </p>
                            </div>
                            <button
                                onClick={handleNext}
                                className="mt-8 rounded-2xl px-3 py-2 text-xs font-black uppercase tracking-widest text-rose-500"
                            >
                                Pular
                            </button>
                        </div>

                        <div className="mt-8 rounded-[1.75rem] border border-gray-100 bg-white p-5 shadow-lg shadow-rose-100/40">
                            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-rose-500">Preview público</p>
                            <div className="mt-4 flex items-center gap-4">
                                <div className="relative">
                                    <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-rose-50 bg-gray-100 shadow-lg">
                                        <img src={previewAvatar} alt="Preview do avatar" className="h-full w-full object-cover" />
                                    </div>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute -bottom-1 -right-1 rounded-full border-4 border-white bg-rose-500 p-3 text-white shadow-lg"
                                    >
                                        <Icon name="camera" className="h-5 w-5" />
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={(event) => {
                                            const file = event.target.files?.[0];
                                            if (!file) {
                                                return;
                                            }

                                            const reader = new FileReader();
                                            reader.onload = () => setProfileImageUrl(reader.result as string);
                                            reader.readAsDataURL(file);
                                        }}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </div>
                                <div>
                                    <p className="text-xl font-black text-gray-900">{previewHandle}</p>
                                    <p className="mt-1 text-sm font-medium text-gray-500">É assim que sua foto e seu nome público aparecerão.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 rounded-3xl border border-gray-100 bg-gray-50 p-5">
                            <p className="text-sm font-medium leading-relaxed text-gray-600">
                                Sua foto ajuda a reconhecer você no clube, mas não é obrigatória para concluir o cadastro agora.
                            </p>
                        </div>

                        <Button
                            onClick={handleNext}
                            className="mt-auto h-14 w-full rounded-2xl bg-gray-900 text-sm font-black text-white shadow-xl hover:bg-gray-900/95"
                        >
                            {profileImageUrl ? 'Revisar cadastro' : 'Concluir sem foto agora'}
                        </Button>
                    </div>
                )}

                {step === 8 && (
                    <div className="flex flex-col flex-grow animate-fade-in">
                        <h1 className="mt-8 text-3xl font-black leading-tight">Revise sua conta</h1>
                        <p className="mt-2 mb-8 text-gray-500 font-medium">
                            Você está pronto para entrar. Aqui está o que fica público e o que fica privado.
                        </p>

                        <div className="overflow-hidden rounded-[1.75rem] border border-gray-100 bg-white shadow-lg shadow-rose-100/40">
                            <div className="border-b border-gray-100 bg-gradient-to-r from-[#ff8a1f] via-[#ff5f44] to-[#ff4d63] px-5 py-4 text-white">
                                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/75">Como seu perfil aparece</p>
                                <p className="mt-1 text-lg font-black">Preview final do fã</p>
                            </div>
                            <div className="flex items-center gap-4 px-5 py-5">
                                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-rose-50 bg-gray-100">
                                    <img src={previewAvatar} alt="Preview final do avatar" className="h-full w-full object-cover" />
                                </div>
                                <div>
                                    <p className="text-xl font-black text-gray-900">{previewHandle}</p>
                                    <p className="mt-1 text-sm font-medium text-gray-500">Somente este nome público aparece para artistas e fãs.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 rounded-[1.75rem] border border-gray-100 bg-gray-50 p-5">
                            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-400">Conta privada</p>
                            <div className="mt-4 space-y-4">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">ID interno da conta</p>
                                    <p className="mt-1 text-base font-black text-gray-900">{internalUserId}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nome real privado</p>
                                    <p className="mt-1 text-base font-black text-gray-900">{fullName}</p>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Canal principal</p>
                                        <p className="mt-1 text-sm font-bold text-gray-900">{identifier}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Canal de segurança</p>
                                        <p className="mt-1 text-sm font-bold text-gray-900">{backupId}</p>
                                    </div>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Localização</p>
                                        <p className="mt-1 text-sm font-bold text-gray-900">{[city, country].filter(Boolean).join(', ')}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nascimento</p>
                                        <p className="mt-1 text-sm font-bold text-gray-900">{formatPrettyDate(birthDate)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
                            <p className="text-sm font-medium leading-relaxed text-emerald-900">
                                Se você sair agora, seu rascunho continua salvo neste dispositivo e pode ser retomado do ponto em que parou.
                            </p>
                        </div>

                        {!hasBothIdentifiersVerified && (
                            <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4">
                                <p className="text-sm font-semibold leading-relaxed text-amber-900">
                                    Falta concluir as verificações de e-mail e celular antes de criar sua conta.
                                </p>
                            </div>
                        )}

                        <div className="mt-auto space-y-3 pt-8">
                            <Button
                                onClick={handleFinalSubmit}
                                disabled={!hasBothIdentifiersVerified}
                                className="h-14 w-full rounded-2xl bg-gray-900 text-sm font-black text-white shadow-xl hover:bg-gray-900/95"
                            >
                                Concluir cadastro e entrar
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setStep(6)}
                                className="h-14 w-full rounded-2xl border-gray-200 text-sm font-black text-gray-600"
                            >
                                Editar meus dados
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <ModalShell
                open={isExitConfirmVisible}
                variant="dialog"
                closeOnOverlayClick
                onClose={() => setExitConfirmVisible(false)}
                className="max-w-sm rounded-[2rem]"
            >
                <ModalBody className="px-6 py-6">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-500">
                        <Icon name="question-mark-circle" className="h-8 w-8" />
                    </div>
                    <div className="mt-5 text-center">
                        <ModalTitle className="text-2xl">Sair do cadastro?</ModalTitle>
                        <p className="mt-3 text-sm font-medium leading-relaxed text-gray-500">
                            Seu progresso fica salvo neste dispositivo. Você pode continuar depois exatamente desta etapa ou descartar tudo agora.
                        </p>
                    </div>
                </ModalBody>
                <ModalFooter className="grid gap-3 border-t-0 pt-0">
                    <Button
                        variant="outline"
                        onClick={() => setExitConfirmVisible(false)}
                        className="h-12 w-full rounded-2xl border-gray-200 font-black"
                    >
                        Continuar editando
                    </Button>
                    <Button
                        onClick={() => {
                            setExitConfirmVisible(false);
                            onCancel();
                        }}
                        className="h-12 w-full rounded-2xl bg-gray-900 font-black text-white hover:bg-gray-900/95"
                    >
                        Sair e salvar rascunho
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => {
                            setExitConfirmVisible(false);
                            onDiscard();
                        }}
                        className="h-11 w-full rounded-2xl font-black text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                    >
                        Descartar cadastro
                    </Button>
                </ModalFooter>
            </ModalShell>
        </>
    );
};

export default Onboarding;
