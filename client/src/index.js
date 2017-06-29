import React from "react";
import ReactDOM from "react-dom";
import { Router, browserHistory } from "react-router";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import "./index.css";
ReactDOM.render(
	<Router history={browserHistory}>
		<Route path="/" component={App} />
	</Router>,
	document.getElementById("root")
);
registerServiceWorker();
