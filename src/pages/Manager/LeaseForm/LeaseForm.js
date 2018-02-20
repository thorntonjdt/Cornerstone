import React from 'react';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import APIManager from 'utils/APIManager.js';
import Subheader from 'components/Subheader/Subheader.js';
import Input from 'components/Input/Input.js';
import Card from 'components/Card/Card.js';
import BorderButton from 'components/BorderButton/BorderButton.js';
import FilledButton from 'components/FilledButton/FilledButton.js';
import LoadSpinner from 'components/LoadSpinner/LoadSpinner.js';

import styles from './LeaseForm.css';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

class LeaseForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      loading: true,
      begins: '',
      hasEndDate: false,
      ends: '',
      rent: '',
      deposit: '0',
      address: '',
      unit: '',
      first_name: '',
      last_name: '',
      errors: ''
    }
    this.setStartDate = this.setStartDate.bind(this);
    this.setEndDate = this.setEndDate.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateFields = this.validateFields.bind(this);
  }
  componentDidMount(){
    APIManager.getById(`/m/lease/form/${this.props.match.params.id}`, (err, response) => {
      if(err){
        console.log(err);
        return;
      }
      this.setState({loading: false, address: response.listing.property.address, unit: response.listing.unit, rent: response.listing.rent, deposit: response.listing.deposit, first_name: response.applicant.first_name, last_name: response.applicant.last_name, begins: moment(response.listing.available) })
    })
  }
  setStartDate(day){
    this.setState({begins: day})
  }
  setEndDate(day){
    this.setState({ends: day})
  }
  handleInputChange(event){
    this.setState({[event.target.name]: event.target.value})
  }
  handleRadioChange(event){
    let bool = event.target.value == "0" ? false : true
    this.setState({hasEndDate: bool})
  }
  handleSubmit(e){
    e.preventDefault();
    const errors = this.validateFields();
    const noErrors = Object.keys(errors).every(i => !errors[i])
    if(noErrors){
      let { begins, ends, rent, deposit, hasEndDate } = this.state;
      var endDate = hasEndDate ? ends : null;
      let body = JSON.stringify({
        begins: this.state.begins,
        ends: endDate,
        rent: rent,
        deposit: deposit,
        application: this.props.match.params.id
      });
      APIManager.create(`/m/lease`, body, (err, response) => {
        if(err){
          console.log(err);
          return;
        }
        this.props.history.push('/m/payments');
      })
    } else {
      this.setState({errors: errors})
    }
  }
  validateFields(){
    let { rent, deposit, begins, ends, hasEndDate } = this.state;
    const errors = {};
    errors.rent = !rent ? true : false;
    errors.deposit = !deposit ? true : false;
    errors.begins = !begins ? true : false;
    errors.ends = (hasEndDate && !ends) ? true : false;
    return errors;
  }
  render(){
    let { loading, address, unit, begins, hasEndDate, ends, rent, deposit, first_name, last_name, errors } = this.state;
    let label = first_name.charAt(0) + last_name.charAt(0);
    if(!loading){
      return(
        <div>
          <Subheader
            title={
              <span>
                <p>NEW LEASE AGREEMENT FOR</p>
                <h4>{address}, Unit {unit}</h4>
              </span>
            }
            button={
                <Link to={`/m/applications/${this.props.match.params.id}`}>
                  <BorderButton
                    width="109px"
                    height="35px"
                    font="13px"
                  >
                    Cancel setup
                  </BorderButton>
                </Link>
            }
          />
          <div className={styles.applicantContainer}>
            <div className={styles.applicants}>
              <h5>Applicants:</h5>
              <div className={styles.applicant}><div className={styles.avatar}>{label}</div>{first_name} {last_name} </div>
            </div>
          </div>
          <div className={styles.leaseContainer}>
            <Card>
              <form onSubmit={this.handleSubmit} className={styles.padding}>
                <h4>Lease Info</h4>
                <div className={styles.rent}>
                  <Input name="rent" label="rent" value={rent} hasError={errors["rent"]} onChange={this.handleInputChange} />
                  <Input name="deposit" label="deposit" value={deposit} hasError={errors["deposit"]} onChange={this.handleInputChange} />
                </div>
                <label className={styles.radio}>
                  Month-to-month: <span className={styles.faded}>There's no set end date, but you can stop collecting payments at any time</span>
                  <input
                    value="0"
                    type="radio"
                    checked={!hasEndDate}
                    onChange={this.handleRadioChange} />
                    <span className={styles.checkmark}></span>
                </label>
                <label className={styles.radio}>
                  Fixed Term: <span className={styles.faded}>Rent collection will end after a specific date</span>
                  <input
                    value="1"
                    type="radio"
                    checked={hasEndDate}
                    onChange={this.handleRadioChange} />
                    <span className={styles.checkmark}></span>
                </label>
                <div className={styles.row}>
                  <span>
                    <label>START DATE</label>
                    <DatePicker
                      selected={begins}
                      onChange={this.setStartDate}
                      placeholderText="MM/DD/YYYY"
                    />
                    {errors["begins"] && <div className={styles.error}>You must enter a start date</div>}
                  </span>
                  {hasEndDate &&
                    <span>
                      <label>END DATE</label>
                      <DatePicker
                        selected={ends}
                        onChange={this.setEndDate}
                        placeholderText="MM/DD/YYYY"
                      />
                      {errors["ends"] && <div className={styles.error}>You must enter an end date</div>}
                    </span>
                  }
                </div>
                <button style={{display: 'none'}} type="submit" />
                <FilledButton
                  width="100%"
                  height="35px"
                  font="13px"
                  onClick={this.handleSubmit}
                >
                  Submit
                </FilledButton>
              </form>
            </Card>
          </div>
        </div>
      );
    } else {
      return(
        <LoadSpinner />
      );
    }
  }
}

export default LeaseForm;
