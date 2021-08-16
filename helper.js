const mongoose = require('mongoose');

module.exports = {
  // for connect database
  connectDB: () => {
    mongoose.connect('mongodb://localhost:27017/productApp', { useNewUrlParser: true, useUnifiedTopology: true })
      .then(_ => {
        console.log('db connected');
      })
      .catch(err => {
        throw err
      });
  },
  // for close database
  closeDB: () => {
    mongoose.disconnect();
  }
}
