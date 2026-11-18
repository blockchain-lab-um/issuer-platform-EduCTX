import { create } from 'zustand';
import { createSelectors } from './createSelectors';

type ModalStore = {
  isCredentialModalOpen: boolean;
  isPresentationModalOpen: boolean;

  setIsCredentialModalOpen: (open: boolean) => void;
  setIsPresentationModalOpen: (open: boolean) => void;
};

export const modalStoreInitialState = {
  isCredentialModalOpen: false,
  isPresentationModalOpen: false,
};

const useModalStoreBase = create<ModalStore>()((set) => ({
  ...modalStoreInitialState,

  setIsCredentialModalOpen: (open: boolean) =>
    set((state) => ({ ...state, isCredentialModalOpen: open })),
  setIsPresentationModalOpen: (open: boolean) =>
    set((state) => ({ ...state, isPresentationModalOpen: open })),
}));

export const useModalStore = createSelectors(useModalStoreBase);
