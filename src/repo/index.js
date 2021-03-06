import React, {Component} from 'react';
import {Helmet} from 'react-helmet';
import axios from 'axios';
import {getParameters} from 'codesandbox/lib/api/define';

import GlobalHeader from '../common/header';
import Intro from '../common/intro';
import Stats from '../common/stats';
import Markdown from '../common/markdown';
import { Loader, Message, Grid } from 'semantic-ui-react';
import Footer from '../common/footer';

import './index.css';

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
      error: null,
    };
    this.getData();
  }

  getData = () => {
    axios
      .get(this.state.apiDomain + '/api/v1/new-package?repo=' + this.state.repo)
      .then(res => {
        if (Object.keys(res.data).length === 0) {
          this.setState({
            packageData: null,
            error: 'Error',
          });
        } else {
          this.setState({
            packageData: res.data,
          });
          this.getSandbox();
        }
      })
      .catch(err => {
        this.setState({
          packageData: null,
          error: err.toString(),
        });
      });
  }

  getSandbox = () => {
    const { collected: { metadata } } = this.state.packageData;
    // const { example } = this.state.packageData;
    let snippet = null;

    // if (example === null || example.length === 0 || example[1].length === 0) {
      let name = metadata.name.replace(/-/g, '');
      snippet = "const " + name + " = require('" + metadata.name + "');\nconsole.log(" + name + ");"
    // } else {
    //   snippet = example[1];
    // }

    snippet += `\n\ndocument.getElementById('app').innerHTML = \n'<h1>Hello ${metadata.name}!</h1>'`;

    // metadata.dependencies = metadata.dependencies || {};
    // metadata.dependencies = Object.assign(metadata.dependencies, metadata.devDependencies);
    metadata.dependencies = {};
    metadata.dependencies = Object.assign(metadata.dependencies, metadata.peerDependencies);
    metadata.dependencies[metadata.name] = "^" + metadata.version;
    
    const params = getParameters({
      files: {
        "index.html": {
          content: `<!DOCTYPE html>
          <html>
          
          <head>
            <title>Parcel Sandbox</title>
            <meta charset="UTF-8" />
          </head>
          
          <body>
            <div id="app"></div>
          
            <script src="index.js">
            </script>
          </body>
          
          </html>`
        },
        "index.js": {
          content: snippet
        },
        "sandbox.config.json": {
          content: {
            "template": "parcel"
          }
        },
        "package.json": {
          content: {
            "scripts": {
              "start": "parcel index.html --open",
              "build": "parcel build index.html"
            },
            "dependencies": metadata.dependencies,
          }
        }
      }
    });

    axios.post(sandboxBaseUrl, {
      parameters: params,
      json: 1
    })
    .then(response => {
      this.setState({
        owner: this.state.owner,
        repo: this.state.repo,
        sandboxUrl: this.state.sandboxUrl + response.data.sandbox_id + '?forcerefresh=1&view=split&codemirror=1&theme=light',
        isSandboxReady: true,
      });
    })
    .catch(err => console.error(err));
  }

  render() {
   const { sandboxUrl, isSandboxReady } = this.state;

    return (
      <Grid>
        <Helmet>
          <title>{this.state.owner}/{this.state.repo} - LibStack</title>
          <meta name="description"
                content="Github repo description"/>
        </Helmet>
        <Grid.Row>
          <GlobalHeader withSearch={true} history={this.props.history} />
        </Grid.Row>
        <Grid.Row className={"main"}>
          { !this.state.error && this.state.packageData === null &&
            <Loader active>Loading</Loader>
          }

          { this.state.error &&
            <Message negative compact icon="warning sign"
              header="Oops!! Something went wrong!!"
              content="Don't worry brothers of the Night's Watch are awake to fix whatever is beyond this wall!!" />
          }

          { !this.state.error && this.state.packageData &&
            <div className="wrapper">
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
              { this.state.packageData.github.readme &&
                isSandboxReady &&
                  <Markdown
                    nameWithOwner={this.state.owner+ '/' + this.state.repo}
                    data={this.state.packageData.github.readme}
                    isSandboxReady={isSandboxReady}
                    sandboxUrl={sandboxUrl}
                  />
              }
              { this.state.packageData.github.readme &&
                !isSandboxReady &&
                  <Markdown
                    nameWithOwner={this.state.owner+ '/' + this.state.repo}
                    data={this.state.packageData.github.readme}
                  />
              }
            </div>
          }
        </Grid.Row>
        <Grid.Row centered>
          <Footer />
        </Grid.Row>
      </Grid>
    );
  }
}

export default Repo;
