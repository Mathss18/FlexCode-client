import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { CssBaseline } from '@material-ui/core';

import * as themes from './theme/schema.json';
import { getFromLS, setToLS } from './utils/storage';
import  statuses  from './constants/userStatus';

function Index() {
  // Inicialização do sistema
  setToLS('all-themes', themes.default);

  const userStatus = getFromLS('user-status');
  userStatus ? setToLS('user-status', userStatus) : setToLS('user-status', statuses);
  return (
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

