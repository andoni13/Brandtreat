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
// Icons
import MdCreate from 'react-icons/lib/md/create'
// Action creators
import { loadCompany, updateCompany, saveCompany } from '../../../../actions/companies'
import { loadPlan } from '../../../../actions/plans'
// Extra
import _ from 'lodash'
import { translate, clearEvent, isRequired } from '../../../../utils'


const mapStateToProps = (state, ownProps) => {
	return {
		company: state.companyForm.company,
		companyForm: state.companyForm.companyForm,
		plans: state.plans.data,
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


class CompaniesCreatePage extends Component {
	constructor(props) {
		super(props)
		this.openFileDialog = this.openFileDialog.bind(this)
		this.handleChange = this.handleChange.bind(this)
		this.handleLogoHover = this.handleLogoHover.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.state = {
			editLogoVisibility: 'hidden'
		}
	}

	componentWillMount() {
		if (this.props.params.companyId) {
			this.props.dispatch(loadCompany(this.props.params.companyId))
		}
		this.props.dispatch(loadPlan())
	}

	componentWillUnmount() {
		this.props.dispatch(actions.reset('company'))
	}

	handleLogoHover(event) {
		this.setState({
			editLogoVisibility: event.type === 'mouseover' ? 'visible' : 'hidden'
		})
	}

	handleChange(event) {
		const reader = new FileReader()
		reader.onload = () => {
			const logoPreview = ReactDOM.findDOMNode(this.refs.logoPreview)
			logoPreview.src = reader.result
		}
		reader.readAsDataURL(event.target.files[0])
	}

	openFileDialog() {
		const fileUploadDom = ReactDOM.findDOMNode(this.refs.fileUpload)
		fileUploadDom.click()
	}

	handleSubmit(event) {
		clearEvent(event)
		this.props.dispatch(actions.setPending('company', true))
		this.props.dispatch(actions.validate('company.name', {
			isRequired: (value = this.props.company.name) => isRequired(value)
		}));
		this.props.dispatch(actions.validate('company.plan', {
			isRequired: (value = this.props.company.plan) => isRequired(value)
		}));

		if (this.props.company.name && this.props.company.plan && this.props.companyForm.valid) {
			const fileUploadDom = ReactDOM.findDOMNode(this.refs.fileUpload)
			const companyFormData = new FormData()
			companyFormData.append('logo', fileUploadDom.files[0])
			companyFormData.append('company', JSON.stringify(this.props.company))
			if (this.props.params.companyId) {
				this.props.dispatch(updateCompany(companyFormData, this.props.params.companyId))
			} else {
				this.props.dispatch(saveCompany(companyFormData))
			}
		}
	}

	render() {
		const saveButton = <RaisedButton label={translate('Save')} primary={true} disabled={this.props.isAuthenticating} onTouchTap={(e) => {
			this.handleSubmit(e)
		}} />
		const cancelButton = <FlatButton label={translate('Cancel')} disabled={this.props.isAuthenticating} onTouchTap={() => {
			browserHistory.goBack()
		}} />

		return (
			<CardText>
				<form onSubmit={this.handleSubmit}>
					<Row>
						<Col className="s4 m2">
							<div className="edit">
								<div className={'icon ' + this.state.editLogoVisibility}><MdCreate /></div>
								<img ref="logoPreview" className="circle responsive-img" src={this.props.company.logo ? this.props.company.logo : "/img/gravatar.jpg"}
									onMouseOver={this.handleLogoHover}
									onMouseOut={this.handleLogoHover}
									onClick={this.openFileDialog} />
							</div>
							<Field model="company.logo" ref="fileUpload" >
								<input type="file" accept="image/*" className="hidden" onChange={this.handleChange} />
							</Field>
						</Col>
						<Col className="s8 m10">
							<Col className="s12">
								<MaterialField model="company.freeService">
									<Toggle
										defaultToggled={this.props.company.freeService}
										name="freeService"
										ref="freeService"
										label={translate('Free Service')}
										className="right-align"/>
								</MaterialField>
							</Col>
							<Col className="s12">
								<MaterialField model="company.canLogin">
									<Toggle
										defaultToggled={this.props.company.canLogin}
										name="canLogin"
										ref="canLogin"
										label={translate('Can Login')}
										className="right-align"/>
								</MaterialField>
							</Col>
						</Col>
					</Row>
					<Row>
						<Col className="m6 s12">
							<MaterialField model="company.name" validators={{ isRequired }} validateOn={"change"}>
								<TextField
									value={this.props.company.name}
									name="name"
									floatingLabelText={translate('Name')}
									type="text"
									fullWidth={true}
									errorText={this.props.companyForm.fields.name && this.props.companyForm.fields.name.errors.isRequired ? translate('This field is required.') : ''} />
							</MaterialField>
						</Col>
						<Col className="m6 s12">
							<MaterialField model="company.vat">
								<TextField
									value={this.props.company.vat}
									name="vat"
									floatingLabelText={translate('VAT')}
									type="text"
									fullWidth={true} />
							</MaterialField>
						</Col>
					</Row>
					<Row>
						<Col className="s12">
							<MaterialField model="company.address">
								<TextField
									value={this.props.company.address}
									name="address"
									floatingLabelText={translate('Address')}
									type="text"
									fullWidth={true} />
							</MaterialField>
						</Col>
					</Row>
					<Row>
						<Col className="s12">
							<MaterialField model="company.phones">
								<TextField
									value={_.isArray(this.props.company.phones) ? this.props.company.phones.join(' ') : this.props.company.phones }
									name="phones"
									floatingLabelText={translate('Phones')}
									type="text"
									fullWidth={true} />
							</MaterialField>
						</Col>
					</Row>
					<Row>
						<Col className="s12">
							<MaterialField model="company.plan">
								<SelectField
									name="plan"
									value={this.props.company.plan._id || this.props.company.plan}
									fullWidth={true}
									hintText={translate('Plan')}
									errorText={this.props.companyForm.fields.plan && this.props.companyForm.fields.plan.errors.isRequired ? translate('This field is required.') : ''} >
									{this.props.plans.map((plan, index) => (
										<MenuItem key={index} value={plan._id} primaryText={plan.name} />
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

export default connect(mapStateToProps)(CompaniesCreatePage)