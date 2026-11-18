import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

type ToastType = 'success' | 'error';

interface ToastStore {
  open: boolean;
  loading: boolean;
  text: string;
  title: string;
  type: ToastType;
  link: string | null;
}

export const toastStoreInitialState = {
  open: false,
  loading: false,
  text: '',
  title: '',
  type: 'success' as ToastType,
  link: null,
};

export const useToastStore = createWithEqualityFn<ToastStore>()(
  () => ({
    ...toastStoreInitialState,
  }),
  shallow,
);
