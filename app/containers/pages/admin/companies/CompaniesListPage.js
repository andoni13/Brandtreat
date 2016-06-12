// React
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

// Components
import { Section, Row, Col } from '../../../../components/html'
// import FlatButton from '../../../../components/FlatButtonNew'
// import Pagination from '../../../../components/Pagination'
// Material Components
import Avatar from 'material-ui/Avatar'
import CardHeader from 'material-ui/Card/CardHeader'
import CardText from 'material-ui/Card/CardText'
import CardActions from 'material-ui/Card/CardActions'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
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
import { loadCompany, deleteCompany, deleteMultipleCompanies, setMessage } from '../../../../actions/companies'
// Extra
import { translate, clearEvent } from '../../../../utils'
import _ from 'lodash'

const mapStateToProps = state => ({
	companies: [...state.companies.data]
})

const mapDispatchToProps = dispatch => ({
	dispatch: dispatch
})

class CompaniesPage extends Component {
	constructor(props) {
		super(props)
		this.handleDialogOpen = this.handleDialogOpen.bind(this)
		this.handleDialogClose = this.handleDialogClose.bind(this)
		this.handleDialogCancel = this.handleDialogCancel.bind(this)
		this.sortBy = this.sortBy.bind(this)
		this.state = {
			offset: 0,
			limit: 5,
			companySearch: '',
			selectedRows: [],
			dialogOpen: false,
			singleDeleteId: undefined,
			multipleCompanies: [],
			currentSortColumn: 'name',
			currentSortDirection: 'asc'
		}
	}

	componentWillMount() {
		this.props.dispatch(loadCompany())
	}

	handleDialogOpen(singleDeleteId = undefined, multipleCompanies = []) {
		this.setState({
			dialogOpen: true,
			singleDeleteId,
			multipleCompanies
		})
	}

	handleDialogClose() {
		if (this.state.singleDeleteId) {
			this.props.dispatch(deleteCompany(this.state.singleDeleteId))
		} else if (this.state.multipleCompanies.length > 0) {
			this.props.dispatch(deleteMultipleCompanies(this.state.multipleCompanies))
		}
		this.setState({
			dialogOpen: false,
			singleDeleteId: undefined,
			multipleCompanies: []
		})
	}

	handleDialogCancel() {
		this.setState({
			dialogOpen: false,
			singleDeleteId: undefined,
			multipleCompanies: []
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
		let results = this.props.companies.filter(row => row.name.toLowerCase().indexOf(this.state.companySearch.toLowerCase()) >= 0
			|| row.address.toLowerCase().indexOf(this.state.companySearch.toLowerCase()) >= 0)
		if (this.state.currentSortDirection != 'none') {
			results = _.orderBy(results, [this.state.currentSortColumn], [this.state.currentSortDirection])
		}
		const dialogActions = [
			<FlatButton label={translate('Cancel')} onTouchTap={this.handleDialogCancel} />,
			<FlatButton label={translate('Delete')} primary={true} keyboardFocused={true} onTouchTap={this.handleDialogClose} />,
		]
		const companiesWithUsers = this.state.selectedRows.filter(row => row.users.length > 0)
		const companiesToDelete = this.state.selectedRows.filter(row => row.users.length == 0)
		return (
			<div>
				<Dialog title={translate('Delete Companies')} actions={dialogActions} modal={false} open={this.state.dialogOpen} onRequestClose={this.handleDialogCancel} >
					{translate('Are you sure you want to delete this?')}
					{companiesWithUsers.length > 0
						? <p>{translate('The following companies will not be deleted since they have users:')}</p> : ''
					}
					<ul>
						{companiesWithUsers.map((company, index) => <li key={index}>{company.name}</li>)}
					</ul>
				</Dialog>
				<Row>
					<Col className="s12 m6 card-bar-button">
						<FlatButton label={translate('Create')} primary={true} onTouchTap={() => {
							browserHistory.push('/dashboard/admin/companies/create')
						}} />
						<FlatButton label={translate('Remove')} onTouchTap={() => {
							if (this.state.selectedRows.length == 1) {
								if (this.state.selectedRows[0].users.length > 0) {
									this.props.dispatch(setMessage('Cannot delete companies with users.'))
								} else {
									this.handleDialogOpen(this.state.selectedRows[0]._id)
								}
							} else if (this.state.selectedRows.length > 1) {
								this.handleDialogOpen(null, companiesToDelete)
							}
						}} />
					</Col>
					<Col className="s12 m6 right-align">
						<TextField
							onChange={() => {
								this.setState({
									companySearch: this.refs.searchBox.getValue(),
									offset: 0
								})
							}}
							ref="searchBox"
							floatingLabelText={translate('Filter by Name or Address')}
							type="text" />
					</Col>
				</Row>
				<Table
					ref="companyTable"
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
							<TableHeaderColumn>{translate('Logo')}</TableHeaderColumn>
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
										this.state.currentSortColumn == 'address' &&  this.state.currentSortDirection != 'none' ?
										'sortable sorted' : 'sortable'
									}
									onClick={(event) => this.sortBy(event, 'address')}>
									{translate('Address')}
									{this.state.currentSortColumn == 'address' && this.state.currentSortDirection != 'none' ?
									this.state.currentSortDirection == 'asc' ? <MdArrowUpward /> : <MdArrowDownward /> : ''}
								</div>
							</TableHeaderColumn>
							<TableHeaderColumn>
								<div className={
										this.state.currentSortColumn == 'plan.name' &&  this.state.currentSortDirection != 'none' ?
										'sortable sorted' : 'sortable'
									}
									onClick={(event) => this.sortBy(event, 'plan.name')}>
									{translate('Plan')}
									{this.state.currentSortColumn == 'plan.name' && this.state.currentSortDirection != 'none' ?
									this.state.currentSortDirection == 'asc' ? <MdArrowUpward /> : <MdArrowDownward /> : ''}
								</div>
							</TableHeaderColumn>
							<TableHeaderColumn>
								<div className={
										this.state.currentSortColumn == 'freeService' &&  this.state.currentSortDirection != 'none' ?
										'sortable sorted' : 'sortable'
									}
									onClick={(event) => this.sortBy(event, 'freeService')}>
									{translate('Free')}
									{this.state.currentSortColumn == 'freeService' && this.state.currentSortDirection != 'none' ?
									this.state.currentSortDirection == 'asc' ? <MdArrowUpward /> : <MdArrowDownward /> : ''}
								</div>
							</TableHeaderColumn>
							<TableHeaderColumn>
								<div className={
										this.state.currentSortColumn == 'canLogin' &&  this.state.currentSortDirection != 'none' ?
										'sortable sorted' : 'sortable'
									}
									onClick={(event) => this.sortBy(event, 'canLogin')}>
									{translate('Can Login')}
									{this.state.currentSortColumn == 'canLogin' && this.state.currentSortDirection != 'none' ?
									this.state.currentSortDirection == 'asc' ? <MdArrowUpward /> : <MdArrowDownward /> : ''}
								</div>
							</TableHeaderColumn>
							<TableHeaderColumn>
								<div className={
										this.state.currentSortColumn == 'users' &&  this.state.currentSortDirection != 'none' ?
										'sortable sorted' : 'sortable'
									}
									onClick={(event) => this.sortBy(event, 'users')}>
									{translate('Users')}
									{this.state.currentSortColumn == 'users' && this.state.currentSortDirection != 'none' ?
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
											<TableRowColumn><Avatar src={row.logo} /></TableRowColumn>
											<TableRowColumn>{row.name}</TableRowColumn>
											<TableRowColumn>{row.address}</TableRowColumn>
											<TableRowColumn>{row.plan.name}</TableRowColumn>
											<TableRowColumn>{row.freeService ? <MdCheck/> : <MdClear/>}</TableRowColumn>
											<TableRowColumn>{row.canLogin ? <MdCheck/> : <MdClear/>}</TableRowColumn>
											<TableRowColumn>{row.users.length}</TableRowColumn>
											<TableRowColumn>
												<IconButton className="edit-action" onTouchTap={(event) => {
													clearEvent(event)
													browserHistory.push(`/dashboard/admin/companies/edit/${row._id}`)
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

CompaniesPage.propTypes = {
	token: PropTypes.string.isRequired,
	companies: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(CompaniesPage)