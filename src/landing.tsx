import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './landing.scss';
console.log('running this one');
ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root'),
    () => { console.log('rendered this child baby'); }
);