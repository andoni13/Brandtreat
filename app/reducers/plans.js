import { createReducer } from '../utils'
import { default as c } from '../constants'

const initialState = {
	data: [],
	message: ''
}

export default createReducer(initialState, {
	[c.PLANS_SUCCESS]: (state, action) => Object.assign({}, state, {
		data: [...action.response.plans]
	}),
	[c.PLANS_DELETE_SUCCESS]: (state, action) => Object.assign({}, state, {
		data: state.data.filter(plan => !action.response.plans.some(deletedId => deletedId == plan._id)),
		message: action.response.message
	}),
	[c.PLANS_DELETE_FAILURE]: (state, action) => Object.assign({}, state, {
		message: action.error
	}),
	[c.PLAN_CREATE_SUCCESS]: (state, action) => Object.assign({}, state, {
		message: 'Plan created'
	}),
	[c.PLAN_CREATE_FAILURE]: (state, action) => Object.assign({}, state, {
		message: action.error
	}),
	[c.PLAN_UPDATE_SUCCESS]: (state, action) => Object.assign({}, state, {
		message: action.response.message
	}),
	[c.PLAN_UPDATE_FAILURE]: (state, action) => Object.assign({}, state, {
		message: action.error
	}),
	[c.PLAN_DELETE_SUCCESS]: (state, action) => Object.assign({}, state, {
		data: state.data.filter(plan => plan._id != action.response.plan._id),
		message: 'Plan deleted'
	}),
	[c.PLAN_DELETE_FAILURE]: (state, action) => Object.assign({}, state, {
		message: action.error
	}),
	[c.SET_PLANS_MESSAGE]: (state, action) => Object.assign({}, state, {
		message: action.message
	}),
})