import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import Root from './containers/Root'
import configureStore from './store/configureStore'
import { loginUserSuccess } from './actions/loginDialog';
import injectTapEventPlugin from 'react-tap-event-plugin'
require('../sass/main.sass')

injectTapEventPlugin();

const store = configureStore()
const history = syncHistoryWithStore(browserHistory, store)

history.listen(location => {
	console.log(location.pathname);
});

let token = localStorage.getItem('token');
if (token !== null) {
    store.dispatch(loginUserSuccess(token));
}

render(
  <Root store={store} history={history} />,
  document.getElementById('app')
)
