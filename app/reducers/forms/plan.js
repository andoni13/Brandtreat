import { modeled, modelReducer, formReducer, actionTypes } from 'react-redux-form'
import { combineReducers } from 'redux'

const initialState = {
	name: '',
	description: [],
	fee: {
		type: 'monthly',
		value: '0'
	},
	permissions: []
}

const plan = modelReducer('plan', initialState)
const planForm = formReducer('plan', initialState)

export default combineReducers({plan, planForm})