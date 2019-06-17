import React from 'react';

export function CreateArticle ({input, userInput, topics, userSubmit, errors}) {
    return <div className="page create_article">
      <div className="header create_article-header">
        <h2>Create Article</h2>
      </div>
      <div className="create_article-menu">
        <span>Topic</span>
        <select value={input.createarticle.topic}
                onChange={(event) => userInput('createarticle', 'topic', event.nativeEvent.target.value)}>
          <option>New Topic</option>
          {topics.map((topic, i) => <option key={i}>{topic.slug}</option>)}
        </select>
        {input.createarticle.topic === 'New Topic' &&
          <input className={`error-${errors.newtopic}`}
                  value={input.createarticle.newtopic}
                  onChange={(event) => userInput('createarticle', 'newtopic', event.nativeEvent.target.value)}
                  placeholder="Topic Name"></input>}
        <span>Article Title</span>
        <textarea className={`error-${errors.title}`}
                  value={input.createarticle.title}
                  onChange={(event) => userInput('createarticle', 'title', event.nativeEvent.target.value)}></textarea>
        <span>Article Body</span>
        <textarea className={`create_article-menu-body error-${errors.body}`}
                  value={input.createarticle.body}
                  onChange={(event) => userInput('createarticle', 'body', event.nativeEvent.target.value)}></textarea>
        <button onClick={() => userSubmit('Article')}>Create</button>
      </div>
    </div>
  }