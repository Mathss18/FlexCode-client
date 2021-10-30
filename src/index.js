import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { CssBaseline } from '@material-ui/core';

import * as themes from './theme/schema.json';
import { setToLS } from './utils/storage';

function Index() {
  setToLS('all-themes', themes.default);
  return(
    <App />
  )
}

// Tag Index era tag App antes

ReactDOM.render(
  <>
    <CssBaseline />
    <Index />
  </>,
  document.getElementById('root')
);

