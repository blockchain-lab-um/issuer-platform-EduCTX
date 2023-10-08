import React from 'react';
import { enableMasca, isError } from '@blockchain-lab-um/masca-connector';

export const LoginView = () => {
  const connect = async () => {
    // Connect the user and get the address of his current account
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    const address = accounts[0];

    // Enable Masca
    const enableResult = await enableMasca(address, {
      supportedMethods: ['did:key'], // Defaults to all available methods
    });

    // Check if there was an error and handle it accordingly
    if (isError(enableResult)) {
      // Error message is available under error
      console.error(enableResult.error);
    }
  };

  return (
    <div>
      <button
        onClick={() => {
          connect();
        }}
      >
        Connect
      </button>

      <button
        onClick={() => {
          connect();
        }}
      >
        Query
      </button>
    </div>
  );
};
