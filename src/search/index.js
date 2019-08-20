import React, { Component } from 'react';
import {Helmet} from 'react-helmet';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
import axios from 'axios';

import {List, Grid} from 'semantic-ui-react';
import GlobalHeader from '../common/header';
import SearchForm from '../common/search-form';

import './index.css';
import Intro from '../common/intro';

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
          }
        }
      }
    }
  }
`;

const npmRegistryUrl = `http://registry.npmjs.org/-/v1/search?text=`;

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: new URLSearchParams(props.location.search).get('query'),
      navLink: '/lib-stack/search',
      npmResults: [],
    };
  }

  componentDidMount = () => {
    let url = npmRegistryUrl + this.state.query + '&size=3&from=0';

    axios.get(url)
      .then(response => {
        console.log(response);
        this.setState({
          query: this.state.query,
          npmResults: response.data.objects,
        });
      });
  }

  onSubmit = (e, query) => {
    e.preventDefault();
    let url = npmRegistryUrl + query + '&size=3&from=0';

    axios.get(url)
      .then(response => {
        console.log(response);
        this.props.history.push(this.state.navLink + "?query=" + query);
        this.setState({
          query,
          npmResults: response.data.objects,
        });
      });
  }

  render() {
    const { npmResults } = this.state;

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
              return <div>Loading...</div>
            }

            const { search: { edges } } = data;

            return (
              <List style={{width: '100%'}}>
                {edges.map(({node}) => {
                  return (
                    <List.Item key={node.id} style={{marginBottom: '3rem'}}>
                      <Intro 
                        nameWithOwner={node.nameWithOwner}
                        name={node.name}
                        description={node.descriptionHTML}
                        avatar={node.owner.avatarUrl}
                        owner={node.owner.login}
                        isLink={true}
                       />
                       <a href={node.url} target="_blank" rel="noopener noreferrer">Github</a>
                    </List.Item>
                  );
                })}
              </List>
            );
          }}
        </Query>

        {npmResults && npmResults.length > 0 && 
          <List>
            {npmResults.map(obj => {
              let date = new Date(obj.package.date);
              return (
                <List.Item key={obj.score.final}>
                  {obj.package.name} | published {obj.package.version} | {date.toDateString()}
                </List.Item>
              );
            })
            }
          </List>
        }  
      </Grid>
    );
  }
}

export default Search;
