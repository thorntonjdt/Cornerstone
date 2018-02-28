import React from 'react';
import { Link } from 'react-router-dom';

import { getRequest } from 'utils/APIManager';
import formatDate from 'utils/DateFormatter';
import LoadSpinner from 'components/LoadSpinner/LoadSpinner';
import Tabs from 'components/Tabs/Tabs';
import Tab from 'components/Tab/Tab';
import TenantTransactions from 'components/TenantTransactions/TenantTransactions';
import Circle from 'components/Circle/Circle';
import FilledButton from 'components/FilledButton/FilledButton';
import Rental from 'components/Rental/Rental';

import styles from './Payments.css';

class Payments extends React.Component {
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
    getRequest(`/t/tenants/${this.props.tenant}/leases`, (err, response) => {
      if(err){
        console.log(err);
        return;
      }
      this.setState({lease: response, transactions: response.transactions, loading: false})
    })
  }
  addTransaction(transaction){
    transaction.date = Date.now();
    var balance = (+this.state.lease.balance) + (+transaction.amount);
    var newLease = {...this.state.lease};
    transaction.balance = balance;
    newLease.balance = balance;
    const newTransactions = [...this.state.transactions, transaction];
    this.setState({transactions: newTransactions, lease: newLease})
  }
  render(){
    const { loading, lease, transactions } = this.state;
    if(loading)
    return(
      <LoadSpinner />
    )

    else if(lease){
      var dateSpan = formatDate(lease.begins);
      if(lease.ends){
        dateSpan += " - "+formatDate(lease.ends);
      }
      return(
        <div>
          <div className={styles.header}>
            <div className={styles.nav}>{lease.listing.property.address}, Unit {lease.listing.unit}</div>
            <h2>{dateSpan}</h2>
          </div>
          <Tabs active={0}>
            <Tab text="Transactions">
              <div className={styles.pagePadding}>
                <TenantTransactions lease={lease} transactions={transactions} addTransaction={this.addTransaction} />
              </div>
            </Tab>
            <Tab text="Rental Details">
              <Rental rent={lease.rent} listing={lease.listing} />
            </Tab>
          </Tabs>
        </div>
      )
    }

    else
    return(
      <div className={styles.placeholder}>
        <Circle>
          <svg width="40" height="40" viewBox="0 0 32 32">
            <path fill="#40C057" d="M29 4h-9c0-2.209-1.791-4-4-4s-4 1.791-4 4h-9c-0.552 0-1 0.448-1 1v26c0 0.552 0.448 1 1 1h26c0.552 0 1-0.448 1-1v-26c0-0.552-0.448-1-1-1zM16 2c1.105 0 2 0.895 2 2s-0.895 2-2 2c-1.105 0-2-0.895-2-2s0.895-2 2-2zM28 30h-24v-24h4v3c0 0.552 0.448 1 1 1h14c0.552 0 1-0.448 1-1v-3h4v24z"></path>
            <path fill="#40C057" d="M14 26.828l-6.414-7.414 1.828-1.828 4.586 3.586 8.586-7.586 1.829 1.828z"></path>
          </svg>
        </Circle>
        <h1>You do not have a rental agreement</h1>
        <p>Start applying to properties</p>
        <Link className={styles.addBtn} to="/search">
          <FilledButton
            width="100%"
            height="48px"
            font="14px"
          >
            Find properties
          </FilledButton>
        </Link>
      </div>
    )
  }
}

export default Payments;
