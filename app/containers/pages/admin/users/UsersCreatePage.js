// React
import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { Field, actions, createFieldClass } from 'react-redux-form'
// Components
// import FlatButton from '../../../../components/FlatButtonNew'
import { Container, Section, Row, Col } from '../../../../components/html'
// Material Components
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import CardText from 'material-ui/Card/CardText'
import Toggle from 'material-ui/Toggle'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import CircularProgress from 'material-ui/CircularProgress'
// Action creators
import { loadUser, updateUser, saveUser, setMessage } from '../../../../actions/users'
import { loadCompany } from '../../../../actions/companies'
import { loadProfile } from '../../../../actions/profiles'
// Extra
import _ from 'lodash'
import { translate, clearEvent, isRequired, isEmail } from '../../../../utils'


const mapStateToProps = (state, ownProps) => {
	return {
		user: state.userForm.user,
		userForm: state.userForm.userForm,
		companies: state.companies.data,
		profiles: state.profiles.data
	}
}

const MaterialField = createFieldClass({
	TextField: props => ({
		onChange: (e, value) => props.onChange(value),
		value: props.value
	}),
	Toggle: props => ({
		onToggle: () => props.onChange(!props.defaultToggled)
	}),
	SelectField: props => ({
		onChange: (e, index, value) => props.onChange(value)
	})
})


class UsersCreatePage extends Component {
	constructor(props) {
		super(props)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	componentWillMount() {
		if (this.props.params.userId) {
			this.props.dispatch(loadUser(this.props.params.userId))
		}
		this.props.dispatch(loadCompany())
		this.props.dispatch(loadProfile())
	}

	componentWillUnmount() {
		this.props.dispatch(actions.reset('user'))
	}

	handleSubmit(event) {
		clearEvent(event)
		this.props.dispatch(actions.setPending('user', true))
		this.props.dispatch(actions.validate('user.username', {
			isRequired: (value = this.props.user.username) => isRequired(value)
		}));
		this.props.dispatch(actions.setValidity('user.email', {
			isRequired: isRequired(this.props.user.email),
			isEmail: isEmail(this.props.user.email)
		}));
		this.props.dispatch(actions.validate('user.profile', {
			isRequired: (value = this.props.user.profile) => isRequired(value)
		}));
		this.props.dispatch(actions.validate('user.password', {
			isRequired: (value = this.props.user.password) => {
				if (!this.props.params.userId) {
					return isRequired(value)
				} else {
					return true
				}
			}
		}));
		
		if (this.props.user.username && this.props.user.email && this.props.user.profile
			&& this.props.userForm.valid) {
			if (this.props.params.userId) {
				this.props.dispatch(updateUser(this.props.user, this.props.params.userId))
			} else if (this.props.user.password) {
				this.props.dispatch(saveUser(this.props.user))
			}
		}
	}

	render() {
		const saveButton = <RaisedButton label={translate('Save')} primary={true} disabled={this.props.isAuthenticating} onTouchTap={(e) => {
			this.handleSubmit(e)
		}} />
		const cancelButton = <FlatButton label={translate('Cancel')} disabled={this.props.isAuthenticating} onTouchTap={() => {
			this.props.dispatch(actions.reset('user'))
			browserHistory.goBack()
		}} />
		return (
			<CardText>
				<form onSubmit={this.handleSubmit}>
					<Row>
						<Col className="m6 s12">
							<MaterialField model="user.name">
								<TextField
									value={this.props.user.name}
									name="name"
									floatingLabelText={translate('Name')}
									type="text"
									fullWidth={true}
									/>
							</MaterialField>
						</Col>
						<Col className="m6 s12">
							<MaterialField model="user.username" validators={{ isRequired }} validateOn={"change"}>
								<TextField
									value={this.props.user.username}
									name="username"
									floatingLabelText={translate('Username')}
									type="text"
									fullWidth={true}
									errorText={this.props.userForm.fields.username && this.props.userForm.fields.username.errors.isRequired ? translate('This field is required.') : ''} />
							</MaterialField>
						</Col>
					</Row>
					<Row>
						<Col className="s12">
							<MaterialField model="user.email" validators={{ isRequired, isEmail }} validateOn={"change"}>
								<TextField
									value={this.props.user.email}
									name="email"
									floatingLabelText={translate('Email')}
									type="email"
									fullWidth={true}
									errorText={this.props.userForm.fields.email && this.props.userForm.fields.email.errors.isRequired ? translate('This field is required.') : this.props.userForm.fields.email.errors.isEmail ? translate('Is not a valid email address') : ''} />
							</MaterialField>
						</Col>
					</Row>
					<Row>
						<Col className="s12">
							<MaterialField model="user.password" validators={!this.props.params.userId ? { isRequired } : {}}
								validateOn={"change"}>
								<TextField
									value={this.props.user.password}
									name="password"
									floatingLabelText={translate('Password')}
									type="password"
									fullWidth={true}
									errorText={!this.props.params.userId && this.props.userForm.fields.password && this.props.userForm.fields.password.errors.isRequired ? translate('This field is required.') : ''} />
							</MaterialField>
						</Col>
					</Row>
					<Row>
						<Col className="s12">
							<MaterialField model="user.shouldChangePassword">
								<Toggle
									defaultToggled={this.props.user.shouldChangePassword}
									name="shouldChangePassword"
									ref="shouldChangePassword"
									label={translate('Should Change Password')}/>
							</MaterialField>
						</Col>
					</Row>
					<Row>
						<Col className="s12">
							<MaterialField model="user.company" validateOn={"change"}>
								<SelectField
									name="company"
									value={this.props.user.company && this.props.user.company._id || this.props.user.company}
									fullWidth={true}
									hintText={translate('Company')} >
									{this.props.companies.map((company, index) => (
										<MenuItem key={index} value={company._id} primaryText={company.name} />
									))}
								</SelectField>
							</MaterialField>
						</Col>
					</Row>
					<Row>
						<Col className="s12">
							<MaterialField model="user.profile" validators={{ isRequired }} validateOn={"change"}>
								<SelectField
									name="profile"
									value={this.props.user.profile._id || this.props.user.profile}
									fullWidth={true}
									hintText={translate('Profile')}
									errorText={this.props.userForm.fields.profile && this.props.userForm.fields.profile.errors.isRequired ? translate('This field is required.') : ''} >
									{this.props.profiles.map((profile, index) => (
										<MenuItem key={index} value={profile._id} primaryText={profile.type} />
									))}
								</SelectField>
							</MaterialField>
						</Col>
					</Row>
					<Row className="right-align">
						<button type="submit" hidden="hidden">{translate('Save')}</button>
						{cancelButton}
						{saveButton}
					</Row>
				</form>
			</CardText>
		)
	}
}

export default connect(mapStateToProps)(UsersCreatePage)