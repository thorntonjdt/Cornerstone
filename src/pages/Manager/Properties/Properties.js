import React from 'react';
import { Link } from 'react-router-dom';

import Subheader from 'components/Subheader/Subheader';
import FilledButton from 'components/FilledButton/FilledButton.js';
import Filter from 'components/Filter/Filter.js';
import LoadList from 'components/LoadList/LoadList.js';
import PropertyItem from 'components/PropertyItem/PropertyItem';
import Circle from 'components/Circle/Circle.js';

import styles from './Properties.css';

const Properties = ({manager}) => (
  <LoadList url={`/m/managers/${manager}/properties`} >
    {properties => {

      if(properties.length > 0)
      return(
        <div>
          <Subheader
            title={<h2>Properties</h2>}
            button={
              <Link to="/m/properties/new">
                <FilledButton
                  width="110px"
                  height="35px"
                  font="13px"
                >
                  New Property
                </FilledButton>
              </Link>
            }
          />
          <Filter
            items={properties}
            itemKeys={["address", "city"]}
            placeholder="Find by address or city"
            name="Properties"
          >
            {filteredProperties =>
              <div>
                {filteredProperties.map(property =>
                  <PropertyItem key={property._id} property={property} />
                )}
              </div>
            }
          </Filter>
        </div>
      )

      else
      return (
        <div className={styles.placeholder}>
          <Circle>
            <svg height="60" width="60"  viewBox="0 0 24 24">
              <path fill="#00A19A" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path>
            </svg>
          </Circle>
          <h1>Add Properties</h1>
          <p>Add a property to start collecting rent, market a vacancy, or collect applications.</p>
          <Link className={styles.addBtn} to="/m/properties/new">
            <FilledButton
              width="100%"
              height="48px"
              font="14px"
            >
              Add a property
            </FilledButton>
          </Link>
        </div>
      )
    }}
  </LoadList>
);

export default Properties;
