import React from 'react';
import loading from '../images/loading.gif';
import bin from '../images/bin.png';
import thumbsup from '../images/thumbsup.png';
import thumbsdown from '../images/thumbsdown.png';
import blank from '../images/blank.png';

export function Article ({article, comments, user, input, userInput, userSubmit, userVote, selectTopic, selectAuthor}) {
    return <div className={"page article"}>
      <div className={"header article-header"}>
        <span className={"article-header-title"}>
          {article.title}
          {user && user.username === article.author &&
            <img
              className={"article-header-bin"}
              src={bin}
              alt="delete"
              onClick={() => userSubmit('Delete Article')} />}
        </span>
        <span className={'select'}
          onClick={() => selectTopic(article.topic)}
          >{article.topic}</span>
        <span className={'select'}
           onClick={() => selectAuthor(article.author)}
          >{article.author}</span>
        <span>{article.created_at.slice(0, 10)}</span>
        <span>
          {(user && user.username !== article.author && (!input.votes.articles[article.article_id] || input.votes.articles[article.article_id] < 1) &&
            <img
              className={"article-header-voteup"}
              src={thumbsup}
              alt="/\"
              onClick={() => userVote('Vote Up Article', article.article_id)} />) ||
            <img
              className={"article-header-voteup"}
              src={blank}
              alt="" />}
          {article.votes}
          {user && user.username !== article.author && (!input.votes.articles[article.article_id] || input.votes.articles[article.article_id] > -1) &&
          <img
            className={"article-header-votedown"}
            src={thumbsdown}
            alt="\/"
            onClick={() => userVote('Vote Down Article', article.article_id)} />}
        </span>
      </div>
      <div className={"article-body"}>
        <p>{article.body}</p>
      </div>
      <div className={"header comments-header"}>
        <h2>Comments</h2>
      </div>
      <div className={"list comments-list"}>
        {user && <div className={"listitem comments-custom"}>
          <textarea
            onChange={(event) => userInput('comment', null, event.nativeEvent.target.value)}
            value={input.comment}></textarea>
          <button onClick={() => userSubmit('Comment')}>Add Comment</button>
        </div>}
        {!comments && <img
                        src={loading}
                        alt="loading..."
                        style={(user && {margin: "-5em 0em 0em"}) || (!user && {margin: "5em 0em 0em"})} />}
        {comments && comments.map((comment, i) => {
          return <div key={i} className={"listitem comments-listitem"}>
            <span className={"comments-listitem-body"}>{comment.body}</span>
            <span className={'select'}
              onClick={() => selectAuthor(comment.author)}
              >{comment.author}</span>
            <span>{comment.created_at.slice(0, 10)}</span>
            <span>
              {(user && user.username !== comment.author && (!input.votes.comments[comment.comment_id] || input.votes.comments[comment.comment_id] < 1) &&
                <img
                  className={"comment-voteup"}
                  src={thumbsup}
                  alt="/\"
                  onClick={() => userVote('Vote Up Comment', comment.comment_id)} />) ||
                <img
                  className={"comment-voteup"}
                  src={blank}
                  alt="" />}
              {comment.votes}
              {user && user.username !== comment.author && (!input.votes.comments[comment.comment_id] || input.votes.comments[comment.comment_id] > -1) &&
                <img
                  className={"comment-votedown"}
                  src={thumbsdown}
                  alt="\/"
                  onClick={() => userVote('Vote Down Comment', comment.comment_id)} />}
              {user && user.username === comment.author &&
                <img
                  className={"comment-bin"}
                  src={bin}
                  alt="delete"
                  onClick={() => userVote('Delete Comment', comment.comment_id)} />}
            </span>
              </div>
            })}
      </div>
    </div>
  };