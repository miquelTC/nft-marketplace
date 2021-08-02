import React, { useState, useEffect } from 'react';

import web3 from './connection/web3';
import Navbar from './components/Layout/Navbar';
import Spinner from './components/Layout/Spinner';


const App = () => {
  // State Variables (contract, networkId, account, isLoading...)  
  
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
      // Load Network ID
      // Load Contract     

      if(contract) {
        // Set contract in state
        // Load whatever is needed from smart contract

        setIsLoading(false);

        // Event subscription 
        
      } else {
        window.alert('ColorNFT contract not deployed to detected network.')
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

  const showContent = web3 && contract && account;
  
  return(
    <React.Fragment>
      <Navbar />
      {showContent && !isLoading && <Main />}
      {isLoading && <Spinner />}
    </React.Fragment>
  );
};

export default App;