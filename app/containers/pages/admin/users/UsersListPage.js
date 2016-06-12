// React
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

// Components
import { Section, Row, Col } from '../../../../components/html'
// Material Components
import Avatar from 'material-ui/Avatar'
import CardHeader from 'material-ui/Card/CardHeader'
import CardText from 'material-ui/Card/CardText'
import CardActions from 'material-ui/Card/CardActions'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import MenuItem from 'material-ui/MenuItem'
import SelectField from 'material-ui/SelectField'
import Table from 'material-ui/Table'
import TableHeaderColumn from 'material-ui/Table/TableHeaderColumn'
import TableRow from 'material-ui/Table/TableRow'
import TableHeader from 'material-ui/Table/TableHeader'
import TableRowColumn from 'material-ui/Table/TableRowColumn'
import TableBody from 'material-ui/Table/TableBody'
import TableFooter from 'material-ui/Table/TableFooter'
import TextField from 'material-ui/TextField'
// Icons
import MdCheck from 'react-icons/lib/md/check'
import MdClear from 'react-icons/lib/md/clear'
import MdCreate from 'react-icons/lib/md/create'
import MdChevronLeft from 'react-icons/lib/md/chevron-left'
import MdChevronRight from 'react-icons/lib/md/chevron-right'
import MdArrowDownward from 'react-icons/lib/md/arrow-downward'
import MdArrowUpward from 'react-icons/lib/md/arrow-upward'
// Action creators
import { loadUser, deleteUser, deleteMultipleUsers, setMessage } from '../../../../actions/users'
import { loadCompany } from '../../../../actions/companies'
import { loadProfile } from '../../../../actions/profiles'
// Extra
import { translate, clearEvent } from '../../../../utils'
import _ from 'lodash'

const mapStateToProps = state => ({
	users: [...state.users.data],
	companies: state.companies.data,
	profiles: state.profiles.data
})

const mapDispatchToProps = dispatch => ({
	dispatch: dispatch
})

class UsersPage extends Component {
	constructor(props) {
		super(props)
		this.handleDialogOpen = this.handleDialogOpen.bind(this)
		this.handleDialogClose = this.handleDialogClose.bind(this)
		this.handleDialogCancel = this.handleDialogCancel.bind(this)
		this.sortBy = this.sortBy.bind(this)
		this.state = {
			offset: 0,
			limit: 5,
			userSearch: '',
			selectedRows: [],
			dialogOpen: false,
			singleDeleteId: undefined,
			multipleUsers: [],
			currentSortColumn: 'name',
			currentSortDirection: 'asc',
			selectedCompany: 'none',
			selectedProfile: 'none'
		}
	}

	componentWillMount() {
		this.props.dispatch(loadUser())
		this.props.dispatch(loadCompany())
		this.props.dispatch(loadProfile())
	}

	handleDialogOpen(singleDeleteId = undefined, multipleUsers = []) {
		this.setState({
			dialogOpen: true,
			singleDeleteId,
			multipleUsers
		})
	}

	handleDialogClose() {
		if (this.state.singleDeleteId) {
			this.props.dispatch(deleteUser(this.state.singleDeleteId))
		} else if (this.state.multipleUsers.length > 0) {
			this.props.dispatch(deleteMultipleUsers(this.state.multipleUsers))
		}
		this.setState({
			dialogOpen: false,
			singleDeleteId: undefined,
			multipleUsers: []
		})
	}

	handleDialogCancel() {
		this.setState({
			dialogOpen: false,
			singleDeleteId: undefined,
			multipleUsers: []
		})
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
		let results = this.props.users.filter(row => row.name && row.name.toLowerCase().indexOf(this.state.userSearch.toLowerCase()) >= 0
			|| row.username && row.username.toLowerCase().indexOf(this.state.userSearch.toLowerCase()) >= 0
			|| row.email && row.email.toLowerCase().indexOf(this.state.userSearch.toLowerCase()) >= 0)
		if (this.state.currentSortDirection != 'none') {
			results = _.orderBy(results, [this.state.currentSortColumn], [this.state.currentSortDirection])
		}
		if (this.state.selectedCompany != 'none') {
			results = results.filter(row => row.company.name == this.state.selectedCompany)
		}
		if (this.state.selectedProfile != 'none') {
			results = results.filter(row => row.profile.type == this.state.selectedProfile)	
		}
		const dialogActions = [
			<FlatButton label={translate('Cancel')} onTouchTap={this.handleDialogCancel} />,
			<FlatButton label={translate('Delete')} primary={true} keyboardFocused={true} onTouchTap={this.handleDialogClose} />,
		]
		const companiesNames = this.props.companies.map(company => ({name: `${company.name} (${this.props.users.filter(user => user.company && user.company.name == company.name).length})`, value: company.name}))
		const profilesNames = this.props.profiles.map(profile => ({name: `${profile.type} (${this.props.users.filter(user => user.profile && user.profile.type == profile.type).length})`, value: profile.type}))
		const usersToDelete = this.state.selectedRows
		return (
			<div>
				<Dialog title={translate('Delete Users')} actions={dialogActions} modal={false} open={this.state.dialogOpen} onRequestClose={this.handleDialogCancel} >
					{translate('Are you sure you want to delete this?')}
				</Dialog>
				<Row>
					<Col className="s12 m6 card-bar-button">
						<FlatButton label={translate('Create')} primary={true} onTouchTap={() => {
							browserHistory.push('/dashboard/admin/users/create')
						}} />
						<FlatButton label={translate('Remove')} onTouchTap={() => {
							this.handleDialogOpen(null, usersToDelete)
						}} />
					</Col>
					<Col className="s12 m6 right-align">
						<TextField
							onChange={() => {
								this.setState({
									userSearch: this.refs.searchBox.getValue(),
									offset: 0
								})
							}}
							ref="searchBox"
							floatingLabelText={translate('Filter by Name, Email or Username')}
							type="text" />
					</Col>
				</Row>
				<Row className="">
					<Col className="s12">
						<SelectField
							hintText={translate('Company')}
							className="left-align"
							value={this.state.selectedCompany}
							onChange={(event, index, value) => {
								this.setState({
									selectedCompany: value,
									offset: 0
								})
							}}>

							<MenuItem value='none' primaryText={translate('Filter by Company')} />
							{companiesNames.map((companyName, index) => (
								<MenuItem key={index} value={companyName.value} primaryText={companyName.name} />
							))}
						</SelectField>

						<SelectField
							hintText={translate('Profile')}
							className="left-align"
							value={this.state.selectedProfile}
							onChange={(event, index, value) => {
								this.setState({
									selectedProfile: value,
									offset: 0
								})
							}}>

							<MenuItem value='none' primaryText={translate('Filter by Profile')} />
							{profilesNames.map((profileName, index) => (
								<MenuItem key={index} value={profileName.value} primaryText={profileName.name} />
							))}
						</SelectField>
					</Col>
				</Row>
				<Table
					ref="userTable"
					multiSelectable={true}
					preScanRows={true}
					onRowSelection={(tableSelectedRows) => {
						if (_.isArray(tableSelectedRows)) {
							tableSelectedRows = tableSelectedRows.map(row => row + this.state.offset)
							results.map((row, index) => {
								if (index >= this.state.offset && index < this.state.offset + this.state.limit) {
									row.isSelected = tableSelectedRows.indexOf(index) >= 0
								}
							})
						} else if (tableSelectedRows === 'all') {
							results.map(row => row.isSelected = true)
						} else {
							results.map(row => row.isSelected = false)
						}
						this.setState({
							selectedRows: results.filter(row => row.isSelected)
						})
					}} >
					<TableHeader enableSelectAll={true}>
						<TableRow>
							<TableHeaderColumn>{translate('Company')}</TableHeaderColumn>
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
							<TableHeaderColumn tooltip={translate('Change Password')}>
								<div className={
										this.state.currentSortColumn == 'shouldChangePassword' &&  this.state.currentSortDirection != 'none' ?
										'sortable sorted truncate' : 'sortable truncate'
									}
									onClick={(event) => this.sortBy(event, 'shouldChangePassword')}>
									{translate('Change Password')}
									{this.state.currentSortColumn == 'shouldChangePassword' && this.state.currentSortDirection != 'none' ?
									this.state.currentSortDirection == 'asc' ? <MdArrowUpward /> : <MdArrowDownward /> : ''}
								</div>
							</TableHeaderColumn>
							<TableHeaderColumn>
								<div className={
										this.state.currentSortColumn == 'profile.type' &&  this.state.currentSortDirection != 'none' ?
										'sortable sorted' : 'sortable'
									}
									onClick={(event) => this.sortBy(event, 'profile.type')}>
									{translate('Profile')}
									{this.state.currentSortColumn == 'profile.type' && this.state.currentSortDirection != 'none' ?
									this.state.currentSortDirection == 'asc' ? <MdArrowUpward /> : <MdArrowDownward /> : ''}
								</div>
							</TableHeaderColumn>
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
							<TableHeaderColumn>{translate('Actions')}</TableHeaderColumn>
						</TableRow>
					</TableHeader>
					<TableBody deselectOnClickaway={false}>
						{
							results.map((row, index) => {
								if (index >= this.state.offset
									&& index < this.state.offset + this.state.limit) {
									return (
										<TableRow key={index} selected={row.isSelected}>
											<TableRowColumn><Avatar src={row.company && row.company.logo} /></TableRowColumn>
											<TableRowColumn>{row.name}</TableRowColumn>
											<TableRowColumn>{row.username}</TableRowColumn>
											<TableRowColumn>{row.email}</TableRowColumn>
											<TableRowColumn>{row.shouldChangePassword ? <MdCheck/> : <MdClear/>}</TableRowColumn>
											<TableRowColumn>{row.profile && row.profile.type}</TableRowColumn>
											<TableRowColumn>{row.company && row.company.name}</TableRowColumn>
											<TableRowColumn>
												<IconButton className="edit-action" onTouchTap={(event) => {
													clearEvent(event)
													browserHistory.push(`/dashboard/admin/users/edit/${row._id}`)
												}}>
													<MdCreate/>
												</IconButton>
											</TableRowColumn>
										</TableRow>
									)
								}
							})
						}
					</TableBody>
					<TableFooter adjustForCheckbox={true}>
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
									disabled={this.state.offset + this.state.limit >= results.length}
									onTouchTap={() => {
										this.setState({
											offset: this.state.offset + this.state.limit
										})
									}}>
									<MdChevronRight className="paginate-icon" />
								</FlatButton>
							</TableRowColumn>
							<TableRowColumn className="footer-text" >
								{Math.min((this.state.offset + 1), results.length) + '-' + Math.min((this.state.offset + this.state.limit), results.length) + ` ${translate('of')} ` + results.length}
							</TableRowColumn>
							<TableRowColumn className="footer-text" >
								{results.filter(row => row.isSelected).length + ` ${translate('selected')} `}
							</TableRowColumn>
						</TableRow>
					</TableFooter>
				</Table>
				<CardActions />
			</div>
		)
	}
}

UsersPage.propTypes = {
	token: PropTypes.string.isRequired,
	users: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersPage)