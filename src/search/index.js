import React, { Component } from 'react';
import {Helmet} from 'react-helmet';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
import * as routes from '../routes';

import {List, Grid, Loader} from 'semantic-ui-react';
import GlobalHeader from '../common/header';
import SearchForm from '../common/search-form';

import './index.css';
import Intro from '../common/intro';
import Stats from '../common/stats';
import Footer from '../common/footer';

const GET_REPO_CURRENT_USER = gql`
  query($query: String!) {
    search(query: $query, type:REPOSITORY, first: 5) {
      edges {
        node {
          ...on Repository {
            id
            name
            nameWithOwner
            url
            descriptionHTML
            owner {
              login
              avatarUrl
            }
            watchers {
              totalCount
            }
            forkCount
            issues {
              totalCount
            }
            stargazers {
              totalCount
            }
            downloadCount @client
          }
        }
      }
    }
  }
`;

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: new URLSearchParams(props.location.search).get('query'),
      navLink: routes.SEARCH,
      npmResults: [],
    };
  }

  onSubmit = (e, query) => {
    e.preventDefault();
    this.props.history.push(this.state.navLink + "?query=" + query);
    this.setState({
      query
    });
  }

  render() {
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
        <Query query={GET_REPO_CURRENT_USER} variables={{query: this.state.query}}>
          {({data, loading, error}) => {
            if (error) {
              return <div>Error...</div>
            }

            if (loading) {
              return <Grid.Row centered className={"loader"}><Loader active>Loading</Loader></Grid.Row>;
            }

            data = (data.search) ? data : { search: {edges: []} };
            const { search: { edges } } = data;

            return (
              <List className={'search-list'}>
                {edges.map(({node}) => {
                  const downloads = (node.downloadCount) ? node.downloadCount.downloads : '';

                  return (
                    <List.Item className={'search-item'} key={node.id}>
                      <Intro
                        nameWithOwner={node.nameWithOwner}
                        name={node.name}
                        description={node.descriptionHTML}
                        avatar={node.owner.avatarUrl}
                        owner={node.owner.login}
                        isLink={true}
                       />
                       <Stats
                          type={'left'}
                          watchers={node.watchers.totalCount}
                          stars={node.stargazers.totalCount}
                          downloads={downloads}
                          forks={node.forkCount}
                          bugs={node.issues.totalCount}
                       />
                       {/* <a href={node.url} target="_blank" rel="noopener noreferrer">Github</a> */}
                    </List.Item>
                  );
                })}
              </List>
            );
          }}
        </Query>
        <Footer />
      </Grid>
    );
  }
}

export default Search;
