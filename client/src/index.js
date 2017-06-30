import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import App from "./App";
import Progression from "./Progression";
import registerServiceWorker from "./registerServiceWorker";
import "./css/font-awesome.min.css"
import "./css/index.css";
ReactDOM.render(
	<Router>
		<Switch>
			<Route exact path="/" component={App} />
			<Route path="/progression" component={Progression} />
		</Switch>
	</Router>,
	document.getElementById("root")
);
registerServiceWorker();
