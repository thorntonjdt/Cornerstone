import React from 'react';

import Input from 'components/Input/Input.js';
import FilledButton from 'components/FilledButton/FilledButton.js';

import styles from './CreateAccountForm.css';

class CreateAccountForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      role: props.chooseRole ? '' : 'Tenant',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirmPassword: '',
      errors: {},
      processing: false
    }
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
  handleSubmit(e){
    e.preventDefault();
    const errors = this.validateFields();
    console.log(errors);
    const noErrors = Object.keys(errors).every(i => !errors[i])
    if(noErrors){
      const { role, first_name, last_name, email, password, confirmPassword } = this.state;
      this.setState({
        processing: true,
        errors: ''
      })
      fetch('http://localhost:3000/auth/signup', {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
          first_name: first_name,
          last_name: last_name,
          role: role
        })
      })
      .then(response => response.json())
      .then(({token}) => {
        if(token){
          this.props.login(token);
        }
        else {
          this.setState({errors: {email: "There's already an account with this email address"}, processing: false});
        }
      })
    } else {
      this.setState({
        errors: errors
      })
    }
  }
  validateFields(){
    const { role, first_name, last_name, email, password, confirmPassword } = this.state;
    var reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    var errors = {};
    errors.role = role == '' ? true : false;
    errors.first_name = !first_name ? true : false;
    errors.last_name = !last_name ? true : false;
    errors.email = !reg.test(email) ? "Please enter a valid email address." : false;
    errors.password = password.length < 7 ? true : false;
    errors.confirmPassword = password != confirmPassword ? true : false;

    return errors;
  }
  render(){
    let { role, first_name, last_name, email, password, confirmPassword, errors, processing } = this.state;
    return(
      <form className={styles.form} onSubmit={this.handleSubmit}>

        {this.props.chooseRole &&
          <div style={{marginBottom: 10}}>
            <label for="role">YOU ARE A</label>
            <select style={errors["role"] ? {borderColor: '#e75b52'} : {}} value={role} name="role" onChange={this.handleInputChange}>
              <option disabled selected value="">Select...</option>
              <option value="Tenant">Renter</option>
              <option value="Manager">Landlord</option>
            </select>
            {errors["role"] && <div className={styles.error}>Are you a landlord or renter?</div>}
          </div>
        }

        <div className={styles.split}>
          <Input name="first_name" label="first name" value={first_name} hasError={errors["first_name"]} onChange={this.handleInputChange} errorText="Please enter your first name." />
          <Input name="last_name" label="last name" value={last_name} hasError={errors["last_name"]} onChange={this.handleInputChange} errorText="Please enter your last name." />
        </div>

        <Input name="email" label="email" value={email} hasError={errors["email"]} onChange={this.handleInputChange} errorText={errors["email"]} />
        <Input password name="password" label="password" value={password} hasError={errors["password"]} onChange={this.handleInputChange} errorText="Password must contain at least 7 characters." />
        <Input password name="confirmPassword" label="confirm password" value={confirmPassword} hasError={errors["confirmPassword"]} onChange={this.handleInputChange} errorText="Mismatched password entered." />
        <button style={{display: 'none'}} type="submit" />
        <FilledButton
          width="100%"
          height="45px"
          font="14px"
          onClick={this.handleSubmit}
        >
          Create account
        </FilledButton>
      </form>
    );
  }
}

export default CreateAccountForm;
