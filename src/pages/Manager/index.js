import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Loadable from 'react-loadable';

import Layout from 'layouts/Base/Base.js';
import LoadSpinner from 'components/LoadSpinner/LoadSpinner.js';

const Properties = Loadable({
  loader: () => import('./Properties/Properties.js'),
  loading: () => LoadSpinner
});

const Listings = Loadable({
  loader: () => import('./Listings/Listings.js'),
  loading: () => LoadSpinner
});

const Applications = Loadable({
  loader: () => import('./Applications/Applications.js'),
  loading: () => LoadSpinner
});

const Leases = Loadable({
  loader: () => import('./Payments/Payments.js'),
  loading: () => LoadSpinner
});

const LeaseDetails = Loadable({
  loader: () => import('./LeaseDetails/LeaseDetails.js'),
  loading: () => LoadSpinner
});

const PropertyForm = Loadable({
  loader: () => import('./PropertyForm/PropertyForm.js'),
  loading: () => LoadSpinner
});

const PropertyEditForm = Loadable({
  loader: () => import('./PropertyEditForm/PropertyEditForm.js'),
  loading: () => LoadSpinner
});

const Property = Loadable({
  loader: () => import('./PropertyDetails/PropertyDetails.js'),
  loading: () => LoadSpinner
});

const ListingForm = Loadable({
  loader: () => import('./ListingForm/ListingForm.js'),
  loading: () => LoadSpinner
});

const ListingEditForm = Loadable({
  loader: () => import('./ListingEditForm/ListingEditForm.js'),
  loading: () => LoadSpinner
});

const ChooseProperty = Loadable({
  loader: () => import('./ChooseProperty/ChooseProperty.js'),
  loading: () => LoadSpinner
})

const Application = Loadable({
  loader: () => import('./Application/Application.js'),
  loading: () => LoadSpinner
});

const LeaseForm = Loadable({
  loader: () => import('./LeaseForm/LeaseForm.js'),
  loading: () => LoadSpinner
});

const Maintenance = Loadable({
  loader: () => import('./Maintenance/Maintenance.js'),
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

const Manager = ({user, logout, match}) => {

  if(user && user.manager) {
    return(
      <Layout links={["properties", "payments", "listings", "applications", "maintenance"]} user={user} logout={logout} match={match}>
        <Switch>
          <Route exact path="/m/properties" component={props => <Properties manager={user.manager} />} />
          <Route exact path="/m/listings" component={props => <Listings manager={user.manager} />} />
          <Route exact path="/m/applications" component={props => <Applications manager={user.manager} {...props} />} />
          <Route exact path="/m/payments" component={props => <Leases manager={user.manager} />} />
          <Route exact path="/m/maintenance" component={props => <Maintenance manager={user.manager} />} />
          <Route path="/m/settings" render={props => <Settings user={user.id} />} />
          <Route path="/m/maintenance/:id" component={props => <TicketDetails user={user} {...props} />} />
          <Route path="/m/payments/:id" component={LeaseDetails} />
          <Route path="/m/properties/new" component={props => <PropertyForm manager={user.manager} {...props} />} />
          <Route path="/m/properties/:id/update" component={PropertyEditForm} />
          <Route path="/m/properties/:id" component={Property} />
          <Route path="/m/listings/new" component={props => <ListingForm manager={user.manager} {...props} />} />
          <Route path="/m/listings/choose-property" component={props => <ChooseProperty manager={user.manager} {...props} />} />
          <Route path="/m/listings/:id/update" component={ListingEditForm} />
          <Route path="/m/applications/:id" component={Application} />
          <Route path="/m/leases/new/:id" component={LeaseForm} />
        </Switch>
      </Layout>
    );
  } else {
    return (
      <Redirect push to='/' />
    )
  }
}

export default Manager;
