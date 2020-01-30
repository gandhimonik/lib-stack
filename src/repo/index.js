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
      apiDomain: props.apiDomain,
    };
    this.getData();
  }

  getData = () => {
    axios
      .get(this.state.apiDomain + '/api/v1/package?repo=' + this.state.repo)
      .then(res => {
        this.setState({
          packageData: res.data,
        });
        this.getSandbox();
        console.log(res.data);
      })
      .catch(err => console.log(err));
  }

  getSandbox = () => {
    const { collected: { metadata } } = this.state.packageData;
    const { example } = this.state.packageData;
    let snippet = null;

    if (example === null || example.length === 0 || example[1].length === 0) {
      let name = metadata.name.replace(/-/g, '');
      snippet = "const " + name + " = require('" + metadata.name + "');\nconsole.log(" + name + ");"
    } else {
      snippet = example[1];
    }

    metadata.dependencies = metadata.dependencies || {};
    metadata.dependencies[metadata.name] = "^" + metadata.version;
    console.log(metadata);

    const parameters = getParameters({
      files: {
        "index.js": {
          content: snippet
        },
        "package.json": {
          content: {
            dependencies: metadata.dependencies,
            devDependencies: metadata.devDependencies,
            peerDependencies: metadata.peerDependencies,
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
          sandboxUrl: this.state.sandboxUrl + response.data.sandbox_id + '?view=split&codemirror=1&theme=light',
          isSandboxReady: true,
        });
      })
      .catch(err => console.log(err));
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
            {/* {isSandboxReady &&
            <iframe
              src={sandboxUrl}
              title="Code Example"
              style={{
                width:'90%',
                height: '500px',
                border: '2px solid black',
                borderRadius: '4px',
                overflow: 'hidden',
                marginLeft: '1.5rem',
              }}
              sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
            />} */}
            { this.state.packageData.collected.metadata.readme &&
              isSandboxReady &&
                <Markdown
                  nameWithOwner={this.state.owner+ '/' + this.state.repo}
                  data={this.state.packageData.github.readme}
                  isSandboxReady={isSandboxReady}
                  sandboxUrl={sandboxUrl}
                />
            }
            { this.state.packageData.collected.metadata.readme &&
              !isSandboxReady &&
                <Markdown
                  nameWithOwner={this.state.owner+ '/' + this.state.repo}
                  data={this.state.packageData.github.readme}
                />
            }
          </div>
        }
      </div>
    );
  }
}

export default Repo;
