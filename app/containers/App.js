import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import Explore from '../components/Explore'
import { resetErrorMessage } from '../actions'

import getMuiTheme from 'material-ui/styles/getMuiTheme'
import BrandtreatTheme from '../components/Theme'

import auth from '../auth'

class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			muiTheme: getMuiTheme(BrandtreatTheme)
		};
	}

	// Override specific components theme styles.
	componentWillMount() {
		let newMuiTheme = this.state.muiTheme;
		newMuiTheme.appBar = {...newMuiTheme.appBar, ...BrandtreatTheme.componentThemes.appBar};
		newMuiTheme.zIndex = {...newMuiTheme.zIndex, ...BrandtreatTheme.zIndex};
		this.setState({
			muiTheme: newMuiTheme
		});
	}

	// Pass down updated theme to children
	getChildContext() {
		return {
			muiTheme: this.state.muiTheme
		}
	}

	render() {
		return (
			<div>
				{this.props.children}
			</div>
		)
	}
}

App.childContextTypes = {
	muiTheme: PropTypes.object,
}

App.propTypes = {
	// Injected by React Redux
	auth: PropTypes.func,
	// Injected by React Router
	children: PropTypes.node
}

function mapStateToProps(state, ownProps) {
	return {
		isAuthenticated: state.auth.isAuthenticated
	}
}

export default connect(mapStateToProps, {
	resetErrorMessage
})(App)
