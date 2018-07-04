import React from 'react';
import { Route, Switch } from 'react-router';

import App from './components/App';

export const routes = (
  <Route
    render={() => {
      return <App />;
    }}
  />
);
