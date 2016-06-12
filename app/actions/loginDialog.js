import { browserHistory } from 'react-router'
import jwt from 'jsonwebtoken'
import { checkHttpStatus, parseJSON, translate } from '../utils'
import { default as c } from '../constants'
import validator from 'validator'
import { actions } from 'react-redux-form'

export const toggleModal = open => {
	return {
		type: c.TOGGLE_LOGIN_DIALOG,
		open
	}
}

export const loginUserSuccess = (token, redirect) => {
	localStorage.setItem('token', token)
	return {
		type: c.LOGIN_USER_SUCCESS,
		token: token,
		redirect: redirect
	}
}

export const loginUserFailure = error => {
	localStorage.removeItem('token')
	return {
		type: c.LOGIN_USER_FAILURE,
		status: error.response.status,
		statusText: error.response.statusText
	}
}

export const loginUserRequest = () => {
	return {
		type: c.LOGIN_USER_REQUEST
	}
}

export const logout = () => {
	localStorage.removeItem('token')
	return {
		type: c.LOGOUT_USER
	}
}

export const logoutAndRedirect = () => {
	return (dispatch, state) => {
		browserHistory.replace('/');
		dispatch(toggleModal(false))
		dispatch(logout())
		// dispatch(pushState(null, '/login'))
	}
}

export const loginUser = (username, password, redirect = '/dashboard') => {
	return (dispatch) => {
		dispatch(loginUserRequest())
		const body = validator.isEmail(username + '') ? {
			email: username,
			password: password
		} : {
			username: username,
			password: password
		}

		return fetch('/api/sessions/create', {
			method: 'post',
			credentials: 'include',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		})
		.then(checkHttpStatus)
		.then(parseJSON)
		.then(response => {
			try {
				const decoded = jwt.decode(response.token)
				// Clear user form model
				dispatch(actions.reset('user'))
				dispatch(loginUserSuccess(response.token, redirect))
			} catch (error) {
				dispatch(loginUserFailure({
					response: {
						status: 403,
						statusText: translate('Invalid Token')
					}
				}))
			}
		})
		.catch(error => {
			dispatch(loginUserFailure(error))
		})
	}
}
