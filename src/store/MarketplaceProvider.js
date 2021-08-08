import { useReducer } from 'react';

import MarketplaceContext from './marketplace-context';

const defaultMarketplaceState = {
  contract: null
};

const marketplaceReducer = (state, action) => {
  if(action.type === 'CONTRACT') {    
    return {
      contract: action.contract
    };
  }
  
  return defaultMarketplaceState;
};

const MarketplaceProvider = props => {
  const [MarketplaceState, dispatchMarketplaceAction] = useReducer(marketplaceReducer, defaultMarketplaceState);
  
  const loadContractHandler = (web3, NFTMarketplace, deployedNetwork) => {
    const contract = deployedNetwork ? new web3.eth.Contract(NFTMarketplace.abi, deployedNetwork.address): '';
    dispatchMarketplaceAction({type: 'CONTRACT', contract: contract}); 
    return contract;
  };

  const marketplaceContext = {
    contract: MarketplaceState.contract,
    loadContract: loadContractHandler,    
  };
  
  return (
    <MarketplaceContext.Provider value={marketplaceContext}>
      {props.children}
    </MarketplaceContext.Provider>
  );
};

export default MarketplaceProvider;