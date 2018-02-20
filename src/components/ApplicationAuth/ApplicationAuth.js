import React from 'react';

import CreateAccountForm from 'components/CreateAccountForm/CreateAccountForm.js';
import LoginForm from 'components/LoginForm/LoginForm.js';

import styles from './ApplicationAuth.css';

class ApplicationAuth extends React.Component {
  constructor(){
    super();
    this.state = {
      hasAccount: false
    }
    this.flipCard = this.flipCard.bind(this);
  }
  flipCard(e){
    e.preventDefault();
    this.setState({hasAccount: !this.state.hasAccount})
  }
  render(){
    return(
      <div>
        <h4 className={styles.center}>Apply Online</h4>
        {this.state.hasAccount ?
          <div>
            <p className={styles.center}>
              Already have an account?
              <span className={styles.link} onClick={this.flipCard}> Please sign in.</span>
            </p>
            <CreateAccountForm login={this.props.login} />
          </div>
        :
          <div>
            <p className={styles.center}>
              Don't have an account?
              <span className={styles.link} onClick={this.flipCard}> Sign up.</span>
            </p>
            <LoginForm login={this.props.login} />
          </div>
        }
      </div>
    );
  }
}

export default ApplicationAuth;
