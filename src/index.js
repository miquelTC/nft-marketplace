import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';

import Web3Provider from './store/Web3Provider';
import CollectionProvider from './store/CollectionProvider';
import App from './App';

ReactDOM.render(
  <Web3Provider>
    <CollectionProvider>
      <App />
    </CollectionProvider>
  </Web3Provider>, 
  document.getElementById('root')
);