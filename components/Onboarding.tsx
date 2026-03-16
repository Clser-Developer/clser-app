
import React, { useState, useRef, useEffect } from 'react';
import Icon from './Icon';
import { UserDemographics } from '../types';
import { OnboardingDraft } from '../hooks/useGlobalUserState';

interface OnboardingProps {
    onComplete: (details: { 
        email: string, 
        phone: string,
        username: string, 
        nickname: string, 
        profileImageUrl: string, 
        demographics: UserDemographics 
    }) => void;
    draft?: OnboardingDraft | null;
    onUpdateDraft: (draft: OnboardingDraft) => void;
    artistId: string;
    onCancel: () => void;
}

const ESTADOS_BRASIL = [
    { uf: 'AC', nome: 'Acre' }, { uf: 'AL', nome: 'Alagoas' }, { uf: 'AP', nome: 'Amapá' },
    { uf: 'AM', nome: 'Amazonas' }, { uf: 'BA', nome: 'Bahia' }, { uf: 'CE', nome: 'Ceará' },
    { uf: 'DF', nome: 'Distrito Federal' }, { uf: 'ES', nome: 'Espírito Santo' }, { uf: 'GO', nome: 'Goiás' },
    { uf: 'MA', nome: 'Maranhão' }, { uf: 'MT', nome: 'Mato Grosso' }, { uf: 'MS', nome: 'Mato Grosso do Sul' },
    { uf: 'MG', nome: 'Minas Gerais' }, { uf: 'PA', nome: 'Paraíba' }, { uf: 'PB', nome: 'Paraíba' },
    { uf: 'PR', nome: 'Paraná' }, { uf: 'PE', nome: 'Pernambuco' }, { uf: 'PI', nome: 'Piauí' },
    { uf: 'RJ', nome: 'Rio de Janeiro' }, { uf: 'RN', nome: 'Rio Grande do Norte' }, { uf: 'RS', nome: 'Rio Grande do Sul' },
    { uf: 'RO', nome: 'Rondônia' }, { uf: 'RR', nome: 'Roraima' }, { uf: 'SC', nome: 'Santa Catarina' },
    { uf: 'SP', nome: 'São Paulo' }, { uf: 'SE', nome: 'Sergipe' }, { uf: 'TO', nome: 'Tocantins' }
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, draft, onUpdateDraft, artistId, onCancel }) => {
    // Machine States: 1 (Access), 1.5 (Confirm Phone), 2 (OTP), 3 (Username & PWD), 4 (Security Backup), 5 (Personal Data), 6 (Photo), 7 (Review)
    const [step, setStep] = useState(draft?.step || 1);
    const [idType, setIdType] = useState<'email' | 'phone'>(draft?.identifierType || 'email');
    const [identifier, setIdentifier] = useState(draft?.identifier || '');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [username, setUsername] = useState(draft?.username || '');
    const [fullName, setFullName] = useState(draft?.nickname || ''); 
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [backupId, setBackupId] = useState(draft?.backupIdentifier || '');
    const [profileImageUrl, setProfileImageUrl] = useState(draft?.profileImageUrl || '');
    
    // Username validation
    const [isVerifyingUsername, setIsVerifyingUsername] = useState(false);
    const [usernameStatus, setUsernameStatus] = useState<'idle' | 'available' | 'taken'>('idle');
    const [usernameError, setUsernameError] = useState('');

    // Demographics states
    const [selectedState, setSelectedState] = useState('');
    const [city, setCity] = useState(draft?.demographics?.city || '');
    const [birthDate, setBirthDate] = useState(draft?.demographics?.birthDate || '');
    const [gender, setGender] = useState<UserDemographics['gender']>(draft?.demographics?.gender || '');
    
    // City search states
    const [cities, setCities] = useState<string[]>([]);
    const [isCitiesLoading, setIsCitiesLoading] = useState(false);
    const [cityQuery, setCityQuery] = useState(draft?.demographics?.city || '');
    const [showCityDropdown, setShowCityDropdown] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const cityInputRef = useRef<HTMLDivElement>(null);

    // Sync draft on change
    useEffect(() => {
        const currentDraft: OnboardingDraft = {
            step, artistId, identifier, identifierType: idType,
            username, nickname: fullName, profileImageUrl, backupIdentifier: backupId,
            demographics: { city, birthDate, gender }
        };
        onUpdateDraft(currentDraft);
    }, [step, idType, identifier, username, fullName, profileImageUrl, backupId, city, birthDate, gender, artistId]);

    // Simulated username verification
    useEffect(() => {
        const cleanName = username.replace('@', '').toLowerCase();
        if (cleanName.length < 3) {
            setUsernameStatus('idle');
            setUsernameError('');
            return;
        }

        setIsVerifyingUsername(true);
        const timer = setTimeout(() => {
            setIsVerifyingUsername(false);
            if (cleanName === 'andre') {
                setUsernameStatus('taken');
                setUsernameError('Este nome de usuário já está em uso. Que tal tentar um diferente?');
            } else {
                setUsernameStatus('available');
                setUsernameError('');
            }
        }, 800);

        return () => clearTimeout(timer);
    }, [username]);

    // Fetch cities when state changes
    useEffect(() => {
        if (!selectedState) {
            setCities([]);
            return;
        }
        setIsCitiesLoading(true);
        fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedState}/municipios`)
            .then(res => res.json())
            .then(data => {
                const cityNames = data.map((c: any) => c.nome);
                setCities(cityNames);
                setIsCitiesLoading(false);
            })
            .catch(() => setIsCitiesLoading(false));
    }, [selectedState]);

    const handleNext = () => {
        if (step === 1 && idType === 'phone') setStep(1.5);
        else setStep(s => s + 1);
    };

    const handleBack = () => {
        if (step === 1) onCancel();
        else if (step === 2 && idType === 'phone') setStep(1.5);
        else if (step === 1.5) setStep(1);
        else setStep(s => s - 1);
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };

    const handleFinalSubmit = () => {
        const finalEmail = idType === 'email' ? identifier : backupId;
        const finalPhone = idType === 'phone' ? identifier : backupId;

        onComplete({
            email: finalEmail,
            phone: finalPhone,
            username: `@${username.replace('@', '')}`,
            nickname: fullName || username,
            profileImageUrl: profileImageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
            demographics: { city: `${city} - ${selectedState}`, birthDate, gender }
        });
    };

    const ProgressBar = () => (
        <div className="fixed top-0 left-0 w-full h-1.5 bg-gray-100 z-50">
            <div 
                className="h-full bg-rose-500 transition-all duration-500 ease-out" 
                style={{ width: `${(step / 7) * 100}%` }}
            ></div>
        </div>
    );

    const filteredCities = cities.filter(c => 
        c.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(
            cityQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        )
    ).slice(0, 10);

    // Password requirements checks
    const hasMinLength = password.length >= 6;
    const hasNumber = /\d/.test(password);
    const passwordsMatch = password.length > 0 && password === confirmPassword;

    return (
        <div className="bg-white text-gray-900 w-full h-full flex flex-col p-6 animate-fade-in overflow-y-auto no-scrollbar relative pt-12">
            <ProgressBar />
            
            <button 
                onClick={handleBack}
                className="absolute top-6 left-4 p-2 text-gray-400 hover:text-gray-900 transition-colors"
            >
                <Icon name="arrowLeft" className="w-7 h-7" />
            </button>

            {/* STEP 1: IDENTIFIER */}
            {step === 1 && (
                <div className="flex flex-col flex-grow animate-fade-in">
                    <h1 className="text-3xl font-black mb-2 mt-8 leading-tight">Como deseja começar?</h1>
                    <p className="text-gray-500 mb-10 font-medium">Escolha sua forma de acesso principal.</p>
                    
                    <div className="flex bg-gray-50 p-1 rounded-2xl mb-8 border border-gray-100">
                        <button 
                            onClick={() => setIdType('email')}
                            className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${idType === 'email' ? 'bg-white text-rose-500 shadow-sm' : 'text-gray-400'}`}
                        >
                            E-mail
                        </button>
                        <button 
                            onClick={() => setIdType('phone')}
                            className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${idType === 'phone' ? 'bg-white text-rose-500 shadow-sm' : 'text-gray-400'}`}
                        >
                            Celular
                        </button>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
                            {idType === 'email' ? 'Seu melhor e-mail' : 'Número com DDD'}
                        </label>
                        <input
                            type={idType === 'email' ? 'email' : 'tel'}
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            placeholder={idType === 'email' ? 'exemplo@email.com' : '(00) 00000-0000'}
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-5 text-xl font-bold focus:ring-2 focus:ring-rose-500 outline-none transition-all"
                        />
                    </div>

                    <button 
                        onClick={handleNext}
                        disabled={idType === 'email' ? !identifier.includes('@') : identifier.length < 10}
                        className="mt-auto mb-8 w-full bg-gray-900 text-white font-black py-5 rounded-2xl shadow-xl active:scale-95 transition-all disabled:bg-gray-200 disabled:text-gray-400"
                    >
                        Continuar
                    </button>
                </div>
            )}

            {/* STEP 1.5: CONFIRM PHONE */}
            {step === 1.5 && (
                <div className="flex flex-col flex-grow animate-fade-in text-center justify-center">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-green-100">
                        <Icon name="check" className="w-10 h-10 text-green-500 stroke-[4]" />
                    </div>
                    <h1 className="text-3xl font-black mb-2 leading-tight">Confirme seu número</h1>
                    <p className="text-gray-500 mb-10 font-medium">Este é o número correto para receber o SMS?</p>
                    
                    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 mb-10">
                        <p className="text-3xl font-black text-gray-900 tracking-tight">{identifier}</p>
                    </div>

                    <div className="w-full space-y-3">
                        <button 
                            onClick={() => setStep(2)}
                            className="w-full bg-gray-900 text-white font-black py-5 rounded-2xl shadow-xl active:scale-95 transition-all"
                        >
                            Sim, enviar código
                        </button>
                        <button 
                            onClick={() => setStep(1)}
                            className="w-full bg-transparent text-gray-400 font-bold py-3 text-sm uppercase tracking-widest hover:text-rose-500"
                        >
                            Não, alterar número
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 2: OTP */}
            {step === 2 && (
                <div className="flex flex-col flex-grow animate-fade-in">
                    <h1 className="text-3xl font-black mb-2 mt-8 leading-tight">Validando acesso</h1>
                    <p className="text-gray-500 mb-8 font-medium">
                        Enviamos um código de 6 dígitos para: <br/>
                        <span className="text-rose-500 font-bold">{identifier}</span>
                    </p>
                    
                    <div className="flex gap-2 justify-center mb-8">
                        {otp.map((digit, idx) => (
                            <input
                                key={idx}
                                id={`otp-${idx}`}
                                type="text"
                                inputMode="numeric"
                                value={digit}
                                onChange={(e) => handleOtpChange(idx, e.target.value)}
                                className="w-11 h-14 bg-gray-50 border-2 border-gray-100 rounded-xl text-center text-2xl font-black focus:ring-2 focus:ring-rose-500 outline-none shadow-sm"
                            />
                        ))}
                    </div>

                    <div className="text-center space-y-4">
                        <button className="text-rose-500 font-bold text-xs uppercase tracking-widest hover:underline">Reenviar código</button>
                        <button 
                            onClick={() => setStep(1)}
                            className="block w-full text-gray-400 font-bold text-xs uppercase tracking-widest hover:text-gray-600"
                        >
                            {idType === 'email' ? 'E-mail incorreto? Alterar' : 'Número incorreto? Alterar'}
                        </button>
                    </div>

                    <button 
                        onClick={handleNext}
                        disabled={otp.some(d => !d)}
                        className="mt-auto mb-8 w-full bg-gray-900 text-white font-black py-5 rounded-2xl shadow-xl active:scale-95 transition-all"
                    >
                        Verificar Código
                    </button>
                </div>
            )}

            {/* STEP 3: USERNAME & PASSWORD */}
            {step === 3 && (
                <div className="flex flex-col flex-grow animate-fade-in">
                    <h1 className="text-3xl font-black mb-2 mt-8 leading-tight">Nome de usuário</h1>
                    <p className="text-gray-500 mb-6 font-medium">Escolha como você será identificado na comunidade Clser.</p>

                    <div className="space-y-6">
                        <div className="relative">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl font-black text-rose-500">@</span>
                            <input
                                type="text"
                                value={username.replace('@', '')}
                                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ''))}
                                placeholder="seu_nome"
                                className={`w-full bg-gray-50 border-2 rounded-2xl p-5 pl-11 text-xl font-bold focus:ring-2 outline-none transition-all ${
                                    usernameStatus === 'taken' ? 'border-rose-300 focus:ring-rose-500' : 
                                    usernameStatus === 'available' ? 'border-green-300 focus:ring-green-500' : 
                                    'border-gray-100 focus:ring-rose-500'
                                }`}
                            />
                            {isVerifyingUsername && (
                                <div className="absolute right-5 top-1/2 -translate-y-1/2">
                                    <div className="w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                            {usernameStatus === 'available' && !isVerifyingUsername && (
                                <div className="absolute right-5 top-1/2 -translate-y-1/2">
                                    <Icon name="check-circle" className="w-6 h-6 text-green-500" />
                                </div>
                            )}
                        </div>

                        {usernameError && (
                            <p className="text-xs font-bold text-rose-500 bg-rose-50 p-4 rounded-xl border border-rose-100">
                                {usernameError}
                            </p>
                        )}

                        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                            <p className="text-xs text-blue-700 font-bold leading-relaxed">
                                <Icon name="eye" className="w-4 h-4 inline mr-1 align-text-top"/>
                                Escolha com atenção! Outros usuários e artistas te encontrarão por este nome.
                            </p>
                        </div>
                        
                        {/* PROGRESSIVE DISCLOSURE: PASSWORD FIELDS ONLY IF USERNAME IS AVAILABLE */}
                        {usernameStatus === 'available' && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="space-y-4">
                                    <div className="relative">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-2">Defina uma senha</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Sua senha secreta"
                                                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-5 text-xl font-bold focus:ring-2 focus:ring-rose-500 outline-none pr-14"
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 p-2"
                                            >
                                                <Icon name={showPassword ? "eye-slash" : "eye"} className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-2">Confirme sua senha</label>
                                        <div className="relative">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="Repita a mesma senha"
                                                className={`w-full bg-gray-50 border-2 rounded-2xl p-5 text-xl font-bold focus:ring-2 outline-none pr-14 transition-colors ${confirmPassword.length > 0 ? (passwordsMatch ? 'border-green-100 focus:ring-green-500' : 'border-rose-100 focus:ring-rose-500') : 'border-gray-100 focus:ring-rose-500'}`}
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 p-2"
                                            >
                                                <Icon name={showConfirmPassword ? "eye-slash" : "eye"} className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-3">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Critérios de segurança:</p>
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${hasMinLength ? 'bg-green-500' : 'bg-gray-200'}`}>
                                            <Icon name="check" className="w-2.5 h-2.5 text-white stroke-[4]" />
                                        </div>
                                        <span className={`text-xs font-bold ${hasMinLength ? 'text-green-600' : 'text-gray-400'}`}>Pelo menos 6 caracteres</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${hasNumber ? 'bg-green-500' : 'bg-gray-200'}`}>
                                            <Icon name="check" className="w-2.5 h-2.5 text-white stroke-[4]" />
                                        </div>
                                        <span className={`text-xs font-bold ${hasNumber ? 'text-green-600' : 'text-gray-400'}`}>Pelo menos um número</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordsMatch ? 'bg-green-500' : 'bg-gray-200'}`}>
                                            <Icon name="check" className="w-2.5 h-2.5 text-white stroke-[4]" />
                                        </div>
                                        <span className={`text-xs font-bold ${passwordsMatch ? 'text-green-600' : 'text-gray-400'}`}>As senhas devem coincidir</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <button 
                        onClick={handleNext}
                        disabled={usernameStatus !== 'available' || !hasMinLength || !hasNumber || !passwordsMatch}
                        className="mt-8 mb-8 w-full bg-gray-900 text-white font-black py-5 rounded-2xl shadow-xl active:scale-95 transition-all disabled:bg-gray-200 disabled:text-gray-400"
                    >
                        Criar minha conta
                    </button>
                </div>
            )}

            {/* STEP 4: BACKUP (OPTIONAL) */}
            {step === 4 && (
                <div className="flex flex-col flex-grow animate-fade-in">
                    <button onClick={handleNext} className="absolute top-6 right-4 text-xs font-black text-rose-500 uppercase tracking-widest py-2 px-3">Pular</button>
                    
                    <h1 className="text-3xl font-black mb-2 mt-8 leading-tight">Backup de Segurança</h1>
                    <p className="text-gray-500 mb-10 font-medium">
                        Adicione seu {idType === 'email' ? 'número de celular' : 'e-mail'} como método de recuperação secundário.
                    </p>

                    <div className="space-y-4">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
                             {idType === 'email' ? 'Celular para recuperação' : 'E-mail para recuperação'}
                        </label>
                        <input
                            type={idType === 'email' ? 'tel' : 'email'}
                            value={backupId}
                            onChange={(e) => setBackupId(e.target.value)}
                            placeholder={idType === 'email' ? '(00) 00000-0000' : 'seu@email.com'}
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-5 text-xl font-bold focus:ring-2 focus:ring-rose-500 outline-none transition-all"
                        />
                    </div>

                    <p className="text-xs text-gray-400 mt-6 font-medium leading-relaxed">
                        Recomendamos este passo para que você nunca perca o acesso às suas experiências exclusivas.
                    </p>

                    <button 
                        onClick={handleNext}
                        className="mt-auto mb-8 w-full bg-gray-900 text-white font-black py-5 rounded-2xl shadow-xl active:scale-95 transition-all"
                    >
                        Salvar e Continuar
                    </button>
                </div>
            )}

            {/* STEP 5: DADOS PESSOAIS */}
            {step === 5 && (
                <div className="flex flex-col flex-grow animate-fade-in">
                    <button onClick={handleNext} className="absolute top-6 right-4 text-xs font-black text-rose-500 uppercase tracking-widest py-2 px-3">Pular</button>
                    
                    <h1 className="text-3xl font-black mb-2 mt-8 leading-tight">Dados Pessoais</h1>
                    <p className="text-gray-500 mb-8 font-medium">Estas devem ser informações reais e serão verificadas posteriormente.</p>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-2">Seu nome completo</label>
                            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Como está no seu documento" className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 font-bold outline-none shadow-sm focus:ring-2 focus:ring-rose-500" />
                        </div>
                        
                        <div className="grid grid-cols-3 gap-3">
                            <div className="col-span-1">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-2">Estado (UF)</label>
                                <select 
                                    value={selectedState} 
                                    onChange={e => { setSelectedState(e.target.value); setCityQuery(''); setCity(''); }} 
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 font-bold outline-none shadow-sm focus:ring-2 focus:ring-rose-500 appearance-none"
                                >
                                    <option value="">UF</option>
                                    {ESTADOS_BRASIL.map(e => <option key={e.uf} value={e.uf}>{e.uf}</option>)}
                                </select>
                            </div>
                            <div className="col-span-2 relative" ref={cityInputRef}>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-2">Cidade Atual</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={cityQuery} 
                                        disabled={!selectedState}
                                        onFocus={() => setShowCityDropdown(true)}
                                        onChange={e => { setCityQuery(e.target.value); setShowCityDropdown(true); }} 
                                        placeholder={selectedState ? "Digite sua cidade" : "Escolha a UF primeiro"} 
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 font-bold outline-none shadow-sm focus:ring-2 focus:ring-rose-500 disabled:opacity-50" 
                                    />
                                    {isCitiesLoading && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                            <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                </div>
                                {showCityDropdown && filteredCities.length > 0 && (
                                    <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl max-h-48 overflow-y-auto no-scrollbar">
                                        {filteredCities.map(c => (
                                            <button 
                                                key={c} 
                                                onClick={() => { setCity(c); setCityQuery(c); setShowCityDropdown(false); }}
                                                className="w-full text-left px-5 py-3 hover:bg-rose-50 text-sm font-bold border-b border-gray-50 last:border-0 transition-colors"
                                            >
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-2">Data de Nascimento</label>
                            <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 font-bold outline-none shadow-sm focus:ring-2 focus:ring-rose-500" />
                        </div>
                    </div>

                    <button 
                        onClick={handleNext}
                        disabled={!selectedState || !city || !birthDate || !fullName}
                        className="mt-auto mb-8 w-full bg-gray-900 text-white font-black py-5 rounded-2xl shadow-xl active:scale-95 transition-all disabled:bg-gray-100 disabled:text-gray-300"
                    >
                        Salvar e Continuar
                    </button>
                </div>
            )}

            {/* STEP 6: PHOTO */}
            {step === 6 && (
                <div className="flex flex-col items-center text-center flex-grow animate-fade-in">
                    <button onClick={handleNext} className="absolute top-6 right-4 text-xs font-black text-rose-500 uppercase tracking-widest py-2 px-3">Pular</button>
                    
                    <h1 className="text-3xl font-black mb-2 mt-8">Foto de Perfil</h1>
                    <p className="text-gray-500 mb-10 font-medium px-4">Uma foto ajuda o artista e outros fãs a te reconhecerem no clube!</p>
                    
                    <div className="relative group mb-8">
                        <div className="w-40 h-40 rounded-full border-4 border-gray-50 bg-gray-100 flex items-center justify-center overflow-hidden shadow-2xl">
                            {profileImageUrl ? (
                                <img src={profileImageUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <Icon name="profile" className="w-20 h-20 text-gray-300" />
                            )}
                        </div>
                        <button 
                            onClick={() => fileInputRef.current?.click()} 
                            className="absolute bottom-1 right-1 bg-rose-500 p-3.5 rounded-full text-white border-4 border-white shadow-lg active:scale-90 transition-transform"
                        >
                            <Icon name="camera" className="w-6 h-6" />
                        </button>
                        <input type="file" ref={fileInputRef} onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                const r = new FileReader();
                                r.onload = () => setProfileImageUrl(r.result as string);
                                r.readAsDataURL(file);
                            }
                        }} accept="image/*" className="hidden" />
                    </div>

                    <div className="max-w-xs mx-auto">
                        <p className="text-xs text-gray-400 font-medium leading-relaxed italic">
                            Se optar por pular agora, usaremos uma imagem provisória para você. Lembre-se de mudar depois!
                        </p>
                    </div>

                    <button 
                        onClick={handleNext} 
                        className="mt-auto mb-8 w-full bg-rose-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-rose-500/20 active:scale-95 transition-all"
                    >
                        {profileImageUrl ? 'Ver Revisão Final' : 'Usar Provisória'}
                    </button>
                </div>
            )}

            {/* STEP 7: FINAL REVIEW & PREVIEW */}
            {step === 7 && (
                <div className="flex flex-col flex-grow animate-fade-in overflow-y-auto no-scrollbar">
                    <h1 className="text-3xl font-black mb-2 mt-8 leading-tight">Tudo pronto!</h1>
                    <p className="text-gray-500 mb-8 font-medium">Confira como você será visto na plataforma.</p>

                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-3">Sua Identidade Pública</h3>
                    
                    {/* Simulated Profile Card inside the app */}
                    <div className="bg-gradient-to-br from-rose-500 to-purple-600 p-0.5 rounded-3xl shadow-xl mb-10">
                        <div className="bg-white rounded-[1.4rem] p-6 flex flex-col items-center">
                            <div className="relative mb-4">
                                <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">
                                    {profileImageUrl ? (
                                        <img src={profileImageUrl} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <Icon name="profile" className="w-12 h-12 text-gray-300 mx-auto mt-5" />
                                    )}
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1.5 rounded-full border-2 border-white shadow-sm">
                                    <Icon name="check" className="w-3 h-3 stroke-[4]" />
                                </div>
                            </div>
                            <h4 className="text-2xl font-black text-gray-900 tracking-tight">@{username.replace('@', '')}</h4>
                            <p className="text-rose-500 font-bold text-xs uppercase tracking-[0.2em] mt-1">NOVO NO FÃ CLUBE</p>
                            
                            <div className="w-full h-px bg-gray-50 my-6"></div>
                            
                            <div className="flex justify-around w-full">
                                <div className="text-center">
                                    <p className="text-gray-400 font-black text-[9px] uppercase">Pontos</p>
                                    <p className="text-gray-900 font-bold">0</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-gray-400 font-black text-[9px] uppercase">Nível</p>
                                    <p className="text-gray-900 font-bold">Fã</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-3">Dados para Conferência</h3>
                    <div className="bg-gray-50 rounded-3xl p-6 space-y-5 border border-gray-100 mb-10">
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Nome Completo</p>
                            <p className="text-sm font-bold text-gray-900">{fullName}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Localização</p>
                                <p className="text-sm font-bold text-gray-900">{city}, {selectedState}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Nascimento</p>
                                <p className="text-sm font-bold text-gray-900">{new Date(birthDate).toLocaleDateString('pt-BR')}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Acesso Principal</p>
                            <p className="text-sm font-bold text-gray-900">{identifier}</p>
                        </div>
                    </div>

                    <div className="mt-auto space-y-3 mb-8">
                        <button 
                            onClick={handleFinalSubmit}
                            className="w-full bg-gray-900 text-white font-black py-5 rounded-2xl shadow-xl active:scale-95 transition-all"
                        >
                            Confirmar e Entrar
                        </button>
                        <button 
                            onClick={() => setStep(3)}
                            className="w-full bg-transparent text-gray-400 font-bold py-3 text-sm uppercase tracking-widest hover:text-rose-500"
                        >
                            Alterar meus dados
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Onboarding;
