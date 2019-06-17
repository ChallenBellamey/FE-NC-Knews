import React from 'react';
import loading from '../images/loading.gif';
import {formatDate} from '../controllers/controllers.js';

export function Users ({recentUsers, userPage, input, userInput, userSubmit, user, selectAuthor, errors}) {
    return <div className={"page users"}>
      <div className={"header users-header"}>
        <h2>Users</h2>
        <span>Recent</span>
        <span>{userPage}</span>
      </div>
      <div className={"list users-list"}>
        {recentUsers.length === 0 && <img src={loading} alt="loading..." />}
        {recentUsers && recentUsers.map((user, i) => {
          return <div key={i}
                      className={"listitem users-listitem"}
                      onClick={() => selectAuthor(user.username)}>
            <span className={'select'}>{user.username}</span>
            <span>Last Online: {formatDate(new Date(user.last_online))}</span>
          </div>})}
      </div>
      {userPage === 'Log In' &&
        <div className={"users-user"}>
          <span className={"users-question"}>Username</span>
          <input
            className={`users-answer error-${errors.username}`}
            onChange={(event) => userInput('login', 'username', event.nativeEvent.target.value)}
            value={input.login.username}></input>
          <span className={"users-question"}>Password</span>
          <input
            className={`users-answer error-${errors.password}`}
            type="password"
            onChange={(event) => userInput('login', 'password', event.nativeEvent.target.value)}
            value={input.login.password}></input>
          <button className="alt-select"
                  onClick={() => userSubmit('Log In')}>
                  Log In
          </button>
          <span className={"users-question"}>Test Account</span>
          <span className={"users-answer"}>Username: tickle122</span>
          <span className={"users-answer"}>Password: tickle122</span>
        </div>
      }
      {userPage === 'Sign Up' &&
        <div className={"users-user"}>
          <span className="users-question">Username</span>
          <input
            className={`users-answer error-${errors.username}`}
            onChange={(event) => userInput('signup', 'username', event.nativeEvent.target.value)}
            value={input.signup.username}></input>
          <span className="users-question">Password</span>
          <input
            className={`users-answer error-${errors.password}`}
            type="password"
            onChange={(event) => userInput('signup', 'password1', event.nativeEvent.target.value)}
            value={input.signup.password1}></input>
          <span className="users-question">Confirm Password</span>
          <input
            className={`users-answer error-${errors.password}`}
            type="password"
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
          <button className="alt-select"
                  onClick={() => userSubmit('Sign Up')}>
                  Sign Up
          </button>
        </div>
      }
      {user && userPage === user.username &&
        <div className={"users-user"}>
          <h3 className="users-question"><b>{user.username}</b></h3>
          <span className="users-answer">{user.name}</span>
          <span className="users-question"><b>About Me</b></span>
          <span className="users-answer">{user.about}</span>
          <button className="alt-select"
                  onClick={() => selectAuthor(user.username)}>
                  My Articles
          </button>
        </div>
      }
    </div>
  };