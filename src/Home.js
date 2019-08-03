import React, {Component} from 'react';
import logo from './libstack-logo.jpg';
import './App.css';
import { Grid, Form } from 'semantic-ui-react';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: ""
    };

    this.onChange = this.onChange.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.history.push("/lib-stack/search?query=" + this.state.query);
  }

  onChange(e) {
    this.setState({
      query: e.target.value
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <Grid padded>
          <Grid.Row centered>
            <Grid.Column width={12}>
              <Form onSubmit={e => this.onSubmit(e)}>
                <Form.Group>
                  <Form.Input
                    width={12}
                    size="big"
                    name="query"
                    value={this.state.query}
                    onChange={this.onChange}
                    placeholder="Search..."
                  />
                  <Form.Button
                    fluid
                    width={4}
                    size="big"
                    color="orange"
                    type="submit">
                    Search
                  </Form.Button>
                </Form.Group>
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default Home;
