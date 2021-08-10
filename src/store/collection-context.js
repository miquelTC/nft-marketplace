import React from 'react';

const CollectionContext = React.createContext({
  contract: null,
  totalSupply: null,
  collection: [],
  nftIsLoading: true,
  loadContract: () => {},
  loadTotalSupply: () => {},
  loadCollection: () => {},
  updateTotalSupply: () => {},
  updateCollection: () => {},
  updateOwner: () => {},
  setNftIsLoading: () => {}
});

export default CollectionContext;