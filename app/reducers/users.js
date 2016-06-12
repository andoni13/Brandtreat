import { createReducer } from '../utils'
import { default as c } from '../constants'

const initialState = {
	data: [],
	message: ''
}

export default createReducer(initialState, {
	[c.USERS_SUCCESS]: (state, action) => Object.assign({}, state, {
		data: [...action.response.users]
	}),
	[c.USERS_DELETE_SUCCESS]: (state, action) => Object.assign({}, state, {
		data: state.data.filter(user => !action.response.users.some(deletedId => deletedId == user._id)),
		message: action.response.message
	}),
	[c.USERS_DELETE_FAILURE]: (state, action) => Object.assign({}, state, {
		message: action.error
	}),
	[c.USER_CREATE_SUCCESS]: (state, action) => Object.assign({}, state, {
		message: 'User created'
	}),
	[c.USER_CREATE_FAILURE]: (state, action) => Object.assign({}, state, {
		message: action.error
	}),
	[c.USER_UPDATE_SUCCESS]: (state, action) => Object.assign({}, state, {
		message: action.response.message
	}),
	[c.USER_UPDATE_FAILURE]: (state, action) => Object.assign({}, state, {
		message: action.error
	}),
	[c.USER_DELETE_SUCCESS]: (state, action) => Object.assign({}, state, {
		data: state.data.filter(user => user._id != action.response.user._id),
		message: 'User deleted'
	}),
	[c.USER_DELETE_FAILURE]: (state, action) => Object.assign({}, state, {
		message: action.error
	}),
	[c.SET_USERS_MESSAGE]: (state, action) => Object.assign({}, state, {
		message: action.message
	}),
})