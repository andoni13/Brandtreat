import { createReducer } from '../utils'
import { default as c } from '../constants'

const initialState = {
	data: [],
	message: ''
}

export default createReducer(initialState, {
	[c.COMPANIES_SUCCESS]: (state, action) => Object.assign({}, state, {
		data: [...action.response.companies]
	}),
	[c.COMPANIES_DELETE_SUCCESS]: (state, action) => Object.assign({}, state, {
		data: state.data.filter(company => !action.response.companies.some(deletedId => deletedId == company._id)),
		message: action.response.message
	}),
	[c.COMPANIES_DELETE_FAILURE]: (state, action) => Object.assign({}, state, {
		message: action.error
	}),
	[c.COMPANY_CREATE_SUCCESS]: (state, action) => Object.assign({}, state, {
		message: 'Company created'
	}),
	[c.COMPANY_CREATE_FAILURE]: (state, action) => Object.assign({}, state, {
		message: action.error
	}),
	[c.COMPANY_UPDATE_SUCCESS]: (state, action) => Object.assign({}, state, {
		message: action.response.message
	}),
	[c.COMPANY_UPDATE_FAILURE]: (state, action) => Object.assign({}, state, {
		message: action.error
	}),
	[c.COMPANY_DELETE_SUCCESS]: (state, action) => Object.assign({}, state, {
		data: state.data.filter(company => company._id != action.response.company._id),
		message: 'Company deleted'
	}),
	[c.COMPANY_DELETE_FAILURE]: (state, action) => Object.assign({}, state, {
		message: action.error
	}),
	[c.SET_COMPANIES_MESSAGE]: (state, action) => Object.assign({}, state, {
		message: action.message
	}),
})