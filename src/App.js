import React, { useContext, useState, useEffect } from 'react';

import web3 from './connection/web3';
import Navbar from './components/Layout/Navbar';
import Main from './components/Content/Main';
import Spinner from './components/Layout/Spinner';
import Web3Context from './store/web3-context';
import CollectionContext from './store/collection-context';
import NFTCollection from './abis/NFTCollection.json';
import NFTMarketplace from './abis/NFTMarketplace.json';


const App = () => {
  const [mktContract, setMktContract] = useState(null);
  
  const web3Ctx = useContext(Web3Context);
  const collectionCtx = useContext(CollectionContext);
  
  useEffect(() => {
    // Check if the user has Metamask active
    if(!web3) {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
      return;
    }
    
    // Function to fetch all the blockchain data
    const loadBlockchainData = async() => {
      // Request accounts acccess if needed
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });  
      } catch(error) {
        console.error(error);
      }
      
      // Load account
      web3Ctx.loadAccount(web3);

      // Load Network ID
      const networkId = await web3Ctx.loadNetworkId(web3);

      // Load Contracts      
      const nftDeployedNetwork = NFTCollection.networks[networkId];
      const nftContract = collectionCtx.loadContract(web3, NFTCollection, nftDeployedNetwork);

      const mktDeployedNetwork = NFTMarketplace.networks[networkId];
      const mktContract = mktDeployedNetwork ? new web3.eth.Contract(NFTMarketplace.abi, mktDeployedNetwork.address): '';

      if(nftContract) {        
        // Load total Supply
        const totalSupply = collectionCtx.loadTotalSupply(nftContract);
        
        // Load Token URIs
        collectionCtx.loadCollection(nftContract, totalSupply);       

        // Event subscription 
        
      } else {
        window.alert('NFTCollection contract not deployed to detected network.')
      }

      if(mktContract) {
        // Set contract in state
        setMktContract(mktContract);

        // Load whatever is needed from smart contract        
        // Event subscription 
        
      } else {
        window.alert('NFTMarketplace contract not deployed to detected network.')
      }

      if(nftContract && mktContract) {
        // setIsLoading(false);
      }
    };
    
    loadBlockchainData();
    
    // Metamask Event Subscription - Account changed
    window.ethereum.on('accountsChanged', (accounts) => {
      web3Ctx.loadAccount(web3);
    });

    // Metamask Event Subscription - Network changed
    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    });
  }, []);

  const showContent = web3 && collectionCtx.contract && mktContract && web3Ctx.account;
  
  return(
    <React.Fragment>
      <Navbar />
      {showContent && <Main />}
      {/* {isLoading && <Spinner />} */}
    </React.Fragment>
  );
};

export default App;