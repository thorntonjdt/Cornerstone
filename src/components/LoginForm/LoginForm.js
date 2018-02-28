import React from 'react';

import Input from 'components/Input/Input';
import FilledButton from 'components/FilledButton/FilledButton';

import styles from './LoginForm.css';

class LoginForm extends React.Component {
  constructor(){
    super();
    this.state = {
      email: '',
      password: '',
      errors: '',
      processing: false
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateFields = this.validateFields.bind(this);
  }
  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event){
    event.preventDefault();
    const errors = this.validateFields();
    const noErrors = Object.keys(errors).every(i => !errors[i])
    if(noErrors){
      const { email, password } = this.state;
      this.setState({
        processing: true,
        errors: ''
      })
      fetch('/auth/login', {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      })
      .then(response => response.json())
      .then(({token}) => {
        if(token){
          this.props.login(token);
        }
        else {
          this.setState({errors: {form: "We didn't recognize that email and password combination."}, processing: false});
        }
      })
    } else {
      this.setState({
        errors: errors
      })
    }
  }
  validateFields(){
    const { email, password } = this.state;
    var reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const errors = {};
    errors.email = !reg.test(email);
    errors.password = !password ? true : false;
    return errors;
  }
  render(){
    const { email, password, errors, processing } = this.state;
    return (
      <form className={styles.form} onSubmit={this.handleSubmit}>
        <Input name="email" label="your email" value={email} hasError={errors.email} errorText="Please enter a valid email address." onChange={this.handleInputChange} />
        <Input password name="password" label="your password" value={password} hasError={errors.password} onChange={this.handleInputChange} />
        {errors.form && <div className={styles.error}>{errors.form}</div>}
        <button className={styles.hidden} type="submit" />
        <FilledButton
          width="100%"
          height="45px"
          font="14px"
          onClick={this.handleSubmit}
        >
          Sign in
        </FilledButton>
      </form>
    )
  }
}

export default LoginForm;
