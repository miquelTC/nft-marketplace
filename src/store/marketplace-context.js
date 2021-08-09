import React from 'react';

const MarketplaceContext = React.createContext({
  contract: null,
  offerCount: null,
  offers: [],
  loadContract: () => {},
  loadOfferCount: () => {},
  loadOffers: () => {},
  fillOffer: () => {} 
});

export default MarketplaceContext;