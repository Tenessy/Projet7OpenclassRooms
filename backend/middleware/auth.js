const { json } = require('body-parser');
const jwt = require('jsonwebtoken');
const db = require('../db');

module.exports = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Veuillez vous authentifiez !' })
    }
    try {
        const decoded = jwt.verify(token, '123321190289023');
        const userId = decoded.user_id;
        db.query('SELECT id from user WHERE id = ?', [userId], (err, data, field) => {
            if (err) {
                return console.log(err)
            }
            else if (data[0].id !== userId) {
                throw 'l\'userId est non valable !'
            }
            else {
                next();
            }
        });

    } catch (error) {
        return res.status(403).json({ message: error | 'Requête non authentifié !' })
    }
}



