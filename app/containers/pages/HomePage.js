import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { toggleModal } from '../../actions/loginDialog'
import { Parallax } from 'react-parallax'
// Components
// import AppBar from '../../components/AppBar'
import { Container, Section, Row, Col, Footer } from '../../components/html'
// Material UI
import AppBar from 'material-ui/AppBar'
import FlatButton from 'material-ui/FlatButton'
// Icons
import MdFlashOn from 'react-icons/lib/md/flash-on'
import MdGroup from 'react-icons/lib/md/group'
import MdSettings from 'react-icons/lib/md/settings'
import MdSend from 'react-icons/lib/md/send'

import LoginDialog from '../LoginDialog'

const mapStateToProps = (state, ownProps) => {
	return {
		open: state.loginDialog.open,
		modal: false,
		button: true,
		params: ownProps.params
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		toggleModal: (open) => {
			dispatch(toggleModal(open))
		}
	}
}

class Dashboard extends Component {

	render() {
		const MappedLoginDialog = connect(mapStateToProps, mapDispatchToProps)(LoginDialog)
		const loginButton = <MappedLoginDialog params={this.props.params} />
		return (
			<div className="blue">
				<AppBar
					title={<img src="/img/logo-light.png" alt="Brandtreat" className="logo-top-bar" />}
					showMenuIconButton={false}
					iconElementRight={loginButton} />
				<div className="header">
					<Container>
						<Row>
							<Col className="l6 header-content">
								<div className="header-text">
									<h4>Brand Engagement</h4>
									<p>	
										Brandtreat lets you create different challenges to reward your customers
									</p>
								</div>
								<div className="marketplace-links">
									<figure className="play-store">
										<img src="img/play-store.png" alt="Google Play Store" />
									</figure>
									<figure className="app-store">
										<img src="img/app-store.png" alt="App Store" />
									</figure>
								</div>
							</Col>
							<Col className="m12 l6">
								<img src="img/smartphone.png" alt="Brandtreat Preview" className="img-header" />
							</Col>
						</Row>
					</Container>
				</div>
				<Footer className="blue">
					<div className="footer-copyright">
						<Container>
							<Row>
								<Col className="s3 copyright-information">
									{/*Made by <a className="blue-text text-lighten-3" href="http://dispatchads.com">Dispatch Ads</a>*/}
									© Brandtreat
								</Col>
								<Col className="s9 download-links">
									<a href="#">Brandtreat for Iphone</a>
									<a href="#">Brandtreat for Andorid</a>
								</Col>
							</Row>
						</Container>
					</div>
				</Footer>
			</div>
		);
	}
};

export default Dashboard