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
import Avatar from 'material-ui/Avatar'
import RaisedButton from 'material-ui/RaisedButton'
import CardText from 'material-ui/Card/CardText'
import CircularProgress from 'material-ui/CircularProgress'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import MenuItem from 'material-ui/MenuItem'
import SelectField from 'material-ui/SelectField'
import Subheader from 'material-ui/Subheader'
import Table from 'material-ui/Table/Table'
import TableHeaderColumn from 'material-ui/Table/TableHeaderColumn'
import TableRow from 'material-ui/Table/TableRow'
import TableHeader from 'material-ui/Table/TableHeader'
import TableRowColumn from 'material-ui/Table/TableRowColumn'
import TableBody from 'material-ui/Table/TableBody'
import TableFooter from 'material-ui/Table/TableFooter'
import Toggle from 'material-ui/Toggle'
import TextField from 'material-ui/TextField'
// Icons
import MdCheck from 'react-icons/lib/md/check'
import MdCreate from 'react-icons/lib/md/create'
import MdClear from 'react-icons/lib/md/clear'
import MdChevronLeft from 'react-icons/lib/md/chevron-left'
import MdChevronRight from 'react-icons/lib/md/chevron-right'
import MdArrowDownward from 'react-icons/lib/md/arrow-downward'
import MdArrowUpward from 'react-icons/lib/md/arrow-upward'
// Action creators
import { loadProfile, updateProfile, saveProfile } from '../../../../actions/profiles'
// Extra
import _ from 'lodash'
import { translate, clearEvent, isRequired } from '../../../../utils'


const mapStateToProps = (state, ownProps) => {
	return {
		profile: state.profileForm.profile,
		profileForm: state.profileForm.profileForm
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

class ProfilesCreatePage extends Component {
	constructor(props) {
		super(props)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.sortBy = this.sortBy.bind(this)
		this.state = {
			offset: 0,
			limit: 5,
			currentSortColumn: 'company.name',
			currentSortDirection: 'asc'
		}
	}

	componentWillMount() {
		if (this.props.params.profileId) {
			this.props.dispatch(loadProfile(this.props.params.profileId))
		}
	}

	componentWillUnmount() {
		this.props.dispatch(actions.reset('profile'))
	}
	
	handleSubmit(event) {
		clearEvent(event)
		this.props.dispatch(actions.setPending('profile', true))
		this.props.dispatch(actions.validate('profile.type', {
			isRequired: (value = this.props.profile.type) => isRequired(value)
		}));
		if (this.props.profile.type && this.props.profileForm.valid) {
			if (this.props.params.profileId) {
				this.props.dispatch(updateProfile(this.props.profile, this.props.params.profileId))
			} else {
				this.props.dispatch(saveProfile(this.props.profile))
			}
		}
	}

	sortBy(event, column) {
		clearEvent(event)
		let nextSortDirection = 'asc'
		if (this.state.currentSortColumn == column) {
			nextSortDirection = this.state.currentSortDirection == 'none' ? 'asc' : this.state.currentSortDirection == 'asc' ? 'desc' : 'none'
			this.setState({
				currentSortDirection: nextSortDirection
			})
		} else {
			this.setState({
				currentSortColumn: column,
				currentSortDirection: nextSortDirection
			})
		}
	}

	render() {
		const saveButton = <RaisedButton label={translate('Save')} primary={true} disabled={this.props.isAuthenticating} onTouchTap={(e) => {
			this.handleSubmit(e)
		}} />
		const cancelButton = <FlatButton label={translate('Cancel')} disabled={this.props.isAuthenticating} onTouchTap={() => {
			this.props.dispatch(actions.reset('profile'))
			browserHistory.goBack()
		}} />
		let users = this.props.profile.users ? this.props.profile.users.map(user => user) : []
		if (this.state.currentSortDirection != 'none') {
			users = _.orderBy(users, [this.state.currentSortColumn], [this.state.currentSortDirection])
		}
		
		return (
			<CardText>
				<form onSubmit={this.handleSubmit}>
					<Row>
						<Col className="s12">
							<MaterialField model="profile.type" validators={{ isRequired }} validateOn={"change"}>
								<TextField
									value={this.props.profile.type}
									name="type"
									floatingLabelText={translate('Type')}
									type="text"
									fullWidth={true}
									errorText={this.props.profileForm.fields.type && this.props.profileForm.fields.type.errors.isRequired ? translate('This field is required.') : ''} />
							</MaterialField>
						</Col>
					</Row>
					<Row>
						<Col className="s12">
							<MaterialField model="profile.isSuperAdmin">
								<Toggle
									defaultToggled={this.props.profile.isSuperAdmin}
									name="isSuperAdmin"
									ref="isSuperAdmin"
									fullWidth={true}
									label={translate('Is Super Admin')}/>
							</MaterialField>
						</Col>
					</Row>
					<Row>
						<Col className="s12">
							<MaterialField model="profile.isMobileUser">
								<Toggle
									defaultToggled={this.props.profile.isMobileUser}
									name="isMobileUser"
									ref="isMobileUser"
									fullWidth={true}
									label={translate('Is Mobile User')}/>
							</MaterialField>
						</Col>
					</Row>
					{
						users.length > 0 &&
						<Row>
							<Subheader>{translate('Users').concat(` (${users.length})`)}</Subheader>
							<Table
								ref="usersTable"
								selectable={false}
								preScanRows={true} >
								<TableHeader displaySelectAll={false} adjustForCheckbox={false} >
									<TableRow>
										<TableHeaderColumn>{translate('Logo')}</TableHeaderColumn>
										<TableHeaderColumn>
											<div className={
													this.state.currentSortColumn == 'company.name' &&  this.state.currentSortDirection != 'none' ?
													'sortable sorted' : 'sortable'
												}
												onClick={(event) => this.sortBy(event, 'company.name')}>
												{translate('Company')}
												{this.state.currentSortColumn == 'company.name' && this.state.currentSortDirection != 'none' ?
												this.state.currentSortDirection == 'asc' ? <MdArrowUpward /> : <MdArrowDownward /> : ''}
											</div>
										</TableHeaderColumn>
										<TableHeaderColumn>
											<div className={
													this.state.currentSortColumn == 'name' &&  this.state.currentSortDirection != 'none' ?
													'sortable sorted' : 'sortable'
												}
												onClick={(event) => this.sortBy(event, 'name')}>
												{translate('Name')}
												{this.state.currentSortColumn == 'name' && this.state.currentSortDirection != 'none' ?
												this.state.currentSortDirection == 'asc' ? <MdArrowUpward /> : <MdArrowDownward /> : ''}
											</div>
										</TableHeaderColumn>
										<TableHeaderColumn>
											<div className={
													this.state.currentSortColumn == 'username' &&  this.state.currentSortDirection != 'none' ?
													'sortable sorted' : 'sortable'
												}
												onClick={(event) => this.sortBy(event, 'username')}>
												{translate('Username')}
												{this.state.currentSortColumn == 'username' && this.state.currentSortDirection != 'none' ?
												this.state.currentSortDirection == 'asc' ? <MdArrowUpward /> : <MdArrowDownward /> : ''}
											</div>
										</TableHeaderColumn>
										<TableHeaderColumn>
											<div className={
													this.state.currentSortColumn == 'email' &&  this.state.currentSortDirection != 'none' ?
													'sortable sorted' : 'sortable'
												}
												onClick={(event) => this.sortBy(event, 'email')}>
												{translate('Email')}
												{this.state.currentSortColumn == 'email' && this.state.currentSortDirection != 'none' ?
												this.state.currentSortDirection == 'asc' ? <MdArrowUpward /> : <MdArrowDownward /> : ''}
											</div>
										</TableHeaderColumn>
										<TableHeaderColumn>{translate('Actions')}</TableHeaderColumn>
									</TableRow>
								</TableHeader>
								<TableBody displayRowCheckbox={false}>
									{
										users.map((user, index) => {
											if (index >= this.state.offset
												&& index < this.state.offset + this.state.limit) {
													return (
														<TableRow key={index}>
															<TableRowColumn><Avatar src={user.company.logo} /></TableRowColumn>
															<TableRowColumn>{user.company.name}</TableRowColumn>
															<TableRowColumn>{user.name}</TableRowColumn>
															<TableRowColumn>{user.username}</TableRowColumn>
															<TableRowColumn>{user.email}</TableRowColumn>
															<TableRowColumn>
																<IconButton className="edit-action" onTouchTap={(event) => {
																	clearEvent(event)
																	browserHistory.push(`/dashboard/admin/users/edit/${user._id}`)
																}}>
																	<MdCreate/>
																</IconButton>
															</TableRowColumn>
														</TableRow>
													)
												}
											}
										)
									}
								</TableBody>
								<TableFooter>
									<TableRow>
										<TableRowColumn className="footer-content" >
											<FlatButton className="paginate-left"
												disabled={this.state.offset === 0} 
												onTouchTap={() => {
													this.setState({
														offset: this.state.offset - this.state.limit
													})
												}}>
												<MdChevronLeft className="paginate-icon" />
											</FlatButton>
											<FlatButton className="paginate-right"
												disabled={this.state.offset + this.state.limit >= users.length}
												onTouchTap={() => {
													this.setState({
														offset: this.state.offset + this.state.limit
													})
												}}>
												<MdChevronRight className="paginate-icon" />
											</FlatButton>
										</TableRowColumn>
										<TableRowColumn className="footer-text" >
											{Math.min((this.state.offset + 1), users.length) + '-' + Math.min((this.state.offset + this.state.limit), users.length) + ` ${translate('of')} ` + users.length}
										</TableRowColumn>
									</TableRow>
								</TableFooter>
							</Table>
						</Row>
					}
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

export default connect(mapStateToProps)(ProfilesCreatePage)