import React, {Component} from 'react';
import {Helmet} from 'react-helmet';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
import axios from 'axios';
import {getParameters} from 'codesandbox/lib/api/define';

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

const parameters = getParameters({
  files: {
    "index.js": {
      content: "console.log('hello')"
    },
    "package.json": {
      content: { dependencies: {} }
    }
  }
});

const sandboxURL = `https://codesandbox.io/api/v1/sandboxes/define?parameters=${parameters}&json=1`;

class Repo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      owner: props.match.params.owner,
      repo: props.match.params.repo,
      sandboxUrl: 'https://codesandbox.io/embed/',
    };


  }

  componentDidMount = () => {
    axios.get(sandboxURL)
      .then(response => {
        console.log(response.data.sandbox_id);
        this.setState({
          owner: this.state.owner,
          repo: this.state.repo,
          sandboxUrl: this.state.sandboxUrl + response.data.sandbox_id,
        });
      });
  }

  render() {
   const { sandboxUrl } = this.state;

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

        {sandboxUrl &&
        <iframe
          src={this.state.sandboxUrl}
          title="Code Example"
          style={{
            width:'100%',
            height: '500px',
            border: '0',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
          sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
        />}
      </div>
    );
  }
}

export default Repo;
