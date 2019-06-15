import React from 'react';
import loading from '../images/loading.gif';

export function Featured ({topArticles, topComments, selectArticle, selectAuthor}) {
    return <div className={"page featured"}>
      <div className={"header featured-header"}>
        <h2>Featured</h2>
        <span>Top Articles</span>
        <span>Top Comments</span>
      </div>
      <div className={"list featured-list"}>
        {(!topArticles || !topComments) && <img src={loading} alt="loading..." />}
        {topArticles && topComments && topArticles.map((article, i) => {
          return <div key={i}
                      className={"listitem featured-listitem"}
                      onClick={() => selectArticle(article)}>
            <span><b>{`${article.title.slice(0, 50)}`}{article.title.length > 50 && '...'}</b>
            </span>
            <span>{topComments[i] && `"${topComments[i].body.slice(0, 50)}`}{topComments[i] && topComments[i].body.length > 50 && '...'}{topComments[i] && `"`}
            </span>
            <span className={'select'}
              onClick={(event) => selectAuthor(article.author, false, event)}
              >{article.author}
            </span>
            <span className={'select'}
              onClick={(event) => selectAuthor(topComments[i].author, false, event)}>
              {topComments[i] && topComments[i].author}
            </span>
          </div>
        })}
      </div>
    </div>
  };