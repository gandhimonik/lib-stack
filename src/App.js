import React from 'react';
import logo from './libstack-logo.jpg';
import './App.css';
import {Button, Grid, Input} from 'semantic-ui-react';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <Grid padded>
        <Grid.Row centered>
          <Grid.Column width={10}>
            <Input fluid size='big' placeholder='Search...' />
          </Grid.Column>
          <Grid.Column width={3}>
            <Button fluid color='orange' content="Search" size='big' />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
}

export default App;
