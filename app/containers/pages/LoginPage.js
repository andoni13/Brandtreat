import React, { Component, PropTypes } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'

import FlatButton from 'material-ui/FlatButton'

import LoginDialog from '../LoginDialog'
import { toggleModal } from '../../actions/loginDialog'

const mapLoginDialogStateToProps = (state, ownProps) => {
	return {
		open: state.loginDialog.open,
		modal: true,
		button: false
	}
}

const mapLoginDialogDispatchToProps = (dispatch) => {
	return {
		onLoad: (test) => {
			dispatch(toggleModal(true))
		},
		toggleModal: (open) => {
			dispatch(toggleModal(open))
		}
	}
}

class LoginPage extends Component {

	constructor (props) {
		super(props)
	}

	componentWillMount() {
		if (this.props.isAuthenticated) {
			browserHistory.push('/dashboard')
		}
	}

	render() {
		const MappedLoginDialog = connect(mapLoginDialogStateToProps, mapLoginDialogDispatchToProps)(LoginDialog)
		return (
			<MappedLoginDialog next={this.props.location.query.next} />
		);
	}
};

const mapStateToProps = state => ({
	isAuthenticated: state.auth.isAuthenticated,
	redirect: state.auth.redirect
})

export default connect(mapStateToProps)(LoginPage)