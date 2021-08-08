import { useContext } from 'react';

import CollectionContext from '../../../store/collection-context';

const NFTCollection = () => {
  const collectionCtx = useContext(CollectionContext);
  
  return(
    <div className="row text-center">
      {collectionCtx.collection.map((NFT, key) => {
        return(
          <div key={key} className="col-md-2 m-3 pb-3 card border-primary">
            <div className={"card-body"}>       
              <h5 className="card-title">{NFT.title}</h5>
            </div>
            <img src={`https://ipfs.infura.io/ipfs/${NFT.img}`} className="card-img-bottom" alt={`NFT ${key}`}></img>
            <p className="fw-light fs-6">{`${NFT.owner.substr(0,7)}...${NFT.owner.substr(NFT.owner.length - 7)}`}</p>
          </div>
        )
      })}
    </div>
  );
};

export default NFTCollection;