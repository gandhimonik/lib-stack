import React, { Component } from 'react';
import {Helmet} from 'react-helmet';
import * as routes from '../routes';
import axios from 'axios';

import {List, Grid, Loader} from 'semantic-ui-react';
import GlobalHeader from '../common/header';
import SearchForm from '../common/search-form';

import './index.css';
import Intro from '../common/intro';
import Stats from '../common/stats';
import Footer from '../common/footer';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: new URLSearchParams(props.location.search).get('query'),
      navLink: routes.SEARCH,
      npmResults: [],
    };
    this.doSearch(new URLSearchParams(props.location.search).get('query'));
  }

  doSearch = (query) => {
    axios
      .get('https://test-github-oauth.firebaseapp.com/api/v1/search?q=' + query + '&o=0')
      .then(res => {
        this.setState({
          query: query,
          npmResults: res.data,
        });
        console.log(res.data);
      })
      .catch(err => console.log(err));
  }

  onSubmit = (e, query) => {
    e.preventDefault();
    this.props.history.push(this.state.navLink + "?query=" + query);
    this.doSearch(query);
  }

  render() {
    const results = this.state.npmResults;

    return (
      <Grid>
        <Helmet>
          <title>{this.state.query} - LibStack Search</title>
          <meta name="description"
                content="LibStack search for libraries, repositories and
                packages."/>
        </Helmet>
        <Grid.Row>
          <GlobalHeader />
        </Grid.Row>
        <Grid.Row centered className="search">
          <Grid.Column width={14}>
            <SearchForm onSubmit={this.onSubmit} query={this.state.query} />
          </Grid.Column>
        </Grid.Row>
        <List className={'search-list'}>
          {results.map(node => {
            console.log(node);

            return (
              <List.Item className={'search-item'} key={node.package.name}>
                <Intro
                  nameWithOwner={node.package.nameWithOwner}
                  name={node.package.name}
                  description={node.package.description}
                  owner={node.package.publisher.username}
                  version={node.package.version}
                  date={new Date(node.package.date).toDateString()}
                  gravatar={node.package.publisher.gravatar}
                  isLink={true}
                  />
                  <Stats
                    type={'left'}
                    watchers={node.github.watchCount}
                    stars={node.github.starCount}
                    downloads={node.downloadCount}
                    forks={node.github.forkCount}
                    bugs={node.github.issueCount}
                  />
              </List.Item>
            );
          })}
        </List>
        <Footer />
      </Grid>
    );
  }
}

export default Search;
