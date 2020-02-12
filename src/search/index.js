import React, { Component } from 'react';
import {Helmet} from 'react-helmet';
import * as routes from '../routes';
import axios from 'axios';

import {List, Grid, Loader, Pagination, Message} from 'semantic-ui-react';
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
      error: null,
      totalPages: 0,
    };
    this.doSearch(new URLSearchParams(props.location.search).get('query'), activePage);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.search !== nextProps.location.search) {
      let activePage = new URLSearchParams(nextProps.location.search).get('p');
      activePage = parseInt(activePage) || 1;
      const query = new URLSearchParams(nextProps.location.search).get('query');
      this.setState({
        query: query,
        npmResults: [],
        error: null,
      });
      this.doSearch(query, activePage);
    }
  }

  doSearch = (query, activePage) => {
    const offset = activePage - 1;

    axios
      .get(this.state.apiDomain + '/api/v1/search?q=' + query + '&o=' + offset)
      .then(res => {
        this.setState({
          query: query,
          npmResults: res.data.results,
          activePage: activePage,
          totalPages: res.data.totalPages,
          error: null,
        });
      })
      .catch(err => {
        this.setState({
          query: query,
          npmResults: null,
          activePage: activePage,
          error: err.toString(),
        });
      });
  }

  onSubmit = (e, query) => {
    e.preventDefault();
    this.props.history.push(this.state.navLink + "?query=" + query);
    this.setState({
      npmResults: [],
      error: null,
    });
    this.doSearch(query, 1);
  }

  onPageChange = (e, {activePage}) => {
    this.props.history.push(this.state.navLink + "?query=" + this.state.query + "&p=" + activePage);
    // window.location.reload();
    this.setState({
      npmResults: [],
      error: null,
    });
    this.doSearch(this.state.query, activePage);
  }

  componentDidUpdate(prevProps, prevState) {
    window.scrollTo(0, 0);
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
        <Grid.Row centered className="search-container">
          <List className={'search-list'}>
            {Array.isArray(results) && results.length === 0 &&
              <Loader className={"list-loader"} active>Loading</Loader>
            }

            {this.state.error &&
              <Message negative compact icon="warning sign"
                header="Oops!! Something went wrong!!"
                content="Don't worry brothers of the Night's Watch are awake to fix whatever is beyond this wall!!" />
            }

            {results === "No results found" &&
              <Message info compact icon="warning sign"
                header="No results found!!"
                content="That's right. You came out here looking for something that didn't exist." />
            }

            {Array.isArray(results) && results.map(node => {

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
          {Array.isArray(results) && results.length > 0 && this.state.totalPages > 0 &&
            <Pagination
              activePage={this.state.activePage}
              onPageChange={this.onPageChange}
              totalPages={this.state.totalPages}
            />
          }
        </Grid.Row>
        <Grid.Row centered>
          <Footer />
        </Grid.Row>
      </Grid>
    );
  }
}

export default Search;
