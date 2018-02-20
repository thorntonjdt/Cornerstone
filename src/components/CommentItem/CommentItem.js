import React from 'react';

import formatDate from 'utils/DateFormatter/DateFormatter.js';

import styles from './CommentItem.css';

const CommentItem = ({comment, user}) => {
  const side = comment.author.id == user ? 'right' : 'left';
  const end = comment.author.id == user ? 'row-reverse' : 'row'
  return(
    <div style={{flexDirection: end}} className={styles.container}>
      <span className={styles.avatar}>
        {comment.author.label}
      </span>
      <span>
        <div className={styles.message}>{comment.content}</div>
        <div style={{textAlign: side}} className={styles.submitted}>{formatDate(comment.createdAt, true)}</div>
      </span>
    </div>
  )
}

export default CommentItem;
