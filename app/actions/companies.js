import { CALL_API } from '../middleware/api'
import { default as c } from '../constants'
import { browserHistory } from 'react-router'
import { actions } from 'react-redux-form'

// Fetches a single company from the API.
// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchCompany = (token, companyId = '', dispatch) => {
	return {
		[CALL_API]: {
			types: [ c.COMPANIES_REQUEST, c.COMPANIES_SUCCESS, c.COMPANIES_FAILURE ],
			endpoint: `companies/${companyId}`,
			token: token,
			onSuccessAction: (company) => {
				if (companyId != '') {
					dispatch(actions.change('company', company))
				}
			}
		}
	}
}

const setCompany = (token, company, dispatch) => {
	return {
		[CALL_API]: {
			types: [ c.COMPANY_CREATE_REQUEST, c.COMPANY_CREATE_SUCCESS, c.COMPANY_CREATE_FAILURE ],
			endpoint: 'companies',
			token: token,
			body: company,
			method: 'POST',
			onSuccessAction: () => {
				dispatch(actions.reset('company'))
				browserHistory.push('/dashboard/admin/companies')
			}
		}
	}
}

const updateACompany = (token, company, companyId, dispatch) => {
	return {
		[CALL_API]: {
			types: [ c.COMPANY_UPDATE_REQUEST, c.COMPANY_UPDATE_SUCCESS, c.COMPANY_UPDATE_FAILURE ],
			endpoint: `companies/${companyId}`,
			token: token,
			body: company,
			method: 'PUT',
			onSuccessAction: () => {
				dispatch(actions.reset('company'))
				browserHistory.push('/dashboard/admin/companies')
			}
		}
	}
}

const removeCompany = (token, companyId, dispatch) => {
	return {
		[CALL_API]: {
			types: [ c.COMPANY_DELETE_REQUEST, c.COMPANY_DELETE_SUCCESS, c.COMPANY_DELETE_FAILURE ],
			endpoint: `companies/${companyId}`,
			token: token,
			method: 'DELETE',
			onSuccessAction: () => {
				browserHistory.push('/dashboard/admin/companies')
			}
		}
	}
}

const removeMultipleCompanies = (token, companyArray, dispatch) => {
	const companyIdArray = (JSON.stringify(companyArray.map(company => company._id)))
	return {
		[CALL_API]: {
			types: [ c.COMPANIES_DELETE_REQUEST, c.COMPANIES_DELETE_SUCCESS, c.COMPANIES_DELETE_FAILURE ],
			endpoint: 'companies',
			token: token,
			body: companyIdArray,
			method: 'DELETE',
			contentType: 'application/json',
			onSuccessAction: () => {
				browserHistory.push('/dashboard/admin/companies')
			}
		}
	}
}

// Fetches a company or a list of companies
export const loadCompany = companyId => (dispatch, getState) => dispatch(fetchCompany(getState().auth.token, companyId, dispatch))
// Creates a company
export const saveCompany = company => (dispatch, getState) => dispatch(setCompany(getState().auth.token, company, dispatch))
// Updates a company
export const updateCompany = (company, companyId) => (dispatch, getState) => dispatch(updateACompany(
	getState().auth.token, company, companyId, dispatch))
// Deletes a company
export const deleteCompany = companyId => (dispatch, getState) => dispatch(removeCompany(getState().auth.token, companyId, dispatch))
// Deletes multiple companies
export const deleteMultipleCompanies = companyArray => (dispatch, getState) => dispatch(removeMultipleCompanies(getState().auth.token, companyArray, dispatch))
// Cleans the company message
export const setMessage = (message = '') => ({
	type: c.SET_COMPANIES_MESSAGE,
	message
})