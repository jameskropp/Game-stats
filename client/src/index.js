import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { routes } from './router';
import registerServiceWorker from './registerServiceWorker';

import './index.css';

const rootEl = document.getElementById('root');

class Root extends Component {
  render() {
    return <BrowserRouter>{routes}</BrowserRouter>;
  }
}

ReactDOM.render(<Root />, rootEl);

// registerServiceWorker();
