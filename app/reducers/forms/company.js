import { modeled, modelReducer, formReducer, actionTypes } from 'react-redux-form'
import { combineReducers } from 'redux'

const initialState = {
	name: '',
	vat: '',
	logo: '/img/gravatar.jpg',
	address: '',
	phones: '',
	freeService: false,
	canLogin: true,
	plan: '',
	brands: [],
	users: []
}

const company = modelReducer('company', initialState)
const companyForm = formReducer('company', initialState)

export default combineReducers({company, companyForm})