import { create } from 'zustand';
import { createSelectors } from './createSelectors';

type ModalStore = {
  isCredentialModalOpen: boolean;
  selectedCredential: any;

  setIsCredentialModalOpen: (open: boolean) => void;
  setSelectedCredential: (credential: any) => void;
};

export const modalStoreInitialState = {
  isCredentialModalOpen: false,
  selectedCredential: null,
};

const useModalStoreBase = create<ModalStore>()((set) => ({
  ...modalStoreInitialState,

  setIsCredentialModalOpen: (open: boolean) =>
    set((state) => ({ ...state, isCredentialModalOpen: open })),
  setSelectedCredential: (credential: any) =>
    set((state) => ({ ...state, selectedCredential: credential })),
}));

export const useModalStore = createSelectors(useModalStoreBase);
