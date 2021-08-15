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
      setFundsLoading(false);
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
          {marketplaceCtx.userFunds > 0 && !fundsLoading &&
            <button 
              type="button" 
              className="btn btn-info btn-block navbar-btn text-white" 
              onClick={claimFundsHandler}
            >          
              {`CLAIM ${formatPrice(marketplaceCtx.userFunds)} ETH`}
            </button>}
          {fundsLoading &&
            <div class="d-flex justify-content-center text-info">
              <div class="spinner-border" role="status">
                <span class="sr-only"></span>
              </div>
          </div>}          
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
              className="btn btn-info text-white" 
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