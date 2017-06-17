import React, {Component} from 'react';
import './App.css';
import {Input, Header, Button} from 'semantic-ui-react';
import axios from 'axios';

class App extends Component {
  constructor() {
    super()
    this.onClick = this
      .onClick
      .bind(this);
    this.onChange = this
      .onChange
      .bind(this);
  }

  onClick() {
    axios
      .post('/api/watson/tone', this.state)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render() {
    return (
      <div className="App">
        <div className="App-vc">
          <Header size='large'>How do you feel?</Header>
          <Input name="feel" placeholder='...' onChange={this.onChange}/>
          <Button primary onClick={this.onClick}>Generate</Button>
        </div>
      </div>
    );
  }
}

export default App;
