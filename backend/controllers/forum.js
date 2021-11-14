const db = require('../db');
const fs = require('fs');

exports.createPost = (req, res) => {
    const post = JSON.parse(req.body.post);
    console.log(post);
    const texte = post.texte;
    const date = post.date;
    const like = post.nbrLikes;
    const commentaire = post.nbrCommentaires;
    const postId = post.postId;
    const likeStatus = post.likeStatus;
    const postCreateBy = post.createBy;
    const userName = postCreateBy.lastName;
    const userId = postCreateBy.userId;
    const userImageUrl = postCreateBy.imageUrl;
    const imageUrl = req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null;
    db.query('INSERT INTO forum (texte, postId, imageUrl, date, nbrLikes, nbrCommentaires, userName, userId, userImageUrl, likeStatus) VALUES (?,?,?,?,?,?,?,?,?,?)',
        [texte, postId, imageUrl, date, like, commentaire, userName, userId, userImageUrl, likeStatus],
        (err) => {
            if (err) {
                console.log(err);
                return res.status(400).json({ message: err.message });
            }
            if (req.file && imageUrl !== null) {
                const image = imageUrl.split('/images/')
                fs.unlink(`${image}`, () => {
                    console.log('Suppression OK')
                });
            }
            res.status(201).json({ message: 'Le post a bien été enregistré dans la bdd !' });
        });
}
exports.getAllPosts = (req, res) => {
    db.query('SELECT * FROM forum INNER JOIN user ON forum.userId = user.userId ORDER BY date DESC', (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json(data);
    });
}
exports.getOnePost = (req, res) => {
    db.query(`SELECT * FROM forum INNER JOIN user ON forum.userId = user.userId WHERE postId = ?`, [req.params.id], (err, data, field) => {
        if (err) {
            console.log(error);
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json(data);
    });
}

exports.updateOnePost = (req, res) => {
    const post = JSON.parse(req.body.post);
    const likeStatus = post.likeStatus;
    const postId = post.postId;
    const nbrLikes = post.nbrLikes;
    db.query('UPDATE forum SET nbrLikes = ?, likeStatus = ? WHERE postId = ?', [nbrLikes, likeStatus, postId], (err) => {
        if (err) {
            console.log(err)
            return res.status(400).json({ message: err.message })
        }
        res.status(200).json({ message: 'le post a bien été modifié !' })
    });
}
exports.postOneComment = (req, res) => {
    const comment = JSON.parse(req.body.comment);
    const commentaire = comment.commentaire;
    const date = comment.date;
    const commentId = comment.comment_id;
    const user = JSON.parse(req.body.user);
    const imageUrl = user.imageUrl;
    const userName = user.firstName;
    const userId = user.userId;
    console.log(user);
    console.log(imageUrl);
    db.query('INSERT INTO commentaires (commentaire, userId, imageUrl, userName, commentDate, comment_id, postId) VALUES (?,?,?,?,?,?,?)',
        [commentaire, userId, imageUrl, userName, date, commentId, req.params.id],
        (err) => {
            if (err) {
                console.log(err)
                return res.status(400).json({ message: err.message })
            }
            res.status(201).json({ message: 'Le commentaire a bien été posté !' });
        });
}

exports.getCommentsOnePost = (req, res) => {
    db.query('SELECT * FROM commentaires INNER JOIN user ON commentaires.userId = user.userId WHERE postId = ? ORDER BY commentDate DESC', [req.params.id],
        (err, data) => {
            if (err) {
                console.log(err)
                return res.status(500).json({ message: err.message })
            }
            db.query('UPDATE forum SET forum.nbrCommentaires = ? WHERE forum.postId = ?', [data.length, req.params.id], (err) => {
                if (err) {
                    console.log(err)
                    return res.status(400).json({ message: err.message })
                }
            })
            res.status(200).json(data);

        });
}
exports.postLikes = (req, res) => {
    console.log(req);
    const post = JSON.parse(req.body.post);
    const userId = post.userIdLike;
    const postId = post.postId;
    db.query('INSERT INTO likes (userId_like, post_id) VALUES (?,?)', [userId, postId], (err, data, field) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ message: err.message });
        }
        res.status(200).json({ message: 'Les likes ont bien été mis à jour !' })
    });
}
exports.getlikes = (req, res) => {
    db.query('SELECT * FROM likes', (error, data, field) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: error });
        }
        res.status(200).json(data);
    });
}
exports.deleteUserIdLikes = (req, res) => {
    console.log(req);
    const post = req.body.post;
    const userId = post.userIdLike;
    const postId = post.postId;
    db.query('DELETE FROM likes WHERE userId_Like = ? AND post_id = ?', [userId, postId],
        (err) => {
            if (err) {
                console.log(err);
                return res.status(400).json({ message: err.message })
            }
            res.status(200).json({ message: 'Suppresion de l\'userId like avec succès' });
        });
}
exports.deleteOneComment = (req, res) => {
    const comment = JSON.parse(req.body.comment);
    const commentId = comment.comment_id;
    db.query('DELETE FROM commentaires WHERE postId = ? AND comment_id = ?', [req.params.id, commentId], (err) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ message: err.message })
        }
        res.status(200).json({ message: 'Suppresion du commentaire avec succès' });
    });
}
exports.modifyOnePost = (req, res, next) => {

}

exports.deleteOnePost = (req, res, next) => {
    db.query('DELETE forum, commentaires FROM forum INNER JOIN commentaires ON forum.postId = commentaires.postId WHERE postId = ?'[req.params.id])
}