const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

exports.registerUser = (req, res, next) => {
    const email = req.body.email;
    db.query('SELECT email FROM user WHERE email = ?', [email], (error, data, field) => {
        if (data.length > 0) {
            return res.status(400).json({ message: 'L\'addresse email existe déjà dans la bdd !' })
        }
        else if (data.length === 0) {
            bcrypt.hash(req.body.password, 10)
                .then(hash => {
                    db.query('INSERT INTO user (firstName, lastName, email, password, userId) VALUES (?,?,?,?,?)',
                        [req.body.firstName, req.body.lastName, req.body.email, hash, req.body.userId],
                        (error, data, field) => {
                            if (error) {
                                console.log(error);
                                res.status(400).json({ message: error });
                            }
                            else {
                                res.status(201).json({ message: 'L\'utilisateur a bien été enregistré dans la bdd !' });
                            }
                        }
                    );
                })
                .catch(error => res.status(500).json({ message: error }));
        }
    });

}

exports.loginUser = (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;
    db.query('SELECT id,password FROM user WHERE email = ?', [email], (error, data, field) => {
        if (error) {
            return console.log(error);
        }
        else {
            bcrypt.compare(password, data[0].password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Le mot de passe saisie ne correspond pas' });
                    }
                    const token = jwt.sign(
                        { user_id: data[0].id },
                        '123321190289023',
                        { expiresIn: '24h' }
                    );
                    db.query('SELECT userId,firstName,lastName,imageUrl FROM user WHERE email = ?', [email], (error, data, field) => {
                        if (error) {
                            console.log(error)
                        }
                        else {
                            console.log(data)
                            res.status(200).json({ access_token: token, data: data })
                        }
                    })
                    //res.status(200).json({ access_token: token })
                })
                .catch(error => res.status(500).json({ message: error }))
        }

    });
}


exports.getUsers = (req, res, next) => {
    console.log(req.params);
    db.query('SELECT firstName, email, userId, lastName, code_postale, adresse, date_de_naissance, telephone, imageUrl FROM user WHERE userId = ?', [req.params.id], (error, data, field) => {
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
            if (data[0].imageUrl !== null) {
                const imageDelete = data[0].imageUrl.split('/images')[1];
                fs.unlink(`images/${imageDelete}`, () => {
                    console.log('Image supprimé avec succès')
                });
            }
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
                    console.log('Tout est OK');
                    res.status(200).json({ message: 'Modification de l\'user Ok' })
                }
            });

    });
}

exports.getInfoUser = (req, res, next) => {
    db.query('SELECT firstName, userId, lastName, code_postale, adresse, date_de_naissance, telephone, imageUrl FROM user WHERE userId = ?'
        , [req.params.id], (err, data, field) => {
            if (err) {
                console.log(err)
                res.status(400).json({ message: err })
            }
            else {
                console.log(data);
                res.status(200).json(data);
            }
        })
}

exports.deleteUser = (req, res, next) => {
    console.log(req.params.id);
    db.query('DELETE FROM user WHERE userId = ?', [req.params.id],
        (err, data, field) => {
            if (err) {
                console.log(err);
                res.status(400).json({ message: err })
            }
            else {
                res.status(200).json({ message: 'Votre compte a été supprimer avec succès !' })
            }
        })
}