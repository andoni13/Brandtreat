import React from 'react'
import ReactDOM from 'react-dom'
import { messages } from '../intl'
import validator from 'validator'

export function createConstants(...constants) {
	return constants.reduce((acc, constant) => {
		acc[constant] = constant;
		return acc;
	}, {});
}

export function createReducer(initialState, reducerMap) {
	return (state = initialState, action) => {
		const reducer = reducerMap[action.type];

		return reducer
			? reducer(state, action)
			: state;
	};
}

// export const createReducer = (initialState, handlers) => {
// 	const reducer = (state = initialState, action) => {
// 		if (handlers.hasOwnProperty(action.type)) {
// 			return handlers[action.type](state, action)
// 		} else {
// 			return state
// 		}
// 	}
// 	return reducer
// }

export const checkHttpStatus = response => {
	if (response.status >= 200 && response.status < 300) {
		return response
	} else {
		var error = new Error(response.statusText)
		error.response = response
		throw error
	}
}

export const parseJSON = response => response.json()

export const translate = (message, locale = 'es') => {
	if (messages[locale][message]) {
		return messages[locale][message]
	}
	else if (message != null && message != '') {
		console.warn(`Could not translate ${message} to ${locale}`)
	}
	return message
}

export const translateUrl = (message, locale) => {
	return message.split('/').map(element => element === locale ? element : translate(element, locale)).join('/')
}

export const clearEvent = event => {
	if (event) {
		event.preventDefault()
		event.stopPropagation()
	}
}
export const isRequired = value => !validator.isNull((value + '').trim())
export const isEmail = value => validator.isEmail(value)