import {createReducer} from '../utils';
import { default as c } from '../constants'

const initialState = {
	isFetching: false,
	error: null
};

const isFetching = state => Object.assign({}, state, {
	isFetching: true
})

const isNotFetching = state => Object.assign({}, state, {
	isFetching: false
})

const failure = (state, action) => Object.assign({}, state, {
	isFetching: false,
	error: action.error
})

export default createReducer(initialState, {
	[c.COMPANIES_REQUEST]: state => isFetching(state),
	[c.COMPANIES_SUCCESS]: state => isNotFetching(state),
	[c.COMPANIES_FAILURE]: (state, action) => failure(state, action),
	[c.COMPANY_UPDATE_REQUEST]: state => isFetching(state),
	[c.PLANS_REQUEST]: state => isFetching(state),
	[c.PLANS_SUCCESS]: state => isNotFetching(state),
	[c.PLANS_FAILURE]: (state, action) => failure(state, action),
	[c.PLAN_UPDATE_REQUEST]: state => isFetching(state),
	[c.PROFILES_REQUEST]: state => isFetching(state),
	[c.PROFILES_SUCCESS]: state => isNotFetching(state),
	[c.PROFILES_FAILURE]: (state, action) => failure(state, action),
	[c.PROFILE_UPDATE_REQUEST]: state => isFetching(state),
	[c.USERS_REQUEST]: state => isFetching(state),
	[c.USERS_SUCCESS]: state => isNotFetching(state),
	[c.USERS_FAILURE]: (state, action) => failure(state, action),
	[c.USER_UPDATE_REQUEST]: state => isFetching(state),
});