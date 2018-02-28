import React from 'react';

import Card from 'components/Card/Card';
import CreateAccountForm from 'components/CreateAccountForm/CreateAccountForm';
import LoginForm from 'components/LoginForm/LoginForm';

import styles from './AuthModal.css';

class AuthModal extends React.Component {
  constructor(){
    super();
    this.state = {
      modal: null
    }
    this.openLoginModal = this.openLoginModal.bind(this);
    this.openSignUpModal = this.openSignUpModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }
  openLoginModal(){
    this.setState({modal: 'login'})
  }
  openSignUpModal(){
    this.setState({modal: 'signup'})
  }
  closeModal(e){
    if(e.target === e.currentTarget){
      this.setState({modal: null})
    }
  }
  render(){
    let { children, login } = this.props;
    let { modal } = this.state;
    return(
      <div>
        {children(this.openLoginModal, this.openSignUpModal)}
        {modal &&
          <div className={styles.modal} onClick={this.closeModal}>
            <div className={styles.modalContent}>
              <Card>
                <div className={styles.padding}>
                  <svg width="28" height="28" viewBox="0 0 24 24" onClick={this.closeModal} className={styles.closeBtn}>
                    <path fill="#AAB1AE" d="M13.06 12l5.72-5.72c.292-.292.292-.767 0-1.06-.294-.293-.768-.293-1.06 0L12 10.94 6.28 5.22c-.293-.293-.767-.293-1.06 0-.293.293-.293.768 0 1.06L10.94 12l-5.72 5.72c-.293.292-.293.767 0 1.06.146.146.338.22.53.22s.384-.074.53-.22L12 13.06l5.72 5.72c.145.146.337.22.53.22.19 0 .383-.074.53-.22.292-.293.292-.768 0-1.06L13.06 12z" />
                  </svg>
                  {modal == "login" ?
                  <div>
                    <div className={styles.top}>
                      <h2>Log in to Cornerstone</h2>
                      <div>Don't have an account? <span className={styles.link} onClick={this.openSignUpModal}>Sign up</span></div>
                    </div>
                    <LoginForm login={login} />

                  </div>
                  :
                    <div>
                      <div className={styles.top}>
                        <h2>Get started. It's free.</h2>
                        <div>Already have an account? <span className={styles.link} onClick={this.openLoginModal}>Log in</span></div>
                      </div>
                      <CreateAccountForm chooseRole login={login} />
                    </div>
                  }
                </div>
              </Card>
            </div>
          </div>
        }
      </div>
    )
  }
}

export default AuthModal;
