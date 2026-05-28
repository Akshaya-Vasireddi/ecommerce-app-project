const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc   Checkout - create order from cart
// @route  POST /api/orders/checkout
const checkout = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Validate stock for all items
    for (const item of cart.items) {
      if (!item.product) {
        return res.status(400).json({ message: 'A product in your cart no longer exists' });
      }
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for "${item.product.name}"`,
        });
      }
    }

    // Build order items and calculate total
    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image,
    }));

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Deduct stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress: req.body.shippingAddress || 'Default Address',
    });

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Checkout failed', error: error.message });
  }
};

// @desc   Get user orders
// @route  GET /api/orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name image')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};

// @desc   Get single order
// @route  GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ensure user owns this order or is admin
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch order', error: error.message });
  }
};

// @desc   Get all orders (Admin)
// @route  GET /api/orders/admin/all
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .populate('items.product', 'name')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};

module.exports = { checkout, getOrders, getOrderById, getAllOrders };
