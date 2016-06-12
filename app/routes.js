import React from 'react'
import { Route, IndexRoute } from 'react-router'
import { translate } from './utils'
import App from './containers/App'

import LoginPage from './containers/pages/LoginPage'
import HomePage from './containers/pages/HomePage'
import DashboardPage from './containers/pages/DashboardPage'
import AdminPage from './containers/pages/admin/AdminPage'
import CompaniesPage from './containers/pages/admin/companies/CompaniesPage'
import CompaniesListPage from './containers/pages/admin/companies/CompaniesListPage'
import CompaniesCreatePage from './containers/pages/admin/companies/CompaniesCreatePage'
import PlansPage from './containers/pages/admin/plans/PlansPage'
import PlansListPage from './containers/pages/admin/plans/PlansListPage'
import PlansCreatePage from './containers/pages/admin/plans/PlansCreatePage'
import ProfilesPage from './containers/pages/admin/profiles/ProfilesPage'
import ProfilesListPage from './containers/pages/admin/profiles/ProfilesListPage'
import ProfilesCreatePage from './containers/pages/admin/profiles/ProfilesCreatePage'
import UsersPage from './containers/pages/admin/users/UsersPage'
import UsersListPage from './containers/pages/admin/users/UsersListPage'
import UsersCreatePage from './containers/pages/admin/users/UsersCreatePage'
import { requireAuthentication } from 'components/AuthenticatedComponent'

// <Route path="*" component={HomePage}/>
export default (
	<Route path="/" component={App}>
		<IndexRoute component={HomePage} />
		<Route name={translate('Dashboard')} path="dashboard" component={requireAuthentication(DashboardPage)}>
			<Route name={translate('Admin')} path="admin" component={requireAuthentication(AdminPage)} >
				<Route name={translate('Companies')} path="companies" component={requireAuthentication(CompaniesPage)}>
					<IndexRoute component={requireAuthentication(CompaniesListPage)} />
					<Route name={translate('Create Company')} path="create" component={requireAuthentication(CompaniesCreatePage)} />
					<Route name={translate('Edit Company')} path="edit/:companyId" component={requireAuthentication(CompaniesCreatePage)} />
				</Route>
				<Route name={translate('Plans')} path="plans" component={requireAuthentication(PlansPage)}>
					<IndexRoute component={requireAuthentication(PlansListPage)} />
					<Route name={translate('Create Plan')} path="create" component={requireAuthentication(PlansCreatePage)} />
					<Route name={translate('Edit Plan')} path="edit/:planId" component={requireAuthentication(PlansCreatePage)} />
				</Route>
				<Route name={translate('Profiles')} path="profiles" component={requireAuthentication(ProfilesPage)}>
					<IndexRoute component={requireAuthentication(ProfilesListPage)} />
					<Route name={translate('Create Profile')} path="create" component={requireAuthentication(ProfilesCreatePage)} />
					<Route name={translate('Edit Profile')} path="edit/:profileId" component={requireAuthentication(ProfilesCreatePage)} />
				</Route>
				<Route name={translate('Users')} path="users" component={requireAuthentication(UsersPage)}>
					<IndexRoute component={requireAuthentication(UsersListPage)} />
					<Route name={translate('Create User')} path="create" component={requireAuthentication(UsersCreatePage)} />
					<Route name={translate('Edit User')} path="edit/:userId" component={requireAuthentication(UsersCreatePage)} />
				</Route>
			</Route>
		</Route>
		<Route path="/login" component={LoginPage} />
	</Route>
)
