import React from 'react';

import Card from 'components/Card/Card.js';
import CardHeader from 'components/CardHeader/CardHeader.js';
import Modal from 'components/Modal/Modal.js';
import PaymentForm from 'components/PaymentForm/PaymentForm.js';
import FilledButton from 'components/FilledButton/FilledButton.js';
import TransactionItem from 'components/TransactionItem/TransactionItem.js';

import styles from './TenantTransactions.css';

const TenantTransactions = ({lease }) => {
  const activeTransactions = lease.transactions.filter(transaction =>
    new Date(transaction.date) >= Date.now()
  )
  const completedTransactions = lease.transactions.filter(transaction =>
    new Date(transaction.date) < Date.now()
  )
  return(
    <div>
      <div className={styles.tile}>
        <Card>
          <div className={styles.detailsContainer}>
            <h1>Due Today:</h1>
            <div className={styles.green}>${lease.balance}</div>
            <Modal
              button={
                <FilledButton
                  height="35px"
                  width="110px"
                  font="13px"
                >
                  Make a Payment
                </FilledButton>
              }
            >
              {closeModal =>
                <PaymentForm leaseId={lease._id} closeModal={closeModal}/>
              }
            </Modal>
          </div>
          <div className={styles.secondaryContainer}>
            <ul>
              <li>
                <h5>Recurring Rent:</h5>
                <span> ${lease.rent}</span>
              </li>
            </ul>
          </div>
        </Card>
      </div>
      {activeTransactions.length > 0 &&
        <div className={styles.tile}>
          <Card>
            <CardHeader color="#e3e3e3">
              <h4>Upcoming & In-Progress</h4>
            </CardHeader>
            <div className={styles.transactions}>
              <div className={styles.labels}>
                <p>Status</p>
                <p>Description</p>
                <p>Due</p>
                <p>Payment</p>
                <p>Balance</p>
              </div>
              {activeTransactions.map(transaction =>
                <TransactionItem key={transaction._id} transaction={transaction} />
              )}
            </div>
          </Card>
        </div>
      }
      {completedTransactions.length > 0 &&
        <div className={styles.tile}>
          <Card>
            <CardHeader color='#e3e3e3'>
              <h4>Completed</h4>
            </CardHeader>
            <div className={styles.transactions}>
              <div className={styles.labels}>
                <p>Status</p>
                <p>Description</p>
                <p>Due</p>
                <p>Payment</p>
                <p>Balance</p>
              </div>
              {completedTransactions.map(transaction =>
                <TransactionItem key={transaction._id} transaction={transaction} />
              )}
            </div>
          </Card>
        </div>
      }
    </div>
  )
}

export default TenantTransactions;
