// React
import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { actions, createFieldClass } from 'react-redux-form'
// Components
// import FlatButton from '../../../../components/FlatButtonNew'
import { Container, Section, Row, Col } from '../../../../components/html'
// Material Components
import Avatar from 'material-ui/Avatar'
import RaisedButton from 'material-ui/RaisedButton'
import CardText from 'material-ui/Card/CardText'
import Checkbox from 'material-ui/Checkbox'
import CircularProgress from 'material-ui/CircularProgress'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import MenuItem from 'material-ui/MenuItem'
import SelectField from 'material-ui/SelectField'
import Subheader from 'material-ui/Subheader'
import TextField from 'material-ui/TextField'
// Icons
import MdCreate from 'react-icons/lib/md/create'
import MdChevronLeft from 'react-icons/lib/md/chevron-left'
import MdChevronRight from 'react-icons/lib/md/chevron-right'
import MdArrowDownward from 'react-icons/lib/md/arrow-downward'
import MdArrowUpward from 'react-icons/lib/md/arrow-upward'
// Action creators
import { loadPlan, updatePlan, savePlan } from '../../../../actions/plans'
// Extra
import _ from 'lodash'
import { translate, clearEvent, isRequired } from '../../../../utils'
import { PERMISSIONS } from '../../../../constants/permissions'

const mapStateToProps = (state, ownProps) => {
	return {
		plan: state.planForm.plan,
		planForm: state.planForm.planForm
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

class PlansCreatePage extends Component {
	constructor(props) {
		super(props)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.permissionChecked = this.permissionChecked.bind(this)
		this.state = {
			feeType: 'monthly',
			checkedPermissions: []
		}
	}

	componentWillMount() {
		if (this.props.params.planId) {
			this.props.dispatch(loadPlan(this.props.params.planId))
		}
	}

	componentWillUnmount() {
		this.props.dispatch(actions.reset('plan'))
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			checkedPermissions: nextProps.plan.permissions
		})
	}
	
	handleSubmit(event) {
		clearEvent(event)
		this.props.dispatch(actions.setPending('plan', true))
		this.props.dispatch(actions.validate('plan.name', {
			isRequired: (value = this.props.plan.name) => isRequired(value)
		}));
		this.props.dispatch(actions.validate('plan.description', {
			isRequired: (value = this.props.plan.description) => isRequired(value)
		}));
		this.props.dispatch(actions.validate('plan.fee.type', {
			isRequired: (value = this.props.plan.fee.type) => isRequired(value)
		}));
		this.props.dispatch(actions.validate('plan.fee.value', {
			isRequired: (value = this.props.plan.fee.value) => isRequired(value)
		}));
		if (this.props.plan.name && this.props.plan.description && this.props.plan.fee.type && this.props.plan.fee.value
			&& this.props.planForm.valid) {
			if (this.props.params.planId) {
				this.props.dispatch(updatePlan(this.props.plan, this.props.params.planId))
			} else {
				this.props.dispatch(savePlan(this.props.plan))
			}
		}
	}
	permissionChecked(event, isInputChecked) {
		const newPermissions = isInputChecked ? [...this.state.checkedPermissions, event.target.value] : [
			...this.state.checkedPermissions.slice(0, this.state.checkedPermissions.indexOf(event.target.value)),
			...this.state.checkedPermissions.slice(this.state.checkedPermissions.indexOf(event.target.value) + 1)
		]
		this.setState({checkedPermissions: newPermissions})
		this.props.dispatch(actions.change('plan.permissions', newPermissions))
	}

	render() {
		const saveButton = <RaisedButton label={translate('Save')} primary={true} disabled={this.props.isAuthenticating} onTouchTap={(e) => {
			this.handleSubmit(e)
		}} />
		const cancelButton = <FlatButton label={translate('Cancel')} disabled={this.props.isAuthenticating} onTouchTap={() => {
			this.props.dispatch(actions.reset('plan'))
			browserHistory.goBack()
		}} />

		return (
			<CardText>
				<form onSubmit={this.handleSubmit}>
					<Row>
						<Col className="s12">
							<MaterialField model="plan.name" validators={{ isRequired }} validateOn={"change"}>
								<TextField
									value={this.props.plan.name}
									name="name"
									floatingLabelText={translate('Name')}
									type="text"
									fullWidth={true}
									errorText={this.props.planForm.fields.name && this.props.planForm.fields.name.errors.isRequired ? translate('This field is required.') : ''} />
							</MaterialField>
						</Col>
					</Row>
					<Row>
						<Col className="s12">
							<MaterialField model="plan.description">
								<TextField
									value={this.props.plan.description}
									name="description"
									floatingLabelText={translate('Description')}
									type="text"
									fullWidth={true}
									errorText={this.props.planForm.fields.description && this.props.planForm.fields.description.errors.isRequired ? translate('This field is required.') : ''} />
							</MaterialField>
						</Col>
					</Row>
					<Row>
						<Col className="s12">
							<MaterialField model="plan.fee.type">
								<SelectField
									name="feeType"
									value={this.props.plan.fee.type || this.state.feeType}
									fullWidth={true}
									hintText={translate('Fee Type')}
									onChange={value => {
										this.setState({
											feeType: value
										})
									}}>
									<MenuItem value="monthly" primaryText={translate('Monthly')} />
									<MenuItem value="yearly" primaryText={translate('Yearly')} />
								</SelectField>
							</MaterialField>
						</Col>
					</Row>
					<Row>
						<Col className="s12">
							<MaterialField model="plan.fee.value">
								<TextField
									value={this.props.plan.fee.value}
									name="feeValue"
									floatingLabelText={translate('Fee Value')}
									type="number"
									fullWidth={true} />
							</MaterialField>
						</Col>
					</Row>
					<Row>
						<Col className="s12">
							{translate('Permissions')}
						</Col>
					</Row>
					<Row>
						<Col className="s12">
							{
								PERMISSIONS.map(permission => {
									return (
										<Checkbox
											label={translate(permission.name)}
											key={permission.code}
											checked={this.state.checkedPermissions.includes(permission.code)}
											onCheck={this.permissionChecked}
											value={permission.code}
										/>
									)
								})
							}
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

export default connect(mapStateToProps)(PlansCreatePage)