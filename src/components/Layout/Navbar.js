import { useContext, useState } from 'react';

import Web3Context from '../../store/web3-context';
import MarketplaceContext from '../../store/marketplace-context';
import web3 from '../../connection/web3';
import { formatPrice } from '../../helpers/utils';

const Navbar = () => {
  const [fundsLoading, setFundsLoading] = useState(false);
  
  const web3Ctx = useContext(Web3Context);
  const marketplaceCtx = useContext(MarketplaceContext);
  
  const connectWalletHandler = async() => {
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } catch(error) {
      console.error(error);
    }

    // Load accounts
    web3Ctx.loadAccount(web3);
  };

  const claimFundsHandler = () => {
    marketplaceCtx.contract.methods.claimFunds().send({ from: web3Ctx.account })
    .on('transactionHash', (hash) => {
      setFundsLoading(true);
    })
    .on('error', (error) => {
      window.alert('Something went wrong when pushing to the blockchain');
    });
  };

  // Event ClaimFunds subscription 
  marketplaceCtx.contract.events.ClaimFunds()
  .on('data', (event) => {
    marketplaceCtx.loadUserFunds(marketplaceCtx.contract, web3Ctx.account);
    setFundsLoading(false);
  })
  .on('error', (error) => {
    console.log(error);
  });

  let etherscanUrl;

  if(web3Ctx.networkId === 3) {
    etherscanUrl = 'https://ropsten.etherscan.io'
  } else if(web3Ctx.networkId === 4) {
    etherscanUrl = 'https://rinkeby.etherscan.io'
  } else if(web3Ctx.networkId === 5) {
    etherscanUrl = 'https://goerli.etherscan.io'
  } else {
    etherscanUrl = 'https://etherscan.io'
  }
  
  return (
    <nav className="navbar navbar-expand-sm navbar-light bg-white p-0">      
      <ul className="navbar-nav ms-auto">
        <li className="nav-item">
          <button 
          type="button" 
          className="btn btn-info navbar-btn text-white" 
          onClick={claimFundsHandler}
          > 
            {!fundsLoading && `CLAIM ${formatPrice(marketplaceCtx.userFunds)} ETH`}
            {fundsLoading && 'loading...'}
          </button>
        </li>
        <li className="nav-item">
          {web3Ctx.account && 
            <a 
              className="nav-link small" 
              href={`${etherscanUrl}/address/${web3Ctx.account}`}
              target="blank"
              rel="noopener noreferrer"
            >
              {web3Ctx.account}
            </a>}
          {!web3Ctx.account && 
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={connectWalletHandler} 
            > 
              Connect your wallet
            </button>}
        </li>
      </ul>
    </nav>
  );  
};

export default Navbar;