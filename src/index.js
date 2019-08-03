import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import 'semantic-ui-css/semantic.min.css';
import './index.css';
import Home from './Home';
import Search from './Search';
import Repo from './Repo';

import * as serviceWorker from './serviceWorker';

function App() {
  return (
    <Router>
      <Route path="/" exact component={Home} />
      <Route path="/search" component={Search} />
      <Route path="/:owner/:repo" component={Repo} />
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
