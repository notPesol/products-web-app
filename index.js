const express = require('express');
const app = express();
const path = require('path');
const port = 5000;
// for move file
const mv = require('mv');
// for handle file input
const formidable = require('formidable');
const { connectDB } = require('./helper');
const Product = require('./models/product');
const { mkdir, rmSync } = require('fs');
const methodOverride = require('method-override');

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/upload')));
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));

// GET / Show all products
// GET /new Show page create a product
// POST / Make a new product
// GET /:id Show single product
// DELETE /:id Delete the product
// PUT /:id Update the product

app.get('/', async (req, res) => {
  const products = await Product.find({});
  res.render('index', { products, title: 'Products' });
});

app.get('/new', (req, res) => {
  const categories = ['shoe', 'sock', 'bag', 'glasses'];
  res.render('new', { title: 'Add new product', categories });
});

app.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render('detail', { product, title: product.name });
  } catch (error) {
    next(error);
  }
});

app.post('/', async (req, res, next) => {
  const form = formidable({ multiples: true, maxFileSize: 1 * 1024 * 1024 });
  form.parse(req, async (err, fields, files) => {
    if (err) next(err);

    const folderName = 'upload/';
    const product = new Product({ ...fields, images: [] });
    images = files.images;
    if (images) {
      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const oldPath = images[i].path;
          const filename = images[i].name;
          const randId = (Math.random() * 100000).toString(10);
          const newName = randId + filename;
          const newPath = folderName + newName;

          mkdir(folderName, { recursive: true }, (err) => {
            if (err) next(err);
          });

          mv(oldPath, path.join(__dirname, newPath), (err) => {
            if (err) next(err);
          });

          product.images.push(newName);
        }
      } else {
        const oldPath = images.path;
        const filename = images.name;
        const randId = (Math.random() * 100000).toString(10);
        const newName = randId + filename;
        const newPath = folderName + newName;

        mkdir(folderName, { recursive: true }, (err) => {
          if (err) next(err);
        });

        mv(oldPath, path.join(__dirname, newPath), (err) => {
          if (err) next(err);
        });

        product.images.push(newName);
      }
    }

    await product.save();
    console.log(product);
    res.redirect('/');
  });
});

app.delete('/:id', async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    for (let i = 0; i < product.images.length; i++) {
      rmSync(__dirname + '/upload/' + product.images[i])
    }
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});


// handler error
app.use((err, req, res, next) => {
  res.send(err);
});

app.listen(port, () => {
  console.log(`App running on port:`, port);
});