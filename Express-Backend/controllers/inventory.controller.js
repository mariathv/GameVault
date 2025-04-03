const Order = require('../models/order');

// Get all inventory (no user filter) - useful for testing
exports.getAllInventory = async (req, res) => {
  try {
    // Find all orders
    const orders = await Order.find().sort({ createdAt: -1 }).limit(20);
    
    console.log(`getAllInventory: Found ${orders.length} orders`);
    
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
    
    // Send the response in the format expected by Inventory.jsx
    res.status(200).json({
      success: true,
      inventory: formattedOrders
    });
    
  } catch (err) {
    console.error('Error in getAllInventory:', err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Get all purchases for a specific user
exports.getUserInventory = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Enhanced logging
    console.log(`Fetching inventory for user ID: ${userId}`);
    
    if (!userId) {
      console.error('getUserInventory: Missing userId parameter');
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }
    
    // Verify the requesting user can only access their own inventory
    // Uncomment once authentication is properly set up
    /*
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to access this user\'s inventory'
      });
    }
    */
    
    // Find all orders that belong to this user
    console.log(`Executing Order.find with user: ${userId}`);
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 });
    
    console.log(`Found ${orders.length} orders for user ${userId}`);
    
    // Add additional debugging
    if (orders.length === 0) {
      console.log('No orders found for this user');
    } else {
      const sampleOrder = orders[0];
      console.log('Sample order data structure:', JSON.stringify({
        id: sampleOrder._id,
        hasUser: !!sampleOrder.user,
        hasGames: !!sampleOrder.games,
        gamesCount: sampleOrder.games?.length || 0,
        hasPaymentInfo: !!sampleOrder.paymentInfo
      }));
    }
    
    // Format the response to match what the frontend expects
    const formattedOrders = orders.map(order => {
      const formattedOrder = {
        orderId: order._id,
        transactionId: order.paymentInfo?.transactionId || '',
        purchaseDate: order.createdAt,
        totalAmount: order.totalAmount || 0,
        status: order.status,
        games: []
      };
      
      // Ensure games array exists before mapping
      if (order.games && Array.isArray(order.games)) {
        formattedOrder.games = order.games.map(game => ({
          gameId: game.gameId,
          title: game.title,
          cover_url: game.cover_url,
          price: game.price,
          quantity: game.quantity,
          genre: game.genre,
          releaseDate: game.releaseDate,
          gameKeys: game.gameKeys
        }));
      } else {
        console.warn(`Order ${order._id} has invalid games property:`, order.games);
      }
      
      return formattedOrder;
    });
    
    // Send the response in the format expected by Inventory.jsx
    res.status(200).json({
      success: true,
      inventory: formattedOrders
    });
    
  } catch (err) {
    console.error('Error in getUserInventory:', err);
    res.status(500).json({
      success: false,
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

// Get detailed information about a specific order
exports.getOrderDetails = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    
    console.log(`Getting details for order ID: ${orderId}`);
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      console.log(`Order ${orderId} not found`);
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Verify the requesting user can only access their own orders
    // Uncomment once authentication is properly set up
    /*
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to access this order'
      });
    }
    */
    
    // Format the response to match what the frontend expects
    const formattedOrder = {
      orderId: order._id,
      transactionId: order.paymentInfo?.transactionId || '',
      purchaseDate: order.createdAt,
      totalAmount: order.totalAmount || 0,
      status: order.status,
      games: []
    };
    
    // Ensure games array exists before mapping
    if (order.games && Array.isArray(order.games)) {
      formattedOrder.games = order.games.map(game => ({
        gameId: game.gameId,
        title: game.title,
        cover_url: game.cover_url,
        price: game.price,
        quantity: game.quantity,
        genre: game.genre,
        releaseDate: game.releaseDate,
        gameKeys: game.gameKeys
      }));
    } else {
      console.warn(`Order ${order._id} has invalid games property:`, order.games);
    }
    
    res.status(200).json({
      success: true,
      order: formattedOrder
    });
    
  } catch (err) {
    console.error('Error in getOrderDetails:', err);
    res.status(500).json({
      success: false,
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

// Debug endpoint for direct inspection of orders
exports.debugUserInventory = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    console.log(`DEBUG: Inspecting raw orders for user ID: ${userId}`);
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }
    
    // Get raw orders
    const rawOrders = await Order.find({ user: userId }).lean();
    
    // Get order count for this user with explicit query
    const orderCount = await Order.countDocuments({ user: userId });
    
    // Check if user ID even exists
    const users = await Order.distinct('user');
    const userExists = users.includes(userId);
    
    return res.status(200).json({
      success: true,
      debug: {
        queryUserId: userId,
        userFound: userExists,
        userIdType: typeof userId,
        orderCountByQuery: orderCount,
        ordersFound: rawOrders.length,
        allUserIds: users.slice(0, 10) // Show first 10 user IDs for comparison
      },
      rawOrders: rawOrders
    });
    
  } catch (err) {
    console.error('Error in debugUserInventory:', err);
    res.status(500).json({
      success: false,
      message: err.message,
      stack: err.stack
    });
  }
};