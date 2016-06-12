import { modeled, modelReducer, formReducer, actionTypes } from 'react-redux-form'
import { combineReducers } from 'redux'

const initialState = {
	name: '',
	password: '',
}

const user = modelReducer('user', initialState)
const userForm = formReducer('user', initialState)

export default combineReducers({user, userForm})