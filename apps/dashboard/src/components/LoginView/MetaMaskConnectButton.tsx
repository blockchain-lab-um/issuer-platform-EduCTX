'use client ';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { enableMasca, isError } from '@blockchain-lab-um/masca-connector';
import detectEthereumProvider from '@metamask/detect-provider';
import { Button } from '@nextui-org/react';

import { useGeneralStore, useMascaStore } from '@/stores';

const ConnectButton = () => {
  const router = useRouter();

  const { changeHasMetaMask, changeIsFlask } = useGeneralStore((state) => ({
    changeHasMetaMask: state.changeHasMetaMask,
    changeIsFlask: state.changeIsFlask,
  }));

  const {
    hasMM,
    hasFlask,
    isConnected,
    isConnecting,
    chainId,
    changeAddress,
    changeIsConnected,
    changeIsConnecting,
    changeChainId,
  } = useGeneralStore((state) => ({
    hasMM: state.hasMetaMask,
    hasFlask: state.isFlask,
    address: state.address,
    isConnected: state.isConnected,
    isConnecting: state.isConnecting,
    chainId: state.chainId,
    changeAddress: state.changeAddress,
    changeIsConnected: state.changeIsConnected,
    changeIsConnecting: state.changeIsConnecting,
    changeChainId: state.changeChainId,
  }));

  const {
    api,
    changeMascaApi,
    changeDID,
    changeAvailableMethods,
    changeCurrMethod,
  } = useMascaStore((state) => ({
    api: state.mascaApi,
    changeMascaApi: state.changeMascaApi,
    changeDID: state.changeCurrDID,
    changeAvailableMethods: state.changeAvailableMethods,
    changeCurrMethod: state.changeCurrDIDMethod,
  }));

  const checkMetaMaskCompatibility = async () => {
    try {
      const provider = await detectEthereumProvider({ mustBeMetaMask: true });

      if (!provider) {
        changeHasMetaMask(false);
        changeIsFlask(false);
        return;
      }
    } catch (error) {
      changeHasMetaMask(false);
      changeIsFlask(false);
    }

    changeHasMetaMask(true);
  };

  useEffect(() => {
    checkMetaMaskCompatibility().catch((error) => {
      console.error(error);
    });
  }, []);

  const connectHandler = async () => {
    if (window.ethereum) {
      console.log('here');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const result: unknown = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const chain = (await window.ethereum.request({
        method: 'eth_chainId',
      })) as string;

      // Set the chainId
      changeChainId(chain);
      console.log('result', result);
      // Set the address
      changeAddress((result as string[])[0]);
      return (result as string[])[0];
    }
    return null;
  };

  const enableMascaHandler = async () => {
    changeIsConnecting(true);
    const address = await connectHandler();
    if (!address) return;
    const enableResult = await enableMasca(address, {
      version: '1.1.0',
      supportedMethods: ['did:key'],
    });
    if (isError(enableResult)) {
      // FIXME: This error is shown as [Object object]
      throw new Error(enableResult.error);
    }
    const mascaApi = enableResult.data.getMascaApi();

    changeMascaApi(mascaApi);

    // Set currently connected address
    const setAccountRes = await mascaApi.setCurrentAccount({
      account: address,
    });

    if (isError(setAccountRes)) {
      console.log("Couldn't set current account");
      throw new Error(setAccountRes.error);
    }

    const did = await mascaApi.getDID();
    if (isError(did)) {
      console.log("Couldn't get DID");
      throw new Error(did.error);
    }

    const availableMethods = await mascaApi.getAvailableMethods();
    if (isError(availableMethods)) {
      console.log("Couldn't get available methods");
      throw new Error(availableMethods.error);
    }

    const method = await mascaApi.getSelectedMethod();
    if (isError(method)) {
      console.log("Couldn't get selected method");
      throw new Error(method.error);
    }

    changeDID(did.data);
    changeAvailableMethods(availableMethods.data);
    changeCurrMethod(method.data);
    changeIsConnected(true);
    changeIsConnecting(false);

    router.push('/claim');
  };

  return (
    <div className="w-full text-center">
      <Button
        color="primary"
        onClick={() => enableMascaHandler()}
        isLoading={isConnecting}
      >
        Connect MetaMask
      </Button>
    </div>
  );
};

export default ConnectButton;
