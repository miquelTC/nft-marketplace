import React, { useState, useEffect } from 'react';

import web3 from './connection/web3';
import Navbar from './components/Layout/Navbar';
import Main from './components/Content/Main';
import Spinner from './components/Layout/Spinner';
import NFTCollection from './abis/NFTCollection.json';
import NFTMarketplace from './abis/NFTMarketplace.json';


const App = () => {
  const [nftContract, setNftContract] = useState(null);
  const [mktContract, setMktContract] = useState(null);
  const [networkId, setNetworkId] = useState(null);
  const [account, setAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);  
  
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
      const accounts = await web3.eth.getAccounts();       
      setAccount(accounts[0]);

      // Load Network ID
      const networkId = await web3.eth.net.getId()
      setNetworkId(networkId);

      // Load Contracts
      const nftDeployedNetwork = NFTCollection.networks[networkId];
      const nftContract = nftDeployedNetwork ? new web3.eth.Contract(NFTCollection.abi, nftDeployedNetwork.address): '';

      const mktDeployedNetwork = NFTMarketplace.networks[networkId];
      const mktContract = mktDeployedNetwork ? new web3.eth.Contract(NFTMarketplace.abi, mktDeployedNetwork.address): '';

      if(nftContract) {
        // Set contract in state
        setNftContract(nftContract);

        // Load whatever is needed from smart contract        
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
        setIsLoading(false);
      }
    };
    
    loadBlockchainData();
    
    // Metamask Event Subscription - Account changed
    window.ethereum.on('accountsChanged', (accounts) => {
      setAccount(accounts[0]);
    });

    // Metamask Event Subscription - Network changed
    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    });
  }, []);

  const showContent = web3 && nftContract && mktContract && account;
  
  return(
    <React.Fragment>
      <Navbar account={account} setAccount={setAccount} networkId={networkId} web3={web3} />
      {showContent && !isLoading && <Main nftContract={nftContract} account={account} />}
      {isLoading && <Spinner />}
    </React.Fragment>
  );
};

export default App;