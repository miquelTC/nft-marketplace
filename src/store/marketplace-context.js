import React from 'react';

const MarketplaceContext = React.createContext({
  contract: null,
  offerCount: null,
  offers: [],
  mktIsLoading: true,
  loadContract: () => {},
  loadOfferCount: () => {},
  loadOffers: () => {},
  updateOffer: () => {},
  addOffer: () => {},
  setMktIsLoading: () => {}
});

export default MarketplaceContext;