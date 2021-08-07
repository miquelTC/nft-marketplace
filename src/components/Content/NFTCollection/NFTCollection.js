import { useEffect, useState } from 'react';

const NFTCollection = (props) => {
  const [NFTCollection, setNFTCollection] = useState([]);
  
  useEffect(() => {
    const fetchMetadata = async() => {
      let hash;      
      for(let i = 0; i < props.totalSupply; i++) {
        hash = props.tokenURIs[i];
        try {
          const response = await fetch(`https://ipfs.infura.io/ipfs/${hash}?clear`);
          if(!response.ok) {
            throw new Error('Something went wrong');
          }
  
          const metadata = await response.json();

          const owner = await props.nftContract.methods.ownerOf(i + 1).call();

          setNFTCollection(prevState => [...prevState, {
            title: metadata.properties.name.description,
            img: metadata.properties.image.description,
            owner: owner
          }]);
        }catch {
          console.error('Something went wrong');
        }        
      }
    };
    fetchMetadata();
  }, []);

  console.log('collection', NFTCollection);
  
  return(
    <div className="row text-center">
      {NFTCollection.map((NFT, key) => {
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