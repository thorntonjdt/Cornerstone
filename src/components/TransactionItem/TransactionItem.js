import React from 'react';

import formatDate from 'utils/DateFormatter/DateFormatter.js';

import styles from './TransactionItem.css';

const TransactionItem = ({transaction}) => {
  var date = formatDate(transaction.date);
  var label = transaction.amount < 0 ?
      (<div className={styles.green}>Sent</div>)
      :
      (<div className={styles.yellow}>Due On</div>)

  return(
    <div className={styles.transaction}>
      <span>
        {label}
        <div className={styles.date}>{date}</div>
      </span>
      <span>
        <h4>{transaction.description}</h4>
      </span>
      <span>
        <span className={styles.yellow}>
          {transaction.amount >= 0 ?
            `$${transaction.amount}`
          :
            "-"
          }
        </span>
      </span>
      <span>
        <span className={styles.green}>
          {transaction.amount < 0 ?
            `-$${transaction.amount * -1}`
          :
            "-"
          }
        </span>
      </span>
      <span>
        <p>
          {transaction.balance ?
            "$"+transaction.balance
          :
            "-"
          }
        </p>
      </span>
    </div>
  )
}

export default TransactionItem;
