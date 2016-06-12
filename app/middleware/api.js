import fetch from 'isomorphic-fetch'
import { browserHistory } from 'react-router'
import { default as c } from '../constants'
import { checkHttpStatus, parseJSON } from '../utils'

const API_ROOT = '/api/protected/'

function callApi(token, endpoint, method = 'GET', body = {}, contentType = '') {
	const fullUrl = (endpoint.indexOf(API_ROOT) === -1) ? API_ROOT + endpoint : endpoint
	let headers = {
		'Authorization': `Bearer ${token}`
	}
	if (contentType != '') {
		Object.assign(headers, {
			'Content-Type': contentType
		})
	}
	return fetch(fullUrl, {
		credentials: 'include',
		headers: headers,
		method,
		body,
	})
	.then(checkHttpStatus)
	.then(parseJSON)
	.then(response => {
		return {
			...response
		}
	})
}

// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_API = Symbol('Call API')

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default store => next => action => {
	const callAPI = action[CALL_API]
	if (typeof callAPI === 'undefined') {
		return next(action)
	}

	let { endpoint } = callAPI
	const { types, token, method, body, contentType, onSuccessAction } = callAPI
	if (typeof endpoint === 'function') {
		endpoint = endpoint(store.getState())
	}

	if (typeof endpoint !== 'string') {
		throw new Error('Specify a string endpoint URL.')
	}
	if (!Array.isArray(types) || types.length !== 3) {
		throw new Error('Expected an array of three action types.')
	}
	if (!types.every(type => typeof type === 'string')) {
		throw new Error('Expected action types to be strings.')
	}

	function actionWith(data) {
		const finalAction = Object.assign({}, action, data)
		delete finalAction[CALL_API]
		return finalAction
	}

	const [ requestType, successType, failureType ] = types
	next(actionWith({ type: requestType }))

	return callApi(token, endpoint, method, body, contentType).then(
		response => {
			if (onSuccessAction) {
				if (response.companies && response.companies.length == 1) {
					onSuccessAction(response.companies[0])
				} else if (response.profiles && response.profiles.length == 1) {
					onSuccessAction(response.profiles[0])
				} else if (response.plans && response.plans.length == 1) {
					onSuccessAction(response.plans[0])
				} else if (response.users && response.users.length == 1) {
					onSuccessAction(response.users[0])
				} else {
					onSuccessAction()
				}
			}
			return next(actionWith({
				response,
				type: successType
			}))
		}
	).catch(error => {
		error.response.json().then(data => {
			next(actionWith({
				type: failureType,
				error: data.message || 'Something bad happened'
			}))
			if (data.name === 'TokenExpiredError' || data.name === 'JsonWebTokenError') {
				const statusText = data.name === 'TokenExpiredError' ? 'The session has expired, please login again.'
				: 'There was an error with the access token.'

				localStorage.removeItem('token') // Remove expired token
				next(actionWith({
					type: c.LOGOUT_USER,
					statusText: statusText
				}));
			}
		});
	})
}
