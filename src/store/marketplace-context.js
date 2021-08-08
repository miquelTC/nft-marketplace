import React from 'react';

const MarketplaceContext = React.createContext({
  contract: null, 
  loadContract: () => {} 
});

export default MarketplaceContext;