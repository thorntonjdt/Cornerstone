import React from 'react';
import get from 'lodash/get';

import styles from './Filter.css';

class Filter extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      value: '',
      filteredItems: props.items
    }
    this.filter = this.filter.bind(this);
  }
  filter(e){
    let { value } = e.target;
    let { items, itemKeys } = this.props;
    let updatedItems;
    if(value != ''){
      let lowerCaseValue = value.toLowerCase();
      updatedItems = items.filter(item =>
        itemKeys.some(key => get(item, key).toString().toLowerCase().indexOf(lowerCaseValue) !== -1)
      );
    } else {
      updatedItems = items;
    }
    this.setState({filteredItems: updatedItems, value: value});
  }
  render(){
    let { filteredItems, value } = this.state;
    return(
      <div className={styles.container}>
        <div className={styles.searchBar}>
          <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 63 63">
            <path fill="#AAB1AE" d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
          </svg>
          <input type="text" value={value} onChange={this.filter} placeholder={this.props.placeholder} />
        </div>
        {filteredItems.length > 0 ?
          <div>{this.props.children(filteredItems)}</div>
        :
          <div className={styles.emptySearch}>
            <h3>No {this.props.name} to Show</h3>
            <p>No {this.props.name} match your search. Please update your query and try again.</p>
          </div>
        }
      </div>
    )
  }
}

export default Filter;
