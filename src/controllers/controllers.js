import axios from 'axios';

// API Requests

// let path = 'https://nc-knews-cb.herokuapp.com';
let path = 'http://localhost:9090';

// GET

export const getUsers = async () => {
    return axios.get(`${path}/api/users`, {
        limit: 10
    })
        .then(({data: {users}}) => {
            return users;
        })
        .catch(err => {return null})
}

export const getSortedArticles = async (params) => {
    return axios.get(`${path}/api/articles`, {params})
        .then(({data: {articles}}) => {
            return articles
        })
        .catch(err => {return null})
};

export const getTopComments = async (articles) => {
    if (!articles) return null;
    return Promise.all(articles.map(article => {
        return axios.get(`${path}/api/articles/${article.article_id}/comments?sort_by=votes&order=desc&limit=1`)
            .then(({data: {comments: [topComment]}}) => {
                return topComment;
            })
            .catch(err => {return null})
    }));
};

export const getArticleComments = async (article) => {
    return axios.get(`${path}/api/articles/${article.article_id}/comments`)
        .then(({data: {comments}}) => {
            return comments;
        })
        .catch(err => {return null})
};

export const getTopics = async () => {
    return axios.get(`${path}/api/topics`)
        .then(({data: {topics}}) => {
            return topics;
        })
        .catch(err => {return null})
};

// POST

const generateDate = () => {
    let date = new Date();
    date.setTime(date.getTime() + date.getTimezoneOffset());
    return date;
};

export const signupUser = async (user) => {
    return axios.post(`${path}/api/users`, {
        ...user,
        last_online: generateDate()
    })
        .then(({data: {user}}) => {
            return user;
        })
        .catch(err => {return null})
};

export const loginUser = async (user) => {
    return axios.post(`${path}/api/users/${user.username}`, {
        ...user,
        log: 'In',
        last_online: generateDate()
    })
        .then(({data: {user}}) => {
            return user;
        })
        .catch(err => {return null})
};

export const logoutUser = async (user) => {
    return axios.post(`${path}/api/users/${user.username}`, {
        ...user,
        log: 'Out',
        last_online: generateDate()
    })
        .then(() => {
            return null;
        })
        .catch(err => {return null})
}

export const postComment = async (article_id, username, body) => {
    return axios.post(`${path}/api/articles/${article_id}/comments`, {
            username,
            body
        })
        .then(({data: {comment}}) => {
            return comment;
        })
        .catch(err => {return null})
};

export const postArticle = async (title, body, topic, author) => {
    return axios.post(`${path}/api/articles`, {
            title,
            body,
            topic,
            author
        })
        .then(({data: {article}}) => {
            return article;
        })
        .catch(err => {return null})
};

export const postTopic = async (slug, description) => {
    return axios.post(`${path}/api/topics`, {
            slug,
            description
        })
        .then(({data: {topic}}) => {
            return topic;
        })
        .catch(err => {return null})
};

// PATCH

export const patchArticleVote = async (article_id, inc_votes) => {
    return axios.patch(`${path}/api/articles/${article_id}`, {
        inc_votes
    })
    .then(({data: {article}}) => {
        return article;
    })
    .catch(err => {return null})
};

export const patchCommentVote = async (comment_id, inc_votes) => {
    return axios.patch(`${path}/api/comments/${comment_id}`, {
        inc_votes
    })
    .then(({data: {comment}}) => {
        return comment;
    })
    .catch(err => {return null})
};

// DELETE

export const deleteArticle = async (article_id, topic) => {
    return axios.delete(`${path}/api/articles/${article_id}`)
        .then(() => {
            return getSortedArticles({topic, limit: 1});
        })
        .then((articles) => {
            if (articles.length === 0) {
                axios.delete(`${path}/api/topics/${topic}`)
                return 'Topic deleted';
            };
        })
        .catch(err => {return null})
}

export const deleteComment = async (comment_id) => {
    return axios.delete(`${path}/api/comments/${comment_id}`)
        .catch(err => {return null})
}