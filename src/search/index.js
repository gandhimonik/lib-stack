import React, { Component } from 'react';
import {Helmet} from 'react-helmet';
import * as routes from '../routes';
import axios from 'axios';

import {List, Grid, Loader, Pagination} from 'semantic-ui-react';
import GlobalHeader from '../common/header';
import SearchForm from '../common/search-form';

import './index.css';
import Intro from '../common/intro';
import Stats from '../common/stats';
import Footer from '../common/footer';

class Search extends Component {
  constructor(props) {
    super(props);
    let activePage = new URLSearchParams(props.location.search).get('p');
    activePage = parseInt(activePage) || 1;
    this.state = {
      query: new URLSearchParams(props.location.search).get('query'),
      activePage: activePage,
      navLink: routes.SEARCH,
      npmResults: [],
      apiDomain: props.apiDomain,
    };
    this.doSearch(new URLSearchParams(props.location.search).get('query'), activePage);
  }

  doSearch = (query, activePage) => {
    const offset = activePage - 1;
    console.log(offset);

    axios
      .get(this.state.apiDomain + '/api/v1/search?q=' + query + '&o=' + offset)
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
    this.setState({
      activePage: 1,
      npmResults: []
    });
    this.doSearch(query, 1);
  }

  onPageChange = (e, {activePage}) => {
    console.log(this.state.navLink);
    this.props.history.push(this.state.navLink + "?query=" + this.state.query + "&p=" + activePage);
    window.location.reload();
    // this.setState({
    //   activePage: activePage,
    //   npmResults: []
    // });
    // this.doSearch(this.state.query, activePage);
  }

  // componentDidUpdate() {
  //   window.scrollTo(0, 0);
  // }

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
        <Grid.Row centered className="search-container">
          <List className={'search-list'}>
            {results.length === 0 &&
              <Loader className={"list-loader"} active>Loading</Loader>
            }

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
          {results.length > 0 &&
            <Pagination
              activePage={this.state.activePage}
              onPageChange={this.onPageChange}
              totalPages={10}
            />
          }
        </Grid.Row>
        <Footer />
      </Grid>
    );
  }
}

export default Search;
