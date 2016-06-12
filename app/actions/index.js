// import { CALL_API, Schemas } from '../middleware/api'

// export const USER_REQUEST = 'USER_REQUEST'
// export const USER_SUCCESS = 'USER_SUCCESS'
// export const USER_FAILURE = 'USER_FAILURE'

// // Fetches a single user from Github API.
// // Relies on the custom API middleware defined in ../middleware/api.js.
// function fetchUser(login) {
//   return {
//     [CALL_API]: {
//       types: [ USER_REQUEST, USER_SUCCESS, USER_FAILURE ],
//       endpoint: `users/${login}`,
//       schema: Schemas.USER
//     }
//   }
// }

// // Fetches a single user from Github API unless it is cached.
// // Relies on Redux Thunk middleware.
// export function loadUser(login, requiredFields = []) {
//   return (dispatch, getState) => {
//     const user = getState().entities.users[login]
//     if (user && requiredFields.every(key => user.hasOwnProperty(key))) {
//       return null
//     }

//     return dispatch(fetchUser(login))
//   }
// }

// export const REPO_REQUEST = 'REPO_REQUEST'
// export const REPO_SUCCESS = 'REPO_SUCCESS'
// export const REPO_FAILURE = 'REPO_FAILURE'

// // Fetches a single repository from Github API.
// // Relies on the custom API middleware defined in ../middleware/api.js.
// function fetchRepo(fullName) {
//   return {
//     [CALL_API]: {
//       types: [ REPO_REQUEST, REPO_SUCCESS, REPO_FAILURE ],
//       endpoint: `repos/${fullName}`,
//       schema: Schemas.REPO
//     }
//   }
// }

// // Fetches a single repository from Github API unless it is cached.
// // Relies on Redux Thunk middleware.
// export function loadRepo(fullName, requiredFields = []) {
//   return (dispatch, getState) => {
//     const repo = getState().entities.repos[fullName]
//     if (repo && requiredFields.every(key => repo.hasOwnProperty(key))) {
//       return null
//     }

//     return dispatch(fetchRepo(fullName))
//   }
// }

// export const STARRED_REQUEST = 'STARRED_REQUEST'
// export const STARRED_SUCCESS = 'STARRED_SUCCESS'
// export const STARRED_FAILURE = 'STARRED_FAILURE'

// // Fetches a page of starred repos by a particular user.
// // Relies on the custom API middleware defined in ../middleware/api.js.
// function fetchStarred(login, nextPageUrl) {
//   return {
//     login,
//     [CALL_API]: {
//       types: [ STARRED_REQUEST, STARRED_SUCCESS, STARRED_FAILURE ],
//       endpoint: nextPageUrl,
//       schema: Schemas.REPO_ARRAY
//     }
//   }
// }

// // Fetches a page of starred repos by a particular user.
// // Bails out if page is cached and user didn’t specifically request next page.
// // Relies on Redux Thunk middleware.
// export function loadStarred(login, nextPage) {
//   return (dispatch, getState) => {
//     const {
//       nextPageUrl = `users/${login}/starred`,
//       pageCount = 0
//     } = getState().pagination.starredByUser[login] || {}

//     if (pageCount > 0 && !nextPage) {
//       return null
//     }

//     return dispatch(fetchStarred(login, nextPageUrl))
//   }
// }

// export const STARGAZERS_REQUEST = 'STARGAZERS_REQUEST'
// export const STARGAZERS_SUCCESS = 'STARGAZERS_SUCCESS'
// export const STARGAZERS_FAILURE = 'STARGAZERS_FAILURE'

// // Fetches a page of stargazers for a particular repo.
// // Relies on the custom API middleware defined in ../middleware/api.js.
// function fetchStargazers(fullName, nextPageUrl) {
//   return {
//     fullName,
//     [CALL_API]: {
//       types: [ STARGAZERS_REQUEST, STARGAZERS_SUCCESS, STARGAZERS_FAILURE ],
//       endpoint: nextPageUrl,
//       schema: Schemas.USER_ARRAY
//     }
//   }
// }

// // Fetches a page of stargazers for a particular repo.
// // Bails out if page is cached and user didn’t specifically request next page.
// // Relies on Redux Thunk middleware.
// export function loadStargazers(fullName, nextPage) {
//   return (dispatch, getState) => {
//     const {
//       nextPageUrl = `repos/${fullName}/stargazers`,
//       pageCount = 0
//     } = getState().pagination.stargazersByRepo[fullName] || {}

//     if (pageCount > 0 && !nextPage) {
//       return null
//     }

//     return dispatch(fetchStargazers(fullName, nextPageUrl))
//   }
// }

// export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE'

// // Resets the currently visible error message.
// export function resetErrorMessage() {
//   return {
//     type: RESET_ERROR_MESSAGE
//   }
// }
// import { checkHttpStatus, parseJSON } from '../utils';
// import {LOGIN_USER_REQUEST, LOGIN_USER_FAILURE, LOGIN_USER_SUCCESS, LOGOUT_USER, FETCH_PROTECTED_DATA_REQUEST, RECEIVE_PROTECTED_DATA} from '../constants';
// // import { pushState } from 'redux-router';
// import jwtDecode from 'jwt-decode';

// export function loginUserSuccess(token) {
// 	localStorage.setItem('token', token);
// 	return {
// 		type: LOGIN_USER_SUCCESS,
// 		payload: {
// 			token: token
// 		}
// 	}
// }

// export function loginUserFailure(error) {
// 	localStorage.removeItem('token');
// 	return {
// 		type: LOGIN_USER_FAILURE,
// 		payload: {
// 			status: error.response.status,
// 			statusText: error.response.statusText
// 		}
// 	}
// }

// export function loginUserRequest() {
// 	return {
// 		type: LOGIN_USER_REQUEST
// 	}
// }

// export function logout() {
// 		localStorage.removeItem('token');
// 		return {
// 				type: LOGOUT_USER
// 		}
// }

// export function logoutAndRedirect() {
// 		return (dispatch, state) => {
// 				dispatch(logout());
// 				// dispatch(pushState(null, '/login'));
// 		}
// }

// export function loginUser(email, password, redirect="/") {
// 		return function(dispatch) {
// 				dispatch(loginUserRequest());
// 				return fetch('http://localhost:3000/auth/getToken/', {
// 						method: 'post',
// 						credentials: 'include',
// 						headers: {
// 								'Accept': 'application/json',
// 								'Content-Type': 'application/json'
// 						},
// 								body: JSON.stringify({email: email, password: password})
// 						})
// 						.then(checkHttpStatus)
// 						.then(parseJSON)
// 						.then(response => {
// 								try {
// 										let decoded = jwtDecode(response.token);
// 										dispatch(loginUserSuccess(response.token));
// 										// dispatch(pushState(null, redirect));
// 								} catch (e) {
// 										dispatch(loginUserFailure({
// 												response: {
// 														status: 403,
// 														statusText: 'Invalid token'
// 												}
// 										}));
// 								}
// 						})
// 						.catch(error => {
// 								dispatch(loginUserFailure(error));
// 						})
// 		}
// }

// export function receiveProtectedData(data) {
// 		return {
// 				type: RECEIVE_PROTECTED_DATA,
// 				payload: {
// 						data: data
// 				}
// 		}
// }

// export function fetchProtectedDataRequest() {
// 	return {
// 		type: FETCH_PROTECTED_DATA_REQUEST
// 	}
// }

// export function fetchProtectedData(token) {

// 		return (dispatch, state) => {
// 				dispatch(fetchProtectedDataRequest());
// 				return fetch('http://localhost:3000/getData/', {
// 								credentials: 'include',
// 								headers: {
// 										'Authorization': `Bearer ${token}`
// 								}
// 						})
// 						.then(checkHttpStatus)
// 						.then(parseJSON)
// 						.then(response => {
// 								dispatch(receiveProtectedData(response.data));
// 						})
// 						.catch(error => {
// 								if(error.response.status === 401) {
// 									dispatch(loginUserFailure(error));
// 									// dispatch(pushState(null, '/login'));
// 								}
// 						})
// 			 }
// }

import { toggleModal } from './loginDialog'
export default toggleModal