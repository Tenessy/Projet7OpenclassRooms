const db = require('../db');
const fs = require('fs');

exports.createPost = (req, res, next) => {
    const post = JSON.parse(req.body.post);
    console.log(post);
    const texte = post.texte;
    const date = post.date;
    const like = post.like;
    const commentaire = post.commentaire;
    const userName = post.userName;
    const userId = post.userId;
    const postId = post.id;
    console.log(postId);
    console.log(userId);
    const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    db.query('INSERT INTO forum (sujet, postId, imageUrl, date, liked, commentaires, userName, userId) VALUES (?,?,?,?,?,?,?,?)',
        [texte, postId, imageUrl, date, like, commentaire, userName, userId],
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
    db.query('SELECT * FROM forum', (error, data, field) => {
        if (error) {
            console.log(error);
            res.status(400).json({ message: error });
        }
        else {
            res.status(200).json(data);
        }
    });
}

exports.getOnePost = (req, res, next) => {
    db.query(`SELECT * from forum  WHERE postId = ?`, [req.params.id], (error, data, field) => {
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
exports.modifyOnePost = (req, res, next) => {

}

exports.deleteOnePost = (req, res, next) => {

}