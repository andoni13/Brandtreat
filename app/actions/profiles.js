import { CALL_API } from '../middleware/api'
import { default as c } from '../constants'
import { browserHistory } from 'react-router'
import { actions } from 'react-redux-form'

// Fetches a single profile from the API.
// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchProfile = (token, profileId = '', dispatch) => {
	return {
		[CALL_API]: {
			types: [ c.PROFILES_REQUEST, c.PROFILES_SUCCESS, c.PROFILES_FAILURE ],
			endpoint: `profiles/${profileId}`,
			token: token,
			onSuccessAction: (profile) => {
				if (profileId != '') {
					dispatch(actions.change('profile', profile))
				}
			}
		}
	}
}

const setProfile = (token, profile, dispatch) => {
	return {
		[CALL_API]: {
			types: [ c.PROFILE_CREATE_REQUEST, c.PROFILE_CREATE_SUCCESS, c.PROFILE_CREATE_FAILURE ],
			endpoint: 'profiles',
			token: token,
			body: JSON.stringify(profile),
			method: 'POST',
			contentType: 'application/json',
			onSuccessAction: () => {
				dispatch(actions.reset('profile'))
				browserHistory.push('/dashboard/admin/profiles')
			}
		}
	}
}

const updateAProfile = (token, profile, profileId, dispatch) => {
	return {
		[CALL_API]: {
			types: [ c.PROFILE_UPDATE_REQUEST, c.PROFILE_UPDATE_SUCCESS, c.PROFILE_UPDATE_FAILURE ],
			endpoint: `profiles/${profileId}`,
			token: token,
			body: JSON.stringify(profile),
			method: 'PUT',
			contentType: 'application/json',
			onSuccessAction: () => {
				dispatch(actions.reset('profile'))
				browserHistory.push('/dashboard/admin/profiles')
			}
		}
	}
}

const removeProfile = (token, profileId, dispatch) => {
	return {
		[CALL_API]: {
			types: [ c.PROFILE_DELETE_REQUEST, c.PROFILE_DELETE_SUCCESS, c.PROFILE_DELETE_FAILURE ],
			endpoint: `profiles/${profileId}`,
			token: token,
			method: 'DELETE',
			onSuccessAction: () => {
				browserHistory.push('/dashboard/admin/profiles')
			}
		}
	}
}

const removeMultipleProfiles = (token, profileArray, dispatch) => {
	const profileIdArray = (JSON.stringify(profileArray.map(profile => profile._id)))
	return {
		[CALL_API]: {
			types: [ c.PROFILES_DELETE_REQUEST, c.PROFILES_DELETE_SUCCESS, c.PROFILES_DELETE_FAILURE ],
			endpoint: 'profiles',
			token: token,
			body: profileIdArray,
			method: 'DELETE',
			contentType: 'application/json',
			onSuccessAction: () => {
				browserHistory.push('/dashboard/admin/profiles')
			}
		}
	}
}

// Fetches a profile or a list of profiles
export const loadProfile = profileId => (dispatch, getState) => dispatch(fetchProfile(getState().auth.token, profileId, dispatch))
// Creates a profile
export const saveProfile = profile => (dispatch, getState) => dispatch(setProfile(getState().auth.token, profile, dispatch))
// Updates a profile
export const updateProfile = (profile, profileId) => (dispatch, getState) => dispatch(updateAProfile(
	getState().auth.token, profile, profileId, dispatch))
// Deletes a profile
export const deleteProfile = profileId => (dispatch, getState) => dispatch(removeProfile(getState().auth.token, profileId, dispatch))
// Deletes multiple profiles
export const deleteMultipleProfiles = profileArray => (dispatch, getState) => dispatch(removeMultipleProfiles(getState().auth.token, profileArray, dispatch))
// Cleans the profile message
export const setMessage = (message = '') => ({
	type: c.SET_PROFILES_MESSAGE,
	message
})