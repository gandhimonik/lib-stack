import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {Helmet} from 'react-helmet';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';

import {List, Header} from 'semantic-ui-react';
import GlobalHeader from '../common/header';

const GET_REPO_CURRENT_USER = gql`
  query($query: String!) {
    search(query: $query, type:REPOSITORY, first: 5) {
      edges {
        node {
          ...on Repository {
            id
            nameWithOwner
            url
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
      query: new URLSearchParams(props.location.search).get('query')
    };
  }

  render() {
    return (
      <div className="App">
        <Helmet>
          <title>{this.state.query} - LibStack Search</title>
          <meta name="description"
                content="LibStack search for libraries, repositories and
                packages."/>
        </Helmet>
        <GlobalHeader />
        <Header as='h3'>Query: {this.state.query}</Header>
        <List>
          <List.Item><Link to="/lib-stack/owner1/lib1">Lib1</Link></List.Item>
          <List.Item><Link to="/lib-stack/owner2/lib2">Lib2</Link></List.Item>
          <List.Item><Link to="/lib-stack/owner3/lib3">Lib3</Link></List.Item>
          <List.Item><Link to="/lib-stack/owner4/lib4">Lib4</Link></List.Item>
        </List>
        <Query query={GET_REPO_CURRENT_USER} variables={{query: this.state.query}}>
          {({data, loading, error}) => {
            if (error) {
              return <div>Error...</div>
            }

            if (loading) {
              return <div>Loading...</div>
            }

            const { search: { edges } } = data;

            return (
              <List>
                {edges.map(({node}) => {
                  return (
                    <List.Item key={node.id}>
                      <Link to={node.nameWithOwner}>{node.nameWithOwner}</Link>
                    </List.Item>
                  );
                })}
              </List>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default Search;
