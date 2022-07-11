import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { ApolloProvider } from '@apollo/client'
import { PersistGate } from 'redux-persist/integration/react'

import store, { persistor } from "@store/store"
import client from "@gql"
import App from './App';
import ErrorBoundary from '@components/errorboundary';
import reportWebVitals from './reportWebVitals';

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import './assets/css/app.css';
import "toastify-js/src/toastify.css"
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ApolloProvider client={client}>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </ApolloProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode >,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
