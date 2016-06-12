import { default as c } from '../constants'

export const toggleDrawerOpen = () => {
	return {
		type: c.TOGGLE_DRAWER_OPEN
	}
}

export const toggleDrawerDocked = () => {
	return {
		type: c.TOGGLE_DRAWER_DOCKED
	}
}

export const setDrawerOpen = (open) => {
	return {
		type: c.SET_DRAWER_OPEN,
		open
	}
}

export const setDrawerDocked = (docked) => {
	return {
		type: c.SET_DRAWER_DOCKED,
		docked
	}
}
