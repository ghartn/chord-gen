import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Tone from "tone";
import "./css/App.css";
class Progression extends Component {
	constructor() {
		super();
		this.state = { playing: false };
		this.mapProgression = this.mapProgression.bind(this);
		this.playProgression = this.playProgression.bind(this);
		this.clearPlaying = this.clearPlaying.bind(this);
	}

	componentWillMount() {
		if (!this.props.location.state) this.props.history.push("/");
		else {
			this.setState(this.props.location.state);
		}
	}

	mapProgression() {
		if (!this.state.progression || !this.state.key) return;
		let progression = "";
		for (var index in this.state.progression) {
			index == this.state.progression.length - 1 // eslint-disable-line
				? (progression += this.state.progression[index])
				: (progression += this.state.progression[index] + " - ");
		}
		return (
			<div className="progression">
				<h3>
					{progression}
				</h3>
				<p>
					in the key of {this.state.key}
				</p>
			</div>
		);
	}

	clearPlaying() {
		if (this.state.players) {
			for (var i in this.state.players) {
				Tone.Transport.clear(this.state.players[i]);
			}
			this.setState({
				players: null
			});
		}
	}

	playProgression() {
		this.setState(
			{
				playing: !this.state.playing
			},
			() => {
				Tone.Master.mute = !this.state.playing;
				if(!this.state.playing) {
					Tone.Transport.stop();
					this.clearPlaying();
					return;
				}
				Tone.Transport.stop();
				Tone.Transport.start();
				this.clearPlaying();
				var polySynth = new Tone.PolySynth(4, Tone.Synth).toMaster();
				Tone.Transport.bpm.value = 128;
				if (!this.state.notes) return;
				let players = [];
				for (let index in this.state.notes) {
					let chord = this.state.notes[index];
					let tonePlayer = Tone.Transport.scheduleOnce(() => {
						polySynth.triggerAttackRelease(chord, "1m");
					}, "+" + index + "m");
					players.push(tonePlayer);
				}
				console.log(Tone.Transport.state);
				this.setState({
					players: players
				});
			}
		);
	}

	render() {
		return (
			<div className="App">
				<div className="App-vc">
					<h1 className="title">Chord Progession</h1>
					<div className="divider" />
					{this.mapProgression()}
					<i
						className={
							this.state.playing
								? "fa fa-pause play-btn"
								: "fa fa-play play-btn"
						}
						onClick={this.playProgression}
					/>
				</div>
			</div>
		);
	}
}

export default withRouter(Progression);
