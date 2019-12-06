import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap/dist/css/bootstrap-theme.css';
import 'bootstrap-material-design/dist/css/bootstrap-material-design.css';
// import './index.css';
// Put any other imports below so that CSS from your
// components takes precedence over default styles.

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import thunk from 'redux-thunk';
import { BrowserRouter } from 'react-router-dom';

import appReducer from './appReducer';
import App from './App';
// import registerServiceWorker from './registerServiceWorker';

// For remote Devtools, remove compose import from Redux, uncomment
// composeWithDevTools lines, and comment out the bottom line
// You will also have to change 'start' in ui/package.json to be:
//    "start": "concurrently \"react-scripts start\" \"npm run devtools-server\" ",
import { compose, createStore, applyMiddleware } from 'redux';
// import { composeWithDevTools } from 'remote-redux-devtools';
// const composeEnhancers = composeWithDevTools({
//   name: 'grove-react-template',
//   realtime: true,
//   port: 18055
// });
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// TODO: extract to store.js?
const store = createStore(appReducer, composeEnhancers(applyMiddleware(thunk)));

// TODO: extract to store.js?
// Hot reloading
// https://github.com/facebookincubator/create-react-app/issues/2317
if (process.env.NODE_ENV !== 'production') {
  if (module.hot) {
    module.hot.accept('./appReducer', () => {
      store.replaceReducer(appReducer);
    });
  }
}

render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// Hot reloading
// https://github.com/facebookincubator/create-react-app/issues/2317
if (module.hot) {
  module.hot.accept('./App', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>,
      document.getElementById('root')
    );
  });
}
// registerServiceWorker();
