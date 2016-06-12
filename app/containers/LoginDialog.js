// React
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { Field, actions, createFieldClass, controls } from 'react-redux-form'
// Components
// import FlatButton from '../components/FlatButtonNew'
import LoginForm from '../components/forms/Login'
// Material Components
import CircularProgress from 'material-ui/CircularProgress'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
// Actions
import * as actionCreators from '../actions/loginDialog'
// Utils
import { translate, clearEvent, isRequired } from '../utils'
import validator from 'validator'

const mapStateToProps = (state, ownProps) => {
	return {
		user: state.loginForm.user,
		userForm: state.loginForm.userForm,
		isAuthenticating: state.auth.isAuthenticating,
		isAuthenticated: state.auth.isAuthenticated,
		statusText: state.auth.statusText,
		redirect: state.auth.redirect
	}
}


class LoginDialog extends Component {
	constructor(props) {
		super(props)
	}

	componentDidMount() {
		// If the method onload exists then call it.
		if (this.props.onLoad) {
			this.props.onLoad()
		}

		if (this.props.isAuthenticated && this.props.redirect) {
			browserHistory.push(this.props.redirect)
		}
	}

	handleSubmit(event) {
		clearEvent(event)

		let { user, dispatch, userForm, next } = this.props
		dispatch(actions.setPending('user', true))
		dispatch(actions.validate('user.name', {
			isRequired: (value = user.name) => isRequired(value)
		}));
		dispatch(actions.validate('user.password', {
			isRequired: (value = user.password) => isRequired(value)
		}));


		// formActions(actions.validate('user.name', {
		// 	isRequired: (value = user.name) => isRequired(value)
		// }));
		// actions.validate('user.name', {
		// 	isRequired: (value = user.name) => isRequired(value)
		// });
		// actions.validate('user.password', {
		// 	isRequired: (value = user.password) => isRequired(value)
		// });

		if (user.name && user.password && userForm.valid) {
			dispatch(actionCreators.loginUser(user.name, user.password, next))
			dispatch(actions.setSubmitted('user', true))
		}
	}

	render() {
		const loginButton = <FlatButton label={translate('Login')} primary={true} disabled={this.props.isAuthenticating} onTouchTap={(e) => {
			this.handleSubmit(e)
		}} />
		const cancelButton = <FlatButton label={translate('Cancel')} disabled={this.props.isAuthenticating} onTouchTap={() => {
			this.props.toggleModal(false)
		}} />
		const actions = (this.props.modal) ? [loginButton] : [cancelButton, loginButton]
		return (
			<div className="app-bar-button">
				{
					this.props.button &&
					<FlatButton label={translate('Login')} secondary={true} onTouchTap={() => {
						if (this.props.isAuthenticated) {
							browserHistory.push('/dashboard')
						} else {
							this.props.toggleModal(true)
						}
					}} />
				}
				<Dialog
					title={translate('Login')}
					modal={this.props.modal}
					actions={actions}
					open={this.props.open}
					onRequestClose={() => {
						this.props.toggleModal(false)
					}} >
					{
						this.props.isAuthenticating && 
						<CircularProgress size={0.5} className="center-align full-width"/>
					}
					{translate(this.props.statusText)}
					<LoginForm user={this.props.user} userForm={this.props.userForm} onSubmit={(e) => this.handleSubmit(e)} isAuthenticating={this.props.isAuthenticating}/>
				</Dialog>
			</div>
		)
	}
}

LoginDialog.propTypes = {
	toggleModal: PropTypes.func.isRequired,
	open: PropTypes.bool.isRequired,
	modal: PropTypes.bool.isRequired
}
export default connect(mapStateToProps)(LoginDialog)