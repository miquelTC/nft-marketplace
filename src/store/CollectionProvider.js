import { useReducer } from 'react';

import CollectionContext from './collection-context';

const defaultCollectionState = {
  contract: null,
  totalSupply: null,
  collection: [],
  nftIsLoading: true
};

const collectionReducer = (state, action) => {
  if(action.type === 'CONTRACT') {    
    return {
      contract: action.contract,
      totalSupply: state.totalSupply,
      collection: state.collection,
      nftIsLoading: state.nftIsLoading
    };
  } 
  
  if(action.type === 'LOADSUPPLY') {
    return {
      contract: state.contract,
      totalSupply: action.totalSupply,
      collection: state.collection,
      nftIsLoading: state.nftIsLoading
    };
  }

  if(action.type === 'LOADCOLLECTION') {    
    return {
      contract: state.contract,
      totalSupply: state.totalSupply,
      collection: action.collection,
      nftIsLoading: state.nftIsLoading
    };
  }

  if(action.type === 'UPDATECOLLECTION') {    
    // Prevent duplicate NFT if Event triggered twice
    const index = state.collection.findIndex(NFT => NFT.id === action.NFT.id);
    let collection = [];
    if(index === -1) {
      collection = [...state.collection, action.NFT];
    } else {
      collection = [...state.collection];
    }    

    return {
      contract: state.contract,
      totalSupply: state.totalSupply,
      collection: collection,
      nftIsLoading: state.nftIsLoading
    };
  }

  if(action.type === 'LOADING') {    
    return {
      contract: state.contract,
      totalSupply: state.totalSupply,
      collection: state.collection,
      nftIsLoading: action.loading
    };
  }
  
  return defaultCollectionState;
};

const CollectionProvider = props => {
  const [CollectionState, dispatchCollectionAction] = useReducer(collectionReducer, defaultCollectionState);
  
  const loadContractHandler = (web3, NFTCollection, deployedNetwork) => {
    const contract = deployedNetwork ? new web3.eth.Contract(NFTCollection.abi, deployedNetwork.address): '';
    dispatchCollectionAction({type: 'CONTRACT', contract: contract}); 
    return contract;
  };

  const loadTotalSupplyHandler = async(contract) => {
    const totalSupply = await contract.methods.totalSupply().call();
    dispatchCollectionAction({type: 'LOADSUPPLY', totalSupply: totalSupply});
    return totalSupply;
  };

  const loadCollectionHandler = async(contract, totalSupply) => {
    let collection = [];

    for(let i = 0; i < totalSupply; i++) {
      const hash = await contract.methods.tokenURIs(i).call();
      try {
        const response = await fetch(`https://ipfs.infura.io/ipfs/${hash}?clear`);
        if(!response.ok) {
          throw new Error('Something went wrong');
        }

        const metadata = await response.json();
        const owner = await contract.methods.ownerOf(i + 1).call();

        collection = [...collection, {
          id: i + 1,
          title: metadata.properties.name.description,
          img: metadata.properties.image.description,
          owner: owner
        }];
      }catch {
        console.error('Something went wrong');
      }
    }
    dispatchCollectionAction({type: 'LOADCOLLECTION', collection: collection});     
  };

  const updateCollectionHandler = async(contract, id, owner) => {
    let NFT;
    const hash = await contract.methods.tokenURI(id).call();
    try {
      const response = await fetch(`https://ipfs.infura.io/ipfs/${hash}?clear`);
      if(!response.ok) {
        throw new Error('Something went wrong');      }

      const metadata = await response.json();      

      NFT = {
        id: id,
        title: metadata.properties.name.description,
        img: metadata.properties.image.description,
        owner: owner
      };
    }catch {
      console.error('Something went wrong');
    }
    dispatchCollectionAction({type: 'UPDATECOLLECTION', NFT: NFT});
  };

  const setNftIsLoadingHandler = (loading) => {
    dispatchCollectionAction({type: 'LOADING', loading: loading});
  };

  const collectionContext = {
    contract: CollectionState.contract,
    totalSupply: CollectionState.totalSupply,
    collection: CollectionState.collection,
    nftIsLoading:CollectionState.nftIsLoading,
    loadContract: loadContractHandler,
    loadTotalSupply: loadTotalSupplyHandler,
    loadCollection: loadCollectionHandler,
    updateCollection: updateCollectionHandler,
    setNftIsLoading: setNftIsLoadingHandler
  };
  
  return (
    <CollectionContext.Provider value={collectionContext}>
      {props.children}
    </CollectionContext.Provider>
  );
};

export default CollectionProvider;