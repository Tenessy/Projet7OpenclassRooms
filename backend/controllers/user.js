const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

exports.registerUser = (req, res) => {
    const email = req.body.email;
    db.query('SELECT email FROM user WHERE email = ?', [email], (error, data) => {
        if (error) {
            return res.status(500).json({ message: error.message })
        }
        if (data.length > 0) {
            return res.status(400).json({ message: 'L\'addresse email existe déjà dans la bdd !' })
        }
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                db.query('INSERT INTO user (firstName, lastName, email, password) VALUES (?,?,?,?)',
                    [req.body.firstName, req.body.lastName, req.body.email, hash],
                    (error) => {
                        if (error) {
                            console.log(error);
                            return res.status(400).json({ message: error.message });
                        }
                        res.status(201).json({ message: 'L\'utilisateur a bien été enregistré dans la bdd !' });
                    }
                );
            })
            .catch(error => res.status(500).json({ message: error.message }));
    });
}

exports.loginUser = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    db.query('SELECT id, password, firstName, lastName, userImageUrl FROM user WHERE email = ?', [email], (error, data) => {
        if (error) {
            return res.status(400).json({ message: error.message });
        }
        const user = data[0];
        bcrypt.compare(password, user.password)
            .then(valid => {
                if (!valid) {
                    return res.status(401).json({ message: 'Le mot de passe saisie ne correspond pas' });
                }
                const token = jwt.sign(
                    { ...user },
                    '123321190289023',
                    { expiresIn: '24h' }
                );
                console.log(user);
                res.status(200).json({ access_token: token })
            })
            .catch(error => res.status(500).json({ message: error.message }))
    });
}

exports.getUsers = (req, res) => {
    console.log(req.params);
    db.query('SELECT id, firstName, email, lastName, code_postale, adresse, date_de_naissance, telephone, userImageUrl FROM user WHERE id = ?', [req.params.id], (error, data) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }
        console.log(data)
        res.status(200).json(data);
    });
}
exports.editUser = (req, res) => {
    db.query('SELECT userImageUrl FROM user WHERE id = ?', [req.params.id], (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: err.message })
        }
        const user = JSON.parse(req.body.userEdit);
        const lastName = user.lastName ? user.lastName : null;
        const firstName = user.firstName ? user.firstName : null;
        const adresse = user.adresse ? user.adresse : null;
        const cp = user.cp ? user.cp : null;
        const telephone = user.telephone ? user.telephone : null;
        const date_de_naissance = user.date_de_naissance ? user.date_de_naissance : null;
        const currentImageUrl = data[0].userImageUrl;
        const updateImageUrl = req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : currentImageUrl;
        if (req.file && currentImageUrl !== null) {
            const imageDelete = currentImageUrl.split('/images/')[1];
            fs.unlink(`images/${imageDelete}`, (err) => {
                if (err) {
                    throw err;
                }
                console.log('Image supprimé avec succès')
            });
        }
        db.query('UPDATE user SET lastName = ?, firstName = ?, adresse = ?, code_postale = ?, telephone = ?, date_de_naissance = ?, userImageUrl = ? WHERE id = ?',
            [lastName, firstName, adresse, cp, telephone, date_de_naissance, updateImageUrl, req.params.id],
            (err) => {
                if (err) {
                    console.log(err);
                    return res.status(400).json({ message: err.message })
                }
                console.log('Tout est OK');
                res.status(200).json({ message: 'Modification de l\'user Ok' })
            });
    });
}
exports.getInfoUser = (req, res) => {
    db.query('SELECT id, firstName, lastName, code_postale, adresse, date_de_naissance, telephone, userImageUrl FROM user WHERE id = ?'
        , [req.params.id], (err, data) => {
            if (err) {
                console.log(err)
                return res.status(500).json({ message: err.message })
            }
            console.log(data);
            res.status(200).json(data);
        });
}

exports.deleteUser = (req, res) => {
    db.query('SELECT userImageUrl FROM user WHERE id = ?', [req.params.id], (err, data) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        console.log(req);
        db.query('DELETE FROM user WHERE user.id = ?', [req.params.id],
            (err) => {
                if (err) {
                    console.log(err);
                    return res.status(400).json({ message: err.message })
                }
                const imageUrl = data[0].userImageUrl;
                if (imageUrl !== null) {
                    const image = imageUrl.split('/images/')[1];
                    fs.unlink(`images/${image}`, (err) => {
                        if (err) {
                            throw err;
                        }
                        console.log('Suppression OK');
                    });
                }
                res.status(200).json({ message: 'Votre compte a été supprimer avec succès !' })
            });

    });
}