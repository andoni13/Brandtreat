import { createReducer } from '../utils'
import { default as c } from '../constants'

const initialState = {
	open: true,
	docked: true
}

export default createReducer(initialState, {
	[c.TOGGLE_DRAWER_OPEN]: state => Object.assign({}, state, {
		open: !state.open
	}),
	[c.TOGGLE_DRAWER_DOCKED]: state => Object.assign({}, state, {
		docked: !state.docked
	}),
	[c.SET_DRAWER_OPEN]: (state, action) => Object.assign({}, state, {
		open: action.open
	}),
	[c.SET_DRAWER_DOCKED]: (state, action) => Object.assign({}, state, {
		docked: action.docked
	})
})