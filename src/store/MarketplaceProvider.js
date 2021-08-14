import { useReducer } from 'react';

import MarketplaceContext from './marketplace-context';

const defaultMarketplaceState = {
  contract: null,
  offerCount: null,
  offers: [],
  userFunds: null,
  mktIsLoading: true
};

const marketplaceReducer = (state, action) => {
  if(action.type === 'CONTRACT') {    
    return {
      contract: action.contract,
      offerCount: state.offerCount,
      offers: state.offers,
      userFunds: state.userFunds,
      mktIsLoading: state.mktIsLoading
    };
  }

  if(action.type === 'LOADOFFERCOUNT') {    
    return {
      contract: state.contract,
      offerCount: action.offerCount,
      offers: state.offers,
      userFunds: state.userFunds,
      mktIsLoading: state.mktIsLoading
    };
  }

  if(action.type === 'LOADOFFERS') {    
    return {
      contract: state.contract,
      offerCount: state.offerCount,
      offers: action.offers,
      userFunds: state.userFunds,
      mktIsLoading: state.mktIsLoading
    };
  }

  if(action.type === 'UPDATEOFFER') {    
    const offers = state.offers.filter(offer => offer.offerId !== parseInt(action.offerId));

    return {
      contract: state.contract,
      offerCount: state.offerCount,
      offers: offers,
      userFunds: state.userFunds,
      mktIsLoading: state.mktIsLoading
    };
  }

  if(action.type === 'ADDOFFER') {    
    const index = state.offers.findIndex(offer => offer.offerId === parseInt(action.offer.offerId));
    let offers = [];

    if(index === -1) {
      offers = [...state.offers, {
        offerId: parseInt(action.offer.offerId),
        id: parseInt(action.offer.id),
        user: (action.offer.user),
        price: parseInt(action.offer.price),
        fulfilled: false,
        cancelled: false
      }];
    } else {
      offers = [...state.offers];
    }    

    return {
      contract: state.contract,
      offerCount: state.offerCount,
      offers: offers,
      userFunds: state.userFunds,
      mktIsLoading: state.mktIsLoading
    };
  }

  if(action.type === 'LOADFUNDS') {
    return {
      contract: state.contract,
      offerCount: state.offerCount,
      offers: state.offers,
      userFunds: action.userFunds,
      mktIsLoading: state.mktIsLoading
    };
  }

  if(action.type === 'LOADING') {    
    return {
      contract: state.contract,
      offerCount: state.offerCount,
      offers: state.offers,
      userFunds: state.userFunds,
      mktIsLoading: action.loading
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

  const loadOfferCountHandler = async(contract) => {
    const offerCount = await contract.methods.offerCount().call();
    dispatchMarketplaceAction({type: 'LOADOFFERCOUNT', offerCount: offerCount});
    return offerCount;
  };

  const loadOffersHandler = async(contract, offerCount) => {
    let offers = [];
    for(let i = 0; i < offerCount; i++) {
      const offer = await contract.methods.offers(i + 1).call();
      offers.push(offer);
    }
    offers = offers
    .map(offer => {
      offer.offerId = parseInt(offer.offerId);
      offer.id = parseInt(offer.id);
      offer.price = parseInt(offer.price);
      return offer;
    })
    .filter(offer => offer.fulfilled === false && offer.cancelled === false); 
    dispatchMarketplaceAction({type: 'LOADOFFERS', offers: offers});
  };

  const updateOfferHandler = (offerId) => {
    dispatchMarketplaceAction({type: 'UPDATEOFFER', offerId: offerId});   
  };

  const addOfferHandler = (offer) => {
    dispatchMarketplaceAction({type: 'ADDOFFER', offer: offer});   
  };

  const loadUserFundsHandler = async(contract, account) => {
    const userFunds = await contract.methods.userFunds(account).call();
    dispatchMarketplaceAction({type: 'LOADFUNDS', userFunds: userFunds});
    return userFunds;
  };

  const setMktIsLoadingHandler = (loading) => {
    dispatchMarketplaceAction({type: 'LOADING', loading: loading});
  };

  const marketplaceContext = {
    contract: MarketplaceState.contract,
    offerCount: MarketplaceState.offerCount,
    offers: MarketplaceState.offers,
    userFunds: MarketplaceState.userFunds,
    mktIsLoading: MarketplaceState.mktIsLoading,
    loadContract: loadContractHandler,
    loadOfferCount: loadOfferCountHandler,
    loadOffers: loadOffersHandler,
    updateOffer: updateOfferHandler,
    addOffer: addOfferHandler,
    loadUserFunds: loadUserFundsHandler,
    setMktIsLoading: setMktIsLoadingHandler
  };
  
  return (
    <MarketplaceContext.Provider value={marketplaceContext}>
      {props.children}
    </MarketplaceContext.Provider>
  );
};

export default MarketplaceProvider;