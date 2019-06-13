import React, {Component} from 'react';
import './App.css';
import {Article} from './components/Article';
import {Articles} from './components/Articles';
import {CreateArticle} from './components/CreateArticle';
import {Featured} from './components/Featured';
import {Navbar} from './components/Navbar';
import {Users} from './components/Users';
import {getSortedArticles, getTopComments, getUsers, getArticleComments, loginUser, logoutUser, postComment, getTopics, postTopic, postArticle, patchArticleVote, patchCommentVote, deleteArticle, deleteComment} from './controllers/controllers';
import backgroundImage from './images/back.jpg';

// Main Components

class App extends Component {
  state = {
    page: {1: 'Featured', 2: 'Users', user: 'Sign Up'},
    user: null,
    socket: null,
    recentUsers: [],
    input: {lastClicked: 'Featured', login: {username: '', password: ''},
    signup: {username: '', password1: '', password2: ''}, comment: '', createarticle: {topic: 'New Topic', newtopic: '', title: '', body: ''}, votes: {articles: {}, comments: {}},
    articleSort: {topic: 'All', sort: 'Newest'}},
    articleSort: {sort_by: 'date', order: 'desc', topic: null, author: null, limit: 15, p: 1},
    hidden: {comments: true}
  };

  componentDidMount = () => {
    // Media
    const display = (window.innerWidth < 1000) ? 'Mobile' : 'Desktop';
    this.setState({display});
    window.addEventListener("resize", this.updateDisplay);

    // Data
    this.getFeaturedContent();
    this.getUsers();
    this.getArticles();
  };

  updateDisplay = () => {
    const display = (window.innerWidth < 1000) ? 'Mobile' : 'Desktop';
    if (display !== this.state.display) {
      if (display === 'Desktop') {
        this.setState(prevState => {
          let page;
          if (prevState.page[1] === 'Featured' || prevState.page[1] === 'Users') {
            page = {1: 'Featured', 2: 'Users', user: prevState.page.user};
          } else if (prevState.page[1] === 'Article' || prevState.page[1] === 'Articles') {
            page = {1: 'Articles', 2: 'Article', user: prevState.page.user};
          } else if (prevState.page[1] === 'Create Article') {
            page = {1: 'Articles', 2: 'Create Article', user: prevState.page.user};
          };;
          return {
            display,
            page
          };
        });
      } else if (display === 'Mobile') {
        const {input} = this.state;
        const page = {1: input.lastClicked, 2: null, user: this.state.page.user};
        this.setState({
          display,
          page
        });
      };
    };
  };

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.updateDisplay);
  };

  render = () => {
    const {page, user} = this.state;
    return <div className="App" style={{backgroundImage: `url(${backgroundImage})`}}>
      <Navbar
        user={user}
        userSubmit={this.userSubmit}
        updatePage={this.updatePage} />
      <Page
        state={{...this.state}}
        pageNum={"page1"}
        content={page[1]}
        updatePage={this.updatePage}
        userInput={this.userInput}
        userSubmit={this.userSubmit}
        userVote={this.userVote}
        sortArticles={this.sortArticles}
        selectArticle={this.selectArticle}
        selectTopic={this.selectTopic}
        selectAuthor={this.selectAuthor}
        setListScroller={this.setListScroller}
        scrollList={this.scrollList}
        toggleHidden={this.toggleHidden} />
      {page[2] &&
        <Page
          state={{...this.state}}
          pageNum={"page2"}
          content={page[2]}
          updatePage={this.updatePage}
          userInput={this.userInput}
          userSubmit={this.userSubmit}
          userVote={this.userVote}
          selectTopic={this.selectTopic}
          selectAuthor={this.selectAuthor}
          setListScroller={this.setListScroller}
          toggleHidden={this.toggleHidden} />}
    </div>
  };

  updatePage = (content, subcontent) => {
    const {display} = this.state;
    let page;
    if (display === 'Desktop') {
      if (content === 'Featured' || content === 'Articles') {
        const user = this.state.page.user;
        page = {1: content, 2: this.state.page[2], user};
      } else if (content === 'Users' || content === 'Article' || content === 'Create Article') {
        const user = (subcontent) ? subcontent : this.state.page.user;
        page = {1: this.state.page[1], 2: content, user};
      };
    } else if (display === 'Mobile') {
      const user = (subcontent) ? subcontent : this.state.page.user;
      page = {1: content, 2: null, user};
    };
    this.setState(prevState => {
      return {
        page,
        input: {...prevState.input, lastClicked: content}
      };
    });
  };

  updateContent = (select = true, sort = false) => {
    this.getFeaturedContent();
    this.getUsers();
    this.getArticles(select, sort);
    this.selectArticle(this.state.selectedArticle.article);
  };

  userInput = (type, field, value) => {
    this.setState(prevState => {
      if (field) {
        return {
          input: {...prevState.input, [type]: {...prevState.input[type], [field]: value}}
        };
      } else {
        return {
          input: {...prevState.input, [type]: value}
        };
      };
    });
  };

  getUsers = () => {
    getUsers().then((recentUsers) => {
      this.setState({
        recentUsers
      });
    });
  };

  resetInput = () => {
    this.setState(prevState => {
      return {
        input: {...prevState.input, lastClicked: 'Featured', login: {username: '', password: ''}, signup: {username: '', password1: '', password2: ''}, comment: '', createarticle: {topic: 'New Topic', newtopic: '', title: '', body: ''}}
    }});
  };

  userSubmit = (type) => {
    const {input: {login, comment, createarticle}, selectedArticle, user, socket} = this.state;
    if (type === 'Log In') {
      if (login.username !== '' && login.password !== '') {
        loginUser(login.username, login.password)
        .then((user, socket) => {
          this.setState(prevState => {
            return {
              // user,
              socket,
              // page: {...prevState.page, user: user.username}
            };
          });
          this.getUsers();
        })
        this.resetInput();
      };
    } else if (type === 'Log Out' && user) {
      logoutUser(socket)
        .then(() => {
          this.getUsers();
        })
      this.setState(prevState => {
        return {
          user: null,
          socket: null,
          page: {...prevState.page, user: 'Log In'}
        };
      });
    } else if (type === 'Comment') {
      if (comment !== '') {
        postComment(selectedArticle.article.article_id, user.username, comment)
        .then((comment) => {
          this.setState(prevState => {
            return {
              selectedArticle: {...prevState.selectedArticle, comments: [...prevState.selectedArticle.comments, comment]}
            };
          });
          this.resetInput();
        })
      };
    } else if (type === 'Article') {
      const topic = (createarticle.topic === 'New Topic' && createarticle.newTopic !== '') ? createarticle.newtopic : createarticle.topic;
      if (createarticle.title !== '' && createarticle.body !== '') {
        postTopic(topic, '')
        .then(() => {
          return postArticle(createarticle.title, createarticle.body, topic, user.username)
        })
        .then(article => {
          this.updateContent(false);
          this.selectArticle(article);
          this.resetInput();
        })
      } else {
        return;
      };
    } else if (type === 'Delete Article') {
      const {article_id, topic} = selectedArticle.article;
      deleteArticle(article_id, topic)
        .then((message) => {
          this.selectTopic(null, true);
          this.resetInput();
        })
    };
  };

  userVote = (type, id) => {
    const {input, selectedArticle} = this.state;
    if (type === 'Vote Up Article') {
      const article_id = selectedArticle.article.article_id;
      const voteCount = (input.votes.articles[article_id]) ? input.votes.articles[article_id] + 1 : 1;
      this.setState(prevState => {
        return {
          input: {...prevState.input, votes: {...prevState.input.votes, articles: {...prevState.input.votes.articles, [article_id]: voteCount}}},
          selectedArticle: {...prevState.selectedArticle, article: {...prevState.selectedArticle.article, votes: prevState.selectedArticle.article.votes + 1}}
        };
      });
      patchArticleVote(selectedArticle.article.article_id, 1)
        .then(() => {
          this.updateContent(false);
        })
    } else if (type === 'Vote Down Article') {
      const article_id = selectedArticle.article.article_id;
      const voteCount = (input.votes.articles[article_id]) ? input.votes.articles[article_id] - 1 : -1;
      this.setState(prevState => {
        return {
          input: {...prevState.input, votes: {...prevState.input.votes, articles: {...prevState.input.votes.articles, [article_id]: voteCount}}},
          selectedArticle: {...prevState.selectedArticle, article: {...prevState.selectedArticle.article, votes: prevState.selectedArticle.article.votes - 1}}
        };
      });
      patchArticleVote(selectedArticle.article.article_id, -1)
        .then(() => {
          this.updateContent(false);
        })
    } else if (type === 'Vote Up Comment') {
      const voteCount = (input.votes.comments[id]) ? input.votes.comments[id] + 1 : 1;
      this.setState(prevState => {
        return {
          input: {...prevState.input, votes: {...prevState.input.votes, comments: {...prevState.input.votes.comments, [id]: voteCount}}}
        };
      });
      patchCommentVote(id, 1)
        .then(() => {
          this.updateContent(false);
        })
    } else if (type === 'Vote Down Comment') {
      const voteCount = (input.votes.comments[id]) ? input.votes.comments[id] - 1 : -1;
      this.setState(prevState => {
        return {
          input: {...prevState.input, votes: {...prevState.input.votes, comments: {...prevState.input.votes.comments, [id]: voteCount}}}
        };
      });
      patchCommentVote(id, -1)
        .then(() => {
          this.updateContent(false);
        })
    } else if (type === 'Delete Comment') {
      deleteComment(id)
        .then(() => {
          this.updateContent(false);
        })
    };
  };

  getFeaturedContent = () => {
    getSortedArticles({sort_by: 'votes', order: 'desc', limit: '10'})
      .then(topArticles => {
        this.setState({
            topArticles
        })
        return getTopComments(topArticles)
      })
      .then(topComments => {
          this.setState({
              topComments
          })
      })
  };

  sortArticles = (sort, select = false) => {
    const config = {'Newest': {sort_by: 'date', order: 'desc', p: 1},
                  'Oldest': {sort_by: 'date', order: 'asc', p: 1},
                  'Most Votes': {sort_by: 'votes', order: 'desc', p: 1},
                  'Fewest Votes': {sort_by: 'votes', order: 'asc', p: 1}}
    this.setState(prevState => {
      return {
        input: {...prevState.input, articleSort: {...prevState.input.articleSort, sort}},
        articleSort: {...prevState.articleSort, ...config[sort]},
        listScroller: {...prevState.listScroller, scrollTop: 0}
      };
    }, () => {
      this.getArticles(select);
    });
  };

  selectTopic = (topic, select = false) => {
    topic = (topic === 'All') ? null : topic;
    this.setState(prevState => {
      return {
        input: {...prevState.input, articleSort: {...prevState.input.articleSort, topic: (topic || 'All')}},
        articleSort: {...prevState.articleSort, topic, p: 1},
        listScroller: {...prevState.listScroller, scrollTop: 0}
      };
    }, () => {
      this.getArticles(select);
      this.updatePage('Articles');
    });
  };

  selectAuthor = (author, select = false) => {
    this.setState(prevState => {
      return {
        input: {...prevState.input, articleSort: {...prevState.input.articleSort, topic: (author || 'All')}},
        articleSort: {...prevState.articleSort, author, p: 1},
        listScroller: {...prevState.listScroller, scrollTop: 0}
      };
    }, () => {
      this.getArticles(select);
      this.updatePage('Articles');
    });
  }

  getArticles = (select = true) => {
    const {articleSort} = this.state;
    getSortedArticles(articleSort)
      .then(articles => {
        this.setState({
            listScroller: null,
            articles
        }, () => {
          if (select && articles) this.selectArticle(articles[0], false);
        });
      })
    getTopics()
      .then(topics => {
        this.setState({
            topics
        });
      })
  };

  setListScroller = (listScroller) => {
    this.setState({
      listScroller
    });
  }

  scrollList = (append = true) => {
    const {articleSort} = this.state;
    const p = articleSort.p + 1;
    return getSortedArticles({...articleSort, p})
      .then(articles => {
        if (append) {
          this.setState(prevState => {
            return {
              articleSort: {...prevState.articleSort, p},
              articles: [...prevState.articles, ...articles]
            };
          });
        };
        return articles.length;
      });
  }

  selectArticle = (article, display = true) => {
    this.setState(prevState => {
      return {
        selectedArticle: {article, comments: null},
        input: {...prevState.input, comment: ''},
        hidden: {...prevState.hidden, comments: true}
      };
    });
    getArticleComments(article)
      .then(comments => {
        comments = comments || [];
        this.setState({
          selectedArticle: {article, comments}
        });
      })
      .then(() => {
        if (display) {
          this.updatePage('Article');
        };
      })
  };

  toggleHidden = (type) => {
    this.setState(prevState => {
      return {
        hidden: {...prevState.hidden, [type]: !prevState.hidden[type]}
      };
    });
  };

};

// Main Components

function Page ({state, pageNum, content, updatePage, userInput, userSubmit, userVote, sortArticles, selectArticle, selectTopic, selectAuthor, setListScroller, scrollList, toggleHidden}) {
  const {page, topArticles, topComments, input, user, articles, topics, selectedArticle, listScroller, hidden, recentUsers} = state;
  return <div className={`page ${pageNum}`}>
    {content === 'Featured' && <Featured
                                  topArticles={topArticles}
                                  topComments={topComments}
                                  selectArticle={selectArticle}
                                  selectAuthor={selectAuthor} />}
    {content === 'Users' && <Users
                              recentUsers={recentUsers}
                              userPage={page.user}
                              userInput={userInput}
                              userSubmit={userSubmit} 
                              input={input}
                              user={user} />}
    {content === 'Articles' && <Articles
                                  articles={articles}
                                  topics={topics}
                                  sortArticles={sortArticles}
                                  selectTopic={selectTopic}
                                  selectArticle={selectArticle}
                                  user={user}
                                  updatePage={updatePage}
                                  input={input}
                                  selectAuthor={selectAuthor}
                                  setListScroller={setListScroller}
                                  listScroller={listScroller}
                                  scrollList={scrollList} />}
    {content === 'Article' && <Article
                                article={selectedArticle.article}
                                comments={selectedArticle.comments}
                                user={user}
                                userInput={userInput}
                                userSubmit={userSubmit}
                                userVote={userVote}
                                input={input}
                                selectTopic={selectTopic}
                                selectAuthor={selectAuthor}
                                hidden={hidden.comments}
                                toggleHidden={toggleHidden} />}
    {content === 'Create Article' && <CreateArticle
                                        input={input}
                                        userInput={userInput}
                                        topics={topics}
                                        userSubmit={userSubmit} />}
  </div>
};

export default App;