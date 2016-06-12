import React, { Component } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux'
import { browserHistory } from 'react-router'


export function requireAuthentication(Component) {

	class AuthenticatedComponent extends Component {

		componentWillMount () {
			this.checkAuth(this.props.isAuthenticated);
		}

		componentWillReceiveProps (nextProps) {
			this.checkAuth(nextProps.isAuthenticated);
		}

		checkAuth (isAuthenticated) {
			if (!isAuthenticated) {
				let redirectAfterLogin = this.props.location.pathname;
				browserHistory.replace(`/login/?next=${redirectAfterLogin}`);
			}
		}

		render () {
			return (
				<div>
					{this.props.isAuthenticated === true
						? <Component {...this.props}/>
						: null
					}
				</div>
			)

		}
	}

	const mapStateToProps = (state) => ({
		token: state.auth.token,
		username: state.auth.username,
		isAuthenticated: state.auth.isAuthenticated
	})

	return connect(mapStateToProps)(AuthenticatedComponent);

}