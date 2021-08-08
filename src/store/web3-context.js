import React from 'react';

const Web3Context = React.createContext({
  account: null,
  networkId: null,
  loadAccount: () => {},
  loadNetworkId: () => {}
});

export default Web3Context;