import React from 'react';

export function Users ({recentUsers, userPage, input, userInput, userSubmit, user}) {
    return <div className={"page users"}>
      <div className={"header users-header"}>
        <h2>Users</h2>
        <span>Recent</span>
        <span>{userPage}</span>
      </div>
      <div className={"list users-list"}>
        {recentUsers && recentUsers.filter(user => user.online).map((user, i) => {
          return <div key={i}
                      className={"listitem users-listitem"}>
            <span>{user.username}</span>
            <span>Online</span>
          </div>})}
        {recentUsers && recentUsers.filter(user => !user.online).map((user, i) => {
          return <div key={i}
                      className={"listitem users-listitem"}>
            <span>{user.username}</span>
            <span>{user.last_online.slice(0, 10)}</span>
          </div>})}
      </div>
      {userPage === 'Log In' &&
        <div className={"users-user"}>
          <span>Username</span>
          <input
            onChange={(event) => userInput('login', 'username', event.nativeEvent.target.value)}
            value={input.login.username}></input>
          <span>Password</span>
          <input
            onChange={(event) => userInput('login', 'password', event.nativeEvent.target.value)}
            value={input.login.password}></input>
          <button onClick={() => userSubmit('Log In')}>Log In</button>
        </div>
      }
      {userPage === 'Sign Up' &&
        <div className={"users-user"}>
          <span>Username</span>
          <input
            onChange={(event) => userInput('signup', 'username', event.nativeEvent.target.value)}
            value={input.signup.username}></input>
          <span>Password</span>
          <input
            onChange={(event) => userInput('signup', 'password1', event.nativeEvent.target.value)}
            value={input.signup.password1}></input>
          <span>Confirm Password</span>
          <input
            onChange={(event) => userInput('signup', 'password2', event.nativeEvent.target.value)}
            value={input.signup.password2}></input>
          <button>Sign Up</button>
        </div>
      }
      {user && userPage === user.username &&
        <div className={"users-user"}>
          <h3 className="users-question">{user.username}</h3>
          <span className="users-answer">{user.name}</span>
          <span className="users-question">About me</span>
          <span className="users-answer">{user.about}</span>
        </div>
      }
    </div>
  };