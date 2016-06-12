// import * as ActionTypes from '../actions'
// import merge from 'lodash/merge'
// // import paginate from './paginate'
// import { routerReducer as routing } from 'react-router-redux'
// import { combineReducers } from 'redux'

// // Updates an entity cache in response to any action with response.entities.
// function entities(state = { users: {}, repos: {} }, action) {
//   if (action.response && action.response.entities) {
//     return merge({}, state, action.response.entities)
//   }

//   return state
// }

// // Updates error message to notify about the failed fetches.
// function errorMessage(state = null, action) {
//   const { type, error } = action

//   if (type === ActionTypes.RESET_ERROR_MESSAGE) {
//     return null
//   } else if (error) {
//     return action.error
//   }

//   return state
// }

// function auth(state = { auth: {}}, action) {

//   return state
// }

// // Updates the pagination data for different actions.
// // const pagination = combineReducers({
// //   starredByUser: paginate({
// //     mapActionToKey: action => action.login,
// //     types: [
// //       ActionTypes.STARRED_REQUEST,
// //       ActionTypes.STARRED_SUCCESS,
// //       ActionTypes.STARRED_FAILURE
// //     ]
// //   }),
// //   stargazersByRepo: paginate({
// //     mapActionToKey: action => action.fullName,
// //     types: [
// //       ActionTypes.STARGAZERS_REQUEST,
// //       ActionTypes.STARGAZERS_SUCCESS,
// //       ActionTypes.STARGAZERS_FAILURE
// //     ]
// //   })
// // })

// const rootReducer = combineReducers({
//   entities,
//   // pagination,
//   errorMessage,
//   routing
// })

// export default rootReducer

// import {routerStateReducer} from 'redux-router';
import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'
import auth from './auth'
import crudDialog from './crudDialog'
import data from './data'
import drawer from './drawer'
import loginDialog from './loginDialog'
import companies from './companies'
import plans from './plans'
import profiles from './profiles'
import users from './users'
import loginForm from './forms/login'
import companyForm from './forms/company'
import planForm from './forms/plan'
import profileForm from './forms/profile'
import userForm from './forms/user'

export default combineReducers({
 auth,
 crudDialog,
 data,
 drawer,
 loginDialog,
 companies,
 plans,
 profiles,
 users,
 routing,
 loginForm,
 companyForm,
 planForm,
 profileForm,
 userForm
 // router: routerStateReducer
});