import { createReducer } from '../utils'
import { default as c } from '../constants'

const initialState = {
	open: false
}

export default createReducer(initialState, {
	[c.TOGGLE_CRUD_DIALOG]: state => Object.assign({}, state, {
		open: !state.open
	}),
	[c.OPEN_CRUD_DIALOG]: state => Object.assign({}, state, {
		open: true
	}),
	[c.CLOSE_CRUD_DIALOG]: state => Object.assign({}, state, {
		open: false
	})
})