const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('myImage');

// Check file type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  
  // check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  // check mime
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb('Error: Images only');
  }

}

// Init app
const app = express();
const PORT = process.env.PORT || 3000; 

// EJS
app.set('view engine', 'ejs');

// Public Folder
app.use(express.static('./public'));

app.get('/', (req, res) => {
  res.render('index', {msg: undefined, file: undefined});  
});

app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.render('index', { msg: err, file: undefined})
    } else {
      if (req.file === undefined) {
        res.render('index', {
          msg: 'Error: No File Selected!', file: undefined
        });
      } else {
        res.render('index', { msg: 'File Uploaded!', file: `./uploads/${req.file.filename}`})
      }
    }
  });
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));