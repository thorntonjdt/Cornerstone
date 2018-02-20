import React from 'react';
import { Link } from 'react-router-dom';

import formatDate from 'utils/DateFormatter/DateFormatter.js';
import APIManager from 'utils/APIManager.js';
import LoadSpinner from 'components/LoadSpinner/LoadSpinner.js';
import Subheader from 'components/Subheader/Subheader.js';
import BorderButton from 'components/BorderButton/BorderButton.js';
import Card from 'components/Card/Card.js';
import Comments from 'components/Comments/Comments.js';

import styles from './TicketDetails.css';

class TicketDetails extends React.Component {
  constructor(){
    super();
    this.state = {
      loading: true,
      ticket: null,
      comments: null,
      appointment: ''
    }
    this.addComment = this.addComment.bind(this);
  }
  componentDidMount(){
    APIManager.get(`/t/tickets/${this.props.match.params.id}`, (err, response) => {
      if(err){
        console.log(err);
        return;
      }
      this.setState({ticket: response, comments: response.comments, appointment: response.appointment, loading: false})
    })
  }
  addComment(comment){
    const newComments = [...this.state.comments, comment];
    this.setState({comments: newComments})
  }

  render(){
    const { ticket, comments, appointment, loading } = this.state;

    if(loading)
    return(
      <LoadSpinner />
    )

    else {
      const created = formatDate(ticket.createdAt, true);
      return(
        <div>
          <Subheader
            title={
              <div>
                <Link to="/m/maintenance" className={styles.back}>ALL TICKETS</Link>
                <h2>{ticket.title}</h2>
              </div>
            }
          />
          <div className={styles.leaseContainer}>
            <div className={styles.lease}>
              {appointment ?
                <div className={styles.row}>
                  <h5>Appointment:</h5>
                  <span>&nbsp;{formatDate(appointment)}</span>
                </div>
              :
                <div>No appointment set</div>
              }
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
                <Comments user={this.props.user} ticket={ticket._id} comments={comments} addComment={this.addComment} app="t" />
              </div>
            </Card>
          </div>
        </div>
      );
    }
  }
}

export default TicketDetails;
