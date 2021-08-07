import MintForm from "./MintNFT/MintForm"
import NFTCollection from "./NFTCollection/NFTCollection"

const Main = (props) => {
  return(
    <div className="container-fluid mt-2">
      <div className="row">
        <main role="main" className="col-lg-12 justify-content-center text-center">
          <div className="content mr-auto ml-auto">
            <h1>NFT Marketplace</h1>
            <MintForm nftContract={props.nftContract} account={props.account} />
          </div>
        </main>
      </div>
      <hr/>
      <NFTCollection tokenURIs={props.tokenURIs} totalSupply={props.totalSupply} nftContract={props.nftContract} />
    </div>
  );
};

export default Main;