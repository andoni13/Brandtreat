import { default as c } from '../constants'

export const toggleCRUDDialog = () => {
	return {
		type: c.TOGGLE_CRUD_DIALOG
	}
}

export const openCRUDDialog = () => {
	return {
		type: c.OPEN_CRUD_DIALOG
	}
}

export const closeCRUDDialog = () => {
	return {
		type: c.CLOSE_CRUD_DIALOG
	}
}