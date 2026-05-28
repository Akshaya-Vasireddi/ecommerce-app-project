const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc   Get user cart
// @route  GET /api/cart
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch cart', error: error.message });
  }
};

// @desc   Add item to cart
// @route  POST /api/cart/add
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    const populated = await Cart.findById(cart._id).populate('items.product');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add to cart', error: error.message });
  }
};

// @desc   Update cart item quantity
// @route  PUT /api/cart/update/:productId
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find((item) => item.product.toString() === productId);
    if (!item) {
      return res.status(404).json({ message: 'Item not in cart' });
    }

    item.quantity = quantity;
    await cart.save();

    const populated = await Cart.findById(cart._id).populate('items.product');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update cart', error: error.message });
  }
};

// @desc   Remove item from cart
// @route  DELETE /api/cart/remove/:productId
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    await cart.save();

    const populated = await Cart.findById(cart._id).populate('items.product');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove from cart', error: error.message });
  }
};

// @desc   Clear cart
// @route  DELETE /api/cart/clear
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to clear cart', error: error.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
