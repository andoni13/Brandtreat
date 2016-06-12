import { modeled, modelReducer, formReducer, actionTypes } from 'react-redux-form'
import { combineReducers } from 'redux'

const initialState = {
	type: '',
	isSuperAdmin: false
}

const profile = modelReducer('profile', initialState)
const profileForm = formReducer('profile', initialState)

export default combineReducers({profile, profileForm})