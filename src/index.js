'use strict';

import React from 'react';
import { render } from 'react-dom';
import { install } from 'offline-plugin/runtime';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Loadable from 'react-loadable';

const App = Loadable({
	loader: () => import('./App.js'),
	loading: () => null
})
// render the component
render(
	<Router>
			<Route component={App} />
	</Router>,
	document.getElementById('root')
);

install();
