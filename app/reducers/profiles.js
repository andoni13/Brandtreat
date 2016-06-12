import { createReducer } from '../utils'
import { default as c } from '../constants'

const initialState = {
	data: [],
	message: ''
}

export default createReducer(initialState, {
	[c.PROFILES_SUCCESS]: (state, action) => Object.assign({}, state, {
		data: [...action.response.profiles]
	}),
	[c.PROFILES_DELETE_SUCCESS]: (state, action) => Object.assign({}, state, {
		data: state.data.filter(profile => !action.response.profiles.some(deletedId => deletedId == profile._id)),
		message: action.response.message
	}),
	[c.PROFILES_DELETE_FAILURE]: (state, action) => Object.assign({}, state, {
		message: action.error
	}),
	[c.PROFILE_CREATE_SUCCESS]: (state, action) => Object.assign({}, state, {
		message: 'Profile created'
	}),
	[c.PROFILE_CREATE_FAILURE]: (state, action) => Object.assign({}, state, {
		message: action.error
	}),
	[c.PROFILE_UPDATE_SUCCESS]: (state, action) => Object.assign({}, state, {
		message: action.response.message
	}),
	[c.PROFILE_UPDATE_FAILURE]: (state, action) => Object.assign({}, state, {
		message: action.error
	}),
	[c.PROFILE_DELETE_SUCCESS]: (state, action) => Object.assign({}, state, {
		data: state.data.filter(profile => profile._id != action.response.profile._id),
		message: 'Profile deleted'
	}),
	[c.PROFILE_DELETE_FAILURE]: (state, action) => Object.assign({}, state, {
		message: action.error
	}),
	[c.SET_PROFILES_MESSAGE]: (state, action) => Object.assign({}, state, {
		message: action.message
	}),
})