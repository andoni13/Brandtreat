import { CALL_API } from '../middleware/api'
import { default as c } from '../constants'
import { browserHistory } from 'react-router'
import { actions } from 'react-redux-form'

// Fetches a single user from the API.
// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchUser = (token, userId = '', dispatch) => {
	return {
		[CALL_API]: {
			types: [ c.USERS_REQUEST, c.USERS_SUCCESS, c.USERS_FAILURE ],
			endpoint: `users/${userId}`,
			token: token,
			onSuccessAction: (user) => {
				if (userId != '') {
					dispatch(actions.change('user', user))
				}
			}
		}
	}
}

const setUser = (token, user, dispatch) => {
	return {
		[CALL_API]: {
			types: [ c.USER_CREATE_REQUEST, c.USER_CREATE_SUCCESS, c.USER_CREATE_FAILURE ],
			endpoint: 'users',
			token: token,
			body: JSON.stringify(user),
			method: 'POST',
			contentType: 'application/json',
			onSuccessAction: () => {
				dispatch(actions.reset('user'))
				browserHistory.push('/dashboard/admin/users')
			}
		}
	}
}

const updateAUser = (token, user, userId, dispatch) => {
	return {
		[CALL_API]: {
			types: [ c.USER_UPDATE_REQUEST, c.USER_UPDATE_SUCCESS, c.USER_UPDATE_FAILURE ],
			endpoint: `users/${userId}`,
			token: token,
			body: JSON.stringify(user),
			method: 'PUT',
			contentType: 'application/json',
			onSuccessAction: () => {
				dispatch(actions.reset('user'))
				browserHistory.push('/dashboard/admin/users')
			}
		}
	}
}

const removeUser = (token, userId, dispatch) => {
	return {
		[CALL_API]: {
			types: [ c.USER_DELETE_REQUEST, c.USER_DELETE_SUCCESS, c.USER_DELETE_FAILURE ],
			endpoint: `users/${userId}`,
			token: token,
			method: 'DELETE',
			onSuccessAction: () => {
				browserHistory.push('/dashboard/admin/users')
			}
		}
	}
}

const removeMultipleUsers = (token, userArray, dispatch) => {
	const userIdArray = (JSON.stringify(userArray.map(user => user._id)))
	return {
		[CALL_API]: {
			types: [ c.USERS_DELETE_REQUEST, c.USERS_DELETE_SUCCESS, c.USERS_DELETE_FAILURE ],
			endpoint: 'users',
			token: token,
			body: userIdArray,
			method: 'DELETE',
			contentType: 'application/json',
			onSuccessAction: () => {
				browserHistory.push('/dashboard/admin/users')
			}
		}
	}
}

// Fetches an User or a list of users
export const loadUser = userId => (dispatch, getState) => dispatch(fetchUser(getState().auth.token, userId, dispatch))
// Creates an user
export const saveUser = user => (dispatch, getState) => dispatch(setUser(getState().auth.token, user, dispatch))
// Updates an user
export const updateUser = (user, userId) => (dispatch, getState) => dispatch(updateAUser(
	getState().auth.token, user, userId, dispatch))
// Deletes an user
export const deleteUser = userId => (dispatch, getState) => dispatch(removeUser(getState().auth.token, userId, dispatch))
// Deletes multiple users
export const deleteMultipleUsers = userArray => (dispatch, getState) => dispatch(removeMultipleUsers(getState().auth.token, userArray, dispatch))
// Cleans the user message
export const setMessage = (message = '') => ({
	type: c.SET_USERS_MESSAGE,
	message
})