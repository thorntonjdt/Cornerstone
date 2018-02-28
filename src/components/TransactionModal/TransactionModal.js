import React from 'react';

import DatePicker from 'react-datepicker';
import moment from 'moment';
import { createRequest } from 'utils/APIManager';
import Card from 'components/Card/Card';
import Input from 'components/Input/Input';
import FilledButton from 'components/FilledButton/FilledButton';

import styles from './TransactionModal.css';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

class TransactionModal extends React.Component {
  constructor(){
    super();
    this.state = {
      date: '',
      description: '',
      amount: '',
      modal: null,
      errors: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setDueDate = this.setDueDate.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.openCreditModal = this.openCreditModal.bind(this);
    this.openBillModal = this.openBillModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }
  handleSubmit(){
    const { modal, date, amount, description } = this.state;
    const setDate = modal == 'bill' ? date : Date.now();
    let errors = {};
    errors.amount = !amount || isNaN(amount) ? true : false;
    errors.description = !description ? true : false;
    errors.date = !setDate ? true : false;
    const noErrors = Object.keys(errors).every(i => !errors[i])
    if(noErrors){
      const setAmount = modal == 'bill' ? amount : amount * -1;
      var body = {
        date: setDate,
        description: description,
        amount: setAmount
      }
      createRequest(`/m/leases/${this.props.lease}/transactions`, body, err => {
        if(err){
          console.log(err);
          return;
        }
        this.props.addTransaction(body);
        this.setState({modal: null, date: '', description: '', amount: '', errors: ''})
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
  setDueDate(day){
    this.setState({date: day})
  }
  openCreditModal(){
    this.setState({modal: 'credit'})
  }
  openBillModal(){
    this.setState({modal: 'bill'})
  }
  closeModal(e){
    if(e.target === e.currentTarget){
      this.setState({modal: null, errors: ''})
    }
  }
  render(){
    const { description, amount, date, modal, errors } = this.state;
    return(
      <div>
        {this.props.children(this.openCreditModal, this.openBillModal)}
        {modal &&
          <div className={styles.modal} onClick={this.closeModal}>
            <div className={styles.modalContent}>
              <Card>
                <div className={styles.padding}>
                    <h3 style={{marginBottom: 10}}>{modal == 'bill' ? "Add a charge" : "Add a credit"}</h3>
                    <Input name="amount" label="amount" value={amount} hasError={errors.amount} onChange={this.handleInputChange} />
                    <Input name="description" label="description" value={description} hasError={errors.description} onChange={this.handleInputChange} />
                    {modal == 'bill' &&
                      <div style={{marginBottom: 10}}>
                        <label>Due</label>
                        <DatePicker
                          selected={date}
                          onChange={this.setDueDate}
                          placeholderText="MM/DD/YYYY"
                        />
                        {errors.date && <div className={styles.error}>You must set a due date</div>}
                      </div>
                    }
                    <FilledButton
                      height="35px"
                      width="120px"
                      font="14px"
                      onClick={this.handleSubmit}
                    >
                      Add
                    </FilledButton>
                    <span className={styles.cancelBtn} onClick={this.closeModal}>
                      Cancel
                    </span>
                  </div>
              </Card>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default TransactionModal;
