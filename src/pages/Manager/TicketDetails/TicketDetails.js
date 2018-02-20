import React from 'react';
import { Link } from 'react-router-dom';

import DatePicker from 'react-datepicker';
import moment from 'moment';
import formatDate from 'utils/DateFormatter/DateFormatter.js';
import APIManager from 'utils/APIManager.js';
import LoadSpinner from 'components/LoadSpinner/LoadSpinner.js';
import Subheader from 'components/Subheader/Subheader.js';
import BorderButton from 'components/BorderButton/BorderButton.js';
import Card from 'components/Card/Card.js';
import Comments from 'components/Comments/Comments.js';
import Toggle from 'components/Toggle/Toggle.js';

import styles from './TicketDetails.css';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

class TicketDetails extends React.Component {
  constructor(){
    super();
    this.state = {
      loading: true,
      ticket: null,
      comments: null,
      appointment: '',
      showDatePicker: false,
      open: false
    }
    this.addComment = this.addComment.bind(this);
    this.openDatePicker = this.openDatePicker.bind(this);
    this.setAppointment = this.setAppointment.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  }
  componentDidMount(){
    APIManager.get(`/m/tickets/${this.props.match.params.id}`, (err, response) => {
      if(err){
        console.log(err);
        return;
      }
      this.setState({ticket: response, comments: response.comments, appointment: response.appointment, open: response.open, loading: false})
    })
  }
  addComment(comment){
    const newComments = [...this.state.comments, comment];
    this.setState({comments: newComments})
  }
  setAppointment(day){
    this.setState({appointment: day, showDatePicker: false})
    let body = JSON.stringify({
      appointment: day
    })
    APIManager.update(`/m/tickets/${this.props.match.params.id}`, body, err => {
      if(err){
        console.log(err);
        return;
      }
    })
  }
  openDatePicker(){
    this.setState({showDatePicker: true})
  }
  handleToggle(){
    let status = !this.state.open
    this.setState({open: status})
    let body = JSON.stringify({
      open: status
    })
    APIManager.update(`/m/tickets/${this.props.match.params.id}`, body, err => {
      if(err){
        console.log(err);
        return;
      }
    })
  }
  render(){
    const { ticket, comments, appointment, showDatePicker, open, loading } = this.state;

    if(loading)
    return(
      <LoadSpinner />
    )

    else {
      const created = formatDate(ticket.createdAt, true);
      const label = ticket.lease.tenant.first_name.charAt(0) + ticket.lease.tenant.last_name.charAt(0);
      return(
        <div>
          <Subheader
            title={
              <div>
                <Link to="/m/maintenance" className={styles.back}>ALL TICKETS</Link>
                <h2>{ticket.title}</h2>
              </div>
            }
            button={
              <Toggle isToggled={open} handleToggle={this.handleToggle}/>
            }
          />
          <div className={styles.leaseContainer}>
            <div className={styles.lease}>
              <div className={styles.row}>
                <h5>Tenants:</h5>
                <div className={styles.tenant}>
                  <div className={styles.avatar}>
                    {label}
                  </div>
                  {ticket.lease.tenant.first_name} {ticket.lease.tenant.last_name}
                </div>
              </div>
              <div className={styles.row}>
                <h5>Address:</h5>
                <span>&nbsp;{ticket.lease.listing.property.address}, Unit {ticket.lease.listing.unit}</span>
              </div>
              <div>
                {appointment &&
                  <div className={styles.row}>
                    <h5>Appointment:</h5>
                    <span>&nbsp;{formatDate(appointment)}</span>
                  </div>
                }
              </div>
              {showDatePicker &&
                <DatePicker
                  inline
                  selected={appointment}
                  onChange={this.setAppointment}
                />
              }
              <BorderButton
                height="30px"
                width="100%"
                font="13px"
                onClick={this.openDatePicker}
              >
                {appointment ? "Change appointment date" : "Schedule an appointment"}
              </BorderButton>
            </div>
          </div>
          <div className={styles.descriptionContainer}>
            <Card>
              <div className={styles.description}>
                <p>{ticket.description}</p>
                <div className={styles.row}>
                  <h5>Submitted:</h5>
                  &nbsp;{created}
                </div>
              </div>
              <div className={styles.comments}>
                <Comments user={this.props.user} ticket={ticket._id} comments={comments} addComment={this.addComment} app="m" />
              </div>
            </Card>
          </div>
        </div>
      );
    }
  }
}

export default TicketDetails;
