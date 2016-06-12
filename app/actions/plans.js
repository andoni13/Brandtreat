import { CALL_API } from '../middleware/api'
import { default as c } from '../constants'
import { browserHistory } from 'react-router'
import { actions } from 'react-redux-form'

// Fetches a single plan from the API.
// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchPlan = (token, planId = '', dispatch) => {
	return {
		[CALL_API]: {
			types: [ c.PLANS_REQUEST, c.PLANS_SUCCESS, c.PLANS_FAILURE ],
			endpoint: `plans/${planId}`,
			token: token,
			onSuccessAction: (plan) => {
				if (planId != '') {
					dispatch(actions.change('plan', plan))
				}
			}
		}
	}
}

const setPlan = (token, plan, dispatch) => {
	return {
		[CALL_API]: {
			types: [ c.PLAN_CREATE_REQUEST, c.PLAN_CREATE_SUCCESS, c.PLAN_CREATE_FAILURE ],
			endpoint: 'plans',
			token: token,
			body: JSON.stringify(plan),
			method: 'POST',
			contentType: 'application/json',
			onSuccessAction: () => {
				dispatch(actions.reset('plan'))
				browserHistory.push('/dashboard/admin/plans')
			}
		}
	}
}

const updateAPlan = (token, plan, planId, dispatch) => {
	return {
		[CALL_API]: {
			types: [ c.PLAN_UPDATE_REQUEST, c.PLAN_UPDATE_SUCCESS, c.PLAN_UPDATE_FAILURE ],
			endpoint: `plans/${planId}`,
			token: token,
			body: JSON.stringify(plan),
			method: 'PUT',
			contentType: 'application/json',
			onSuccessAction: () => {
				dispatch(actions.reset('plan'))
				browserHistory.push('/dashboard/admin/plans')
			}
		}
	}
}

const removePlan = (token, planId, dispatch) => {
	return {
		[CALL_API]: {
			types: [ c.PLAN_DELETE_REQUEST, c.PLAN_DELETE_SUCCESS, c.PLAN_DELETE_FAILURE ],
			endpoint: `plans/${planId}`,
			token: token,
			method: 'DELETE',
			onSuccessAction: () => {
				browserHistory.push('/dashboard/admin/plans')
			}
		}
	}
}

const removeMultiplePlans = (token, planArray, dispatch) => {
	const planIdArray = (JSON.stringify(planArray.map(plan => plan._id)))
	return {
		[CALL_API]: {
			types: [ c.PLANS_DELETE_REQUEST, c.PLANS_DELETE_SUCCESS, c.PLANS_DELETE_FAILURE ],
			endpoint: 'plans',
			token: token,
			body: planIdArray,
			method: 'DELETE',
			contentType: 'application/json',
			onSuccessAction: () => {
				browserHistory.push('/dashboard/admin/plans')
			}
		}
	}
}

// Fetches a plan or a list of plans
export const loadPlan = planId => (dispatch, getState) => dispatch(fetchPlan(getState().auth.token, planId, dispatch))
// Creates a plan
export const savePlan = plan => (dispatch, getState) => dispatch(setPlan(getState().auth.token, plan, dispatch))
// Updates a plan
export const updatePlan = (plan, planId) => (dispatch, getState) => dispatch(updateAPlan(
	getState().auth.token, plan, planId, dispatch))
// Deletes a plan
export const deletePlan = planId => (dispatch, getState) => dispatch(removePlan(getState().auth.token, planId, dispatch))
// Deletes multiple plans
export const deleteMultiplePlans = planArray => (dispatch, getState) => dispatch(removeMultiplePlans(getState().auth.token, planArray, dispatch))
// Cleans the plan message
export const setMessage = (message = '') => ({
	type: c.SET_PLANS_MESSAGE,
	message
})