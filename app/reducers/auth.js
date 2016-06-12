import {createReducer} from '../utils'
import { default as c } from '../constants'
import jwt from 'jsonwebtoken'

const initialState = {
	token: null,
	username: null,
	isAuthenticated: false,
	isAuthenticating: false,
	statusText: null,
	redirect: null
};

export default createReducer(initialState, {
	[c.LOGIN_USER_REQUEST]: (state, payload) => Object.assign({}, state, {
		'isAuthenticating': true,
		'statusText': null
	}),
	[c.LOGIN_USER_SUCCESS]: (state, payload) => Object.assign({}, state, {
		'isAuthenticating': false,
		'isAuthenticated': true,
		'token': payload.token,
		'username': jwt.decode(payload.token).username,
		'statusText': 'You have been successfully logged in.',
		'redirect': payload.redirect
	}),
	[c.LOGIN_USER_FAILURE]: (state, payload) => Object.assign({}, state, {
		'isAuthenticating': false,
		'isAuthenticated': false,
		'token': null,
		'username': null,
		'statusText': payload.statusText
	}),
	[c.LOGOUT_USER]: (state, payload) => Object.assign({}, state, {
		'isAuthenticated': false,
		'token': null,
		'username': null,
		'statusText': payload.statusText,
		'redirect': payload.redirect
	})
});