import { useState, useContext } from 'react';

import Web3Context from '../../../store/web3-context';
import CollectionContext from '../../../store/collection-context';

const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient.create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

const MintForm = () => {
  const [capturedFileBuffer, setCapturedFileBuffer] = useState(null);
  const [enteredName, setEnteredName] = useState('');
  const [enteredDescription, setEnteredDescription] = useState('');

  const web3Ctx = useContext(Web3Context);
  const collectionCtx = useContext(CollectionContext);

  const enteredNameHandler = (event) => {
    setEnteredName(event.target.value);
  };

  const enteredDescriptionHandler = (event) => {
    setEnteredDescription(event.target.value);
  };
  
  const captureFile = (event) => {
    event.preventDefault();

    const file = event.target.files[0];

    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      setCapturedFileBuffer(Buffer(reader.result));     
    }
  };

  // Upload file to IPFS and push to the blockchain
  const mintNFT = async() => {
    // Add file to the IPFS
    const fileAdded = await ipfs.add(capturedFileBuffer);
    if(!fileAdded) {
      console.error('Something went wrong when updloading the file');
      return;
    }

    const metadata = {
      title: "Asset Metadata",
      type: "object",
      properties: {
        name: {
          type: "string",
          description: enteredName
        },
        description: {
          type: "string",
          description: enteredDescription
        },
        image: {
          type: "string",
          description: fileAdded.path
        }
      }
    };

    const metadataAdded = await ipfs.add(JSON.stringify(metadata));
    if(!metadataAdded) {
      console.error('Something went wrong when updloading the file');
      return;
    }
    
    collectionCtx.contract.methods.safeMint(metadataAdded.path).send({ from: web3Ctx.account })
    .on('transactionHash', (hash) => {
      collectionCtx.setNftIsLoading(true);
    })
    .on('error', (e) =>{
      window.alert('Something went wrong when pushing to the blockchain');
      collectionCtx.setNftIsLoading(false);  
    })
    
  };
  
  const submissionHandler = (event) => {
    event.preventDefault();

    mintNFT();
  }
  
  return(
    <form onSubmit={submissionHandler}>
      <div className="row justify-content-center">
        <div className="col-md-2">
          <input
            type='text'
            className="form-control mb-1"
            placeholder='Name...'
            value={enteredName}
            onChange={enteredNameHandler}
          />
        </div>
        <div className="col-md-6">
          <input
            type='text'
            className="form-control mb-1"
            placeholder='Description...'
            value={enteredDescription}
            onChange={enteredDescriptionHandler}
          />
        </div>
        <div className="col-md-2">
          <input
            type='file'
            className="form-control mb-1"
            onChange={captureFile}
          />
        </div>
      </div>
      
      {/* {!colorIsValid ? <p className="text-danger"> Please, enter a valid hex color</p> : null} */}
      <button type='submit' className='btn btn-lg btn-info text-white btn-block'>MINT</button>
    </form>
  );
};

export default MintForm;