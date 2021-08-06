import { useState } from 'react';

const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient.create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

const MintForm = (props) => {
  const [capturedFileBuffer, setCapturedFileBuffer] = useState(null);
  const [enteredName, setEnteredName] = useState('');
  const [enteredDescription, setEnteredDescription] = useState('');

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
  const uploadFile = async() => {
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
    
    props.nftContract.methods.safeMint(metadataAdded.path).send({ from: props.account })
    .on('transactionHash', (hash) => {
      console.log(metadataAdded.path);
    })
    .on('error', (e) =>{
      window.alert('Something went wrong when pushing to the blockchain');
      // setIsLoading(false);  
    })
    
  };
  
  const submissionHandler = (event) => {
    event.preventDefault();

    uploadFile();

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
      <button type='submit' className='btn btn-primary btn-block'>MINT</button>
    </form>
  );
};

export default MintForm;