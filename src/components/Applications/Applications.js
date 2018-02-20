import React from 'react';

import Filter from 'components/Filter/Filter.js';
import Card from 'components/Card/Card.js';
import CardHeader from 'components/CardHeader/CardHeader.js';
import ApplicationItem from 'components/ApplicationItem/ApplicationItem.js';

import styles from './Applications.css';

const Applications = ({applications, toggleArchive}) => (
  <Filter
    items={applications}
    itemKeys={["applicant.name","listing.unit"]}
    placeholder="Find by name or unit"
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
            <Card>
              <CardHeader color="#55B475">
                <span className={styles.title}>Recent</span>
              </CardHeader>
              {openApplications.map(application =>
                <ApplicationItem key={application._id} application={application} location={"Unit "+application.listing.unit} toggleArchive={toggleArchive} />
              )}
            </Card>
          }
          {archivedApplications.length > 0 &&
            <Card>
              <CardHeader color="#78909C">
                <span className={styles.title}>Archived</span>
              </CardHeader>
              {archivedApplications.map(application =>
                <ApplicationItem key={application._id} application={application} location={"Unit "+application.listing.unit} toggleArchive={toggleArchive} />
              )}
            </Card>
          }
        </div>
      );
    }}
  </Filter>
)

export default Applications;
