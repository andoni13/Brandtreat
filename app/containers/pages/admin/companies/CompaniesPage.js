// React
import React, { Component } from 'react'
import { connect } from 'react-redux'
// Material Components
import Snackbar from 'material-ui/Snackbar'
// Action creators
import { setMessage } from '../../../../actions/companies'
// Extra
import { translate } from '../../../../utils'

const mapStateToProps = state => ({
	message: state.companies.message
})

const mapDispatchToProps = dispatch => ({
	dispatch: dispatch
})

class CompaniesPage extends Component {
	constructor(props) {
		super(props)
		this.handleSnackbarClose = this.handleSnackbarClose.bind(this)
		this.state = {
			message: this.props.message
		}
	}

	handleSnackbarClose() {
		this.props.dispatch(setMessage())
	}

	render() {
		return (
			<div>
				{this.props.children}
				<Snackbar
					open={this.props.message.length > 0}
					message={translate(this.props.message)}
					autoHideDuration={4000}
					onRequestClose={this.handleSnackbarClose}
				/>
			</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CompaniesPage)