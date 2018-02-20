import React from 'react';

import APIManager from 'utils/APIManager.js';
import Input from 'components/Input/Input.js';
import FilledButton from 'components/FilledButton/FilledButton.js';

import styles from './PaymentForm.css';

class PaymentForm extends React.Component {
  constructor(){
    super();
    this.state = {
      amount: '',
      description: '',
      errors: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  handleSubmit(){
    const { amount, description } = this.state;
    let errors = {};
    errors.amount = !amount ? true : false;
    errors.description = !description ? true : false;
    const noErrors = Object.keys(errors).every(i => !errors[i])
    if(noErrors){
      const body = JSON.stringify({
        amount: this.state.amount * -1,
        description: this.state.description
      })
      APIManager.create(`/t/leases/${this.props.leaseId}/transactions`, body, err => {
        if(err){
          console.log(err);
          return;
        }
        this.props.closeModal();
      })
    } else {
      this.setState({errors: errors})
    }
  }
  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }
  render(){
    const { amount, description, errors } = this.state;
    return(
      <div>
        <h3 style={{marginBottom: 10}}>Submit a Payment</h3>
        <Input name="amount" label="amount" value={amount} hasError={errors["amount"]} onChange={this.handleInputChange} />
        <Input name="description" label="description" value={description} hasError={errors["description"]} onChange={this.handleInputChange} />
        <FilledButton
          height="35px"
          width="120px"
          font="14px"
          onClick={this.handleSubmit}
        >
          Submit
        </FilledButton>
        <span className={styles.cancelBtn} onClick={this.props.closeModal}>
          Cancel
        </span>
      </div>
    );
  }
}

export default PaymentForm;
