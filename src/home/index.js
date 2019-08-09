import React, {Component} from 'react';
import { Grid, Header, Container } from 'semantic-ui-react';
import Logo from '../common/logo';
import SearchForm from '../common/search-form';
import Footer from '../common/footer';

import './index.css';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      navLink: '/lib-stack/search'
    };
  }
  
  onSubmit = (e, query) => {
      e.preventDefault();
      this.props.history.push(this.state.navLink + "?query=" + query);
  }

  render() {
    return (
      <div className="main" style={{height: '100vh'}}>
        <Grid style={{marginTop: '10vh', marginBottom: '7rem'}}>
          <Grid.Row centered>
            <Logo size={'large'} />
          </Grid.Row>
          <Grid.Row centered>
            <Grid.Column width={15} className="aligned">
              <Header as='h3' className="title">Why search on Github and NPM when you can do both at the same time.</Header>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row centered>
            <Container text className="copy">
              <p>With LibStack, you can find what you’re looking for on Github and NPMJS registry in one go. LibStack provides consolidated info from Github and NPMJS along with a better interface to access the repository effectively and run its examples through a coding playground.</p>
            </Container>
          </Grid.Row>
          <Grid.Row centered>
            <Grid.Column width={14}>
              <SearchForm onSubmit={this.onSubmit} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Footer format="abs" />
      </div>
    );
  }
}

export default Home;
