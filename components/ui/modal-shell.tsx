import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Icon from "../Icon";

type ModalVariant = "dialog" | "sheet" | "fullscreen";

interface ModalShellProps {
  open: boolean;
  onClose?: () => void;
  variant?: ModalVariant;
  className?: string;
  overlayClassName?: string;
  closeOnOverlayClick?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<ModalVariant, string> = {
  dialog:
    "w-full max-w-md overflow-hidden rounded-[2rem] border border-border bg-background shadow-2xl animate-scale-in",
  sheet:
    "flex w-full max-w-md flex-col overflow-hidden rounded-t-[2.5rem] border border-border bg-background shadow-2xl animate-slide-up sm:rounded-[2rem] max-h-[92vh]",
  fullscreen:
    "flex h-full w-full flex-col overflow-hidden bg-background animate-fade-in",
};

const layoutClasses: Record<ModalVariant, string> = {
  dialog: "items-center justify-center p-4",
  sheet: "items-end justify-center p-0 sm:p-4",
  fullscreen: "items-stretch justify-center p-0",
};

export function ModalShell({
  open,
  onClose,
  variant = "dialog",
  className,
  overlayClassName,
  closeOnOverlayClick = false,
  children,
}: ModalShellProps) {
  if (!open) return null;

  const handleOverlayClick = () => {
    if (closeOnOverlayClick) {
      onClose?.();
    }
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-[70] flex bg-black/55 backdrop-blur-sm animate-fade-in",
        layoutClasses[variant],
        overlayClassName
      )}
      aria-modal="true"
      role="dialog"
      onClick={handleOverlayClick}
    >
      <div
        data-modal-variant={variant}
        className={cn(variantClasses[variant], className)}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <header
      className={cn(
        "modal-header flex items-center justify-between border-b border-border px-5 py-4 shrink-0",
        className
      )}
    >
      {children}
    </header>
  );
}

export function ModalTitle({
  className,
  children,
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={cn("text-lg font-black text-foreground", className)}>
      {children}
    </h2>
  );
}

export function ModalDescription({
  className,
  children,
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm font-medium leading-relaxed text-muted-foreground", className)}>
      {children}
    </p>
  );
}

export function ModalCloseButton({
  onClick,
  className,
}: {
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className={cn("rounded-full text-muted-foreground hover:bg-muted", className)}
      onClick={onClick}
    >
      <Icon name="close" className="h-5 w-5" />
    </Button>
  );
}

export function ModalBody({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("modal-body px-6 py-5", className)}>{children}</div>;
}

export function ModalFooter({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <footer
      className={cn(
        "modal-footer shrink-0 border-t border-border bg-background px-6 py-5",
        className
      )}
    >
      {children}
    </footer>
  );
}
