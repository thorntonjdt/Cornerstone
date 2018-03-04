import React from 'react';
import { Link } from 'react-router-dom';

import LoadList from 'components/LoadList/LoadList';
import Filter from 'components/Filter/Filter';
import Table from 'components/Table/Table';
import ListingItem from 'components/ListingItem/ListingItem';
import BorderButton from 'components/BorderButton/BorderButton';
import FilledButton from 'components/FilledButton/FilledButton';
import Circle from 'components/Circle/Circle';

import styles from './Listings.css';

const Listings = ({property}) => (
  <LoadList url={`/m/properties/${property}/listings`}>
    {listings => {

        if(listings.length > 0)
        return(
          <Filter
            items={listings}
            itemKeys={["unit"]}
            placeholder="Find by unit number"
            name="Listings"
          >
            {filteredListings => {
              const activeListings = filteredListings.filter(listing =>
                listing.active
              );
              const inactiveListings = filteredListings.filter(listing =>
                !listing.active
              );
              return(
                <div>
                  {activeListings.length > 0 &&
                    <Table
                      active
                      title="Active Listings"
                    >
                      {activeListings.map(listing =>
                        <ListingItem key={listing._id} listing={listing} location={"Unit "+listing.unit} />
                      )}
                    </Table>
                  }
                  {inactiveListings.length > 0 &&
                    <Table
                      title="Inactive Listings"
                    >
                      {inactiveListings.map(listing =>
                        <ListingItem key={listing._id} listing={listing} location={"Unit "+listing.unit} />
                      )}
                    </Table>
                  }
                  <Link to={{pathname: `/m/listings/new`, state: {propertyId: property}}} className={styles.createBtn}>
                    <BorderButton
                      width="150px"
                      height="35px"
                      font="13px"
                    >
                      Create a listing
                    </BorderButton>
                  </Link>
                </div>
              )
            }}
          </Filter>
        )

        else
        return(
          <div className={styles.center}>
            <Circle>
              <svg height="45" width="45" viewBox="0 0 24 24">
                <path fill="#FFA300" d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"></path>
              </svg>
            </Circle>
            <h1>Find qualified tenants</h1>
            <p>Create listings for applicants to see.</p>
            <Link className={styles.addBtn} to={{pathname:`/m/listings/new`, state: { propertyId: property }}}>
              <FilledButton
                width="100%"
                height="48px"
                font="14px"
              >
                Create a listing
              </FilledButton>
            </Link>
          </div>
        )
    }}
  </LoadList>
)

export default Listings;
