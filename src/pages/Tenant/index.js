import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Loadable from 'react-loadable';

import Layout from 'layouts/Base/Base';
import LoadSpinner from 'components/LoadSpinner/LoadSpinner';

const Payments = Loadable({
  loader: () => import('./Payments/Payments'),
  loading: () => LoadSpinner
})

const Applications = Loadable({
  loader: () => import('./Applications/Applications'),
  loading: () => LoadSpinner
})

const Maintenance = Loadable({
  loader: () => import('./Maintenance/Maintenance'),
  loading: () => LoadSpinner
})

const MaintenanceForm = Loadable({
  loader: () => import('./MaintenanceForm/MaintenanceForm'),
  loading: () => LoadSpinner
})

const TicketDetails = Loadable({
  loader: () => import('./TicketDetails/TicketDetails'),
  loading: () => LoadSpinner
})

const Settings = Loadable({
  loader: () => import('./Settings/Settings'),
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
