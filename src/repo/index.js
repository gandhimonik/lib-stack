import React, {Component} from 'react';
import {Helmet} from 'react-helmet';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
import axios from 'axios';
import {getParameters} from 'codesandbox/lib/api/define';

import GlobalHeader from '../common/header';

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
      tree: object(expression: "master:") {
        ...on Tree {
          entries {
            oid
            name
          }
        }
      }
      packageJSON:  object(expression: "master:package.json") {
        ...on Blob {
          text
        }
      }
    }
  }
`;

const sandboxBaseUrl = `https://codesandbox.io/api/v1/sandboxes/define`;

class Repo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      owner: props.match.params.owner,
      repo: props.match.params.repo,
      sandboxUrl: 'https://codesandbox.io/embed/',
      isSandboxReady: false,
    };
  }

  getSandbox = (packageJSON) => {
    console.log(packageJSON);
    const parameters = getParameters({
      files: {
        "index.js": {
          content: "const " + packageJSON.name + " = require('" + packageJSON.name + "');"
        },
        "package.json": {
          content: { 
            dependencies: {
              [packageJSON.name]: "^" + packageJSON.version,
            } 
          }
        }
      }
    });

    const url = sandboxBaseUrl + `?parameters=${parameters}&json=1`;

    axios.get(url)
      .then(response => {
        console.log(response.data.sandbox_id);
        this.setState({
          owner: this.state.owner,
          repo: this.state.repo,
          sandboxUrl: this.state.sandboxUrl + response.data.sandbox_id,
          isSandboxReady: true,
        });
      });
  }

  render() {
   const { sandboxUrl, isSandboxReady } = this.state;

    return (
      <div className="App">
        <Helmet>
          <title>{this.state.owner}/{this.state.repo} - LibStack</title>
          <meta name="description"
                content="Github repo description"/>
        </Helmet>
        <GlobalHeader withSearch={true} />
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

            if (!isSandboxReady) {
              this.getSandbox(JSON.parse(repository.packageJSON.text));
            }

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

        {isSandboxReady &&
        <iframe
          src={sandboxUrl}
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
