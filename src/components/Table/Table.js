import React from 'react';

import Card from 'components/Card/Card';
import CardHeader from 'components/CardHeader/CardHeader';

import styles from './Table.css';

const Table = ({title, active, children}) => {
  if(items && items.length > 0)
  return(
    <div className={styles.container}>
      <Card>
        <CardHeader color={active ? "#55B475" : "#78909C"}>
          <span className={styles.title}>{title}</span>
        </CardHeader>
        {children}
      </Card>
    </div>
  )
  return null;
}

export default Table;
