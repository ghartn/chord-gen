import React, { Component } from "react";
import "./App.css";
import axios from "axios";

class App extends Component {
	constructor() {
		super();
		this.onClick = this.onClick.bind(this);
		this.onChange = this.onChange.bind(this);
	}

	onClick() {
		axios
			.post("/api/watson/tone", this.state)
			.then(res => {
				console.log(res);
			})
			.catch(err => {
				console.log(err);
			});
	}

	onChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}

	render() {
		return (
			<div className="App">
				<div className="App-vc">
					<input
						className="input-field"
						name="feel"
						placeholder="How do you feel?"
						onChange={this.onChange}
					/>
					<button className="btn" onClick={this.onClick}>Generate a progression</button>
				</div>
			</div>
		);
	}
}

export default App;
