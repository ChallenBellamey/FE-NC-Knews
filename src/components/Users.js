import React from 'react';

export function Users ({recentUsers, userPage, input, userInput, userSubmit, user, selectAuthor}) {
    const formatDate = (date) => {
      return `${Math.floor(date.getDate() / 10)}${date.getDate() % 10}/${Math.floor(date.getMonth() / 10)}${date.getMonth() % 10}/${date.getFullYear()} ${Math.floor(date.getHours() / 10)}${date.getHours() % 10}:${date.getMinutes()}`;
    };
    return <div className={"page users"}>
      <div className={"header users-header"}>
        <h2>Users</h2>
        <span>Recent</span>
        <span>{userPage}</span>
      </div>
      <div className={"list users-list"}>
        {recentUsers && recentUsers.map((user, i) => {
          return <div key={i}
                      className={"listitem users-listitem"}
                      onClick={() => selectAuthor(user.username)}>
            <span>{user.username}</span>
            <span>{formatDate(new Date(user.last_online))}</span>
          </div>})}
      </div>
      {userPage === 'Log In' &&
        <div className={"users-user"}>
          <span className={"users-question"}>Username</span>
          <input
            className="users-answer"
            onChange={(event) => userInput('login', 'username', event.nativeEvent.target.value)}
            value={input.login.username}></input>
          <span className={"users-question"}>Password</span>
          <input
            className="users-answer"
            onChange={(event) => userInput('login', 'password', event.nativeEvent.target.value)}
            value={input.login.password}></input>
          <button onClick={() => userSubmit('Log In')}>Log In</button>
        </div>
      }
      {userPage === 'Sign Up' &&
        <div className={"users-user"}>
          <span className="users-question">Username</span>
          <input
            className="users-answer"
            onChange={(event) => userInput('signup', 'username', event.nativeEvent.target.value)}
            value={input.signup.username}></input>
          <span className="users-question">Password</span>
          <input
            className="users-answer"
            onChange={(event) => userInput('signup', 'password1', event.nativeEvent.target.value)}
            value={input.signup.password1}></input>
          <span className="users-question">Confirm Password</span>
          <input
            className="users-answer"
            onChange={(event) => userInput('signup', 'password2', event.nativeEvent.target.value)}
            value={input.signup.password2}></input>
          <span className="users-question">Name</span>
          <input
            className="users-answer"
            onChange={(event) => userInput('signup', 'name', event.nativeEvent.target.value)}
            value={input.signup.name}></input>
          <span className="users-question">About</span>
          <textarea
            className="users-answer users-input-large"
            onChange={(event) => userInput('signup', 'about', event.nativeEvent.target.value)}
            value={input.signup.about}></textarea>
          <button onClick={() => userSubmit('Sign Up')}>Sign Up</button>
        </div>
      }
      {user && userPage === user.username &&
        <div className={"users-user"}>
          <h3 className="users-question"><b>{user.username}</b></h3>
          <span className="users-answer">{user.name}</span>
          <span className="users-question"><b>About me</b></span>
          <span className="users-answer">{user.about}</span>
        </div>
      }
    </div>
  };