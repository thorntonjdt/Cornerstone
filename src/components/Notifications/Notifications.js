import React from 'react';
import io from 'socket.io-client';

import { getRequest, deleteRequest } from 'utils/APIManager';
import NotificationItem from 'components/NotificationItem/NotificationItem';
import Dropdown from 'components/Dropdown/Dropdown';
import BorderButton from 'components/BorderButton/BorderButton';

import styles from './Notifications.css';

class Notifications extends React.Component {
  constructor({user}){
    super({user});
    this.state = {
      notifications: []
    }
    this.removeNotification = this.removeNotification.bind(this);
    this.clearNotifications = this.clearNotifications.bind(this);
    this.followNotificationLink = this.followNotificationLink.bind(this);
    this.app = user.manager ? 'm' : 't';
    this.id = user.manager ? user.manager : user.tenant;
  }
  componentDidMount(){
    getRequest(`/${this.app}/users/${this.id}/notifications`, (err, response) => {
      if(err){
        console.log(err);
        return;
      }
      this.setState({notifications: response})
    })
    const socket = io({query: {room: this.id}});
    socket.on("newNotification", (msg) => {
      if(Notification.permission === "granted"){
        var notification = new Notification(msg.content)
      }
      this.setState({notifications: [...this.state.notifications, msg]});
    });
    if(window.Notification){
      Notification.requestPermission();
    }
  }
  removeNotification(date){
    const { notifications } = this.state;
    deleteRequest(`/${this.app}/users/${this.id}/notifications/${date}`, err => {
      if(err){
        console.log(err);
        return;
      }
      var newArray = [...this.state.notifications]
      for(var i = 0; i < notifications.length; i++){
        if(notifications[i].date == date){
          newArray.splice(i, 1);
        }
      }
      this.setState({notifications: newArray});
    })
  }
  followNotificationLink(link){
    this.props.history.push(link);
  }
  clearNotifications(){
    deleteRequest(`/${this.app}/users/${this.id}/notifications`, err => {
      if(err){
        console.log(err);
        return;
      }
      this.setState({notifications: []});
    })
  }
  render(){
    let { notifications } = this.state;
    var onHover = styles.link+' '+styles.border;
    var dropdown = styles.notificationsDropdown+' '+styles.margin;
    var alert = styles.alert+' '+styles.white;
    if(this.props.location[1] == 'm' || this.props.location[1] == 't'){
      onHover = styles.link+' '+styles.background;
      dropdown = styles.notificationsDropdown
      alert = styles.alert+' '+styles.black;
    }
    return(
      <Dropdown
        hoverStyle={onHover}
        positioning={styles.notificationPosition}
        button={
          <span className={styles.notifications}>
            <svg width="28" height="28" viewBox="0 0 24 24">
              <path fill="#AAB1AE" d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"></path>
            </svg>
            {notifications.length > 0 && <span className={alert}></span>}
          </span>
        }
      >
        <div className={dropdown}>
          <div className={styles.notificationsHeader}>
            <h3>Notifications</h3>
            {notifications.length > 0 &&
              <BorderButton
                height="26px"
                width="74px"
                font="12px"
                onClick={this.clearNotifications}
              >
                Clear all
              </BorderButton>
            }
          </div>
          {notifications.length > 0 ?
            <div>
              {notifications.map(notification =>
                <NotificationItem key={notification.date} notification={notification} follow={this.followNotificationLink} close={this.removeNotification} />
              )}
            </div>
          :
            <div className={styles.center}>
              <div>
                <svg width="125" height="125" viewBox="0 0 24 24">
                  <path fill="#d3d3d3" d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"></path>
                </svg>
                <div>No notifications to show.</div>
              </div>
            </div>
          }
        </div>
      </Dropdown>
    );
  }
}

export default Notifications;
