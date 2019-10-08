import React, {Component} from 'react';
import {Helmet} from 'react-helmet';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
import axios from 'axios';
import {getParameters} from 'codesandbox/lib/api/define';

import GlobalHeader from '../common/header';
import Intro from '../common/intro';
import Stats from '../common/stats';
import Markdown from '../common/markdown';

const GET_REPO = gql`
  query ($owner:String!, $name:String!) {
    repository(owner:$owner, name:$name) {
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
      defaultBranchRef {
        name
      }
      tree: object(expression: "HEAD:") {
        ...on Tree {
          entries {
            oid
            name
          }
        }
      }
      packageJSON:  object(expression: "HEAD:package.json") {
        ...on Blob {
          text
        }
      }
      README:  object(
        expression: "HEAD:README.md") {
        ...on Blob {
          text
        }
      }
      readme: object(
        expression: "HEAD:readme.md") {
        ...on Blob {
          text
        }
      }
      githubReadme: object(
        expression: "HEAD:.github/readme.md") {
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
        <GlobalHeader withSearch={true} history={this.props.history} />
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
            console.log(repository);

            // if (!isSandboxReady) {
            //   console.log(repository);
            //   this.getSandbox(JSON.parse(repository.packageJSON.text));
            // }

            const downloads = (repository.downloadCount) ? repository.downloadCount.downloads : '';
            let readMe = repository.README || repository.readme || repository.githubReadme;
            
            return (
              <div>
                <Intro 
                  nameWithOwner={repository.nameWithOwner}
                  name={repository.name}
                  description={repository.descriptionHTML}
                  avatar={repository.owner.avatarUrl}
                  owner={repository.owner.login}
                  isLink={false}
                />
                <Stats 
                  type={'left'}
                  watchers={repository.watchers.totalCount}
                  stars={repository.stargazers.totalCount}
                  downloads={downloads}
                  forks={repository.forkCount}
                  bugs={repository.issues.totalCount}
                />
                { readMe && readMe.text && 
                  <Markdown
                    nameWithOwner={repository.nameWithOwner}
                    data={readMe.text}
                  />
                }
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
