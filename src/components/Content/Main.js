import MintForm from "./MintNFT/MintForm"

const Main = () => {
  return(
    <div className="container-fluid mt-2">
      <div className="row">
        <main role="main" className="col-lg-12 justify-content-center text-center">
          <div className="content mr-auto ml-auto">
            <h1>NFT Marketplace</h1>
            <MintForm />
          </div>
        </main>
      </div>
      <hr/>

    </div>
  );
};

export default Main;