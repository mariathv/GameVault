const User = require('../models/users');
const Order = require('../models/order');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Get all users (admin only)
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().select('-password');
  
  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

// Get a single user by ID
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');
  
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  
  res.status(200).json({
    success: true,
    data: user
  });
});

// Get current user
exports.getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

// Update user profile
exports.updateUser = catchAsync(async (req, res, next) => {
  // Don't allow password updates through this route
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates. Please use /updatePassword', 400));
  }
  
  // Filter out fields that shouldn't be updated
  const filteredBody = filterObj(req.body, 'username', 'email');
  
  const updatedUser = await User.findByIdAndUpdate(req.params.id, filteredBody, {
    new: true,
    runValidators: true
  }).select('-password');
  
  if (!updatedUser) {
    return next(new AppError('User not found', 404));
  }
  
  res.status(200).json({
    success: true,
    data: updatedUser
  });
});

// Delete user
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  
  // Also delete all orders associated with this user
  await Order.deleteMany({ user: req.params.id });
  
  res.status(200).json({
    success: true,
    message: 'User deleted successfully'
  });
});

// Get user's purchase history
exports.getUserPurchaseHistory = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.params.id }).sort({ createdAt: -1 });
  
  // Format the response to match what the frontend expects
  const formattedOrders = orders.map(order => ({
    orderId: order._id,
    transactionId: order.paymentInfo?.transactionId || '',
    purchaseDate: order.createdAt,
    totalAmount: order.totalAmount || 0,
    status: order.status,
    games: (order.games || []).map(game => ({
      gameId: game.gameId,
      title: game.title,
      cover_url: game.cover_url,
      price: game.price,
      quantity: game.quantity,
      genre: game.genre,
      releaseDate: game.releaseDate,
      gameKeys: game.gameKeys
    }))
  }));
  
  res.status(200).json({
    success: true,
    inventory: formattedOrders
  });
});

// Helper function to filter object
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};