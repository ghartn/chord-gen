import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Slider from "react-rangeslider";
import Tone from "tone";
import axios from "axios";
import 'react-rangeslider/lib/index.css'
import "./css/App.css";
class Progression extends Component {
	constructor() {
		super();
		this.state = { playing: false, loading: false, bpm: 80 };
		Tone.Transport.bpm.value = 80;
		this.mapProgression = this.mapProgression.bind(this);
		this.playProgression = this.playProgression.bind(this);
		this.clearPlaying = this.clearPlaying.bind(this);
		this.onBPMChange = this.onBPMChange.bind(this);
		this.onMIDIGenerate = this.onMIDIGenerate.bind(this);
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

	onBPMChange(bpm) {
		this.setState({
			bpm: bpm
		});
		Tone.Transport.bpm.value = bpm;
	}

	onMIDIGenerate() {
		this.setState({
			loading: true
		});
		axios
			.post("/api/midi", this.state)
			.then(res => {
				window.open(res.data);
				this.setState({
					loading: false
				});
			})
			.catch(err => {
				console.log(err);
			});
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
				if (!this.state.playing) {
					Tone.Transport.stop();
					this.clearPlaying();
					return;
				}
				Tone.Transport.stop();
				Tone.Transport.start();
				this.clearPlaying();
				var polySynth = new Tone.PolySynth(4, Tone.Synth).toMaster();
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
					<Slider
						min={20}
						max={200}
						step={1}
						value={this.state.bpm}
						onChange={this.onBPMChange}
					/>
					<i
						className={
							this.state.playing
								? "fa fa-pause play-btn"
								: "fa fa-play play-btn"
						}
						onClick={this.playProgression}
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
							onClick={this.onMIDIGenerate}
						>
							Generate MIDI
						</button>
					</div>
				</div>
			</div>
		);
	}
}

export default withRouter(Progression);
