import React, { useState } from 'react';

import ConnectButton from './MetaMaskConnectButton';

export const LoginView = () => {
  const [userType, setUserType] = useState<number>(0);

  return (
    <div>
      <h1>Login View</h1>
      {userType === 0 && (
        <div>
          <button onClick={() => setUserType(1)}>Course Provider Login</button>
          <button onClick={() => setUserType(2)}>
            Course Participant Login
          </button>
        </div>
      )}
      {userType === 2 && (
        <div>
          <button onClick={() => setUserType(0)}>back</button>
          <ConnectButton />
        </div>
      )}
      {userType === 1 && (
        <div>
          <button onClick={() => setUserType(0)}>back</button>Arnes Login
        </div>
      )}
    </div>
  );
};
