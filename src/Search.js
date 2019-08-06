import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {Helmet} from 'react-helmet';

import logo from './libstack-logo.jpg';
import {List, Header} from 'semantic-ui-react';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: new URLSearchParams(props.location.search)
    };
  }

  render() {
    return (
      <div className="App">
        <Helmet>
          <title>{this.state.search.get("query")} - LibStack Search</title>
          <meta name="description"
                content="LibStack search for libraries, repositories and
                packages."/>
        </Helmet>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Header as='h2'>Search</Header>
        </header>
        <Header as='h3'>Query: {this.state.search.get("query")}</Header>
        <List>
          <List.Item><Link to="/lib-stack/owner1/lib1">Lib1</Link></List.Item>
          <List.Item><Link to="/lib-stack/owner2/lib2">Lib2</Link></List.Item>
          <List.Item><Link to="/lib-stack/owner3/lib3">Lib3</Link></List.Item>
          <List.Item><Link to="/lib-stack/owner4/lib4">Lib4</Link></List.Item>
        </List>
      </div>
    );
  }
}

export default Search;
