import React from 'react';
import loading from '../images/loading.gif';
import cross from '../images/cross.png';
import {formatDate, isToday} from '../controllers/controllers.js';

export function Articles ({articles, topics, sortArticles, selectTopic, selectAuthor, selectArticle, user, updatePage, input, setListScroller, listScroller, scrollList}) {
    const checkListScroller = () => {
      const listHeight = document.getElementById('articlesList').offsetHeight;
      let articlesHeight = (articles) ? articles.length * 80 : null;
      if (articlesHeight && listScroller && articlesHeight - listScroller.scrollTop === listHeight) {
        articlesHeight += 1200;
        scrollList(false)
          .then(articlesLength => {
            if (articlesLength > 0) {
              scrollList();
            }
          });
      };
    };
    return <div className={"page articles"}>
      <div className={"header articles-header"}>
        <h2>Articles</h2>
        {[...topics.map(topic => topic.slug), 'All'].includes(input.articleSort.topic) && <select
                className="articles-header-topic"
                onChange={(event) => selectTopic(event.nativeEvent.target.value)}
                value={input.articleSort.topic}>
          <option>All</option>
          {topics && topics.map((topic, i) => <option key={i}>{topic.slug}</option>)}
        </select>}
        {![...topics.map(topic => topic.slug), 'All'].includes (input.articleSort.topic) && <div className={'deselect'}
            onClick={() => selectAuthor(null)}>
            <img
                className="articles-header-cross"
                src={cross}
                alt="remove"
                onClick={() => selectAuthor(null)} />
            {input.articleSort.topic}
          </div>}
        <select className="articles-header-sort"
                onChange={(event) => sortArticles(event.nativeEvent.target.value)}
                value={input.articleSort.sort}>
          <option>Newest</option>
          <option>Oldest</option>
          <option>Highest Votes</option>
          <option>Lowest Votes</option>
        </select>
        {user && <span
                    className="link articles-header-create"
                    onClick={() => updatePage("Create Article")}>Create</span>}
        {!user && <span
                    className="link articles-header-create"></span>}
      </div>
      <div id={"articlesList"} className={"list articles-list"}
            onScroll={() => {
              checkListScroller();
            }}
            ref={(scroller) => {
              if (!listScroller) {
                listScroller = scroller;
                setListScroller(listScroller);
              };
            }}>
        {!articles && <img src={loading} alt="loading..." />}
        {articles && articles.map((article, i) => {
          return <div key={i}
                      className={"listitem articles-listitem"}
                      onClick={() => selectArticle(article)}>
            <span className={"articles-listitem-title"}>{article.title}</span>
            <span className={'select articles-listitem-subtitle'}
              onClick={(event) => selectTopic(article.topic, false, event)}
              >{article.topic}</span>
            <span className={'select articles-listitem-subtitle'}
               onClick={(event) => selectAuthor(article.author, false, event)}
              >{article.author}</span>
            <span className={'articles-listitem-subtitle'}>
              {isToday(new Date(article.created_at)) && formatDate(new Date(article.created_at), 'time')}
              {!isToday(new Date(article.created_at)) && formatDate(new Date(article.created_at), 'cal', true)}</span>
            <span className={'articles-listitem-subtitle'}>
              Votes: {article.votes}</span>
          </div>})}
      </div>
    </div>
  };