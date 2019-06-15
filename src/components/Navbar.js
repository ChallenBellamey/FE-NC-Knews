import React from 'react';

export function Navbar ({display, user, userSubmit, updatePage}) {
  return <div className={"header navbar"}>
    <h1 className={"navbar-header"}
        onClick={() => {
          updatePage('Users')
            .then(() => {
              updatePage('Featured');
            })
        }}>
      {"< NC Knews >"}
    </h1>
    {display === 'Desktop' &&
      <>
        <div className={"navbar-links"}>
          <span onClick={() => updatePage('Featured')}>Featured</span>
          <span onClick={() => updatePage('Users')}>Users</span>
          <span onClick={() => updatePage('Articles')}>Articles</span>
        </div>
        {user && 
          <div className={"navbar-user"}>
            <span onClick={() => updatePage('Users', user.username)}>{user.username}</span>
            <span onClick={() => userSubmit('Log Out')}>Log Out</span>
          </div>}
        {!user && 
          <div className={"navbar-user"}>
            <span onClick={() => updatePage('Users', 'Log In')}>Log In</span>
            <span onClick={() => updatePage('Users', 'Sign Up')}>Sign Up</span>
          </div>}
      </>}
      {display === 'Mobile' &&
        <div className={"navbar-links"}>
          <span onClick={() => updatePage('Featured')}>Featured</span>
          <span onClick={() => updatePage('Users')}>Users</span>
          <span onClick={() => updatePage('Articles')}>Articles</span>
          {user && <span onClick={() => updatePage('Users', user.username)}>  {user.username}</span>}
          {user && <span onClick={() => userSubmit('Log Out')}>Log Out</      span>}
          {!user && <span onClick={() => updatePage('Users', 'Log In')}>Log   In</span>}
          {!user && <span onClick={() => updatePage('Users', 'Sign Up')}      >Sign Up</span>}
        </div>}
  </div>
  };