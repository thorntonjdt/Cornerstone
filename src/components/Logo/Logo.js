import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({to}) => (
  <Link to={to} className='logo'>
    <span className='title'>Humbug</span>
  </Link>
);

export default Logo;
