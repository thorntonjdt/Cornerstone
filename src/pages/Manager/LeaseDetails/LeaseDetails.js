import React from 'react';
import { Link } from 'react-router-dom';

import formatDate from 'utils/DateFormatter';
import { getRequest } from 'utils/APIManager';
import LoadSpinner from 'components/LoadSpinner/LoadSpinner';
import Tabs from 'components/Tabs/Tabs';
import Tab from 'components/Tab/Tab';
import Transactions from 'components/Transactions/Transactions';
import Rental from 'components/Rental/Rental';

import styles from './LeaseDetails.css';

class LeaseDetails extends React.Component {
  constructor(){
    super();
    this.state = {
      lease: {},
      transactions: [],
      loading: true
    }
    this.addTransaction = this.addTransaction.bind(this);
  }
  componentDidMount(){
    getRequest(`/m/leases/${this.props.match.params.id}`, (err, response) => {
      if(err){
        console.log(err);
        return;
      }
      this.setState({lease: response, transactions: response.transactions, loading: false})
    })
  }
  addTransaction(transaction){
    var startOfDay = new Date(transaction.date);
    startOfDay.setHours(0,0,0,0);
    var newLease = this.state.lease;
    if(startOfDay <= Date.now()){
      var balance = (+this.state.lease.balance) + (+transaction.amount);
      transaction.balance = balance;
      newLease = {...this.state.lease}
      newLease.balance = balance;
    }
    const newTransactions = [...this.state.transactions, transaction];
    this.setState({transactions: newTransactions, lease: newLease})
  }
  render(){
    const { lease, transactions, loading } = this.state;
    if(!loading){
      var dateSpan = formatDate(lease.begins);
      if(lease.ends){
        dateSpan += " - "+formatDate(lease.ends);
      }
      return(
        <div>
          <div className={styles.header}>
            <div className={styles.nav}><Link to="/m/payments" className={styles.link}>payments</Link> / {lease.listing.property.address}, Unit {lease.listing.unit}</div>
            <h2>{dateSpan}</h2>
          </div>
          <Tabs active={this.props.location.state.page}>
            <Tab text="Transactions">
              <div className={styles.pagePadding}>
                <Transactions lease={lease._id} balance={lease.balance} rent={lease.rent} tenant={lease.tenant} transactions={transactions} addTransaction={this.addTransaction} />
              </div>
            </Tab>
            <Tab text="Rental Details">
              <Rental rent={lease.rent} listing={lease.listing} />
            </Tab>
          </Tabs>
        </div>
      );
    } else {
      return(
        <LoadSpinner />
      )
    }
  }
}

export default LeaseDetails;
