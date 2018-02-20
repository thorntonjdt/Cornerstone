import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Loadable from 'react-loadable';

import Layout from 'layouts/Base/Base.js';
import LoadSpinner from 'components/LoadSpinner/LoadSpinner.js';

const Payments = Loadable({
  loader: () => import('./Payments/Payments.js'),
  loading: () => LoadSpinner
})

const Applications = Loadable({
  loader: () => import('./Applications/Applications.js'),
  loading: () => LoadSpinner
})

const Maintenance = Loadable({
  loader: () => import('./Maintenance/Maintenance.js'),
  loading: () => LoadSpinner
})

const MaintenanceForm = Loadable({
  loader: () => import('./MaintenanceForm/MaintenanceForm.js'),
  loading: () => LoadSpinner
})

const TicketDetails = Loadable({
  loader: () => import('./TicketDetails/TicketDetails.js'),
  loading: () => LoadSpinner
})

const Settings = Loadable({
  loader: () => import('./Settings/Settings.js'),
  loading: () => LoadSpinner
})

const Tenant = ({user, logout, match}) => {
  if(user && user.tenant) {
    return (
      <Layout links={["payments", "maintenance", "applications"]} user={user} logout={logout} match={match}>
        <Switch>
          <Route exact path="/t/payments" render={props => <Payments tenant={user.tenant} {...props} />} />
          <Route exact path="/t/applications" render={props => <Applications tenant={user.tenant} {...props} />} />
          <Route exact path="/t/maintenance" render={props => <Maintenance tenant={user.tenant} />} />
          <Route path="/t/settings" render={props => <Settings user={user.id} />} />
          <Route path="/t/maintenance/new" render={props => <MaintenanceForm tenant={user.tenant} {...props} />} />
          <Route path="/t/maintenance/:id" render={props => <TicketDetails user={user} {...props} />} />
        </Switch>
      </Layout>
    )
  } else {
    return (
      <Redirect push to='/' />
    )
  }
};

export default Tenant;
