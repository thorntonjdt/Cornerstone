import React from 'react';

import Filter from 'components/Filter/Filter';
import Table from 'components/Table/Table';
import ApplicationItem from 'components/ApplicationItem/ApplicationItem';

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
            <Table
              active
              title="Recent"
            >
              {openApplications.map(application =>
                <ApplicationItem key={application._id} application={application} location={"Unit "+application.listing.unit} toggleArchive={toggleArchive} />
              )}
            </Table>
          }
          {archivedApplications.length > 0 &&
            <Table
              title="Archived"
            >
              {archivedApplications.map(application =>
                <ApplicationItem key={application._id} application={application} location={"Unit "+application.listing.unit} toggleArchive={toggleArchive} />
              )}
            </Table>
          }
        </div>
      );
    }}
  </Filter>
)

export default Applications;
