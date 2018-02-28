import React from 'react';

import { getRequest, updateRequest } from 'utils/APIManager';
import Input from 'components/Input/Input';
import FilledButton from 'components/FilledButton/FilledButton';
import LoadSpinner from 'components/LoadSpinner/LoadSpinner';

import styles from './AccountForm.css';

class AccountForm extends React.Component {
  constructor(){
    super();
    this.state = {
      email: '',
      updateEmail: false,
      newEmail: '',
      emailPassword: '',
      updatePassword: false,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      emailErrors: {},
      passwordErrors: {},
      loading: true
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.toggleEmail = this.toggleEmail.bind(this);
    this.updateEmail = this.updateEmail.bind(this);
    this.togglePassword = this.togglePassword.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
  }
  componentDidMount(){
    getRequest(`/${this.props.app}/users/${this.props.user}/account`, (err, response) => {
      if(err){
        console.log(err);
        return;
      }
      this.setState({email: response, loading: false})
    })
  }
  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }
  toggleEmail(){
    this.setState({updateEmail: !this.state.updateEmail})
  }
  updateEmail(){
    const { newEmail, emailPassword } = this.state;
    let errors = {};
    let reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    errors.newEmail = !reg.test(newEmail);
    errors.emailPassword = emailPassword.length < 7 ? true : false;
    const noErrors = Object.keys(errors).every(i => !errors[i])
    if(noErrors){
      let body = {
        email: newEmail,
        password: emailPassword
      }
      updateRequest(`/${this.props.app}/users/${this.props.user}/email`, body, err => {
        if(err){
          this.setState({emailErrors: {emailPassword: true}})
        }
        this.setState({email: newEmail, newEmail: '', newPassword: '', emailErrors: {}, updateEmail: false})
      })
    } else {
      this.setState({emailErrors: errors})
    }
  }
  togglePassword(){
    this.setState({updatePassword: !this.state.updatePassword})
  }
  updatePassword(){
    const { currentPassword, newPassword, confirmPassword } = this.state;
    let errors = {};
    errors.currentPassword = currentPassword.length < 7 ? true : false;
    errors.newPassword = newPassword.length < 7 ? true : false;
    errors.confirmPassword = newPassword != confirmPassword ? true : false;
    const noErrors = Object.keys(errors).every(i => !errors[i])
    if(noErrors){
      let body = {
        oldPassword: currentPassword,
        password: newPassword
      }
      updateRequest(`/${this.props.app}/users/${this.props.user}/password`, body, err => {
        if(err){
          this.setState({passwordErrors: {currentPassword: true}})
        }
        this.setState({currentPassword: '', newPassword: '', confirmPassword: '', passwordErrors: {}, updatePassword: false})
      })
    } else {
      this.setState({passwordErrors: errors})
    }
  }
  render(){
    const { email, updateEmail, newEmail, emailPassword, updatePassword, newPassword, currentPassword, confirmPassword, emailErrors, passwordErrors, loading } = this.state;

    if(!loading)
    return(
      <div>
        <div className={styles.tile}>
          <h3 className={styles.header}>Your Email</h3>
          {updateEmail ?
            <div>
              <div className={styles.row}>
                <Input name="newEmail" label="New Email Address" value={newEmail} hasError={emailErrors["newEmail"]} errorText="Please enter a valid email address." onChange={this.handleInputChange} />
                <Input password name="emailPassword" label="your current password" value={emailPassword} hasError={emailErrors["emailPassword"]} errorText="Password is incorrect." onChange={this.handleInputChange} />
              </div>
              <div className={styles.buttons}>
                <FilledButton
                  height="35px"
                  width="130px"
                  font="13px"
                  onClick={this.updateEmail}
                >
                  Save and Update
                </FilledButton>
                <span className={styles.cancel} onClick={this.toggleEmail}>Cancel</span>
              </div>
            </div>
          :
            <div>
              <div className={styles.muted}>{email}</div>
              <div className={styles.link} onClick={this.toggleEmail}>Update Email</div>
            </div>
          }
        </div>
        <div className={styles.tile}>
          <h3 className={styles.header}>Your Password</h3>
          {updatePassword ?
            <div>
              <div className={styles.half}>
                <Input password name="currentPassword" label="your current password" value={currentPassword} hasError={passwordErrors["currentPassword"]} errorText="Password is incorrect." onChange={this.handleInputChange} />
              </div>
              <div className={styles.row}>
                <Input password name="newPassword" label="New password" value={newPassword} hasError={passwordErrors["newPassword"]} errorText="Password must contain at least 7 characters." onChange={this.handleInputChange} />
                <Input password name="confirmPassword" label="confirm new password" value={confirmPassword} hasError={passwordErrors["confirmPassword"]} errorText="Mismatched password entered." onChange={this.handleInputChange} />
              </div>
              <div className={styles.buttons}>
                <FilledButton
                  height="35px"
                  width="130px"
                  font="13px"
                  onClick={this.updatePassword}
                >
                  Set New Password
                </FilledButton>
                <span className={styles.cancel} onClick={this.togglePassword}>Cancel</span>
              </div>
            </div>
          :
            <div>
              <div className={styles.muted}>*******</div>
              <div className={styles.link} onClick={this.togglePassword}>Update Password</div>
            </div>
          }
        </div>
      </div>
    )

    else
    return(
      <LoadSpinner />
    )
  }
}

export default AccountForm;
