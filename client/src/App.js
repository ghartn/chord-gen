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
				console.log(res.data);
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
		//TODO: fix key sigs
		return (
			<div className="App">
				<div className="App-vc">
					<h1 className="title">Chord Progession Generator</h1>
					<label for="key">Key: </label>
					<select name="key" className="input-field">
						<option name="random">Random</option>
						<option name="C">C / Am</option>
						<option name="C#">C# / Bbm</option>
						<option name="D">D / Bm</option>
						<option name="D#">D# / Cm</option>
						<option name="E">E / C#m</option>
						<option name="F">F / Dm</option>
						<option name="F#">F# / Ebm</option>
						<option name="G">G / Em</option>
						<option name="G#">G# / Fm</option>
						<option name="A">A / F#m</option>
						<option name="A#">A# / Gm</option>
						<option name="B">B / G#m</option>
					</select>
					<p className="help-block">
						The chord progression returned will be abstracted to the
						major key.
					</p>
					<label for="feel">Feeling: </label>
					<input
						className="input-field"
						name="feel"
						placeholder="Can be anything, a song title, a feeling, random words..."
						maxLength="50"
						onChange={this.onChange}
					/>
					<button className="btn" onClick={this.onClick}>
						Generate a progression
					</button>
				</div>
			</div>
		);
	}
}

export default App;
