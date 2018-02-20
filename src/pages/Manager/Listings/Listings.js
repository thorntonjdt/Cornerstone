import React from 'react';
import { Link } from 'react-router-dom';

import Subheader from 'components/Subheader/Subheader.js';
import LoadList from 'components/LoadList/LoadList.js';
import FilledButton from 'components/FilledButton/FilledButton.js';
import Filter from 'components/Filter/Filter.js';
import Card from 'components/Card/Card.js';
import CardHeader from 'components/CardHeader/CardHeader.js';
import ListingItem from 'components/ListingItem/ListingItem.js';
import Circle from 'components/Circle/Circle.js';

import styles from './Listings.css';

const Listings = ({manager}) => (
  <LoadList url={`/m/managers/${manager}/listings`}>
    {listings => {

      if(listings.length > 0)
      return(
        <div>
          <Subheader
            title={<h2>Listings</h2>}
            button={
              <Link to="/m/listings/choose-property" >
                <FilledButton
                  width="110px"
                  height="35px"
                  font="11px"
                >
                  New Listing
                </FilledButton>
              </Link>
            }
          />
          <Filter
            items={listings}
            itemKeys={["property.address"]}
            placeholder="Find by address"
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
                    <Card>
                      <CardHeader color="#55B475">
                        <span className={styles.title}>Active Listings</span>
                      </CardHeader>
                      {activeListings.map(listing =>
                        <ListingItem key={listing._id} listing={listing} location={listing.property.address} />
                      )}
                    </Card>
                  }
                  {inactiveListings.length > 0 &&
                    <Card>
                      <CardHeader color="#78909C">
                        <span className={styles.title}>Inactive Listings</span>
                      </CardHeader>
                      {inactiveListings.map(listing =>
                        <ListingItem key={listing._id} listing={listing} location={listing.property.address} />
                      )}
                    </Card>
                  }
                </div>
              )
            }}
          </Filter>
        </div>
      )

      else
      return(
        <div className={styles.noListings}>
          <Circle>
            <svg height="45" width="45" viewBox="0 0 24 24">
              <path fill="#FFA300" d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"></path>
            </svg>
          </Circle>
          <h1>No Listings</h1>
          <p>Find qualified tenants by creating listings for your properties.</p>
          <Link className={styles.createBtn} to="/m/listings/choose-property" >
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
);

export default Listings;
