const { connectDB, closeDB } = require('../helper');
const Product = require('../models/product');
connectDB();

async function seedProducts(count) {
  deleteProducts();

  const colors = ['dark', 'white', 'green', 'yellow', 'red', 'orange', 'blue', 'brown'];
  const categories = ['shoe', 'sock', 'bag', 'glasses'];
  const description = 'Hello this come from seedProducts function bro!'


  for (let i = 0; i < count; i++) {
    const randColor = colors[Math.floor(Math.random() * colors.length)];
    const randCategory = categories[Math.floor(Math.random() * categories.length)];
    const name = randColor + randCategory;
    const price = Math.floor(Math.random() * 9999) + 1;
    const product = new Product({
      name,
      price,
      description,
      category: randCategory,
    });
    await product.save();
  }
  closeDB();
  console.log('seed products successfully');
}

async function deleteProducts() {
  await Product.deleteMany({}, null, () => {
    console.log('deleted all products');
  });
}

deleteProducts();