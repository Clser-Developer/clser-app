import React, { useEffect, useMemo, useRef, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';
import Icon from './Icon';
import { Button } from './ui/button';
import { readStorageItem, writeStorageItem } from '../lib/storage';
import {
  countQueuedMutations,
  flushQueuedMutations,
  hasQueuedMutationExecutor,
  subscribeToMutationQueue,
} from '../lib/offline/mutation-queue';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const IOS_HINT_DISMISSED_KEY = 'clser-ios-install-hint-dismissed';

const isStandaloneMode = () => {
  const nav = navigator as Navigator & { standalone?: boolean };
  return window.matchMedia('(display-mode: standalone)').matches || nav.standalone === true;
};

const isIosSafariLike = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isIos = /iphone|ipad|ipod/.test(userAgent);
  const isWebkit = /safari/.test(userAgent) && !/crios|fxios|edgios/.test(userAgent);
  return isIos && isWebkit;
};

const PwaPrompts: React.FC = () => {
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallVisible, setInstallVisible] = useState(false);
  const [isUpdateVisible, setUpdateVisible] = useState(false);
  const [isOfflineReadyVisible, setOfflineReadyVisible] = useState(false);
  const [isIosHintVisible, setIosHintVisible] = useState(false);
  const [queuedMutationCount, setQueuedMutationCount] = useState(0);
  const [isOffline, setOffline] = useState(typeof navigator !== 'undefined' ? !navigator.onLine : false);
  const updateServiceWorkerRef = useRef<((reloadPage?: boolean) => Promise<void>) | null>(null);

  const shouldShowIosHint = useMemo(() => {
    if (typeof window === 'undefined') return false;
    if (!isIosSafariLike() || isStandaloneMode()) return false;
    return readStorageItem(IOS_HINT_DISMISSED_KEY) !== 'true';
  }, []);

  useEffect(() => {
    const updateSW = registerSW({
      onNeedRefresh() {
        setUpdateVisible(true);
      },
      onOfflineReady() {
        setOfflineReadyVisible(true);
        window.setTimeout(() => setOfflineReadyVisible(false), 4500);
      },
    });
    updateServiceWorkerRef.current = updateSW;

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredInstallPrompt(event as BeforeInstallPromptEvent);
      setInstallVisible(true);
    };

    const handleInstalled = () => {
      setInstallVisible(false);
      setIosHintVisible(false);
      setDeferredInstallPrompt(null);
    };
    const handleOnline = () => setOffline(false);
    const handleOffline = () => setOffline(true);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    const unsubscribeQueue = subscribeToMutationQueue((pending) => setQueuedMutationCount(pending));
    setQueuedMutationCount(countQueuedMutations());

    if (shouldShowIosHint) {
      setIosHintVisible(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubscribeQueue();
    };
  }, [shouldShowIosHint]);

  useEffect(() => {
    if (isOffline || queuedMutationCount === 0 || !hasQueuedMutationExecutor()) return;
    void flushQueuedMutations();
  }, [isOffline, queuedMutationCount]);

  const handleInstall = async () => {
    if (!deferredInstallPrompt) return;
    await deferredInstallPrompt.prompt();
    const result = await deferredInstallPrompt.userChoice;
    if (result.outcome === 'accepted') {
      setInstallVisible(false);
    }
    setDeferredInstallPrompt(null);
  };

  const handleDismissIosHint = () => {
    setIosHintVisible(false);
    writeStorageItem(IOS_HINT_DISMISSED_KEY, 'true');
  };

  const handleRefresh = async () => {
    if (updateServiceWorkerRef.current) {
      await updateServiceWorkerRef.current(true);
    }
    setUpdateVisible(false);
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[120] px-4 pt-[calc(var(--safe-top)+0.75rem)]">
      <div className="mx-auto flex w-full max-w-md flex-col gap-2">
        {isUpdateVisible && (
          <div className="pointer-events-auto rounded-2xl border border-rose-200 bg-white/95 p-4 shadow-lg backdrop-blur">
            <p className="text-sm font-black text-gray-900">Nova versao disponivel</p>
            <p className="mt-1 text-xs text-gray-500">Atualize para aplicar melhorias do app.</p>
            <div className="mt-3 flex gap-2">
              <Button onClick={handleRefresh} className="h-10 flex-1 rounded-xl text-xs font-black">
                Atualizar agora
              </Button>
              <Button onClick={() => setUpdateVisible(false)} variant="outline" className="h-10 flex-1 rounded-xl text-xs font-bold">
                Depois
              </Button>
            </div>
          </div>
        )}

        {isInstallVisible && deferredInstallPrompt && (
          <div className="pointer-events-auto rounded-2xl border border-rose-200 bg-white/95 p-4 shadow-lg backdrop-blur">
            <p className="text-sm font-black text-gray-900">Instale o Clser no celular</p>
            <p className="mt-1 text-xs text-gray-500">Abra como app nativo, com acesso rapido pela tela inicial.</p>
            <div className="mt-3 flex gap-2">
              <Button onClick={handleInstall} className="h-10 flex-1 rounded-xl text-xs font-black">
                Instalar app
              </Button>
              <Button onClick={() => setInstallVisible(false)} variant="outline" className="h-10 flex-1 rounded-xl text-xs font-bold">
                Agora nao
              </Button>
            </div>
          </div>
        )}

        {isIosHintVisible && !isInstallVisible && !isUpdateVisible && (
          <div className="pointer-events-auto rounded-2xl border border-rose-200 bg-white/95 p-4 shadow-lg backdrop-blur">
            <p className="text-sm font-black text-gray-900">Adicionar a Tela Inicial</p>
            <p className="mt-1 text-xs text-gray-500">
              No Safari, toque em compartilhar e selecione <span className="font-bold">Adicionar a Tela de Inicio</span>.
            </p>
            <div className="mt-3 flex justify-end">
              <Button onClick={handleDismissIosHint} variant="outline" className="h-10 rounded-xl px-4 text-xs font-bold">
                Entendi
              </Button>
            </div>
          </div>
        )}

        {isOfflineReadyVisible && !isInstallVisible && !isUpdateVisible && (
          <div className="pointer-events-auto rounded-2xl border border-green-100 bg-white/95 p-3 shadow-md backdrop-blur">
            <div className="flex items-center gap-2 text-green-700">
              <Icon name="check-circle" className="h-5 w-5" />
              <p className="text-xs font-bold">Modo offline basico pronto.</p>
            </div>
          </div>
        )}

        {(isOffline || queuedMutationCount > 0) && !isInstallVisible && !isUpdateVisible && (
          <div className="pointer-events-auto rounded-2xl border border-amber-100 bg-white/95 p-3 shadow-md backdrop-blur">
            <p className="text-xs font-bold text-amber-700">
              {isOffline
                ? `Sem conexao. ${queuedMutationCount} acao(oes) aguardando sincronizacao.`
                : `${queuedMutationCount} acao(oes) sincronizando em segundo plano.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PwaPrompts;
