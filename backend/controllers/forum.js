const db = require('../db');
const fs = require('fs');

exports.createPost = (req, res, next) => {
    const post = JSON.parse(req.body.post);
    console.log(post);
    console.log(req);
    const texte = post.texte;
    const date = post.date;
    const like = post.like;
    const commentaire = post.commentaire;
    const userName = post.userName;
    const userId = post.userId;
    const postId = post.postId;
    const likeStatus = post.likeStatus;
    console.log(postId);
    console.log(userId);
    const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    db.query('INSERT INTO forum (texte, postId, imageUrl, date, nbrLikes, nbrCommentaires, userName, userId, likeStatus) VALUES (?,?,?,?,?,?,?,?,?)',
        [texte, postId, imageUrl, date, 0, 0, userName, userId, likeStatus],
        (error, data, field) => {
            if (error) {
                console.log(error);
                const image = imageUrl.split('/images/')
                fs.unlink(`${image}`, () => {
                    console.log('Suppression OK')
                });
                res.status(400).json({ message: error });
            }
            else {
                res.status(201).json({ message: 'Le post a bien été enregistré dans la bdd !' });
            }
        })
}

exports.getAllPosts = (req, res, next) => {
    db.query('SELECT * FROM forum ORDER BY date DESC', (error, data, field) => {
        if (error) {
            console.log(error);
            res.status(400).json({ message: error });
        }
        else {
            console.log(data)
            res.status(200).json(data);
        }
    });
}

exports.getOnePost = (req, res, next) => {
    db.query(`SELECT * FROM forum  WHERE postId = ?`, [req.params.id], (error, data, field) => {
        if (error) {
            console.log(error);
            res.status(400).json({ message: error });
        }
        else {
            console.log(data)
            res.status(200).json(data);
        }
    });
}

exports.updateOnePost = (req, res, next) => {
    const post = JSON.parse(req.body.post);
    const likeStatus = post.likeStatus;
    const postId = post.postId;
    const nbrLikes = post.nbrLikes;
    db.query('UPDATE forum SET nbrLikes = ?, likeStatus = ? WHERE postId = ?', [nbrLikes, likeStatus, postId], (err, data, field) => {
        if (err) {
            console.log(err)
            res.status(400).json({ message: err })
        }
        else {
            console.log(data);
            res.status(200).json({ message: 'le post a bien été modifié !' })
        }
    })
}

exports.getUsers = (req, res, next) => {
    console.log(req.params);
    db.query('SELECT * FROM user WHERE userId = ?', [req.params.id], (error, data, field) => {
        if (error) {
            console.log(error);
            res.status(400).json({ message: error });
        }
        else {
            res.status(200).json(data);
        }
    });
}
exports.editUser = (req, res, next) => {
    const user = JSON.parse(req.body.userEdit);
    let image;
    db.query('SELECT imageUrl FROM user WHERE userId = ?', [req.params.id], (err, data, field) => {
        if (err) {
            console.log(err);
            res.status(400).json({ err })
        }
        else if (req.file) {
            const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
            image = imageUrl;
            const imageDelete = data[0].imageUrl.split('/images')[1];
            fs.unlink(`images/${imageDelete}`, () => {
                console.log('Image supprimé avec succès')
            });
        }
        else {
            image = data[0].imageUrl;
        }
        db.query('UPDATE user SET lastName = ?, firstName = ?, adresse = ?, code_postale = ?, telephone = ?, date_de_naissance = ?, imageUrl = ? WHERE userId = ?',
            [user.lastName, user.firstName, user.adresse, user.cp, user.telephone, user.date_de_naissance, image, req.params.id],
            (err, data, field) => {
                if (err) {
                    console.log(err);
                    res.status(400).json({ err })
                }
                else {
                    console.log('Tout est OK' + data);
                    res.status(200).json({ message: 'Modification de l\'user Ok' })
                }
            });
    });
}

exports.getInfoUser = (req, res, next) => {
    db.query('SELECT firstName, lastName, code_postale, adresse, date_de_naissance, telephone, imageUrl from user WHERE userId = ?'
        , [req.params.id], (err, data, field) => {
            if (err) {
                console.log(err)
                res.status(400).json({ err })
            }
            else {
                res.status(200).json(data);
            }
        })
}

exports.postOneComment = (req, res, next) => {
    const post = JSON.parse(req.body.comment);
    const comment = post.commentaire;
    const date = post.date;
    const user = JSON.parse(req.body.user);
    const imageUrl = user.imageUrl;
    const userName = user.firstName;
    const userId = user.userId;
    console.log(user);
    db.query('INSERT INTO commentaires (commentaire, userId, imageUrl, userName, commentDate, postId) VALUES (?,?,?,?,?,?)',
        [comment, userId, imageUrl, userName, date, req.params.id],
        (err, data, field) => {
            if (err) {
                console.log(err)
                res.status(400).json({ err })
            }
            else {
                res.status(201).json({ message: 'Le commentaire a bien été posté !' });
            }
        });
}

exports.getCommentsOnePost = (req, res, next) => {
    db.query('SELECT commentaire, imageUrl, userName, userId, commentDate FROM commentaires WHERE postId = ? ORDER BY commentDate DESC', [req.params.id],
        (err, data, field) => {
            if (err) {
                console.log(err)
                res.status(400).json({ err })
            }
            else {
                db.query('UPDATE forum SET forum.nbrCommentaires = ? WHERE forum.postId = ?', [data.length, req.params.id], (err, data, field) => {
                    if (err) {
                        console.log(err)
                        res.status(500).json({ err })
                    }
                })
                console.log(data.length)
                res.status(200).json(data);
            }
        });
}
exports.postLikes = (req, res, next) => {
    console.log(req);
    const post = JSON.parse(req.body.post);
    const userId = post.userId;
    const postId = post.postId;
    db.query('INSERT INTO likes (userId_like, post_id) VALUES (?,?)', [userId, postId], (err, data, field) => {
        if (err) {
            console.log(err);
            res.status(400).json({ message: err });

        }
        else {
            db.query
            res.status(200).json({ message: 'Les likes ont bien été mis à jour !' })
        }
    });
}
exports.getlikes = (req, res, next) => {
    db.query('SELECT * FROM likes', (error, data, field) => {
        if (error) {
            console.log(error);
            res.status(400).json({ message: error });
        }
        else {
            console.log(data.length);
            res.status(200).json(data);
        }
    });
}
exports.deleteUserIdLikes = (req, res, next) => {
    console.log(req);
    const post = req.body.post;
    const userId = post.userId;
    const postId = post.postId;
    db.query('DELETE FROM likes WHERE userId_Like = ? AND post_id = ?', [userId, postId],
        (err, data, field) => {
            if (err) {
                console.log(err);
                res.status(400).json({ message: err })
            }
            else {
                res.status(200).json({ message: 'Suppresion de l\'userId like avec succès' });
            }
        });
}

exports.modifyOnePost = (req, res, next) => {

}

exports.deleteOnePost = (req, res, next) => {

}