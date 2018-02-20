import React from 'react';
import { Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import jwtDecode from 'jwt-decode';

import Public from 'layouts/Public/Public.js';
import LoadSpinner from 'components/LoadSpinner/LoadSpinner.js';

const Landing = Loadable({
  loader: () => import('./Pages/Public/Landing/Landing.js'),
  loading: () => LoadSpinner
})

const Search = Loadable({
  loader: () => import('./Pages/Public/Search/Search.js'),
  loading: () => LoadSpinner
})

const Listing = Loadable({
  loader: () => import('./Pages/Public/Listing/Listing.js'),
  loading: () => LoadSpinner
})

const ManagerApp = Loadable({
  loader: () => import('./Pages/Manager'),
  loading: () => LoadSpinner
})

const TenantApp = Loadable({
  loader: () => import('./Pages/Tenant'),
  loading: () => LoadSpinner
})

import styles from './App.css';

class App extends React.Component {
  constructor(){
    super();
    this.state = {
      user: null
    }
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }
  componentDidMount(){
    let token = window.sessionStorage.getItem('jwtToken');
    if(token){
      let user = jwtDecode(token);
      this.setState({ user: user });
    }
  }
  login(token){
    window.sessionStorage.setItem('jwtToken', token);
    let user = jwtDecode(token);
    this.setState({ user: user });
    if(location.pathname.length <= 1){
      let app = user.manager ? '/m/properties' : '/t/payments';
      this.props.history.push(app);
    }
  }
  logout(){
    const { history, location } = this.props;
    window.sessionStorage.removeItem('jwtToken');
    this.setState({ user: null });
    if(location.pathname[1] == 'm' || location.pathname[1] == 't'){
      history.push('/');
    }
  }
  render(){
    const { user } = this.state;
    return(
      <Public user={user} logout={this.logout} login={this.login} history={this.props.history} location={this.props.location.pathname}>
        <Route exact path="/" component={Landing} />
        <Route exact path="/listings" component={Search} />
        <Route path="/listings/:id" component={props => <Listing user={user} logout={this.logout} login={this.login} {...props}/>} />
        <Route path="/m" render={props => <ManagerApp user={user} logout={this.logout} match={props.match.url}/>} />
        <Route path="/t" render={props => <TenantApp user={user} logout={this.logout} match={props.match.url}/>} />
      </Public>
    );
  }
}

export default App;
