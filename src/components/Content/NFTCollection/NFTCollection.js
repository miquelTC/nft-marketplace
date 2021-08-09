import { useContext } from 'react';

import Web3Context from '../../../store/web3-context';
import CollectionContext from '../../../store/collection-context';
import MarketplaceContext from '../../../store/marketplace-context';
import eth from '../../../img/eth.png';

const NFTCollection = () => {
  const web3Ctx = useContext(Web3Context);
  const collectionCtx = useContext(CollectionContext);
  const marketplaceCtx = useContext(MarketplaceContext);

  const buyHandler = (event) => {
    const buyIndex = parseInt(event.target.value);
    marketplaceCtx.fillOffer(marketplaceCtx.contract, marketplaceCtx.offers[buyIndex].offerId, web3Ctx.account, marketplaceCtx.offers[buyIndex].price);
  };
 
  return(
    <div className="row text-center">
      {collectionCtx.collection.map((NFT, key) => {
        const index = marketplaceCtx.offers.findIndex(offer => offer.id === NFT.id);

        return(
          <div key={key} className="col-md-2 m-3 pb-3 card border-primary">
            <div className={"card-body"}>       
              <h5 className="card-title">{NFT.title}</h5>
            </div>
            <img src={`https://ipfs.infura.io/ipfs/${NFT.img}`} className="card-img-bottom" alt={`NFT ${key}`}></img>
            {index !== -1 ?
              <p className="fw-light fs-6">{`${marketplaceCtx.offers[index].user.substr(0,7)}...${marketplaceCtx.offers[index].user.substr(NFT.owner.length - 7)}`}</p>              
              : <p className="fw-light fs-6">{`${NFT.owner.substr(0,7)}...${NFT.owner.substr(NFT.owner.length - 7)}`}</p>}
            {index !== -1 ? 
              <div className="row">
                <div className="d-grid gap-2 col-6 mx-auto">
                  <button onClick={buyHandler} value={index} className="btn btn-primary m0">BUY</button>
                </div>
                <div className="col-6 d-flex justify-content-end">
                  <img src={eth} width="25" height="25" className="align-center float-start" alt="price icon"></img>                
                  <p className="text-start"><b>{`${marketplaceCtx.offers[0].price.toFixed(2)}`}</b></p>
                </div>
              </div>
              : <p><br/></p>}
          </div>
        )
      })}
    </div>
  );
};

export default NFTCollection;