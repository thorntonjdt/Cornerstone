import React from 'react';
import { Link } from 'react-router-dom';

import APIManager from 'utils/APIManager.js';
import formatDate from 'utils/DateFormatter/DateFormatter.js';
import Subheader from 'components/Subheader/Subheader.js';
import Card from 'components/Card/Card.js';
import FilledButton from 'components/FilledButton/FilledButton.js';
import LoadSpinner from 'components/LoadSpinner/LoadSpinner.js';

import styles from './Application.css';

class Application extends React.Component {
  constructor(){
    super();
    this.state = {
      first_name: '',
      last_name: '',
      created: '',
      address: '',
      unit: '',
      phone: '',
      email: '',
      userId: '',
      loading: true
    }
  }
  componentDidMount(){
    APIManager.getById(this.props.match.url, (err, response) => {
      if(err){
        console.log(err);
        return;
      }
      let { first_name, last_name, _id, phone, email } = response.applicant;
      let { unit, property } = response.listing;
      this.setState({loading: false, first_name: first_name, last_name: last_name, created: response.createdAt, userId: _id, phone: phone, email: email, unit: unit, address: property.address });
    })
  }
  render(){
    let { loading, first_name, last_name, created, userId, unit, address, phone, email } = this.state;
    let date = formatDate(created, true);
    let label = first_name.charAt(0) + last_name.charAt(0);
    if(!loading){
      return(
        <div>
          <Subheader
            title={
              <span>
                <div>
                  <Link to="/m/applications" className={styles.back}>ALL APPLICATIONS</Link>
                  <span className={styles.address}> / {address}, Unit {unit}</span>
                </div>
                <h2>Applicant Overview</h2>
              </span>
            }
          />
          <div className={styles.submission}>
            <p>Submitted {date}</p>
            <Link to={`/m/leases/new/${this.props.match.params.id}`} className={styles.collectBtn}>
              <FilledButton
                width="150px"
                height="35px"
                font="13px"
              >
                Start Collecting Rent
              </FilledButton>
            </Link>
          </div>
          <div className={styles.profile}>
            <Card>
              <div className={styles.padding}>
                <div className={styles.row}>
                  <div>
                    <h4>{first_name} {last_name}</h4>
                    <span>{email}</span>
                    <div>{phone}</div>
                  </div>
                  <div className={styles.avatar}>{label}</div>
                </div>
              </div>
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

export default Application;
