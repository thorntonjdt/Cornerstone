import React from 'react';
import { Link } from 'react-router-dom';

import LoadList from 'components/LoadList/LoadList';
import Subheader from 'components/Subheader/Subheader';
import Card from 'components/Card/Card';
import TApplicationItem from 'components/TApplicationItem/TApplicationItem';
import Circle from 'components/Circle/Circle';

import styles from './Applications.css';

const Applications = ({tenant}) => (
  <LoadList url={`/t/tenants/${tenant}/applications`}>
    {applications => {
      if(applications.length > 0)
      return(
        <div>
          <Subheader title={<h2>Applications</h2>} />
          <div className={styles.content}>
            <Card>
              {applications.map(application =>
                <TApplicationItem key={application._id} application={application} />
              )}
            </Card>
          </div>
        </div>
      )

      else
      return(
        <div className={styles.noApplications}>
          <Circle>
            <svg height="50" width="50" viewBox="0 0 24 24">
              <path fill="#FF6B6B" d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-5 3c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm4 8h-8v-1c0-1.33 2.67-2 4-2s4 .67 4 2v1z"></path>
            </svg>
          </Circle>
          <h1>You have no applications</h1>
          <p>Your applications will appear here. If you're looking for a new place to live take a look at our listings. <Link to='/listings'>Find a place near you.</Link></p>
        </div>
      )
    }}
  </LoadList>
)

export default Applications;
