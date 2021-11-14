const { json } = require('body-parser');
const jwt = require('jsonwebtoken');
const db = require('../db');

module.exports = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    console.log(token);
    if (!token) {
        return res.status(401).json({ message: 'Veuillez vous authentifiez !' })
    }
    try {
        const decoded = jwt.verify(token, '123321190289023');
        const decodedUserId = decoded.user.userId;
        db.query('SELECT userId from user WHERE userId = ?', [decodedUserId], (err, data, field) => {
            if (err) {
                return res.status(500).json({ message: error.message })
            }
            else if (data[0].userId !== decodedUserId) {
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



