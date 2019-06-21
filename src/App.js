import React, {Component} from 'react';
import './App.css';
import {Article} from './components/Article';
import {Articles} from './components/Articles';
import {CreateArticle} from './components/CreateArticle';
import {Featured} from './components/Featured';
import {Navbar} from './components/Navbar';
import {Users} from './components/Users';
import {getSortedArticles, getTopComments, getUsers, getArticleComments, signupUser, loginUser, logoutUser, postComment, getTopics, postTopic, postArticle, patchArticleVote, patchCommentVote, deleteArticle, deleteComment} from './controllers/controllers';
import backgroundImage from './images/back.jpg';

// Main Components

class App extends Component {
  state = {
    page: {1: 'Featured', 2: 'Users', user: 'Log In'},
    user: null,
    recentUsers: [],
    input: {lastClicked: 'Featured', login: {username: '', password: ''},
    signup: {username: '', password1: '', password2: '', name: '', about: ''}, comment: '', createarticle: {topic: 'New Topic', newtopic: '', title: '', body: ''}, votes: {articles: {}, comments: {}},
    articleSort: {topic: 'All', sort: 'Newest'}},
    articleSort: {sort_by: 'date', order: 'desc', topic: null, author: null, limit: Math.floor(window.innerHeight / 78), p: 1},
    hidden: {comments: true},
    errors: {users: {username: false, password: false}, createarticle: {newtopic: false, title: false, body: false}, comment: false}
  };

  componentDidMount = () => {
    // Media
    this.updateDisplay();
    window.addEventListener("resize", this.updateDisplay);

    // User
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) loginUser({username: user.username, password: user.password})
                .then((user) => {
                  if (user) this.setState(prevState => {
                    return {
                      user,
                      page: {...prevState.page, user: user.username}
                    };
                  });
                  this.getUsers();
                })

    // Data
    this.getFeaturedContent();
    this.getUsers();
    this.getArticles();
  };

  updateDisplay = () => {
    const limit = Math.floor(window.innerHeight / 78);
    if (limit !== this.state.articleSort.limit) {
      this.setState(prevState => {
        return {
          articleSort: {...prevState.articleSort, limit, p: 1}
        };
      }, () => {this.getArticles(false)});
    };
    const display = (window.innerWidth <= 1000) ? 'Mobile' : 'Desktop';
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
        this.setState(prevState => {
          return {
            display,
            page
          };
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
        display={this.state.display}
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

  updatePage = async (content, subcontent) => {
    const {display} = this.state;
    let user;
    let page;
    if (display === 'Desktop') {
      if (content === 'Featured' || content === 'Articles') {
        user = this.state.page.user;
        page = {1: content, 2: this.state.page[2], user};
      } else if (content === 'Users' || content === 'Article' || content === 'Create Article') {
        user = (subcontent) ? subcontent : this.state.page.user;
        page = {1: this.state.page[1], 2: content, user};
        this.resetErrors();
      };
    } else if (display === 'Mobile') {
      user = (subcontent) ? subcontent : this.state.page.user;
      page = {1: content, 2: null, user};
      if (content === 'Users' || content === 'Article' || content === 'Create Article') {this.resetErrors()};
    };
    this.setState(prevState => {
      return {
        page,
        input: {...prevState.input, lastClicked: content}
      };
    });
  };

  updateContent = async (select = true) => {
    return this.getFeaturedContent()
      .then(() => {
        return this.getUsers();
      })
      .then(() => {
        return this.getArticles(select);
      })
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

  getUsers = async () => {
    getUsers().then((recentUsers) => {
      this.setState({
        recentUsers
      });
    });
  };

  getArticles = async (select = true) => {
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

  resetInput = () => {
    this.setState(prevState => {
      return {
        input: {...prevState.input, lastClicked: 'Featured', login: {username: '', password: ''}, signup: {username: '', password1: '', password2: '', name: '', about: ''}, comment: '', createarticle: {topic: 'New Topic', newtopic: '', title: '', body: ''}}
    }});
    this.resetErrors();
  };

  resetErrors = (type) => {
    let {errors} = this.state;
    if (!type) {
      errors = {users: {username: false, password: false}, createarticle: {newtopic: false, title: false, body: false}, comment: false};
    } else if (type === 'users') {
      errors = {...errors, users: {username: false, password: false}};
    } else if (type === 'createarticle') {
      errors = {...errors, createarticle: {newtopic: false, title: false, body: false}};
    } else if (type === 'comment') {
      errors = {...errors, comment: false};
    };
    this.setState({
      errors
    });
  };

  userSubmit = (type) => {
    const {input: {signup, login, comment, createarticle}, selectedArticle, user, articleSort} = this.state;
    if (type === 'Sign Up') {
      if (signup.username !== '' && signup.password1 !== '' && signup.password2 !== '' && signup.password1 === signup.password2) {
        signupUser({username: signup.username, password: signup.password1, name: signup.name, about: signup.about})
          .then((user) => {
            if (user) localStorage.setItem('user', JSON.stringify(user));
            if (user) this.setState(prevState => {
              return {
                user,
                page: {...prevState.page, user: user.username}
              };
            });
            this.getUsers();
          })
          this.resetInput();
      } else {
        let newErrors = {username: false, password: false};
        if (signup.username === '') {
          newErrors.username = true;
        };
        if (signup.password1 === '' || signup.password2 === '') {
          newErrors.password = true;
        };
        this.setState(prevState => {
          return {
            errors: {...prevState.errors, users: newErrors}
          }
        })
      };
    } else if (type === 'Log In') {
      if (login.username !== '' && login.password !== '') {
        loginUser({username: login.username, password: login.password})
          .then((user) => {
            if (user) localStorage.setItem('user', JSON.stringify(user));
            if (user) this.setState(prevState => {
              return {
                user,
                page: {...prevState.page, user: user.username}
              };
            });
            this.getUsers();
          })
          this.resetInput();
      } else {
        let newErrors = {username: false, password: false};
        if (login.username === '') {
          newErrors.username = true;
        };
        if (login.password === '') {
          newErrors.password = true;
        };
        this.setState(prevState => {
          return {
            errors: {...prevState.errors, users: newErrors}
          }
        })
      };
    } else if (type === 'Log Out' && user) {
      logoutUser({username: user.username})
        .then(() => {
          this.getUsers();
        })
      localStorage.removeItem('user');
      this.setState(prevState => {
        return {
          user: null,
          page: {...prevState.page, user: 'Log In'}
        };
      });
    } else if (type === 'Comment') {
      if (comment !== '') {
        postComment(selectedArticle.article.article_id, user.username, comment)
        .then((comment) => {
          this.setState(prevState => {
            return {
              selectedArticle: {...prevState.selectedArticle, comments: [comment, ...prevState.selectedArticle.comments]}
            };
          });
          this.resetInput();
        })
      } else {
        let newErrors = false;
        if (comment === '') {
          newErrors = true;
        };
        this.setState(prevState => {
          return {
            errors: {...prevState.errors, comment: newErrors}
          }
        })
      };
    } else if (type === 'Article') {
      const topic = (createarticle.topic === 'New Topic') ? createarticle.newtopic : createarticle.topic;
      if (topic !== '' && createarticle.title !== '' && createarticle.body !== '') {
        if (createarticle.topic === 'New Topic') {
          postTopic(topic, '')
            .then(() => {
              return postArticle(createarticle.title, createarticle.body, topic, user.username)
            })
            .then(article => {
              this.updateContent(false)
                .then(() => {
                  this.selectArticle(article);
                })
              this.resetInput();
          })
        } else {
          postArticle(createarticle.title, createarticle.body, topic, user.username)
            .then(article => {
              this.updateContent(false)
                .then(() => {
                  this.selectArticle(article);
                })
              this.resetInput();
          })
        };
      } else {
        let newErrors = {newtopic: false, title: false, body: false};
        if (topic === '') {
          newErrors.newtopic = true;
        };
        if (createarticle.title === '') {
          newErrors.title = true;
        };
        if (createarticle.body === '') {
          newErrors.body = true;
        };
        this.setState(prevState => {
          return {
            errors: {...prevState.errors, createarticle: newErrors}
          }
        })
      };
    } else if (type === 'Delete Article') {
      const {article_id} = selectedArticle.article;
      const {topic, author} = articleSort;
      const sort = (topic) ? {topic} : {author};
      deleteArticle(article_id, sort)
        .then(({sortEmpty}) => {
          if (sortEmpty && sort.topic) {
            return this.selectTopic(null, true);
          } else if (sortEmpty && sort.author) {
            return this.selectAuthor(null);
          } else {
            return this.getArticles(true);
          };
        })
        .then(() => {
          this.updateContent(true);
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
          this.selectArticle(selectedArticle.article, true, false);
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
          this.selectArticle(selectedArticle.article, true, false);
        })
    } else if (type === 'Delete Comment') {
      deleteComment(id)
        .then(() => {
          this.selectArticle(selectedArticle.article, true, false);
        })
    };
  };

  getFeaturedContent = async () => {
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
      .catch(err => {return null})
  };

  sortArticles = (sort, select = false) => {
    const config = {'Newest': {sort_by: 'date', order: 'desc', p: 1},
                  'Oldest': {sort_by: 'date', order: 'asc', p: 1},
                  'Highest Votes': {sort_by: 'votes', order: 'desc', p: 1},
                  'Lowest Votes': {sort_by: 'votes', order: 'asc', p: 1}}
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

  selectTopic = (topic, select = false, event) => {
    if (event) event.stopPropagation();
    topic = (topic === 'All') ? null : topic;
    this.setState(prevState => {
      return {
        input: {...prevState.input, articleSort: {...prevState.input.articleSort, topic: (topic || 'All')}},
        articleSort: {...prevState.articleSort, author: null, topic, p: 1},
        listScroller: {...prevState.listScroller, scrollTop: 0}
      };
    }, () => {
      this.getArticles(select);
      this.updatePage('Articles');
    });
  };

  selectAuthor = (author, select = false, event) => {
    if (event) event.stopPropagation();
    this.setState(prevState => {
      return {
        input: {...prevState.input, articleSort: {...prevState.input.articleSort, topic: (author || 'All')}},
        articleSort: {...prevState.articleSort, topic: null, author, p: 1},
        listScroller: {...prevState.listScroller, scrollTop: 0}
      };
    }, () => {
      this.getArticles(select);
      this.updatePage('Articles');
    });
  }

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

  selectArticle = (article, displayArticle = true, hideComments = true) => {
    this.setState(prevState => {
      return {
        selectedArticle: {article, comments: null},
        input: {...prevState.input, comment: ''},
        hidden: {...prevState.hidden, comments: hideComments}
      };
    }, () => {
      getArticleComments(article)
        .then(comments => {
          comments = comments || [];
          this.setState({
            selectedArticle: {article, comments}
          })
        })
        .then(() => {
          if (displayArticle) {
            this.updatePage('Article');
          };
      })
      this.resetErrors();
    });
  };

  toggleHidden = (type) => {
    this.setState(prevState => {
      return {
        hidden: {...prevState.hidden, [type]: !prevState.hidden[type]}
      };
    }, () => {
      this.resetErrors('comment');
    });
  };

};

// Main Components

function Page ({state, pageNum, content, updatePage, userInput, userSubmit, userVote, sortArticles, selectArticle, selectTopic, selectAuthor, setListScroller, scrollList, toggleHidden, resetErrors}) {
  const {page, topArticles, topComments, input, user, articles, topics, selectedArticle, listScroller, hidden, recentUsers, errors} = state;
  return <div id="page" className={`page ${pageNum}`}>
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
                              user={user}
                              selectAuthor={selectAuthor}
                              errors={errors.users} />}
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
                                toggleHidden={toggleHidden}
                                errors={errors.comment} />}
    {content === 'Create Article' && <CreateArticle
                                        input={input}
                                        userInput={userInput}
                                        topics={topics}
                                        userSubmit={userSubmit}
                                        errors={errors.createarticle} />}
  </div>
};

export default App;