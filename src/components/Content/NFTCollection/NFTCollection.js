import { useContext, useRef, createRef } from 'react';

import Web3Context from '../../../store/web3-context';
import CollectionContext from '../../../store/collection-context';
import MarketplaceContext from '../../../store/marketplace-context';
import eth from '../../../img/eth.png';

const NFTCollection = () => {  
  const web3Ctx = useContext(Web3Context);
  const collectionCtx = useContext(CollectionContext);
  const marketplaceCtx = useContext(MarketplaceContext);

  const priceRefs = useRef([]);
  if (priceRefs.current.length !== collectionCtx.collection.length) {
    priceRefs.current = Array(collectionCtx.collection.length).fill().map((_, i) => priceRefs.current[i] || createRef());
  }
  
  const makeOfferHandler = (event, id, key) => {
    event.preventDefault();

    const enteredPrice = priceRefs.current[key].current.value;
    console.log(enteredPrice)

    collectionCtx.contract.methods.approve(marketplaceCtx.contract.options.address, id).send({ from: web3Ctx.account })
    .on('transactionHash', (hash) => {
      marketplaceCtx.contract.methods.makeOffer(id, enteredPrice).send({ from: web3Ctx.account })
      .on('transactionHash', (hash) => {
        marketplaceCtx.setMktIsLoading(true);
      })
      .on('error', (error) => {
        window.alert('Something went wrong when pushing to the blockchain');
      }); 
    });
  };
  
  const buyHandler = (event) => {    
    const buyIndex = parseInt(event.target.value);
    marketplaceCtx.contract.methods.fillOffer(marketplaceCtx.offers[buyIndex].offerId).send({ from: web3Ctx.account, value: marketplaceCtx.offers[buyIndex].price })
    .on('transactionHash', (hash) => {
      marketplaceCtx.setMktIsLoading(true);
    })
    .on('error', (error) => {
      window.alert('Something went wrong when pushing to the blockchain');
    });    
  };

  const cancelHandler = (event) => {    
    const cancelIndex = parseInt(event.target.value);
    marketplaceCtx.contract.methods.cancelOffer(marketplaceCtx.offers[cancelIndex].offerId).send({ from: web3Ctx.account })
    .on('transactionHash', (hash) => {
      marketplaceCtx.setMktIsLoading(true);
    })
    .on('error', (error) => {
      window.alert('Something went wrong when pushing to the blockchain');
    });    
  };
 
  return(
    <div className="row text-center">
      {collectionCtx.collection.map((NFT, key) => {
        const index = marketplaceCtx.offers ? marketplaceCtx.offers.findIndex(offer => offer.id === NFT.id) : -1;
        const owner = index === -1 ? NFT.owner : marketplaceCtx.offers[index].user;

        return(
          <div key={key} className="col-md-2 m-3 pb-3 card border-primary">
            <div className={"card-body"}>       
              <h5 className="card-title">{NFT.title}</h5>
            </div>
            <img src={`https://ipfs.infura.io/ipfs/${NFT.img}`} className="card-img-bottom" alt={`NFT ${key}`}></img>                         
            <p className="fw-light fs-6">{`${owner.substr(0,7)}...${owner.substr(owner.length - 7)}`}</p>
            {index !== -1 ?
              owner !== web3Ctx.account ?
                <div className="row">
                  <div className="d-grid gap-2 col-6 mx-auto">
                    <button onClick={buyHandler} value={index} className="btn btn-success">BUY</button>
                  </div>
                  <div className="col-6 d-flex justify-content-end">
                    <img src={eth} width="25" height="25" className="align-center float-start" alt="price icon"></img>                
                    <p className="text-start"><b>{`${marketplaceCtx.offers[index].price.toFixed(2)}`}</b></p>
                  </div>
                </div>
              : <div className="row">
                <div className="d-grid gap-2 col-6 mx-auto">
                  <button onClick={cancelHandler} value={index} className="btn btn-danger">Cancel</button>
                </div>
                <div className="col-6 d-flex justify-content-end">
                  <img src={eth} width="25" height="25" className="align-center float-start" alt="price icon"></img>                
                  <p className="text-start"><b>{`${marketplaceCtx.offers[index].price.toFixed(2)}`}</b></p>
                </div>
              </div>
            : owner === web3Ctx.account ?              
              <form className="row g-2" onSubmit={(e) => makeOfferHandler(e, NFT.id, key)}>                
                <div className="col-5 d-grid gap-2">
                  <button type="submit" className="btn btn-primary">OFFER</button>
                </div>
                <div className="col-7">
                  <input
                    type="text"
                    placeholder="ETH..."
                    className="form-control"
                    ref={priceRefs.current[key]}
                  />
                </div>                                  
              </form>
                : <p><br/></p>}
          </div>
        )
      })}
    </div>
  );
};

export default NFTCollection;