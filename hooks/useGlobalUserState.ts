
import { useEffect, useMemo, useState } from 'react';
import { AccountIdentity, UserAddress, UserPhone, UserDemographics } from '../types';
import { readStorageItem, removeStorageItem, writeStorageItem } from '../lib/storage';

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

const generateInternalUserId = () => {
    const randomChunk = Math.random().toString(36).slice(2, 10).toUpperCase();
    const timestampChunk = Date.now().toString(36).slice(-6).toUpperCase();
    return `USR_${timestampChunk}${randomChunk}`;
};

const getInitialState = () => {
    const savedStateJSON = readStorageItem('globalUserState');
    const draftJSON = readStorageItem('clser_onboarding_draft');
    
    let initialState = {
        internalUserId: generateInternalUserId(),
        emailVerified: false,
        phoneVerified: false,
        username: '',
        nickname: 'Fã nº 1',
        profileImageUrl: 'https://picsum.photos/seed/user-profile/200/200',
        isAccountCreated: false,
        email: '',
        fullName: '',
        cpf: '',
        phone: { ddi: '+55', number: '' } as UserPhone,
        address: { cep: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '' } as UserAddress,
        demographics: { birthDate: '', city: '', gender: '' } as UserDemographics,
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
    const initialState = useMemo(() => getInitialState(), []);

    const [internalUserId] = useState<AccountIdentity['internalUserId']>(initialState.internalUserId);
    const [emailVerified, setEmailVerified] = useState<AccountIdentity['emailVerified']>(initialState.emailVerified);
    const [phoneVerified, setPhoneVerified] = useState<AccountIdentity['phoneVerified']>(initialState.phoneVerified);
    const [username, setUsername] = useState<string>(initialState.username);
    const [nickname, setNickname] = useState<string>(initialState.nickname);
    const [profileImageUrl, setProfileImageUrl] = useState<string>(initialState.profileImageUrl);
    const [isAccountCreated, setIsAccountCreated] = useState<boolean>(initialState.isAccountCreated);
    const [email, setEmail] = useState<string>(initialState.email);
    const [fullName, setFullName] = useState<string>(initialState.fullName);
    const [cpf, setCpf] = useState<string>(initialState.cpf);
    const [phone, setPhone] = useState<UserPhone>(initialState.phone);
    const [address, setAddress] = useState<UserAddress>(initialState.address);
    const [demographics, setDemographics] = useState<UserDemographics>(initialState.demographics);
    const [onboardingDraft, setOnboardingDraft] = useState<OnboardingDraft | null>(initialState.onboardingDraft);

    useEffect(() => {
        const stateToSave = {
            internalUserId,
            emailVerified,
            phoneVerified,
            username,
            nickname,
            profileImageUrl,
            isAccountCreated,
            email,
            fullName,
            cpf,
            phone,
            address,
            demographics,
        };
        writeStorageItem('globalUserState', JSON.stringify(stateToSave));
    }, [internalUserId, emailVerified, phoneVerified, username, nickname, profileImageUrl, isAccountCreated, email, fullName, cpf, phone, address, demographics]);

    useEffect(() => {
        if (onboardingDraft) {
            writeStorageItem('clser_onboarding_draft', JSON.stringify(onboardingDraft));
        } else {
            removeStorageItem('clser_onboarding_draft');
        }
    }, [onboardingDraft]);

    const clearOnboardingDraft = () => {
        setOnboardingDraft(null);
        removeStorageItem('clser_onboarding_draft');
    };

    return {
        internalUserId,
        emailVerified, setEmailVerified,
        phoneVerified, setPhoneVerified,
        username, setUsername,
        nickname, setNickname,
        profileImageUrl, setProfileImageUrl,
        isAccountCreated, setIsAccountCreated,
        email, setEmail,
        fullName, setFullName,
        cpf, setCpf,
        phone, setPhone,
        address, setAddress,
        demographics, setDemographics,
        onboardingDraft, setOnboardingDraft,
        clearOnboardingDraft
    };
};
