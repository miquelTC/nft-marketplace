const MintForm = () => {
  const submissionHandler = () => {
    console.log('test');
  }
  
  return(
    <form onSubmit={submissionHandler}>
      <div className="row justify-content-center">
        <div className="col-md-2">
          <input
            type='text'
            className="form-control mb-1"
            placeholder='Name...'
            // value={enteredColor}
            // onChange={enteredColorHandler}
          />
        </div>
        <div className="col-md-6">
          <input
            type='text'
            className="form-control mb-1"
            placeholder='Description...'
            // value={enteredColor}
            // onChange={enteredColorHandler}
          />
        </div>
        <div className="col-md-2">
          <input
            type='file'
            className="form-control mb-1"
            // value={enteredColor}
            // onChange={enteredColorHandler}
          />
        </div>
      </div>
      
      {/* {!colorIsValid ? <p className="text-danger"> Please, enter a valid hex color</p> : null} */}
      <button type='submit' className='btn btn-primary btn-block'>MINT</button>
    </form>
  );
};

export default MintForm;