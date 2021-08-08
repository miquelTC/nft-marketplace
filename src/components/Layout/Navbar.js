import { useContext } from 'react';

import Web3Context from '../../store/web3-context';
import web3 from '../../connection/web3';
//import logo from '../../img/logo.png'

const Navbar = () => {
  const web3Ctx = useContext(Web3Context);
  
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
    <nav className="navbar navbar-dark bg-primary p-0">
      <a className="navbar-brand" href="/#">
        {/* <img src={logo} width="40" height="40" className="align-center" alt="logo" /> */}
        mTC - NFT Marketplace
      </a>
      <ul className="navbar-nav px-3">
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
              className="btn btn-outline-light" 
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