import React, { Component } from "react";
import "./App.css";
import "./loader.css";
import axios from "axios";

let state = {
	loading: false,
	key: "random",
	feel: "",
	progression: null
};

class App extends Component {
	constructor() {
		super();
		this.state = state;
		this.onClick = this.onClick.bind(this);
		this.onChange = this.onChange.bind(this);
		this.mapProgression = this.mapProgression.bind(this);
	}

	onClick() {
		this.setState({
			loading: true
		});
		axios
			.post("/api/watson/tone", this.state)
			.then(res => {
				this.setState({
					progression: res.data,
					loading: false
				});
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

	componentWillUnmount() {
		state = this.state;
	}
	

	mapProgression() {
		if (!this.state.progression) return;
		let progression = "";
		for (var index in this.state.progression) {
			progression += this.state.progression[index] + " ";
		}
		return (
			<h3>
				{progression}
			</h3>
		);
	}

	render() {
		//TODO: fix key sigs
		return (
			<div className="App">
				<div className="App-vc">
					<h1 className="title">Chord Progession Generator</h1>
					<label>Key: </label>
					<select
						name="key"
						className="input-field"
						onChange={this.onChange}
					>
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
						maxLength="100"
						onChange={this.onChange}
					/>
					<div className="btn-container">
						<div
							className={
								this.state.loading ? "loader custom-loader" : ""
							}
						/>
						<button
							className={"btn"}
							disabled={this.state.loading}
							onClick={this.onClick}
						>
							Generate a progression
						</button>
					</div>
					{this.mapProgression()}
				</div>
			</div>
		);
	}
}

export default App;
