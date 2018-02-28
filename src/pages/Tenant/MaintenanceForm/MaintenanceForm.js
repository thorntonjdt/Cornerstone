import React from 'react';
import { Link } from 'react-router-dom';

import { createRequest } from 'utils/APIManager';
import Subheader from 'components/Subheader/Subheader';
import Input from 'components/Input/Input';
import BorderButton from 'components/BorderButton/BorderButton';
import FilledButton from 'components/FilledButton/FilledButton';

import styles from './MaintenanceForm.css';

class MaintenanceForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      lease: props.location.state.lease,
      title: '',
      description: '',
      errors: ''
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
  handleSubmit(){
    const errors = this.validateFields();
    const noErrors = Object.keys(errors).every(i => !errors[i])
    if(noErrors){
      let body = {
        lease: this.state.lease,
        title: this.state.title,
        description: this.state.description
      }

      createRequest(`/t/tenants/${this.props.tenant}/tickets`, body, (err) => {
        if(err){
          console.log(err);
          return;
        }
        this.props.history.push('/t/maintenance')
      })
    } else {
      this.setState({errors: errors})
    }
  }
  validateFields(){
    let { title, description } = this.state;
    const errors = {};
    errors.title = !title ? true : false;
    errors.description = !description ? true : false;
    return errors;
  }
  render(){
    const { title, description, errors } = this.state;
    return(
      <div>
        <Subheader
          title={<h2>Create a Maintenance Request</h2>}
          button={
            <Link to="/t/maintenance">
              <BorderButton
                width="73px"
                height="35px"
                font="13px"
              >
                Cancel
              </BorderButton>
            </Link>
          }
        />
        <form className={styles.ticketForm}>
          <Input name="title" label="title" value={title} hasError={errors.title} onChange={this.handleInputChange} />
          <div className={styles.description}>
            <label for="description">Description</label>
            <textarea rows="4" name='description' type='text' value={description} onChange={this.handleInputChange} />
            {errors.description && <div className={styles.errors}>This field is required</div>}
          </div>
          <FilledButton
            width="100%"
            height="35px"
            font="13px"
            onClick={this.handleSubmit}
          >
            Submit
          </FilledButton>
        </form>
      </div>
    );
  }
}

export default MaintenanceForm;
