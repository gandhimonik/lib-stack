import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import * as routes from './routes';

import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';

import 'semantic-ui-css/semantic.min.css';
import './index.css';

import Home from './home';
import Search from './Search';
import Repo from './Repo';

import * as serviceWorker from './serviceWorker';

const GITHUB_BASE_URL = 'https://api.github.com/graphql';

const httpLink = new HttpLink({
  uri: GITHUB_BASE_URL,
  headers: {
    authorization: `Bearer ${process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN}`,
  },
});

const cache = new InMemoryCache();

const client = new ApolloClient({
  link: httpLink,
  cache
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Route path={routes.DEFAULT} exact render={() => (<Redirect to={routes.HOME} />)} />
        <Route path={routes.HOME} exact component={Home} />
        <Route path={routes.SEARCH} component={Search} />
        <Route path={routes.REPO} component={Repo} />
      </Router>
    </ApolloProvider>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
