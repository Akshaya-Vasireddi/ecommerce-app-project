const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: 0,
      default: 0,
    },
    image: {
      type: String,
      default: 'https://via.placeholder.com/400x300?text=Product+Image',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
