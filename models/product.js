const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Product must have name'],
    maxLength: 50
  },
  price: {
    type: Number,
    required: [true, 'Product must have price'],
    min: 1,
    max: 9999
  },
  description: {
    type: String,
    required: [true, 'Product must have description'],
    maxLength: 500
  },
  category: {
    type: String,
    enum: ['shoe', 'sock', 'bag', 'glasses']
  },
  images: {
    type: [String],
  }
});

module.exports = mongoose.model('Product', productSchema);