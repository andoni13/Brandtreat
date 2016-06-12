import { createReducer } from '../utils'
import { default as c } from '../constants'

const initialState = {
	open: false
}

export default createReducer(initialState, {
	[c.TOGGLE_LOGIN_DIALOG]: (state, action) => Object.assign({}, state, {
		open: action.open
	})
})