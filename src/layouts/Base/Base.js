import React from 'react';
import { NavLink, Link } from 'react-router-dom';

import styles from './Base.css';

class Layout extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      menuVisible: false
    }
    this.openMenu = this.openMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
  }
  openMenu(){
    this.setState({menuVisible: true})
  }
  closeMenu(){
    this.setState({menuVisible: false});
  }
  handleLogoutClick(){
    this.props.logout();
  }
  render(){
    const { menuVisible } = this.state;
    const { match, links, user } = this.props;
    const { first_name, last_name, manager } = user;
    return(
      <div>
        <header className={styles.header}>
          <div className={styles.navlinks}>
            {links.map(link =>
              <NavLink to={`${match}/${link}`} activeClassName={styles.activeNav}>{link}</NavLink>
            )}
          </div>
          {menuVisible ?
            <svg className={styles.icon} width="24" height="24" viewBox="0 0 24 24" onClick={this.closeMenu}>
              <path fill="#AAB1AE" d="M13.06 12l5.72-5.72c.292-.292.292-.767 0-1.06-.294-.293-.768-.293-1.06 0L12 10.94 6.28 5.22c-.293-.293-.767-.293-1.06 0-.293.293-.293.768 0 1.06L10.94 12l-5.72 5.72c-.293.292-.293.767 0 1.06.146.146.338.22.53.22s.384-.074.53-.22L12 13.06l5.72 5.72c.145.146.337.22.53.22.19 0 .383-.074.53-.22.292-.293.292-.768 0-1.06L13.06 12z" />
            </svg>
          :
            <svg className={styles.icon} width="24" height="24" viewBox="0 0 24 24" onClick={this.openMenu}>
              <path fill="#AAB1AE" d="M21,12.9H3c-0.5,0-0.9-0.4-0.9-0.9s0.4-0.9,0.9-0.9h18c0.5,0,0.9,0.4,0.9,0.9S21.5,12.9,21,12.9z" />
              <path fill="#AAB1AE" d="M21,6.9H3C2.5,6.9,2.1,6.5,2.1,6S2.5,5.1,3,5.1h18c0.5,0,0.9,0.4,0.9,0.9S21.5,6.9,21,6.9z" />
              <path fill="#AAB1AE" d="M21,18.9H3c-0.5,0-0.9-0.4-0.9-0.9s0.4-0.9,0.9-0.9h18c0.5,0,0.9,0.4,0.9,0.9S21.5,18.9,21,18.9z" />
            </svg>
          }
        </header>
          <div className={menuVisible ? styles.menu+' '+styles.show : styles.menu}>
            <ul className={styles.links}>
              {links.map(link =>
                <li className={styles.link} onClick={this.closeMenu}>
                  <NavLink to={`${match}/${link}`} activeClassName={styles.active}>
                    {link}
                  </NavLink>
                </li>
              )}
              <li className={styles.menuAccount}>
                <hr />
                <h4>{first_name} {last_name}</h4>
                <div><Link to={`${match}/settings`}>Settings</Link></div>
                <div onClick={this.handleLogoutClick}>Sign out</div>
              </li>
            </ul>
          </div>
          {this.props.children}
      </div>
    );
  }
}

export default Layout;
