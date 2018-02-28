import React from 'react';
import { Link } from 'react-router-dom';
import Loadable from 'react-loadable';

const AuthComponent = Loadable({
  loader: () => import('components/AuthComponent/AuthComponent'),
  loading: () => null
})

const Public = ({children, user, logout, login, history, location}) => (
  <div>
    <header style={location.length < 2 ? {border: 'none'} : {}}>
      <Link to='/' style={{zIndex: 2000}} className={location.length < 2 ? 'logo main' : 'logo adjust' }>CORNER<br />STONE</Link>
      <AuthComponent user={user} logout={logout} login={login} history={history} location={location}/>
    </header>
    {children}
  </div>
);

export default Public;
