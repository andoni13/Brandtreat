// React
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import jwt from 'jsonwebtoken'
import { browserHistory } from 'react-router'
// Actions
import { logoutAndRedirect } from '../../actions/loginDialog'
import { loadUser } from '../../actions/users'
import { toggleDrawerOpen } from '../../actions/drawer'
import { clearEvent, translate } from '../../utils'
// Components
// import AppBarNew from '../../components/AppBarNew'
import Drawer from '../../components/Drawer'
// import FlatButton from '../../components/FlatButtonNew'
import { Container, Section, Row, Col, Footer } from '../../components/html'
import Breadcrumbs from '../Breadcrumbs'
// Material Components
import AppBar from 'material-ui/AppBar'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
// Icons
import MdFlashOn from 'react-icons/lib/md/flash-on'
import MdGroup from 'react-icons/lib/md/group'
import MdSettings from 'react-icons/lib/md/settings'
import MdSend from 'react-icons/lib/md/send'

const mapStateToProps = state => ({
	drawerDocked: state.drawer.docked
})

class Dashboard extends Component {
	constructor (props) {
		super(props)
		this.handleLogout = this.handleLogout.bind(this)
		this.handleMenuIconTouchTap = this.handleMenuIconTouchTap.bind(this)
		this.handleSuperUser = this.handleSuperUser.bind(this)
		this.decoded = jwt.decode(this.props.token)
	}

	componentDidMount() {
		if (this.decoded.profile.isSuperAdmin && this.props.location.pathname === '/dashboard') {
			browserHistory.push('/dashboard/admin')
		}
	}
	
	handleLogout(event) {
		clearEvent(event)
		this.props.dispatch(logoutAndRedirect())
	}

	handleMenuIconTouchTap(event) {
		clearEvent(event)
		this.props.dispatch(toggleDrawerOpen())
	}

	handleSuperUser() {
		this.props.dispatch(loadUser(this.props.token, ''))
	}

	render() {
		const logoutButton = <FlatButton label={translate('logout')} secondary={true} onTouchTap={(e) => {
								this.handleLogout(e)
							}} />
		const appBar = <AppBar
						title={"Brandtreat"}
						showMenuIconButton={this.decoded.profile.isSuperAdmin}
						iconElementRight={logoutButton}
						onLeftIconButtonTouchTap={this.handleMenuIconTouchTap}
						className="blue" />
		return (
			<div className="main-app">
				{ this.decoded.profile.isSuperAdmin ?
					<Drawer params={this.props.params} appBar={appBar}>
						<div>
							<nav className="truncate">
								<Breadcrumbs
									displayMissing={false}
									routes={this.props.routes}
									params={this.props.params}
									documentTitle="Brandtreat"
									setDocumentTitle={true} 
									/>
							</nav>
							{this.props.children}
						</div>
					</Drawer>
					:
					<div>
						{appBar}
						<b>NOT SUPER USER</b>
					</div>
				}
			</div>
		);
	}
};

Dashboard.propTypes = {
	token: PropTypes.string.isRequired
}

export default connect(mapStateToProps)(Dashboard)