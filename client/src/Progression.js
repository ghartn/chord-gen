import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Tone from "tone";
import "./css/App.css";
class Progression extends Component {
	constructor() {
		super();
		this.mapProgression = this.mapProgression.bind(this);
		this.playProgression = this.playProgression.bind(this);
	}

	componentWillMount() {
		if (!this.props.location.state) this.props.history.push("/");
		else {
			this.setState(this.props.location.state);
		}
	}

	mapProgression() {
		if (!this.state.progression) return;
		let progression = "";
		for (var index in this.state.progression) {
			index == this.state.progression.length - 1
				? (progression += this.state.progression[index])
				: (progression += this.state.progression[index] + " - ");
		}
		return (
			<h3 className="progression">
				{progression}
			</h3>
		);
	}

	playProgression() {
		Tone.Transport.stop();
		Tone.Transport.start();
		if (this.state.players) {
			for (var i in this.state.players) {
				Tone.Transport.clear(this.state.players[i]);
			}
			this.setState({
				players: null
			});
		}
		var polySynth = new Tone.PolySynth(4, Tone.Synth).toMaster();
		Tone.Transport.bpm.value = 80;
		if (!this.state.notes) return;
		let players = [];
		for (let index in this.state.notes) {
			let chord = this.state.notes[index];
			let tonePlayer = Tone.Transport.scheduleOnce(() => {
				console.log(chord, index);
				//polySynth.triggerAttackRelease(chord, "1m", "+" + index + "m");
				polySynth.triggerAttackRelease(chord, "1m");
			}, "+" + index + "m");
			console.log(tonePlayer);
			players.push(tonePlayer);
		}
		this.setState({
			players: players
		});
	}

	render() {
		return (
			<div className="App">
				<div className="App-vc">
					<h1 className="title">Chord Progession</h1>
					{this.mapProgression()}
					<i
						className="fa fa-play play-btn"
						onClick={this.playProgression}
					/>
				</div>
			</div>
		);
	}
}

export default withRouter(Progression);
