import React, {Component} from 'react';
import {Helmet} from 'react-helmet';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';

import logo from './libstack-logo.jpg';

import {Header} from 'semantic-ui-react';

const GET_REPO = gql`
  query ($owner:String!, $name:String!) {
    repository(owner:$owner, name:$name) {
      id
      descriptionHTML
      name
      url
      nameWithOwner
      stargazers {
        totalCount
      }
      watchers {
        totalCount
      }
    }
  }
`;

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
        <Query
          query={GET_REPO}
          variables={{owner: this.state.owner, name: this.state.repo}}
        >
          {({data, loading, error}) => {
            if (error) {
              return <div>Error...</div>
            }

            if (loading) {
              return <div>Loading...</div>
            }

            const { repository } = data;

            return (
              <div>
                <h1>{repository.nameWithOwner}</h1>
                <h5>{repository.stargazers.totalCount} = Stars</h5>
                <h5>{repository.watchers.totalCount} = Watchers</h5>
                <p dangerouslySetInnerHTML={{__html: repository.descriptionHTML}}></p>
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default Repo;
