import React from 'react';

const CollectionContext = React.createContext({
  contract: null,
  totalSupply: null,
  collection: [],  
  loadContract: () => {},
  loadTotalSupply: () => {},
  loadCollection: () => {},
  updateTotalSupply: () => {},
  updateCollection: () => {}  
});

export default CollectionContext;