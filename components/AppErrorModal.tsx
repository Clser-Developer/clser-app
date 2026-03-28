import Icon from './Icon';
import { Button } from './ui/button';
import { ModalBody, ModalFooter, ModalShell, ModalTitle } from './ui/modal-shell';

interface AppErrorModalProps {
  message: string | null;
  onClose: () => void;
}

const AppErrorModal = ({ message, onClose }: AppErrorModalProps) => {
  return (
    <ModalShell open={Boolean(message)} onClose={onClose} variant="dialog" className="max-w-sm">
      <ModalBody className="px-6 pb-4 pt-6 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-rose-100 bg-rose-50 text-rose-500">
          <Icon name="question-mark-circle" className="h-8 w-8" />
        </div>
        <ModalTitle className="mb-2 text-[1.7rem] leading-none">Cadastro não concluído</ModalTitle>
        <p className="text-sm font-medium leading-relaxed text-muted-foreground">{message}</p>
      </ModalBody>
      <ModalFooter className="px-6 pb-6 pt-0">
        <Button onClick={onClose} className="h-12 w-full rounded-2xl text-sm font-black">
          Entendi
        </Button>
      </ModalFooter>
    </ModalShell>
  );
};

export default AppErrorModal;
