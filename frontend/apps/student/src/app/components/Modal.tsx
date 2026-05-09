import { ReactNode } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({ open, onOpenChange, title, children, footer }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 animate-in fade-in duration-300" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] shadow-float z-50 w-[92vw] max-w-md p-7 animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-500 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex items-center justify-between mb-6">
            <Dialog.Title className="text-2xl font-bold tracking-tight text-foreground">
              {title}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <X size={20} strokeWidth={2.5} />
              </button>
            </Dialog.Close>
          </div>
          
          <div className="relative z-10 text-foreground/80">{children}</div>
          
          {footer && <div className="relative z-10 mt-8 pt-6 border-t border-border/50 flex gap-3 justify-end">{footer}</div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
