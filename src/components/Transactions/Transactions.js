import React from 'react';

import Card from 'components/Card/Card';
import CardHeader from 'components/CardHeader/CardHeader';
import TransactionModal from 'components/TransactionModal/TransactionModal';
import FilledButton from 'components/FilledButton/FilledButton';
import TransactionItem from 'components/TransactionItem/TransactionItem';

import styles from './Transactions.css';

const Transactions = ({transactions, balance, rent, tenant, lease, addTransaction }) => {
  const activeTransactions = transactions.filter(transaction =>
    new Date(transaction.date) >= Date.now()
  )
  const completedTransactions = transactions.filter(transaction =>
    new Date(transaction.date) < Date.now()
  )
  return(
    <div>
      <div className={styles.tile}>
        <Card>
          <div className={styles.detailsContainer}>
            <h1>Balance:</h1>
            <div className={styles.green}>${balance}</div>
            <TransactionModal lease={lease} addTransaction={addTransaction}>
              {(openCreditModal, openBillModal) =>
                <div className={styles.buttons}>
                  <span className={styles.greyBtn} onClick={openCreditModal}>
                    Add a Credit
                  </span>
                  <FilledButton
                    height="93%"
                    width="110px"
                    font="13px"
                    onClick={openBillModal}
                  >
                    Add a Bill
                  </FilledButton>
                </div>
              }
            </TransactionModal>
          </div>
          <div className={styles.secondaryContainer}>
            <ul>
              <li>
                <h5>Current Tenants:</h5>
                <span> {tenant.first_name} {tenant.last_name}</span>
              </li>
              <li>
                <h5>Recurring Rent:</h5>
                <span> ${rent}</span>
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

export default Transactions;
