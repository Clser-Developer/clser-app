
import { useState, useEffect } from 'react';
import { PaymentRecord, UserAddress, UserPhone, UserDemographics } from '../types';

export interface OnboardingDraft {
    step: number;
    artistId: string;
    identifier: string; // E-mail ou Telefone inicial
    identifierType: 'email' | 'phone';
    username: string; // O @ID escolhido
    nickname: string; // Nome de exibição
    profileImageUrl: string;
    demographics: UserDemographics;
    backupIdentifier?: string; // Segundo fator opcional
}

const getInitialState = () => {
    const savedStateJSON = localStorage.getItem('globalUserState');
    const draftJSON = localStorage.getItem('clser_onboarding_draft');
    
    let initialState = {
        username: '',
        nickname: 'Fã nº 1',
        profileImageUrl: 'https://picsum.photos/seed/user-profile/200/200',
        paymentMethod: 'credit-card' as const,
        paymentHistory: [] as PaymentRecord[],
        isAccountCreated: false,
        email: '',
        fullName: '',
        cpf: '',
        phone: { ddi: '+55', number: '' } as UserPhone,
        address: { cep: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '' } as UserAddress,
        demographics: { birthDate: '', city: '', gender: '' } as UserDemographics,
        hasCard: false,
        onboardingDraft: null as OnboardingDraft | null
    };

    if (savedStateJSON) {
        try {
            const savedState = JSON.parse(savedStateJSON);
            initialState = { ...initialState, ...savedState };
        } catch (e) {
            console.error("Failed to parse global user state", e);
        }
    }

    if (draftJSON) {
        try {
            initialState.onboardingDraft = JSON.parse(draftJSON);
        } catch (e) {
            console.error("Failed to parse onboarding draft", e);
        }
    }

    return initialState;
};

export const useGlobalUserState = () => {
    const [username, setUsername] = useState<string>(() => getInitialState().username);
    const [nickname, setNickname] = useState<string>(() => getInitialState().nickname);
    const [profileImageUrl, setProfileImageUrl] = useState<string>(() => getInitialState().profileImageUrl);
    const [paymentMethod, setPaymentMethod] = useState<'credit-card' | 'pix'>(() => getInitialState().paymentMethod);
    const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>(() => getInitialState().paymentHistory);
    const [isAccountCreated, setIsAccountCreated] = useState<boolean>(() => getInitialState().isAccountCreated);
    const [email, setEmail] = useState<string>(() => getInitialState().email);
    const [fullName, setFullName] = useState<string>(() => getInitialState().fullName);
    const [cpf, setCpf] = useState<string>(() => getInitialState().cpf);
    const [phone, setPhone] = useState<UserPhone>(() => getInitialState().phone);
    const [address, setAddress] = useState<UserAddress>(() => getInitialState().address);
    const [demographics, setDemographics] = useState<UserDemographics>(() => getInitialState().demographics);
    const [hasCard, setHasCard] = useState<boolean>(() => getInitialState().hasCard);
    const [onboardingDraft, setOnboardingDraft] = useState<OnboardingDraft | null>(() => getInitialState().onboardingDraft);

    useEffect(() => {
        const stateToSave = {
            username, nickname, profileImageUrl, paymentMethod, paymentHistory,
            isAccountCreated, email, fullName, cpf, phone, address, demographics, hasCard
        };
        localStorage.setItem('globalUserState', JSON.stringify(stateToSave));
    }, [username, nickname, profileImageUrl, paymentMethod, paymentHistory, isAccountCreated, email, fullName, cpf, phone, address, demographics, hasCard]);

    useEffect(() => {
        if (onboardingDraft) {
            localStorage.setItem('clser_onboarding_draft', JSON.stringify(onboardingDraft));
        } else {
            localStorage.removeItem('clser_onboarding_draft');
        }
    }, [onboardingDraft]);

    const clearOnboardingDraft = () => {
        setOnboardingDraft(null);
        localStorage.removeItem('clser_onboarding_draft');
    };

    return {
        username, setUsername,
        nickname, setNickname,
        profileImageUrl, setProfileImageUrl,
        paymentMethod, setPaymentMethod,
        paymentHistory, setPaymentHistory,
        isAccountCreated, setIsAccountCreated,
        email, setEmail,
        fullName, setFullName,
        cpf, setCpf,
        phone, setPhone,
        address, setAddress,
        demographics, setDemographics,
        hasCard, setHasCard,
        onboardingDraft, setOnboardingDraft,
        clearOnboardingDraft
    };
};
