import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Field, actions, createFieldClass } from 'react-redux-form'
import validator from 'validator'

import TextField from 'material-ui/TextField'

import { translate, isRequired } from '../../utils'

const MaterialField = createFieldClass({
	TextField: props => ({
		onChange: (e, value) => props.onChange(value),
		value: props.value
	}),
})

class LoginForm extends Component {
	render() {
		let { user, userForm, onSubmit, isAuthenticating } = this.props
		return (
			<form onSubmit={onSubmit}>
				<MaterialField model="user.name" validators={{ isRequired }}>
					<TextField
						hintText={translate('user or user@brandtreat.com')}
						floatingLabelText={translate('Username or email')}
						type="text"
						fullWidth={true}
						disabled={isAuthenticating}
						value={user.name}
						errorText={userForm.fields.name && userForm.fields.name.errors.isRequired ? translate('Please put your username or your email.') : ''} />
				</MaterialField>
				<MaterialField model="user.password" validators={{ isRequired }}>
					<TextField
						floatingLabelText={translate('Password')}
						type="password"
						fullWidth={true}
						disabled={isAuthenticating}
						value={user.password}
						errorText={userForm.fields.password && userForm.fields.password.errors.isRequired ? translate('Please put a password.') : ''} />
				</MaterialField>
				<button type="submit" hidden="hidden">{translate('Send')}</button>
			</form>
		)
	}
}

LoginForm.propTypes = {
	onSubmit: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired,
	userForm: PropTypes.object.isRequired,
	isAuthenticating: PropTypes.bool.isRequired
}

export default LoginForm