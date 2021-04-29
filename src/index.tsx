import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.scss';
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
  () => { console.log('rendered this child dad'); }
);

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('landing'),
//   () => { console.log('rendered this child baby'); }
// );

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('l'),
//   () => { console.log('rendered this child baby'); }
// );

