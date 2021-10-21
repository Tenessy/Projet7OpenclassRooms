const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const extension = MIME_TYPES[file.mimetype];
    console.log(file);
    callback(null, file.fieldname + '_' + Date.now() + '.' + extension);
  }
});

module.exports = multer({ storage: storage, limits: { fieldSize: 10 * 1024 * 1024 } }).single('image');