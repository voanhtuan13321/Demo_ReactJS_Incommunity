import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import { adminPath } from '../../../router/router';

const navs = [
  {
    to: adminPath.orderList,
    text: 'Orders',
  },
  {
    to: adminPath.categoryList,
    text: 'Category',
  },
  {
    to: adminPath.productsList,
    text: 'Products',
  },
  {
    to: adminPath.statistical,
    text: 'Statistical',
  },
];

export default function Navbar() {
  const navigate = useNavigate();

  // render the navigation
  const renderNavbar = () => {
    return navs.map((nav, i) => {
      return (
        <li
          className='nav-item'
          key={i}
        >
          <Link
            className='nav-link'
            to={nav.to}
          >
            <i className='fas fa-fw fa-list-check'></i>
            <span>{nav.text}</span>
          </Link>
        </li>
      );
    });
  };

  // handle click on logout button
  const handleLogout = () => {
    window.localStorage.removeItem('idAdmin');
    navigate('/admin/login');
  };

  return (
    <ul className='navbar-nav bg-gradient-primary sidebar sidebar-dark accordion'>
      <div className='sidebar-brand d-flex align-items-center justify-content-center'>
        <div className='sidebar-brand-icon rotate-n-15'>
          <i className='fas fa-laugh-wink'></i>
        </div>
        <div className='sidebar-brand-text mx-3'>Admin</div>
      </div>

      <hr className='sidebar-divider my-0' />

      {renderNavbar()}

      <hr className='sidebar-divider' />
      <div className='text-center'>
        <Button
          className='btn-icon-split btn-danger'
          onClick={handleLogout}
        >
          <span
            className='icon'
            style={{ paddingTop: '8px' }}
          >
            <i className='fa-solid fa-right-from-bracket' />
          </span>
          <span
            className='text'
            style={{ paddingTop: '8px' }}
          >
            Logout
          </span>
        </Button>
      </div>
    </ul>
  );
}
