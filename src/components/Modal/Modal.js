import React from 'react';

import Card from 'components/Card/Card';

import styles from './Modal.css';

class Modal extends React.Component {
  constructor(){
    super();
    this.state = {
      modal: false
    }
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }
  openModal(){
    this.setState({modal: true})
  }
  closeModal(e){
    if(!e || e.target === e.currentTarget){
      this.setState({modal: false})
    }
  }
  render(){
    const { modal } = this.state;
    return(
      <div>
        <span onClick={this.openModal}>{this.props.button}</span>
        {modal &&
          <div className={styles.modal} onClick={this.closeModal}>
            <div className={styles.modalContent}>
              <Card>
                <div className={styles.padding}>
                    {this.props.children(this.closeModal)}
                </div>
              </Card>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default Modal;
