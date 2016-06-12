// React
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { Field, actions, createFieldClass, controls } from 'react-redux-form'
// Components
// import FlatButton from '../components/FlatButtonNew'
import { Section, Row, Col } from '../components/html'
// Material Components
import FlatButton from 'material-ui/FlatButton'
import CircularProgress from 'material-ui/CircularProgress'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
// Action creators
import { saveCompany } from '../actions/companies'
import { closeCRUDDialog } from '../actions/crudDialog'
// Extra
import validator from 'validator'
import { translate, clearEvent, isRequired } from '../utils'


const mapStateToProps = (state, ownProps) => {
	return {
		open: state.crudDialog.open,
		company: state.companyForm.company,
		companyForm: state.companyForm.companyForm
	}
}


class CRUDDialog extends Component {
	constructor(props) {
		super(props)
	}

	handleSubmit(event) {
		clearEvent(event)
		this.props.dispatch(actions.setPending('company', true))
		this.props.dispatch(actions.validate('company.name', {
			isRequired: (value = this.props.company.name) => isRequired(value)
		}));
		if (this.props.company.name && this.props.companyForm.valid) {
			this.props.dispatch(saveCompany(this.props.company))
		}
	}

	render() {
		const saveButton = <FlatButton label={translate('Save')} primary={true} disabled={this.props.isAuthenticating} onTouchTap={(e) => {
			this.handleSubmit(e)
		}} />
		const cancelButton = <FlatButton label={translate('Cancel')} disabled={this.props.isAuthenticating} onTouchTap={() => {
			this.props.dispatch(actions.reset('company'))
			this.props.dispatch(closeCRUDDialog())
		}} />
		const actionsButtons = [cancelButton, saveButton]
		const title = translate('Create').concat(' ').concat(this.props.title)
		return (
			<Dialog
				title={title}
				modal={false}
				actions={actionsButtons}
				open={this.props.open}
				autoScrollBodyContent={true}
				onRequestClose={() => {
					this.props.dispatch(actions.reset('company'))
					this.props.dispatch(closeCRUDDialog())
				}} >
				{
					this.props.isAuthenticating && 
					<CircularProgress size={0.5} className="center-align full-width"/>
				}
				{translate(this.props.statusText)}
			</Dialog>
		)
	}
}
CRUDDialog.propTypes = {
	title: PropTypes.string.isRequired
}
export default connect(mapStateToProps)(CRUDDialog)