import React from 'react';

import APIManager from 'utils/APIManager.js';
import FilledButton from 'components/FilledButton/FilledButton.js';
import CommentItem from 'components/CommentItem/CommentItem.js';

import styles from './Comments.css';

class Comments extends React.Component {
  constructor(){
    super();
    this.state = {
      value: '',
      isCommenting: false
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleInput = this.toggleInput.bind(this);
  }
  handleInputChange(event) {
    this.setState({
      value: event.target.value
    });
  }
  handleSubmit(e){
    if(this.state.value.length > 0){
      e.preventDefault();
      const { user, ticket, addComment, app } = this.props;
      let body = JSON.stringify({
        author: {id: user.id, label: user.first_name[0]+user.last_name[0]},
        content: this.state.value
      })
      APIManager.create(`/${app}/tickets/${ticket}/comments`, body, (err, response) => {
        if(err){
          console.log(err);
          return;
        }
        addComment(response);
        this.setState({isCommenting: false});
      })
    }
  }
  toggleInput(){
    this.setState({isCommenting: true})
  }
  render(){
    const { value, isCommenting } = this.state;
    return(
      <div>
        {this.props.comments.length > 0 ?
          <div>
            {this.props.comments.map(comment =>
              <CommentItem key={comment._id} user={this.props.user.id} comment={comment} />
            )}
          </div>
        :
          <p className={styles.noComments}>No comments</p>
        }
        {isCommenting ?
          <form className={styles.commentBar} onSubmit={this.handleSubmit}>
            <input autoFocus type="text" value={value} onChange={this.handleInputChange} />
            <button style={{display: 'none'}} type="submit" />
            <FilledButton
              height="35px"
              width="90px"
              font="13px"
              onClick={this.handleSubmit}
            >
              Submit
            </FilledButton>
          </form>
        :
          <div className={styles.add}><span className={styles.link} onClick={this.toggleInput}>Add comment</span></div>
        }
      </div>
    )
  }
}

export default Comments;
