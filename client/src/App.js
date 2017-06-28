import React, { Component } from "react";
import "./App.css";
import "./loader.css";
import axios from "axios";

class App extends Component {
	constructor() {
		super();
		this.state = {
			loading: false,
			key: "random",
			feel: ""
		}
		this.onClick = this.onClick.bind(this);
		this.onChange = this.onChange.bind(this);
	}

	onClick() {
		this.setState({
			loading: true
		})
		axios
			.post("/api/watson/tone", this.state)
			.then(res => {
				console.log(res.data);
				this.setState({
					loading: false
				})
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
					<label>Key: </label>
					<select name="key" className="input-field" onChange={this.onChange}>
						<option value="random">Random</option>
						<option value="C">C / Am</option>
						<option value="C#">C# / Bbm</option>
						<option value="D">D / Bm</option>
						<option value="D#">D# / Cm</option>
						<option value="E">E / C#m</option>
						<option value="F">F / Dm</option>
						<option value="F#">F# / Ebm</option>
						<option value="G">G / Em</option>
						<option value="G#">G# / Fm</option>
						<option value="A">A / F#m</option>
						<option value="A#">A# / Gm</option>
						<option value="B">B / G#m</option>
					</select>
					<p className="help-block">
						The chord progression returned will be abstracted to the
						major key.
					</p>
					<label>Feeling: </label>
					<input
						className="input-field"
						name="feel"
						placeholder="Can be anything, a song title, a feeling, random words..."
						maxLength="50"
						onChange={this.onChange}
					/>
					<button className={(this.state.loading) ? "btn loader" : "btn"} disabled={this.state.loading} onClick={this.onClick}>
						Generate a progression
					</button>
				</div>
			</div>
		);
	}
}

export default App;
