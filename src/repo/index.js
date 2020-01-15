import React, {Component} from 'react';
import {Helmet} from 'react-helmet';
import axios from 'axios';
import {getParameters} from 'codesandbox/lib/api/define';

import GlobalHeader from '../common/header';
import Intro from '../common/intro';
import Stats from '../common/stats';
import Markdown from '../common/markdown';
import { Loader } from 'semantic-ui-react';

const sandboxBaseUrl = `https://codesandbox.io/api/v1/sandboxes/define`;

class Repo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      owner: props.match.params.owner,
      repo: props.match.params.repo,
      sandboxUrl: 'https://codesandbox.io/embed/',
      isSandboxReady: false,
      packageData: null,
    };
    this.getData();
  }

  getData = () => {
    axios
      .get('https://test-github-oauth.firebaseapp.com/api/v1/package?repo=' + this.state.repo)
      .then(res => {
        this.setState({
          packageData: res.data,
        });
        console.log(res.data);
      })
      .catch(err => console.log(err));
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

        { this.state.packageData === null &&
          <Loader active>Loading</Loader>
        }

        { this.state.packageData &&
          <div>
            <Intro
              nameWithOwner={this.state.packageData.collected.metadata.nameWithOwner}
              name={this.state.packageData.collected.metadata.name}
              description={this.state.packageData.collected.metadata.description}
              owner={this.state.packageData.collected.metadata.publisher.username}
              version={this.state.packageData.collected.metadata.version}
              date={new Date(this.state.packageData.collected.metadata.date).toDateString()}
              gravatar={this.state.packageData.collected.metadata.publisher.gravatar}
              isLink={false}
            />
            <Stats
              type={'left'}
              watchers={this.state.packageData.github.watchCount}
              stars={this.state.packageData.github.starCount}
              downloads={this.state.packageData.downloadCount}
              forks={this.state.packageData.github.forkCount}
              bugs={this.state.packageData.github.issueCount}
            />
            { this.state.packageData.collected.metadata.readme &&
              <Markdown
                nameWithOwner={this.state.owner+ '/' + this.state.repo}
                data={this.state.packageData.github.readme}
              />
            }
          </div>
        }

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
