import { useReducer } from 'react';

import MarketplaceContext from './marketplace-context';

const defaultMarketplaceState = {
  contract: null,
  offerCount: null,
  offers: [],
  mktIsLoading: true
};

const marketplaceReducer = (state, action) => {
  if(action.type === 'CONTRACT') {    
    return {
      contract: action.contract,
      offerCount: state.offerCount,
      offers: state.offer,
      mktIsLoading: state.mktIsLoading
    };
  }

  if(action.type === 'LOADOFFERCOUNT') {    
    return {
      contract: state.contract,
      offerCount: action.offerCount,
      offers: state.offer,
      mktIsLoading: state.mktIsLoading
    };
  }

  if(action.type === 'LOADOFFERS') {    
    return {
      contract: state.contract,
      offerCount: state.offerCount,
      offers: action.offers,
      mktIsLoading: state.mktIsLoading
    };
  }

  if(action.type === 'FILLOFFER') {    
    const offers = state.offers.filter(offer => offer.offerId !== action.offerId);

    return {
      contract: state.contract,
      offerCount: state.offerCount,
      offers: offers,
      mktIsLoading: state.mktIsLoading
    };
  }

  if(action.type === 'LOADING') {    
    return {
      contract: state.contract,
      offerCount: state.offerCount,
      offers: state.offers,
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
    // const offerStream = await contract.getPastEvents('Offer', { fromBlock: 0, toBlock: 'latest' });
    // let offers = offerStream.map(event => event.returnValues);
    // offers = offers
    // .map(offer => {
    //   offer.offerId = parseInt(offer.offerId);
    //   offer.id = parseInt(offer.id);
    //   offer.price = parseInt(offer.price);
    //   return offer;
    // })
    // .filter(offer => offer.fulfilled === false && offer.cancelled === false);
    let offers = [];
    console.log(offerCount)
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

    console.log('offers', offers);  
    dispatchMarketplaceAction({type: 'LOADOFFERS', offers: offers});
  };

  const fillOfferHandler = (contract, offerId, account, price) => {
    contract.methods.fillOffer(offerId).send({ from: account, value: price })
    .on('transactionHash', (hash) => {
      console.log('Offer fulfilled');
      dispatchMarketplaceAction({type: 'FILLOFFER', offerId: offerId});
    })
    .on('error', (error) => {
      window.alert('Something went wrong when pushing to the blockchain');
      
    });    
  };

  const setMktIsLoadingHandler = (loading) => {
    dispatchMarketplaceAction({type: 'LOADING', loading: loading});
  };

  const marketplaceContext = {
    contract: MarketplaceState.contract,
    offerCount: MarketplaceState.offerCount,
    offers: MarketplaceState.offers,
    mktIsLoading: MarketplaceState.mktIsLoading,
    loadContract: loadContractHandler,
    loadOfferCount: loadOfferCountHandler,
    loadOffers: loadOffersHandler,
    fillOffer: fillOfferHandler,
    setMktIsLoading: setMktIsLoadingHandler
  };
  
  return (
    <MarketplaceContext.Provider value={marketplaceContext}>
      {props.children}
    </MarketplaceContext.Provider>
  );
};

export default MarketplaceProvider;