import React from 'react';
import { Link } from 'react-router-dom';

import { getRequest, updateRequest } from 'utils/APIManager';
import Subheader from 'components/Subheader/Subheader';
import FilledButton from 'components/FilledButton/FilledButton';
import Filter from 'components/Filter/Filter';
import Table from 'components/Table/Table';
import ApplicationItem from 'components/ApplicationItem/ApplicationItem';
import Circle from 'components/Circle/Circle';
import LoadSpinner from 'components/LoadSpinner/LoadSpinner';

import styles from './Applications.css';

class Applications extends React.Component {
  constructor(){
    super();
    this.state = {
      applications: [],
      loading: true
    }
    this.toggleArchive = this.toggleArchive.bind(this);
  }
  componentDidMount(){
    getRequest(`/m/managers/${this.props.manager}/applications`, (err,response) => {
      if(err){
        console.log(err);
        return;
      }
      this.setState({applications: response, loading: false})
    })
  }
  toggleArchive(id, archived){
    let { applications } = this.state;
    let newArray = applications.slice();
    let appIndex = applications.findIndex((app => app._id == id));
    newArray[appIndex].archived = !archived;
    this.setState({applications: newArray})
    let body = {
      archived: !archived
    };

    updateRequest(`/m/applications/${id}`, body, (err, response) => {
      if(err){
        console.log(err);
        this.setState({applications: applications})
        return;
      }
    })
  }
  render(){
    let { applications, loading } = this.state;
    if(applications.length > 0){
      return(
        <div>
          <Subheader
            title={<h2>Applications</h2>}
          />
            <Filter
              items={applications}
              itemKeys={["applicant.name","listing.property.address"]}
              placeholder="Find by name or address"
              name="Applications"
            >
              {filteredApplications => {
                const openApplications = filteredApplications.filter(application =>
                  !application.archived
                );
                const archivedApplications = filteredApplications.filter(application =>
                  application.archived
                );
                return(
                  <div>
                    {openApplications.length > 0 &&
                      <Table
                        active
                        title="Recent"
                      >
                        {openApplications.map(application =>
                          <ApplicationItem key={application._id} application={application} location={application.listing.property.address} toggleArchive={this.toggleArchive} />
                        )}
                      </Table>
                    }
                    {archivedApplications.length > 0 &&
                      <Table
                        title="Archived"
                      >
                        {archivedApplications.map(application =>
                          <ApplicationItem key={application._id} application={application} location={application.listing.property.address} toggleArchive={this.toggleArchive} />
                        )}
                      </Table>
                    }
                  </div>
                );
              }}
            </Filter>
        </div>
      );
    }
    else if(loading){
      return(
        <LoadSpinner />
      );
    } else {
      return(
        <div className={styles.noApplications}>
          <Circle>
            <svg height="50" width="50" viewBox="0 0 24 24">
              <path fill="#FF6B6B" d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-5 3c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm4 8h-8v-1c0-1.33 2.67-2 4-2s4 .67 4 2v1z"></path>
            </svg>
          </Circle>
          <h1>You haven't recieved any applications yet</h1>
          <p>Share your listings for tenants to apply.</p>
          <Link className={styles.createBtn} to="/m/listings">
            <FilledButton
              width="100%"
              height="48px"
              font="14px"
            >
              View listings
            </FilledButton>
          </Link>
        </div>
      );
    }
  }
}

export default Applications;
