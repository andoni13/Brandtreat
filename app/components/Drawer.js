// React
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Sidebar from './Sidebar'
import { browserHistory } from 'react-router'

// Actions and utils
import { toggleDrawerOpen, toggleDrawerDocked, setDrawerOpen, setDrawerDocked } from '../actions/drawer'
import { clearEvent, translate, translateUrl } from '../utils'

// Components
// import AppBarNew from './AppBarNew'

// Material UI
import AppBar from 'material-ui/AppBar'
import BaseDrawer from 'material-ui/Drawer'
import { List, ListItem, MakeSelectable } from 'material-ui/List'
import MenuItem from 'material-ui/MenuItem'

// Icons
import FaBuilding from 'react-icons/lib/fa/building'
import FaUser from 'react-icons/lib/fa/user'
import FaGroup from 'react-icons/lib/fa/group'
import MdAttachMoney from 'react-icons/lib/md/attach-money'
import MdDashboard from 'react-icons/lib/md/dashboard'

const SelectableList = MakeSelectable(List)

const mapStateToProps = state => ({
	open: state.drawer.open,
	docked: state.drawer.docked
})

const mapDispatchToProps = dispatch => ({
	toggleDrawerOpen: () => {
		dispatch(toggleDrawerOpen())
	},
	toggleDrawerDocked: () => {
		dispatch(toggleDrawerDocked())
	},
	setDrawerOpen: open => {
		dispatch(setDrawerOpen(open))
	},
	setDrawerDocked: docked => {
		dispatch(setDrawerDocked(docked))
	}
})

class Drawer extends Component {
	constructor(props) {
		super(props)
		this.onRequestChangeList = this.onRequestChangeList.bind(this)
		this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this)
		this.mediaQueryChanged = this.mediaQueryChanged.bind(this)
		this.handleMenuIconTouchTap = this.handleMenuIconTouchTap.bind(this)
	}

	componentWillMount() {
		const mql = window.matchMedia('(min-width: 992px)')
		mql.addListener(this.mediaQueryChanged)
		this.props.setDrawerDocked(mql.matches)
		this.props.setDrawerOpen(mql.matches)
		this.setState({
			mql: mql
		})
	}

	componentWillUnmount() {
		this.state.mql.removeListener(this.mediaQueryChanged)
	}

	mediaQueryChanged() {
		this.props.setDrawerDocked(this.state.mql.matches)
		this.props.setDrawerOpen(this.state.mql.matches)
	}

	onRequestChangeList(event, location) {
		clearEvent(event)
		browserHistory.push(location)
		if (!this.refs.BaseDrawer.props.docked) {
			this.props.toggleDrawerOpen(this.props.open)
		}
	}
	onSetSidebarOpen(open) {
		this.props.toggleDrawerOpen()
	}
	handleMenuIconTouchTap(event) {
		clearEvent(event)
		this.props.toggleDrawerOpen()
	}

	render() {
		const sidebarTitle = this.props.appBar
		const sidebarContent = (
			<SelectableList value={location.pathname} onChange={this.onRequestChangeList}>
				<ListItem value="/dashboard/admin" leftIcon={<MdDashboard/>}>{translate('Dashboard')}</ListItem>
				<ListItem value="/dashboard/admin/plans" leftIcon={<MdAttachMoney/>}>{translate('Plans')}</ListItem>
				<ListItem value="/dashboard/admin/companies" leftIcon={<FaBuilding/>}>{translate('Companies')}</ListItem>
				<ListItem value="/dashboard/admin/profiles" leftIcon={<FaGroup/>}>{translate('Profiles')}</ListItem>
				<ListItem value="/dashboard/admin/users" leftIcon={<FaUser/>}>{translate('Users')}</ListItem>
			</SelectableList>
		)
		return (
			<Sidebar 
				ref="BaseDrawer"
				sidebarTitle={sidebarTitle}
				sidebar={sidebarContent}
				open={this.props.open}
				docked={this.props.docked}
				onSetOpen={this.onSetSidebarOpen}
				sidebarClassName="white">
				{this.props.children}
			</Sidebar>
		)
	}
}

Drawer.propTypes = {
	open: PropTypes.bool.isRequired,
	docked: PropTypes.bool.isRequired,
	children: PropTypes.node,
	appBar: PropTypes.node
}

export default connect(mapStateToProps, mapDispatchToProps)(Drawer)