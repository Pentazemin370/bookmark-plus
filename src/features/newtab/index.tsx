import React from 'react';
import ReactDOM from 'react-dom';
import { NewTab } from './NewTab';
import { Provider } from 'react-redux';
import store from './store';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <NewTab />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

