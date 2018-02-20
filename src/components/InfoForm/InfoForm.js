import React from 'react';

import APIManager from 'utils/APIManager.js';
import Input from 'components/Input/Input.js';
import FilledButton from 'components/FilledButton/FilledButton.js';
import LoadSpinner from 'components/LoadSpinner/LoadSpinner.js';

import styles from './InfoForm.css';

class InfoForm extends React.Component {
  constructor(){
    super();
    this.state = {
      first_name: '',
      last_name: '',
      phone: '',
      errors: {},
      loading: true
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.updateInfo = this.updateInfo.bind(this);
  }
  componentDidMount(){
    APIManager.get(`/${this.props.app}/users/${this.props.user}/info`, (err, response) => {
      if(err){
        console.log(err);
        return;
      }
      this.setState({first_name: response.first_name, last_name: response.last_name, phone: response.phone, loading: false})
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
  updateInfo(){
    const { first_name, last_name, phone } = this.state;
    var errors = {};
    errors.first_name = !first_name ? true : false;
    errors.last_name = !last_name ? true : false;
    const noErrors = Object.keys(errors).every(i => !errors[i])
    if(noErrors){
      let body = JSON.stringify({
        first_name: first_name,
        last_name: last_name,
        phone: phone
      })
      APIManager.update(`/${this.props.app}/users/${this.props.user}`, body, err => {
        if(err){
          console.log(err);
          return;
        }
        this.setState({errors: {}})
      })
    } else {
      this.setState({errors: errors})
    }
  }
  render(){
    const { first_name, last_name, phone, errors, loading } = this.state;
    if(!loading)
    return(
      <div>
        <h3 className={styles.header}>Personal Info</h3>
        <Input name="first_name" label="first name" value={first_name} hasError={errors["first_name"]} onChange={this.handleInputChange} />
        <Input name="last_name" label="last name" value={last_name} hasError={errors["last_name"]} onChange={this.handleInputChange} />
        <Input name="phone" label="phone number" value={phone} onChange={this.handleInputChange} placeholder="(555) 555-5555" />
        <div className={styles.save}>
          <FilledButton
            height="35px"
            width="130px"
            font="13px"
            onClick={this.updateInfo}
          >
            Save and Update
          </FilledButton>
        </div>
      </div>
    )

    else
    return(
      <LoadSpinner />
    )
  }
}

export default InfoForm;
