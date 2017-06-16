import React, { Component } from 'react';
import './App.css';
import { Input, Header, Button } from 'semantic-ui-react'

class App extends Component {
  constructor() {
    super()
    this.onClick = this.onClick.bind(this);
  }

  onClick() {

  }

  render() {
    return (
        <div className="App">
          <div className="App-vc">
            <Header size='large'>How do you feel?</Header>
            <Input placeholder='...' />
            <Button primary onClick={this.onClick}>Generate</Button>
          </div>
        </div>
    );
  }
}

export default App;
