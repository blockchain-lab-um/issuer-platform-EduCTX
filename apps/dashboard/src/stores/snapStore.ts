import type { MascaApi } from '@blockchain-lab-um/masca-connector';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

interface MascaStore {
  mascaApi: MascaApi | undefined;
  availableMethods: string[];
  currDIDMethod: string | undefined;
  currDID: string;

  changeMascaApi: (mascaApi: MascaApi) => void;
  changeAvailableMethods: (availableMethods: string[]) => void;
  changeCurrDIDMethod: (currDIDMethod: string) => void;
  changeCurrDID: (currDID: string) => void;
}

export const mascaStoreInitialState = {
  mascaApi: undefined,
  availableMethods: [],
  currDIDMethod: undefined,
  currDID: '',
};

export const useMascaStore = createWithEqualityFn<MascaStore>()(
  (set) => ({
    ...mascaStoreInitialState,

    changeMascaApi: (mascaApi: MascaApi) => set({ mascaApi }),
    changeAvailableMethods: (availableMethods: string[]) =>
      set({ availableMethods }),
    changeCurrDIDMethod: (currDIDMethod: string) => set({ currDIDMethod }),
    changeCurrDID: (currDID: string) => set({ currDID }),
  }),
  shallow,
);
