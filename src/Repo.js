import React, {Component} from 'react';
import {Helmet} from 'react-helmet';

import logo from './libstack-logo.jpg';

import {Header} from 'semantic-ui-react';

class Repo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      owner: props.match.params.owner,
      repo: props.match.params.repo
    };
  }

  render() {
    return (
      <div className="App">
        <Helmet>
          <title>{this.state.owner}/{this.state.repo} - LibStack</title>
          <meta name="description"
                content="Github repo description"/>
        </Helmet>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Header as='h2'>Repo</Header>
        </header>
        <Header as='h3'>{this.state.owner}</Header>
        <Header as='h3'>{this.state.repo}</Header>
      </div>
    );
  }
}

export default Repo;
