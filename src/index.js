import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route } from 'react-router-dom';
import * as routes from './routes';

import 'semantic-ui-css/semantic.min.css';
import './index.css';

import Home from './home';
import Search from './search';
import Repo from './repo';

import * as serviceWorker from './serviceWorker';

function App() {
  return (
      <Router>
        {/* <Route path={routes.DEFAULT} exact render={() => (<Redirect to={routes.HOME} />)} /> */}
        <Route path={routes.HOME} exact component={Home} />
        <Route path={routes.SEARCH} component={Search} />
        <Route path={routes.REPO} component={Repo} />
      </Router>
  );
}

ReactDOM.render(<App/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
