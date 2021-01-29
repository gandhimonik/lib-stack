import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Redirect } from 'react-router-dom';
import * as routes from './routes';

import 'semantic-ui-css/semantic.min.css';
import './index.css';

import Home from './home';
import Search from './search';
import Repo from './repo';
import getAPIDomain from './api-config';

import * as serviceWorker from './serviceWorker';

function App() {
  const apiDomain = getAPIDomain();

  return (
      <Router>
        {<Route path={routes.DEFAULT} exact render={() => (<Redirect to={routes.HOME} />)} /> }
        <Route path={routes.HOME} exact render={(props) => <Home {...props} apiDomain={apiDomain} />} />
        <Route path={routes.SEARCH} render={(props) => <Search {...props} apiDomain={apiDomain} />} />
        <Route path={routes.REPO} render={(props) => <Repo {...props} apiDomain={apiDomain} />} />
      </Router>
  );
}

ReactDOM.render(<App/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
