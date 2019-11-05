import React, {useContext} from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route } from 'react-router-dom';
import * as routes from './routes';
import axios from 'axios';

import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import {onError} from 'apollo-link-error';

import 'semantic-ui-css/semantic.min.css';
import './index.css';

import Home from './home';
import Search from './search';
import Repo from './repo';

import * as serviceWorker from './serviceWorker';
import { ApolloLink } from 'apollo-link';
import AuthProvider, { AuthContext } from './common/auth';

const GITHUB_BASE_URL = 'https://api.github.com/graphql';

const cache = new InMemoryCache();

const errorLink = onError(({operation, response, graphQLErrors, networkError}) => {
  if (graphQLErrors) {
    console.log('GraphQL Error: ', graphQLErrors);
  }

  if (networkError) {
    console.log('Network Error: ', networkError, operation, response);
  }

  console.log('Operation: ', operation);
  console.log('Response: ', response);
});

function App() {
  // const {token} = useContext(AuthContext);

  const httpLink = new HttpLink({
    uri: GITHUB_BASE_URL,
    headers: {
      // authorization: `Bearer ${token}`,
      authorization: 'Bearer ' + btoa("óôç}Çxën:ã~:í÷:××µiþ7ëÝ|kMz"),
    },
  });

  const client = new ApolloClient({
    cache,
    link: ApolloLink.from([errorLink, httpLink]),
    resolvers: {
      Repository: {
        downloadCount: (repo, _args, { cache }) => {
          return axios
            .get('https://api.npmjs.org/downloads/point/last-week/' + repo.name)
            .then(response => response.data)
            .catch(error => {
              return null;
            });
        },
      },
    },
  });

  return (
    <ApolloProvider client={client}>
      <Router>
        {/* <Route path={routes.DEFAULT} exact render={() => (<Redirect to={routes.HOME} />)} /> */}
        <Route path={routes.HOME} exact component={Home} />
        <Route path={routes.SEARCH} component={Search} />
        <Route path={routes.REPO} component={Repo} />
      </Router>
    </ApolloProvider>
  );
}

ReactDOM.render(<App/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
