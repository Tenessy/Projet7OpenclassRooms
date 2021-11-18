const db = require('../db');
const fs = require('fs');

exports.createPost = (req, res) => {
    const post = JSON.parse(req.body.post);
    const texte = post.texte;
    const date = post.date;
    const postCreateBy = post.createBy;
    const userId = postCreateBy.id;
    const imageUrl = req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null;
    db.query('INSERT INTO post (texte, imageUrl, date, user_id) VALUES (?,?,?,?)',
        [texte, imageUrl, date, userId],
        (err) => {
            if (err) {
                console.log(err);
                if (req.file && imageUrl !== null) {
                    const image = imageUrl.split('/images/')[1];
                    fs.unlink(`images/${image}`, (err) => {
                        if (err) {
                            throw err;
                        }
                        console.log('Suppression OK')
                    });
                }
                return res.status(400).json({ message: err.message });
            }
            res.status(201).json({ message: 'Le post a bien été enregistré dans la bdd !' });
        });
}
exports.getAllPosts = (req, res) => {
    db.query('SELECT post.id, user_id, texte, imageUrl, date, lastName, firstName, userImageUrl FROM post INNER JOIN user ON post.user_id = user.id ORDER BY date DESC', (err, data) => {
        if (err) {
            console.log(err);
            console.log('erreur');
            return res.status(500).json({ message: err.message });
        }
        console.log('ok');
        res.status(200).json(data);
    });
}
exports.deletePost = (req, res) => {
    const post_id = req.body.post_id;
    db.query('SELECT imageUrl FROM post WHERE post.id = ?', [post_id], (err, data) => {
        if (err) {
            return res.status(500).json({ message: err.message })
        }
        db.query('DELETE FROM post WHERE post.id = ?', [post_id],
            (err) => {
                if (err) {
                    return res.status(400).json({ message: err.message });
                }
                const imageUrl = data[0].imageUrl;
                if (imageUrl !== null) {
                    const image = imageUrl.split('/images/')[1];
                    fs.unlink(`images/${image}`, (err) => {
                        if (err) {
                            throw err;
                        }
                        console.log('Suppression OK');
                    });
                }
                res.status(200).json({ message: 'Le post a bien été supprimé !' });
            });
    });
}
exports.getOnePost = (req, res) => {
    db.query(`SELECT post.id, user_id, texte, imageUrl, date, lastName, firstName, userImageUrl FROM post INNER JOIN user ON post.user_id = user.id WHERE post.id = ?`, [req.params.id], (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json(data);
    });
}
exports.getAllComments = (req, res) => {
    db.query('SELECT user_id, post_id FROM commentaires', (err, data) => {
        if (err) {
            console.log(err);
            console.log('erreur');
            return res.status(500).json({ message: err.message });
        }
        console.log('ok');
        res.status(200).json(data);
    });
}
exports.postOneComment = (req, res) => {
    const comment = JSON.parse(req.body.comment);
    const commentaire = comment.commentaire;
    const date = comment.date;
    const user = JSON.parse(req.body.user);
    const userId = user.id;
    console.log(user);
    db.query('INSERT INTO commentaires (commentaire, user_id, date, post_id) VALUES (?,?,?,?)',
        [commentaire, userId, date, req.params.id],
        (err) => {
            if (err) {
                console.log(err)
                return res.status(400).json({ message: err.message })
            }
            res.status(201).json({ message: 'Le commentaire a bien été posté !' });
        });
}

exports.getCommentsOnePost = (req, res) => {
    db.query('SELECT commentaires.id, commentaire, user_id, date, lastName, firstName, userImageUrl FROM commentaires INNER JOIN user ON commentaires.user_id = user.id WHERE post_id = ? ORDER BY date DESC', [req.params.id],
        (err, data) => {
            if (err) {
                console.log(err)
                return res.status(500).json({ message: err.message })
            }
            res.status(200).json(data);
        });
}
exports.postLikes = (req, res) => {
    const postId = req.body.post_id;
    const userId = req.body.user_id;
    db.query('INSERT INTO likes (user_id, post_id) VALUES (?,?)', [userId, postId], (err, data) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ message: err.message });
        }
        res.status(200).json({ message: 'Les likes ont bien été mis à jour !' })
    });
}
exports.getlikes = (req, res) => {
    db.query('SELECT * FROM post INNER JOIN likes ON post.id = likes.post_id', (error, data) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: error });
        }
        console.log(data);
        res.status(200).json(data);
    });
}
exports.deleteUserIdLikes = (req, res) => {
    console.log(req.body);
    const userId = req.body.user_id;
    const postId = req.body.post_id;
    db.query('DELETE FROM likes WHERE user_id = ? AND post_id = ?', [userId, postId],
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
    const commentId = comment.id;
    console.log(commentId);
    db.query('DELETE FROM commentaires WHERE post_id = ? AND id = ?', [req.params.id, commentId], (err) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ message: err.message })
        }
        res.status(200).json({ message: 'Suppresion du commentaire avec succès' });
    });
}
exports.modifyOnePost = (req, res, next) => {

}
