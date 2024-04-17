import * as React from 'react';
import * as Toast from '@radix-ui/react-toast';
import clsx from 'clsx';

import { useToastStore } from '@/stores';

const ToastWrapper = () => {
  const timerRef = React.useRef(0);

  React.useEffect(() => () => clearTimeout(timerRef.current), []);

  const { open, loading, text, type, title, link } = useToastStore((state) => ({
    open: state.open,
    loading: state.loading,
    text: state.text,
    title: state.title,
    type: state.type,
    link: state.link,
  }));

  const toastTypeText: Record<string, string> = {
    success: 'text-green-500',
    error: 'text-red-500',
  };

  const toastTypeBg: Record<string, string> = {
    success: 'bg-green-100',
    error: 'bg-red-100',
  };

  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root
        className={clsx(
          toastTypeBg[type],
          toastTypeText[type],
          "data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=end]:animate-swipeOut grid grid-cols-[auto_max-content] items-center gap-x-[15px] rounded-md p-[15px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] [grid-template-areas:_'title_action'_'description_action'] data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:transition-[transform_200ms_ease-out]"
        )}
        open={open}
        onOpenChange={(_open) => useToastStore.setState({ open: _open })}
      >
        <div className="flex items-center justify-between">
          <Toast.Title
            className={clsx(
              toastTypeText[type],
              'mb-[5px] text-[15px] font-medium [grid-area:_title]'
            )}
          >
            {title}
          </Toast.Title>
          {text && (
            <Toast.Description
              asChild
              className="m-0 text-[13px] leading-[1.3] text-slate-100 [grid-area:_description]"
            >
              {text}
            </Toast.Description>
          )}
          <Toast.Close>Close</Toast.Close>
        </div>
      </Toast.Root>
      <Toast.Viewport className="fixed bottom-0 right-0 z-[2147483647] m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-[10px] p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]" />
    </Toast.Provider>
  );
};

export default ToastWrapper;
